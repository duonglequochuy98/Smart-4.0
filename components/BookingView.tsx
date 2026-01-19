
import React, { useState, useMemo, useEffect } from 'react';
import { ArrowLeft, Calendar, Clock, ChevronRight, CheckCircle2, User, Phone, FileText, Download, ShieldCheck, MapPin, Edit3, Barcode, Info, Home, Sparkles, CreditCard } from 'lucide-react';
import { NewsItem } from '../App';

interface BookingViewProps {
  onBack: () => void;
  onAddNotification: (news: NewsItem) => void;
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

const getCounterNumber = (service: string): string => {
  switch (service) {
    case "Chứng thực bản sao/chữ ký": return "07";
    case "Hộ tịch (Khai sinh/Kết hôn)": return "10";
    case "Xác nhận tình trạng hôn nhân": return "10";
    case "Bảo trợ Xã hội & Chính sách": return "03";
    case "Thủ tục đất đai/xây dựng": return "11";
    case "Đăng ký hộ kinh doanh": return "12";
    default: return "01";
  }
};

export const BookingView: React.FC<BookingViewProps> = ({ onBack, onAddNotification }) => {
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const availableDates = useMemo(() => {
    const dates = [];
    let count = 0;
    let dayOffset = 1;
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
    note: ''
  });

  const isSelectedSaturday = formData.dateValue.getDay() === 6;

  const filteredTimeSlots = useMemo(() => {
    if (isSelectedSaturday) {
      return ALL_TIME_SLOTS.filter(slot => {
        const hour = parseInt(slot.split(':')[0]);
        return hour < 12;
      });
    }
    return ALL_TIME_SLOTS;
  }, [isSelectedSaturday]);

  const smartCode = useMemo(() => {
    if (!formData.time) return "TT-PENDING";
    const day = String(formData.dateValue.getDate()).padStart(2, '0');
    const month = String(formData.dateValue.getMonth() + 1).padStart(2, '0');
    const timePart = formData.time.split(' ')[0].replace(':', '');
    const randomNumber = Math.floor(Math.random() * 100) + 1;
    return `TT-${day}${month}-${timePart}-${randomNumber}`;
  }, [formData.dateValue, formData.time]);

  const downloadTicketAsImage = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 1000;
    canvas.height = 1400;

    const bgGrad = ctx.createLinearGradient(0, 0, 0, 1400);
    bgGrad.addColorStop(0, '#7f1d1d');
    bgGrad.addColorStop(1, '#450a0a');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1000, 1400);

    ctx.fillStyle = '#facc15';
    ctx.fillRect(0, 0, 1000, 15);

    ctx.fillStyle = '#fef08a';
    ctx.font = '900 28px Plus Jakarta Sans';
    ctx.fillText('TRUNG  TÂM  PHỤC  VỤ  HÀNH  CHÍNH  CÔNG  PHƯỜNG  TÂY  THẠNH', 60, 70);
    
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.beginPath();
    ctx.roundRect(60, 180, 880, 1050, 50);
    ctx.fill();

    ctx.textAlign = 'center';
    ctx.fillStyle = '#facc15';
    ctx.font = '900 64px Plus Jakarta Sans';
    ctx.fillText('PHIẾU ĐẶT LỊCH HẸN', 500, 310);
    
    ctx.textAlign = 'left';
    const drawSection = (label: string, value: string, y: number, color = '#ffffff', size = 42, isUpper = true) => {
        ctx.fillStyle = 'rgba(254, 240, 138, 0.45)';
        ctx.font = '800 18px Plus Jakarta Sans';
        ctx.fillText(label.toUpperCase(), 110, y);
        ctx.fillStyle = color;
        ctx.font = `900 ${size}px Plus Jakarta Sans`;
        ctx.fillText(isUpper ? value.toUpperCase() : value, 110, y + 60);
    };

    drawSection('Họ tên người đăng ký', formData.name || 'Khách hàng', 430);
    drawSection('Số Căn cước công dân', formData.cccd || '000000000000', 540);
    drawSection('Mã số định danh lịch hẹn', smartCode, 660, '#fde047', 56);

    ctx.fillStyle = 'rgba(254, 240, 138, 0.45)';
    ctx.font = '800 22px Plus Jakarta Sans';
    ctx.fillText('LĨNH VỰC TIẾP NHẬN', 110, 790);
    ctx.fillStyle = '#ffffff';
    ctx.font = '800 32px Plus Jakarta Sans';
    ctx.fillText(formData.service, 110, 850);

    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(254, 240, 138, 0.25)';
    ctx.font = '900 14px Plus Jakarta Sans';
    ctx.fillText('BY SMART AI 4.0 - TRUNG TÂM PHỤC VỤ HÀNH CHÍNH CÔNG PHƯỜNG TÂY THẠNH', 500, 1340);

    const link = document.createElement('a');
    link.download = `PhieuHen_TayThanh_${smartCode}.png`;
    link.href = canvas.toDataURL('image/png', 1.0);
    link.click();
  };

  const handleNextStep = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setStep(2);
    }, 600);
  };

  const handleComplete = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      const now = new Date();
      const newsDate = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} - ${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;
      onAddNotification({
        id: Date.now(),
        title: `Lịch hẹn thành công: ${formData.service}`,
        summary: `Mã cuộc hẹn ${smartCode} của ông/bà ${formData.name} đã được xác nhận vào lúc ${formData.time} ngày ${formData.dateString.split(',')[1]}.`,
        date: newsDate,
        category: 'Thông báo',
        isRead: false,
        isBooking: true,
        bookingData: {
          name: formData.name,
          code: smartCode,
          service: formData.service,
          time: formData.time,
          date: formData.dateString.split(',')[1] || formData.dateString,
          counter: getCounterNumber(formData.service)
        }
      });
      setStep(3);
    }, 1000);
  };

  const isConfirmDisabled = !formData.name.trim() || formData.cccd.length !== 12 || !formData.phone.trim() || isProcessing;

  if (step === 3) {
    return (
      <div className="fixed inset-0 z-[200] flex flex-col bg-[#450a0a] animate-in fade-in duration-500 overflow-hidden">
        <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col items-center p-6 text-center">
          <div className="pt-4 space-y-3 shrink-0">
            <div className="w-16 h-16 bg-yellow-400/10 rounded-full flex items-center justify-center text-yellow-400 mx-auto border border-yellow-400/20 shadow-lg shadow-yellow-400/5">
              <CheckCircle2 size={36} />
            </div>
            <div className="space-y-1">
              <h2 className="text-2xl font-black text-yellow-400 tracking-tight">Xác nhận thành công!</h2>
              <p className="text-[11px] text-yellow-100/40 font-bold uppercase tracking-[0.2em]">Phiếu hẹn điện tử tại Phường Tây Thạnh</p>
            </div>
          </div>
          
          <div className="w-full max-w-[320px] bg-gradient-to-br from-red-800 to-red-950 text-white rounded-[40px] p-7 space-y-6 relative overflow-hidden shadow-[0_32px_64px_-12px_rgba(0,0,0,0.6)] border border-yellow-400/10 text-left my-8 shrink-0">
            <div className="space-y-6">
               <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <p className="text-[9px] font-black text-yellow-400/40 uppercase tracking-[0.2em]">Người đăng ký</p>
                    <p className="text-xl font-black text-white uppercase truncate max-w-[170px] leading-tight">{formData.name}</p>
                  </div>
                  <ShieldCheck size={28} className="text-yellow-400 opacity-60 shrink-0" />
               </div>
               <div className="space-y-1">
                 <p className="text-[9px] font-black text-yellow-400/40 uppercase tracking-[0.2em]">Mã số cuộc hẹn</p>
                 <p className="text-3xl font-black text-yellow-400 tracking-[0.02em] leading-tight">{smartCode}</p>
               </div>
               <div className="h-[1px] w-full bg-yellow-400/5"></div>
               <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-1">
                    <p className="text-[9px] font-black text-yellow-400/40 uppercase tracking-[0.2em]">Vị trí</p>
                    <p className="text-lg font-black text-yellow-200 uppercase">Quầy {getCounterNumber(formData.service)}</p>
                 </div>
                 <div className="space-y-1 text-right">
                    <p className="text-[9px] font-black text-yellow-400/40 uppercase tracking-[0.2em]">Thời gian</p>
                    <p className="text-sm font-bold text-white">{formData.time}</p>
                 </div>
               </div>
            </div>
          </div>

          <div className="w-full space-y-3 pb-10 mt-auto shrink-0 px-4">
            <button 
              onClick={downloadTicketAsImage} 
              className="w-full h-14 bg-yellow-400/10 text-yellow-400 rounded-2xl font-black text-[11px] flex items-center justify-center gap-2 active:scale-95 transition-all border border-yellow-400/20 hover:bg-yellow-400/20 uppercase tracking-widest"
            >
              <Download size={18} />
              Tải lại ảnh phiếu PNG
            </button>
            <button onClick={onBack} className="w-full h-16 bg-yellow-400 text-[#450a0a] rounded-2xl font-black text-sm active:scale-95 transition-all flex items-center justify-center gap-2 uppercase tracking-widest">
              <Home size={20} />
              Trở về Trang chủ
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#F8FAFC] animate-in fade-in slide-in-from-right-4 duration-500 pb-20">
      <div className="p-4 flex items-center gap-3 border-b bg-white sticky top-0 z-10">
        <button onClick={() => step === 2 ? setStep(1) : onBack()} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 transition-all">
          <ArrowLeft size={22} className="text-slate-700" />
        </button>
        <h2 className="text-lg font-black text-slate-800">
          {step === 1 ? 'Đặt lịch hẹn' : 'Xác nhận thông tin'}
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-8 no-scrollbar">
        {step === 1 ? (
          <>
            <div className="space-y-4">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">1. Chọn ngày làm việc</p>
              <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                {availableDates.map((date, idx) => {
                  const dateStr = date.toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' });
                  const isSelected = formData.dateString === dateStr;
                  return (
                    <button
                      key={idx}
                      onClick={() => setFormData({ ...formData, dateValue: date, dateString: dateStr, time: '' })}
                      className={`flex flex-col items-center justify-center min-w-[85px] py-4 rounded-2xl border transition-all ${
                        isSelected ? 'bg-red-600 border-red-600 text-white shadow-lg scale-105' : 'bg-white border-slate-100 text-slate-500 hover:border-slate-300'
                      }`}
                    >
                      <span className={`text-[10px] font-bold uppercase mb-1 ${isSelected ? 'text-white/70' : 'text-slate-400'}`}>{date.toLocaleDateString('vi-VN', { weekday: 'short' })}</span>
                      <span className="text-lg font-black">{date.getDate()}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="space-y-4">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">2. Chọn lĩnh vực</p>
              <div className="grid grid-cols-1 gap-3">
                {SERVICES.map((s) => (
                  <button 
                    key={s}
                    onClick={() => setFormData({...formData, service: s})}
                    className={`p-4 rounded-2xl border text-left flex items-center justify-between transition-all group ${
                      formData.service === s ? 'bg-red-50 border-red-600 ring-1 ring-red-600' : 'bg-white border-slate-100 hover:border-slate-300'
                    }`}
                  >
                    <span className={`text-sm font-bold ${formData.service === s ? 'text-red-700' : 'text-slate-700'}`}>{s}</span>
                    {formData.service === s && <CheckCircle2 size={18} className="text-red-600 animate-in zoom-in" />}
                  </button>
                ))}
              </div>
            </div>
            <button 
              disabled={!formData.service || !formData.time || isProcessing}
              onClick={handleNextStep}
              className="w-full h-14 bg-red-600 text-white rounded-2xl font-bold text-base shadow-lg shadow-red-600/10 active:scale-95 disabled:opacity-30 transition-all flex items-center justify-center gap-2 mt-4"
            >
              Tiếp tục <ChevronRight size={18} />
            </button>
          </>
        ) : (
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
             <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm space-y-4">
               <div className="flex items-center justify-between pb-4 border-b border-slate-50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center text-red-600"><Calendar size={20} /></div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase">Ngày hẹn</p>
                      <p className="text-sm font-black text-slate-800">{formData.dateString}</p>
                    </div>
                  </div>
               </div>
               <div className="flex items-center gap-4">
                 <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center text-red-600"><Clock size={20} /></div>
                 <p className="text-sm font-black text-slate-800">{formData.time} — {formData.service}</p>
               </div>
             </div>
             <div className="space-y-4">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">4. Thông tin cá nhân</p>
               <div className="space-y-3">
                 <div className="relative group">
                   <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                   <input type="text" placeholder="Họ và tên" value={formData.name} className="w-full h-14 bg-white border border-slate-200 rounded-2xl pl-12 pr-4 text-sm font-bold focus:border-red-500 outline-none" onChange={(e) => setFormData({...formData, name: e.target.value})} />
                 </div>
                 <div className="relative group">
                   <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                   <input type="text" maxLength={12} placeholder="Số CCCD (12 số)" value={formData.cccd} className="w-full h-14 bg-white border border-slate-200 rounded-2xl pl-12 pr-4 text-sm font-bold focus:border-red-500 outline-none" onChange={(e) => setFormData({...formData, cccd: e.target.value.replace(/\D/g, '')})} />
                 </div>
                 <div className="relative group">
                   <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                   <input type="tel" placeholder="Số điện thoại" value={formData.phone} className="w-full h-14 bg-white border border-slate-200 rounded-2xl pl-12 pr-4 text-sm font-bold focus:border-red-500 outline-none" onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                 </div>
               </div>
             </div>
             <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100 flex gap-3 items-center">
               <MapPin size={20} className="text-amber-600 shrink-0" />
               <p className="text-[11px] text-amber-700 font-bold leading-relaxed">Vị trí: Phường Tây Thạnh, TP.HCM. Vui lòng mang CCCD bản chính.</p>
             </div>
             <div className="flex gap-3">
               <button onClick={() => setStep(1)} className="flex-1 h-14 bg-slate-100 text-slate-600 rounded-2xl font-bold text-sm">Quay lại</button>
               <button disabled={isConfirmDisabled} onClick={handleComplete} className="flex-[2] h-14 bg-red-600 text-white rounded-2xl font-bold text-sm shadow-xl shadow-red-600/20 active:scale-95 transition-all flex items-center justify-center disabled:opacity-40">Xác nhận</button>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};
