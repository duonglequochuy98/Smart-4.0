import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Send, Bot } from 'lucide-react';
import { Message } from '../types';

interface AIAssistantProps {
  onBack: () => void;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({ onBack }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      text: 'Xin chào! Tôi là trợ lý ảo của Phường Tây Thạnh. Tôi có thể giúp bạn:\n\n• Tra cứu thủ tục hành chính\n• Hướng dẫn nộp hồ sơ\n• Giải đáp thắc mắc\n• Đặt lịch hẹn\n\nBạn cần hỗ trợ gì?'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // ✅ ĐÚNG: Lấy API key từ environment variable
  const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

  // Kiểm tra API key khi component mount
  useEffect(() => {
    console.log('🔑 Checking Groq API Key...');
    if (!GROQ_API_KEY) {
      console.error('❌ VITE_GROQ_API_KEY is not set!');
      console.log('Please add VITE_GROQ_API_KEY to:');
      console.log('- Local: .env.local file');
      console.log('- Vercel: Environment Variables in Settings');
    } else {
      console.log('✅ VITE_GROQ_API_KEY loaded');
      console.log('First 10 chars:', GROQ_API_KEY.substring(0, 10));
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    // Kiểm tra API key trước khi gọi
    if (!GROQ_API_KEY) {
      setMessages(prev => [...prev, {
        role: 'model',
        text: '❌ Lỗi: API key chưa được cấu hình. Vui lòng liên hệ quản trị viên.'
      }]);
      return;
    }

    const userMessage = input.trim();
    setInput('');
    
    // Thêm tin nhắn user
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      // Gọi Groq API
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile', // Hoặc model khác của Groq
          messages: [
            {
              role: 'system',
              content: 'Bạn là trợ lý ảo thông minh của Trung tâm Phục vụ Hành chính công Phường Tây Thạnh, Quận Tân Phú, TP.HCM. Nhiệm vụ của bạn là hỗ trợ người dân về các thủ tục hành chính, giải đáp thắc mắc, hướng dẫn nộp hồ sơ. Hãy trả lời một cách chuyên nghiệp, thân thiện và chính xác.'
            },
            ...messages.map(m => ({
              role: m.role === 'model' ? 'assistant' : 'user',
              content: m.text
            })),
            {
              role: 'user',
              content: userMessage
            }
          ],
          temperature: 0.7,
          max_tokens: 1000
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'API request failed');
      }

      const data = await response.json();
      const aiResponse = data.choices[0]?.message?.content || 'Xin lỗi, tôi không thể trả lời lúc này.';

      setMessages(prev => [...prev, { 
        role: 'model', 
        text: aiResponse 
      }]);

    } catch (error) {
      console.error('Error calling Groq API:', error);
      setMessages(prev => [...prev, { 
        role: 'model', 
        text: `❌ Lỗi kết nối: ${error instanceof Error ? error.message : 'Vui lòng thử lại sau.'}` 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="sticky top-0 p-5 flex items-center gap-3 z-30 bg-white/80 backdrop-blur-lg border-b border-slate-100">
        <button 
          onClick={onBack}
          className="w-10 h-10 flex items-center justify-center rounded-2xl bg-slate-50 text-slate-600 border border-slate-100 shadow-sm active:scale-90 transition-all"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex items-center gap-3 flex-1">
          <div className="w-10 h-10 bg-red-50 rounded-2xl flex items-center justify-center">
            <Bot className="text-red-600" size={22} />
          </div>
          <div>
            <h2 className="font-black text-[14px] text-slate-800 leading-none">Trợ lý AI</h2>
            <p className="text-[10px] font-bold text-emerald-600 uppercase mt-1">
              {GROQ_API_KEY ? '● Trực tuyến' : '● Ngoại tuyến'}
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
              msg.role === 'user' 
                ? 'bg-red-600 text-white' 
                : 'bg-slate-100 text-slate-800'
            }`}>
              <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-100 rounded-2xl px-4 py-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-5 border-t border-slate-100 bg-white">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Nhập câu hỏi..."
            className="flex-1 px-4 py-3 border border-slate-200 rounded-2xl focus:outline-none focus:border-red-600 text-sm"
            disabled={isLoading}
          />
          <button
            onClick={sendMessage}
            disabled={isLoading || !input.trim()}
            className="w-12 h-12 bg-red-600 text-white rounded-2xl flex items-center justify-center active:scale-90 transition-all disabled:opacity-50"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};
