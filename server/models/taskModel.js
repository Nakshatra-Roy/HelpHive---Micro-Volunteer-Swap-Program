import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
    taskName: { type: String, required: true },
    category: { type: String, required: true },
    taskDescription: { type: String, required: true },
    location: { type: String, required: true },
    helpersReq: {type: Number, required: true },
    curHelpers: {type: Number, default: 0 },
    helpersArray: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        default: [] },
    status: { type: String, required: true, enum: ['open', 'in-progress', 'completed'], default: 'open' },
    createdAt: { type: Date, default: Date.now },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    swapInterest: { type: Boolean, default: false },
    date: { type: Date, default: Date.now },
    priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
    credits: { type: Number, default: 10 },
});

export default mongoose.model('Task', taskSchema);