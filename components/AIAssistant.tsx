import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send, Mic, MicOff, Bot, User, Loader2, Sparkles } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/genai';

interface Message {
  role: 'user' | 'model';
  text: string;
}

interface AIAssistantProps {
  onBack: () => void;
}

// Khởi tạo Gemini AI
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyDemoKey123');

export const AIAssistant: React.FC<AIAssistantProps> = ({ onBack }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      text: 'Xin chào! Tôi là trợ lý ảo AI của Phường Tây Thạnh. Tôi có thể giúp bạn:\n\n• Tra cứu thủ tục hành chính\n• Hướng dẫn nộp hồ sơ trực tuyến\n• Kiểm tra lịch làm việc\n• Giải đáp thắc mắc về dịch vụ công\n\nBạn cần hỗ trợ gì ạ?'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [apiStatus, setApiStatus] = useState<'ready' | 'error'>('ready');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Cuộn xuống tin nhắn mới nhất
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Khởi tạo Speech Recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'vi-VN';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      alert('Trình duyệt không hỗ trợ nhận diện giọng nói');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  // Xử lý gửi tin nhắn với Gemini API
  const handleSend = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      text: inputText.trim()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      // Khởi tạo model Gemini
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

      // Tạo system prompt
      const systemPrompt = `Bạn là trợ lý ảo AI của UBND Phường Tây Thạnh, Quận Tân Phú, TP.HCM.

NHIỆM VỤ:
- Hỗ trợ người dân về các thủ tục hành chính công
- Hướng dẫn cách nộp hồ sơ trực tuyến
- Giải đáp thắc mắc về dịch vụ công
- Cung cấp thông tin về lịch làm việc, địa chỉ liên hệ

THÔNG TIN CƠ BẢN:
- Địa chỉ: 206 Tân Kỳ Tân Quý, Phường Tây Thạnh, Quận Tân Phú, TP.HCM
- Điện thoại: (028) 3816 3264
- Email: phuongtaythanh@tanphu.hochiminhcity.gov.vn
- Giờ làm việc: 7h-11h30 & 13h-17h (Thứ 2-6)
- Zalo OA: Tây Thạnh Smart 4.0
- Website: https://tanphu.hochiminhcity.gov.vn

THỦ TỤC PHỔ BIẾN:
1. Chứng thực bản sao: Phí 2.000đ/trang, thời gian 15 phút
2. Đăng ký khai sinh: Miễn phí, thời gian 2 ngày
3. Đăng ký kết hôn: Phí 50.000đ, thời gian 3 ngày
4. Đăng ký thường trú: Miễn phí, thời gian 5 ngày
5. Cấp sổ hộ khẩu: Phí 10.000đ, thời gian 3 ngày

YÊU CẦU TRẢ LỜI:
- Ngắn gọn, rõ ràng, thân thiện
- Sử dụng emoji phù hợp
- Nếu không chắc chắn, hướng dẫn liên hệ trực tiếp
- Luôn kết thúc bằng câu hỏi "Bạn cần hỗ trợ thêm gì không ạ?"

CÂU HỎI: ${userMessage.text}`;

      // Gọi Gemini API
      const result = await model.generateContent(systemPrompt);
      const response = await result.response;
      const text = response.text();

      if (text) {
        const aiResponse: Message = {
          role: 'model',
          text: text
        };
        setMessages(prev => [...prev, aiResponse]);
        setApiStatus('ready');
      } else {
        throw new Error('Không nhận được phản hồi từ AI');
      }
    } catch (error) {
      console.error('Lỗi Gemini API:', error);
      setApiStatus('error');
      
      // Phản hồi khi API lỗi
      const errorResponse: Message = {
        role: 'model',
        text: '⚠️ Xin lỗi, hệ thống AI tạm thời gặp sự cố. Bạn có thể:\n\n📞 Gọi hotline: (028) 3816 3264\n💬 Chat Zalo OA: Tây Thạnh Smart 4.0\n🏢 Đến trực tiếp: 206 Tân Kỳ Tân Quý\n\nHoặc thử lại sau vài giây ạ!'
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  // Phản hồi dự phòng khi API lỗi
  const getFallbackResponse = (question: string): Message => {
    const lowerQ = question.toLowerCase();
    
    if (lowerQ.includes('giờ') || lowerQ.includes('lịch') || lowerQ.includes('làm việc')) {
      return {
        role: 'model',
        text: 'Phường Tây Thạnh làm việc:\n• Sáng: 7h00 - 11h30\n• Chiều: 13h00 - 17h00\n• Thứ 2 đến Thứ 6 (trừ ngày lễ)\n\nBộ phận một cửa tiếp nhận hồ sơ cả ngày không nghỉ trưa.'
      };
    }
    
    if (lowerQ.includes('địa chỉ') || lowerQ.includes('ở đâu') || lowerQ.includes('đường')) {
      return {
        role: 'model',
        text: '📍 Địa chỉ UBND Phường Tây Thạnh:\n206 Tân Kỳ Tân Quý, Phường Tây Thạnh, Quận Tân Phú, TP.HCM\n\n☎️ Điện thoại: (028) 3816 3264\n📧 Email: phuongtaythanh@tanphu.hochiminhcity.gov.vn'
      };
    }
    
    if (lowerQ.includes('thủ tục') || lowerQ.includes('hồ sơ') || lowerQ.includes('giấy tờ')) {
      return {
        role: 'model',
        text: 'Một số thủ tục phổ biến:\n\n1. Chứng thực bản sao\n2. Đăng ký khai sinh\n3. Đăng ký khai tử\n4. Đăng ký kết hôn\n5. Đăng ký thường trú\n6. Cấp giấy xác nhận\n\nBạn muốn biết chi tiết thủ tục nào ạ?'
      };
    }
    
    if (lowerQ.includes('online') || lowerQ.includes('trực tuyến') || lowerQ.includes('nộp hồ sơ')) {
      return {
        role: 'model',
        text: 'Để nộp hồ sơ trực tuyến:\n\n1. Truy cập Cổng dịch vụ công TP.HCM\n2. Đăng nhập tài khoản (hoặc đăng ký mới)\n3. Chọn thủ tục cần làm\n4. Điền thông tin và upload giấy tờ\n5. Nộp hồ sơ và nhận mã tra cứu\n\nBạn có thể tra cứu kết quả tại mục "Tra cứu" trong ứng dụng này.'
      };
    }
    
    return {
      role: 'model',
      text: 'Xin lỗi, tôi đang gặp sự cố kết nối. Vui lòng:\n\n• Thử lại sau vài phút\n• Liên hệ trực tiếp: (028) 3816 3264\n• Chat qua Zalo OA: Tây Thạnh Smart 4.0\n\nHoặc bạn có thể đến trực tiếp tại:\n📍 206 Tân Kỳ Tân Quý, P.Tây Thạnh, Q.Tân Phú'
    };
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="h-full bg-white flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-gradient-to-r from-red-600 to-red-700 text-white p-4 shadow-lg">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 transition-all"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center gap-3 flex-1">
            <div className="w-11 h-11 bg-white/20 rounded-xl flex items-center justify-center border-2 border-white/30">
              <Bot size={24} />
            </div>
            <div>
              <h2 className="font-bold text-[15px]">Trợ lý AI Tây Thạnh</h2>
              <p className="text-[11px] text-white/80">Hỗ trợ 24/7</p>
            </div>
          </div>
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
              msg.role === 'user' 
                ? 'bg-red-600 text-white' 
                : 'bg-slate-100 text-red-600'
            }`}>
              {msg.role === 'user' ? <User size={18} /> : <Bot size={18} />}
            </div>
            <div className={`max-w-[75%] rounded-2xl px-4 py-3 ${
              msg.role === 'user'
                ? 'bg-red-600 text-white'
                : 'bg-slate-100 text-slate-800'
            }`}>
              <p className="text-[13px] leading-relaxed whitespace-pre-wrap">{msg.text}</p>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-slate-100 text-red-600">
              <Bot size={18} />
            </div>
            <div className="bg-slate-100 rounded-2xl px-4 py-3">
              <div className="flex gap-1.5">
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
      <div className="sticky bottom-0 bg-white border-t border-slate-100 p-4">
        <div className="flex gap-2 items-end">
          <button
            onClick={toggleVoiceInput}
            className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all ${
              isListening 
                ? 'bg-red-600 text-white animate-pulse' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {isListening ? <MicOff size={20} /> : <Mic size={20} />}
          </button>
          
          <div className="flex-1 bg-slate-50 rounded-2xl border border-slate-200 focus-within:border-red-300 transition-colors">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Nhập câu hỏi của bạn..."
              className="w-full bg-transparent px-4 py-3 text-[14px] resize-none outline-none max-h-32"
              rows={1}
              disabled={isLoading}
            />
          </div>
          
          <button
            onClick={handleSend}
            disabled={!inputText.trim() || isLoading}
            className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all ${
              inputText.trim() && !isLoading
                ? 'bg-red-600 text-white hover:bg-red-700 active:scale-95'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            }`}
          >
            {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
          </button>
        </div>
        
        {isListening && (
          <p className="text-center text-[11px] text-red-600 mt-2 font-medium">
            🎤 Đang lắng nghe...
          </p>
        )}
      </div>
    </div>
  );
};
