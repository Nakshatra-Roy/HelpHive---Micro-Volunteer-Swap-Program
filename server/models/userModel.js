const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'volunteer', 'user'], default: 'user' },
    profilePicture: { type: String, default: 'default.jpg' },
    bio: { type: String, default: '' },
    location: { type: String, default: '' },
    skills: [String],
    interests: [String],
    availability: { type: String, default: 'full-time' },
    status: { type: Boolean, default: true },
    socialLinks: {
        github: { type: String, default: '' },
        linkedin: { type: String, default: '' },
        twitter: { type: String, default: '' },
        website: { type: String, default: '' }
        },
    createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('User', userSchema);