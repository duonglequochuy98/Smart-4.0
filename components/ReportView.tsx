
import React, { useState, useMemo } from 'react';
import { 
  ArrowLeft, 
  TrendingUp, 
  Eye, 
  Clock, 
  Globe, 
  Smile, 
  FileCheck, 
  Star, 
  LineChart as LineIcon, 
  BarChart3 as BarIcon,
  Trophy
} from 'lucide-react';

interface ReportViewProps {
  onBack: () => void;
  onOpenChat: () => void;
}

const getSeedValue = (value: number, year: number) => {
  return (year * 1000) + value;
};

const pseudoRandom = (seed: number, min: number, max: number) => {
  const x = Math.sin(seed) * 10000;
  const rand = x - Math.floor(x);
  return Math.floor(rand * (max - min + 1)) + min;
};

export const ReportView: React.FC<ReportViewProps> = ({ onBack, onOpenChat }) => {
  const [chartType, setChartType] = useState<'line' | 'bar'>('line');
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  
  const now = new Date();
  const filterMonth = now.getMonth() + 1;
  const filterYear = now.getFullYear();

  const dynamicData = useMemo(() => {
    const seed = getSeedValue(filterMonth, filterYear);
    
    const criteriaList = [
      { id: 1, label: "Công khai, Minh bạch", score: pseudoRandom(seed + 1, 18, 18), total: 18, status: "Hoàn thành 100%" },
      { id: 2, label: "Tiến độ giải quyết", score: pseudoRandom(seed + 2, 18.44, 20), total: 20, status: `Sớm hạn trên ${pseudoRandom(seed + 2, 98, 100)}%` },
      { id: 3, label: "Dịch vụ trực tuyến", score: pseudoRandom(seed + 3, 20, 20), total: 22, status: `DV công: ${pseudoRandom(seed + 3, 90, 95)}%` },
      { id: 4, label: "Mức độ hài lòng", score: (pseudoRandom(seed + 4, 170, 180) / 10).toFixed(1), total: 18, isRating: true },
      // Fixed: Removed extra argument from pseudoRandom call (was pseudoRandom(seed + 5, 16, 19.35, 22))
      { id: 5, label: "Số hóa hồ sơ", score: pseudoRandom(seed + 5, 16.85, 22), total: 22, status: "Hoàn thành 100%" }
    ];

    const calculatedTotal = criteriaList.reduce((acc, curr) => acc + Number(curr.score), 0);
    const finalTotalScore = Math.min(calculatedTotal, 100).toFixed(1);

    // Dữ liệu xu hướng: Điểm cuối cùng phải bằng finalTotalScore
    const trendData = Array.from({ length: 5 }, (_, i) => {
      const pointSeed = seed - (4 - i) * 7;
      const m = ((filterMonth - (4 - i) - 1 + 12) % 12) + 1;
      const label = `T${m}`;
      
      // Nếu là tháng cuối cùng (tháng hiện tại), dùng điểm thực
      const value = i === 4 ? parseFloat(finalTotalScore) : pseudoRandom(pointSeed, 85, 95);
      return { label, value };
    });

    return { 
      totalScore: finalTotalScore, 
      trendData, 
      criteria: criteriaList,
      ranking: "51/168"
    };
  }, [filterMonth, filterYear]);

  const getStatusText = (score: number) => {
    if (score === 0) return 'Chưa có dữ liệu';
    if (score >= 95) return 'Xuất sắc';
    if (score >= 90) return 'Tốt';
    return 'Khá';
  };

  return (
    <div className="flex flex-col h-full bg-[#FDFDFD] overflow-y-auto animate-in fade-in duration-500 pb-24 relative no-scrollbar">
      <div className="p-4 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-20 border-b border-slate-50">
        <button onClick={onBack} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors">
          <ArrowLeft size={20} className="text-slate-800" />
        </button>
        <h2 className="text-base font-bold text-slate-900">Báo cáo chỉ số phục vụ</h2>
        <div className="px-3 py-1 bg-slate-50 rounded-full border border-slate-100">
           <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Tháng {filterMonth}/{filterYear}</span>
        </div>
      </div>

      <div className="px-5 space-y-6 pt-2 no-scrollbar">
        {/* Score Card */}
        <div className="bg-white rounded-[24px] p-6 border border-orange-100 shadow-sm relative overflow-hidden flex flex-col items-center text-center">
          <div className="flex flex-col items-center mb-1">
             <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Tổng điểm đánh giá</p>
             <div className="flex items-center gap-1.5 mt-1.5 px-3 py-1 bg-amber-50 rounded-full border border-amber-100">
               <Trophy size={12} className="text-amber-600" />
               <p className="text-[10px] font-black text-amber-600 uppercase">Thứ hạng hôm nay: {dynamicData.ranking}</p>
             </div>
          </div>
          
          <div className="relative w-28 h-28 flex items-center justify-center mt-3">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="44" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-slate-50" />
              <circle cx="50" cy="50" r="44" stroke="currentColor" strokeWidth="6" fill="transparent" strokeDasharray={276} strokeDashoffset={276 * (1 - Number(dynamicData.totalScore) / 100)} strokeLinecap="round" className="text-red-600 transition-all duration-1000 ease-out" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-black text-slate-900 leading-none">{dynamicData.totalScore}</span>
              <span className="text-[10px] font-bold text-slate-400 mt-0.5">/ 100</span>
            </div>
          </div>
          <div className="mt-5 px-5 py-1.5 bg-red-50 text-red-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-red-100">{getStatusText(Number(dynamicData.totalScore))}</div>
        </div>

        {/* Trend Section */}
        <div className="bg-white rounded-[24px] p-6 border border-slate-100 shadow-sm overflow-visible">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <h3 className="font-bold text-slate-900">Xu hướng</h3>
              <div className="flex bg-slate-100 p-0.5 rounded-lg">
                <button onClick={() => setChartType('line')} className={`p-1.5 rounded-md transition-all ${chartType === 'line' ? 'bg-white text-red-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}><LineIcon size={14} /></button>
                <button onClick={() => setChartType('bar')} className={`p-1.5 rounded-md transition-all ${chartType === 'bar' ? 'bg-white text-red-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}><BarIcon size={14} /></button>
              </div>
            </div>
            <div className="flex items-center gap-1 px-2 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-black">
              <TrendingUp size={12} />
              +2.1%
            </div>
          </div>
          
          <div className="w-full relative mt-4 h-40 group/chart">
            {/* Tooltip Overlay */}
            {activeIndex !== null && (
              <div 
                className="absolute z-30 bg-slate-900 text-white px-3 py-1.5 rounded-xl text-[11px] font-black shadow-xl -translate-x-1/2 -translate-y-[135%] pointer-events-none transition-all duration-200"
                style={{ 
                  left: `${(activeIndex * 100) / 4}%`, 
                  top: `${100 - Math.min(Math.max((dynamicData.trendData[activeIndex].value - 80) * 4, 10), 90)}%` 
                }}
              >
                {dynamicData.trendData[activeIndex].value} điểm
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[4px] border-t-slate-900"></div>
              </div>
            )}

            <div className="h-32 w-full relative">
              {chartType === 'line' ? (
                <svg viewBox="0 0 100 40" className="w-full h-full overflow-visible">
                  <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#ef4444" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path 
                    d={`M0,${(100 - dynamicData.trendData[0].value) * 2} 
                       Q15,${(100 - dynamicData.trendData[1].value) * 2} 25,${(100 - dynamicData.trendData[1].value) * 2} 
                       T50,${(100 - dynamicData.trendData[2].value) * 2} 
                       T75,${(100 - dynamicData.trendData[3].value) * 2} 
                       T100,${(100 - dynamicData.trendData[4].value) * 2} L100,40 L0,40 Z`} 
                    fill="url(#chartGradient)" 
                    className="transition-all duration-500"
                  />
                  <path 
                    d={`M0,${(100 - dynamicData.trendData[0].value) * 2} 
                       Q15,${(100 - dynamicData.trendData[1].value) * 2} 25,${(100 - dynamicData.trendData[1].value) * 2} 
                       T50,${(100 - dynamicData.trendData[2].value) * 2} 
                       T75,${(100 - dynamicData.trendData[3].value) * 2} 
                       T100,${(100 - dynamicData.trendData[4].value) * 2}`} 
                    fill="none" 
                    stroke="#ef4444" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    className="transition-all duration-500"
                  />
                  {dynamicData.trendData.map((p, i) => (
                    <circle 
                      key={i} 
                      cx={(i * 100) / 4} 
                      cy={(100 - p.value) * 2} 
                      r={activeIndex === i ? "3.5" : "2"} 
                      fill={activeIndex === i ? "#ef4444" : "white"} 
                      stroke="#ef4444" 
                      strokeWidth="1.5" 
                      onMouseEnter={() => setActiveIndex(i)}
                      onMouseLeave={() => setActiveIndex(null)}
                      onTouchStart={() => setActiveIndex(i)}
                      className="cursor-pointer transition-all duration-200"
                    />
                  ))}
                </svg>
              ) : (
                <div className="w-full h-full flex items-end justify-between px-2 gap-4">
                  {dynamicData.trendData.map((p, i) => (
                    <div 
                      key={i} 
                      className="flex-1 flex flex-col items-center group/bar relative h-full justify-end cursor-pointer"
                      onMouseEnter={() => setActiveIndex(i)}
                      onMouseLeave={() => setActiveIndex(null)}
                      onTouchStart={() => setActiveIndex(i)}
                    >
                      <div 
                        className={`w-full max-w-[24px] bg-red-600 rounded-t-lg transition-all duration-500 ease-out ${activeIndex === i ? 'opacity-100 scale-x-110 shadow-lg shadow-red-600/20' : 'opacity-70'}`} 
                        style={{ height: `${Math.max((p.value - 80) * 5, 5)}%` }} 
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="flex justify-between mt-3 px-1 text-[10px] font-bold text-slate-400">
              {dynamicData.trendData.map((p, idx) => (
                <span key={idx} className={activeIndex === idx ? 'text-red-600 transition-colors duration-200' : ''}>
                  {p.label}
                </span>
              ))}
            </div>

            <div className="mt-8 pt-5 border-t border-slate-50 flex items-center justify-center gap-8">
              <div className="flex items-center gap-2.5">
                <div className="w-3.5 h-[2px] bg-red-600 rounded-full"></div>
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Chỉ số phục vụ</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-3 h-3 rounded-full border-2 border-red-600 bg-white shadow-sm"></div>
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Tháng hiện tại</span>
              </div>
            </div>
          </div>
        </div>

        {/* Criteria List */}
        <div className="space-y-4 pt-4 pb-6 no-scrollbar">
          <h3 className="text-base font-black text-slate-900 px-1">Chi tiết tiêu chí</h3>
          <div className="space-y-4">
            {dynamicData.criteria.map((c, idx) => (
              <CriterionItem 
                key={c.id} 
                icon={idx === 0 ? <Eye size={18} /> : idx === 1 ? <Clock size={18} /> : idx === 2 ? <Globe size={18} /> : idx === 3 ? <Smile size={18} /> : <FileCheck size={18} />} 
                label={c.label} 
                score={c.score.toString()} 
                total={c.total.toString()} 
                status={c.status} 
                progress={(Number(c.score) / c.total) * 100} 
                isRating={c.isRating} 
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

interface CriterionItemProps {
  icon: React.ReactNode;
  label: string;
  score: string;
  total: string;
  status?: string;
  progress: number;
  iconColor?: string;
  isRating?: boolean;
}

const CriterionItem: React.FC<CriterionItemProps> = ({ icon, label, score, total, status, progress, iconColor, isRating }) => {
  const renderStars = () => {
    const maxStars = 5;
    const currentScore = Number(score);
    const maxScore = Number(total);
    const activeStars = Math.round((currentScore / maxScore) * maxStars);

    return (
      <div className="flex gap-1 mt-1.5">
        {Array.from({ length: maxStars }).map((_, i) => (
          <Star 
            key={i} 
            size={12} 
            className={i < activeStars ? "text-yellow-400 fill-yellow-400" : "text-slate-200 fill-slate-200"} 
          />
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white p-5 rounded-[24px] border border-slate-100 shadow-sm space-y-4 hover:border-red-100 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex gap-4">
          <div className={`w-11 h-11 rounded-2xl bg-red-50 flex items-center justify-center ${iconColor || 'text-red-600'} shadow-inner`}>{icon}</div>
          <div>
            <h4 className="text-[15px] font-bold text-slate-800 leading-tight">{label}</h4>
            {status && <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-tight">{status}</p>}
            {isRating && renderStars()}
          </div>
        </div>
        <div className="text-right"><span className="text-base font-black text-slate-900">{score}</span><span className="text-[11px] font-bold text-slate-400 ml-0.5">/{total}</span></div>
      </div>
      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
        <div className="h-full bg-red-600 rounded-full transition-all duration-1000 ease-out" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
};
