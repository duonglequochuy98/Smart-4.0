
import React, { useState, useMemo, memo } from 'react';
import { ArrowLeft, Bell, Calendar, ChevronRight, Megaphone, Info, Search, CalendarCheck, X, ShieldCheck, Barcode } from 'lucide-react';
import { NewsItem } from '../App';

interface NotificationViewProps {
  onBack: () => void;
  notifications: NewsItem[];
  setNotifications: React.Dispatch<React.SetStateAction<NewsItem[]>>;
}

interface NewsCardProps {
  news: NewsItem;
  onClick: (item: NewsItem) => void;
}

const NewsCard = memo(({ news, onClick }: NewsCardProps) => {
  return (
    <button 
      onClick={() => onClick(news)}
      className={`w-full text-left p-4 rounded-[24px] border transition-all active:scale-[0.98] relative overflow-hidden flex gap-4 ${
        news.isRead ? 'bg-white border-slate-100' : 'bg-white border-red-100 shadow-sm'
      }`}
    >
      {!news.isRead && (
        <div className="absolute top-0 left-0 w-1 h-full bg-red-600"></div>
      )}
      
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
        news.isBooking ? 'bg-emerald-50 text-emerald-600' :
        news.category === 'Thông báo' ? 'bg-orange-50 text-orange-600' :
        news.category === 'Sự kiện' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'
      }`}>
        {news.isBooking ? <CalendarCheck size={22} /> :
         news.category === 'Thông báo' ? <Megaphone size={22} /> :
         news.category === 'Sự kiện' ? <Calendar size={22} /> : <Info size={22} />}
      </div>

      <div className="flex-1 space-y-2">
        <div className="flex items-center justify-between">
          <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${
            news.isBooking ? 'bg-emerald-100 text-emerald-700' :
            news.category === 'Thông báo' ? 'bg-orange-100 text-orange-700' :
            news.category === 'Sự kiện' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'
          }`}>
            {news.isBooking ? 'Lịch hẹn' : news.category}
          </span>
          <span className="text-[10px] font-bold text-slate-400">{news.date}</span>
        </div>
        
        <h3 className={`text-sm font-bold leading-tight ${news.isRead ? 'text-slate-600 font-semibold' : 'text-slate-900 font-bold'}`}>
          {news.title}
          {news.isImportant && (
            <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded bg-red-50 text-red-600 text-[8px] font-black uppercase">Quan trọng</span>
          )}
        </h3>
        
        <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed font-medium">
          {news.summary}
        </p>

        <div className="flex items-center gap-1 text-red-600 text-[10px] font-bold pt-1">
          {news.isBooking ? 'Xem phiếu hẹn' : 'Xem chi tiết'}
          <ChevronRight size={12} strokeWidth={3} />
        </div>
      </div>
    </button>
  );
});

export const NotificationView: React.FC<NotificationViewProps> = ({ onBack, notifications, setNotifications }) => {
  const [activeCategory, setActiveCategory] = useState<string>('Tất cả');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<NewsItem['bookingData'] | null>(null);

  const filteredNews = useMemo(() => {
    let list = activeCategory === 'Tất cả' 
      ? notifications 
      : notifications.filter(n => n.category === activeCategory);
    
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(n => n.title.toLowerCase().includes(q) || n.summary.toLowerCase().includes(q));
    }
    
    return list;
  }, [notifications, activeCategory, searchQuery]);

  const handleNewsClick = (item: NewsItem) => {
    setNotifications(prev => prev.map(n => n.id === item.id ? { ...n, isRead: true } : n));
    
    if (item.isBooking && item.bookingData) {
      setSelectedBooking(item.bookingData);
    } else if (item.url && item.url !== '#') {
      window.open(item.url, '_blank');
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#F8FAFC] animate-in fade-in slide-in-from-right-4 duration-500 relative">
      <div className="p-4 flex items-center justify-between border-b bg-white sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 transition-all active:scale-90">
            <ArrowLeft size={22} className="text-slate-700" />
          </button>
          <h2 className="text-lg font-black text-slate-800">Thông báo & Tin tức</h2>
        </div>
        <div className="w-10 h-10 bg-red-50 text-red-600 rounded-full flex items-center justify-center relative shadow-sm">
          <Bell size={20} />
          {notifications.some(n => !n.isRead) && (
            <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-600 border-2 border-white rounded-full"></span>
          )}
        </div>
      </div>

      <div className="p-5 space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Tìm kiếm tin tức..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
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

      <div className="flex-1 overflow-y-auto px-5 pb-24 space-y-4 no-scrollbar">
        {filteredNews.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400 space-y-3">
            <Bell size={48} strokeWidth={1} />
            <p className="text-sm font-bold">Không có thông báo nào</p>
          </div>
        ) : (
          filteredNews.map((news) => (
            <NewsCard key={news.id} news={news} onClick={handleNewsClick} />
          ))
        )}
      </div>

      {/* Booking Ticket Modal */}
      {selectedBooking && (
        <div className="absolute inset-0 z-[100] animate-in fade-in duration-300">
           <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" onClick={() => setSelectedBooking(null)}></div>
           <div className="absolute inset-x-0 bottom-0 top-16 flex flex-col items-center justify-center p-6 animate-in zoom-in slide-in-from-bottom duration-500 pointer-events-none">
              <div className="w-full max-w-[340px] bg-slate-900 rounded-[40px] overflow-hidden flex flex-col shadow-2xl border border-white/5 pointer-events-auto">
                 <div className="p-8 space-y-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                    <div className="space-y-6">
                       <div className="flex justify-between items-start">
                          <div className="space-y-1">
                             <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Người đăng ký</p>
                             <p className="text-xl font-black text-white uppercase">{selectedBooking.name}</p>
                          </div>
                          <ShieldCheck size={28} className="text-red-500 opacity-50" />
                       </div>

                       <div className="space-y-1">
                         <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Mã số cuộc hẹn</p>
                         <p className="text-2xl font-black text-red-500 tracking-[0.1em]">{selectedBooking.code}</p>
                       </div>

                       <div className="h-[1px] w-full bg-white/5"></div>

                       <div className="grid grid-cols-2 gap-6">
                         <div className="space-y-1 text-left">
                            <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Lĩnh vực</p>
                            <p className="text-[11px] font-bold text-white leading-tight">{selectedBooking.service}</p>
                         </div>
                         <div className="space-y-1 text-right">
                            <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Vị trí</p>
                            <p className="text-lg font-black text-red-500 uppercase">Quầy {selectedBooking.counter}</p>
                         </div>
                       </div>

                       <div className="grid grid-cols-2 gap-6">
                         <div className="space-y-1 text-left">
                            <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Khung giờ</p>
                            <p className="text-sm font-bold text-white">{selectedBooking.time}</p>
                         </div>
                         <div className="space-y-1 text-right">
                            <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Ngày hẹn</p>
                            <p className="text-sm font-bold text-white">{selectedBooking.date}</p>
                         </div>
                       </div>
                    </div>

                    <div className="pt-4 flex flex-col items-center space-y-3">
                       <div className="text-slate-500 opacity-20">
                          <Barcode size={64} strokeWidth={1} />
                       </div>
                       <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.4em]">Smart Tây Thạnh 4.0 Authenticated</p>
                    </div>

                    <button 
                      onClick={() => setSelectedBooking(null)}
                      className="w-full h-12 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-bold text-xs transition-all active:scale-95"
                    >
                      Đóng
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}

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
