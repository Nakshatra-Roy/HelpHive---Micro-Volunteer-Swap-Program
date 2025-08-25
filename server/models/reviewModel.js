// server/models/reviewModel.js
import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  task: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
    required: true,
  },
  reviewer: { // The user who is WRITING the review
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  reviewee: { // The user who is BEING REVIEWED
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  ratings: {
    punctuality: { type: Number, required: true, min: 1, max: 5 },
    friendliness: { type: Number, required: true, min: 1, max: 5 },
    quality: { type: Number, required: true, min: 1, max: 5 },
  },
  comment: {
    type: String,
    trim: true,
    maxlength: 1000,
  },
}, { timestamps: true });

// Prevent a user from reviewing the same person for the same task twice
reviewSchema.index({ task: 1, reviewer: 1, reviewee: 1 }, { unique: true });

const Review = mongoose.model('Review', reviewSchema);

export default Review;