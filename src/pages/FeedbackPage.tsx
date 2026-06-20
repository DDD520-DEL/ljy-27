import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  MessageSquare,
  Lightbulb,
  Bug,
  HelpCircle,
  Camera,
  X,
  CheckCircle,
  Clock,
  Image,
  Send,
  ChevronDown,
  ChevronUp,
  Trash2,
} from 'lucide-react';
import { addFeedback, loadFeedbacks, saveFeedbacks, type FeedbackItem } from '../utils/storage';

type FeedbackType = 'feature' | 'bug' | 'other';

const feedbackTypeOptions: { value: FeedbackType; label: string; icon: React.ReactNode; color: string }[] = [
  { value: 'feature', label: '功能建议', icon: <Lightbulb size={18} />, color: 'emerald' },
  { value: 'bug', label: '问题反馈', icon: <Bug size={18} />, color: 'red' },
  { value: 'other', label: '其他', icon: <HelpCircle size={18} />, color: 'blue' },
];

export const FeedbackPage: React.FC = () => {
  const navigate = useNavigate();
  const [feedbackType, setFeedbackType] = useState<FeedbackType>('feature');
  const [description, setDescription] = useState('');
  const [screenshots, setScreenshots] = useState<string[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [history, setHistory] = useState<FeedbackItem[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setHistory(loadFeedbacks());
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const remaining = 3 - screenshots.length;
    if (remaining <= 0) {
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    const filesToProcess = Array.from(files).slice(0, remaining);

    const readFile = (file: File): Promise<string> => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => resolve(event.target?.result as string);
        reader.onerror = () => reject(new Error('读取文件失败'));
        reader.readAsDataURL(file);
      });
    };

    try {
      const newScreenshots = await Promise.all(filesToProcess.map(readFile));
      setScreenshots((prev) => [...prev, ...newScreenshots]);
    } catch (err) {
      console.error('截图读取失败:', err);
    }

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRemoveScreenshot = (index: number) => {
    setScreenshots((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!description.trim()) return;

    addFeedback({
      type: feedbackType,
      description: description.trim(),
      screenshots,
    });

    setShowSuccess(true);
    setDescription('');
    setScreenshots([]);
    setFeedbackType('feature');
    setHistory(loadFeedbacks());

    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleDeleteFeedback = (id: string) => {
    const updated = history.filter((item) => item.id !== id);
    saveFeedbacks(updated);
    setHistory(updated);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  const getTypeLabel = (type: FeedbackType) => {
    return feedbackTypeOptions.find((o) => o.value === type)?.label ?? '其他';
  };

  const getTypeIcon = (type: FeedbackType) => {
    return feedbackTypeOptions.find((o) => o.value === type)?.icon ?? <HelpCircle size={14} />;
  };

  const getTypeBadgeClass = (type: FeedbackType) => {
    const base = 'inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium';
    switch (type) {
      case 'feature':
        return `${base} bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400`;
      case 'bug':
        return `${base} bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-400`;
      default:
        return `${base} bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-400`;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F5F0] dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-3xl mx-auto p-4 md:p-6">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors mb-4"
        >
          <ArrowLeft size={20} />
          <span className="font-medium">返回地图</span>
        </button>

        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl p-6 mb-6 text-white shadow-lg">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0">
              <MessageSquare size={32} />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold">反馈与建议</h1>
              <p className="text-emerald-100 text-sm mt-1">您的反馈是我们改进的动力</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 mb-6 transition-colors duration-300">
          <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
            <Send size={20} className="text-emerald-600 dark:text-emerald-400" />
            提交反馈
          </h2>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                反馈类型 <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-3">
                {feedbackTypeOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setFeedbackType(option.value)}
                    className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all ${
                      feedbackType === option.value
                        ? option.value === 'feature'
                          ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                          : option.value === 'bug'
                          ? 'border-red-500 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                          : 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                        : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-500'
                    }`}
                  >
                    {option.icon}
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                详细描述 <span className="text-red-500">*</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="请详细描述您的建议或遇到的问题..."
                rows={5}
                maxLength={500}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 outline-none focus:border-emerald-500 dark:focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20 transition-all resize-none"
              />
              <div className="flex justify-end mt-1">
                <span className={`text-xs ${description.length > 450 ? 'text-red-500' : 'text-gray-400 dark:text-gray-500'}`}>
                  {description.length}/500
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                截图上传 <span className="text-xs text-gray-400 dark:text-gray-500 font-normal">（可选）</span>
              </label>
              <div className="grid grid-cols-3 gap-3">
                {screenshots.map((photo, index) => (
                  <div
                    key={index}
                    className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700 group"
                  >
                    <img
                      src={photo}
                      alt={`截图 ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveScreenshot(index)}
                      className="absolute top-1.5 right-1.5 w-7 h-7 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
                {screenshots.length < 3 && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="aspect-square rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 flex flex-col items-center justify-center gap-2 text-gray-400 dark:text-gray-500 hover:border-emerald-500 dark:hover:border-emerald-400 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors bg-gray-50 dark:bg-gray-700/50"
                  >
                    <Camera size={28} />
                    <span className="text-xs font-medium">添加截图</span>
                  </button>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                className="hidden"
              />
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                最多上传 3 张截图，支持 JPG、PNG 格式
              </p>
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={!description.trim()}
              className={`w-full py-3.5 rounded-xl font-medium text-base transition-all flex items-center justify-center gap-2 ${
                description.trim()
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700 dark:hover:bg-emerald-500 shadow-lg shadow-emerald-600/25 active:scale-[0.98]'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
              }`}
            >
              <Send size={18} />
              提交反馈
            </button>
          </div>
        </div>

        <div className="mb-6">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="w-full flex items-center justify-between text-lg font-bold text-gray-800 dark:text-gray-100 mb-4"
          >
            <span className="flex items-center gap-2">
              <Clock size={20} className="text-emerald-600 dark:text-emerald-400" />
              提交历史
              {history.length > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400 text-xs font-bold">
                  {history.length}
                </span>
              )}
            </span>
            {showHistory ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>

          {showHistory && (
            <>
              {history.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-10 text-center shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-300">
                  <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mx-auto mb-3">
                    <MessageSquare size={32} className="text-gray-300 dark:text-gray-600" />
                  </div>
                  <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-1">暂无反馈记录</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">提交反馈后将在这里显示</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {history.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors duration-300"
                    >
                      <button
                        onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                        className="w-full p-4 flex items-center gap-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={getTypeBadgeClass(item.type)}>
                              {getTypeIcon(item.type)}
                              {getTypeLabel(item.type)}
                            </span>
                            <span className="text-xs text-gray-400 dark:text-gray-500">
                              {formatDate(item.createdAt)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700 dark:text-gray-300 truncate">
                            {item.description}
                          </p>
                        </div>
                        {expandedId === item.id ? (
                          <ChevronUp size={16} className="text-gray-400 flex-shrink-0" />
                        ) : (
                          <ChevronDown size={16} className="text-gray-400 flex-shrink-0" />
                        )}
                      </button>

                      {expandedId === item.id && (
                        <div className="px-4 pb-4 border-t border-gray-100 dark:border-gray-700">
                          <p className="text-sm text-gray-700 dark:text-gray-300 mt-3 whitespace-pre-wrap">
                            {item.description}
                          </p>
                          {item.screenshots.length > 0 && (
                            <div className="mt-3 grid grid-cols-3 gap-2">
                              {item.screenshots.map((src, idx) => (
                                <div key={idx} className="aspect-square rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700">
                                  <img src={src} alt={`截图 ${idx + 1}`} className="w-full h-full object-cover" />
                                </div>
                              ))}
                            </div>
                          )}
                          <div className="mt-3 flex justify-end">
                            <button
                              onClick={() => handleDeleteFeedback(item.id)}
                              className="flex items-center gap-1 text-xs text-red-500 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                            >
                              <Trash2 size={12} />
                              删除
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {showSuccess && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 animate-bounce">
          <div className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-600 text-white shadow-xl shadow-emerald-600/30">
            <CheckCircle size={20} />
            <span className="font-medium">反馈提交成功，感谢您的贡献！</span>
          </div>
        </div>
      )}
    </div>
  );
};
