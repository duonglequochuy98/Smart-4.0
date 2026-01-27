
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
  Globe,
  Languages
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

type Language = 'vi' | 'en';

const AVATAR_OPTIONS: AvatarOption[] = [
  { id: 'classic', icon: <Bot size={20} />, color: 'bg-red-500', name: 'Smart Plus' },
  { id: 'friendly', icon: <Smile size={20} />, color: 'bg-emerald-500', name: 'Thân thiện' },
  { id: 'smart', icon: <Cpu size={20} />, color: 'bg-blue-500', name: 'Chuyên gia' },
  { id: 'dynamic', icon: <Zap size={20} />, color: 'bg-amber-500', name: 'Năng động' },
  { id: 'tech', icon: <CircuitBoard size={20} />, color: 'bg-indigo-500', name: 'Kỹ thuật' },
  { id: 'ghost', icon: <Ghost size={20} />, color: 'bg-slate-700', name: 'Tối giản' },
];

const SUGGESTIONS = {
  vi: [
    "Thủ tục làm Khai sinh?",
    "Địa chỉ UBND Phường ở đâu?",
    "Làm sao để đặt lịch hẹn?",
    "Phó Giám đốc Trung tâm là ai?",
    "Phí chứng thực bản sao?"
  ],
  en: [
    "Birth registration process?",
    "Where is the Ward Office?",
    "How to book an appointment?",
    "Who is the Deputy Director?",
    "Notarization service fees?"
  ]
};

const UI_TEXT = {
  vi: {
    title: 'Trợ lý',
    placeholder: 'Nhập câu hỏi của ông/bà...',
    thinking: 'Trợ lý đang xử lý',
    welcome: 'Kính chào ông/bà, tôi là Trợ lý AI Smart 4.0 Plus của Phường Tây Thạnh. Tôi có thể giúp gì cho ông/bà hôm nay?',
    confirm: 'Xác nhận',
    personalization: 'Cá nhân hóa AI',
    selectLang: 'Chọn ngôn ngữ',
    selectAvatar: 'Chọn ảnh đại diện trợ lý'
  },
  en: {
    title: 'Assistant',
    placeholder: 'Type your question here...',
    thinking: 'AI is thinking',
    welcome: 'Welcome, I am the Smart 4.0 Plus AI Assistant of Tay Thanh Ward. How can I assist you today?',
    confirm: 'Confirm',
    personalization: 'AI Personalization',
    selectLang: 'Select language',
    selectAvatar: 'Select assistant avatar'
  }
};

export const AIAssistant: React.FC<AIAssistantProps> = ({ onBack }) => {
  // Load initial preferences from localStorage
  const [lang, setLang] = useState<Language>(() => {
    return (localStorage.getItem('smart_taythanh_ai_lang') as Language) || 'vi';
  });
  const [selectedAvatar, setSelectedAvatar] = useState<AvatarOption>(() => {
    const savedId = localStorage.getItem('smart_taythanh_ai_avatar_id');
    return AVATAR_OPTIONS.find(a => a.id === savedId) || AVATAR_OPTIONS[0];
  });

  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: UI_TEXT[lang].welcome }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPersonalization, setShowPersonalization] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Persistence Effects
  useEffect(() => {
    localStorage.setItem('smart_taythanh_ai_lang', lang);
  }, [lang]);

  useEffect(() => {
    localStorage.setItem('smart_taythanh_ai_avatar_id', selectedAvatar.id);
  }, [selectedAvatar]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  useEffect(() => {
    if (messages.length === 1) {
      setMessages([{ role: 'model', text: UI_TEXT[lang].welcome }]);
    }
  }, [lang]);

  const handleSend = async (customInput?: string) => {
    const textToSend = customInput || input;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: Message = { role: 'user', text: textToSend };
    setMessages(prev => [...prev, userMsg]);
    if (!customInput) setInput('');
    setIsLoading(true);

    try {
      const langInstruction = lang === 'en' ? "Please respond in English." : "Hãy phản hồi bằng tiếng Việt.";
      const reply = await geminiService.sendMessage(messages, `${langInstruction} User input: ${textToSend}`);
      setMessages(prev => [...prev, { role: 'model', text: reply || (lang === 'vi' ? 'Xin lỗi, tôi gặp sự cố.' : 'Sorry, I encountered an error.') }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'model', 
        text: lang === 'vi' 
          ? 'Hệ thống đang bận cập nhật, vui lòng thử lại sau.' 
          : 'System is busy updating, please try again later.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    }).catch(err => {
      console.error('Copy failed: ', err);
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
      <div className="p-4 border-b flex items-center justify-between bg-red-600 text-white shadow-md z-10">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-1 hover:bg-white/10 rounded-full transition-colors">
            <ArrowLeft size={24} />
          </button>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setShowPersonalization(true)}
              className="bg-white p-1.5 rounded-xl text-red-600 shadow-sm relative overflow-hidden group active:scale-95 transition-transform"
            >
              <div className={selectedAvatar.color + " p-1 rounded-lg text-white"}>
                {selectedAvatar.icon}
              </div>
            </button>
            <div onClick={() => setShowPersonalization(true)} className="cursor-pointer">
              <h3 className="font-bold text-sm">{UI_TEXT[lang].title} {selectedAvatar.name}</h3>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                <p className="text-[10px] text-white/80 font-bold uppercase tracking-tighter">Bilingual AI v4.0+</p>
              </div>
            </div>
          </div>
        </div>
        
        <button 
          onClick={() => setShowPersonalization(true)}
          className="w-10 h-10 flex items-center justify-center bg-red-700/50 rounded-xl border border-white/10 hover:bg-white/10 transition-colors"
        >
          <Settings size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 no-scrollbar" ref={scrollRef}>
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
            <div className={`max-w-[92%] flex gap-2.5 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-sm mt-1 transition-all ${
                m.role === 'user' ? 'bg-red-500 text-white' : `${selectedAvatar.color} text-white shadow-md`
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
                    title="Copy message"
                  >
                    {copiedIndex === i ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start animate-in fade-in duration-300">
            <div className="flex gap-2.5 items-start">
              <div className={`w-8 h-8 rounded-lg ${selectedAvatar.color} text-white flex items-center justify-center shadow-lg mt-1 animate-bounce shadow-red-500/20`}>
                <Sparkles size={16} />
              </div>
              <div className="bg-white border border-red-50 px-5 py-3.5 rounded-[24px] rounded-tl-none shadow-xl flex flex-col gap-2.5 min-w-[180px] relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-amber-500 to-red-500 animate-[loading-shimmer_2s_infinite_linear] bg-[length:200%_100%]"></div>
                <div className="flex items-center gap-3">
                   <div className="flex gap-1 items-center">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-[loading-dot_1.4s_infinite_ease-in-out]"></span>
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-[loading-dot_1.4s_infinite_ease-in-out_0.2s]"></span>
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-[loading-dot_1.4s_infinite_ease-in-out_0.4s]"></span>
                  </div>
                  <span className="text-[11px] font-black text-red-600 uppercase tracking-[0.15em] flex items-center">
                    {UI_TEXT[lang].thinking}
                    <span className="inline-flex w-4 ml-0.5">
                       <span className="animate-[ellipsis_1.5s_infinite] after:content-['...']"></span>
                    </span>
                  </span>
                </div>
                <p className="text-[10px] font-bold text-slate-400 italic">Hệ thống đang tìm kiếm dữ liệu tốt nhất</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t bg-white space-y-3">
        {messages.length < 5 && !isLoading && (
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {SUGGESTIONS[lang].map((s, idx) => (
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
            placeholder={UI_TEXT[lang].placeholder} 
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

      {showPersonalization && (
        <div className="absolute inset-0 z-[100] animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowPersonalization(false)}></div>
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[32px] p-6 shadow-2xl animate-in slide-in-from-bottom duration-500 max-h-[90%] overflow-y-auto no-scrollbar">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-lg font-black text-slate-900 tracking-tight">{UI_TEXT[lang].personalization}</h4>
              <button onClick={() => setShowPersonalization(false)} className="w-10 h-10 flex items-center justify-center bg-slate-100 rounded-full text-slate-500 active:scale-90 transition-transform">
                <X size={20} />
              </button>
            </div>

            {/* Language Selection Section */}
            <div className="mb-8 space-y-4">
              <div className="flex items-center gap-2 text-slate-400">
                <Languages size={14} />
                <p className="text-[10px] font-black uppercase tracking-widest">{UI_TEXT[lang].selectLang}</p>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => setLang('vi')}
                  className={`flex-1 h-12 rounded-2xl border-2 font-black text-sm flex items-center justify-center gap-2 transition-all ${lang === 'vi' ? 'bg-red-50 border-red-600 text-red-600' : 'bg-white border-slate-100 text-slate-400'}`}
                >
                  Tiếng Việt
                  {lang === 'vi' && <Check size={16} />}
                </button>
                <button 
                  onClick={() => setLang('en')}
                  className={`flex-1 h-12 rounded-2xl border-2 font-black text-sm flex items-center justify-center gap-2 transition-all ${lang === 'en' ? 'bg-red-50 border-red-600 text-red-600' : 'bg-white border-slate-100 text-slate-400'}`}
                >
                  English
                  {lang === 'en' && <Check size={16} />}
                </button>
              </div>
            </div>

            {/* Avatar Selection Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-slate-400">
                <Bot size={14} />
                <p className="text-[10px] font-black uppercase tracking-widest">{UI_TEXT[lang].selectAvatar}</p>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {AVATAR_OPTIONS.map((opt) => (
                  <button 
                    key={opt.id}
                    onClick={() => setSelectedAvatar(opt)}
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
            </div>

            <div className="mt-8 space-y-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                 <p className="text-[11px] font-bold text-slate-500 leading-relaxed italic">
                   {lang === 'vi' 
                     ? '"Tất cả câu trả lời tuân thủ quy định hành chính hiện hành tại Phường Tây Thạnh."'
                     : '"All responses comply with current administrative regulations in Tay Thanh Ward."'}
                 </p>
              </div>
              <button 
                onClick={() => setShowPersonalization(false)}
                className="w-full h-14 bg-red-600 text-white rounded-2xl font-bold text-sm shadow-xl shadow-red-600/20 active:scale-[0.98] transition-all uppercase tracking-widest"
              >
                {UI_TEXT[lang].confirm}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes loading-shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes loading-dot {
          0%, 80%, 100% { transform: scale(0); opacity: 0.5; }
          40% { transform: scale(1); opacity: 1; }
        }
        @keyframes ellipsis {
          0% { opacity: 0; }
          25% { opacity: 1; }
          50% { opacity: 0; }
          100% { opacity: 0; }
        }
        .no-scrollbar::-webkit-scrollbar { display: none !important; }
        .no-scrollbar { -ms-overflow-style: none !important; scrollbar-width: none !important; }
      `}</style>
    </div>
  );
};
