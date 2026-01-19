import React, { useState } from 'react';
import { ArrowLeft, Lock, User } from 'lucide-react';

interface LoginViewProps {
  onBack: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onBack }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Demo login logic
    console.log('Login attempt:', { username, password });
  };

  return (
    <div className="h-full bg-white flex flex-col">
      <div className="p-5 flex items-center gap-3">
        <button onClick={onBack} className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 hover:bg-slate-100">
          <ArrowLeft size={20} />
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-8 -mt-20">
        <div className="w-20 h-20 bg-red-100 rounded-3xl flex items-center justify-center mb-6">
          <Lock className="text-red-600" size={36} />
        </div>

        <h1 className="text-2xl font-black text-slate-800 mb-2">Đăng nhập</h1>
        <p className="text-sm text-slate-500 mb-8">Truy cập tài khoản của bạn</p>

        <div className="w-full max-w-sm space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Tên đăng nhập</label>
            <div className="flex items-center gap-3 h-12 px-4 border border-slate-200 rounded-xl">
              <User size={18} className="text-slate-400" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Nhập tên đăng nhập"
                className="flex-1 outline-none"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Mật khẩu</label>
            <div className="flex items-center gap-3 h-12 px-4 border border-slate-200 rounded-xl">
              <Lock size={18} className="text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu"
                className="flex-1 outline-none"
              />
            </div>
          </div>

          <button
            onClick={handleLogin}
            className="w-full h-14 bg-red-600 text-white rounded-xl font-bold mt-6"
          >
            Đăng nhập
          </button>

          <button className="w-full text-sm text-red-600 font-bold mt-4">
            Quên mật khẩu?
          </button>
        </div>
      </div>
    </div>
  );
};
