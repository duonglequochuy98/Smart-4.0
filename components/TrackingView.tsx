
import React from 'react';
import { ArrowLeft, Search, Clock, ExternalLink, ChevronRight, Info, ShieldCheck } from 'lucide-react';

interface TrackingViewProps {
  onBack: () => void;
}

export const TrackingView: React.FC<TrackingViewProps> = ({ onBack }) => {
  const openOfficialKiosk = () => {
    window.open('https://kiosk.hochiminhcity.gov.vn/vi/kiosk/tracuuhoso', '_blank');
  };

  return (
    <div className="flex flex-col h-full bg-[#F8FAFC] animate-in fade-in slide-in-from-right-4 duration-500">
      {/* Header */}
      <div className="p-4 flex items-center gap-2 border-b bg-white sticky top-0 z-10">
        <button onClick={onBack} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 active:bg-slate-200 transition-colors">
          <ArrowLeft size={22} className="text-slate-700" />
        </button>
        <h2 className="text-lg font-black text-slate-800 tracking-tight">Tra cứu hồ sơ</h2>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-6 space-y-6">
        {/* Action Section */}
        <div className="space-y-3">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Kênh tra cứu chính thức</p>
          
          <button 
            onClick={openOfficialKiosk}
            className="w-full p-5 border-2 border-blue-50 bg-white rounded-[24px] flex items-center justify-between group transition-all active:scale-[0.98] hover:border-blue-100 shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                <ExternalLink size={20} />
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-slate-800">Cổng Kiosk TP.HCM</p>
                <p className="text-[10px] text-blue-500 font-bold uppercase tracking-tighter">Hệ thống dùng chung</p>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
              <ChevronRight size={18} strokeWidth={3} />
            </div>
          </button>
        </div>


        {/* Support Card */}
        <div className="bg-slate-900 rounded-[24px] p-6 text-white relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center shadow-lg shadow-red-600/20">
                <ShieldCheck size={20} />
              </div>
              <h4 className="text-sm font-bold">Lưu ý quan trọng</h4>
            </div>
            <div className="space-y-3">
              <div className="flex gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0"></div>
                <p className="text-[11px] text-white/70 leading-relaxed">Bạn cần có <b>Mã hồ sơ</b> in trên phiếu hẹn để tra cứu trạng thái xử lý.</p>
              </div>
              <div className="flex gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0"></div>
                <p className="text-[11px] text-white/70 leading-relaxed">Hãy <b>Đăng nhập</b> để tự động theo dõi danh sách tất cả hồ sơ cá nhân của bạn.</p>
              </div>
            </div>
            <div className="pt-2">
              <div className="flex items-center gap-2 p-3 bg-white/5 rounded-xl border border-white/10">
                <Info size={16} className="text-red-500" />
                <span className="text-[10px] font-bold text-white/80">Bạn cũng có thể hỏi Trợ lý AI để được hỗ trợ.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Empty Space for Bottom Nav */}
        <div className="h-20"></div>
      </div>
    </div>
  );
};
