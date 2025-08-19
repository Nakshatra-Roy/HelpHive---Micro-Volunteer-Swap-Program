// server/socketHandlers.js
import Chat from './models/chatModel.js';

// This function will be called for each new client that connects.
// It sets up the listeners specific to the chat feature.


export const registerChatHandlers = (io, socket) => {
  socket.on('joinNotificationRoom', (userId) => {
    socket.join(userId);
    console.log(`Socket ${socket.id} joined notification room for user: ${userId}`);
  });
  // Listen for the 'joinRoom' event from ChatPage.js
  socket.on('joinRoom', (taskId) => {
    socket.join(taskId);
    console.log(`Socket ${socket.id} joined room for task: ${taskId}`);
  });

  // Listen for the 'sendMessage' event from ChatPage.js
  socket.on('sendMessage', async ({ taskId, message }) => {
    try {
      // Find the chat and push the new message in one atomic operation
      const chat = await Chat.findOneAndUpdate(
        { taskReference: taskId },
        { $push: { messages: message } },
        { new: true } // This option returns the updated document
      );

      if (chat) {
        // Get the very last message we just added
        await chat.populate('messages.sender');

        // We need to populate the sender's details before broadcasting
        const populatedMessage = chat.messages[chat.messages.length - 1];
        
        console.log(`Broadcasting message to room ${taskId}:`, populatedMessage);

        // Broadcast the complete, populated message to everyone in the room
        io.to(taskId).emit('receiveMessage', populatedMessage);
      }
    } catch (error) {
      console.error('Error saving message:', error);
    }
  });
};