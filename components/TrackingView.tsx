import React, { useState } from 'react';
import { ArrowLeft, Search, FileText, Clock, CheckCircle } from 'lucide-react';

interface TrackingViewProps {
  onBack: () => void;
}

export const TrackingView: React.FC<TrackingViewProps> = ({ onBack }) => {
  const [trackingCode, setTrackingCode] = useState('');
  const [result, setResult] = useState<any>(null);

  const handleSearch = () => {
    if (trackingCode.trim()) {
      // Demo data
      setResult({
        code: trackingCode,
        title: 'Đăng ký khai sinh',
        status: 'Đang xử lý',
        date: '15/01/2026',
        progress: 60
      });
    }
  };

  return (
    <div className="h-full bg-white flex flex-col overflow-y-auto pb-24">
      <div className="sticky top-0 bg-white border-b border-slate-100 p-5 flex items-center gap-3 z-10">
        <button onClick={onBack} className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 hover:bg-slate-100">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-lg font-black text-slate-800">Tra cứu hồ sơ</h1>
      </div>

      <div className="p-6 space-y-6">
        <div className="space-y-3">
          <label className="text-sm font-bold text-slate-700">Mã hồ sơ</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={trackingCode}
              onChange={(e) => setTrackingCode(e.target.value)}
              placeholder="Nhập mã hồ sơ..."
              className="flex-1 h-12 px-4 border border-slate-200 rounded-xl focus:outline-none focus:border-red-500"
            />
            <button
              onClick={handleSearch}
              className="w-12 h-12 bg-red-600 text-white rounded-xl flex items-center justify-center"
            >
              <Search size={20} />
            </button>
          </div>
        </div>

        {result && (
          <div className="bg-slate-50 rounded-2xl p-6 space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <FileText className="text-red-600" size={24} />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-slate-800">{result.title}</h3>
                <p className="text-sm text-slate-500">Mã: {result.code}</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Trạng thái</span>
                <span className="font-bold text-orange-600">{result.status}</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div className="bg-orange-500 h-2 rounded-full" style={{ width: `${result.progress}%` }}></div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Clock size={16} />
              <span>Ngày nộp: {result.date}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
