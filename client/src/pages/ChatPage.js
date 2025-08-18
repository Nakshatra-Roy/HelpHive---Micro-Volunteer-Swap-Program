import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useSocket } from '../context/socketProvider';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './ChatPage.css';

const ChatPage = () => {
  const { taskId } = useParams();
  const socket = useSocket();
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (!socket || !taskId) return;

    const fetchChatHistory = async () => {
      try {
        const response = await axios.get(`/api/chat/history/${taskId}`);
        setMessages(response.data);
      } catch (error) {
        console.error('Error fetching chat history:', error);
      }
    };

    socket.emit('joinRoom', taskId);
    fetchChatHistory();

    const handleReceiveMessage = (message) => {
      setMessages(prev => [...prev, message]);
    };

    socket.on('receiveMessage', handleReceiveMessage);

    return () => {
      socket.off('receiveMessage', handleReceiveMessage);
    };
  }, [socket, taskId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const messageData = {
      sender: user._id,
      content: newMessage.trim(),
      timestamp: new Date()
    };

    socket.emit('sendMessage', {
      taskId,
      message: messageData
    });

    setNewMessage('');
  };

  const isOwnMessage = (senderId) => senderId === user._id;

  return (
    <div className="chat-container">
      <div className="chat-messages">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message ${isOwnMessage(message.sender._id) ? 'own-message' : 'other-message'}`}
          >
            <div className="message-content">
              <p>{message.content}</p>
              <small className="message-time">
                {new Date(message.timestamp).toLocaleTimeString()}
              </small>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSendMessage} className="chat-input-form">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="chat-input"
        />
        <button type="submit" className="send-button">Send</button>
      </form>
    </div>
  );
};

export default ChatPage;