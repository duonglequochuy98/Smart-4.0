

import React from 'react';

interface FeatureCardProps {
  icon: React.ReactNode;
  label: string;
  color: string;
  onClick: () => void;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({ icon, label, color, onClick }) => {
  return (
    <button 
      onClick={onClick}
      className="flex flex-col items-center group transition-all duration-300 transform active:scale-95 w-full"
    >
      <div className="w-full aspect-square rounded-[20px] flex items-center justify-center border border-slate-100 bg-white shadow-sm transition-all group-hover:border-red-200 group-hover:shadow-md">
        <div className={`w-11 h-11 rounded-full flex items-center justify-center ${color} shadow-inner`}>
          {/* Use React.isValidElement and cast to React.ReactElement<any> to resolve TypeScript error for 'size' prop */}
          {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement<any>, { size: 22 }) : icon}
        </div>
      </div>
      <span className="mt-2 text-[11px] font-bold text-slate-600 text-center leading-tight">{label}</span>
    </button>
  );
};
