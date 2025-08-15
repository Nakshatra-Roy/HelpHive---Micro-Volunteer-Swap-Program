import nodemailer from "nodemailer";
import { io } from "../socket.js";
import User from "../models/userModel.js";

export const sendNotifications = async (task) => {
  const interestedUsers = await User.find({ following: task.category });

  let emailSentCount = 0;
  let socketSentCount = 0;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  for (const user of interestedUsers) {

    if (user.emailNotif) {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: `New Task in ${task.category}!`,
        text: `Hi ${user.name},\n\nA new task "${task.taskName}" has been posted in the category you follow.\n\nCheck it out on HelpHive!`,
      };

      try {
        await transporter.sendMail(mailOptions);
        emailSentCount++;
        console.log(`Email sent to ${user.email}`);
      } catch (err) {
        console.error(`Failed to send email to ${user.email}:`, err.message);
      }
    }

    if (user.appNotif) {
      io.to(user._id.toString()).emit("newTask", {
        category: task.category,
        taskName: task.taskName,
      });
      socketSentCount++;
    }
  };
};


