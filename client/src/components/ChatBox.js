import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/socketProvider';

const ChatBox = ({ taskId, onClose }) => {
  const socket = useSocket();
  const { user, loading: authLoading } = useAuth(); 
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [taskCreatorId, setTaskCreatorId] = useState(null);
  const messagesEndRef = useRef(null);
  const API = process.env.REACT_APP_BACKEND_URL;

  const getMessageClass = (sender) => {
    if (!sender?._id || !user?._id) return 'other-message';

    const isOwnMessage = sender._id === user._id;
    const isUserHost = user._id === taskCreatorId;
    const isSenderHost = sender._id === taskCreatorId;
    
    if (isOwnMessage) {
      // My messages always appear on the right
      return isUserHost 
        ? 'own-message own-host-message' // I'm the host, my messages are green
        : 'own-message own-helper-message'; // I'm a helper, my messages are blue
    } else {
      // Other people's messages appear on the left
      return isSenderHost
        ? 'other-message other-host-message' // Message from host is green
        : 'other-message other-helper-message'; // Message from helper is light blue
    }
  };


  // Effect for fetching history and setting up socket listeners
  useEffect(() => {
    // Do not run this effect if auth is still loading, or if we're missing key info
    if (authLoading || !socket || !taskId || !user) {
      return;
    }

    const fetchChatHistory = async () => {
      try {
        // Get the token directly from localStorage for the API call
        const token = localStorage.getItem('token');
        if (!token) {
          console.error("Authentication Error: No token found.");
          return;
        }

        const response = await axios.get(`${API}/api/chat/history/${taskId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setMessages(response.data.messages); 
        setTaskCreatorId(response.data.taskCreatorId);
      } catch (error) {
        console.error('Error fetching chat history:', error);
      }
    };

    const handleReceiveMessage = (message) => {
      setMessages(prev => [...prev, message]);
    };

    socket.on('receiveMessage', handleReceiveMessage);
    socket.emit('joinRoom', taskId);
    fetchChatHistory();

    // Cleanup function
    return () => {
      socket.off('receiveMessage', handleReceiveMessage);
    };

    // This effect now correctly depends on all its external variables
  }, [socket, taskId, user, authLoading]);

  // Effect for scrolling to the bottom of the messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

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

  const isOwnMessage = (sender) => sender?._id === user?._id;

  if (authLoading) {
    return <div>Loading chat...</div>;
  }

  if (!user) {
    return (
    <div className="chat-container">
      <div className="backdrop">
      <div className="blob b1" />
      <div className="blob b2" />
      <div className="grid-overlay" />
    </div>
    <div className = "card">
        <div>Please log in to view the chat.</div>
        </div>
    </div>
    );
  }

  return (
    <div className="chat-container">
      <button className="return-button" onClick={onClose}>❌</button>

      <div className="chat-messages">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`message ${getMessageClass(message.sender)}`}
          >
            <div className="message-content">
              {/* Show sender name for all messages */}
              <strong className="sender-name">
                {isOwnMessage(message.sender) ? 'You' : message.sender?.fullName || 'User'}
              </strong>
              <p>{message.content}</p>
              <small className="message-time">
                {new Date(message.timestamp).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
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

export default ChatBox;