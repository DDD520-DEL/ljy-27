import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Flag,
  AlertTriangle,
  Ban,
  XCircle,
  MapPin,
  Calendar,
  User,
  Eye,
  Ban as UnbanIcon,
} from 'lucide-react';
import { useBenchStore } from '../store/useBenchStore';
import { useUserStore } from '../store/useUserStore';
import { REPORT_REASON_LABELS } from '../types/bench';
import type { Report } from '../types/bench';

export const ReportAdminPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useUserStore();
  const {
    initBenches,
    initReports,
    getPendingReports,
    ignoreReport,
    banBench,
    unbanBench,
    benches,
  } = useBenchStore();

  const [activeTab, setActiveTab] = useState<'pending' | 'all'>('pending');
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    initBenches();
    initReports();
  }, [initBenches, initReports]);

  const pendingReports = getPendingReports();
  const allReports = useBenchStore.getState().reports.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const displayedReports = activeTab === 'pending' ? pendingReports : allReports;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日 ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  const getStatusBadge = (status: Report['status']) => {
    switch (status) {
      case 'pending':
        return (
          <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-700 text-xs font-medium">
            待处理
          </span>
        );
      case 'ignored':
        return (
          <span className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 text-xs font-medium">
            已忽略
          </span>
        );
      case 'resolved':
        return (
          <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-700 text-xs font-medium">
            已处理
          </span>
        );
    }
  };

  const getBenchById = (benchId: string) => {
    return benches.find((b) => b.id === benchId);
  };

  const handleIgnore = (reportId: string) => {
    if (!user) return;
    setProcessingId(reportId);
    setTimeout(() => {
      ignoreReport(reportId, user.nickname);
      setProcessingId(null);
    }, 300);
  };

  const handleBan = (benchId: string, reportId: string) => {
    if (!user) return;
    setProcessingId(reportId);
    setTimeout(() => {
      banBench(benchId, reportId, user.nickname);
      setProcessingId(null);
    }, 300);
  };

  const handleUnban = (benchId: string) => {
    setProcessingId(benchId);
    setTimeout(() => {
      unbanBench(benchId);
      setProcessingId(null);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-[#F8F5F0]">
      <div className="max-w-4xl mx-auto p-4 md:p-6">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-600 hover:text-emerald-600 transition-colors mb-4"
        >
          <ArrowLeft size={20} />
          <span className="font-medium">返回地图</span>
        </button>

        <div className="bg-gradient-to-br from-red-500 to-rose-600 rounded-3xl p-6 mb-6 text-white shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center">
              <Flag size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-bold">举报管理</h1>
              <p className="text-white/80 text-sm">
                处理用户举报的内容问题
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mt-6">
            <div className="bg-white/15 rounded-2xl p-4 text-center backdrop-blur-sm">
              <div className="text-3xl font-bold">{pendingReports.length}</div>
              <div className="text-xs text-white/80 mt-0.5">待处理</div>
            </div>
            <div className="bg-white/15 rounded-2xl p-4 text-center backdrop-blur-sm">
              <div className="text-3xl font-bold">
                {allReports.filter((r) => r.status === 'ignored').length}
              </div>
              <div className="text-xs text-white/80 mt-0.5">已忽略</div>
            </div>
            <div className="bg-white/15 rounded-2xl p-4 text-center backdrop-blur-sm">
              <div className="text-3xl font-bold">
                {benches.filter((b) => b.isBanned).length}
              </div>
              <div className="text-xs text-white/80 mt-0.5">已下架</div>
            </div>
          </div>
        </div>

        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-4 py-2 rounded-xl font-medium text-sm transition-all ${
              activeTab === 'pending'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            待处理 ({pendingReports.length})
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-xl font-medium text-sm transition-all ${
              activeTab === 'all'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            全部 ({allReports.length})
          </button>
        </div>

        {displayedReports.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center shadow-sm border border-gray-100">
            <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-3">
              <AlertTriangle size={32} className="text-emerald-400" />
            </div>
            <h3 className="font-bold text-gray-800 mb-1">
              {activeTab === 'pending' ? '暂无待处理举报' : '暂无举报记录'}
            </h3>
            <p className="text-sm text-gray-500">
              {activeTab === 'pending' ? '所有举报已处理完毕' : '还没有用户提交举报'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {displayedReports.map((report) => {
              const bench = getBenchById(report.benchId);
              return (
                <div
                  key={report.id}
                  className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          report.status === 'pending'
                            ? 'bg-amber-100 text-amber-600'
                            : report.status === 'ignored'
                            ? 'bg-gray-100 text-gray-500'
                            : 'bg-emerald-100 text-emerald-600'
                        }`}
                      >
                        <Flag size={18} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-bold text-gray-800 truncate">
                            {report.benchName}
                          </h3>
                          {getStatusBadge(report.status)}
                        </div>
                        {report.photoIndex !== undefined && (
                          <span className="text-xs text-gray-500">
                            第 {report.photoIndex + 1} 张照片
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="ml-13 space-y-2">
                    <div className="flex items-center gap-4 text-sm text-gray-600 flex-wrap">
                      <span className="flex items-center gap-1">
                        <AlertTriangle size={14} className="text-red-500" />
                        {REPORT_REASON_LABELS[report.reason]}
                      </span>
                      <span className="flex items-center gap-1">
                        <User size={14} />
                        {report.reporter}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar size={14} />
                        {formatDate(report.createdAt)}
                      </span>
                    </div>

                    {report.description && (
                      <p className="text-sm text-gray-600 bg-gray-50 rounded-xl p-3">
                        {report.description}
                      </p>
                    )}

                    {bench && (
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <MapPin size={12} />
                        <span>{bench.locationDesc}</span>
                        {bench.isBanned && (
                          <span className="px-2 py-0.5 rounded bg-red-100 text-red-600 font-medium">
                            已下架
                          </span>
                        )}
                      </div>
                    )}

                    {report.handledAt && (
                      <div className="text-xs text-gray-400">
                      处理时间：{formatDate(report.handledAt)} · 处理人：{report.handledBy}
                    </div>
                    )}

                    {report.status === 'pending' && (
                      <div className="flex gap-2 pt-2">
                        <button
                          onClick={() => handleIgnore(report.id)}
                          disabled={processingId === report.id}
                          className="flex-1 py-2.5 rounded-xl bg-gray-100 text-gray-600 font-medium text-sm hover:bg-gray-200 transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
                        >
                          <XCircle size={16} />
                          {processingId === report.id ? '处理中...' : '忽略'}
                        </button>
                        <button
                          onClick={() => handleBan(report.benchId, report.id)}
                          disabled={processingId === report.id}
                          className="flex-1 py-2.5 rounded-xl bg-red-500 text-white font-medium text-sm hover:bg-red-600 transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
                        >
                          <Ban size={16} />
                          {processingId === report.id ? '处理中...' : '下架长椅'}
                        </button>
                      </div>
                    )}

                    {report.status === 'resolved' && bench?.isBanned && (
                      <div className="pt-2">
                        <button
                          onClick={() => handleUnban(report.benchId)}
                          disabled={processingId === report.benchId}
                          className="w-full py-2.5 rounded-xl bg-emerald-50 text-emerald-700 font-medium text-sm hover:bg-emerald-100 transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
                        >
                          <UnbanIcon size={16} />
                          {processingId === report.benchId ? '处理中...' : '恢复上架'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {benches.filter((b) => b.isBanned).length > 0 && (
          <div className="mt-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Ban size={20} className="text-red-500" />
              已下架的长椅
            </h2>
            <div className="space-y-3">
              {benches
                .filter((b) => b.isBanned)
                .map((bench) => (
                  <div
                    key={bench.id}
                    className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {bench.photos[0] && (
                        <img
                          src={bench.photos[0]}
                          alt={bench.parkName}
                          className="w-14 h-14 rounded-xl object-cover flex-shrink-0"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-800 truncate">
                          {bench.parkName}
                        </h3>
                        <p className="text-xs text-gray-500 truncate">
                          {bench.locationDesc}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleUnban(bench.id)}
                      disabled={processingId === bench.id}
                      className="px-4 py-2 rounded-xl bg-emerald-50 text-emerald-700 font-medium text-sm hover:bg-emerald-100 transition-colors flex items-center gap-1.5 flex-shrink-0 disabled:opacity-50"
                    >
                      <Eye size={16} />
                      {processingId === bench.id ? '...' : '恢复'}
                    </button>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
