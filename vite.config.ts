// components/FeatureCard.tsx
import React from 'react';

interface FeatureCardProps {
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  color: string;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({ onClick, icon, label, color }) => {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center gap-2 p-4 rounded-2xl ${color} transition-all active:scale-95 shadow-sm`}
    >
      <div className="w-8 h-8 flex items-center justify-center">
        {icon}
      </div>
      <span className="text-[10px] font-bold text-center leading-tight">
        {label}
      </span>
    </button>
  );
};
