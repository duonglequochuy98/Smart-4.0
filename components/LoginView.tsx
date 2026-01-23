
import React, { useState } from 'react';
import { ArrowLeft, User, CreditCard, ShieldCheck, CheckCircle2, Sparkles, Mail } from 'lucide-react';

interface LoginViewProps {
  onBack: () => void;
  onLoginSuccess: (name: string, cccd: string) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onBack, onLoginSuccess }) => {
  const [name, setName] = useState('');
  const [cccd, setCccd] = useState('');
  const [email, setEmail] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && cccd.length === 12) {
      // Lưu thông tin vào bộ nhớ thiết bị
      localStorage.setItem('smart_taythanh_user_name', name.trim());
      localStorage.setItem('smart_taythanh_user_cccd', cccd);
      localStorage.setItem('smart_taythanh_user_email', email.trim());
      
      setIsSuccess(true);
      setTimeout(() => {
        onLoginSuccess(name.trim(), cccd);
      }, 1500);
    }
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col h-full bg-white items-center justify-center p-8 text-center animate-in zoom-in duration-500">
        <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500 mb-6 shadow-inner">
          <CheckCircle2 size={40} />
        </div>
        <h2 className="text-2xl font-black text-slate-900 mb-2">Định danh thành công!</h2>
        <p className="text-sm text-slate-500 font-medium">Chào mừng ông/bà <span className="text-red-600 font-bold">{name}</span></p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white animate-in fade-in slide-in-from-bottom-4 duration-500 overflow-y-auto no-scrollbar">
      <div className="p-4 flex items-center">
        <button onClick={onBack} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors">
          <ArrowLeft size={22} className="text-slate-700" />
        </button>
      </div>

      <div className="px-8 pt-4 pb-8 space-y-3">
        <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center text-red-600 mb-2">
          <ShieldCheck size={32} />
        </div>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Định danh Công dân</h2>
        <p className="text-sm text-slate-500 font-medium leading-relaxed">Vui lòng nhập thông tin chính xác để hệ thống tự động hóa các thủ tục hành chính cho ông/bà.</p>
      </div>

      <form onSubmit={handleLogin} className="px-8 space-y-6 flex-1">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Họ và tên (có dấu)</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                required
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="NGUYỄN VĂN A"
                className="w-full h-14 bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 text-sm font-bold focus:bg-white focus:border-red-500 transition-all outline-none"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Số CCCD (12 số)</label>
            <div className="relative">
              <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                required
                type="text" 
                maxLength={12}
                value={cccd}
                onChange={(e) => setCccd(e.target.value.replace(/\D/g, ''))}
                placeholder="079xxxxxxxx"
                className="w-full h-14 bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 text-sm font-bold focus:bg-white focus:border-red-500 transition-all outline-none"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Địa chỉ Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@gmail.com"
                className="w-full h-14 bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 text-sm font-bold focus:bg-white focus:border-red-500 transition-all outline-none"
              />
            </div>
          </div>
        </div>

        <div className="pt-4">
          <button 
            type="submit"
            disabled={!name.trim() || cccd.length !== 12}
            className="w-full h-16 bg-red-600 text-white rounded-2xl font-black text-base shadow-xl shadow-red-600/20 active:scale-[0.98] transition-all disabled:opacity-30 flex items-center justify-center gap-3 uppercase tracking-widest"
          >
            Đăng nhập ngay
            <Sparkles size={18} />
          </button>
        </div>
      </form>

      <div className="p-8 text-center text-[11px] text-slate-400 font-medium">
        Thông tin định danh giúp ông/bà nộp hồ sơ và đặt lịch hẹn nhanh hơn. Dữ liệu được bảo mật bởi UBND Phường Tây Thạnh.
      </div>
    </div>
  );
};
