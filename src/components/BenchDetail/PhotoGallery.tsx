import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, X, ZoomIn, Flag } from 'lucide-react';
import { ReportModal } from '../Report/ReportModal';

interface PhotoGalleryProps {
  photos: string[];
  parkName: string;
  benchId: string;
}

export const PhotoGallery: React.FC<PhotoGalleryProps> = ({ photos, parkName, benchId }) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [showReportModal, setShowReportModal] = useState(false);

  if (photos.length === 0) {
    return (
      <div className="bg-gray-50 rounded-2xl h-48 flex items-center justify-center text-gray-400">
        暂无照片
      </div>
    );
  }

  const showPrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIndex === null) return;
    setSelectedIndex((prev) =>
      prev === null ? 0 : (prev - 1 + photos.length) % photos.length
    );
  };

  const showNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIndex === null) return;
    setSelectedIndex((prev) =>
      prev === null ? 0 : (prev + 1) % photos.length
    );
  };

  return (
    <>
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-800 mb-3">实景照片</h3>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {photos.map((photo, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className="flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden relative group"
            >
              <img
                src={photo}
                alt={`${parkName} ${index + 1}`}
                className="w-full h-full object-cover transition-transform group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                <ZoomIn
                  size={20}
                  className="text-white opacity-0 group-hover:opacity-100 transition-opacity"
                />
              </div>
            </button>
          ))}
        </div>
      </div>

      {selectedIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={() => setSelectedIndex(null)}
        >
          <div className="absolute top-4 right-4 flex items-center gap-2">
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
                setSelectedIndex(null);
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
            src={photos[selectedIndex]}
            alt={`${parkName} ${selectedIndex + 1}`}
            className="max-w-[90vw] max-h-[80vh] object-contain"
          />

          <button
            onClick={showNext}
            className="absolute right-4 w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors"
          >
            <ChevronRight size={24} />
          </button>

          <div className="absolute bottom-6 text-white/70 text-sm">
            {selectedIndex + 1} / {photos.length}
          </div>
        </div>
      )}

      <ReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        benchId={benchId}
        benchName={parkName}
        photoIndex={selectedIndex ?? undefined}
      />
    </>
  );
};
