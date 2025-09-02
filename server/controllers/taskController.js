import mongoose from "mongoose";
import Task from "../models/taskModel.js";
import User from "../models/userModel.js"; 
import Chat from "../models/chatModel.js";
import { getUserById } from "../controllers/userController.js";
import { sendNotifications } from "../controllers/notificationController.js";
import SwapRequest from '../models/swapRequestModel.js';

export const getTasks = async (req, res) => {
	try {
		const tasks = await Task.find({})
			.populate('postedBy', 'firstName lastName fullName _id') // This adds the user's details
			.sort({ createdAt: -1 }); // It's also good practice to sort the tasks
		res.status(200).json({ success: true, data: tasks });
	} catch (error) {
		console.log("Error in fetching tasks:", error.message);
		res.status(500).json({ success: false, message: "Server Error" });
	}
};

export const createTask = async (req, res) => {
    const taskData = req.body;
    console.log("Received task on backend:", taskData);

    const userId = req.user?._id || req.user?.id;
    const user = await User.findById(userId);

    if (!userId) {
      return res.status(401).json({ success: false, message: "You have to be logged in to create a task" });
    }

    if (user.credits.earned - user.credits.spent < taskData.credits) {
      return res.status(403).json({ success: false, message: "Insufficient Credits" });
    }

    try {
      const newTask = new Task({
        ...taskData,
        postedBy: userId,
      });

      await newTask.save();
      user.credits.spent += taskData.credits;
      user.myTasks.push(newTask._id);
      await user.save();

      const notifiedCount = await sendNotifications?.(newTask, req.io) || 0;

      res.status(201).json({
        success: true,
        data: newTask,
        notifiedUsers: notifiedCount,
      });
    } catch (error) {
      console.error("Error creating task:", error.message);

      if (error.name === 'ValidationError') {
        return res.status(400).json({ success: false, message: "Please provide all fields" });
      }

      res.status(500).json({ success: false, message: "Server Error" });
    }
  };

export const updateTask = async (req, res) => {
	const { id } = req.params;

	const task = req.body;

	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(404).json({ success: false, message: "Invalid Task Id" });
	}
    //only checks the format, not whether the user exists

    const valid = await Task.exists({ _id: id });
    if (!valid) {
        return res.status(404).json({ success: false, message: "Task does not exist" });
    }

	try {
  		const updatedTask = await Task.findByIdAndUpdate(id, task, { new: true, runValidators: true });
  		res.status(200).json({ success: true, data: updatedTask });
	} catch (error) {
  		console.error("Error updating task:", error); 
  		res.status(500).json({ success: false, message: "Server Error" });
}

};

export const deleteTask = async (req, res) => {
	const { id } = req.params;

	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(404).json({ success: false, message: "Invalid Task Id" });
	}

    const valid = await Task.exists({ _id: id });
    if (!valid) {
        return res.status(404).json({ success: false, message: "Task does not exist" });
    }

	try {
		await Task.findByIdAndDelete(id);
		res.status(200).json({ success: true, message: "Task deleted" });
	} catch (error) {
		console.log("Error in deleting task:", error.message);
		res.status(500).json({ success: false, message: "Server Error" });
	}
};

export const acceptTask = async (req, res) => {
    const { id } = req.params;
    const userId = req.user?._id || req.user?.id;
    //const user = await getUserById(userId);

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: "Invalid Task Id" });
    }

    if (!userId) {
        return res.status(401).json({ success: false, message: "You have to be logged in to accept a task" });
    }

    try {
        const task = await Task.findById(id);

        if (!task) {
            return res.status(404).json({ success: false, message: "Task does not exist" });
        }

        if (task.postedBy.toString() === userId.toString()) {
            return res.status(400).json({ success: false, message: "You cannot accept your own task" });
        }

        const alreadyAccepted = task.helpersArray.some(
            (helper) => helper.user.toString() === userId.toString()
        );

        if (alreadyAccepted) {
            return res.status(400).json({ success: false, message: "You have already accepted this task" });
        }

        if (task.curHelpers >= task.helpersReq) {
            return res.status(400).json({ success: false, message: "This task has already been filled" });
        }

        // Update task properties
        task.curHelpers += 1;
        task.helpersArray.push({
            user: userId,
            acceptedAt: new Date()
        });
        task.status = 'in-progress'; // Set status as soon as the first helper joins

        // Smart chat logic
        await Chat.findOneAndUpdate(
            { taskReference: id },
            {
                $addToSet: { participants: [task.postedBy, userId] },
                taskReference: id,
            },
            { upsert: true, new: true }
        );

        const updatedTask = await task.save();

        res.status(200).json({
            success: true,
            message: "Successfully accepted the task!",
            data: updatedTask
        });

    } catch (error) {
        console.error("Error in acceptTask:", error);
        res.status(500).json({ success: false, message: "Server error while accepting task" });
    }
};

export const completeTask = async (req, res) => {
    const { id } = req.params;
    const userId = req.user?._id || req.user?.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: "Invalid Task Id" });
    }

    if (!userId) {
        return res.status(401).json({ success: false, message: "You have to be logged in to complete a task" });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const task = await Task.findById(id).session(session);

        if (!task) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ success: false, message: "Task does not exist" });
        }

        if (task.postedBy.toString() !== userId.toString()) {
            await session.abortTransaction();
            session.endSession();
            return res.status(403).json({ success: false, message: "You are not authorized to complete this task" });
        }

        if (task.status === 'completed') {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ success: false, message: "This task has already been completed" });
        }

        if (task.helpersArray.length === 0) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ success: false, message: "This task has no helpers to award credits to" });
        }

        const now = new Date();

        // Award credits to each helper based on time spent + add to volunteerHistory
        for (const helper of task.helpersArray) {
            const acceptedAt = new Date(helper.acceptedAt);
            const hoursWorked = Math.max((now - acceptedAt) / (1000 * 60 * 60), 0);
            const creditsToAward = Math.ceil(hoursWorked * task.credits);

            await User.findByIdAndUpdate(
                helper.user,
                {
                    $inc: { 'credits.earned': creditsToAward },
                    $addToSet: { volunteerHistory: task._id }
                },
                { session }
            );
        }

        // Mark task as completed
        task.status = 'completed';
        await task.save({ session });

        await session.commitTransaction();
        session.endSession();

        res.status(200).json({
            success: true,
            message: "Task successfully completed and credits awarded based on hours worked."
        });

    } catch (error) {
        await session.abortTransaction();
        session.endSession();

        console.error("Error completing task:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};


export const swapReq = async (req, res) => {
  const { tId1, tId2 } = req.params;
  const requesterId = req.user?._id || req.user?.id;

  if (!requesterId) {
    return res.status(401).json({ success: false, message: "You must be logged in to request a swap." });
  }
  
  try {
    const task1 = await Task.findById(tId1); // Task of the person requesting
    const task2 = await Task.findById(tId2); // Task of the person being asked

    if (!task1 || !task2) {
      return res.status(404).json({ success: false, message: "One or both tasks not found." });
    }

    if (task1.postedBy.toString() !== requesterId.toString()) {
        return res.status(403).json({ success: false, message: "You can only request swaps for your own tasks." });
    }

    /*const notification = new Notification({
      recipient: task2.postedBy,
      sender: requesterId,
      type: 'SWAP_REQUEST',
      message: `User ${req.user.name} wants to swap their task "${task1.taskName}" with your task "${task2.taskName}".`,
      reference: {
        taskToGive: tId1,
        taskToReceive: tId2
      }
    });
    
    await notification.save();

    res.status(200).json({ success: true, message: "Swap request sent successfully." });*/

  } catch (error) {
    console.error("Error creating swap request:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const acceptSwap = async (req, res) => {
  const { tId1, tId2 } = req.params;
  const { accepted } = req.body;
  const userId = req.user?._id || req.user?.id;

  if (!userId) {
    return res.status(401).json({ success: false, message: "You must be logged in." });
  }

  if (accepted === false) {
    return res.status(200).json({ success: true, message: "Swap request rejected." });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const task1 = await Task.findById(tId1).session(session);
    const task2 = await Task.findById(tId2).session(session);

    if (!task1 || !task2) {
      throw new Error("One or both tasks not found.");
    }
    
    if (task2.postedBy.toString() !== userId.toString()) {
      throw new Error("You are not authorized to accept this swap.");
    }


    const user1_Id = task1.postedBy;
    const user2_Id = task2.postedBy;
    
    if (!task1.helpersArray.includes(user2_Id)) {
      task1.helpersArray.push(user2_Id);
      task1.curHelpers += 1;
    }

    if (!task2.helpersArray.includes(user1_Id)) {
      task2.helpersArray.push(user1_Id);
      task2.curHelpers += 1;
    }

    await task1.save({ session });
    await task2.save({ session });

    await session.commitTransaction();
    session.endSession();
    
    res.status(200).json({ success: true, message: "Tasks swapped successfully!" });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    
    console.error("Error accepting swap:", error.message);
    res.status(500).json({ success: false, message: error.message || "Server Error" });
  }
};

export const createSwapRequest = async (req, res) => {
  const { taskToGiveId, taskToReceiveId } = req.body;
  const requesterId = req.user._id;

  try {
    const taskToReceive = await Task.findById(taskToReceiveId);
    if (!taskToReceive) {
      return res.status(404).json({ message: 'Task to receive not found.' });
    }
    if (taskToReceive.curHelpers == taskToReceive.helpersReq){
      return res.status(400).json({ message: 'The task you want to receive is already full.' });
    }

    const swapRequest = new SwapRequest({
      requester: requesterId,
      recipient: taskToReceive.postedBy,
      taskToGive: taskToGiveId,
      taskToReceive: taskToReceiveId,
    });
    
    await swapRequest.save();
    res.status(201).json({ success: true, message: 'Swap request sent successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

/**
 * @desc    Get all incoming swap requests for the user
 * @route   GET /api/tasks/swaps
 * @access  Private
 */




export const getSwapRequests = async (req, res) => {
  try {
    const requests = await SwapRequest.find({ recipient: req.user._id })
      .populate('requester', 'firstName lastName fullName')
      .populate('taskToGive', 'taskName')
      .populate('taskToReceive', 'taskName');
      
    res.status(200).json({ success: true, data: requests });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};



export const respondToSwapRequest = async (req, res) => {
  const { swapRequestId } = req.params;
  const { accepted } = req.body;
  const recipientId = req.user._id;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const request = await SwapRequest.findById(swapRequestId).session(session);
    if (!request || request.recipient.toString() !== recipientId.toString()) {
      throw new Error('Swap request not found or you are not authorized.');
    }

    if (accepted) {
      const taskToGive = await Task.findById(request.taskToGive).session(session);
      const taskToReceive = await Task.findById(request.taskToReceive).session(session);

      taskToReceive.helpersArray.push(request.requester);
      taskToReceive.curHelpers += 1;

      taskToGive.helpersArray.push(request.recipient);
      taskToGive.curHelpers += 1;
      
      await taskToGive.save({ session });
      await taskToReceive.save({ session });
    }
    
    await SwapRequest.findByIdAndDelete(swapRequestId).session(session);

    await session.commitTransaction();
    session.endSession();
    
    res.status(200).json({ success: true, message: `Swap request ${accepted ? 'accepted' : 'rejected'}.` });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ success: false, message: error.message || 'Server Error' });
  }
};

export const helperSwap = async (req, res) => {
  const { myCommittedTaskId, theirOpenTaskId } = req.params;
  const myUserId = req.user._id;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const myCommittedTask = await Task.findById(myCommittedTaskId).session(session);
    const theirOpenTask = await Task.findById(theirOpenTaskId).session(session);

    if (!myCommittedTask || !theirOpenTask) {
      throw new Error('One or both tasks could not be found.');
    }

    const theirUserId = theirOpenTask.postedBy;

    // --- Authorization and Validation Checks ---
    if (!myCommittedTask.helpersArray.some(id => id.toString() === myUserId.toString())) {
      throw new Error('Authorization failed: You are not the helper for this task.');
    }
    if (theirOpenTask.status !== 'open') {
      throw new Error('Swap failed: The other task is no longer open.');
    }
    if (theirOpenTask.postedBy.toString() === myUserId.toString()) {
        throw new Error('You cannot swap for a task you posted.');
    }

    // --- The Swap Logic ---

    // 1. Update the task I am dropping: remove me, add the other owner
    myCommittedTask.helpersArray = myCommittedTask.helpersArray.filter(id => id.toString() !== myUserId.toString());
    myCommittedTask.helpersArray.push(theirUserId);

    // 2. Update the task I am accepting: add me, update status
    theirOpenTask.helpersArray.push(myUserId);
    theirOpenTask.curHelpers += 1;
    theirOpenTask.status = 'in-progress';

    // Save both tasks
    const updatedMyCommittedTask = await myCommittedTask.save({ session });
    const updatedTheirOpenTask = await theirOpenTask.save({ session });

    await session.commitTransaction();
    session.endSession();

    // Important: You should notify the owner of the original task
    // that their helper has changed.

    res.status(200).json({ 
        success: true, 
        message: 'Swap successful!', 
        data: { updatedMyCommittedTask, updatedTheirOpenTask } 
    });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ success: false, message: error.message || 'Server Error' });
  }
};
// controllers/taskController.js
export const getCompletedTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ status: "completed" })
      .populate("postedBy", "firstName lastName fullName")
      .populate("helpersArray.user", "firstName lastName fullName"); // populate helpers too

    res.json(tasks);
  } catch (err) {
    console.error("Error fetching completed tasks:", err);
    res.status(500).json({ message: "Server Error" });
  }
};