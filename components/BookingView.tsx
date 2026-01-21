
import { ArrowLeft, Calendar, Clock, ChevronRight, CheckCircle2, User, Phone, FileText, Download, ShieldCheck, MapPin, Edit3, Barcode, Info, Home, Sparkles, CreditCard, AlertCircle } from 'lucide-react';
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

  // Cập nhật thời gian thực mỗi phút
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);
  
  const availableDates = useMemo(() => {
    const dates = [];
    let count = 0;
    let dayOffset = 0; // Bắt đầu từ hôm nay
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
  const isSelectedToday = formData.dateValue.toDateString() === currentTime.toDateString();

  const filteredTimeSlots = useMemo(() => {
    let slots = [...ALL_TIME_SLOTS];
    if (isSelectedSaturday) {
      slots = slots.filter(slot => {
        const hour = parseInt(slot.split(':')[0]);
        return hour < 12;
      });
    }
    if (isSelectedToday) {
      const currentHour = currentTime.getHours();
      const currentMin = currentTime.getMinutes();
      slots = slots.filter(slot => {
        const [startTime] = slot.split(' - ');
        const [h, m] = startTime.split(':').map(Number);
        if (h > currentHour) return true;
        if (h === currentHour && m > currentMin) return true;
        return false;
      });
    }
    return slots;
  }, [isSelectedSaturday, isSelectedToday, currentTime]);

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

    canvas.width = 1200;
    canvas.height = 1650;

    const bgGrad = ctx.createLinearGradient(0, 0, 0, 1650);
    bgGrad.addColorStop(0, '#7f1d1d'); 
    bgGrad.addColorStop(1, '#450a0a'); 
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1200, 1650);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.035)';
    ctx.lineWidth = 1;
    for (let i = -1600; i < 1200; i += 45) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i + 1650, 1650);
      ctx.stroke();
    }

    ctx.textAlign = 'center';
    ctx.fillStyle = '#facc15';
    ctx.font = '900 34px "Plus Jakarta Sans"';
    ctx.fillText('TRUNG TÂM PHỤC VỤ HÀNH CHÍNH CÔNG PHƯỜNG TÂY THẠNH', 600, 85);

    ctx.fillStyle = 'rgba(0, 0, 0, 0.22)';
    ctx.beginPath();
    ctx.roundRect(85, 185, 1030, 1330, 75);
    ctx.fill();
    ctx.strokeStyle = 'rgba(250, 204, 21, 0.12)';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#facc15';
    ctx.font = '900 96px "Plus Jakarta Sans"';
    ctx.fillText('PHIẾU ĐẶT LỊCH HẸN', 600, 360);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
    ctx.font = '700 24px "Plus Jakarta Sans"';
    ctx.fillText('VUI LÒNG XUẤT TRÌNH PHIẾU NÀY KHI ĐẾN LÀM VIỆC', 600, 430);

    const drawLabel = (text: string, x: number, y: number, align: CanvasTextAlign = 'left') => {
      ctx.textAlign = align;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.font = '800 22px "Plus Jakarta Sans"';
      ctx.fillText(text.toUpperCase(), x, y);
    };

    drawLabel('Họ tên người đăng ký', 150, 560);
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 72px "Plus Jakarta Sans"';
    ctx.fillText(formData.name.toUpperCase(), 150, 645);

    drawLabel('Số căn cước công dân', 150, 750);
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 58px "Plus Jakarta Sans"';
    ctx.fillText(formData.cccd, 150, 825);

    drawLabel('Mã số định danh lịch hẹn', 150, 930);
    ctx.fillStyle = '#facc15';
    ctx.font = '900 80px "Plus Jakarta Sans"';
    ctx.fillText(smartCode, 150, 1030);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.beginPath();
    ctx.moveTo(150, 1100);
    ctx.lineTo(1050, 1100);
    ctx.stroke();

    drawLabel('Lĩnh vực tiếp nhận', 150, 1170);
    ctx.fillStyle = '#ffffff';
    let fontSize = 38;
    ctx.font = `800 ${fontSize}px "Plus Jakarta Sans"`;
    const sName = formData.service;
    const maxWidth = 1100;
    while (ctx.measureText(sName).width > maxWidth && fontSize > 20) {
      fontSize--;
      ctx.font = `800 ${fontSize}px "Plus Jakarta Sans"`;
    }
    ctx.fillText(sName, 150, 1235);

    drawLabel('Vị trí tiếp nhận', 1050, 1170, 'right');
    ctx.fillStyle = '#facc15';
    ctx.font = '900 38px "Plus Jakarta Sans"';
    ctx.fillText(`QUẦY SỐ ${getCounterNumber(formData.service)}`, 1050, 1235);

    drawLabel('Khung giờ đến làm việc', 150, 1380);
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 60px "Plus Jakarta Sans"';
    ctx.fillText(formData.time, 150, 1475);

    drawLabel('Ngày hẹn', 1050, 1380, 'right');
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 60px "Plus Jakarta Sans"';
    const cleanDate = formData.dateString.includes(',') ? formData.dateString.split(',')[1].trim() : formData.dateString;
    ctx.fillText(cleanDate, 1050, 1475);

    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.font = '700 16px "Plus Jakarta Sans"';
    ctx.fillText('HỆ THỐNG SMART 4.0 – TRUNG TÂM PHỤC VỤ HÀNH CHÍNH CÔNG PHƯỜNG TÂY THẠNH', 600, 1585);

    const link = document.createElement('a');
    link.download = `PhieuHen_TayThanh_${smartCode}.png`;
    link.href = canvas.toDataURL('image/png', 1.0);
    link.click();
  };

  useEffect(() => {
    if (step === 3) {
      const timer = setTimeout(() => {
        downloadTicketAsImage();
      }, 500);
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
      onAddNotification({
        id: Date.now(),
        title: `Lịch hẹn thành công: ${formData.service}`,
        summary: `Mã cuộc hẹn ${smartCode} của ông/bà ${formData.name} đã được xác nhận vào lúc ${formData.time} ngày ${formData.dateString.split(',')[1] || formData.dateString}.`,
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

  // Logic kiểm tra nút Xác nhận có bị vô hiệu hóa không
  const isCccdValid = formData.cccd.length === 12;
  const isConfirmDisabled = 
    !formData.name.trim() || 
    !isCccdValid || 
    !formData.phone.trim() || 
    isProcessing;

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
              <p className="text-[9px] text-yellow-100/40 font-bold uppercase tracking-[0.2em]">Hệ thống đã tự động tải phiếu hẹn về máy</p>
            </div>
          </div>
          
          <div className="w-full max-w-[340px] bg-gradient-to-br from-red-800 to-red-950 text-white rounded-[40px] p-7 space-y-5 relative overflow-hidden shadow-[0_32px_64px_-12px_rgba(0,0,0,0.6)] border border-yellow-400/10 text-left my-8 shrink-0">
            <div className="space-y-5">
               <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <p className="text-[9px] font-black text-yellow-400/40 uppercase tracking-[0.2em]">Người đăng ký</p>
                    <p className="text-xl font-black text-white uppercase truncate max-w-[200px] leading-tight">{formData.name}</p>
                    <p className="text-[11px] font-bold text-white/60 tracking-wider">CCCD: {formData.cccd}</p>
                  </div>
                  <ShieldCheck size={28} className="text-yellow-400 opacity-60 shrink-0" />
               </div>
               
               <div className="space-y-1">
                 <p className="text-[9px] font-black text-yellow-400/40 uppercase tracking-[0.2em]">Lĩnh vực/Thủ tục</p>
                 <p className="text-[12px] font-bold text-yellow-200 leading-snug">{formData.service}</p>
               </div>

               <div className="space-y-1">
                 <p className="text-[9px] font-black text-yellow-400/40 uppercase tracking-[0.2em]">Mã số cuộc hẹn</p>
                 <p className="text-3xl font-black text-yellow-400 tracking-[0.02em] leading-tight">{smartCode}</p>
               </div>

               <div className="h-[1px] w-full bg-yellow-400/5"></div>
               <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-1">
                    <p className="text-[9px] font-black text-yellow-400/40 uppercase tracking-[0.2em]">Vị trí</p>
                    <p className="text-lg font-black text-yellow-200 uppercase">Quầy số {getCounterNumber(formData.service)}</p>
                 </div>
                 <div className="space-y-1 text-right">
                    <p className="text-[9px] font-black text-yellow-400/40 uppercase tracking-[0.2em]">Thời gian</p>
                    <p className="text-sm font-bold text-white leading-tight">
                      {formData.time}<br/>
                      <span className="text-[10px] opacity-60 font-medium">{formData.dateString.split(',')[1] || formData.dateString}</span>
                    </p>
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
            <button onClick={onBack} className="w-full h-16 bg-yellow-400 text-[#450a0a] rounded-2xl font-black text-sm active:scale-95 transition-all flex items-center justify-center gap-2 uppercase tracking-widest shadow-xl shadow-black/10">
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
              <div className="flex justify-between items-end px-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">1. Chọn ngày làm việc</p>
                {isSelectedToday && <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full uppercase">Hôm nay</span>}
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                {availableDates.map((date, idx) => {
                  const dateStr = date.toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' });
                  const isSelected = formData.dateString === dateStr;
                  const isToday = date.toDateString() === currentTime.toDateString();
                  return (
                    <button
                      key={idx}
                      onClick={() => setFormData({ ...formData, dateValue: date, dateString: dateStr, time: '' })}
                      className={`flex flex-col items-center justify-center min-w-[85px] py-4 rounded-2xl border transition-all ${
                        isSelected ? 'bg-red-600 border-red-600 text-white shadow-lg scale-105' : 'bg-white border-slate-100 text-slate-500 hover:border-slate-300'
                      }`}
                    >
                      <span className={`text-[10px] font-bold uppercase mb-1 ${isSelected ? 'text-white/70' : isToday ? 'text-emerald-500' : 'text-slate-400'}`}>
                        {isToday ? 'H.Nay' : date.toLocaleDateString('vi-VN', { weekday: 'short' })}
                      </span>
                      <span className="text-lg font-black">{date.getDate()}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">2. Chọn lĩnh vực</p>
              <div className="grid grid-cols-1 gap-2.5">
                {SERVICES.map((s) => (
                  <button 
                    key={s}
                    onClick={() => setFormData({...formData, service: s})}
                    className={`p-4 rounded-xl border text-left flex items-center justify-between transition-all duration-200 group ${
                      formData.service === s 
                        ? 'bg-red-50 border-red-600 ring-[0.5px] ring-red-600 shadow-sm' 
                        : 'bg-white border-slate-100 hover:border-slate-200'
                    }`}
                  >
                    <span className={`text-[13px] font-bold ${formData.service === s ? 'text-red-700' : 'text-slate-700'}`}>{s}</span>
                    {formData.service === s && <CheckCircle2 size={16} className="text-red-600 animate-in zoom-in" />}
                  </button>
                ))}
              </div>
            </div>

            {formData.service && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="flex justify-between items-center px-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">3. Chọn khung giờ</p>
                </div>
                {filteredTimeSlots.length > 0 ? (
                  <div className="grid grid-cols-3 gap-2">
                    {filteredTimeSlots.map((slot) => (
                      <button
                        key={slot}
                        onClick={() => setFormData({ ...formData, time: slot })}
                        className={`py-3 rounded-xl border text-[11px] font-black transition-all ${
                          formData.time === slot
                            ? 'bg-red-600 border-red-600 text-white shadow-md'
                            : 'bg-white border-slate-100 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-center">
                    <Clock size={24} className="mx-auto text-slate-300 mb-2" />
                    <p className="text-[11px] font-bold text-slate-500">Đã hết khung giờ làm việc hôm nay.<br/>Vui lòng chọn ngày khác.</p>
                  </div>
                )}
              </div>
            )}

            <button 
              disabled={!formData.service || !formData.time || isProcessing}
              onClick={handleNextStep}
              className="w-full h-14 bg-red-600 text-white rounded-2xl font-bold text-base shadow-lg shadow-red-600/10 active:scale-95 disabled:opacity-30 transition-all flex items-center justify-center gap-2 mt-6 mb-10"
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
                 <div>
                   <p className="text-xs font-bold text-slate-400 uppercase">Lĩnh vực & Giờ</p>
                   <p className="text-sm font-black text-slate-800">{formData.time} — {formData.service}</p>
                 </div>
               </div>
             </div>
             <div className="space-y-4">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">4. Thông tin cá nhân</p>
               <div className="space-y-3">
                 <div className="relative group">
                   <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                   <input 
                    type="text" 
                    placeholder="Họ và tên" 
                    value={formData.name} 
                    className="w-full h-14 bg-white border border-slate-200 rounded-2xl pl-12 pr-4 text-sm font-bold focus:border-red-500 outline-none" 
                    onChange={(e) => setFormData({...formData, name: e.target.value})} 
                  />
                 </div>
                 <div className="relative group">
                   <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                   <div className="relative">
                    <input 
                      type="text" 
                      maxLength={12} 
                      placeholder="Số CCCD (Bắt buộc 12 số)" 
                      value={formData.cccd} 
                      className={`w-full h-14 bg-white border rounded-2xl pl-12 pr-4 text-sm font-bold outline-none transition-all ${
                        formData.cccd.length > 0 && !isCccdValid 
                        ? 'border-amber-400 ring-4 ring-amber-400/10' 
                        : 'border-slate-200 focus:border-red-500'
                      }`} 
                      onChange={(e) => setFormData({...formData, cccd: e.target.value.replace(/\D/g, '')})} 
                    />
                    {formData.cccd.length > 0 && !isCccdValid && (
                      <div className="absolute -bottom-6 left-1 flex items-center gap-1">
                        <AlertCircle size={10} className="text-amber-600" />
                        <span className="text-[9px] font-black text-amber-600 uppercase">Cần nhập đủ 12 số ({formData.cccd.length}/12)</span>
                      </div>
                    )}
                   </div>
                 </div>
                 <div className="relative group pt-3">
                   <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                   <input 
                    type="tel" 
                    placeholder="Số điện thoại" 
                    value={formData.phone} 
                    className="w-full h-14 bg-white border border-slate-200 rounded-2xl pl-12 pr-4 text-sm font-bold focus:border-red-500 outline-none" 
                    onChange={(e) => setFormData({...formData, phone: e.target.value})} 
                  />
                 </div>
               </div>
             </div>
             <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100 flex gap-3 items-center">
               <MapPin size={20} className="text-amber-600 shrink-0" />
               <p className="text-[11px] text-amber-700 font-bold leading-relaxed">Địa chỉ: 200/12 Nguyễn Hữu Tiến, Phường Tây Thạnh, TP.HCM. Vui lòng mang theo CCCD bản chính khi đến làm việc.</p>
             </div>
             <div className="flex gap-3 pb-10">
               <button onClick={() => setStep(1)} className="flex-1 h-14 bg-slate-100 text-slate-600 rounded-2xl font-bold text-sm">Quay lại</button>
               <button 
                disabled={isConfirmDisabled} 
                onClick={handleComplete} 
                className={`flex-[2] h-14 rounded-2xl font-bold text-sm shadow-xl transition-all flex items-center justify-center ${
                  isConfirmDisabled 
                  ? 'bg-slate-200 text-slate-400 shadow-none cursor-not-allowed' 
                  : 'bg-red-600 text-white shadow-red-600/20 active:scale-95'
                }`}
               >
                Xác nhận
               </button>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};
