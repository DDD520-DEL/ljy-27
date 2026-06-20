import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Info,
  MapPin,
  Trees,
  Code2,
  Mail,
  Github,
  Heart,
  Sofa,
  Tag,
  Layers,
} from 'lucide-react';
import { useBenchStore } from '../store/useBenchStore';

export const AboutPage: React.FC = () => {
  const navigate = useNavigate();
  const { initBenches, getBenchCount, getParkCount } = useBenchStore();

  useEffect(() => {
    initBenches();
  }, [initBenches]);

  const benchCount = getBenchCount();
  const parkCount = getParkCount();

  const techStack = [
    { name: 'React', version: '18.3', icon: '⚛️' },
    { name: 'TypeScript', version: '5.8', icon: '📘' },
    { name: 'Vite', version: '6.3', icon: '⚡' },
    { name: 'Tailwind CSS', version: '3.4', icon: '🎨' },
    { name: 'React Router', version: '7.3', icon: '🧭' },
    { name: 'Zustand', version: '5.0', icon: '🐻' },
    { name: 'Leaflet', version: '1.9', icon: '🗺️' },
    { name: 'Lucide Icons', version: '0.511', icon: '✨' },
  ];

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
              <Info size={32} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl font-bold">遛弯歇脚地图</h1>
                <span className="px-2 py-0.5 rounded-full bg-white/20 text-xs font-medium flex items-center gap-1">
                  <Tag size={10} />
                  v0.0.0
                </span>
              </div>
              <p className="text-emerald-100 text-sm">找到最舒服的公园长椅</p>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Heart size={16} />
              </div>
              <div>
                <h3 className="font-semibold text-sm">应用初衷</h3>
                <p className="text-emerald-50 text-sm mt-0.5">
                  在城市中漫步时，总希望能找到一个舒适的歇脚之处。无论是在公园散步、遛娃还是遛狗，一张合适的长椅能让旅途更加惬意。我们希望通过众包的方式，让每个人都能分享和发现那些隐藏在城市角落里的优质歇脚点。
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                <MapPin size={16} />
              </div>
              <div>
                <h3 className="font-semibold text-sm">应用定位</h3>
                <p className="text-emerald-50 text-sm mt-0.5">
                  一款城市公园长椅地图社区应用，帮助用户发现、评分和分享公园中的优质休息座椅。通过地理位置标记、多维度评分（舒适度、遮阴度、视野）、照片打卡和社交评论，为城市漫步爱好者打造一份实用的歇脚指南。
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2 mb-4">
            <Layers size={20} className="text-emerald-600 dark:text-emerald-400" />
            技术栈
          </h2>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-300">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {techStack.map((tech) => (
                <div
                  key={tech.name}
                  className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 text-center hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition-colors"
                >
                  <div className="text-2xl mb-1">{tech.icon}</div>
                  <div className="font-semibold text-gray-800 dark:text-gray-100 text-sm">
                    {tech.name}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    v{tech.version}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-center gap-1 text-xs text-gray-500 dark:text-gray-400">
              <Code2 size={12} />
              <span>
                构建于 Vite + React + TypeScript，使用 Tailwind CSS 样式系统
              </span>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2 mb-4">
            <Heart size={20} className="text-emerald-600 dark:text-emerald-400" />
            联系开发者
          </h2>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 space-y-3 transition-colors duration-300">
            <div className="flex items-center gap-4 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition-colors">
              <div className="w-11 h-11 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center flex-shrink-0">
                <Mail size={20} className="text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-800 dark:text-gray-100 text-sm">邮箱</div>
                <div className="text-gray-500 dark:text-gray-400 text-sm">support@parkbench-map.dev</div>
              </div>
            </div>
            <div className="flex items-center gap-4 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition-colors">
              <div className="w-11 h-11 rounded-xl bg-gray-800 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                <Github size={20} className="text-white dark:text-gray-200" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-800 dark:text-gray-100 text-sm">GitHub</div>
                <div className="text-gray-500 dark:text-gray-400 text-sm">github.com/parkbench-map</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2 mb-4">
            <Trees size={20} className="text-emerald-600 dark:text-emerald-400" />
            数据统计
          </h2>
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/30 dark:to-teal-900/30 rounded-2xl p-6 border border-emerald-100 dark:border-emerald-800/50 transition-colors duration-300">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 text-center shadow-sm transition-colors duration-300">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/50 dark:to-teal-900/50 flex items-center justify-center mx-auto mb-3">
                  <Sofa size={28} className="text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="text-4xl font-bold text-gray-800 dark:text-gray-100">
                  {benchCount}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">收录长椅总数</div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 text-center shadow-sm transition-colors duration-300">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/50 dark:to-emerald-900/50 flex items-center justify-center mx-auto mb-3">
                  <Trees size={28} className="text-green-600 dark:text-green-400" />
                </div>
                <div className="text-4xl font-bold text-gray-800 dark:text-gray-100">
                  {parkCount}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">覆盖公园数量</div>
              </div>
            </div>
            <div className="mt-5 text-center text-sm text-gray-500 dark:text-gray-400">
              数据持续更新中，欢迎贡献你发现的歇脚点 🌿
            </div>
          </div>
        </div>

        <div className="pb-6 text-center">
          <div className="flex items-center justify-center gap-1 text-xs text-gray-400 dark:text-gray-500">
            <span>Made with</span>
            <Heart size={12} className="text-red-400 dark:text-red-500" fill="currentColor" />
            <span>by Park Bench Team</span>
          </div>
          <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            © {new Date().getFullYear()} 遛弯歇脚地图. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
};
