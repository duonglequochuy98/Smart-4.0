import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send, Mic, Bot, User } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface Message {
  role: 'user' | 'model';
  text: string;
}

interface AIAssistantProps {
  onBack: () => void;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({ onBack }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      text: 'Xin chào! Tôi là trợ lý ảo AI của Phường Tây Thạnh. Tôi có thể hỗ trợ bạn về các thủ tục hành chính, tra cứu hồ sơ, và giải đáp thắc mắc. Bạn cần hỗ trợ gì?'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Lấy API key từ environment
  const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.GEMINI_API_KEY;

  // Khởi tạo Gemini AI
  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ 
    model: 'gemini-pro',
    generationConfig: {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 2048,
    }
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Tạo context cho AI về Phường Tây Thạnh
      const systemPrompt = `Bạn là trợ lý ảo AI của UBND Phường Tây Thạnh, Quận Tân Phú, TP.HCM. 
      Nhiệm vụ của bạn là hỗ trợ người dân về:
      - Các thủ tục hành chính (đăng ký khai sinh, chứng thực, giấy phép xây dựng, v.v.)
      - Tra cứu hồ sơ và tiến độ xử lý
      - Hướng dẫn cách nộp hồ sơ trực tuyến
      - Giải đáp thắc mắc về dịch vụ công
      
      Hãy trả lời ngắn gọn, thân thiện và chính xác. Sử dụng tiếng Việt có dấu.`;

      const chat = model.startChat({
        history: [
          {
            role: 'user',
            parts: [{ text: systemPrompt }]
          },
          {
            role: 'model',
            parts: [{ text: 'Tôi hiểu. Tôi sẽ hỗ trợ người dân về các thủ tục hành chính của Phường Tây Thạnh một cách chuyên nghiệp và thân thiện.' }]
          },
          ...messages.slice(1).map(msg => ({
            role: msg.role,
            parts: [{ text: msg.text }]
          }))
        ]
      });

      const result = await chat.sendMessage(input);
      const response = await result.response;
      const aiMessage: Message = { role: 'model', text: response.text() };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Lỗi khi gọi Gemini API:', error);
      const errorMessage: Message = { 
        role: 'model', 
        text: 'Xin lỗi, tôi đang gặp sự cố kỹ thuật. Vui lòng thử lại sau hoặc liên hệ hotline 028.xxxx.xxxx để được hỗ trợ trực tiếp.' 
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="sticky top-0 bg-gradient-to-r from-red-600 to-red-700 text-white p-5 flex items-center gap-3 shadow-lg z-10">
        <button 
          onClick={onBack}
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 active:scale-90 transition-all"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex items-center gap-3 flex-1">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <Bot size={22} />
          </div>
          <div>
            <h2 className="font-black text-base">Trợ lý ảo AI</h2>
            <p className="text-xs text-white/80">Phường Tây Thạnh</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
              msg.role === 'user' 
                ? 'bg-red-600 text-white' 
                : 'bg-slate-200 text-slate-600'
            }`}>
              {msg.role === 'user' ? <User size={18} /> : <Bot size={18} />}
            </div>
            <div className={`max-w-[75%] rounded-2xl p-4 ${
              msg.role === 'user'
                ? 'bg-red-600 text-white'
                : 'bg-white text-slate-800 shadow-sm border border-slate-100'
            }`}>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center">
              <Bot size={18} className="text-slate-600" />
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t border-slate-200">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Nhập câu hỏi của bạn..."
            className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="w-12 h-12 bg-red-600 text-white rounded-xl flex items-center justify-center hover:bg-red-700 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};
