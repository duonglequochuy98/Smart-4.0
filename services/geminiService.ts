import { Message } from '../types';

// System instruction cho AI
const SYSTEM_INSTRUCTION = `Bạn là Trợ lý AI Smart 4.0 Plus của UBND Phường Tây Thạnh, Quận Tân Phú, TP.HCM.

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

class GeminiService {
  private apiKey: string | null = null;

  constructor() {
    this.initialize();
  }

  private initialize() {
    try {
      this.apiKey = import.meta.env.VITE_GEMINI_API_KEY || (typeof process !== 'undefined' ? process.env.GEMINI_API_KEY : null);
      
      if (!this.apiKey) {
        console.warn('⚠️ Gemini API key chưa được cấu hình');
      } else {
        console.log('✅ Gemini Service đã khởi tạo thành công');
      }
    } catch (error) {
      console.error('❌ Lỗi khởi tạo Gemini Service:', error);
    }
  }

  async sendMessage(history: Message[], userInput: string): Promise<string> {
    try {
      if (!this.apiKey) {
        throw new Error('API key chưa được cấu hình');
      }

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [{ text: SYSTEM_INSTRUCTION }]
              },
              ...history.map(msg => ({
                role: msg.role === 'model' ? 'model' : 'user',
                parts: [{ text: msg.text }]
              })),
              {
                role: 'user',
                parts: [{ text: userInput }]
              }
            ],
            generationConfig: {
              temperature: 0.7,
              topP: 0.95,
              topK: 40,
              maxOutputTokens: 1024,
            }
          })
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `HTTP ${response.status}`);
      }

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!text) {
        throw new Error('Không nhận được phản hồi từ AI');
      }

      return text;
    } catch (error: any) {
      console.error('❌ Lỗi khi gọi Gemini API:', error);
      
      if (error?.message?.includes('API key') || error?.message?.includes('API_KEY')) {
        return 'Lỗi: API key chưa được cấu hình đúng. Vui lòng kiểm tra file .env.local';
      }
      
      if (error?.message?.includes('quota') || error?.message?.includes('limit') || error?.message?.includes('429')) {
        return 'Hệ thống đang quá tải. Vui lòng thử lại sau vài phút.';
      }

      if (error?.message?.includes('network') || error?.message?.includes('fetch') || !navigator.onLine) {
        return 'Lỗi kết nối mạng. Vui lòng kiểm tra internet và thử lại.';
      }

      return 'Xin lỗi, hệ thống đang bận cập nhật. Vui lòng thử lại sau hoặc liên hệ Zalo OA để được hỗ trợ trực tiếp.';
    }
  }

  resetChat() {
    // Không cần reset gì vì dùng REST API
    console.log('Chat đã được reset');
  }
}

// Export singleton instance
export const geminiService = new GeminiService();
