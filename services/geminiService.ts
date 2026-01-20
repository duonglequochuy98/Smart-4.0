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
  private apiKey: string = '';
  private apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent';

  setApiKey(key: string) {
    this.apiKey = key;
  }

  getApiKey(): string {
    return this.apiKey;
  }

  async sendMessage(history: Message[], userInput: string): Promise<string> {
    if (!this.apiKey) {
      throw new Error('API Key not set');
    }

    try {
      // Build conversation history
      const contents = [
        ...history.map(msg => ({
          role: msg.role === 'model' ? 'model' : 'user',
          parts: [{ text: msg.text }]
        })),
        {
          role: 'user',
          parts: [{ text: userInput }]
        }
      ];

      const response = await fetch(`${this.apiUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: contents,
          generationConfig: {
            temperature: 0.3,
            topP: 0.9,
            maxOutputTokens: 2048,
          },
          systemInstruction: {
            parts: [{ text: SYSTEM_INSTRUCTION }]
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Gemini API Error:', errorData);
        throw new Error(errorData.error?.message || 'API request failed');
      }

      const data = await response.json();
      
      // Extract text from response
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (!text) {
        throw new Error('No response text from API');
      }
      
      return text;
    } catch (error) {
      console.error("Gemini API Error:", error);
      throw error;
    }
  }
}

export const geminiService = new GeminiService();
