
import React, { useState, useRef, useEffect } from 'react';
import { AppState } from './types';
import { FeatureCard } from './components/FeatureCard';
import { TrackingView } from './components/TrackingView';
import { SubmissionView } from './components/SubmissionView';
import { BookingView } from './components/BookingView';
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
  Trophy,
  CalendarCheck,
  LogOut
} from 'lucide-react';

export interface NewsItem {
  id: number;
  title: string;
  summary: string;
  date: string;
  category: 'Thông báo' | 'Tin tức' | 'Sự kiện';
  isRead: boolean;
  isImportant?: boolean;
  url?: string;
  isBooking?: boolean;
  bookingData?: {
    name: string;
    code: string;
    service: string;
    time: string;
    date: string;
    counter: string;
  };
}

const INITIAL_NEWS: NewsItem[] = [
  {
    id: 1,
    title: "Triển khai cài đặt app Smart Tây Thạnh cho toàn dân",
    summary: "UBND Phường khuyến khích người dân sử dụng ứng dụng để nộp hồ sơ trực tuyến và định danh công dân.",
    date: "08:00 - 15/05/2025",
    category: "Thông báo",
    isRead: false,
    isImportant: true
  }
];

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<AppState>(AppState.WELCOME);
  const [notifications, setNotifications] = useState<NewsItem[]>(INITIAL_NEWS);
  const [userName, setUserName] = useState<string>("");
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [todayDate, setTodayDate] = useState(() => {
    const now = new Date();
    return `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;
  });

  // Khởi tạo thông tin người dùng từ bộ nhớ
  useEffect(() => {
    const savedName = localStorage.getItem('smart_taythanh_user_name');
    if (savedName) {
      setUserName(savedName);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('smart_taythanh_user_name');
    localStorage.removeItem('smart_taythanh_user_cccd');
    localStorage.removeItem('smart_taythanh_user_phone');
    localStorage.removeItem('smart_taythanh_user_email');
    setUserName("");
    setCurrentScreen(AppState.WELCOME);
  };

  const addNotification = (news: NewsItem) => {
    setNotifications(prev => [news, ...prev]);
  };

  const [fabPosition, setFabPosition] = useState({ x: 310, y: 580 });
  const [isDragging, setIsDragging] = useState(false);
  const fabDragStartPos = useRef({ x: 0, y: 0 });
  const fabRef = useRef<HTMLButtonElement>(null);
  const fabHasMoved = useRef(false);

  // Updated LOGO_URL as requested
  const LOGO_URL = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTmbQfoaEv8CFfButwh6ANX5mUVyu43HYsLg&s";

  const updateFabPos = () => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setFabPosition({ x: rect.width - 75, y: rect.height - 165 });
    }
  };

  useEffect(() => {
    updateFabPos();
    window.addEventListener('resize', updateFabPos);
    return () => window.removeEventListener('resize', updateFabPos);
  }, []);

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
    const constrainedX = Math.max(10, Math.min(rect.width - 65, newX));
    const constrainedY = Math.max(10, Math.min(rect.height - 105, newY));
    if (Math.abs(constrainedX - fabPosition.x) > 5 || Math.abs(constrainedY - fabPosition.y) > 5) fabHasMoved.current = true;
    setFabPosition({ x: constrainedX, y: constrainedY });
  };

  const onFabPointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    if (fabRef.current) fabRef.current.releasePointerCapture(e.pointerId);
    if (!fabHasMoved.current) {
      setCurrentScreen(AppState.CHAT);
    }
  };

  const renderLanding = () => (
    <div className="h-full bg-[#F8FAFC] relative flex flex-col overflow-y-auto no-scrollbar animate-in fade-in duration-300 pb-24">
      <div className="sticky top-0 p-5 flex justify-between items-center z-30 bg-white/80 backdrop-blur-lg border-b border-slate-100">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setCurrentScreen(AppState.WELCOME)}
            className="w-10 h-10 flex items-center justify-center rounded-2xl bg-slate-50 text-slate-600 border border-slate-100 shadow-sm active:scale-90 transition-all"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white border border-slate-100 rounded-2xl flex items-center justify-center overflow-hidden shadow-sm">
               <img src={LOGO_URL} alt="Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <h2 className="font-black text-[14px] text-slate-800 leading-none">Chào {userName.split(' ').pop() || 'Ông/Bà'}</h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase mt-1 tracking-widest">Smart Tây Thạnh 4.0</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {userName && (
            <button onClick={handleLogout} className="w-10 h-10 flex items-center justify-center rounded-2xl bg-red-50 text-red-600 border border-red-100 shadow-sm transition-all active:scale-90"><LogOut size={18} /></button>
          )}
          <button onClick={() => setCurrentScreen(AppState.LOGIN)} className="w-10 h-10 flex items-center justify-center rounded-2xl bg-slate-50 text-slate-400 border border-slate-100 shadow-sm transition-all active:scale-90"><UserCircle size={22} /></button>
        </div>
      </div>
      
      <div className="px-6 py-8 flex flex-col items-center">
        <div className="relative w-24 aspect-square rounded-[32px] bg-white border-4 border-white overflow-hidden flex items-center justify-center mb-6 shadow-xl">
          <img src={LOGO_URL} alt="Logo" className="w-full h-full object-cover" />
        </div>
        <div className="text-center space-y-2 mb-8">
           <h1 className="text-xl font-black text-slate-900 leading-tight">
            Trung tâm Phục vụ Hành chính công<br/>
            <span className="text-red-600 uppercase tracking-tight">Phường Tây Thạnh</span>
          </h1>
        </div>
        
        <div className="w-full grid grid-cols-5 gap-3 mb-10">
          <FeatureCard onClick={() => setCurrentScreen(AppState.CHAT)} icon={<Bot />} label="Trợ lý AI" color="bg-red-50 text-red-600" />
          <FeatureCard onClick={() => setCurrentScreen(AppState.BOOKING)} icon={<CalendarCheck />} label="Đặt lịch" color="bg-violet-50 text-violet-600" />
          <FeatureCard onClick={() => setCurrentScreen(AppState.TRACKING)} icon={<Search />} label="Tra cứu" color="bg-emerald-50 text-emerald-600" />
          <FeatureCard onClick={() => setCurrentScreen(AppState.SUBMIT)} icon={<FileUp />} label="Nộp hồ sơ" color="bg-orange-50 text-orange-600" />
          <FeatureCard onClick={() => window.open("https://zalo.me/1358120320651896785", "_blank")} icon={<MessageCircle />} label="Zalo OA" color="bg-blue-50 text-blue-600" />
        </div>

        <div className="w-full bg-slate-900 rounded-[32px] p-7 text-white relative overflow-hidden shadow-2xl">
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
              <div className="flex items-center gap-2 text-amber-500"><Trophy size={14} /><span className="text-[10px] font-black uppercase">Hạng</span></div>
              <div className="flex items-baseline gap-1"><span className="text-xl font-black text-amber-400">02</span><span className="text-[10px] font-bold text-white/30">/TP</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderWelcome = () => (
    <div className="flex flex-col h-full bg-white overflow-hidden animate-in fade-in duration-700">
      {/* Background Image Header */}
      <div className="relative h-[42%] shrink-0 overflow-hidden">
        <img 
          src="https://iwater.vn/Image/Picture/New/UBND-phuong-tay-thanh-tan-phu.jpg" 
          alt="UBND Phường Tây Thạnh" 
          className="w-full h-full object-cover" 
        />
        {/* White fade gradient - Move it down slightly so it doesn't cover the logo */}
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/5 to-transparent"></div>
        
        {/* Center Logo Area - Positioned in absolute center of the image area */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
           <div className="w-24 h-24 bg-red-600 rounded-[28px] shadow-2xl flex items-center justify-center p-0 overflow-hidden border-[5px] border-white relative z-20">
             <img src={LOGO_URL} alt="Logo" className="w-full h-full object-cover" />
           </div>
        </div>
      </div>

      <div className="flex-1 px-8 pt-8 flex flex-col items-center text-center">
        {/* Welcome Divider */}
        <div className="flex items-center gap-4 mb-6 w-full max-w-[280px]">
          <div className="h-[1px] flex-1 bg-slate-200"></div>
          <span className="text-[11px] font-bold text-slate-800 uppercase tracking-[0.2em] whitespace-nowrap">Chào mừng đến với</span>
          <div className="h-[1px] flex-1 bg-slate-200"></div>
        </div>

        {/* Title and Description */}
        <div className="space-y-5 mb-10">
          <h1 className="text-[22px] font-extrabold text-red-600 leading-[1.3] px-2">
            Trung tâm Phục vụ Hành chính công Phường Tây Thạnh Smart 4.0
          </h1>
          <p className="text-[13px] text-slate-500 font-medium px-4 leading-relaxed">
            Hệ thống thông minh, minh bạch và hiệu quả phục vụ Nhân dân Thành phố Hồ Chí Minh.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="w-full space-y-4 max-w-[320px]">
          <button 
            onClick={() => setCurrentScreen(AppState.LANDING)} 
            className="w-full h-16 bg-[#e12d2d] text-white rounded-[20px] font-bold text-base shadow-xl shadow-red-600/20 flex items-center justify-center gap-3 active:scale-95 transition-all"
          >
            Bắt đầu trải nghiệm <ArrowRight size={20} />
          </button>
          
          <button 
            onClick={() => setCurrentScreen(AppState.CHAT)} 
            className="w-full h-16 bg-[#f8fafc] text-slate-700 border border-slate-100 rounded-[20px] font-bold text-base flex items-center justify-center gap-3 active:scale-95 transition-all"
          >
            <Bot size={22} className="text-red-500" /> Hỏi Trợ lý ảo AI ngay
          </button>
        </div>

        {/* Footer Version */}
        <div className="mt-auto pb-8">
           <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em]">Phiên bản 4.0.2 - 2026</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-slate-100 flex items-center justify-center p-0 sm:p-4 overflow-hidden">
      <div ref={containerRef} className="app-container flex flex-col no-scrollbar overflow-hidden">
        <div className="flex-1 overflow-hidden relative no-scrollbar">
          {currentScreen === AppState.WELCOME && renderWelcome()}
          {currentScreen === AppState.LANDING && renderLanding()}
          {currentScreen === AppState.TRACKING && <TrackingView onBack={() => setCurrentScreen(AppState.LANDING)} />}
          {currentScreen === AppState.SUBMIT && <SubmissionView onBack={() => setCurrentScreen(AppState.LANDING)} />}
          {currentScreen === AppState.BOOKING && <BookingView onBack={() => setCurrentScreen(AppState.LANDING)} onAddNotification={addNotification} />}
          {currentScreen === AppState.REPORT && <ReportView onBack={() => setCurrentScreen(AppState.LANDING)} onOpenChat={() => setCurrentScreen(AppState.CHAT)} />}
          {currentScreen === AppState.NOTIFICATIONS && <NotificationView onBack={() => setCurrentScreen(AppState.LANDING)} notifications={notifications} setNotifications={setNotifications} />}
          {currentScreen === AppState.LOGIN && <LoginView onBack={() => setCurrentScreen(AppState.WELCOME)} onLoginSuccess={(name) => { setUserName(name); setCurrentScreen(AppState.LANDING); }} />}
          {currentScreen === AppState.CHAT && <AIAssistant onBack={() => setCurrentScreen(AppState.LANDING)} />}
          
          {![AppState.CHAT, AppState.WELCOME, AppState.LOGIN].includes(currentScreen) && (
            <button 
              ref={fabRef} 
              onPointerDown={onFabPointerDown} 
              onPointerMove={onFabPointerMove} 
              onPointerUp={onFabPointerUp} 
              style={{ position: 'absolute', left: `${fabPosition.x}px`, top: `${fabPosition.y}px`, touchAction: 'none' }} 
              className={`w-16 h-16 bg-red-600 text-white rounded-[24px] shadow-2xl flex items-center justify-center transition-transform z-[100] border-4 border-white/20 ${isDragging ? 'scale-110 opacity-80' : 'hover:scale-110 active:scale-95'}`}
            >
              <Bot size={32} />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 border-4 border-white rounded-full animate-pulse shadow-sm"></span>
            </button>
          )}
        </div>
        {![AppState.CHAT, AppState.WELCOME, AppState.LOGIN].includes(currentScreen) && (
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-white/95 backdrop-blur-xl border-t border-slate-100 px-10 flex items-center justify-between z-40 shadow-[0_-4px_25px_rgba(0,0,0,0.04)]">
            <button onClick={() => setCurrentScreen(AppState.LANDING)} className={`flex flex-col items-center gap-1.5 ${currentScreen === AppState.LANDING ? 'text-red-600' : 'text-slate-400'}`}><Home size={22} /><span className="text-[10px] font-black uppercase">Trang chủ</span></button>
            <button onClick={() => setCurrentScreen(AppState.REPORT)} className={`flex flex-col items-center gap-1.5 ${currentScreen === AppState.REPORT ? 'text-red-600' : 'text-slate-400'}`}><BarChart3 size={22} /><span className="text-[10px] font-black uppercase">Chỉ số</span></button>
            <button onClick={() => setCurrentScreen(AppState.NOTIFICATIONS)} className={`flex flex-col items-center gap-1.5 ${currentScreen === AppState.NOTIFICATIONS ? 'text-red-600' : 'text-slate-400'}`}><Bell size={22} /><span className="text-[10px] font-black uppercase">Thông báo</span></button>
          </div>
        )}
      </div>
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none !important; }
        .no-scrollbar { -ms-overflow-style: none !important; scrollbar-width: none !important; }
        @media (max-width: 640px) { .app-container { max-width: none; height: 100%; border-radius: 0; border: none; margin-top: 0; } }
      `}</style>
    </div>
  );
};

export default App;
