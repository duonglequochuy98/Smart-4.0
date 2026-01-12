
import React, { useState } from 'react';
import { ArrowLeft, Bell, Calendar, ChevronRight, Megaphone, Info, Search } from 'lucide-react';

interface NotificationViewProps {
  onBack: () => void;
}

interface NewsItem {
  id: number;
  title: string;
  summary: string;
  date: string;
  category: 'Thông báo' | 'Tin tức' | 'Sự kiện';
  isRead: boolean;
  isImportant?: boolean;
  url?: string;
}

const MOCK_NEWS: NewsItem[] = [
  {
    id: 1,
    title: "Thông báo về việc nghỉ lễ Tết dương lịch 01/01/2026",
    summary: "UBND Phường Tây Thạnh thông báo lịch nghỉ lễ và trực giải quyết hồ sơ cấp bách trong dịp lễ Quốc khánh.",
    date: "10:30 - 25/08/2024",
    category: "Thông báo",
    url: 'https://thuvienphapluat.vn/chinh-sach-phap-luat-moi/vn/ho-tro-phap-luat/tu-van-phap-luat/92028/lich-nghi-le-quoc-khanh-2-9-2025-nguoi-lao-dong-duoc-nghi-le-4-ngay-hay-3-ngay',
    isRead: false,
    isImportant: true
  },
  {
    id: 2,
    title: "Triển khai đợt cao điểm cấp CCCD gắn chip và định danh điện tử VNeID",
    summary: "Hỗ trợ người dân cài đặt và kích hoạt tài khoản định danh điện tử mức độ 2 tại trụ sở Công an Phường.",
    date: "08:00 - 20/08/2024",
    category: "Sự kiện",
    url: 'https://thuvienphapluat.vn/chinh-sach-phap-luat-moi/vn/ho-tro-phap-luat/tu-van-phap-luat/92028/lich-nghi-le-quoc-khanh-2-9-2025-nguoi-lao-dong-duoc-nghi-le-4-ngay-hay-3-ngay',
    isRead: false
  },
  {
    id: 3,
    title: "Hướng dẫn nộp hồ sơ trực tuyến qua Cổng dịch vụ công mới",
    summary: "Các bước đơn giản để nộp hồ sơ chứng thực bản sao và đăng ký khai sinh ngay tại nhà.",
    date: "05:00 - 05/01/2025",
    category: "Tin tức",
    url: 'https://www.youtube.com/watch?v=HSmgjZ4Q6dM',
    isRead: true,
    isImportant: true
  },
  {
    id: 4,
    title: "Lịch tiêm chủng mở rộng cho trẻ em tháng 01/2026",
    summary: "Danh sách các loại vaccine và thời gian tiêm chủng tại Trạm y tế Phường Tây Thạnh.",
    date: "09:15 - 12/01/2026",
    category: "Thông báo",
    url: 'https://thuvienphapluat.vn/chinh-sach-phap-luat-moi/vn/ho-tro-phap-luat/tu-van-phap-luat/92028/lich-nghi-le-quoc-khanh-2-9-2025-nguoi-lao-dong-duoc-nghi-le-4-ngay-hay-3-ngay',
    isRead: true
  },
  {
    id: 5,
    title: "Cập nhật ứng dụng Smart Tây Thạnh phiên bản 4.0.2",
    summary: "Bổ sung tính năng Trợ lý ảo AI thông minh và tra cứu chỉ số phục vụ trực tuyến.",
    date: "09:15 - 01/01/2026",
    category: "Thông báo",
    url: '#',
    isRead: true
  }
];

export const NotificationView: React.FC<NotificationViewProps> = ({ onBack }) => {
  const [activeCategory, setActiveCategory] = useState<string>('Tất cả');

  const filteredNews = activeCategory === 'Tất cả' 
    ? MOCK_NEWS 
    : MOCK_NEWS.filter(n => n.category === activeCategory);

  const handleNewsClick = (url?: string) => {
    if (url && url !== '#') {
      window.open(url, '_blank');
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#F8FAFC] animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="p-4 flex items-center justify-between border-b bg-white sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 transition-all active:scale-90">
            <ArrowLeft size={22} className="text-slate-700" />
          </button>
          <h2 className="text-lg font-black text-slate-800">Thông báo & Tin tức</h2>
        </div>
        <div className="w-10 h-10 bg-red-50 text-red-600 rounded-full flex items-center justify-center relative shadow-sm">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-600 border-2 border-white rounded-full"></span>
        </div>
      </div>

      <div className="p-5 space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Tìm kiếm tin tức..." 
            className="w-full h-12 bg-white border border-slate-200 rounded-2xl pl-11 pr-4 text-sm focus:outline-none focus:ring-4 focus:ring-red-600/5 focus:border-red-600 transition-all font-medium"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {['Tất cả', 'Thông báo', 'Tin tức', 'Sự kiện'].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-[11px] font-black whitespace-nowrap transition-all ${
                activeCategory === cat 
                  ? 'bg-red-600 text-white shadow-lg shadow-red-600/20' 
                  : 'bg-white text-slate-500 border border-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-24 space-y-4">
        {filteredNews.map((news) => (
          <button 
            key={news.id}
            onClick={() => handleNewsClick(news.url)}
            className={`w-full text-left p-4 rounded-[24px] border transition-all active:scale-[0.98] relative overflow-hidden flex gap-4 ${
              news.isRead ? 'bg-white border-slate-100 opacity-80' : 'bg-white border-red-100 shadow-sm'
            }`}
          >
            {!news.isRead && (
              <div className="absolute top-0 left-0 w-1 h-full bg-red-600"></div>
            )}
            
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
              news.category === 'Thông báo' ? 'bg-orange-50 text-orange-600' :
              news.category === 'Sự kiện' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'
            }`}>
              {news.category === 'Thông báo' ? <Megaphone size={22} /> :
               news.category === 'Sự kiện' ? <Calendar size={22} /> : <Info size={22} />}
            </div>

            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between">
                <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${
                  news.category === 'Thông báo' ? 'bg-orange-100 text-orange-700' :
                  news.category === 'Sự kiện' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'
                }`}>
                  {news.category}
                </span>
                <span className="text-[10px] font-bold text-slate-400">{news.date}</span>
              </div>
              
              <h3 className={`text-sm font-bold leading-tight ${news.isRead ? 'text-slate-700' : 'text-slate-900'}`}>
                {news.title}
                {news.isImportant && (
                  <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded bg-red-50 text-red-600 text-[8px] font-black uppercase">Quan trọng</span>
                )}
              </h3>
              
              <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed font-medium">
                {news.summary}
              </p>

              <div className="flex items-center gap-1 text-red-600 text-[10px] font-bold pt-1">
                Xem chi tiết
                <ChevronRight size={12} strokeWidth={3} />
              </div>
            </div>
          </button>
        ))}
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};
