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
- Trả lời ngắn gọn, rõ ràng (tối đa 3-4 câu)
- Hướng dẫn từng bước nếu cần
- Đề xuất liên hệ trực tiếp nếu phức tạp
- Hỗ trợ cả Tiếng Việt và English`;

class GeminiService {
  private apiKey: string | null = null;
  private conversationHistory: Array<{role: string, parts: Array<{text: string}>}> = [];

  constructor() {
    this.initialize();
  }

  private initialize() {
    try {
      // Debug: Log tất cả biến môi trường
      console.log('🔍 Checking environment variables...');
      console.log('import.meta.env.VITE_GEMINI_API_KEY:', import.meta.env.VITE_GEMINI_API_KEY ? 'Found ✅' : 'Not found ❌');
      console.log('import.meta.env.GEMINI_API_KEY:', import.meta.env.GEMINI_API_KEY ? 'Found ✅' : 'Not found ❌');
      
      // Lấy API key từ nhiều nguồn
      this.apiKey = 
        import.meta.env.VITE_GEMINI_API_KEY || 
        import.meta.env.GEMINI_API_KEY ||
        (typeof process !== 'undefined' && process.env?.VITE_GEMINI_API_KEY) ||
        (typeof process !== 'undefined' && process.env?.GEMINI_API_KEY) ||
        null;
      
      if (!this.apiKey || this.apiKey.trim() === '') {
        console.error('❌ CẢNH BÁO: Gemini API key chưa được cấu hình!');
        console.log('📝 Hướng dẫn:');
        console.log('1. Tạo file .env.local ở thư mục gốc dự án');
        console.log('2. Thêm dòng: VITE_GEMINI_API_KEY=AIzaSy...');
        console.log('3. Restart dev server: npm run dev');
      } else {
        console.log('✅ Gemini Service khởi tạo thành công');
        console.log('🔑 API Key (10 ký tự đầu):', this.apiKey.substring(0, 10) + '...');
        console.log('📏 API Key length:', this.apiKey.length, 'chars');
        console.log('🎯 API Key starts with "AIzaSy"?', this.apiKey.startsWith('AIzaSy') ? 'YES ✅' : 'NO ❌');
      }
    } catch (error) {
      console.error('❌ Lỗi khởi tạo Gemini Service:', error);
    }
  }

  async sendMessage(history: Message[], userInput: string): Promise<string> {
    console.log('📤 Đang gửi tin nhắn đến Gemini API...');
    console.log('💬 User input:', userInput);
    
    try {
      // Kiểm tra API key
      if (!this.apiKey || this.apiKey.trim() === '' || this.apiKey === 'your_api_key_here') {
        console.error('❌ API key không hợp lệ');
        return '⚠️ Lỗi cấu hình: API key chưa được thiết lập. Vui lòng liên hệ quản trị viên hoặc sử dụng Zalo OA để được hỗ trợ.';
      }

      // Tạo conversation history từ messages
      const contents = [
        // System instruction
        {
          role: 'user',
          parts: [{ text: SYSTEM_INSTRUCTION }]
        },
        {
          role: 'model',
          parts: [{ text: 'Tôi hiểu. Tôi sẽ trả lời như một nhân viên UBND Phường Tây Thạnh.' }]
        },
        // Lịch sử chat
        ...history.slice(1).map(msg => ({
          role: msg.role === 'model' ? 'model' : 'user',
          parts: [{ text: msg.text }]
        })),
        // Tin nhắn mới
        {
          role: 'user',
          parts: [{ text: userInput }]
        }
      ];

      console.log('📦 Payload:', JSON.stringify(contents, null, 2));

      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`;
      
      console.log('🌐 API URL:', apiUrl.replace(this.apiKey, 'HIDDEN'));

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: contents,
          generationConfig: {
            temperature: 0.7,
            topP: 0.95,
            topK: 40,
            maxOutputTokens: 1024,
          },
          safetySettings: [
            {
              category: 'HARM_CATEGORY_HARASSMENT',
              threshold: 'BLOCK_NONE'
            },
            {
              category: 'HARM_CATEGORY_HATE_SPEECH',
              threshold: 'BLOCK_NONE'
            },
            {
              category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
              threshold: 'BLOCK_NONE'
            },
            {
              category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
              threshold: 'BLOCK_NONE'
            }
          ]
        })
      });

      console.log('📊 Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API Error Response:', errorText);
        
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { message: errorText };
        }

        // Xử lý lỗi cụ thể
        if (response.status === 400) {
          console.error('❌ Bad Request - Kiểm tra format payload');
          return 'Xin lỗi, yêu cầu không hợp lệ. Vui lòng thử lại.';
        }
        
        if (response.status === 401 || response.status === 403) {
          console.error('❌ Authentication Error - API key không hợp lệ');
          return '⚠️ Lỗi xác thực API. Vui lòng liên hệ quản trị viên.';
        }

        if (response.status === 429) {
          console.error('❌ Rate Limit - Quá nhiều request');
          return '⏳ Hệ thống đang quá tải. Vui lòng thử lại sau 30 giây.';
        }

        if (response.status === 500 || response.status === 503) {
          console.error('❌ Server Error');
          return '🔧 Gemini API đang bảo trì. Vui lòng thử lại sau vài phút hoặc liên hệ Zalo OA.';
        }

        throw new Error(`HTTP ${response.status}: ${errorData.error?.message || errorText}`);
      }

      const data = await response.json();
      console.log('📥 Response data:', JSON.stringify(data, null, 2));

      // Kiểm tra có bị chặn bởi safety filter không
      if (data.promptFeedback?.blockReason) {
        console.warn('⚠️ Content bị chặn:', data.promptFeedback.blockReason);
        return 'Xin lỗi, nội dung này không phù hợp với chính sách của hệ thống. Vui lòng thử câu hỏi khác.';
      }

      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!text) {
        console.error('❌ Không có text trong response:', data);
        
        // Kiểm tra finish reason
        const finishReason = data.candidates?.[0]?.finishReason;
        if (finishReason === 'SAFETY') {
          return 'Xin lỗi, câu trả lời vi phạm chính sách an toàn. Vui lòng hỏi câu khác.';
        }
        
        return 'Xin lỗi, tôi không thể tạo câu trả lời. Vui lòng thử lại hoặc liên hệ Zalo OA.';
      }

      console.log('✅ Nhận được câu trả lời:', text.substring(0, 100) + '...');
      return text;

    } catch (error: any) {
      console.error('❌ Exception khi gọi Gemini API:', error);
      console.error('Error stack:', error.stack);
      
      // Xử lý lỗi network
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        return '🌐 Lỗi kết nối mạng. Vui lòng kiểm tra internet và thử lại.';
      }

      // Lỗi timeout
      if (error.name === 'AbortError' || error.message.includes('timeout')) {
        return '⏱️ Yêu cầu quá lâu. Vui lòng thử lại.';
      }

      // Lỗi chung
      return `❌ Lỗi hệ thống: ${error.message}. Vui lòng thử lại sau hoặc liên hệ Zalo OA để được hỗ trợ trực tiếp.`;
    }
  }

  resetChat() {
    this.conversationHistory = [];
    console.log('🔄 Chat đã được reset');
  }
}

// Export singleton instance
export const geminiService = new GeminiService();
