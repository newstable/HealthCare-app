import React, { useState } from 'react';
import api from '../api';

const ChatbotPage: React.FC = () => {
  const [messages, setMessages] = useState<{ from: 'user' | 'ai'; text: string }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages([...messages, { from: 'user', text: input }]);
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/chatbot', { message: input });
      setMessages(msgs => [...msgs, { from: 'ai', text: res.data.response }]);
      setInput('');
    } catch (err) {
      setError('Failed to get AI response');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      <h2>AI Chatbot</h2>
      <div style={{ minHeight: 200, border: '1px solid #ccc', padding: 12, marginBottom: 12 }}>
        {messages.length === 0 && <div style={{ color: '#888' }}>Start the conversation...</div>}
        {messages.map((msg, i) => (
          <div key={i} style={{ textAlign: msg.from === 'user' ? 'right' : 'left', margin: '8px 0' }}>
            <b>{msg.from === 'user' ? 'You' : 'AI'}:</b> {msg.text}
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage} style={{ display: 'flex', gap: 8 }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type your message..."
          style={{ flex: 1 }}
          disabled={loading}
        />
        <button type="submit" disabled={loading || !input.trim()}>
          {loading ? '...' : 'Send'}
        </button>
      </form>
      {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
    </div>
  );
};

export default ChatbotPage; 