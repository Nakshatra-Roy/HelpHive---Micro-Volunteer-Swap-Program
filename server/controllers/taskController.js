import mongoose from "mongoose";
import Task from "../models/taskModel.js";
import User from "../models/userModel.js"; 
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

  // Get logged-in user's ID from auth middleware
  const userId = req.user?._id || req.user?.id;

  if (!userId) {
    return res.status(401).json({ success: false, message: "You have to be logged in to create a task" });
  }

  try {
    const newTask = new Task({
      ...taskData,
      postedBy: userId,
    });

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
  const { userId } = req.body;

  if (!userId) {
    return res.status(401).json({ success: false, message: 'You must be logged in to accept tasks' });
  }

  try {
    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });

    if (!task.helpersArray) task.helpersArray = [];
    if (!task.helpersArray.includes(userId)) task.helpersArray.push(userId);

    await task.save();

    const user = await User.findById(userId);
    if (!user.myTasks.includes(task._id)) {
      user.myTasks.push(task._id);
      await user.save();
    }
    res.status(200).json(task); // return updated task
  } catch (error) {
    console.error('Error accepting task:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
