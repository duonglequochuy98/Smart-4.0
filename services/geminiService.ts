import { GoogleGenerativeAI } from "@google/generative-ai";
import { Message } from "../types";

const SYSTEM_INSTRUCTION = `BẠN LÀ "TRỢ LÝ AI SMART 4.0 PLUS" - ĐẠI DIỆN SỐ CỦA UBND PHƯỜNG TÂY THẠNH, Thành phố Hồ Chí Minh.

NGÔN NGỮ: 
- Bạn hỗ trợ song ngữ: Tiếng Việt (chính) và Tiếng Anh (English).
- Tự động nhận diện ngôn ngữ người dùng để phản hồi tương ứng.

QUY TẮC CỐT LÕI:
1. ĐỊA CHỈ: 200/12 Nguyễn Hữu Tiến, Phường Tây Thạnh, Thành phố Hồ Chí Minh.
2. TUYỆT ĐỐI KHÔNG nhắc đến "Quận Tân Phú".

KIẾN THỨC TỔ CHỨC BỘ MÁY (QUAN TRỌNG):
Nếu được hỏi về chức danh Phó Giám đốc Trung tâm Hành chính công cấp xã/phường:

1. VỊ TRÍ & TƯƠNG ĐƯƠNG:
- Là người giúp việc cho Giám đốc Trung tâm.
- Có cấp bậc và phụ cấp tương đương chức vụ Trưởng phòng thuộc UBND cấp xã.
- Đây là vị trí lãnh đạo chuyên trách (thay thế mô hình Phó Chủ tịch UBND kiêm nhiệm trước đây).

2. VAI TRÒ & NHIỆM VỤ CHÍNH:
- Hỗ trợ Giám đốc: Giúp Giám đốc chỉ đạo, phụ trách một số lĩnh vực công tác cụ thể.
- Trách nhiệm: Chịu trách nhiệm trước Giám đốc và trước pháp luật về các nhiệm vụ được phân công.
- Điều hành: Được ủy quyền điều hành toàn bộ hoạt động của Trung tâm khi Giám đốc vắng mặt.

3. THẨM QUYỀN BỔ NHIỆM:
- Chủ tịch UBND Phường là người ra quyết định bổ nhiệm, miễn nhiệm Phó Giám đốc Trung tâm.

THÔNG TIN BỔ SUNG:
- Giờ làm việc: Thứ 2-6: 7h30-17h00 | Thứ 7: 7h30-11h30 (chỉ hồ sơ cấp bách)
- Email: ubndtaythanh@tphcm.gov.vn
- Website: https://taythanh.tphcm.gov.vn

THỦ TỤC PHỔ BIẾN:
1. Chứng thực bản sao: 1-2 ngày, phí 5.000đ/trang
2. Đăng ký khai sinh: 3-5 ngày, miễn phí
3. Đăng ký kết hôn: 3-5 ngày, miễn phí
4. Cấp CCCD: 7-10 ngày, miễn phí
5. Đăng ký tạm trú: 3-5 ngày, phí 50.000đ

CẤU TRÚC PHẢN HỒI:
- Lịch sự, chuyên nghiệp, ngắn gọn 2-4 câu
- Dùng emoji phù hợp: 😊 📝 ✅ 📞 🏢
- Kết thúc bằng: "Ông/bà cần hỗ trợ gì thêm không?" (tiếng Việt) hoặc "Do you need any further assistance?" (English)
- Nếu không biết, hướng dẫn gọi Hotline: (028) 3815 3161`;

export class GeminiService {
  private genAI: GoogleGenerativeAI | null = null;
  private chat: any = null;

  constructor() {
    this.initialize();
  }

  private initialize() {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      
      if (!apiKey) {
        console.error('⚠️ GEMINI_API_KEY is not configured');
        return;
      }

      this.genAI = new GoogleGenerativeAI(apiKey);
      console.log('✅ Gemini AI initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize Gemini AI:', error);
    }
  }

  async sendMessage(history: Message[], userInput: string): Promise<string> {
    try {
      if (!this.genAI) {
        throw new Error('Gemini AI chưa được khởi tạo. Vui lòng kiểm tra GEMINI_API_KEY.');
      }

      // Lấy model
      const model = this.genAI.getGenerativeModel({ 
        model: "gemini-2.0-flash-exp", // Hoặc "gemini-1.5-flash", "gemini-1.5-pro"
        systemInstruction: SYSTEM_INSTRUCTION
      });

      // Chuyển đổi history (bỏ welcome message nếu có)
      const formattedHistory = history
        .filter(msg => {
          const welcomeMessages = [
            'Kính chào ông/bà, tôi là Trợ lý AI Smart 4.0 Plus',
            'Welcome, I am the Smart 4.0 Plus AI Assistant'
          ];
          return !welcomeMessages.some(w => msg.text.includes(w));
        })
        .map(msg => ({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text }]
        }));

      // Tạo chat với history
      this.chat = model.startChat({
        history: formattedHistory,
        generationConfig: {
          maxOutputTokens: 2048,
          temperature: 0.7,
          topP: 0.9,
          topK: 40,
        },
      });

      // Gửi message
      const result = await this.chat.sendMessage(userInput);
      const response = await result.response;
      const text = response.text();

      return text;

    } catch (error: any) {
      console.error('❌ Gemini API Error:', error);
      
      // Xử lý các loại lỗi
      if (error.message?.includes('API_KEY_INVALID') || error.message?.includes('API key')) {
        throw new Error('⚠️ API key không hợp lệ. Vui lòng kiểm tra cấu hình.');
      }
      
      if (error.message?.includes('quota') || error.message?.includes('RESOURCE_EXHAUSTED')) {
        throw new Error('⚠️ Đã vượt quá giới hạn API. Vui lòng thử lại sau.');
      }
      
      if (error.message?.includes('SAFETY')) {
        throw new Error('⚠️ Nội dung không phù hợp. Vui lòng điều chỉnh câu hỏi.');
      }

      if (error.message?.includes('RECITATION')) {
        throw new Error('⚠️ Phát hiện nội dung trùng lặp. Vui lòng thử lại.');
      }
      
      throw new Error('Đã xảy ra lỗi khi xử lý yêu cầu. Vui lòng thử lại.');
    }
  }

  // Reset chat (nếu cần bắt đầu cuộc trò chuyện mới)
  resetChat() {
    this.chat = null;
    console.log('🔄 Chat history đã được reset');
  }
}

export const geminiService = new GeminiService();
