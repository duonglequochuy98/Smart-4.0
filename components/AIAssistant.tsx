import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send, Bot, User } from 'lucide-react';
import { Message } from '../types';

interface AIAssistantProps {
  onBack: () => void;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({ onBack }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Xin chào! Tôi là trợ lý ảo của UBND Phường Tây Thạnh. Tôi có thể giúp gì cho bạn?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        'Để đăng ký khai sinh, bạn cần chuẩn bị giấy chứng sinh, CMND/CCCD của bố mẹ, và sổ hộ khẩu.',
        'Thời gian xử lý hồ sơ chứng thực thường là 1-2 ngày làm việc.',
        'Bạn có thể đặt lịch hẹn trực tuyến qua tính năng "Đặt lịch" để không phải chờ đợi.',
        'Phí dịch vụ sẽ tùy thuộc vào loại thủ tục. Bạn cần thủ tục gì để tôi tra cứu chi tiết?'
      ];
      
      const aiMessage: Message = {
        role: 'model',
        text: responses[Math.floor(Math.random() * responses.length)]
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="h-full bg-slate-50 flex flex-col">
      <div className="sticky top-0 bg-white border-b border-slate-100 p-5 flex items-center gap-3 z-10">
        <button onClick={onBack} className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 hover:bg-slate-100">
          <ArrowLeft size={20} />
        </button>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
            <Bot className="text-red-600" size={20} />
          </div>
          <div>
            <h1 className="text-base font-black text-slate-800">Trợ lý AI</h1>
            <p className="text-xs text-green-600 font-bold">● Đang hoạt động</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
              msg.role === 'user' ? 'bg-red-600' : 'bg-slate-200'
            }`}>
              {msg.role === 'user' ? (
                <User className="text-white" size={16} />
              ) : (
                <Bot className="text-slate-600" size={16} />
              )}
            </div>
            <div className={`max-w-[75%] p-3 rounded-2xl ${
              msg.role === 'user' 
                ? 'bg-red-600 text-white rounded-tr-sm' 
                : 'bg-white text-slate-800 rounded-tl-sm border border-slate-100'
            }`}>
              <p className="text-sm leading-relaxed">{msg.text}</p>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex gap-3">
            <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center">
              <Bot className="text-slate-600" size={16} />
            </div>
            <div className="bg-white p-4 rounded-2xl rounded-tl-sm border border-slate-100">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-slate-100 p-4 bg-white">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Nhập câu hỏi của bạn..."
            className="flex-1 h-12 px-4 border border-slate-200 rounded-xl focus:outline-none focus:border-red-500"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="w-12 h-12 bg-red-600 text-white rounded-xl flex items-center justify-center disabled:opacity-50"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};
