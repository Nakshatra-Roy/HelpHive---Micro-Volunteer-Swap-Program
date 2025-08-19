import Task from '../models/taskModel.js';
import User from '../models/userModel.js';
import express from 'express';
import jwt from 'jsonwebtoken';

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
    
    if (user.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Create JWT payload
    const payload = { user: { id: user.id } };
    
    // Sign JWT token
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '2h' },
      (err, token) => {
        if (err) {
          console.error('JWT Sign Error:', err);
          return res.status(500).json({ message: "Error generating authentication token" });
        }
        res.status(200).json({ token });
      }
    );
  } catch (error) {
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
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
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
  const { firstName, lastName, email, password, role, profilePicture, bio, location, skills, following, availability, socialLinks, flag, accountStatus } = req.body;
  try {
    // Create update object
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
        flag,
        accountStatus
    };
    
    // If password is provided, use it directly
    if (password) {
      updateData.password = password;
    }
    
    const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true });
    
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found!' });
    }
    res.status(200).json({ message: 'Internal server error', updatedUser });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
}

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

    // Find tasks created by the user
    const created = await Task.find({ postedBy: userId }).sort({ createdAt: -1 });

    // Find tasks where the user is a helper
    // This assumes your Task schema has an array field named 'helpers' that stores user IDs
    const helping = await Task.find({ helpersArray: userId }).sort({ createdAt: -1 });

    res.status(200).json({ created, helping });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user tasks', error: error.message });
  }
};