import { Message } from '../types';

const SYSTEM_INSTRUCTION = `Bạn là Trợ lý AI Smart 4.0 Plus của UBND Phường Tây Thạnh, Quận Tân Phú, TP.HCM.

THÔNG TIN CHÍNH:
- Địa chỉ: 123/45 Đường Tây Thạnh, Phường Tây Thạnh, Quận Tân Phú, TP.HCM
- Điện thoại: (028) 3123 4567
- Email: ubndtaythanh@tphcm.gov.vn
- Giờ làm việc: Thứ 2-6: 7h30-17h30, Thứ 7: 7h30-11h30

DỊCH VỤ CHÍNH:
1. Khai sinh, Khai tử
2. Đăng ký kết hôn  
3. Chứng thực bản sao
4. Đăng ký tạm trú
5. Cấp giấy phép kinh doanh

Trả lời ngắn gọn, rõ ràng (tối đa 3-4 câu), lịch sự và chuyên nghiệp.`;

// Danh sách models để thử (theo thứ tự ưu tiên)
const MODELS = [
  'gemini-1.5-flash-latest',
  'gemini-1.5-flash',
  'gemini-pro',
  'gemini-1.5-pro-latest'
];

class GeminiService {
  private apiKey: string | null = null;
  private currentModelIndex: number = 0;

  constructor() {
    this.initialize();
  }

  private initialize() {
    try {
      console.log('🔍 Checking environment variables...');
      console.log('VITE_GEMINI_API_KEY:', import.meta.env.VITE_GEMINI_API_KEY ? 'Found ✅' : 'Not found ❌');
      
      this.apiKey = 
        import.meta.env.VITE_GEMINI_API_KEY || 
        import.meta.env.GEMINI_API_KEY ||
        null;
      
      if (!this.apiKey || this.apiKey.trim() === '') {
        console.error('❌ API key chưa được cấu hình!');
      } else {
        console.log('✅ Gemini Service initialized');
        console.log('🔑 API Key:', this.apiKey.substring(0, 10) + '...');
        console.log('📋 Available models:', MODELS.join(', '));
      }
    } catch (error) {
      console.error('❌ Init error:', error);
    }
  }

  async sendMessage(history: Message[], userInput: string): Promise<string> {
    console.log('📤 Sending message to Gemini API...');
    
    try {
      if (!this.apiKey || this.apiKey === 'your_api_key_here') {
        return '⚠️ API key chưa được cấu hình. Vui lòng liên hệ quản trị viên.';
      }

      // Tạo contents
      const contents = [
        {
          role: 'user',
          parts: [{ text: SYSTEM_INSTRUCTION }]
        },
        {
          role: 'model',
          parts: [{ text: 'Tôi hiểu. Tôi sẽ hỗ trợ như nhân viên UBND Phường Tây Thạnh.' }]
        },
        ...history.slice(1).map(msg => ({
          role: msg.role === 'model' ? 'model' : 'user',
          parts: [{ text: msg.text }]
        })),
        {
          role: 'user',
          parts: [{ text: userInput }]
        }
      ];

      // Thử từng model cho đến khi thành công
      for (let i = 0; i < MODELS.length; i++) {
        const modelName = MODELS[(this.currentModelIndex + i) % MODELS.length];
        
        try {
          console.log(`🤖 Trying model: ${modelName}`);
          
          const apiUrl = `https://generativelanguage.googleapis.com/v1/models/${modelName}:generateContent?key=${this.apiKey}`;

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

          console.log(`📊 Response status: ${response.status}`);

          if (!response.ok) {
            const errorText = await response.text();
            console.warn(`⚠️ Model ${modelName} failed:`, errorText);
            continue; // Thử model tiếp theo
          }

          const data = await response.json();
          const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

          if (!text) {
            console.warn(`⚠️ Model ${modelName} returned no text`);
            continue; // Thử model tiếp theo
          }

          // Thành công - lưu lại model này để dùng lần sau
          this.currentModelIndex = (this.currentModelIndex + i) % MODELS.length;
          console.log(`✅ Success with model: ${modelName}`);
          console.log(`💬 Response:`, text.substring(0, 100) + '...');
          
          return text;

        } catch (modelError: any) {
          console.warn(`⚠️ Model ${modelName} error:`, modelError.message);
          continue; // Thử model tiếp theo
        }
      }

      // Nếu tất cả models đều fail
      return '❌ Không thể kết nối với Gemini API. Vui lòng thử lại sau hoặc liên hệ Zalo OA để được hỗ trợ trực tiếp.';

    } catch (error: any) {
      console.error('❌ Fatal error:', error);
      
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        return '🌐 Lỗi kết nối mạng. Vui lòng kiểm tra internet.';
      }

      return `❌ Lỗi: ${error.message}. Vui lòng thử lại sau.`;
    }
  }

  resetChat() {
    console.log('🔄 Chat reset');
  }
}

export const geminiService = new GeminiService();
