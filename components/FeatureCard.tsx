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
      className="flex flex-col items-center gap-2 p-3 rounded-2xl hover:scale-105 active:scale-95 transition-all"
    >
      <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center`}>
        {React.cloneElement(icon as React.ReactElement, { size: 24 })}
      </div>
      <span className="text-[10px] font-bold text-slate-700 text-center leading-tight">
        {label}
      </span>
    </button>
  );
};
