
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

  // Cập nhật logic: số ngẫu nhiên từ 1-100 ở cuối mã
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

    ctx.strokeStyle = 'rgba(250, 204, 21, 0.03)';
    ctx.lineWidth = 1;
    for(let i=0; i<40; i++) {
        ctx.beginPath();
        ctx.moveTo(0, i * 60);
        ctx.lineTo(1000, i * 60 + 150);
        ctx.stroke();
    }

    ctx.fillStyle = '#facc15';
    ctx.fillRect(0, 0, 1000, 15);

    ctx.fillStyle = '#fef08a';
    ctx.font = '900 28px Plus Jakarta Sans';
    ctx.fillText('TRUNG  TÂM  PHỤC  VỤ  HÀNH  CHÍNH  CÔNG  PHƯỜNG  TÂY  THẠNH', 60, 70);
    
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.beginPath();
    ctx.roundRect(60, 180, 880, 1050, 50);
    ctx.fill();
    ctx.strokeStyle = 'rgba(250, 204, 21, 0.08)';
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.fillStyle = '#facc15';
    ctx.font = '900 60px Plus Jakarta Sans';
    ctx.fillText('PHIẾU ĐẶT LỊCH HẸN', 500, 310);
    ctx.fillStyle = 'rgba(254, 240, 138, 0.35)';
    ctx.font = '800 16px Plus Jakarta Sans';
    ctx.fillText('VUI LÒNG XUẤT TRÌNH PHIẾU NÀY KHI ĐẾN LÀM VIỆC', 500, 355);
    
    ctx.textAlign = 'left';

    const drawSection = (label: string, value: string, y: number, color = '#ffffff', size = 42, isUpper = true) => {
        ctx.fillStyle = 'rgba(254, 240, 138, 0.45)';
        ctx.font = '800 18px Plus Jakarta Sans';
        ctx.fillText(label.toUpperCase(), 110, y);
        
        ctx.fillStyle = color;
        ctx.font = `900 ${size}px Plus Jakarta Sans`;
        ctx.fillText(isUpper ? value.toUpperCase() : value, 110, y + 60);
    };

    drawSection('Họ tên người đăng ký', formData.name || 'Khách hàng', 430, '#ffffff', 42);
    drawSection('Số Căn cước công dân', formData.cccd || '000000000000', 540, '#ffffff', 38);
    drawSection('Mã số định danh lịch hẹn', smartCode, 660, '#fde047', 56);

    ctx.strokeStyle = 'rgba(250, 204, 21, 0.1)';
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(110, 730); ctx.lineTo(890, 730); ctx.stroke();

    ctx.fillStyle = 'rgba(254, 240, 138, 0.45)';
    ctx.font = '800 22px Plus Jakarta Sans';
    ctx.fillText('LĨNH VỰC TIẾP NHẬN', 110, 790);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = '800 32px Plus Jakarta Sans';
    const maxWidth = 480;
    const words = formData.service.split(' ');
    let line = '';
    let currentY = 850;

    for(let n = 0; n < words.length; n++) {
        let testLine = line + words[n] + ' ';
        if (ctx.measureText(testLine).width > maxWidth && n > 0) {
            ctx.fillText(line, 110, currentY);
            line = words[n] + ' ';
            currentY += 45;
        } else {
            line = testLine;
        }
    }
    ctx.fillText(line, 110, currentY);

    ctx.textAlign = 'right';
    ctx.fillStyle = 'rgba(254, 240, 138, 0.45)';
    ctx.font = '800 22px Plus Jakarta Sans';
    ctx.fillText('VỊ TRÍ TIẾP NHẬN', 890, 790);
    ctx.fillStyle = '#facc15';
    ctx.font = '900 40px Plus Jakarta Sans';
    ctx.fillText(`QUẦY SỐ ${getCounterNumber(formData.service)}`, 890, 860);
    ctx.textAlign = 'left';

    const infoY = Math.max(1000, currentY + 100);
    drawSection('Khung giờ đến làm việc', formData.time, infoY, '#ffffff', 44, false);
    
    ctx.textAlign = 'right';
    ctx.fillStyle = 'rgba(254, 240, 138, 0.45)';
    ctx.font = '800 18px Plus Jakarta Sans';
    ctx.fillText('NGÀY HẸN', 890, infoY);
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 44px Plus Jakarta Sans';
    ctx.fillText(formData.dateString.split(',')[1]?.trim() || formData.dateString, 890, infoY + 60);
    ctx.textAlign = 'left';

    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(254, 240, 138, 0.25)';
    ctx.font = '900 14px Plus Jakarta Sans';
    ctx.fillText('BY SMART AI 4.0 - TRUNG TÂM PHỤC VỤ HÀNH CHÍNH CÔNG PHƯỜNG TÂY THẠNH', 500, 1340);

    const link = document.createElement('a');
    link.download = `PhieuHen_TayThanh_${smartCode}.png`;
    link.href = canvas.toDataURL('image/png', 1.0);
    link.click();
  };

  useEffect(() => {
    if (step === 3) {
      const timer = setTimeout(() => {
        downloadTicketAsImage();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [step]);

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
      const counter = getCounterNumber(formData.service);

      onAddNotification({
        id: Date.now(),
        title: `Lịch hẹn thành công: ${formData.service}`,
        summary: `Mã cuộc hẹn ${smartCode} của ông/bà ${formData.name} (CCCD: ${formData.cccd}) đã được xác nhận vào lúc ${formData.time} ngày ${formData.dateString.split(',')[1]}.`,
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
          counter: counter
        }
      });

      setStep(3);
    }, 1000);
  };

  const isConfirmDisabled = !formData.name.trim() || formData.cccd.length !== 12 || !formData.phone.trim() || isProcessing;

  if (step === 3) {
    const counter = getCounterNumber(formData.service);
    return (
      <div className="fixed inset-0 z-[200] flex flex-col bg-[#450a0a] animate-in fade-in duration-500 overflow-hidden">
        <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col items-center p-6 text-center">
          
          <div className="pt-4 space-y-3 shrink-0">
            <div className="w-16 h-16 bg-yellow-400/10 rounded-full flex items-center justify-center text-yellow-400 mx-auto border border-yellow-400/20 shadow-lg shadow-yellow-400/5">
              <CheckCircle2 size={36} />
            </div>
            <div className="space-y-1">
              <h2 className="text-2xl font-black text-yellow-400 tracking-tight">Xác nhận thành công!</h2>
              <p className="text-[10px] text-yellow-100/40 font-bold uppercase tracking-[0.2em]">Phiếu hẹn điện tử đã được lưu trữ</p>
            </div>
          </div>
          
          <div className="w-full max-w-[320px] bg-gradient-to-br from-red-800 to-red-950 text-white rounded-[40px] p-7 space-y-6 relative overflow-hidden shadow-[0_32px_64px_-12px_rgba(0,0,0,0.6)] border border-yellow-400/10 text-left my-8 shrink-0">
            <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
            
            <div className="space-y-6">
               <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <p className="text-[9px] font-black text-yellow-400/40 uppercase tracking-[0.2em]">Người đăng ký</p>
                    <p className="text-xl font-black text-white uppercase truncate max-w-[220px] leading-tight">{formData.name}</p>
                    <p className="text-[11px] font-bold text-yellow-100/60">CCCD: {formData.cccd}</p>
                  </div>
                  <ShieldCheck size={22} className="text-yellow-400 opacity-60 shrink-0" />
               </div>

               <div className="space-y-1">
                 <p className="text-[9px] font-black text-yellow-400/40 uppercase tracking-[0.2em]">Mã số cuộc hẹn</p>
                 <p className="text-3xl font-black text-yellow-400 tracking-[0.02em] leading-tight">{smartCode}</p>
               </div>

               <div className="h-[1px] w-full bg-yellow-400/5"></div>

               <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-1">
                    <p className="text-[9px] font-black text-yellow-400/40 uppercase tracking-[0.2em]">Lĩnh vực</p>
                    <p className="text-[12px] font-bold text-white/90 leading-snug line-clamp-2">{formData.service}</p>
                 </div>
                 <div className="space-y-1 text-right">
                    <p className="text-[9px] font-black text-yellow-400/40 uppercase tracking-[0.2em]">Vị trí</p>
                    <p className="text-lg font-black text-yellow-200 uppercase">Quầy {counter}</p>
                 </div>
               </div>

               <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-1">
                    <p className="text-[9px] font-black text-yellow-400/40 uppercase tracking-[0.2em]">Khung giờ</p>
                    <p className="text-sm font-bold text-white">{formData.time}</p>
                 </div>
                 <div className="space-y-1 text-right">
                    <p className="text-[9px] font-black text-yellow-400/40 uppercase tracking-[0.2em]">Ngày hẹn</p>
                    <p className="text-sm font-bold text-white">{formData.dateString.split(',')[1] || formData.dateString}</p>
                 </div>
               </div>
            </div>

            <div className="pt-6 flex flex-col items-center space-y-3 border-t border-yellow-400/5">
              <p className="text-[5px] font-black text-yellow-400/20 uppercase tracking-[0.4em]">TRUNG TÂM PHỤC VỤ HÀNH CHÍNH CÔNG PHƯỜNG TÂY THẠNH</p>
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
            <button 
              onClick={onBack} 
              className="w-full h-16 bg-yellow-400 text-[#450a0a] rounded-2xl font-black text-sm shadow-2xl shadow-yellow-400/10 active:scale-95 transition-all flex items-center justify-center gap-2 uppercase tracking-widest"
            >
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
                      onClick={() => {
                        setFormData({ ...formData, dateValue: date, dateString: dateStr, time: '' });
                      }}
                      className={`flex flex-col items-center justify-center min-w-[85px] py-4 rounded-2xl border transition-all ${
                        isSelected ? 'bg-red-600 border-red-600 text-white shadow-lg scale-105' : 'bg-white border-slate-100 text-slate-500 hover:border-slate-300'
                      }`}
                    >
                      <span className={`text-[10px] font-bold uppercase mb-1 ${isSelected ? 'text-white/70' : 'text-slate-400'}`}>
                        {date.toLocaleDateString('vi-VN', { weekday: 'short' })}
                      </span>
                      <span className="text-lg font-black">{date.getDate()}</span>
                      <span className={`text-[9px] font-bold ${isSelected ? 'text-white/80' : 'text-slate-400'}`}>
                        Tháng {date.getMonth() + 1}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">2. Chọn lĩnh vực cần làm việc</p>
              <div className="grid grid-cols-1 gap-3">
                {SERVICES.map((s) => (
                  <button 
                    key={s}
                    onClick={() => setFormData({...formData, service: s})}
                    className={`p-4 rounded-2xl border text-left flex items-center justify-between transition-all group ${
                      formData.service === s ? 'bg-red-50 border-red-600 ring-1 ring-red-600' : 'bg-white border-slate-100 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${formData.service === s ? 'bg-red-600 text-white' : 'bg-slate-50 text-slate-400 group-hover:bg-slate-100'}`}>
                        <FileText size={16} />
                      </div>
                      <span className={`text-sm font-bold ${formData.service === s ? 'text-red-700' : 'text-slate-700'}`}>{s}</span>
                    </div>
                    {formData.service === s && <CheckCircle2 size={18} className="text-red-600 animate-in zoom-in" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between px-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">3. Chọn khung giờ</p>
                {isSelectedSaturday && (
                  <span className="text-[9px] font-black text-amber-600 bg-amber-50 px-2 py-1 rounded-full uppercase tracking-tighter border border-amber-100">Chỉ làm buổi sáng</span>
                )}
              </div>
              <div className="grid grid-cols-3 gap-2">
                {filteredTimeSlots.map((t) => (
                  <button 
                    key={t}
                    onClick={() => setFormData({...formData, time: t})}
                    className={`p-3 rounded-xl border text-[11px] font-bold transition-all ${
                      formData.time === t ? 'bg-red-600 text-white border-red-600 shadow-md scale-105' : 'bg-white text-slate-500 border-slate-100 hover:border-slate-300'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <button 
              disabled={!formData.service || !formData.time || isProcessing}
              onClick={handleNextStep}
              className="w-full h-14 bg-red-600 text-white rounded-2xl font-bold text-base shadow-lg shadow-red-600/10 active:scale-95 disabled:opacity-30 transition-all flex items-center justify-center gap-2 mt-4"
            >
              {isProcessing ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Đang kiểm tra...</span>
                </div>
              ) : (
                <>
                  <span>Tiếp tục</span> 
                  <ChevronRight size={18} />
                </>
              )}
            </button>
          </>
        ) : (
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
             <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm space-y-4">
               <div className="flex items-center justify-between pb-4 border-b border-slate-50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center text-red-600">
                      <Calendar size={20} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase">Ngày hẹn</p>
                      <p className="text-sm font-black text-slate-800">{formData.dateString}</p>
                    </div>
                  </div>
                  <button onClick={() => setStep(1)} className="text-red-600 p-2 hover:bg-red-50 rounded-full transition-colors"><Edit3 size={18} /></button>
               </div>
               <div className="flex items-center gap-4">
                 <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center text-red-600">
                   <Clock size={20} />
                 </div>
                 <div>
                   <p className="text-xs font-bold text-slate-400 uppercase">Giờ & Dịch vụ</p>
                   <p className="text-sm font-black text-slate-800">{formData.time} — {formData.service}</p>
                 </div>
               </div>
             </div>

             <div className="space-y-4">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">4. Thông tin cá nhân bắt buộc</p>
               <div className="space-y-3">
                 <div className="relative group">
                   <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-red-500 transition-colors" size={18} />
                   <input 
                     type="text" 
                     placeholder="Họ và tên (như trên CCCD)"
                     value={formData.name}
                     className="w-full h-14 bg-white border border-slate-200 rounded-2xl pl-12 pr-4 text-sm font-bold focus:ring-4 focus:ring-red-500/5 focus:border-red-500 outline-none transition-all"
                     onChange={(e) => setFormData({...formData, name: e.target.value})}
                   />
                 </div>
                 <div className="relative group">
                   <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-red-500 transition-colors" size={18} />
                   <input 
                     type="text" 
                     maxLength={12}
                     placeholder="Số Căn cước công dân (12 số)"
                     value={formData.cccd}
                     className="w-full h-14 bg-white border border-slate-200 rounded-2xl pl-12 pr-4 text-sm font-bold focus:ring-4 focus:ring-red-500/5 focus:border-red-500 outline-none transition-all"
                     onChange={(e) => setFormData({...formData, cccd: e.target.value.replace(/\D/g, '')})}
                   />
                   {formData.cccd.length > 0 && formData.cccd.length < 12 && (
                     <p className="text-[9px] text-red-500 font-bold mt-1 ml-2">Số CCCD phải đủ 12 chữ số</p>
                   )}
                 </div>
                 <div className="relative group">
                   <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-red-500 transition-colors" size={18} />
                   <input 
                     type="tel" 
                     placeholder="Số điện thoại liên hệ"
                     value={formData.phone}
                     className="w-full h-14 bg-white border border-slate-200 rounded-2xl pl-12 pr-4 text-sm font-bold focus:ring-4 focus:ring-red-500/5 focus:border-red-500 outline-none transition-all"
                     onChange={(e) => setFormData({...formData, phone: e.target.value})}
                   />
                 </div>
                 <div className="relative group">
                   <Info className="absolute left-4 top-4 text-slate-400 group-focus-within:text-red-500 transition-colors" size={18} />
                   <textarea 
                     placeholder="Ghi chú thêm (không bắt buộc)"
                     value={formData.note}
                     className="w-full h-24 bg-white border border-slate-200 rounded-2xl pl-12 pr-4 pt-4 text-sm font-medium focus:ring-4 focus:ring-red-500/5 focus:border-red-500 outline-none transition-all resize-none"
                     onChange={(e) => setFormData({...formData, note: e.target.value})}
                   />
                 </div>
               </div>
             </div>

             <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100 flex gap-3 items-center">
               <MapPin size={20} className="text-amber-600 shrink-0" />
               <p className="text-[11px] text-amber-700 font-bold leading-relaxed">
                 Vị trí: Quầy số {getCounterNumber(formData.service)}. Vui lòng mang CCCD bản chính để đối soát.
               </p>
             </div>

             <div className="flex gap-3">
               <button disabled={isProcessing} onClick={() => setStep(1)} className="flex-1 h-14 bg-slate-100 text-slate-600 rounded-2xl font-bold text-sm active:scale-95 transition-all">
                 Quay lại
               </button>
               <button 
                 disabled={isConfirmDisabled}
                 onClick={handleComplete} 
                 className="flex-[2] h-14 bg-red-600 text-white rounded-2xl font-bold text-sm shadow-xl shadow-red-600/20 active:scale-95 transition-all flex items-center justify-center disabled:opacity-40"
                >
                  {isProcessing ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Đang xử lý...</span>
                    </div>
                  ) : 'Xác nhận đặt lịch'}
                </button>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};
