
import React from 'react';
import { ArrowLeft, FileText, ChevronRight, Info, ShieldCheck, ExternalLink, Zap } from 'lucide-react';

interface SubmissionViewProps {
  onBack: () => void;
}

const PROCEDURES = [
  { 
    id: 1, 
    name: 'Đăng ký khai sinh', 
    category: 'Hộ tịch', 
    time: 'Trong ngày', 
    fee: 'Miễn phí', 
    hot: true,
    url: 'https://dichvucong.gov.vn/p/home/dvc-chi-tiet-thu-tuc-hanh-chinh.html?ma_thu_tuc=1.001193'
  },
  { 
    id: 2, 
    name: 'Đăng ký Kết hôn', 
    category: 'Hộ tịch', 
    time: 'Trong ngày', 
    fee: 'Miễn phí', 
    hot: false,
    url: 'https://dichvucong.gov.vn/p/home/dvc-chi-tiet-thu-tuc-dung-chung.html?ma_thu_tuc=1.000894'
  },
  { id: 3, name: 'Chứng thực bản sao từ bản chính các giấy tờ, văn bản', category: 'Chứng thực', time: '1 giờ', fee: '2.000đ/trang', hot: true, url: 'https://dichvucong.gov.vn/p/home/dvc-danh-sach-dich-vu-cong.html?tu_khoa=&bo_nganh=&tinh_thanh=Th%C3%A0nh%20ph%E1%BB%91%20H%E1%BB%93%20Ch%C3%AD%20Minh&so=&quan_huyen=Ph%C6%B0%E1%BB%9Dng%20T%C3%A2y%20Th%E1%BA%A1nh&phuong_xa=&ma_tt=2.000815&id_tinh_thanh=13460&id_quan_huyen=22024&id_phuong_xa=undefined&id_so=null&id_bo_nganh=-1' },
{ 
    id: 4, 
    name: 'Đăng ký Hộ kinh doanh, doanh nghiệp', 
    category: 'Kinh tế', 
    time: '03 ngày', 
    fee: 'Miễn phí', 
    hot: false,
    url: 'https://dichvucong.gov.vn/p/home/dvc-chi-tiet-thu-tuc-hanh-chinh.html?ma_thu_tuc=1.001612'
  },
];

export const SubmissionView: React.FC<SubmissionViewProps> = ({ onBack }) => {
  const handleProcedureClick = (url?: string) => {
    if (url) {
      window.open(url, '_blank');
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#F8FAFC] animate-in fade-in slide-in-from-right-4 duration-500 pb-20">
      {/* Header */}
      <div className="p-4 flex items-center gap-3 border-b bg-white sticky top-0 z-10">
        <button 
          onClick={onBack} 
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 active:scale-90 transition-all"
        >
          <ArrowLeft size={22} className="text-slate-700" />
        </button>
        <h2 className="text-lg font-black text-slate-800 tracking-tight">Nộp hồ sơ trực tuyến</h2>
      </div>

      <div className="p-5 space-y-6 flex-1 overflow-y-auto">
        {/* Notice Card */}
        <div className="bg-gradient-to-br from-red-50 to-orange-50 p-4 rounded-2xl border border-red-100/50 flex gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-red-600 shrink-0 shadow-sm">
            <Info size={24} />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-black text-red-900">Chuẩn bị trước khi nộp</h4>
            <p className="text-[11px] text-red-700/80 leading-relaxed font-medium">
              Vui lòng chuẩn bị bản scan PDF hoặc ảnh chụp rõ nét của các giấy tờ liên quan để quá trình nộp diễn ra thuận lợi.
            </p>
          </div>
        </div>

        {/* Procedures List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <p className="text-[10px] font-black text-slate-400 tracking-[0.15em] uppercase">Thủ tục phổ biến nhất</p>
          </div>

          <div className="space-y-3">
            {PROCEDURES.map((p) => (
              <button 
                key={p.id}
                onClick={() => handleProcedureClick(p.url)}
                className="w-full p-4 bg-white border border-slate-100 rounded-[24px] flex items-start gap-4 hover:border-red-200 transition-all text-left group shadow-sm hover:shadow-md active:scale-[0.98] relative overflow-hidden"
              >
                {p.hot && (
                  <div className="absolute top-0 right-0">
                    <div className="bg-red-600 text-white text-[8px] font-black px-3 py-1 rounded-bl-xl uppercase tracking-tighter flex items-center gap-1">
                      <Zap size={8} fill="currentColor" />
                      Ưu tiên
                    </div>
                  </div>
                )}
                
                <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-red-50 group-hover:text-red-600 transition-all shrink-0">
                  <FileText size={24} />
                </div>

                <div className="flex-1 min-w-0 pr-2">
                  <h4 className="text-[15px] font-bold text-slate-800 group-hover:text-red-600 leading-[1.4] transition-colors mb-2 whitespace-normal break-words">
                    {p.name}
                  </h4>
                  <div className="flex flex-wrap gap-2 items-center">
                    <span className="text-[9px] font-black text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full uppercase tracking-wider">
                      {p.category}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
                      <span className="text-[11px] text-emerald-600 font-bold">{p.fee}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
                      <span className="text-[11px] text-slate-400 font-medium">{p.time}</span>
                    </div>
                  </div>
                </div>

                <div className="self-center">
                  <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-red-600 group-hover:text-white transition-all shadow-sm">
                    <ChevronRight size={18} strokeWidth={3} />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Button */}
      <div className="p-5 bg-white border-t">
        <button 
          onClick={() => handleProcedureClick('https://thutuc.dichvucong.gov.vn/p/home/dvc-tthc-trang-chu.html')}
          className="w-full h-12 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-[13px] font-black flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
        >
          Tất cả danh mục thủ tục
          <ExternalLink size={16} />
        </button>
      </div>
    </div>
  );
};
