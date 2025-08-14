const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
    offerTitle: { type: String, required: true },
    offerDescription: { type: String, default: '', required: true},
    offerDuration: { type: String, required: true },
    offerCategory: { type: String, required: true },
    availability: { type: String, default: "available" },
    // createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    skillsRequired: [String],
    contactInfo: { type: String, default: '' },
    location: { type: String, required: true },
    helpersRequired: { type: Number, default: 1 },
    createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Offer', offerSchema);