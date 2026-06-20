import React, { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  BarChart3,
  Calendar,
  Flame,
  MapPin,
  TrendingUp,
  Footprints,
  Star,
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useBenchStore } from '../store/useBenchStore';
import type { CheckInRecord } from '../types/bench';

const WEEKDAY_LABELS = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

const SCORE_COLORS = ['#2D6A4F', '#52B788', '#F4A261', '#E76F51', '#D62828'];

const PARK_COLORS = [
  '#10B981',
  '#3B82F6',
  '#F59E0B',
  '#EF4444',
  '#8B5CF6',
  '#EC4899',
  '#06B6D4',
  '#84CC16',
  '#F97316',
  '#6366F1',
];

const formatDateKey = (date: Date) => {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
};

export const StatsPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    initBenches,
    initCheckIns,
    getVisibleCheckIns,
    getTotalCheckInDays,
    getStreakDays,
    getTotalCheckInCount,
  } = useBenchStore();

  useEffect(() => {
    initBenches();
    initCheckIns();
  }, [initBenches, initCheckIns]);

  const checkIns = getVisibleCheckIns();
  const totalDays = getTotalCheckInDays();
  const streakDays = getStreakDays();
  const totalCount = getTotalCheckInCount();

  const weeklyData = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const result = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateKey = formatDateKey(date);
      const count = checkIns.filter((c) => {
        const cDate = new Date(c.createdAt);
        return formatDateKey(cDate) === dateKey;
      }).length;
      result.push({
        name: WEEKDAY_LABELS[date.getDay()],
        打卡次数: count,
        date: `${date.getMonth() + 1}/${date.getDate()}`,
      });
    }
    return result;
  }, [checkIns]);

  const monthlyData = useMemo(() => {
    const map: Record<string, number> = {};
    checkIns.forEach((c) => {
      const date = new Date(c.createdAt);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      map[key] = (map[key] || 0) + 1;
    });
    const sorted = Object.entries(map).sort(([a], [b]) => a.localeCompare(b));
    const last12 = sorted.slice(-12);
    return last12.map(([key, count]) => {
      const [year, month] = key.split('-');
      return {
        name: `${year.slice(2)}/${month}`,
        打卡次数: count,
      };
    });
  }, [checkIns]);

  const parkData = useMemo(() => {
    const map: Record<string, number> = {};
    checkIns.forEach((c) => {
      map[c.parkName] = (map[c.parkName] || 0) + 1;
    });
    const entries = Object.entries(map).sort((a, b) => b[1] - a[1]);
    return entries.slice(0, 10).map(([name, value], index) => ({
      name: name.length > 8 ? name.slice(0, 8) + '...' : name,
      fullName: name,
      value,
      color: PARK_COLORS[index % PARK_COLORS.length],
    }));
  }, [checkIns]);

  const scoreData = useMemo(() => {
    const buckets = [0, 0, 0, 0, 0];
    checkIns.forEach((c: CheckInRecord) => {
      const score = c.overallScore;
      if (score >= 4.5) buckets[0]++;
      else if (score >= 3.5) buckets[1]++;
      else if (score >= 2.5) buckets[2]++;
      else if (score >= 1.5) buckets[3]++;
      else buckets[4]++;
    });
    const labels = ['绝佳(≥4.5)', '舒适(≥3.5)', '一般(≥2.5)', '较差(≥1.5)', '不推荐(<1.5)'];
    return buckets
      .map((value, index) => ({
        name: labels[index],
        value,
        color: SCORE_COLORS[index],
      }))
      .filter((item) => item.value > 0);
  }, [checkIns]);

  const hasData = checkIns.length > 0;

  return (
    <div className="min-h-screen bg-[#F8F5F0] dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-5xl mx-auto p-4 md:p-6">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors mb-4"
        >
          <ArrowLeft size={20} />
          <span className="font-medium">返回地图</span>
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
            <BarChart3 size={26} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">数据统计</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">查看你的打卡数据和趋势分析</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-300">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
                <Calendar size={20} className="text-emerald-600 dark:text-emerald-400" />
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">累计打卡天数</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold text-emerald-600 dark:text-emerald-400">
                {totalDays}
              </span>
              <span className="text-sm text-gray-400 dark:text-gray-500">天</span>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-300">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-900/50 flex items-center justify-center">
                <Flame size={20} className="text-orange-600 dark:text-orange-400" />
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">连续打卡</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold text-orange-600 dark:text-orange-400">
                {streakDays}
              </span>
              <span className="text-sm text-gray-400 dark:text-gray-500">天</span>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-300">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-900/50 flex items-center justify-center">
                <Footprints size={20} className="text-teal-600 dark:text-teal-400" />
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">总打卡次数</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold text-teal-600 dark:text-teal-400">
                {totalCount}
              </span>
              <span className="text-sm text-gray-400 dark:text-gray-500">次</span>
            </div>
          </div>
        </div>

        {!hasData ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-300">
            <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center mx-auto mb-4">
              <BarChart3 size={40} className="text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2">
              暂无统计数据
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">快去打卡记录你的第一个歇脚点吧</p>
            <button
              onClick={() => navigate('/add')}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-medium hover:bg-emerald-700 dark:hover:bg-emerald-500 transition-colors"
            >
              去打卡
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-300">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp size={20} className="text-emerald-600 dark:text-emerald-400" />
                <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">本周打卡趋势</h2>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={weeklyData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis
                      dataKey="name"
                      tick={{ fill: '#6B7280', fontSize: 12 }}
                      axisLine={{ stroke: '#E5E7EB' }}
                    />
                    <YAxis
                      tick={{ fill: '#6B7280', fontSize: 12 }}
                      axisLine={{ stroke: '#E5E7EB' }}
                      allowDecimals={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #E5E7EB',
                        borderRadius: '12px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="打卡次数"
                      stroke="#10B981"
                      strokeWidth={3}
                      dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, fill: '#059669' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-300">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 size={20} className="text-blue-600 dark:text-blue-400" />
                <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">每月打卡统计</h2>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis
                      dataKey="name"
                      tick={{ fill: '#6B7280', fontSize: 12 }}
                      axisLine={{ stroke: '#E5E7EB' }}
                    />
                    <YAxis
                      tick={{ fill: '#6B7280', fontSize: 12 }}
                      axisLine={{ stroke: '#E5E7EB' }}
                      allowDecimals={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #E5E7EB',
                        borderRadius: '12px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      }}
                    />
                    <Bar dataKey="打卡次数" fill="#3B82F6" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-300">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin size={20} className="text-purple-600 dark:text-purple-400" />
                  <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">打卡公园分布</h2>
                </div>
                {parkData.length > 0 ? (
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <Pie
                          data={parkData}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={80}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {parkData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#fff',
                            border: '1px solid #E5E7EB',
                            borderRadius: '12px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                          }}
                          formatter={(value: number, name: string) => {
                            const item = parkData.find((p) => p.name === name);
                            return [`${value}次`, item?.fullName || name];
                          }}
                        />
                        <Legend
                          verticalAlign="bottom"
                          height={36}
                          formatter={(value) => {
                            const item = parkData.find((p) => p.name === value);
                            return (
                              <span className="text-sm text-gray-600 dark:text-gray-300">
                                {item?.fullName || value}
                              </span>
                            );
                          }}
                        />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="h-64 flex items-center justify-center text-gray-400 dark:text-gray-500">
                    暂无数据
                  </div>
                )}
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-300">
                <div className="flex items-center gap-2 mb-4">
                  <Star size={20} className="text-amber-500 dark:text-amber-400" />
                  <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">评分分布</h2>
                </div>
                {scoreData.length > 0 ? (
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <Pie
                          data={scoreData}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={80}
                          paddingAngle={2}
                          dataKey="value"
                          label={({ name, percent }) =>
                            `${name} ${(percent * 100).toFixed(0)}%`
                          }
                          labelLine={false}
                        >
                          {scoreData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#fff',
                            border: '1px solid #E5E7EB',
                            borderRadius: '12px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                          }}
                          formatter={(value: number) => [`${value}次`, '打卡次数']}
                        />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="h-64 flex items-center justify-center text-gray-400 dark:text-gray-500">
                    暂无数据
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
