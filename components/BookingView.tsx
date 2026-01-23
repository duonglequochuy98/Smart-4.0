
import { ArrowLeft, Calendar, Clock, ChevronRight, CheckCircle2, User, Phone, Download, ShieldCheck, MapPin, CreditCard, AlertCircle, Mail } from 'lucide-react';
import React, { useState, useMemo, useEffect } from 'react';
import { NewsItem } from '../App';

interface BookingViewProps {
  onAddNotification: (news: NewsItem) => void;
  onBack: () => void;
}

const SERVICES = [
  "Chứng thực bản sao/chữ ký",
  "Hộ tịch (Khai sinh/Kết hôn)",
  "Bảo trợ xã hội & Chính sách",
  "Xác nhận tình trạng hôn nhân",
  "Thủ tục đất đai/xây dựng",
  "Đăng ký hộ kinh doanh",
  "Khác (Tư vấn hành chính)"
];

const ALL_TIME_SLOTS = [
  "07:30 - 08:00", "08:00 - 08:30", "08:30 - 09:00", "09:00 - 09:30",
  "09:30 - 10:00", "10:00 - 10:30", "10:30 - 11:00", "11:00 - 11:30",
  "13:30 - 14:00", "14:00 - 14:30", "14:30 - 15:00", "15:00 - 15:30",
  "15:30 - 16:00", "16:00 - 16:30", "16:30 - 17:00"
];

const WEBHOOK_URL = "https://hook.eu1.make.com/3jedqnym7s6niv5t3a6wpzqpbjbjll8k";

const getCounterNumber = (service: string): string => {
  switch (service) {
    case "Chứng thực bản sao/chữ ký": return "07";
    case "Hộ tịch (Khai sinh/Kết hôn)": return "10";
    case "Xác nhận tình trạng hôn nhân": return "10";
    case "Bảo trợ xã hội & Chính sách": return "03";
    case "Thủ tục đất đai/xây dựng": return "11";
    case "Đăng ký hộ kinh doanh": return "12";
    default: return "01";
  }
};

export const BookingView: React.FC<BookingViewProps> = ({ onBack, onAddNotification }) => {
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  const availableDates = useMemo(() => {
    const dates = [];
    let count = 0;
    let dayOffset = 0;
    while (count < 14) {
      const d = new Date();
      d.setDate(d.getDate() + dayOffset);
      if (d.getDay() !== 0) {
        dates.push(d);
        count++;
      }
      dayOffset++;
    }
    return dates;
  }, []);

  const [formData, setFormData] = useState({
    service: '',
    dateValue: availableDates[0],
    dateString: availableDates[0].toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' }),
    time: '',
    name: '',
    cccd: '',
    phone: '',
    email: '',
    note: ''
  });

  // Tự động tải thông tin từ localStorage nếu đã định danh
  useEffect(() => {
    const savedName = localStorage.getItem('smart_taythanh_user_name');
    const savedCccd = localStorage.getItem('smart_taythanh_user_cccd');
    const savedPhone = localStorage.getItem('smart_taythanh_user_phone');
    const savedEmail = localStorage.getItem('smart_taythanh_user_email');
    
    setFormData(prev => ({
      ...prev,
      name: savedName || '',
      cccd: savedCccd || '',
      phone: savedPhone || '',
      email: savedEmail || ''
    }));
  }, []);

  const filteredTimeSlots = useMemo(() => {
    let slots = [...ALL_TIME_SLOTS];
    const isSelectedSaturday = formData.dateValue.getDay() === 6;
    const isSelectedToday = formData.dateValue.toDateString() === currentTime.toDateString();

    if (isSelectedSaturday) slots = slots.filter(slot => parseInt(slot.split(':')[0]) < 12);
    if (isSelectedToday) {
      slots = slots.filter(slot => {
        const [h, m] = slot.split(' - ')[0].split(':').map(Number);
        return h > currentTime.getHours() || (h === currentTime.getHours() && m > currentTime.getMinutes());
      });
    }
    return slots;
  }, [formData.dateValue, currentTime]);

  const handleComplete = async () => {
    setIsProcessing(true);
    
    const smartCode = `TT-${Math.random().toString(36).substr(2, 8).toUpperCase()}`;
    const payload = {
      ...formData,
      bookingCode: smartCode,
      timestamp: new Date().toISOString()
    };

    try {
      // Gửi dữ liệu tới Webhook mới (Make.com)
      await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch (e) {
      console.error("Webhook error:", e);
    }

    // Lưu số điện thoại và email lại cho lần sau
    localStorage.setItem('smart_taythanh_user_phone', formData.phone);
    localStorage.setItem('smart_taythanh_user_email', formData.email);

    setTimeout(() => {
      setIsProcessing(false);
      onAddNotification({
        id: Date.now(),
        title: `Lịch hẹn: ${formData.service}`,
        summary: `Hẹn lúc ${formData.time} ngày ${formData.dateString}. Đã lưu thông tin cho ông/bà ${formData.name}.`,
        date: new Date().toLocaleTimeString(),
        category: 'Thông báo',
        isRead: false,
        isBooking: true,
        bookingData: {
          name: formData.name,
          code: smartCode,
          service: formData.service,
          time: formData.time,
          date: formData.dateString,
          counter: getCounterNumber(formData.service)
        }
      });
      setStep(3);
    }, 1000);
  };

  if (step === 3) {
    return (
      <div className="flex flex-col h-full bg-[#450a0a] items-center p-6 text-center animate-in fade-in duration-500">
        <div className="w-16 h-16 bg-yellow-400/20 rounded-full flex items-center justify-center text-yellow-400 mt-12 mb-6">
          <CheckCircle2 size={36} />
        </div>
        <h2 className="text-2xl font-black text-yellow-400 mb-2">Đăng ký thành công!</h2>
        <p className="text-sm text-yellow-100/60 mb-8">Hệ thống đã ghi nhận lịch hẹn của ông/bà {formData.name}. Thông tin đã được gửi tới hệ thống xử lý trung tâm.</p>
        <button onClick={onBack} className="w-full h-14 bg-yellow-400 text-red-950 rounded-2xl font-bold uppercase tracking-widest active:scale-95 transition-all">Trở về trang chủ</button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#F8FAFC] pb-20">
      <div className="p-4 flex items-center gap-3 border-b bg-white">
        <button onClick={() => step === 2 ? setStep(1) : onBack()} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-50 transition-all">
          <ArrowLeft size={22} />
        </button>
        <h2 className="text-lg font-black text-slate-800">{step === 1 ? 'Đặt lịch hẹn' : 'Xác nhận thông tin'}</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-8 no-scrollbar">
        {step === 1 ? (
          <>
            <div className="space-y-4">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">1. Chọn ngày & Dịch vụ</p>
              <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                {availableDates.map((date, idx) => (
                  <button
                    key={idx}
                    onClick={() => setFormData({ ...formData, dateValue: date, dateString: date.toLocaleDateString('vi-VN') })}
                    className={`min-w-[75px] py-4 rounded-2xl border flex flex-col items-center transition-all ${
                      formData.dateString === date.toLocaleDateString('vi-VN') ? 'bg-red-600 border-red-600 text-white' : 'bg-white border-slate-100 text-slate-500'
                    }`}
                  >
                    <span className="text-[10px] font-bold uppercase opacity-60">{date.toLocaleDateString('vi-VN', { weekday: 'short' })}</span>
                    <span className="text-lg font-black">{date.getDate()}</span>
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-1 gap-2">
                {SERVICES.map((s) => (
                  <button key={s} onClick={() => setFormData({...formData, service: s})} className={`p-4 rounded-xl border text-left flex justify-between items-center transition-all ${formData.service === s ? 'bg-red-50 border-red-200 text-red-700' : 'bg-white border-slate-100'}`}>
                    <span className="text-sm font-bold">{s}</span>
                    {formData.service === s && <CheckCircle2 size={16} />}
                  </button>
                ))}
              </div>
            </div>
            {formData.service && (
              <div className="grid grid-cols-3 gap-2">
                {filteredTimeSlots.map(slot => (
                  <button key={slot} onClick={() => setFormData({...formData, time: slot})} className={`py-3 rounded-xl border text-[11px] font-bold ${formData.time === slot ? 'bg-red-600 text-white border-red-600' : 'bg-white border-slate-100 text-slate-600'}`}>{slot}</button>
                ))}
              </div>
            )}
            <button disabled={!formData.time} onClick={() => setStep(2)} className="w-full h-14 bg-red-600 text-white rounded-2xl font-bold uppercase shadow-xl shadow-red-600/20 disabled:opacity-20 transition-all">Tiếp tục</button>
          </>
        ) : (
          <div className="space-y-6">
            <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
               <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center text-red-600"><Calendar size={20} /></div>
                  <p className="text-sm font-black">{formData.dateString} - {formData.time}</p>
               </div>
               <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Dịch vụ đã chọn</p>
               <p className="text-sm font-black text-red-600">{formData.service}</p>
            </div>
            <div className="space-y-4">
               <div className="flex items-center justify-between px-1">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Thông tin cá nhân (Tự động điền)</p>
                 <ShieldCheck size={14} className="text-emerald-500" />
               </div>
               <div className="relative">
                 <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                 <input type="text" placeholder="Họ và tên" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full h-14 bg-white border border-slate-200 rounded-2xl pl-12 pr-4 text-sm font-bold outline-none focus:border-red-600" />
               </div>
               <div className="relative">
                 <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                 <input type="text" placeholder="Số CCCD (12 số)" value={formData.cccd} onChange={(e) => setFormData({...formData, cccd: e.target.value})} className="w-full h-14 bg-white border border-slate-200 rounded-2xl pl-12 pr-4 text-sm font-bold outline-none focus:border-red-600" />
               </div>
               <div className="relative">
                 <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                 <input type="tel" placeholder="Số điện thoại" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full h-14 bg-white border border-slate-200 rounded-2xl pl-12 pr-4 text-sm font-bold outline-none focus:border-red-600" />
               </div>
               <div className="relative">
                 <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                 <input type="email" placeholder="Địa chỉ Email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full h-14 bg-white border border-slate-200 rounded-2xl pl-12 pr-4 text-sm font-bold outline-none focus:border-red-600" />
               </div>
            </div>
            <button disabled={!formData.name || isProcessing} onClick={handleComplete} className="w-full h-14 bg-red-600 text-white rounded-2xl font-bold uppercase shadow-xl shadow-red-600/20 active:scale-95 transition-all">Xác nhận lịch hẹn</button>
          </div>
        )}
      </div>
    </div>
  );
};
