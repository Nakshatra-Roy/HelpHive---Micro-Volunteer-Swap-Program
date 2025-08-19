import Chat from '../models/chatModel.js';

export const initializeChat = async (req, res) => {
  const { taskId, participants } = req.body;

  try {
    let chat = await Chat.findOne({ taskReference: taskId });

    if (!chat) {
      chat = new Chat({
        taskReference: taskId,
        participants: participants
      });
      await chat.save();
    }

    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getChatHistory = async (req, res) => {
  try {
    const chat = await Chat.findOne({ taskReference: req.params.taskId })
      // --- THIS IS THE FIX ---
      // We populate the messages' senders AND the task reference's creator
      .populate('messages.sender')
      .populate({
        path: 'taskReference',
        select: 'postedBy' // We only need the ID of the person who posted the task
      });
      // --------------------

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    // Send back an object containing both the messages and the creator's ID
    res.status(200).json({
      messages: chat.messages,
      taskCreatorId: chat.taskReference.postedBy 
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};