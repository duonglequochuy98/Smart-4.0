
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
  CircuitBoard,
  Copy,
  Check,
  Lightbulb,
  Globe
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
  { id: 'classic', icon: <Bot size={20} />, color: 'bg-red-500', name: 'Smart Plus' },
  { id: 'friendly', icon: <Smile size={20} />, color: 'bg-emerald-500', name: 'Thân thiện' },
  { id: 'smart', icon: <Cpu size={20} />, color: 'bg-blue-500', name: 'Chuyên gia' },
  { id: 'dynamic', icon: <Zap size={20} />, color: 'bg-amber-500', name: 'Năng động' },
  { id: 'tech', icon: <CircuitBoard size={20} />, color: 'bg-indigo-500', name: 'Kỹ thuật' },
  { id: 'ghost', icon: <Ghost size={20} />, color: 'bg-slate-700', name: 'Tối giản' },
];

const SUGGESTIONS = [
  "Thủ tục làm Khai sinh?",
  "How to register marriage?",
  "Địa chỉ UBND Phường ở đâu?",
  "Certified copies fees?",
  "Làm sao để đặt lịch hẹn?"
];

export const AIAssistant: React.FC<AIAssistantProps> = ({ onBack }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Kính thưa ông/bà, tôi là Trợ lý AI Smart 4.0 Plus. Tôi hỗ trợ song ngữ Tiếng Việt & English. Ông/bà cần hỗ trợ thủ tục gì ạ? | Dear Citizen, I support both Vietnamese & English. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState<AvatarOption>(AVATAR_OPTIONS[0]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async (customInput?: string) => {
    const textToSend = customInput || input;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: Message = { role: 'user', text: textToSend };
    setMessages(prev => [...prev, userMsg]);
    if (!customInput) setInput('');
    setIsLoading(true);

    try {
      const reply = await geminiService.sendMessage(messages, textToSend);
      setMessages(prev => [...prev, { role: 'model', text: reply || 'Xin lỗi, tôi gặp sự cố khi xử lý yêu cầu.' }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: 'Hệ thống đang bận để cập nhật dữ liệu mới, kính mong ông/bà thử lại sau ít phút.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    });
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
            </button>
            <div>
              <h3 className="font-bold text-sm">Trợ lý {selectedAvatar.name}</h3>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                <p className="text-[10px] text-white/80 font-bold uppercase tracking-tighter">Bilingual AI v4.0+</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Globe size={16} className="text-white/60" />
          <span className="text-[10px] font-black uppercase tracking-widest">VN | EN</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 no-scrollbar" ref={scrollRef}>
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
            <div className={`max-w-[92%] flex gap-2.5 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-sm mt-1 transition-all ${
                m.role === 'user' ? 'bg-red-500 text-white' : `${selectedAvatar.color} text-white`
              }`}>
                {m.role === 'user' ? <User size={16} /> : selectedAvatar.icon}
              </div>
              <div className="relative group">
                <div className={`px-4 py-3 rounded-[20px] text-[14px] leading-[1.6] shadow-sm ${
                  m.role === 'user' 
                    ? 'bg-red-600 text-white rounded-tr-none' 
                    : 'bg-white border border-slate-100 text-slate-700 rounded-tl-none pr-10'
                }`}>
                  {formatMessageContent(m.text)}
                </div>
                {m.role === 'model' && (
                  <button 
                    onClick={() => handleCopy(m.text, i)}
                    className="absolute top-2 right-2 p-1.5 rounded-lg bg-slate-50 text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                  >
                    {copiedIndex === i ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                  </button>
                )}
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
              <div className="bg-white border border-red-50 px-4 py-3 rounded-[20px] rounded-tl-none shadow-md flex flex-col gap-2 min-w-[160px] relative overflow-hidden">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-bounce [animation-duration:0.6s]"></span>
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-bounce [animation-duration:0.6s] [animation-delay:0.2s]"></span>
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-bounce [animation-duration:0.6s] [animation-delay:0.4s]"></span>
                  </div>
                  <span className="text-[10px] font-black text-red-600 uppercase tracking-widest">AI is thinking...</span>
                </div>
                <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-red-600 w-1/3 rounded-full animate-[loading-slide_1.5s_infinite_ease-in-out]"></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Suggestions & Input */}
      <div className="p-4 border-t bg-white space-y-3">
        {messages.length < 4 && !isLoading && (
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {SUGGESTIONS.map((s, idx) => (
              <button 
                key={idx}
                onClick={() => handleSend(s)}
                className="flex items-center gap-1.5 px-4 py-2 bg-slate-50 border border-slate-100 rounded-full whitespace-nowrap text-[11px] font-bold text-slate-600 hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all active:scale-95"
              >
                <Lightbulb size={12} className="text-amber-500" />
                {s}
              </button>
            ))}
          </div>
        )}
        
        <div className="flex gap-2 bg-slate-100 p-1.5 rounded-[24px] items-center border border-slate-200/50 focus-within:ring-2 focus-within:ring-red-500/20 focus-within:bg-white transition-all">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your question here / Nhập câu hỏi..." 
            className="flex-1 bg-transparent px-4 py-2.5 text-sm focus:outline-none text-slate-700 placeholder:text-slate-400 font-bold"
          />
          <button 
            onClick={() => handleSend()}
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
              <h4 className="text-lg font-black text-slate-900 tracking-tight">AI Personalization</h4>
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
            <div className="mt-8 space-y-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                 <p className="text-[11px] font-bold text-slate-500 leading-relaxed italic">
                   "All responses follow current public administration procedures in Tay Thanh Ward."
                 </p>
              </div>
              <button 
                onClick={() => setShowAvatarPicker(false)}
                className="w-full h-14 bg-red-600 text-white rounded-2xl font-bold text-sm shadow-xl shadow-red-600/20 active:scale-[0.98] transition-all uppercase tracking-widest"
              >
                Confirm / Xác nhận
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
        .no-scrollbar::-webkit-scrollbar { display: none !important; }
        .no-scrollbar { -ms-overflow-style: none !important; scrollbar-width: none !important; }
      `}</style>
    </div>
  );
};
