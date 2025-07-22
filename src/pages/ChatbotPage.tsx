import React, { useState, useRef, useEffect } from 'react';
import api from '../api';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Typography, Box, IconButton, Tooltip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import HistoryIcon from '@mui/icons-material/History';
import './ChatbotPage.css';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatHistory {
  _id: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}

const ChatbotPage: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showTyping, setShowTyping] = useState(false);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Load chat history on component mount
  useEffect(() => {
    loadChatHistory();
  }, []);

  useEffect(() => {
    if (loading) {
      setShowTyping(true);
    } else {
      setShowTyping(false);
    }
  }, [loading]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, showTyping]);

  const loadChatHistory = async () => {
    try {
      const response = await api.get('/chatbot/history');
      setChatHistory(response.data);
    } catch (error) {
      console.error('Failed to load chat history:', error);
    }
  };

  const loadChat = async (chatId: string) => {
    try {
      const response = await api.get(`/chatbot/history/${chatId}`);
      setMessages(response.data.messages);
      setCurrentChatId(chatId);
      setShowHistory(false);
    } catch (error) {
      console.error('Failed to load chat:', error);
    }
  };

  const deleteChat = async (chatId: string) => {
    try {
      await api.delete(`/chatbot/history/${chatId}`);
      await loadChatHistory();
      if (currentChatId === chatId) {
        setMessages([]);
        setCurrentChatId(null);
      }
    } catch (error) {
      console.error('Failed to delete chat:', error);
    }
  };

  const clearAllHistory = async () => {
    try {
      await api.delete('/chatbot/history');
      setChatHistory([]);
      setMessages([]);
      setCurrentChatId(null);
      setShowHistory(false);
    } catch (error) {
      console.error('Failed to clear history:', error);
    }
  };

  const startNewChat = () => {
    setMessages([]);
    setCurrentChatId(null);
    setShowHistory(false);
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setLoading(true);
    setError('');
    setInput('');

    try {
      const res = await api.post('/chatbot', { 
        message: input, 
        chatId: currentChatId 
      });
      
      const aiMessage: ChatMessage = {
        role: 'assistant',
        content: res.data.response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
      setCurrentChatId(res.data.chatId);
      
      // Refresh chat history
      await loadChatHistory();
    } catch (err) {
      setError('Failed to get AI response');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="chatbot-page-bg">
      <div className="chatbot-container chatbot-large">
        <div className="chatbot-header">
          <h2 className="chatbot-title">AI Healthcare Assistant</h2>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Chat History">
              <IconButton 
                onClick={() => setShowHistory(!showHistory)}
                sx={{ 
                  color: '#2E7D8A',
                  backgroundColor: 'rgba(46, 125, 138, 0.1)',
                  '&:hover': {
                    backgroundColor: 'rgba(46, 125, 138, 0.2)',
                  }
                }}
              >
                <HistoryIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="New Chat">
              <Button
                variant="outlined"
                size="small"
                onClick={startNewChat}
                sx={{
                  borderColor: '#4A9BA8',
                  color: '#4A9BA8',
                  fontWeight: 600,
                  '&:hover': {
                    borderColor: '#2E7D8A',
                    backgroundColor: 'rgba(74, 155, 168, 0.08)',
                  }
                }}
              >
                New Chat
              </Button>
            </Tooltip>
          </Box>
        </div>

        {showHistory && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="chatbot-history-panel"
          >
            <Box sx={{ p: 2, borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
              <Typography variant="h6" sx={{ mb: 1, color: '#2E7D8A', fontWeight: 600 }}>
                Chat History
              </Typography>
              {chatHistory.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No previous conversations
                </Typography>
              ) : (
                <Button
                  variant="text"
                  size="small"
                  onClick={clearAllHistory}
                  sx={{ color: '#F56565', fontSize: '0.8rem' }}
                >
                  Clear All History
                </Button>
              )}
            </Box>
            <div className="chatbot-history-list">
              {chatHistory.map((chat) => (
                <motion.div
                  key={chat._id}
                  className={`chatbot-history-item ${currentChatId === chat._id ? 'active' : ''}`}
                  onClick={() => loadChat(chat._id)}
                  whileHover={{ backgroundColor: 'rgba(46, 125, 138, 0.05)' }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="chatbot-history-content">
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {chat.messages[0]?.content.substring(0, 50)}...
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {formatDate(chat.updatedAt)}
                    </Typography>
                  </div>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteChat(chat._id);
                    }}
                    sx={{ 
                      color: '#F56565',
                      '&:hover': { backgroundColor: 'rgba(245, 101, 101, 0.1)' }
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        <div className="chatbot-messages">
          {messages.length === 0 && !showHistory && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="chatbot-placeholder">
              <Typography variant="h6" sx={{ mb: 2, color: '#2E7D8A', fontWeight: 600 }}>
                Welcome to your AI Healthcare Assistant! 🏥
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Ask me anything about health, wellness, or medical information. I'm here to help!
              </Typography>
            </motion.div>
          )}
          <AnimatePresence initial={false}>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className={`chatbot-bubble ${msg.role}`}
              >
                <span className="chatbot-bubble-label">
                  {msg.role === 'user' ? 'You' : 'AI Assistant'}
                </span>
                <span>{msg.content}</span>
                <Typography variant="caption" sx={{ display: 'block', mt: 1, opacity: 0.7 }}>
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </Typography>
              </motion.div>
            ))}
            {showTyping && (
              <motion.div
                key="typing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="chatbot-bubble ai chatbot-typing"
              >
                <span className="chatbot-bubble-label">AI Assistant</span>
                <span className="typing-indicator">
                  <span className="dot" />
                  <span className="dot" />
                  <span className="dot" />
                </span>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>
        <form className="chatbot-input-row" onSubmit={sendMessage}>
          <input
            className="chatbot-input"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Type your health question..."
            disabled={loading}
            autoFocus
          />
          <motion.button
            type="submit"
            className="chatbot-send-btn"
            whileTap={{ scale: 0.95 }}
            disabled={loading || !input.trim()}
          >
            {loading ? '...' : 'Send'}
          </motion.button>
        </form>
        {error && <div className="chatbot-error">{error}</div>}
      </div>
    </div>
  );
};

export default ChatbotPage; 