import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sofa, Trees, Eye, MapPin, Send, ArrowLeft } from 'lucide-react';
import { RatingStars } from './RatingStars';
import { PhotoUploader } from './PhotoUploader';
import type { BenchType, BenchTag, NewBenchData } from '../../types/bench';
import { BENCH_TAG_LABELS } from '../../types/bench';
import { useBenchStore } from '../../store/useBenchStore';
import { getBenchTypeLabel } from '../../utils/score';

interface AddBenchFormProps {
  selectedLat: number | null;
  selectedLng: number | null;
}

const benchTypes: BenchType[] = ['stone', 'wood', 'other'];
const benchTags: BenchTag[] = ['reading', 'daydreaming', 'dating', 'pet_friendly', 'accessible'];

const scoreLabels: Record<string, string[]> = {
  comfort: ['硌屁股', '有点硬', '一般', '舒服', '超舒服'],
  shade: ['完全暴晒', '有点晒', '一般', '挺阴凉', '完美遮阴'],
  view: ['没什么看的', '一般', '还行', '不错', '绝美风景'],
};

export const AddBenchForm: React.FC<AddBenchFormProps> = ({
  selectedLat,
  selectedLng,
}) => {
  const navigate = useNavigate();
  const addBench = useBenchStore((state) => state.addBench);

  const [parkName, setParkName] = useState('');
  const [locationDesc, setLocationDesc] = useState('');
  const [benchType, setBenchType] = useState<BenchType>('stone');
  const [tags, setTags] = useState<BenchTag[]>([]);
  const [comfortScore, setComfortScore] = useState(3);
  const [shadeScore, setShadeScore] = useState(3);
  const [viewScore, setViewScore] = useState(3);
  const [photos, setPhotos] = useState<string[]>([]);
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleTagToggle = (tag: BenchTag) => {
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const canSubmit =
    parkName.trim() !== '' &&
    locationDesc.trim() !== '' &&
    selectedLat !== null &&
    selectedLng !== null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || submitting) return;

    setSubmitting(true);

    const data: NewBenchData = {
      lat: selectedLat!,
      lng: selectedLng!,
      parkName: parkName.trim(),
      locationDesc: locationDesc.trim(),
      benchType,
      tags,
      comfortScore,
      shadeScore,
      viewScore,
      photos,
      note: note.trim(),
    };

    addBench(data);

    setTimeout(() => {
      navigate('/');
    }, 500);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <button
        type="button"
        onClick={() => navigate('/')}
        className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
      >
        <ArrowLeft size={20} />
        <span className="font-medium">返回地图</span>
      </button>

      <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-300">
        <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
          <MapPin size={18} className="text-emerald-600 dark:text-emerald-500" />
          位置信息
        </h3>

        {selectedLat !== null && selectedLng !== null ? (
          <div className="mb-4 p-3 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl text-sm text-emerald-700 dark:text-emerald-400">
            ✓ 已选择位置：{selectedLat.toFixed(4)}, {selectedLng.toFixed(4)}
          </div>
        ) : (
          <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-900/30 rounded-xl text-sm text-amber-700 dark:text-amber-400">
            请在地图上点击选择长椅位置
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              公园名称 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={parkName}
              onChange={(e) => setParkName(e.target.value)}
              placeholder="例如：朝阳公园"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:border-emerald-500 dark:focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 dark:focus:ring-emerald-900/50 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              具体位置 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={locationDesc}
              onChange={(e) => setLocationDesc(e.target.value)}
              placeholder="例如：南门草坪旁、湖边凉亭下"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:border-emerald-500 dark:focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 dark:focus:ring-emerald-900/50 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              长椅类型
            </label>
            <div className="flex flex-wrap gap-2">
              {benchTypes.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setBenchType(type)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    benchType === type
                      ? 'bg-emerald-600 dark:bg-emerald-500 text-white shadow-md'
                      : 'bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:border-emerald-300 dark:hover:border-emerald-500'
                  }`}
                >
                  {getBenchTypeLabel(type)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              特色标签
            </label>
            <div className="flex flex-wrap gap-2">
              {benchTags.map((tag) => {
                const isSelected = tags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleTagToggle(tag)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                      isSelected
                        ? 'bg-emerald-600 dark:bg-emerald-500 text-white shadow-md'
                        : 'bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:border-emerald-300 dark:hover:border-emerald-500'
                    }`}
                  >
                    {BENCH_TAG_LABELS[tag]}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-300">
        <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-4">舒适度评分</h3>
        <div className="space-y-5">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Sofa size={18} className="text-emerald-600 dark:text-emerald-500" />
                <span className="font-medium text-gray-700 dark:text-gray-300">坐感舒适度</span>
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {scoreLabels.comfort[comfortScore - 1]}
              </span>
            </div>
            <RatingStars
              score={comfortScore}
              size={28}
              interactive
              onChange={setComfortScore}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Trees size={18} className="text-green-500 dark:text-green-400" />
                <span className="font-medium text-gray-700 dark:text-gray-300">遮阴效果</span>
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {scoreLabels.shade[shadeScore - 1]}
              </span>
            </div>
            <RatingStars
              score={shadeScore}
              size={28}
              interactive
              onChange={setShadeScore}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Eye size={18} className="text-amber-500 dark:text-amber-400" />
                <span className="font-medium text-gray-700 dark:text-gray-300">视野好坏</span>
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {scoreLabels.view[viewScore - 1]}
              </span>
            </div>
            <RatingStars
              score={viewScore}
              size={28}
              interactive
              onChange={setViewScore}
            />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-300">
        <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-4">照片上传</h3>
        <PhotoUploader photos={photos} onChange={setPhotos} />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-300">
        <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-3">补充说明</h3>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="分享一下这个长椅的特别之处吧..."
          rows={3}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:border-emerald-500 dark:focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 dark:focus:ring-emerald-900/50 outline-none transition-all resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={!canSubmit || submitting}
        className={`w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all transition-colors duration-300 ${
          canSubmit && !submitting
            ? 'bg-emerald-600 dark:bg-emerald-500 text-white hover:bg-emerald-700 dark:hover:bg-emerald-400 shadow-lg hover:shadow-xl'
            : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
        }`}
      >
        <Send size={20} />
        {submitting ? '提交中...' : '提交打卡'}
      </button>
    </form>
  );
};
