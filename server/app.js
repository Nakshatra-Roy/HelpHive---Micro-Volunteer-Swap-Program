const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const User=require('./models/userModel.js');
app.use(cors());
app.use(express.json());


// Importing routes:
// This is where we will define the routes for our application
// For example, if we have a problem and user routes, we can import them like this
// const problemRoutes = require('./routes/problemRoutes');

const userRoutes = require('./routes/userRoutes');
// FOR REACH ROUTES, WE NEED A 
// 1. Routes
// 2. MODEL AND A 
// 3. CONTROLLER AS WELL in a new file, check the routes, model and controller folder to understand




// Using the routes:
// app.use('/api/problems', problemRoutes);
app.use('/api/users', userRoutes);
app.use('/api/profile', require('./routes/profileRoutes'));

module.exports = app;