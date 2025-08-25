// server/controllers/reviewController.js
import Review from '../models/reviewModel.js';
import User from '../models/userModel.js';
import Task from '../models/taskModel.js';
import mongoose from 'mongoose';

export const createReview = async (req, res) => {
  const reviewerId = req.user.id;
  const { taskId, revieweeId, ratings, comment } = req.body;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const task = await Task.findById(taskId).session(session);

    // --- Validation: A series of checks to ensure the review is valid ---
    if (!task) throw new Error('Task not found.');
    if (task.status !== 'completed') throw new Error('You can only review completed tasks.');

    // Check if the reviewer was actually part of the task
    const isTaskCreator = task.postedBy.toString() === reviewerId;
    const isTaskHelper = task.helpersArray.map(helper => helper.user.toString()).includes(reviewerId);
    if (!isTaskCreator && !isTaskHelper) throw new Error('You were not a participant in this task.');
    
    // Check if they've already reviewed this person for this task
    const existingReview = await Review.findOne({ task: taskId, reviewer: reviewerId, reviewee: revieweeId }).session(session);
    if (existingReview) throw new Error('You have already submitted a review for this user on this task.');

    // --- Action 1: Create and save the new review ---
    const newReview = new Review({
      task: taskId,
      reviewer: reviewerId,
      reviewee: revieweeId,
      ratings,
      comment,
    });
    await newReview.save({ session });

    // --- Action 2: Update the reviewee's average rating ---
    const reviewee = await User.findById(revieweeId).session(session);
    if (!reviewee) throw new Error('User to be reviewed not found.');

    const newAverage = 
      ((reviewee.ratingSummary.average * reviewee.ratingSummary.count) + 
      ((ratings.punctuality + ratings.friendliness + ratings.quality) / 3)) / 
      (reviewee.ratingSummary.count + 1);

    reviewee.ratingSummary.count += 1;
    reviewee.ratingSummary.average = newAverage;
    await reviewee.save({ session });

    // If all operations were successful, commit the transaction
    await session.commitTransaction();
    session.endSession();

    res.status(201).json({ success: true, message: 'Review submitted successfully!', data: newReview });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("THE REAL ERROR in createReview is:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getSpecificReview = async (req, res) => {
  try {
    const { taskId, revieweeId } = req.params;
    const reviewerId = req.user.id;

    const review = await Review.findOne({
      task: taskId,
      reviewer: reviewerId,
      reviewee: revieweeId
    }).populate('reviewee', 'firstName lastName fullName _id'); // Populate the name of the person being reviewed

    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found.' });
    }

    res.status(200).json({ success: true, data: review });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Error fetching review.' });
  }
};

export const getAllMyReviewsForTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const reviewerId = req.user.id; // The logged-in user

    // Find all reviews written by the current user for this task
    const reviews = await Review.find({
      task: taskId,
      reviewer: reviewerId,
    })
    .populate('reviewee', 'fullName _id'); // Populate the person being reviewed

    if (!reviews || reviews.length === 0) {
      return res.status(404).json({ success: false, message: 'No reviews found for this task by you.' });
    }

    res.status(200).json({ success: true, data: reviews });
  } catch (error) {
    console.error("Error fetching all reviews for task:", error);
    res.status(400).json({ success: false, message: 'Error fetching reviews.' });
  }
};