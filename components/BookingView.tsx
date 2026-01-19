import React from 'react';
import { ArrowLeft, Calendar } from 'lucide-react';

interface BookingViewProps {
  onBack: () => void;
  onAddNotification: (notification: any) => void;
}

export const BookingView: React.FC<BookingViewProps> = ({ onBack }) => {
  return (
    <div className="h-full bg-white flex flex-col">
      <div className="p-5 pt-7 flex items-center gap-3 border-b border-slate-100">
        <button onClick={onBack} className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50">
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-lg font-bold">Đặt lịch hẹn</h2>
      </div>
      
      <div className="flex-1 p-6">
        <div className="text-center py-20">
          <Calendar size={48} className="mx-auto text-slate-300 mb-4" />
          <p className="text-slate-500">Chức năng đang phát triển</p>
        </div>
      </div>
    </div>
  );
};
