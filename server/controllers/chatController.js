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
    const chat = await Chat.findOne({ taskReference: req.params.taskId }).populate('messages.sender', 'name _id');
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }
    res.status(200).json(chat.messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};