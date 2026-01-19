import { GoogleGenerativeAI } from '@google/genai';
import { Message } from '../types';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(API_KEY);

export const geminiService = {
  async sendMessage(messages: Message[], userInput: string): Promise<string> {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

      const systemPrompt = `Bạn là trợ lý ảo AI của UBND Phường Tây Thạnh, Quận Tân Phú, TP.HCM.

THÔNG TIN CƠ BẢN:
- Địa chỉ: 200/12 Nguyễn Hữu Tiến, Phường Tây Thạnh, Thành phố Hồ Chí Minh
- Giờ làm việc: 7h-11h30 & 13h-17h (Thứ 2-6)
-             : 7h-11h30 (Thứ 7)
THỦ TỤC PHỔ BIẾN:
1. Chứng thực bản sao: Phí 2.000đ/trang, 15 phút
2. Đăng ký khai sinh: Miễn phí, 2 ngày
3. Đăng ký kết hôn: Phí 50.000đ, 3 ngày
4. Đăng ký thường trú: Miễn phí, 5 ngày
5. Cấp sổ hộ khẩu: Phí 10.000đ, 3 ngày

YÊU CẦU TRẢ LỜI:
- Trả lời bằng tiếng Việt ngắn gọn, thân thiện
- Sử dụng emoji phù hợp (📍 🕐 💰 ✅)
- Luôn kết thúc bằng câu hỏi "Bạn cần hỗ trợ thêm gì không ạ?"

CÂU HỎI CỦA NGƯỜI DÙNG:
${userInput}`;

      const result = await model.generateContent(systemPrompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Gemini API Error:', error);
      throw error;
    }
  }
};
