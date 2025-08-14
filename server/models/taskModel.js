const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    taskName: { type: String, required: true },
    category: { type: String, required: true },
    location: { type: String, required: true },
    helpersReq: {type: Number, required: true },
    curHelpers: {type: Number },
    helpersArray: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        default: [] },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Task', taskSchema);