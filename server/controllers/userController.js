const User = require('../models/userModel.js');
const express = require('express');


exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 }); // Sort by creation date, newest first
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
};

exports.getUserById = async (req, res) => {
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

exports.createUser = async (req, res) => {
  const { firstName, lastName, email, password, role, profilePicture, bio, location, skills, interests, availability, socialLinks } = req.body;
  try {
    const newUser = new User({
        firstName,
        lastName,
        email,
        password, // In a real application, make sure to hash the password before saving
        role,
        profilePicture,
        bio,
        location,
        skills,
        interests,
        availability,
        socialLinks
    });
    await newUser.save();
    res.status(201).json({ message: 'Note created successfully', User: newUser });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
}

exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, email, password, role, profilePicture, bio, location, skills, interests, availability, socialLinks } = req.body;
  try {
    const updatedUser = await User.findByIdAndUpdate(id, {
        firstName,
        lastName,
        email,
        password, // In a real application, make sure to hash the password before saving
        role,
        profilePicture,
        bio,
        location,
        skills,
        interests,
        availability,
        socialLinks

    }, { new: true });
    
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found!' });
    }
    res.status(200).json({ message: 'Internal server error', updatedUser });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
}

exports.deleteUser = async (req, res) => {
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