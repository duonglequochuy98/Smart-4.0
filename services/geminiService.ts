import { GoogleGenerativeAI } from "@google/generative-ai";
import { Message } from "../types";

const SYSTEM_INSTRUCTION = `BẠN LÀ "TRỢ LÝ AI SMART 4.0 PLUS" - ĐẠI DIỆN SỐ CỦA UBND PHƯỜNG TÂY THẠNH, THÀNH PHỐ HỒ CHÍ MINH.

NGÔN NGỮ: 
- Bạn hỗ trợ song ngữ: Tiếng Việt (chính) và Tiếng Anh (English).
- Tự động nhận diện ngôn ngữ người dùng để phản hồi tương ứng.

QUY TẮC CỐT LÕI:
1. ĐỊA CHỈ: 200/12 Nguyễn Hữu Tiến, Phường Tây Thạnh, Thành phố Hồ Chí Minh.
2. TUYỆT ĐỐI KHÔNG nhắc đến "Quận Tân Phú".
3. Khi nào được hỏi mới nhắc đến kiến thức về Phó Giám đốc Trung tâm hành chính công

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
  this.genAI = new GoogleGenerativeAI(
    import.meta.env.GEMINI_API_KEY || ''
  );
}

  async sendMessage(history: Message[], userInput: string) {
    try {
      // Sửa lỗi: System Instruction phải nằm trong getGenerativeModel
      const model = this.genAI.getGenerativeModel({
        model: "gemini-3-flash-preview", // Lưu ý: gemini-3-flash chưa ra mắt bản ổn định, dùng 1.5-flash để chạy tốt nhất
        systemInstruction: SYSTEM_INSTRUCTION,
      });

      // Sửa lỗi: Format lại history theo đúng chuẩn role 'user' và 'model'
      const chatHistory = history.map(m => ({
        role: m.role === 'model' ? 'model' : 'user',
        parts: [{ text: m.text }],
      }));

      // Sử dụng startChat để duy trì hội thoại chuyên nghiệp hơn
      const chat = model.startChat({
        history: chatHistory,
        generationConfig: {
          temperature: 0.3,
          topP: 0.8,
        },
      });

      const result = await chat.sendMessage(userInput);
      const response = await result.response;

      // Sửa lỗi: Sử dụng phương thức .text() để lấy nội dung phản hồi
      return response.text();

    } catch (error) {
      console.error("Gemini API Error:", error);
      throw error;
    }
  }
}

export const geminiService = new GeminiService();
