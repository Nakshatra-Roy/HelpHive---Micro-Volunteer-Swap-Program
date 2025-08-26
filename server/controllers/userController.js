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