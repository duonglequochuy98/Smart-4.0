import React, { useState, useRef, useEffect } from 'react';
import { AppState } from './types';
import { FeatureCard } from './components/FeatureCard';
import { TrackingView } from './components/TrackingView';
import { SubmissionView } from './components/SubmissionView';
import { AIAssistant } from './components/AIAssistant';
import { ReportView } from './components/ReportView';
import { NotificationView } from './components/NotificationView';
import { LoginView } from './components/LoginView';
import { 
  Building2, 
  ArrowRight, 
  MessageCircle, 
  Search, 
  FileUp,
  Bot,
  ArrowLeft,
  Home,
  BarChart3,
  Bell,
  UserCircle,
  ChevronRight,
  Users,
  CheckCircle,
  Zap,
  CalendarDays,
  Sparkles,
  ShieldCheck,
  Trophy
} from 'lucide-react';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<AppState>(AppState.WELCOME);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [todayDate, setTodayDate] = useState(() => {
    const now = new Date();
    const d = String(now.getDate()).padStart(2, '0');
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const y = now.getFullYear();
    return `${d}/${m}/${y}`;
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const formatted = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;
      if (formatted !== todayDate) setTodayDate(formatted);
    }, 60000);
    return () => clearInterval(timer);
  }, [todayDate]);
  
  const [fabPosition, setFabPosition] = useState({ x: 310, y: 580 });
  const [isDragging, setIsDragging] = useState(false);
  const fabDragStartPos = useRef({ x: 0, y: 0 });
  const fabRef = useRef<HTMLButtonElement>(null);
  const fabHasMoved = useRef(false);

  const ZALO_LINK = "https://zalo.me/1358120320651896785";

  // Cập nhật vị trí FAB dựa trên kích thước container thực tế
  const updateFabPos = () => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setFabPosition({ 
        x: rect.width - 75, 
        y: rect.height - 165 
      });
    }
  };

  useEffect(() => {
    updateFabPos();
    window.addEventListener('resize', updateFabPos);
    return () => window.removeEventListener('resize', updateFabPos);
  }, []);

  const handleOpenZalo = () => {
    window.open(ZALO_LINK, '_blank');
  };

  const onFabPointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    fabHasMoved.current = false;
    fabDragStartPos.current = { x: e.clientX - fabPosition.x, y: e.clientY - fabPosition.y };
    if (fabRef.current) fabRef.current.setPointerCapture(e.pointerId);
    e.stopPropagation();
  };

  const onFabPointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    
    const newX = e.clientX - fabDragStartPos.current.x;
    const newY = e.clientY - fabDragStartPos.current.y;
    
    // Giới hạn FAB trong khung nhìn của container
    const constrainedX = Math.max(10, Math.min(rect.width - 65, newX));
    const constrainedY = Math.max(10, Math.min(rect.height - 105, newY));
    
    if (Math.abs(constrainedX - fabPosition.x) > 5 || Math.abs(constrainedY - fabPosition.y) > 5) {
      fabHasMoved.current = true;
    }
    setFabPosition({ x: constrainedX, y: constrainedY });
  };

  const onFabPointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    if (fabRef.current) fabRef.current.releasePointerCapture(e.pointerId);
    if (!fabHasMoved.current) {
      setCurrentScreen(AppState.CHAT);
    }
  };

  const renderBottomNav = () => {
    if ([AppState.WELCOME, AppState.CHAT].includes(currentScreen)) return null;
    return (
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-white/95 backdrop-blur-xl border-t border-slate-100 px-6 sm:px-12 flex items-center justify-between z-40 shadow-[0_-4px_25px_rgba(0,0,0,0.04)]">
        <button onClick={() => setCurrentScreen(AppState.LANDING)} className={`flex flex-col items-center gap-1.5 transition-all ${currentScreen === AppState.LANDING ? 'text-red-600 scale-110' : 'text-slate-400 hover:text-slate-600'}`}>
          <Home size={22} className={currentScreen === AppState.LANDING ? 'fill-red-50' : ''} />
          <span className="text-[10px] font-bold uppercase tracking-wider">Trang chủ</span>
        </button>
        <button onClick={() => setCurrentScreen(AppState.REPORT)} className={`flex flex-col items-center gap-1.5 transition-all ${currentScreen === AppState.REPORT ? 'text-red-600 scale-110' : 'text-slate-400 hover:text-slate-600'}`}>
          <BarChart3 size={22} className={currentScreen === AppState.REPORT ? 'fill-red-50' : ''} />
          <span className="text-[10px] font-bold uppercase tracking-wider">Chỉ số</span>
        </button>
        <button onClick={() => setCurrentScreen(AppState.NOTIFICATIONS)} className={`flex flex-col items-center gap-1.5 transition-all ${currentScreen === AppState.NOTIFICATIONS ? 'text-red-600 scale-110' : 'text-slate-400 hover:text-slate-600'}`}>
          <Bell size={22} className={currentScreen === AppState.NOTIFICATIONS ? 'fill-red-50' : ''} />
          <span className="text-[10px] font-bold uppercase tracking-wider">Thông báo</span>
        </button>
      </div>
    );
  };

  const renderWelcome = () => (
    <div className="flex flex-col h-full bg-white overflow-hidden animate-in fade-in duration-500">
      <div className="relative h-[42%] shrink-0 overflow-hidden">
        <img src="https://iwater.vn/Image/Picture/New/UBND-phuong-tay-thanh-tan-phu.jpg" alt="UBND Phường Tây Thạnh" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/10 to-transparent"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-4 w-full px-6">
           <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white rounded-[28px] sm:rounded-[32px] shadow-2xl flex items-center justify-center border-4 border-red-50 animate-bounce [animation-duration:3s]">
             <Building2 size={40} className="text-red-600 sm:size-48" />
           </div>
        </div>
      </div>
      <div className="flex-1 px-8 sm:px-12 flex flex-col items-center text-center -mt-10 relative z-10 justify-center">
        <div className="space-y-4 mb-8 sm:mb-10">
          <div className="flex items-center justify-center gap-3 mb-1">
            <span className="h-[1px] w-8 bg-slate-200"></span>
            <span className="text-[10px] font-black text-red-600 uppercase tracking-[0.4em]">Xin chào</span>
            <span className="h-[1px] w-8 bg-slate-200"></span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight tracking-tight">
            Chào mừng đến với<br />
            <span className="text-red-600 text-2xl sm:text-3xl block mt-2 leading-tight">
             Trung tâm Phục vụ Hành chính công <span className="whitespace-nowrap">Tây Thạnh</span> Smart 4.0
            </span>
          </h1>
          <p className="text-[13px] sm:text-[14px] text-slate-500 font-medium leading-relaxed max-w-[300px] mx-auto opacity-80">
            Hệ thống thông minh, minh bạch và hiệu quả vì sự hài lòng của Nhân dân.
          </p>
        </div>
        <div className="w-full space-y-3.5 mb-8 max-w-sm">
          <button onClick={() => setCurrentScreen(AppState.LANDING)} className="w-full h-14 sm:h-16 bg-red-600 text-white rounded-2xl font-bold text-base shadow-2xl shadow-red-600/20 flex items-center justify-center gap-3 active:scale-[0.97] transition-all group">
            <span>Bắt đầu trải nghiệm</span>
            <ArrowRight size={20} className="group-hover:translate-x-1.5 transition-transform" />
          </button>
          <button onClick={() => setCurrentScreen(AppState.CHAT)} className="w-full h-14 sm:h-16 bg-slate-50 text-slate-700 border border-slate-200/60 rounded-2xl font-bold text-[13px] sm:text-[14px] flex items-center justify-center gap-3 active:scale-[0.97] transition-all">
            <Bot size={20} className="text-red-600" />
            <span>Hỏi Trợ lý ảo AI ngay</span>
          </button>
        </div>
        <div className="grid grid-cols-3 gap-6 w-full pt-4 opacity-40 max-w-xs">
          <div className="flex flex-col items-center gap-1.5"><ShieldCheck size={18} className="text-slate-600" /><span className="text-[9px] font-bold uppercase tracking-tighter">Bảo mật</span></div>
          <div className="flex flex-col items-center gap-1.5"><Zap size={18} className="text-slate-600" /><span className="text-[9px] font-bold uppercase tracking-tighter">Tốc độ</span></div>
          <div className="flex flex-col items-center gap-1.5"><Sparkles size={18} className="text-slate-600" /><span className="text-[9px] font-bold uppercase tracking-tighter">Tiện ích</span></div>
        </div>
      </div>
      <div className="pb-6 text-center shrink-0 opacity-30"><p className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em]">Phiên bản 4.0.2 - 2026</p></div>
    </div>
  );

  const renderLanding = () => (
  <div className="h-full bg-gradient-to-br from-slate-50 to-blue-50 relative flex flex-col overflow-y-auto">
    <div className="flex-1 pb-24">
      {/* Header Section */}
      <div className="flex flex-col items-center justify-center gap-4 p-6 pt-12">
        {/* Logo/Icon (optional) */}
        <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-lg">
          <span className="text-white text-2xl font-bold">TT</span>
        </div>
                {/* Title */}
        <div className="text-center space-y-2">
          <h1 className="text-slate-700 text-base sm:text-lg font-medium">
            Trung tâm Phục vụ Hành chính công
          </h1>
          <h2 className="text-red-600 font-bold text-2xl sm:text-3xl tracking-wide">
           Phường Tây Thạnh
          </h2>
        </div>
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-5 py-2 bg-white rounded-full shadow-sm border border-slate-200">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          <p className="text-slate-600 text-xs font-semibold uppercase tracking-wider">
            Ứng dụng công nghệ 4.0
          </p>
        </div>
      </div>
      
      {/* Content can continue here */}
    </div>
  </div>
);
        
        <div className="w-full grid grid-cols-4 gap-3 sm:gap-5 mb-10 px-2 sm:px-6">
          <FeatureCard onClick={() => setCurrentScreen(AppState.CHAT)} icon={<Bot />} label="Trợ lý AI" color="bg-red-50 text-red-600" />
          <FeatureCard onClick={() => setCurrentScreen(AppState.TRACKING)} icon={<Search />} label="Tra cứu" color="bg-emerald-50 text-emerald-600" />
          <FeatureCard onClick={() => setCurrentScreen(AppState.SUBMIT)} icon={<FileUp />} label="Nộp hồ sơ" color="bg-orange-50 text-orange-600" />
          <FeatureCard onClick={handleOpenZalo} icon={<MessageCircle />} label="Zalo OA" color="bg-blue-50 text-blue-600" />
        </div>

        <div className="px-6 mb-10 sm:px-10">
          <div className="bg-slate-900 rounded-[32px] p-7 text-white relative overflow-hidden shadow-2xl border border-white/5">
            <div className="absolute top-0 right-0 w-48 h-48 bg-red-600/10 rounded-full -mr-24 -mt-24 blur-3xl"></div>
            <div className="flex items-center justify-between mb-8 relative z-10">
              <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Chỉ số phục vụ </h3>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-full border border-white/10">
                <CalendarDays size={12} className="text-white/60" />
                <span className="text-[10px] font-black">{todayDate}</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 relative z-10">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-emerald-400"><CheckCircle size={14} /><span className="text-[10px] font-black uppercase">Xử lý</span></div>
                <div className="flex items-baseline gap-1"><span className="text-xl font-black">9.683</span></div>
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-yellow-400"><Users size={14} /><span className="text-[10px] font-black uppercase">Hài lòng</span></div>
                <div className="flex items-baseline gap-1"><span className="text-xl font-black">99.2</span><span className="text-[10px] font-bold text-white/30">%</span></div>
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-amber-500"><Trophy size={14} /><span className="text-[10px] font-black uppercase">Hạng cao nhất </span></div>
                <div className="flex items-baseline gap-1"><span className="text-xl font-black text-amber-400">02</span><span className="text-[10px] font-bold text-white/30">/168</span></div>
              </div>
            </div>
            <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between relative z-10">
               <div className="flex items-center gap-2.5">
                 <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center shadow-lg shadow-red-600/30"><Zap size={14} fill="white" /></div>
                 <span className="text-[11px] font-bold text-white/80">Dẫn đầu chỉ số phục vụ</span>
               </div>
               <button onClick={() => setCurrentScreen(AppState.REPORT)} className="text-[10px] font-black uppercase text-red-500 hover:text-red-400 transition-colors flex items-center gap-1">Chi tiết <ChevronRight size={12} /></button>
            </div>
          </div>
        </div>
        
        <div className="px-6 mb-8 sm:px-10">
          <button onClick={handleOpenZalo} className="w-full p-6 bg-[#0068FF] text-white rounded-[28px] flex items-center justify-between group shadow-xl shadow-blue-500/20 active:scale-[0.98] transition-all border border-blue-400/20">
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-inner"><MessageCircle size={22} className="text-[#0068FF] fill-current" /></div>
              <div className="text-left"><h4 className="text-[15px] font-bold">Cần hỗ trợ trực tiếp?</h4><p className="text-[11px] text-white/70 font-medium mt-0.5">Chúng tôi trả lời ngay lập tức</p></div>
            </div>
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:translate-x-1.5 transition-transform"><ArrowRight size={20} /></div>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-slate-100 flex items-center justify-center p-0 sm:p-4 overflow-hidden">
      <div 
        ref={containerRef}
        className="app-container flex flex-col no-scrollbar overflow-hidden"
      >
        <div className="flex-1 overflow-hidden relative no-scrollbar">
          {currentScreen === AppState.WELCOME && renderWelcome()}
          {currentScreen === AppState.LANDING && renderLanding()}
          {currentScreen === AppState.TRACKING && <TrackingView onBack={() => setCurrentScreen(AppState.LANDING)} />}
          {currentScreen === AppState.SUBMIT && <SubmissionView onBack={() => setCurrentScreen(AppState.LANDING)} />}
          {currentScreen === AppState.REPORT && <ReportView onBack={() => setCurrentScreen(AppState.LANDING)} onOpenChat={() => setCurrentScreen(AppState.CHAT)} />}
          {currentScreen === AppState.NOTIFICATIONS && <NotificationView onBack={() => setCurrentScreen(AppState.LANDING)} />}
          {currentScreen === AppState.LOGIN && <LoginView onBack={() => setCurrentScreen(AppState.WELCOME)} />}
          {currentScreen === AppState.CHAT && <AIAssistant onBack={() => setCurrentScreen(AppState.LANDING)} />}
          
          {![AppState.CHAT, AppState.WELCOME].includes(currentScreen) && (
            <button 
              ref={fabRef} 
              onPointerDown={onFabPointerDown} 
              onPointerMove={onFabPointerMove} 
              onPointerUp={onFabPointerUp} 
              style={{ 
                position: 'absolute', 
                left: `${fabPosition.x}px`, 
                top: `${fabPosition.y}px`, 
                touchAction: 'none' 
              }} 
              className={`w-14 h-14 bg-red-600 text-white rounded-full shadow-2xl shadow-red-600/40 flex items-center justify-center transition-transform z-[100] border-2 border-white/20 ${isDragging ? 'scale-115 opacity-80 cursor-grabbing' : 'hover:scale-110 active:scale-95 cursor-grab'}`}
            >
              <Bot size={28} />
              <span className="absolute -top-1 -right-1 w-4.5 h-4.5 bg-emerald-500 border-[3px] border-white rounded-full animate-pulse shadow-sm"></span>
            </button>
          )}
        </div>
        {renderBottomNav()}
      </div>
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none !important; }
        .no-scrollbar { 
          -ms-overflow-style: none !important; 
          scrollbar-width: none !important; 
        }
        @media (max-width: 640px) {
            .app-container {
                max-width: none;
                height: 100%;
                border-radius: 0;
                border: none;
                margin-top: 0;
            }
        }
      `}</style>
    </div>
  );
};

export default App;
