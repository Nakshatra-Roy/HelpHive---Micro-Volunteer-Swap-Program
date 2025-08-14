import mongoose from "mongoose";
import Task from "../models/taskModel.js";

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

  const newTask = new Task(taskData);

  try {
    await newTask.save();

    const interestedUsers = await User.find({ following: newTask.category });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    for (const user of interestedUsers) {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: `New Task in ${newTask.category}!`,
        text: `Hi ${user.name},\n\nA new task "${newTask.taskName}" has been posted in the category you follow.\n\nCheck it out on HelpHive!`,
      };

      try {
        await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${user.email}`);
      } catch (err) {
        console.error(`Failed to send email to ${user.email}:`, err.message);
      }
    }

    res.status(201).json({
      success: true,
      data: newTask,
      notifiedUsers: interestedUsers.length
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