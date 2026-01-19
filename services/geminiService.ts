import { GoogleGenerativeAI } from '@google/generative-ai';
import { Message } from '../types';

// Đọc API key từ Vercel Environment Variables
const API_KEY = process.env.GEMINI_API_KEY || import.meta.env.VITE_GEMINI_API_KEY || '';

if (!API_KEY) {
  console.warn('⚠️ GEMINI_API_KEY not found in environment variables');
}

const genAI = new GoogleGenerativeAI(API_KEY);

export const geminiService = {
  async sendMessage(messages: Message[], userInput: string): Promise<string> {
    // Nếu không có API key, dùng fallback
    if (!API_KEY || API_KEY.length < 10) {
      return fallbackResponse(userInput);
    }

    try {
      const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 500,
        }
      });

      const systemPrompt = `Bạn là Trợ lý AI Smart 4.0 Plus của UBND Phường Tây Thạnh, Quận Tân Phú, TP.HCM.

📍 THÔNG TIN LIÊN HỆ:
- Địa chỉ: 206 Tân Kỳ Tân Quý, Phường Tây Thạnh, Quận Tân Phú, TP.HCM
- Điện thoại: (028) 3816 3264
- Email: phuongtaythanh@tanphu.hochiminhcity.gov.vn
- Giờ làm việc: 7h00-11h30 & 13h00-17h00 (Thứ 2-6)

📋 THỦ TỤC HÀNH CHÍNH:
1. Chứng thực bản sao: 2.000đ/trang, 15 phút
2. Đăng ký khai sinh: Miễn phí, 2 ngày
3. Đăng ký kết hôn: 50.000đ, 3 ngày
4. Đăng ký thường trú: Miễn phí, 5 ngày
5. Cấp sổ hộ khẩu: 10.000đ, 3 ngày

YÊU CẦU:
- Trả lời ngắn gọn (2-4 câu)
- Sử dụng emoji: 📍🕐💰✅
- Kết thúc: "Bạn cần hỗ trợ thêm gì không ạ?"

CÂU HỎI: ${userInput}`;

      const result = await model.generateContent(systemPrompt);
      const response = await result.response;
      const text = response.text();

      if (!text || text.trim().length === 0) {
        throw new Error('Empty response');
      }

      return text;

    } catch (error: any) {
      console.error('❌ Gemini API Error:', error.message);
      return fallbackResponse(userInput);
    }
  }
};

// Fallback responses khi API lỗi
function fallbackResponse(userInput: string): string {
  const input = userInput.toLowerCase().trim();

  if (input.includes('khai sinh')) {
    return '👶 **Đăng ký Khai sinh:**\n\n💰 Phí: Miễn phí\n⏱️ Thời gian: 2 ngày\n\n📋 Cần: Giấy khai sinh từ BV, CCCD bố mẹ, Giấy kết hôn\n\n📍 Nộp tại: 206 Tân Kỳ Tân Quý\n\nBạn cần hỗ trợ thêm gì không ạ?';
  }

  if (input.includes('chứng thực')) {
    return '📄 **Chứng thực bản sao:**\n\n💰 Phí: 2.000đ/trang\n⏱️ Thời gian: 15 phút\n\n📋 Cần: CCCD + Bản gốc\n\n✅ Làm ngay không cần hẹn\n\nBạn cần hỗ trợ thêm gì không ạ?';
  }

  if (input.includes('địa chỉ') || input.includes('ở đâu')) {
    return '📍 **Địa chỉ:**\n206 Tân Kỳ Tân Quý, P.Tây Thạnh, Q.Tân Phú\n\n📞 Hotline: (028) 3816 3264\n\n🕐 Giờ làm việc: 7h-11h30 & 13h-17h (T2-T6)\n\nBạn cần hỗ trợ thêm gì không ạ?';
  }

  if (input.includes('giờ') || input.includes('làm việc')) {
    return '🕐 **Giờ làm việc:**\n• Sáng: 7h00-11h30\n• Chiều: 13h00-17h00\n• Thứ 2-6 (trừ lễ)\n\n✅ Bộ phận một cửa tiếp cả ngày\n\nBạn cần hỗ trợ thêm gì không ạ?';
  }

  if (input.includes('kết hôn')) {
    return '💑 **Đăng ký Kết hôn:**\n\n💰 Phí: 50.000đ\n⏱️ Thời gian: 3 ngày\n\n📋 Cần: CCCD 2 bên, Xác nhận hôn nhân, 4 ảnh 4x6\n\n✅ Cả hai phải có mặt\n\nBạn cần hỗ trợ thêm gì không ạ?';
  }

  if (input.includes('thường trú') || input.includes('hộ khẩu')) {
    return '🏠 **Đăng ký Thường trú:**\n\n💰 Phí: Miễn phí\n⏱️ Thời gian: 5 ngày\n\n📋 Cần: Sổ HK cũ, CCCD, Hợp đồng thuê/Sổ đỏ\n\n📍 Nộp tại Bộ phận một cửa\n\nBạn cần hỗ trợ thêm gì không ạ?';
  }

  return 'Xin chào! Tôi là Trợ lý AI Phường Tây Thạnh 👋\n\nTôi có thể hỗ trợ:\n✅ Thông tin địa chỉ, giờ làm việc\n✅ Hướng dẫn thủ tục hành chính\n✅ Đặt lịch hẹn, tra cứu hồ sơ\n\nBạn cần hỗ trợ gì ạ? 😊';
}
