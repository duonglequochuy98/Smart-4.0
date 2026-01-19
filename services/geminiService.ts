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
  private ai: GoogleGenAI;

  constructor() {
    // Khởi tạo đúng cú pháp với named parameter từ process.env.API_KEY
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  async sendMessage(history: Message[], userInput: string) {
    try {
      // Sử dụng ai.models.generateContent theo hướng dẫn mới nhất
      const response = await this.ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: {
          parts: [
            ...history.map(m => ({
              text: `${m.role === 'model' ? 'AI Assistant:' : 'User:'} ${m.text}`
            })),
            { text: userInput }
          ]
        },
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.3,
          topP: 0.8,
        },
      });

      // Truy cập trực tiếp thuộc tính .text (không phải phương thức .text())
      return response.text;
    } catch (error) {
      console.error("Gemini API Error:", error);
      throw error;
    }
  }
}

export const geminiService = new GeminiService();
