import React, { useState, useRef, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, MapPin, Eye, Filter, CheckCircle, HelpCircle } from 'lucide-react';
import { setOnboardingCompleted } from '../../utils/storage';

interface OnboardingStep {
  id: number;
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient: string;
  bgColor: string;
}

interface OnboardingGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

const STEPS: OnboardingStep[] = [
  {
    id: 1,
    icon: <MapPin size={48} className="text-white" />,
    title: '地图选点',
    description: '点击地图上的彩色标记，即可快速定位附近的公园长椅，发现身边舒适的歇脚点。',
    gradient: 'from-emerald-500 to-teal-600',
    bgColor: 'bg-emerald-50 dark:bg-emerald-900/20',
  },
  {
    id: 2,
    icon: <Eye size={48} className="text-white" />,
    title: '查看详情',
    description: '点选长椅后可查看详细信息，包括实景照片、舒适评分、遮阴情况及其他用户的真实评价。',
    gradient: 'from-sky-500 to-blue-600',
    bgColor: 'bg-sky-50 dark:bg-sky-900/20',
  },
  {
    id: 3,
    icon: <Filter size={48} className="text-white" />,
    title: '筛选长椅',
    description: '使用顶部筛选功能，按材质类型、综合评分、打卡热度等条件快速找到最适合你的那一张长椅。',
    gradient: 'from-amber-500 to-orange-600',
    bgColor: 'bg-amber-50 dark:bg-amber-900/20',
  },
  {
    id: 4,
    icon: <CheckCircle size={48} className="text-white" />,
    title: '添加打卡',
    description: '遇到喜欢的长椅？点击右上角「打卡」按钮，记录你的足迹，分享真实体验，帮助更多人找到好位置。',
    gradient: 'from-rose-500 to-pink-600',
    bgColor: 'bg-rose-50 dark:bg-rose-900/20',
  },
];

export const OnboardingGuide: React.FC<OnboardingGuideProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [dragStartX, setDragStartX] = useState<number | null>(null);
  const [dragOffsetX, setDragOffsetX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
    }
  }, [isOpen]);

  const goToPrev = useCallback(() => {
    setCurrentStep((prev) => Math.max(0, prev - 1));
  }, []);

  const goToNext = useCallback(() => {
    setCurrentStep((prev) => {
      if (prev >= STEPS.length - 1) {
        setOnboardingCompleted();
        onClose();
        return prev;
      }
      return prev + 1;
    });
  }, [onClose]);

  const handleSkip = useCallback(() => {
    setOnboardingCompleted();
    onClose();
  }, [onClose]);

  const handleDragStart = useCallback((clientX: number) => {
    setDragStartX(clientX);
    setIsDragging(true);
  }, []);

  const handleDragMove = useCallback(
    (clientX: number) => {
      if (dragStartX === null || !isDragging) return;
      const diff = clientX - dragStartX;
      setDragOffsetX(diff);
    },
    [dragStartX, isDragging]
  );

  const handleDragEnd = useCallback(() => {
    if (!isDragging) return;
    const threshold = 60;
    if (dragOffsetX > threshold && currentStep > 0) {
      goToPrev();
    } else if (dragOffsetX < -threshold && currentStep < STEPS.length - 1) {
      goToNext();
    }
    setDragStartX(null);
    setDragOffsetX(0);
    setIsDragging(false);
  }, [dragOffsetX, currentStep, isDragging, goToPrev, goToNext]);

  const onMouseDown = (e: React.MouseEvent) => {
    handleDragStart(e.clientX);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    handleDragMove(e.clientX);
  };

  const onMouseUp = () => {
    handleDragEnd();
  };

  const onMouseLeave = () => {
    handleDragEnd();
  };

  const onTouchStart = (e: React.TouchEvent) => {
    handleDragStart(e.touches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    handleDragMove(e.touches[0].clientX);
  };

  const onTouchEnd = () => {
    handleDragEnd();
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'ArrowLeft') goToPrev();
      if (e.key === 'ArrowRight') goToNext();
      if (e.key === 'Escape') handleSkip();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, goToPrev, goToNext, handleSkip]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleSkip} />

      <div className="relative w-full max-w-md">
        <button
          onClick={handleSkip}
          className="absolute -top-2 -right-2 z-10 w-9 h-9 rounded-full bg-white dark:bg-gray-700 shadow-lg flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
          aria-label="关闭"
        >
          <X size={20} />
        </button>

        <div
          ref={containerRef}
          className="bg-[#F8F5F0] dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden transition-colors duration-300 select-none"
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseLeave}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
        >
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-300 ease-out"
              style={{
                transform: `translateX(calc(${-currentStep * 100}% + ${dragOffsetX}px))`,
                transitionDuration: isDragging ? '0ms' : '300ms',
              }}
            >
              {STEPS.map((step, index) => (
                <div
                  key={step.id}
                  className="min-w-full px-6 pt-8 pb-6"
                  style={{ touchAction: 'pan-y' }}
                >
                  <div
                    className={`w-24 h-24 rounded-3xl bg-gradient-to-br ${step.gradient} flex items-center justify-center mx-auto mb-6 shadow-lg`}
                  >
                    {step.icon}
                  </div>

                  <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-100 mb-3">
                    {step.title}
                  </h2>
                  <p className="text-sm leading-relaxed text-center text-gray-600 dark:text-gray-300 mb-6">
                    {step.description}
                  </p>

                  <div className="flex justify-center gap-2 mb-6">
                    {STEPS.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentStep(i)}
                        className={`h-2 rounded-full transition-all duration-300 ${
                          i === index
                            ? `w-8 bg-gradient-to-r ${step.gradient}`
                            : 'w-2 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                        }`}
                        aria-label={`跳转到第 ${i + 1} 步`}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="px-6 pb-6 flex items-center gap-3">
            <button
              onClick={goToPrev}
              disabled={currentStep === 0}
              className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all ${
                currentStep === 0
                  ? 'bg-gray-100 dark:bg-gray-700 text-gray-300 dark:text-gray-600 cursor-not-allowed'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
              aria-label="上一步"
            >
              <ChevronLeft size={22} />
            </button>

            <button
              onClick={handleSkip}
              className="flex-1 py-3 rounded-xl font-medium text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              跳过
            </button>

            <button
              onClick={goToNext}
              className={`flex-1 py-3 rounded-xl font-medium text-sm text-white shadow-md transition-all ${
                currentStep === STEPS.length - 1
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 dark:hover:from-emerald-400 dark:hover:to-teal-500'
                  : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 dark:hover:from-emerald-400 dark:hover:to-teal-500'
              }`}
            >
              {currentStep === STEPS.length - 1 ? '开始使用' : '下一步'}
            </button>

            <button
              onClick={goToNext}
              disabled={currentStep === STEPS.length - 1}
              className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all ${
                currentStep === STEPS.length - 1
                  ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-400 dark:text-emerald-600 cursor-not-allowed'
                  : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-200 dark:hover:bg-emerald-800/50'
              }`}
              aria-label="下一步"
            >
              <ChevronRight size={22} />
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-white/70 mt-4 select-none">
          左右滑动切换步骤 · 按 ESC 跳过
        </p>
      </div>
    </div>
  );
};

interface HelpButtonProps {
  onClick: () => void;
}

export const HelpButton: React.FC<HelpButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="w-12 h-12 rounded-full bg-white dark:bg-gray-800 shadow-lg flex items-center justify-center text-emerald-600 dark:text-emerald-400 hover:shadow-xl hover:scale-105 transition-all"
      title="使用帮助"
      aria-label="使用帮助"
    >
      <HelpCircle size={22} />
    </button>
  );
};
