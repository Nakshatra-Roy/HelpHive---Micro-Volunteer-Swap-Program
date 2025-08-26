import Task from '../models/taskModel.js';
import User from '../models/userModel.js';
import express from 'express';
import jwt from 'jsonwebtoken';
import Review from '../models/reviewModel.js';

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if email and password are provided
    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check account status
    if (user.accountStatus === "inactive") {
      return res.status(403).json({ message: "Account deactivated. Contact support." });
    }

    // Check password (NOTE: In production, use bcrypt.compare)
    if (user.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Create JWT payload
    const payload = { user: { id: user.id } };

    // Sign JWT token
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "2h" },
      (err, token) => {
        if (err) {
          console.error("JWT Sign Error:", err);
          return res
            .status(500)
            .json({ message: "Error generating authentication token" });
        }
        res.status(200).json({ token });
      }
    );
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 }); // Sort by creation date, newest first
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
};

export const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("THE REAL ERROR in getUserById is:", error);
    res.status(500).json({ message: 'Internal server error', error });
  }
}

export const createUser = async (req, res) => {
  const { firstName, lastName, email, password, role, bio, location, skills, following, availability, status, socialLinks } = req.body;
  try {
    // Check if user with this email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }
    
    const newUser = new User({
        firstName,
        lastName,
        email,
        password,
        role,
        bio,
        location,
        skills,
        following,
        availability,
        status,
        socialLinks
    });
    await newUser.save();
    res.status(201).json({ message: 'Note created successfully', User: newUser });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
}
export const updateUser = async (req, res) => {
    const { id } = req.params;
    let {
      firstName,
      lastName,
      email,
      password,
      role,
      profilePicture,
      bio,
      location,
      skills,
      following,
      availability,
      socialLinks,
      contactInfo,
      flag,
      accountStatus
    } = req.body;

    try {
      if (typeof contactInfo === 'string') {
        contactInfo = JSON.parse(contactInfo);
      }
      if (typeof socialLinks === 'string') {
        socialLinks = JSON.parse(socialLinks);
      }

      const updateData = {
        firstName,
        lastName,
        email,
        role,
        profilePicture,
        bio,
        location,
        skills,
        following,
        availability,
        socialLinks,
        contactInfo,
        flag,
        accountStatus
      };

      if (password) {
        updateData.password = password;
      }

      const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true });

      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found!' });
      }

      res.status(200).json({ message: 'User updated successfully', updatedUser });

    } catch (error) {
      console.error('Update error:', error);
      res.status(500).json({ message: 'Internal server error', error });
    }
  };


export const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
}

export const getUserTasks = async (req, res) => {
  try {
    const userId = req.params.userId;

    // --- THIS IS THE FINAL FIX ---
    // The key is to select the fields the virtual property depends on.

    // Find tasks created by the user
    let created = await Task.find({ postedBy: userId })
      .populate('postedBy', 'firstName lastName _id') // Select the fields the virtual depends on
      .populate({ 
          path: 'helpersArray.user', 
          model: 'User', 
          select: 'firstName lastName _id' 
      })
      .sort({ createdAt: -1 });

    let helping = await Task.find({ 'helpersArray.user': userId })
      .populate('postedBy', 'firstName lastName _id')
      .populate({ 
          path: 'helpersArray.user', 
          model: 'User', 
          select: 'firstName lastName _id' 
      })
      .sort({ createdAt: -1 });

    // --- The review logic below is correct and can remain as is ---
    const allTasks = [...created, ...helping];
    const taskIds = allTasks.map(t => t._id);

    const reviewsSubmitted = await Review.find({ task: { $in: taskIds }, reviewer: userId });
    const reviewMap = reviewsSubmitted.reduce((acc, review) => {
      const taskIdStr = review.task.toString();
      if (!acc[taskIdStr]) acc[taskIdStr] = [];
      acc[taskIdStr].push(review.reviewee.toString());
      return acc;
    }, {});

    const finalCreated = created.map(task => {
      const taskObject = task.toJSON();
      return {
        ...taskObject,
        reviewsSubmittedByMe: reviewMap[taskObject._id.toString()] || []
      };
    });

    const finalHelping = helping.map(task => {
      const taskObject = task.toJSON();
      return {
        ...taskObject,
        reviewsSubmittedByMe: reviewMap[taskObject._id.toString()] || []
      };
    });

    console.log(
      "FINAL DATA BEING SENT FROM SERVER:", 
      JSON.stringify({ created: finalCreated, helping: finalHelping }, null, 2)
    );

    res.status(200).json({ created: finalCreated, helping: finalHelping });
     
  } catch (error) {
    console.error("Error fetching user tasks:", error);
    res.status(500).json({ message: 'Error fetching user tasks', error: error.message });
  }
};


export const getUserTrustScore = async (req, res) => {
  try {
    const { userId } = req.params;

    // --- 1. GATHER ALL RAW DATA ---
    
    // Get all reviews where this user was the one being reviewed
    const reviewsReceived = await Review.find({ reviewee: userId }).sort({ createdAt: 'desc' });

    // Get all tasks where this user was a helper
    const tasksAsHelper = await Task.find({ 'helpersArray.user': userId });

    // --- 2. CALCULATE THE COMPONENTS OF THE TRUST SCORE ---

    // a) Task Completion Rate
    const completedTasksCount = tasksAsHelper.filter(t => t.status === 'completed').length;
    const totalTasksCount = tasksAsHelper.length;
    const completionRate = totalTasksCount > 0 ? (completedTasksCount / totalTasksCount) : 1; // Default to 100% if no tasks

    // b) Rating Analysis (Weighted by Recency)
    let totalWeightedScore = 0;
    let totalWeight = 0;
    const allRatingValues = [];
    const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

    for (const review of reviewsReceived) {
      const avgRating = (review.ratings.punctuality + review.ratings.friendliness + review.ratings.quality) / 3;
      const roundedRating = Math.round(avgRating);
      if (ratingDistribution[roundedRating] !== undefined) {
        ratingDistribution[roundedRating]++;
      }
      allRatingValues.push(avgRating);

      // Recency Weighting Logic
      const daysOld = (new Date() - new Date(review.createdAt)) / (1000 * 60 * 60 * 24);
      let weight = 1.0;
      if (daysOld <= 30) weight = 1.5; // Reviews in the last month are 50% more important
      else if (daysOld <= 90) weight = 1.2; // Reviews in the last 3 months are 20% more important

      totalWeightedScore += avgRating * weight;
      totalWeight += weight;
    }

    const weightedAverageRating = totalWeight > 0 ? (totalWeightedScore / totalWeight) : 0;

    // --- 3. CALCULATE THE FINAL TRUST SCORE (out of 100) ---
    // This is a sample algorithm. You can adjust the weights!
    // 50% from Rating, 40% from Completion Rate, 10% from Volume
    const scoreFromRating = (weightedAverageRating / 5) * 50; // Max 50 points
    const scoreFromCompletion = completionRate * 40; // Max 40 points
    const scoreFromVolume = Math.min(10, Math.log10(totalTasksCount + 1) * 10); // Max 10 points, logarithmic scale

    const finalTrustScore = Math.round(scoreFromRating + scoreFromCompletion + scoreFromVolume);

    // --- 4. PREPARE DATA FOR FRONTEND GRAPHS ---
    const responseData = {
      trustScore: finalTrustScore,
      totalReviews: reviewsReceived.length,
      completionRate: completionRate,
      ratingDistribution: ratingDistribution, // For a bar chart
      ratingHistory: reviewsReceived.map(r => ({ // For a line chart
        date: r.createdAt,
        rating: (r.ratings.punctuality + r.ratings.friendliness + r.ratings.quality) / 3
      })).reverse() // Show oldest to newest
    };

    res.status(200).json({ success: true, data: responseData });

  } catch (error) {
    console.error("Error calculating trust score:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};