const User = require('../models/userModel');
const Task = require('../models/taskModel');
const asyncHandler = require('express-async-handler');

// @desc    Get platform stats
// @route   GET /api/admin/stats
// @access  Private/Admin
const getStats = asyncHandler(async (req, res) => {
    const totalUsers = await User.countDocuments();
    const totalAdmins = await User.countDocuments({ role: 'admin' });
    const totalVolunteers = await User.countDocuments({ role: 'volunteer' });
    const totalTasks = await Task.countDocuments();
    const completedTasks = await Task.countDocuments({ status: 'completed' });
    const activeTasks = await Task.countDocuments({ status: 'active' });

    const stats = {
        users: {
            total: totalUsers,
            admins: totalAdmins,
            volunteers: totalVolunteers
        },
        tasks: {
            total: totalTasks,
            completed: completedTasks,
            active: activeTasks
        },
        activityStats: {
            tasksCompletionRate: totalTasks > 0 ? (completedTasks / totalTasks * 100) : 0,
            averageTasksPerUser: totalUsers > 0 ? (totalTasks / totalUsers) : 0
        }
    };

    res.status(200).json(stats);
});

// @desc    Get my admin activity
// @route   GET /api/admin/my-activity
// @access  Private/Admin
const getMyActivity = asyncHandler(async (req, res) => {
    const tasks = await Task.find({ 
        $or: [
            { createdBy: req.user._id },
            { assignedTo: req.user._id },
            { completedBy: req.user._id }
        ]
    })
    .sort({ updatedAt: -1 })
    .limit(10)
    .populate('createdBy', 'name')
    .populate('assignedTo', 'name')
    .populate('completedBy', 'name');

    const activity = tasks.map(task => {
        let activityType = '';
        let description = '';

        if (task.createdBy?._id.toString() === req.user._id.toString()) {
            activityType = 'created';
            description = `Created task: ${task.title}`;
        } else if (task.assignedTo?._id.toString() === req.user._id.toString()) {
            activityType = 'assigned';
            description = `Assigned to task: ${task.title}`;
        } else if (task.completedBy?._id.toString() === req.user._id.toString()) {
            activityType = 'completed';
            description = `Completed task: ${task.title}`;
        }

        return {
            type: activityType,
            description,
            date: task.updatedAt,
            taskId: task._id
        };
    });

    res.status(200).json(activity);
});


const getAllAdmins = asyncHandler(async (req, res) => {
    const adminIds = await User.distinct('_id', { role: 'admin' });

    const admins = await User.find({ '_id': { $in: adminIds } })
        .sort({ createdAt: -1 });
    res.status(200).json(admins);
});

module.exports = {
    getStats,
    getMyActivity,
    getAllAdmins,
};