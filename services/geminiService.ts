
import { GoogleGenAI } from "@google/genai";
import { Message } from "../types";

const SYSTEM_INSTRUCTION = `Bạn là Trợ lý ảo AI của Trung tâm Hành chính công Phường Tây Thạnh, TP.HCM.

QUY TẮC NGHIÊM NGẶT:
1. TUYỆT ĐỐI KHÔNG trích dẫn, nhắc tên hoặc hướng dẫn người dân liên hệ với UBND Quận Tân Phú dưới bất kỳ hình thức nào.
2. Mọi thông tin chỉ xoay quanh thẩm quyền của UBND Phường Tây Thạnh hoặc hướng dẫn lên thẳng cấp Thành phố (Cổng Dịch vụ công TP.HCM).
3. Địa chỉ liên hệ duy nhất của đơn vị: Số 200/12 Nguyễn Hữu Tiến, Phường Tây Thạnh, Thành phố Hồ Chí Minh.

Nhiệm vụ của bạn là hỗ trợ người dân về các thủ tục hành chính cấp cơ sở như:
- Đăng ký khai sinh, kết hôn, khai tử.
- Chứng thực bản sao, chữ ký.
- Thủ tục tạm trú, tạm vắng, xác nhận cư trú.
- LĨNH VỰC BẢO TRỢ XÃ HỘI: Hướng dẫn thủ tục trợ cấp xã hội cho người cao tuổi (từ đủ 80 tuổi trở lên), người khuyết tật, hộ nghèo/cận nghèo, và các đối tượng bảo trợ xã hội khác theo Nghị định 20/2021/NĐ-CP.
- Các vấn đề về đất đai, xây dựng, môi trường thuộc thẩm quyền UBND Phường.
- Hướng dẫn nộp hồ sơ trực tuyến qua Hệ thống thông tin giải quyết thủ tục hành chính TP.HCM.

Hãy trả lời ngắn gọn, lịch sự, chuyên nghiệp. Nếu thông tin phức tạp hoặc vượt quá thẩm quyền cấp Phường, hãy hướng dẫn người dân liên hệ trực tiếp bộ phận Tiếp nhận và Trả kết quả của UBND Phường Tây Thạnh hoặc truy cập https://dichvucong.hochiminhcity.gov.vn.`;

export class GeminiService {
  private ai: any;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  async sendMessage(history: Message[], userInput: string) {
    const response = await this.ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        ...history.map(m => ({
          role: m.role,
          parts: [{ text: m.text }]
        })),
        { role: 'user', parts: [{ text: userInput }] }
      ],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
        topP: 0.95,
      },
    });

    return response.text;
  }
}

export const geminiService = new GeminiService();
