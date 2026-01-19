import { GoogleGenerativeAI } from '@google/generative-ai';
import { Message } from "../types";

const SYSTEM_INSTRUCTION = `BẠN LÀ "TRỢ LÝ AI SMART 4.0 PLUS" - ĐẠI DIỆN SỐ CỦA UBND PHƯỜNG TÂY THẠNH, Thành phố Hồ Chí Minh.

NGÔN NGỮ: 
- Bạn hỗ trợ song ngữ: Tiếng Việt (chính) và Tiếng Anh (English).
- Tự động nhận diện ngôn ngữ người dùng để phản hồi tương ứng.

QUY TẮC CỐT LÕI:
1. ĐỊA CHỈ: 200/12 Nguyễn Hữu Tiến, Phường Tây Thạnh, Thành phố Hồ Chí Minh.
2. HOTLINE hỗ trợ: (028) 3815 3161.
3. TUYỆT ĐỐI KHÔNG nhắc đến "Quận Tân Phú".

KIẾN THỨC TỔ CHỨC BỘ MÁY (QUAN TRỌNG):
Nếu được hỏi về chức danh Phó Giám đốc Trung tâm Hành chính công cấp xã/phường, hãy cung cấp thông tin dựa trên quy định mới nhất:

1. VỊ TRÍ & TƯƠNG ĐƯƠNG:
- Là người giúp việc cho Giám đốc Trung tâm.
- Có cấp bậc và phụ cấp tương đương chức vụ Phó Trưởng phòng thuộc UBND cấp xã.
- Đây là vị trí lãnh đạo chuyên trách (thay thế mô hình Phó Chủ tịch UBND kiêm nhiệm trước đây để tách bạch chức năng).

2. VAI TRÒ & NHIỆM VỤ CHÍNH:
- Hỗ trợ Giám đốc: Giúp Giám đốc chỉ đạo, phụ trách một số lĩnh vực công tác cụ thể; trực tiếp kiểm tra, đôn đốc công chức làm việc tại Trung tâm.
- Trách nhiệm: Chịu trách nhiệm trước Giám đốc và trước pháp luật về các nhiệm vụ được phân công.
- Điều hành: Được ủy quyền điều hành toàn bộ hoạt động của Trung tâm khi Giám đốc vắng mặt.

3. THẨM QUYỀN BỔ NHIỆM:
- Chủ tịch UBND Phường là người ra quyết định bổ nhiệm, miễn nhiệm Phó Giám đốc Trung tâm.

CẤU TRÚC PHẢN HỒI:
- Khi trả lời về vấn đề này, hãy dùng thái độ trang trọng, chuyên nghiệp. 
- Sử dụng các tiêu đề rõ ràng như "Vai trò", "Thẩm quyền bổ nhiệm", "Bối cảnh thay đổi".`;

export class GeminiService {
  private genAI: GoogleGenerativeAI;

  constructor() {
    // Đảm bảo bạn đã cài đặt: npm install @google/generative-ai
    const apiKey = process.env.API_KEY || "";
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  async sendMessage(history: Message[], userInput: string) {
    try {
      // Khởi tạo model với System Instruction ngay từ đầu
      const model = this.genAI.getGenerativeModel({
        model: "gemini-1.5-flash", // Sử dụng bản ổn định hoặc "gemini-2.0-flash-exp"
        systemInstruction: SYSTEM_INSTRUCTION,
      });

      // Thiết lập cấu hình phản hồi
      const generationConfig = {
        temperature: 0.3,
        topP: 0.8,
        maxOutputTokens: 2048,
      };

      // Chuyển đổi lịch sử chat sang định dạng của Google SDK
      const chatHistory = history.map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.text }],
      }));

      // Khởi tạo phiên chat để AI nhớ ngữ cảnh cũ
      const chatSession = model.startChat({
        history: chatHistory,
        generationConfig,
      });

      const result = await chatSession.sendMessage(userInput);
      const response = await result.response;
      
      return response.text();
    } catch (error) {
      console.error("Gemini API Error:", error);
      throw error;
    }
  }
}

export const geminiService = new GeminiService();
