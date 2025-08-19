// models/swapRequestModel.js
import mongoose from 'mongoose';

const swapRequestSchema = new mongoose.Schema(
  {
    requester: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    taskToGive: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true },
    taskToReceive: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true },
  },
  { timestamps: true }
);

const SwapRequest = mongoose.model('SwapRequest', swapRequestSchema);
export default SwapRequest;