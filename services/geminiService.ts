import { GoogleGenerativeAI } from "@google/generative-ai";
import { Message } from "../types";

// Lấy API key từ environment variable
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.GEMINI_API_KEY;

if (!API_KEY) {
  console.error('⚠️ GEMINI_API_KEY không được thiết lập!');
}

// Khởi tạo Google Generative AI
const genAI = new GoogleGenerativeAI(API_KEY);

export interface Message {
  role: 'user' | 'model';
  text: string;
}

export class GeminiService {
  private model;

  constructor() {
    // Sử dụng model gemini-pro hoặc gemini-1.5-flash
    this.model = genAI.getGenerativeModel({ 
      model: 'gemini-pro',
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048,
      }
    });
  }

  async chat(message: string, history: Message[] = []): Promise<string> {
    try {
      // Chuyển đổi history sang format của Gemini
      const formattedHistory = history.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.text }]
      }));

      const chat = this.model.startChat({
        history: formattedHistory,
      });

      const result = await chat.sendMessage(message);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Lỗi khi gọi Gemini API:', error);
      throw error;
    }
  }

  async generateResponse(prompt: string): Promise<string> {
    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Lỗi khi generate response:', error);
      throw error;
    }
  }
}

export const geminiService = new GeminiService();
