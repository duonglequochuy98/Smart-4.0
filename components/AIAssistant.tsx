import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Message } from "../types";
import { ArrowLeft, Send, Mic, X, AlertCircle } from 'lucide-react';

interface AIAssistantProps {
  onBack: () => void;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({ onBack }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      text: 'Xin chào! Tôi là trợ lý ảo của UBND Phường Tây Thạnh. Tôi có thể giúp bạn:\n\n• Tra cứu thủ tục hành chính\n• Hướng dẫn nộp hồ sơ trực tuyến\n• Giải đáp chính sách pháp luật\n• Đặt lịch hẹn\n\nBạn cần hỗ trợ gì?'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiKeyStatus, setApiKeyStatus] = useState<'checking' | 'ok' | 'missing'>('checking');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isListening, setIsListening] = useState(false);

  const genAI = useRef<GoogleGenerativeAI | null>(null);
  
  useEffect(() => {
    // Thử nhiều cách lấy API key
    let apiKey = '';
    
    // Cách 1: Vite env variable (cho production Vercel)
    if (import.meta.env.VITE_GEMINI_API_KEY) {
      apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      console.log('✅ API Key loaded from VITE_GEMINI_API_KEY');
    }
    // Cách 2: Process env (backup)
    else if (typeof process !== 'undefined' && process.env?.GEMINI_API_KEY) {
      apiKey = process.env.GEMINI_API_KEY;
      console.log('✅ API Key loaded from GEMINI_API_KEY');
    }
    // Cách 3: Hardcoded cho testing (XÓA SAU KHI DEPLOY)
    else {
      console.error('❌ No API key found in environment variables');
      console.log('Available env vars:', Object.keys(import.meta.env));
    }
    
    if (apiKey && apiKey.startsWith('AIza')) {
      genAI.current = new GoogleGenerativeAI(apiKey);
      setApiKeyStatus('ok');
      console.log('✅ Gemini AI initialized successfully');
    } else {
      setApiKeyStatus('missing');
      console.error('❌ Invalid or missing API key');
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;
    
    if (apiKeyStatus === 'missing' || !genAI.current) {
      const errorMsg: Message = {
        role: 'model',
        text: '⚠️ Lỗi cấu hình: API key chưa được thiết lập.\n\nVui lòng:\n1. Thêm VITE_GEMINI_API_KEY vào Vercel Environment Variables\n2. Redeploy lại ứng dụng\n\nHoặc liên hệ admin để được hỗ trợ.'
      };
      setMessages(prev => [...prev, errorMsg]);
      return;
    }

    const userMessage: Message = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const model = genAI.current.getGenerativeModel({ 
        model: "gemini-2.0-flash-exp",
        systemInstruction: `Bạn là Trợ lý AI Smart 4.0 Plus của UBND Phường Tây Thạnh, Quận Tân Phú, TP.HCM - một trợ lý ảo song ngữ Việt-Anh thông minh và thân thiện.

🎯 NHIỆM VỤ CHÍNH:
- Hỗ trợ người dân về thủ tục hành chính công 24/7
- Hướng dẫn nộp hồ sơ trực tuyến, đặt lịch hẹn
- Giải đáp chính sách, pháp luật địa phương
- Tra cứu tiến độ giải quyết hồ sơ
- Cung cấp thông tin về dịch vụ công

📋 CÁC THỦ TỤC PHỔ BIẾN:
1. Đăng ký khai sinh
2. Chứng thực bản sao
3. Đăng ký thường trú/tạm trú
4. Cấp giấy xác nhận độc thân
5. Đăng ký kết hôn
6. Cấp sổ hộ khẩu
7. Đổi giấy phép lái xe

💡 PHONG CÁCH GIAO TIẾP:
- Lịch sự, chuyên nghiệp, nhiệt tình
- Trả lời súc tích, rõ ràng, dễ hiểu
- Sử dụng emoji phù hợp (📌 📝 ✅ ⏰ 📞)
- Ưu tiên giải pháp nhanh nhất
- Luôn song ngữ Việt-Anh nếu người dùng hỏi bằng tiếng Anh

📞 THÔNG TIN LIÊN HỆ:
- Địa chỉ: 102 Tây Thạnh, P.Tây Thạnh, Q.Tân Phú, TP.HCM
- Hotline: 028.3815.8989
- Email: taythanh@tanphu.hochiminhcity.gov.vn
- Giờ làm việc: 7h30-11h30 & 13h30-17h (T2-T6)

⚠️ LƯU Ý:
- Nếu không chắc chắn → hướng dẫn liên hệ trực tiếp
- Luôn đề xuất dịch vụ trực tuyến khi có thể
- Không yêu cầu thông tin cá nhân nhạy cảm
- Với câu hỏi phức tạp → gợi ý đặt lịch gặp trực tiếp`
      });

      const chat = model.startChat({
        history: messages.slice(1).map(msg => ({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text }]
        }))
      });

      const result = await chat.sendMessage(input);
      const response = await result.response;
      const botMessage: Message = { 
        role: 'model', 
        text: response.text() 
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error: any) {
      console.error('❌ Gemini API Error:', error);
      
      let errorText = 'Xin lỗi, đã có lỗi xảy ra. ';
      
      if (error.message?.includes('API_KEY')) {
        errorText += 'API key không hợp lệ. Vui lòng kiểm tra cấu hình.';
      } else if (error.message?.includes('quota')) {
        errorText += 'Đã vượt giới hạn sử dụng API. Vui lòng thử lại sau.';
      } else if (error.message?.includes('SAFETY')) {
        errorText += 'Nội dung không phù hợp. Vui lòng diễn đạt lại câu hỏi.';
      } else {
        errorText += `Vui lòng thử lại sau hoặc liên hệ hotline: 028.3815.8989\n\nChi tiết lỗi: ${error.message || 'Unknown error'}`;
      }
      
      const errorMessage: Message = {
        role: 'model',
        text: errorText
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Trình duyệt của bạn không hỗ trợ nhận dạng giọng nói');
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'vi-VN';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
      alert('Không thể nhận dạng giọng nói. Vui lòng thử lại.');
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  return (
    <div className="h-full bg-white flex flex-col">
      {/* Header */}
      <div className="sticky top-0 p-5 pt-7 flex justify-between items-center z-30 bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack} 
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/20 hover:bg-white/30 active:scale-90 transition-all"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="font-black text-lg">Trợ lý AI Smart Plus</h1>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${apiKeyStatus === 'ok' ? 'bg-green-400' : apiKeyStatus === 'missing' ? 'bg-red-400' : 'bg-yellow-400'}`}></div>
              <p className="text-xs text-white/80">
                {apiKeyStatus === 'ok' ? 'Bilingual AI 4.0+' : apiKeyStatus === 'missing' ? 'Offline' : 'Checking...'}
              </p>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-1.5 bg-white/20 rounded-lg text-xs font-bold hover:bg-white/30">
            VN
          </button>
          <button className="px-3 py-1.5 bg-white/10 rounded-lg text-xs font-bold hover:bg-white/20">
            EN
          </button>
        </div>
      </div>

      {/* API Key Warning */}
      {apiKeyStatus === 'missing' && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 m-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="text-red-500 mt-0.5" size={20} />
            <div className="flex-1">
              <p className="text-sm font-bold text-red-800">Chưa cấu hình API Key</p>
              <p className="text-xs text-red-600 mt-1">
                Vui lòng thêm <code className="bg-red-100 px-1 py-0.5 rounded">VITE_GEMINI_API_KEY</code> vào Environment Variables trên Vercel
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                msg.role === 'user'
                  ? 'bg-red-600 text-white rounded-br-sm'
                  : 'bg-white text-slate-800 shadow-sm rounded-bl-sm border border-slate-100'
              }`}
            >
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white rounded-2xl px-4 py-3 shadow-sm border border-slate-100">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t border-slate-200">
        <div className="flex gap-2 items-end">
          <div className="flex-1 relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Nhập câu hỏi của bạn..."
              className="w-full px-4 py-3 pr-12 rounded-2xl border-2 border-slate-200 focus:border-red-500 focus:outline-none text-sm"
              disabled={isLoading}
            />
            <button
              onClick={handleVoiceInput}
              disabled={isLoading || isListening}
              className={`absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full transition-all ${
                isListening 
                  ? 'bg-red-600 text-white animate-pulse' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {isListening ? <X size={18} /> : <Mic size={18} />}
            </button>
          </div>
          <button
            onClick={sendMessage}
            disabled={isLoading || !input.trim() || apiKeyStatus === 'missing'}
            className="w-12 h-12 bg-red-600 text-white rounded-2xl flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-red-700 active:scale-95 transition-all shadow-lg"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};
