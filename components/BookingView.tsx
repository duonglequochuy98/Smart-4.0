import React, { useState } from 'react';
import { ArrowLeft, CalendarCheck, Clock, User, CheckCircle } from 'lucide-react';
import { NewsItem } from '../App';

interface BookingViewProps {
  onBack: () => void;
  onAddNotification: (news: NewsItem) => void;
}

export const BookingView: React.FC<BookingViewProps> = ({ onBack, onAddNotification }) => {
  const [name, setName] = useState('');
  const [service, setService] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [booked, setBooked] = useState(false);

  const services = [
    'Chứng thực bản sao',
    'Đăng ký khai sinh',
    'Đăng ký kết hôn',
    'Cấp giấy xác nhận'
  ];

  const handleBooking = () => {
    if (name && service && date && time) {
      const bookingCode = `LH${Date.now().toString().slice(-6)}`;
      const counter = Math.floor(Math.random() * 5) + 1;
      
      const notification: NewsItem = {
        id: Date.now(),
        title: `Xác nhận đặt lịch hẹn - ${service}`,
        summary: `Quý khách ${name} đã đặt lịch thành công vào ${time} ngày ${date} tại quầy ${counter}.`,
        date: new Date().toLocaleString('vi-VN'),
        category: 'Thông báo',
        isRead: false,
        isImportant: true,
        isBooking: true,
        bookingData: {
          name,
          code: bookingCode,
          service,
          time,
          date,
          counter: `Quầy ${counter}`
        }
      };
      
      onAddNotification(notification);
      setBooked(true);
      setTimeout(() => {
        setBooked(false);
        onBack();
      }, 3000);
    }
  };

  return (
    <div className="h-full bg-white flex flex-col overflow-y-auto pb-24">
      <div className="sticky top-0 bg-white border-b border-slate-100 p-5 flex items-center gap-3 z-10">
        <button onClick={onBack} className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 hover:bg-slate-100">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-lg font-black text-slate-800">Đặt lịch hẹn</h1>
      </div>

      <div className="p-6 space-y-6">
        {booked ? (
          <div className="text-center py-12 space-y-4">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="text-green-600" size={40} />
            </div>
            <h3 className="text-xl font-black text-slate-800">Đặt lịch thành công!</h3>
            <p className="text-slate-600">Kiểm tra thông báo để xem chi tiết</p>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              <label className="text-sm font-bold text-slate-700">Họ và tên</label>
              <div className="flex items-center gap-3 h-12 px-4 border border-slate-200 rounded-xl">
                <User size={18} className="text-slate-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nhập họ tên..."
                  className="flex-1 outline-none"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-bold text-slate-700">Chọn dịch vụ</label>
              <select
                value={service}
                onChange={(e) => setService(e.target.value)}
                className="w-full h-12 px-4 border border-slate-200 rounded-xl focus:outline-none focus:border-red-500"
              >
                <option value="">-- Chọn dịch vụ --</option>
                {services.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-3">
                <label className="text-sm font-bold text-slate-700">Ngày</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full h-12 px-4 border border-slate-200 rounded-xl focus:outline-none focus:border-red-500"
                />
              </div>
              <div className="space-y-3">
                <label className="text-sm font-bold text-slate-700">Giờ</label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full h-12 px-4 border border-slate-200 rounded-xl focus:outline-none focus:border-red-500"
                />
              </div>
            </div>

            <button
              onClick={handleBooking}
              disabled={!name || !service || !date || !time}
              className="w-full h-14 bg-red-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CalendarCheck size={20} />
              Xác nhận đặt lịch
            </button>
          </>
        )}
      </div>
    </div>
  );
};
