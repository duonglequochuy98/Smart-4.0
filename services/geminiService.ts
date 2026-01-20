import { GoogleGenerativeAI } from '@google/genai';
import { Message } from '../types';

class GeminiService {
  private genAI: GoogleGenerativeAI | null = null;
  private model: any = null;
  private chat: any = null;

  constructor() {
    this.initialize();
  }

  private initialize() {
    try {
      // Lấy API key từ biến môi trường
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
      
      if (!apiKey) {
        console.warn('⚠️ Gemini API key chưa được cấu hình');
        return;
      }

      this.genAI = new GoogleGenerativeAI(apiKey);
      this.model = this.genAI.getGenerativeModel({ 
        model: 'gemini-1.5-flash',
        generationConfig: {
          temperature: 0.7,
          topP: 0.95,
          topK: 40,
          maxOutputTokens: 1024,
        }
      });

      // Khởi tạo chat với system instruction
      const systemInstruction = `Bạn là Trợ lý AI Smart 4.0 Plus của UBND Phường Tây Thạnh, Quận Tân Phú, TP.HCM.

THÔNG TIN CHÍNH:
- Địa chỉ: 123/45 Đường Tây Thạnh, Phường Tây Thạnh, Quận Tân Phú, TP.HCM
- Điện thoại: (028) 3123 4567
- Email: ubndtaythanh@tphcm.gov.vn
- Giờ làm việc: Thứ 2-6: 7h30-17h30, Thứ 7: 7h30-11h30
- Trung tâm Hành chính công: Tầng 1, số 123/45 Tây Thạnh

BAN LÃNH ĐẠO:
- Giám đốc: Ông Nguyễn Văn A
- Phó Giám đốc: Bà Trần Thị B

DỊCH VỤ CHÍNH:
1. Khai sinh, Khai tử
2. Đăng ký kết hôn
3. Chứng thực bản sao, chữ ký
4. Đăng ký tạm trú, tạm vắng
5. Cấp giấy phép kinh doanh

PHÍ DỊCH VỤ:
- Khai sinh: Miễn phí (trong 60 ngày)
- Chứng thực: 5.000đ/bản
- Hộ chiếu: 200.000đ (thường), 400.000đ (gấp)
- CCCD: Miễn phí

HƯỚNG DẪN:
- Luôn lịch sự, chuyên nghiệp
- Trả lời ngắn gọn, rõ ràng
- Hướng dẫn từng bước nếu cần
- Đề xuất liên hệ trực tiếp nếu phức tạp
- Hỗ trợ cả Tiếng Việt và English`;

      this.chat = this.model.startChat({
        history: [],
        systemInstruction: systemInstruction
      });

      console.log('✅ Gemini Service đã khởi tạo thành công');
    } catch (error) {
      console.error('❌ Lỗi khởi tạo Gemini Service:', error);
    }
  }

  async sendMessage(history: Message[], userInput: string): Promise<string> {
    try {
      // Kiểm tra xem service đã được khởi tạo chưa
      if (!this.chat) {
        throw new Error('Service chưa được khởi tạo. Vui lòng kiểm tra API key.');
      }

      // Gửi tin nhắn
      const result = await this.chat.sendMessage(userInput);
      const response = await result.response;
      const text = response.text();

      if (!text) {
        throw new Error('Không nhận được phản hồi từ AI');
      }

      return text;
    } catch (error: any) {
      console.error('❌ Lỗi khi gọi Gemini API:', error);
      
      // Xử lý các loại lỗi cụ thể
      if (error?.message?.includes('API key')) {
        return 'Lỗi: API key chưa được cấu hình đúng. Vui lòng kiểm tra file .env.local';
      }
      
      if (error?.message?.includes('quota') || error?.message?.includes('limit')) {
        return 'Hệ thống đang quá tải. Vui lòng thử lại sau vài phút.';
      }

      if (error?.message?.includes('network') || error?.message?.includes('fetch')) {
        return 'Lỗi kết nối mạng. Vui lòng kiểm tra internet và thử lại.';
      }

      // Lỗi chung
      return 'Xin lỗi, hệ thống đang bận cập nhật. Vui lòng thử lại sau hoặc liên hệ Zalo OA để được hỗ trợ trực tiếp.';
    }
  }

  // Reset chat history nếu cần
  resetChat() {
    if (this.model) {
      this.chat = this.model.startChat({
        history: []
      });
    }
  }
}

// Export singleton instance
export const geminiService = new GeminiService();
