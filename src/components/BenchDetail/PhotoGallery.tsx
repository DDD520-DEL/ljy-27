import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, X, ZoomIn, Flag, ThumbsUp, ArrowUpDown } from 'lucide-react';
import { ReportModal } from '../Report/ReportModal';
import { useBenchStore } from '../../store/useBenchStore';

type PhotoSortMode = 'likes' | 'time';

interface PhotoGalleryProps {
  photos: string[];
  parkName: string;
  benchId: string;
}

export const PhotoGallery: React.FC<PhotoGalleryProps> = ({ photos, parkName, benchId }) => {
  const [selectedViewIndex, setSelectedViewIndex] = useState<number | null>(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [sortMode, setSortMode] = useState<PhotoSortMode>('time');
  const { togglePhotoLike, getPhotoLikeCount } = useBenchStore();

  const sortedPhotos = useMemo(() => {
    if (sortMode === 'time') {
      return photos.map((photo, index) => ({ photo, originalIndex: index }));
    }
    return photos
      .map((photo, index) => ({ photo, originalIndex: index }))
      .sort((a, b) => getPhotoLikeCount(benchId, b.originalIndex) - getPhotoLikeCount(benchId, a.originalIndex));
  }, [photos, sortMode, benchId, getPhotoLikeCount]);

  const selectedOriginalIndex = selectedViewIndex !== null ? sortedPhotos[selectedViewIndex].originalIndex : null;

  if (photos.length === 0) {
    return (
      <div className="bg-gray-50 rounded-2xl h-48 flex items-center justify-center text-gray-400">
        暂无照片
      </div>
    );
  }

  const showPrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedViewIndex === null) return;
    setSelectedViewIndex((prev) =>
      prev === null ? 0 : (prev - 1 + sortedPhotos.length) % sortedPhotos.length
    );
  };

  const showNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedViewIndex === null) return;
    setSelectedViewIndex((prev) =>
      prev === null ? 0 : (prev + 1) % sortedPhotos.length
    );
  };

  const handleLike = (e: React.MouseEvent, originalIndex: number) => {
    e.stopPropagation();
    togglePhotoLike(benchId, originalIndex);
  };

  return (
    <>
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-gray-800">实景照片</h3>
          {photos.length > 1 && (
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-0.5">
              <button
                onClick={() => setSortMode('time')}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all flex items-center gap-1 ${
                  sortMode === 'time'
                    ? 'bg-white text-emerald-700 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <ArrowUpDown size={12} />
                上传时间
              </button>
              <button
                onClick={() => setSortMode('likes')}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all flex items-center gap-1 ${
                  sortMode === 'likes'
                    ? 'bg-white text-emerald-700 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <ThumbsUp size={12} />
                点赞数
              </button>
            </div>
          )}
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {sortedPhotos.map(({ photo, originalIndex }, viewIndex) => {
            const likeCount = getPhotoLikeCount(benchId, originalIndex);
            return (
              <button
                key={originalIndex}
                onClick={() => setSelectedViewIndex(viewIndex)}
                className="flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden relative group"
              >
                <img
                  src={photo}
                  alt={`${parkName} ${originalIndex + 1}`}
                  className="w-full h-full object-cover transition-transform group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                  <ZoomIn
                    size={20}
                    className="text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                </div>
                <div
                  onClick={(e) => handleLike(e, originalIndex)}
                  className="absolute bottom-1 right-1 flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-black/40 backdrop-blur-sm text-white text-[10px] opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:bg-black/60"
                >
                  <ThumbsUp size={10} />
                  {likeCount > 0 && <span>{likeCount}</span>}
                </div>
                {likeCount > 0 && (
                  <div className="absolute top-1 right-1 flex items-center gap-0.5 px-1 py-0.5 rounded-full bg-black/40 backdrop-blur-sm text-white text-[10px]">
                    <ThumbsUp size={9} />
                    <span>{likeCount}</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {selectedViewIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={() => setSelectedViewIndex(null)}
        >
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (selectedOriginalIndex !== null) {
                  togglePhotoLike(benchId, selectedOriginalIndex);
                }
              }}
              className="flex items-center gap-1.5 h-10 px-4 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
            >
              <ThumbsUp size={18} />
              {selectedOriginalIndex !== null && (
                <span className="text-sm font-medium">
                  {getPhotoLikeCount(benchId, selectedOriginalIndex)}
                </span>
              )}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowReportModal(true);
              }}
              className="w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors"
              title="举报照片"
            >
              <Flag size={20} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedViewIndex(null);
              }}
              className="w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <button
            onClick={showPrev}
            className="absolute left-4 w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors"
          >
            <ChevronLeft size={24} />
          </button>

          <img
            src={sortedPhotos[selectedViewIndex].photo}
            alt={`${parkName} ${selectedOriginalIndex !== null ? selectedOriginalIndex + 1 : ''}`}
            className="max-w-[90vw] max-h-[80vh] object-contain"
          />

          <button
            onClick={showNext}
            className="absolute right-4 w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors"
          >
            <ChevronRight size={24} />
          </button>

          <div className="absolute bottom-6 text-white/70 text-sm">
            {selectedViewIndex + 1} / {sortedPhotos.length}
          </div>
        </div>
      )}

      <ReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        benchId={benchId}
        benchName={parkName}
        photoIndex={selectedOriginalIndex ?? undefined}
      />
    </>
  );
};
