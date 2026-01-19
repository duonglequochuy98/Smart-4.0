import React, { useState } from 'react';
import { ArrowLeft, Search } from 'lucide-react';

interface TrackingViewProps {
  onBack: () => void;
}

export const TrackingView: React.FC<TrackingViewProps> = ({ onBack }) => {
  const [trackingCode, setTrackingCode] = useState('');

  return (
    <div className="h-full bg-white flex flex-col">
      <div className="p-5 pt-7 flex items-center gap-3 border-b border-slate-100">
        <button onClick={onBack} className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50">
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-lg font-bold">Tra cứu hồ sơ</h2>
      </div>
      
      <div className="flex-1 p-6">
        <div className="mb-4">
          <label className="block text-sm font-bold text-slate-700 mb-2">Mã tra cứu</label>
          <input
            type="text"
            value={trackingCode}
            onChange={(e) => setTrackingCode(e.target.value)}
            placeholder="Nhập mã tra cứu..."
            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>
        
        <button className="w-full h-14 bg-red-600 text-white rounded-xl font-bold flex items-center justify-center gap-2">
          <Search size={20} />
          <span>Tra cứu</span>
        </button>
      </div>
    </div>
  );
};
