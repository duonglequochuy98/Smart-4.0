import React, { useState } from 'react';
import { ArrowLeft, FileUp, Upload, CheckCircle } from 'lucide-react';

interface SubmissionViewProps {
  onBack: () => void;
}

export const SubmissionView: React.FC<SubmissionViewProps> = ({ onBack }) => {
  const [selectedService, setSelectedService] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const services = [
    { id: '1', name: 'Chứng thực bản sao' },
    { id: '2', name: 'Đăng ký khai sinh' },
    { id: '3', name: 'Đăng ký kết hôn' },
    { id: '4', name: 'Cấp giấy xác nhận' },
  ];

  const handleSubmit = () => {
    if (selectedService) {
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
    }
  };

  return (
    <div className="h-full bg-white flex flex-col overflow-y-auto pb-24">
      <div className="sticky top-0 bg-white border-b border-slate-100 p-5 flex items-center gap-3 z-10">
        <button onClick={onBack} className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 hover:bg-slate-100">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-lg font-black text-slate-800">Nộp hồ sơ trực tuyến</h1>
      </div>

      <div className="p-6 space-y-6">
        {submitted ? (
          <div className="text-center py-12 space-y-4">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="text-green-600" size={40} />
            </div>
            <h3 className="text-xl font-black text-slate-800">Nộp hồ sơ thành công!</h3>
            <p className="text-slate-600">Mã hồ sơ: <span className="font-bold">HS2026{Math.floor(Math.random() * 1000)}</span></p>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              <label className="text-sm font-bold text-slate-700">Chọn loại dịch vụ</label>
              <select
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                className="w-full h-12 px-4 border border-slate-200 rounded-xl focus:outline-none focus:border-red-500"
              >
                <option value="">-- Chọn dịch vụ --</option>
                {services.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-bold text-slate-700">Tải lên hồ sơ</label>
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Upload className="text-slate-400" size={32} />
                </div>
                <p className="text-sm text-slate-600 mb-2">Kéo thả file hoặc click để chọn</p>
                <p className="text-xs text-slate-400">Hỗ trợ: PDF, JPG, PNG (Max 10MB)</p>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={!selectedService}
              className="w-full h-14 bg-red-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FileUp size={20} />
              Nộp hồ sơ
            </button>
          </>
        )}
      </div>
    </div>
  );
};
