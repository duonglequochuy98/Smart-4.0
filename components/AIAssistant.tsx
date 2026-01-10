
import React, { useState, useRef, useEffect } from 'react';
import { Message } from '../types';
import { geminiService } from '../services/geminiService';
import { 
  Send, 
  ArrowLeft, 
  Bot, 
  User, 
  Loader2, 
  Sparkles, 
  X, 
  Settings, 
  Cpu, 
  Ghost, 
  Smile, 
  Zap, 
  CircuitBoard 
} from 'lucide-react';

interface AIAssistantProps {
  onBack: () => void;
}

interface AvatarOption {
  id: string;
  icon: React.ReactNode;
  color: string;
  name: string;
}

const AVATAR_OPTIONS: AvatarOption[] = [
  { id: 'classic', icon: <Bot size={20} />, color: 'bg-red-500', name: 'Cổ điển' },
  { id: 'friendly', icon: <Smile size={20} />, color: 'bg-emerald-500', name: 'Thân thiện' },
  { id: 'smart', icon: <Cpu size={20} />, color: 'bg-blue-500', name: 'Thông minh' },
  { id: 'dynamic', icon: <Zap size={20} />, color: 'bg-amber-500', name: 'Năng động' },
  { id: 'tech', icon: <CircuitBoard size={20} />, color: 'bg-indigo-500', name: 'Công nghệ' },
  { id: 'ghost', icon: <Ghost size={20} />, color: 'bg-slate-700', name: 'Tối giản' },
];

export const AIAssistant: React.FC<AIAssistantProps> = ({ onBack }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Xin chào! Tôi là trợ lý AI của Phường Tây Thạnh. Tôi có thể giúp gì cho bạn về thủ tục hành chính hôm nay?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState<AvatarOption>(AVATAR_OPTIONS[0]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const reply = await geminiService.sendMessage(messages, input);
      setMessages(prev => [...prev, { role: 'model', text: reply || 'Xin lỗi, tôi gặp sự cố khi xử lý yêu cầu.' }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: 'Hệ thống đang bận, vui lòng thử lại sau.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatMessageContent = (text: string) => {
    return text.split('\n').map((line, index) => {
      const cleanLine = line.replace(/[*#]/g, '').trim();
      if (!cleanLine) return <div key={index} className="h-2" />;
      return <div key={index} className="mb-1 last:mb-0">{cleanLine}</div>;
    });
  };

  return (
    <div className="flex flex-col h-full bg-white relative">
      {/* Header */}
      <div className="p-4 border-b flex items-center justify-between bg-red-600 text-white shadow-md z-10">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-1 hover:bg-white/10 rounded-full transition-colors">
            <ArrowLeft size={24} />
          </button>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setShowAvatarPicker(true)}
              className="bg-white p-1.5 rounded-xl text-red-600 shadow-sm relative overflow-hidden group active:scale-95 transition-transform"
            >
              <div className={selectedAvatar.color + " p-1 rounded-lg text-white"}>
                {selectedAvatar.icon}
              </div>
              <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 border border-red-600">
                <Settings size={8} className="text-red-600" />
              </div>
            </button>
            <div>
              <h3 className="font-bold text-sm">Trợ lý {selectedAvatar.name}</h3>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                <p className="text-[10px] text-white/80 font-medium">Đang trực tuyến</p>
              </div>
            </div>
          </div>
        </div>
        <button 
          onClick={() => setShowAvatarPicker(true)}
          className="text-[10px] font-black uppercase bg-white/10 px-3 py-1.5 rounded-full hover:bg-white/20 transition-colors"
        >
          Đổi Avatar
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50" ref={scrollRef}>
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
            <div className={`max-w-[88%] flex gap-2.5 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-sm mt-1 transition-all ${
                m.role === 'user' ? 'bg-red-500 text-white' : `${selectedAvatar.color} text-white`
              }`}>
                {m.role === 'user' ? <User size={16} /> : selectedAvatar.icon}
              </div>
              <div className={`px-4 py-3 rounded-[20px] text-[14px] leading-[1.6] shadow-sm ${
                m.role === 'user' 
                  ? 'bg-red-600 text-white rounded-tr-none' 
                  : 'bg-white border border-slate-100 text-slate-700 rounded-tl-none'
              }`}>
                {formatMessageContent(m.text)}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex gap-2.5 items-start">
              <div className={`w-8 h-8 rounded-lg ${selectedAvatar.color} text-white flex items-center justify-center shadow-sm mt-1 animate-bounce`}>
                <Sparkles size={16} />
              </div>
              <div className="bg-white border border-red-50 px-4 py-3 rounded-[20px] rounded-tl-none shadow-md flex flex-col gap-2 min-w-[140px] relative overflow-hidden">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-bounce [animation-duration:0.6s]"></span>
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-bounce [animation-duration:0.6s] [animation-delay:0.2s]"></span>
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-bounce [animation-duration:0.6s] [animation-delay:0.4s]"></span>
                  </div>
                  <span className="text-[11px] font-black text-red-600 uppercase tracking-widest flex items-center">
                    AI đang soạn thảo
                    <span className="inline-flex w-4 ml-0.5">
                      <span className="animate-[ellipsis_1.5s_infinite]">...</span>
                    </span>
                  </span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-red-400 to-red-600 w-1/3 rounded-full animate-[loading-slide_1s_infinite_ease-in-out]"></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t bg-white">
        <div className="flex gap-2 bg-slate-100 p-1.5 rounded-[24px] items-center border border-slate-200/50">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Bạn cần hỗ trợ thủ tục gì?..." 
            className="flex-1 bg-transparent px-4 py-2.5 text-sm focus:outline-none text-slate-700 placeholder:text-slate-400 font-medium"
          />
          <button 
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="w-10 h-10 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700 transition-all disabled:opacity-40 shadow-md shadow-red-600/20 active:scale-90"
          >
            {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} fill="currentColor" />}
          </button>
        </div>
      </div>

      {/* Avatar Picker Modal */}
      {showAvatarPicker && (
        <div className="absolute inset-0 z-[100] animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowAvatarPicker(false)}></div>
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[32px] p-6 shadow-2xl animate-in slide-in-from-bottom duration-500">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-lg font-black text-slate-900 tracking-tight">Tùy chọn Trợ lý AI</h4>
              <button onClick={() => setShowAvatarPicker(false)} className="w-10 h-10 flex items-center justify-center bg-slate-100 rounded-full text-slate-500">
                <X size={20} />
              </button>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {AVATAR_OPTIONS.map((opt) => (
                <button 
                  key={opt.id}
                  onClick={() => {
                    setSelectedAvatar(opt);
                    setShowAvatarPicker(false);
                  }}
                  className={`flex flex-col items-center gap-2 p-3 rounded-2xl transition-all border-2 ${
                    selectedAvatar.id === opt.id 
                      ? 'border-red-600 bg-red-50 scale-105' 
                      : 'border-slate-50 bg-slate-50 hover:bg-slate-100'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-sm ${opt.color}`}>
                    {opt.icon}
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-tight ${
                    selectedAvatar.id === opt.id ? 'text-red-600' : 'text-slate-500'
                  }`}>
                    {opt.name}
                  </span>
                </button>
              ))}
            </div>
            <div className="mt-8">
              <button 
                onClick={() => setShowAvatarPicker(false)}
                className="w-full h-14 bg-red-600 text-white rounded-2xl font-bold text-sm shadow-xl shadow-red-600/20 active:scale-[0.98] transition-all"
              >
                Xác nhận thay đổi
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes loading-slide {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(300%); }
        }
        @keyframes ellipsis {
          0% { content: '.'; opacity: 0.3; }
          33% { content: '..'; opacity: 0.6; }
          66% { content: '...'; opacity: 1; }
          100% { content: '.'; opacity: 0.3; }
        }
      `}</style>
    </div>
  );
};
