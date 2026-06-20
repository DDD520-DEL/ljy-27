import React, { useState } from 'react';
import { X, Flag, AlertTriangle } from 'lucide-react';
import type { ReportReason } from '../../types/bench';
import { REPORT_REASON_LABELS } from '../../types/bench';
import { useBenchStore } from '../../store/useBenchStore';
import { useUserStore } from '../../store/useUserStore';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  benchId: string;
  benchName: string;
  photoIndex?: number;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  benchId,
  benchName,
  photoIndex,
}) => {
  const [selectedReason, setSelectedReason] = useState<ReportReason | null>(null);
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { addReport } = useBenchStore();
  const { user } = useUserStore();

  const handleSubmit = () => {
    if (!selectedReason || !user) return;

    setSubmitting(true);

    setTimeout(() => {
      addReport({
        benchId,
        benchName,
        photoIndex,
        reason: selectedReason,
        description,
        reporter: user.nickname,
      });

      setSubmitting(false);
      setSubmitted(true);

      setTimeout(() => {
        setSubmitted(false);
        setSelectedReason(null);
        setDescription('');
        onClose();
      }, 1500);
    }, 500);
  };

  const handleClose = () => {
    setSelectedReason(null);
    setDescription('');
    setSubmitted(false);
    onClose();
  };

  if (!isOpen) return null;

  const reasons: ReportReason[] = [
    'inappropriate_photo',
    'false_information',
    'duplicate',
    'commercial_spam',
    'other',
  ];

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-[#F8F5F0] rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden">
        <div className="p-5 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flag size={20} className="text-red-500" />
              <h3 className="text-lg font-bold text-gray-800">
                {photoIndex !== undefined ? '举报照片' : '举报内容'}
              </h3>
            </div>
            <button
              onClick={handleClose}
              className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {submitted ? (
          <div className="p-10 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={32} className="text-emerald-600" />
            </div>
            <h3 className="font-bold text-gray-800 mb-2">举报已提交</h3>
            <p className="text-sm text-gray-500">感谢您的反馈，我们会尽快处理</p>
          </div>
        ) : (
          <div className="p-5 space-y-4 max-h-[60vh] overflow-y-auto">
            <div>
              <p className="text-sm text-gray-600 mb-3">
                正在举报：<span className="font-medium text-gray-800">{benchName}</span>
                {photoIndex !== undefined && (
                  <span className="text-gray-500">（第 {photoIndex + 1} 张照片）</span>
                )}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                举报原因 <span className="text-red-500">*</span>
              </label>
              <div className="space-y-2">
                {reasons.map((reason) => (
                  <button
                    key={reason}
                    onClick={() => setSelectedReason(reason)}
                    className={`w-full p-3 rounded-xl text-left text-sm transition-all ${
                      selectedReason === reason
                        ? 'bg-red-50 border-2 border-red-500 text-red-700'
                        : 'bg-white border-2 border-gray-100 text-gray-700 hover:border-gray-200'
                    }`}
                  >
                    {REPORT_REASON_LABELS[reason]}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                补充说明
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="请描述具体问题（选填）"
                rows={3}
                className="w-full px-3 py-2.5 rounded-xl bg-white border border-gray-200 text-sm text-gray-700 outline-none focus:border-emerald-400 resize-none"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={handleClose}
                className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-600 font-medium text-sm hover:bg-gray-200 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleSubmit}
                disabled={!selectedReason || submitting}
                className={`flex-1 py-3 rounded-xl font-medium text-sm transition-all ${
                  selectedReason && !submitting
                    ? 'bg-red-500 text-white hover:bg-red-600'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                {submitting ? '提交中...' : '提交举报'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
