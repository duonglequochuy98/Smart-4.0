import React from 'react';
import { ArrowLeft, LogIn } from 'lucide-react';

interface LoginViewProps {
  onBack: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onBack }) => {
  return (
    <div className="h-full bg-white flex flex-col">
      <div className="p-5 pt-7 flex items-center gap-3 border-b border-slate-100">
        <button onClick={onBack} className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50">
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-lg font-bold">Đăng nhập</h2>
      </div>
      
      <div className="flex-1 p-6">
        <div className="text-center py-20">
          <LogIn size={48} className="mx-auto text-slate-300 mb-4" />
          <p className="text-slate-500">Chức năng đang phát triển</p>
        </div>
      </div>
    </div>
  );
};
```

---

## 📋 Bước 3: Cấu trúc thư mục hoàn chỉnh
```
project/
├── components/
│   ├── AIAssistant.tsx       ✅ (Copy từ artifact)
│   ├── FeatureCard.tsx       ✅
│   ├── TrackingView.tsx      ✅
│   ├── SubmissionView.tsx    ✅
│   ├── BookingView.tsx       ✅
│   ├── ReportView.tsx        ✅
│   ├── NotificationView.tsx  ✅
│   └── LoginView.tsx         ✅
├── App.tsx                   ✅ (Đã có)
├── types.ts                  ✅ (Đã có)
├── index.tsx                 ✅ (Đã có)
└── .env.local                ⚠️ (Cần tạo - xem bước 4)
```

---

## 📋 Bước 4: QUAN TRỌNG - API không hoạt động

⚠️ **LƯU Ý:** Code AI hiện tại sử dụng Claude API của Anthropic, nhưng **KHÔNG CÓ API KEY**.

### **Giải pháp tạm thời:**
Component AIAssistant tôi đã tạo có **Fallback Response** - tức là khi API lỗi, nó sẽ tự động trả lời dựa trên từ khóa người dùng nhập.

### **Để AI hoạt động đầy đủ (tùy chọn):**

**Cách 1: Sử dụng Free Anthropic API (Khuyến nghị)**
1. Đăng ký tài khoản tại: https://console.anthropic.com
2. Tạo API key miễn phí
3. Tạo file `.env.local` trong thư mục gốc:
```
   GEMINI_API_KEY=your-anthropic-api-key-here
