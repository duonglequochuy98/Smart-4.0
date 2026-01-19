import React from 'react';
import { ArrowLeft, Bell, AlertCircle, Calendar, ExternalLink } from 'lucide-react';
import { NewsItem } from '../App';

interface NotificationViewProps {
  onBack: () => void;
  notifications: NewsItem[];
  setNotifications: React.Dispatch<React.SetStateAction<NewsItem[]>>;
}

export const NotificationView: React.FC<NotificationViewProps> = ({ 
  onBack, 
  notifications, 
  setNotifications 
}) => {
  const handleMarkAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, isRead: true } : n)
    );
  };

  const handleOpenLink = (notification: NewsItem) => {
    if (notification.url) {
      window.open(notification.url, '_blank');
    }
    handleMarkAsRead(notification.id);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Thông báo': return 'bg-red-100 text-red-700';
      case 'Tin tức': return 'bg-blue-100 text-blue-700';
      case 'Sự kiện': return 'bg-purple-100 text-purple-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="h-full bg-slate-50 flex flex-col overflow-y-auto pb-24">
      <div className="sticky top-0 bg-white border-b border-slate-100 p-5 flex items-center gap-3 z-10">
        <button onClick={onBack} className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 hover:bg-slate-100">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-lg font-black text-slate-800">Thông báo</h1>
        <div className="ml-auto w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-xs font-black">
          {notifications.filter(n => !n.isRead).length}
        </div>
      </div>

      <div className="p-4 space-y-3">
        {notifications.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="mx-auto text-slate-300 mb-4" size={48} />
            <p className="text-slate-500">Chưa có thông báo nào</p>
          </div>
        ) : (
          notifications.map(notification => (
            <div
              key={notification.id}
              onClick={() => handleMarkAsRead(notification.id)}
              className={`bg-white rounded-2xl p-4 space-y-3 cursor-pointer transition-all ${
                notification.isRead ? 'opacity-60' : 'shadow-sm hover:shadow-md'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  notification.isImportant ? 'bg-red-100' : 'bg-slate-100'
                }`}>
                  {notification.isImportant ? (
                    <AlertCircle className="text-red-600" size={20} />
                  ) : notification.isBooking ? (
                    <Calendar className="text-blue-600" size={20} />
                  ) : (
                    <Bell className="text-slate-600" size={20} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-2 mb-1">
                    <h3 className="font-bold text-slate-800 text-sm flex-1">{notification.title}</h3>
                    {!notification.isRead && (
                      <span className="w-2 h-2 bg-red-600 rounded-full shrink-0 mt-1.5"></span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{notification.summary}</p>
                  
                  {notification.bookingData && (
                    <div className="mt-3 p-3 bg-slate-50 rounded-xl space-y-1.5">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500">Mã lịch hẹn:</span>
                        <span className="font-bold text-slate-800">{notification.bookingData.code}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500">Thời gian:</span>
                        <span className="font-bold text-slate-800">{notification.bookingData.time} - {notification.bookingData.date}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500">Địa điểm:</span>
                        <span className="font-bold text-slate-800">{notification.bookingData.counter}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] px-2 py-1 rounded-full font-bold ${getCategoryColor(notification.category)}`}>
                    {notification.category}
                  </span>
                  <span className="text-xs text-slate-400">{notification.date}</span>
                </div>
                {notification.url && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenLink(notification);
                    }}
                    className="text-red-600 hover:text-red-700 flex items-center gap-1 text-xs font-bold"
                  >
                    Xem chi tiết
                    <ExternalLink size={12} />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
