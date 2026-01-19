
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
  CalendarCheck
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
    title: "Thông báo về việc nghỉ lễ Tết dương lịch 01/01/2026",
    summary: "UBND Phường Tây Thạnh thông báo lịch nghỉ lễ và trực giải quyết hồ sơ cấp bách.",
    date: "10:30 - 25/08/2024",
    category: "Thông báo",
    url: 'https://thuvienphapluat.vn/chinh-sach-phap-luat-moi/vn/ho-tro-phap-luat/tu-van-phap-luat/92028/lich-nghi-le-quoc-khanh-2-9-2025-nguoi-lao-dong-duoc-nghi-le-4-ngay-hay-3-ngay',
    isRead: false,
    isImportant: true
  },
  {
    id: 3,
    title: "Hướng dẫn nộp hồ sơ trực tuyến qua Cổng dịch vụ công mới",
    summary: "Các bước đơn giản để nộp hồ sơ chứng thực bản sao và đăng ký khai sinh ngay tại nhà.",
    date: "05:00 - 05/01/2025",
    category: "Tin tức",
    url: 'https://www.youtube.com/watch?v=HSmgjZ4Q6dM',
    isRead: true,
    isImportant: true
  }
];

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<AppState>(AppState.WELCOME);
  const [notifications, setNotifications] = useState<NewsItem[]>(INITIAL_NEWS);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [todayDate, setTodayDate] = useState(() => {
    const now = new Date();
    const d = String(now.getDate()).padStart(2, '0');
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const y = now.getFullYear();
    return `${d}/${m}/${y}`;
  });

  const addNotification = (news: NewsItem) => {
    setNotifications(prev => [news, ...prev]);
  };

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
  const LOGO_URL = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTmbQfoaEv8CFfButwh6ANX5mUVyu43HYsLg&s";

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
    const unreadCount = notifications.filter(n => !n.isRead).length;
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
        <button onClick={() => setCurrentScreen(AppState.NOTIFICATIONS)} className={`flex flex-col items-center gap-1.5 transition-all relative ${currentScreen === AppState.NOTIFICATIONS ? 'text-red-600 scale-110' : 'text-slate-400 hover:text-slate-600'}`}>
          <Bell size={22} className={currentScreen === AppState.NOTIFICATIONS ? 'fill-red-50' : ''} />
          {unreadCount > 0 && (
            <span className="absolute top-0 -right-1.5 w-4 h-4 bg-red-600 text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 border-white shadow-sm">
              {unreadCount}
            </span>
          )}
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
           <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white rounded-[28px] sm:rounded-[32px] shadow-2xl flex items-center justify-center border-4 border-red-50 animate-bounce [animation-duration:3s] overflow-hidden">
             <img src={LOGO_URL} alt="Logo" className="w-full h-full object-cover" />
           </div>
        </div>
      </div>
      <div className="flex-1 px-8 sm:px-12 flex flex-col items-center text-center -mt-10 relative z-10 justify-center">
        <div className="space-y-4 mb-8 sm:mb-10 w-full">
          <div className="flex items-center justify-center gap-3 mb-1">
            <span className="h-[1px] w-8 bg-slate-200"></span>
            <span className="text-[10px] font-black text-slate-800 uppercase tracking-[0.4em]">Chào mừng đến với</span>
            <span className="h-[1px] w-8 bg-slate-200"></span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-red-700 leading-[1.3] tracking-tight w-full max-w-[420px] mx-auto">
            <span className="block whitespace-nowrap">Trung tâm Phục vụ Hành chính công</span>
            <span className="block mt-1">Phường Tây Thạnh Smart 4.0</span>
          </h1>
          <p className="text-[13px] sm:text-[14px] text-slate-500 font-medium leading-relaxed max-w-[300px] mx-auto opacity-80">
            Hệ thống thông minh, minh bạch và hiệu quả phục vụ Nhân dân Thành phố Hồ Chí Minh.
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
      </div>
      <div className="pb-6 text-center shrink-0 opacity-30"><p className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em]">Phiên bản 4.0.2 - 2026</p></div>
    </div>
  );

  const renderLanding = () => (
    <div className="h-full bg-[#FDFDFD] relative flex flex-col overflow-y-auto no-scrollbar animate-in fade-in duration-300 pb-24">
      <div className="sticky top-0 p-5 pt-7 flex justify-between items-center z-30 bg-white/80 backdrop-blur-lg border-b border-slate-100/60">
        <div className="flex items-center gap-3">
          <button onClick={() => setCurrentScreen(AppState.WELCOME)} className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 text-slate-600 hover:bg-slate-100 active:scale-90 transition-all"><ArrowLeft size={20} /></button>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-white border border-slate-100 rounded-xl flex items-center justify-center overflow-hidden shadow-sm">
               <img src={LOGO_URL} alt="Logo Small" className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col -space-y-1"><span className="font-black text-[15px] tracking-tight text-red-600">SMART</span><span className="text-[9px] font-bold text-slate-400 tracking-widest uppercase whitespace-nowrap">Tây Thạnh</span></div>
          </div>
        </div>
        <div className="flex items-center gap-2"><button className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:text-slate-600 transition-colors"><UserCircle size={22} /></button></div>
      </div>
      
      <div className="px-6 py-8 sm:py-12 flex flex-col items-center">
        <div className="relative w-full max-w-[95px] sm:max-w-[115px] aspect-square rounded-[28px] sm:rounded-[32px] bg-white border-4 border-white overflow-hidden flex items-center justify-center mb-8 shadow-2xl shadow-slate-200">
          <img src={LOGO_URL} alt="Logo Main" className="w-full h-full object-cover" />
        </div>
        <div className="text-center space-y-2 mb-10">
           <h1 className="text-xl sm:text-2xl font-black text-red-700 leading-[1.3] tracking-tight w-full max-w-[420px] mx-auto">
            <span className="block whitespace-nowrap">Trung tâm Phục vụ Hành chính công</span>
            <span className="text-red-600 font-bold text-xl sm:text-2xl whitespace-nowrap">Phường Tây Thạnh</span>
          </h1>
          <div className="inline-block px-4 py-1.5 bg-slate-100 rounded-full">
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.25em]">Thành phố Hồ Chí Minh</p>
          </div>
        </div>
        
        <div className="w-full grid grid-cols-5 gap-2 sm:gap-4 mb-10 px-2 sm:px-4">
          <FeatureCard onClick={() => setCurrentScreen(AppState.CHAT)} icon={<Bot />} label="Trợ lý AI" color="bg-red-50 text-red-600" />
          <FeatureCard onClick={() => setCurrentScreen(AppState.BOOKING)} icon={<CalendarCheck />} label="Đặt lịch" color="bg-violet-50 text-violet-600" />
          <FeatureCard onClick={() => setCurrentScreen(AppState.TRACKING)} icon={<Search />} label="Tra cứu" color="bg-emerald-50 text-emerald-600" />
          <FeatureCard onClick={() => setCurrentScreen(AppState.SUBMIT)} icon={<FileUp />} label="Nộp hồ sơ" color="bg-orange-50 text-orange-600" />
          <FeatureCard onClick={handleOpenZalo} icon={<MessageCircle />} label="Zalo OA" color="bg-blue-50 text-blue-600" />
        </div>
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
              <div className="flex items-center gap-2 text-amber-500"><Trophy size={14} /><span className="text-[10px] font-black uppercase">Hạng cao </span></div>
              <div className="flex items-baseline gap-1"><span className="text-xl font-black text-amber-400">02</span><span className="text-[10px] font-bold text-white/30">/TP</span></div>
            </div>
          </div>
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
          {currentScreen === AppState.BOOKING && <BookingView onBack={() => setCurrentScreen(AppState.LANDING)} onAddNotification={addNotification} />}
          {currentScreen === AppState.REPORT && <ReportView onBack={() => setCurrentScreen(AppState.LANDING)} onOpenChat={() => setCurrentScreen(AppState.CHAT)} />}
          {currentScreen === AppState.NOTIFICATIONS && <NotificationView onBack={() => setCurrentScreen(AppState.LANDING)} notifications={notifications} setNotifications={setNotifications} />}
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
