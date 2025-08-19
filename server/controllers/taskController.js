import mongoose from "mongoose";
import Task from "../models/taskModel.js";
import User from "../models/userModel.js"; 
import Chat from "../models/chatModel.js";
import { getUserById } from "../controllers/userController.js";
import { sendNotifications } from "../controllers/notificationController.js";


export const getTasks = async (req, res) => {
	try {
		const tasks = await Task.find({});
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

  if (user.credits.earned <= taskData.credits) {
    return res.status(403).json({ success: false, message: "Insufficient Credits" });
  }

  try {
    const newTask = new Task({
      ...taskData,
      postedBy: userId,
    });

    user.credits.spent += taskData.credits;
    await user.save();
    await newTask.save();

    const notifiedCount = await sendNotifications?.(newTask) || 0;

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
    const user = await getUserById(userId);

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

        if (task.helpersArray.includes(userId)) {
            return res.status(400).json({ success: false, message: "You have already accepted this task" });
        }

        if (task.curHelpers >= task.helpersReq) {
            return res.status(400).json({ success: false, message: "This task has already been filled" });
        }

        // Update task properties
        task.curHelpers += 1;
        task.helpersArray.push(userId);
        task.status = 'in-progress'; // Set status as soon as the first helper joins

        // This is the new, smarter chat logic.
        // It will CREATE the chat for the first helper and UPDATE it for all subsequent helpers.
        await Chat.findOneAndUpdate(
            { taskReference: id }, // Find the chat for this task
            { 
                // Add the task creator and the new helper to the participants list.
                // $addToSet prevents duplicates if they are already in the array.
                $addToSet: { participants: [task.postedBy, userId] }, 
                taskReference: id,
            },
            { upsert: true, new: true } // upsert:true creates the document if it doesn't exist
        );

        // Save all the changes made to the task document
        const updatedTask = await task.save();

        res.status(200).json({ success: true, message: "Successfully accepted the task!", data: updatedTask });

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
    session.startTransaction(); // to ensure database consistency, all operations occur in a single transaction or get rolled back

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

        task.status = 'completed';
        await task.save({ session });

        const credits = task.credits / task.helpersArray.length;

        await User.updateMany(
            { _id: { $in: task.helpersArray } },
            { $inc: { 'credits.earned': credits } },
            { session }
        );

        await session.commitTransaction();
        session.endSession();

        res.status(200).json({ success: true, message: "Task successfully completed and credits awarded." });

    } catch (error) {
        await session.abortTransaction();
        session.endSession();

        console.error("Error completing task:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};


export const swapReq = async (req, res) => {
  const { tId1, tId2 } = req.params;

  const userId = req.user?._id || req.user?.id;

  if (!userId) {
    return res.status(401).json({ success: false, message: "You have to be logged in to create a swap task request" });
  }
  
  try {
    //send notification to user2
  } catch (error) {
    console.error("Error creating task:", error.message);

    if (error.name === 'ValidationError') {
      return res.status(400).json({ success: false, message: "Please provide all fields" });
    }

    res.status(500).json({ success: false, message: "Server Error" });
  }
}; 

export const acceptSwap = async (req, res) => {
  const { tId1, tId2, flag } = req.params;

  const userId = req.user?._id || req.user?.id;

  if (!userId) {
    return res.status(401).json({ success: false, message: "You have to be logged in to create a swap task request" });
  }

  if (!flag) {
    //send rejected notification);
    }

  try {

    const task1 = await Task.findById(tId1);
    const task2 = await Task.findById(tId2);

    task1.helpersArray = task1.helpersArray.filter(id => id.toString() !== userId);

    const user2 = task2.postedBy;

    task1.helpersArray.push(user2._id.toString());

    task2.helpersArray = task2.helpersArray.filter(id => id.toString() !== userId);

    const user1 = task1.postedBy;

    task2.helpersArray.push(user1._id.toString());

    await task1.save();
    await task2.save();

    res.status(200).json({
    success: true,
    message: "Swap accepted successfully",
    data: { task1, task2 }
});


  //notify both users about the swap
  } catch (error) {
    console.error("Error creating task:", error.message);

    if (error.name === 'ValidationError') {
      return res.status(400).json({ success: false, message: "Please provide all fields" });
    }

    res.status(500).json({ success: false, message: "Server Error" });
  }
};
