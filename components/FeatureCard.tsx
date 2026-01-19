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
      className={`flex flex-col items-center justify-center gap-2 p-3 rounded-2xl ${color} transition-all active:scale-95 hover:shadow-lg min-h-[80px]`}
    >
      <div className="text-xl sm:text-2xl">{icon}</div>
      <span className="text-[10px] sm:text-[11px] font-bold text-center leading-tight">{label}</span>
    </button>
  );
};
