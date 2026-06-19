import React, { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';
import { MapView } from '../components/Map/MapView';
import { AddBenchForm } from '../components/AddBench/AddBenchForm';
import { useBenchStore } from '../store/useBenchStore';

export const AddBenchPage: React.FC = () => {
  const benches = useBenchStore((state) => state.benches);
  const [selectedLat, setSelectedLat] = useState<number | null>(null);
  const [selectedLng, setSelectedLng] = useState<number | null>(null);

  const handleMapClick = (lat: number, lng: number) => {
    setSelectedLat(lat);
    setSelectedLng(lng);
  };

  const tempBenches =
    selectedLat !== null && selectedLng !== null
      ? [
          ...benches,
          {
            id: 'temp-marker',
            lat: selectedLat,
            lng: selectedLng,
            parkName: '新位置',
            locationDesc: '',
            benchType: 'stone' as const,
            comfortScore: 0,
            shadeScore: 0,
            viewScore: 0,
            overallScore: 0,
            photos: [],
            note: '',
            createdAt: '',
            checkinCount: 0,
          },
        ]
      : benches;

  return (
    <div className="min-h-screen bg-[#F8F5F0]">
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
              <MapPin size={26} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">打卡新长椅</h1>
              <p className="text-sm text-gray-500">分享你发现的舒适歇脚点</p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="order-2 md:order-1">
            <AddBenchForm selectedLat={selectedLat} selectedLng={selectedLng} />
          </div>

          <div className="order-1 md:order-2">
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 sticky top-4">
              <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                <MapPin size={18} className="text-emerald-600" />
                选择位置
              </h3>
              <p className="text-sm text-gray-500 mb-3">
                在地图上点击选择长椅的位置
              </p>
              <div className="h-[400px] rounded-xl overflow-hidden">
                <MapView
                  benches={tempBenches}
                  selectedBenchId={
                    selectedLat !== null ? 'temp-marker' : null
                  }
                  onBenchClick={() => {}}
                  onMapClick={handleMapClick}
                  center={[39.9339, 116.4044]}
                  zoom={12}
                  interactive={true}
                />
              </div>
              {selectedLat !== null && selectedLng !== null && (
                <div className="mt-3 p-3 bg-emerald-50 rounded-xl text-sm text-emerald-700">
                  ✓ 已选择位置，继续填写信息吧
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
