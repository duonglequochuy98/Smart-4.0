
import React from 'react';
import { ArrowLeft, User, Lock, Chrome } from 'lucide-react';

interface LoginViewProps {
  onBack: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onBack }) => {
  return (
    <div className="flex flex-col h-full bg-white animate-in fade-in slide-in-from-bottom-4 duration-500 overflow-y-auto">
      {/* Header */}
      <div className="p-3 flex items-center">
        <button 
          onClick={onBack} 
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 active:bg-slate-200 transition-colors"
          aria-label="Quay lại"
        >
          <ArrowLeft size={22} className="text-slate-700" />
        </button>
      </div>

      <div className="px-6 pt-1 pb-6 space-y-1 text-center sm:text-left">
        <h2 className="text-2xl font-black text-[#1A1C1E] tracking-tight">Chào mừng!</h2>
        <p className="text-sm text-slate-500 font-medium">Đăng nhập để theo dõi hồ sơ của bạn</p>
      </div>

      <div className="px-6 space-y-5 flex-1">
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Số điện thoại</label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <User size={18} />
              </div>
              <input 
                type="tel" 
                placeholder="09xx xxx xxx"
                className="w-full h-13 bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/10 focus:border-red-500 transition-all font-medium py-3.5"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Mật khẩu</label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <Lock size={18} />
              </div>
              <input 
                type="password" 
                placeholder="••••••••"
                className="w-full h-13 bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/10 focus:border-red-500 transition-all font-medium py-3.5"
              />
            </div>
          </div>
          
          <div className="flex justify-end">
            <button className="text-[11px] font-bold text-red-600 active:opacity-60 px-2">Quên mật khẩu?</button>
          </div>
        </div>

        <button className="w-full h-13 bg-red-600 text-white rounded-xl font-bold text-base shadow-lg shadow-red-600/10 active:scale-[0.98] transition-all py-3.5">
          Đăng nhập
        </button>

        <div className="relative py-1">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
          <div className="relative flex justify-center text-[10px] uppercase"><span className="bg-white px-3 text-slate-400 font-bold tracking-widest">Hoặc</span></div>
        </div>

        <button className="w-full h-13 border-2 border-slate-50 rounded-xl flex items-center justify-center gap-2 font-bold text-slate-700 hover:bg-slate-50 active:scale-[0.98] transition-all bg-white shadow-sm py-3.5">
          <Chrome size={18} className="text-red-500" />
          <span className="text-sm">Google</span>
        </button>
      </div>

      <div className="p-6 text-center mt-auto">
        <p className="text-xs text-slate-500 font-medium">
          Chưa có tài khoản? <button className="font-bold text-red-600">Đăng ký</button>
        </p>
      </div>
    </div>
  );
};