import React from 'react';
import { ArrowLeft, BarChart3 } from 'lucide-react';

interface ReportViewProps {
  onBack: () => void;
  onOpenChat: () => void;
}

export const ReportView: React.FC<ReportViewProps> = ({ onBack }) => {
  return (
    <div className="h-full bg-white flex flex-col">
      <div className="p-5 pt-7 flex items-center gap-3 border-b border-slate-100">
        <button onClick={onBack} className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50">
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-lg font-bold">Chỉ số phục vụ</h2>
      </div>
      
      <div className="flex-1 p-6">
        <div className="text-center py-20">
          <BarChart3 size={48} className="mx-auto text-slate-300 mb-4" />
          <p className="text-slate-500">Chức năng đang phát triển</p>
        </div>
      </div>
    </div>
  );
};
