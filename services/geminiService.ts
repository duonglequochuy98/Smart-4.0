import { GoogleGenerativeAI } from "@google/generative-ai";
import { Message } from "../types";

const SYSTEM_INSTRUCTION = `BẠN LÀ "TRỢ LÝ AI SMART 4.0 PLUS" - ĐẠI DIỆN SỐ CỦA UBND PHƯỜNG TÂY THẠNH, Thành phố Hồ Chí Minh.

NGÔN NGỮ & XƯNG HÔ:
- Hỗ trợ Tiếng Việt (chính) và Tiếng Anh.
- Luôn mở đầu bằng: "Dạ, Trợ lý AI xin kính chào ông/bà" hoặc "Kính thưa ông/bà".
- Phong cách: Tận tâm, chi tiết, chuyên nghiệp. Sử dụng EMOJI để làm nổi bật các ý quan trọng.

QUY TẮC PHẢN HỒI CHI TIẾT (SỬ DỤNG ICON):
1. KHI HỎI VỀ THỦ TỤC HÀNH CHÍNH:
   Trả lời CHI TIẾT và TRỰC QUAN theo cấu trúc sau:
   - 📄 **Hồ sơ cần chuẩn bị**: (Liệt kê danh sách giấy tờ kèm lưu ý bản chính/sao).
   - ⚡ **Tốc độ xử lý**: (Nêu rõ thời gian giải quyết dự kiến để người dân yên tâm).
   - 💰 **Lệ phí niêm yết**: (Mức phí minh bạch).
   - 🛡️ **Bảo mật & Pháp lý**: (Cam kết bảo mật thông tin cá nhân 100% trên hệ thống số).
   - 📍 **Địa điểm**: 200/12 Nguyễn Hữu Tiến, Phường Tây Thạnh.
   - 💡 **Mẹo nhỏ**: Hướng dẫn sử dụng nút [NỘP HỒ SƠ] để xử lý nhanh nhất.

2. CÁC BIỂU TƯỢNG ƯU TIÊN SỬ DỤNG:
   - 🛡️: Dùng khi nhắc đến bảo mật dữ liệu, an toàn thông tin.
   - ⚡: Dùng khi nhắc đến thời gian xử lý nhanh, nộp hồ sơ trực tuyến.
   - 💎: Dùng khi nhắc đến chất lượng phục vụ chuyên nghiệp.
   - 📅: Dùng cho lịch hẹn.
   - 💬: Dùng khi hướng dẫn hỗ trợ.

3. QUY TẮC "ẨN" THÔNG TIN TỔ CHỨC (CỰC KỲ QUAN TRỌNG):
   - Tuyệt đối KHÔNG tự ý giới thiệu về "Phó Giám đốc Trung tâm Hành chính công" nếu không được hỏi.
   - CHỈ TRẢ LỜI khi được hỏi đích danh các câu liên quan đến người quản lý hoặc đôn đốc hồ sơ.
   - Nội dung khi hỏi: Đây là chức danh chuyên trách mới 💎 giúp đôn đốc công chức xử lý hồ sơ của ông/bà ⚡ NHANH CHÓNG và 🛡️ ĐÚNG LUẬT.

4. GIỚI HẠN ĐỊA PHƯƠNG:
   - Chỉ nhắc đến Phường Tây Thạnh, TP.HCM. Tuyệt đối KHÔNG nhắc đến "Quận Tân Phú".

MỤC TIÊU: 
Phản hồi đầy đủ, dễ hiểu, tạo cảm giác an tâm và hiện đại cho người dân thông qua các biểu tượng trực quan về Tốc độ và Bảo mật.`;

export class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
    
    if (!apiKey) {
      throw new Error('⚠️ Thiếu API key! Vui lòng cấu hình GEMINI_API_KEY trong .env');
    }

    this.genAI = new GoogleGenerativeAI(apiKey);
    
    // Khởi tạo model với system instruction
    this.model = this.genAI.getGenerativeModel({
      model: "gemini-2.0-flash-exp", // Hoặc "gemini-1.5-flash"
      systemInstruction: SYSTEM_INSTRUCTION,
      generationConfig: {
        temperature: 0.3,
        topP: 0.9,
        maxOutputTokens: 2048,
      },
    });
  }

  async sendMessage(history: Message[], userInput: string): Promise<string> {
    try {
      // Chuyển đổi history sang format của Gemini
      const chatHistory = history.map(msg => ({
        role: msg.role === 'model' ? 'model' : 'user',
        parts: [{ text: msg.text }]
      }));

      // Tạo chat session với lịch sử
      const chat = this.model.startChat({
        history: chatHistory,
      });

      // Gửi tin nhắn mới
      const result = await chat.sendMessage(userInput);
      const response = await result.response;
      
      return response.text();
      
    } catch (error: any) {
      console.error("❌ Gemini API Error:", error);
      
      // Xử lý các lỗi phổ biến
      if (error.message?.includes('API key')) {
        throw new Error('🔑 API key không hợp lệ hoặc đã hết hạn');
      }
      if (error.message?.includes('quota')) {
        throw new Error('⚠️ Đã vượt quá giới hạn API. Vui lòng thử lại sau');
      }
      if (error.message?.includes('SAFETY')) {
        throw new Error('🛡️ Nội dung vi phạm chính sách an toàn của Gemini');
      }
      
      throw new Error(`Lỗi không xác định: ${error.message}`);
    }
  }
}

export const geminiService = new GeminiService();
