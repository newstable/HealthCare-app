import React, { useState, useRef, useEffect } from 'react';
import api from '../api';
import { motion, AnimatePresence } from 'framer-motion';
import './ChatbotPage.css';

const ChatbotPage: React.FC = () => {
  const [messages, setMessages] = useState<{ from: 'user' | 'ai'; text: string }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showTyping, setShowTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

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

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages([...messages, { from: 'user', text: input }]);
    setLoading(true);
    setError('');
    setInput('');
    try {
      const res = await api.post('/chatbot', { message: input });
      setMessages(msgs => [...msgs, { from: 'ai', text: res.data.response }]);
    } catch (err) {
      setError('Failed to get AI response');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chatbot-page-bg">
      <div className="chatbot-container chatbot-large">
        <h2 className="chatbot-title">AI Chatbot</h2>
        <div className="chatbot-messages">
          {messages.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="chatbot-placeholder">
              Start the conversation...
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
                className={`chatbot-bubble ${msg.from}`}
              >
                <span className="chatbot-bubble-label">{msg.from === 'user' ? 'You' : 'AI'}</span>
                <span>{msg.text}</span>
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
                <span className="chatbot-bubble-label">AI</span>
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
            placeholder="Type your message..."
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