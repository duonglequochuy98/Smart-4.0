import React from 'react';
import { ArrowLeft, TrendingUp, Users, CheckCircle, Trophy, MessageCircle } from 'lucide-react';

interface ReportViewProps {
  onBack: () => void;
  onOpenChat: () => void;
}

export const ReportView: React.FC<ReportViewProps> = ({ onBack, onOpenChat }) => {
  const stats = [
    { label: 'Tổng hồ sơ', value: '9,683', icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { label: 'Hài lòng', value: '99.2%', icon: Users, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Tăng trưởng', value: '+12.5%', icon: TrendingUp, color: 'text-orange-500', bg: 'bg-orange-50' },
    { label: 'Xếp hạng', value: '02/168', icon: Trophy, color: 'text-amber-500', bg: 'bg-amber-50' },
  ];

  const monthlyData = [
    { month: 'T1', value: 820 },
    { month: 'T2', value: 765 },
    { month: 'T3', value: 890 },
    { month: 'T4', value: 950 },
    { month: 'T5', value: 1020 },
    { month: 'T6', value: 1150 },
  ];

  const maxValue = Math.max(...monthlyData.map(d => d.value));

  return (
    <div className="h-full bg-slate-50 flex flex-col overflow-y-auto pb-24">
      <div className="sticky top-0 bg-white border-b border-slate-100 p-5 flex items-center gap-3 z-10">
        <button onClick={onBack} className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 hover:bg-slate-100">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-lg font-black text-slate-800">Chỉ số phục vụ</h1>
      </div>

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-5 space-y-3">
              <div className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center`}>
                <stat.icon className={stat.color} size={24} />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-bold uppercase">{stat.label}</p>
                <p className="text-2xl font-black text-slate-800 mt-1">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl p-6">
          <h3 className="font-black text-slate-800 mb-6">Thống kê 6 tháng</h3>
          <div className="flex items-end justify-between gap-2 h-48">
            {monthlyData.map((data, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full bg-slate-100 rounded-t-lg relative" style={{ height: `${(data.value / maxValue) * 100}%` }}>
                  <div className="absolute inset-0 bg-gradient-to-t from-red-600 to-red-400 rounded-t-lg"></div>
                </div>
                <span className="text-xs font-bold text-slate-600">{data.month}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-600 to-red-700 rounded-2xl p-6 text-white">
          <h3 className="font-black mb-2">Cần hỗ trợ thêm?</h3>
          <p className="text-sm text-red-100 mb-4">Trợ lý AI luôn sẵn sàng giải đáp</p>
          <button 
            onClick={onOpenChat}
            className="w-full h-12 bg-white text-red-600 rounded-xl font-bold flex items-center justify-center gap-2"
          >
            <MessageCircle size={20} />
            Mở trợ lý AI
          </button>
        </div>
      </div>
    </div>
  );
};
