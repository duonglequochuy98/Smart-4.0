import React from 'react';
import { ArrowLeft, Bell } from 'lucide-react';

interface NotificationViewProps {
  onBack: () => void;
  notifications: any[];
  setNotifications: (notifications: any[]) => void;
}

export const NotificationView: React.FC<NotificationViewProps> = ({ onBack, notifications }) => {
  return (
    <div className="h-full bg-white flex flex-col">
      <div className="p-5 pt-7 flex items-center gap-3 border-b border-slate-100">
        <button onClick={onBack} className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50">
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-lg font-bold">Thông báo</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6">
        {notifications.map((notif) => (
          <div key={notif.id} className="mb-4 p-4 bg-slate-50 rounded-xl">
            <h3 className="font-bold text-sm mb-1">{notif.title}</h3>
            <p className="text-xs text-slate-600">{notif.summary}</p>
            <p className="text-xs text-slate-400 mt-2">{notif.date}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
