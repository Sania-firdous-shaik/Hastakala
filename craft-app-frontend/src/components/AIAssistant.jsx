import { useState } from 'react';
import axios from 'axios';

const AIAssistant = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: 'Namaste! 👋 I’m Hastakala AI. I can help you find Indian handmade crafts, gifts, and products.'
    }
  ]);
  const [loading, setLoading] = useState(false);

  const API_URL =
    import.meta.env.VITE_API_URL || 'http://localhost:4000';

  const askAI = async () => {
    if (!message.trim() || loading) return;

    const userMessage = message.trim();

    setMessages((prev) => [
      ...prev,
      {
        role: 'user',
        text: userMessage
      }
    ]);

    setMessage('');
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/api/ai/ask`, {
        message: userMessage
      });

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: response.data.answer
        }
      ]);
    } catch (error) {
      console.error('AI assistant error:', error);

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: 'Sorry, I could not connect to Hastakala AI right now. Please try again.'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      askAI();
    }
  };

  return (
    <>
      {/* Floating AI Button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-600 text-2xl text-white shadow-lg transition hover:bg-indigo-700"
        aria-label="Open Hastakala AI"
      >
        ✨
      </button>

      {/* Chat Window */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 flex h-[520px] w-[360px] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-gray-200">

          {/* Header */}
          <div className="flex items-center justify-between bg-indigo-600 px-4 py-3 text-white">
            <div>
              <h2 className="font-semibold">Hastakala AI</h2>
              <p className="text-xs text-indigo-100">
                Your Indian craft shopping assistant
              </p>
            </div>

            <button
              onClick={() => setOpen(false)}
              className="text-xl text-white hover:text-gray-200"
              aria-label="Close AI assistant"
            >
              ×
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 space-y-3 overflow-y-auto bg-gray-50 p-4">

            {messages.map((item, index) => (
              <div
                key={index}
                className={`flex ${
                  item.role === 'user'
                    ? 'justify-end'
                    : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm whitespace-pre-line ${
                    item.role === 'user'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white text-gray-700 shadow-sm'
                  }`}
                >
                  {item.text}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="rounded-2xl bg-white px-4 py-2 text-sm text-gray-500 shadow-sm">
                  Hastakala AI is thinking...
                </div>
              </div>
            )}

          </div>

          {/* Input */}
          <div className="border-t bg-white p-3">
            <div className="flex gap-2">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about gifts or crafts..."
                rows={1}
                className="flex-1 resize-none rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />

              <button
                onClick={askAI}
                disabled={loading || !message.trim()}
                className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Send
              </button>
            </div>

            <p className="mt-2 text-center text-xs text-gray-400">
              Powered by Gemini
            </p>
          </div>

        </div>
      )}
    </>
  );
};

export default AIAssistant;
