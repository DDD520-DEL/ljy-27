import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  BookOpen,
  Mountain,
  TreePine,
  Sparkles,
  Shield,
  Sun,
  Snowflake,
  Droplets,
  Wrench,
  Clock,
  MapPin,
  Heart,
} from 'lucide-react';
import type { BenchType } from '../types/bench';

interface BenchTypeInfo {
  type: BenchType;
  name: string;
  icon: React.ReactNode;
  gradient: string;
  bgColor: string;
  accentColor: string;
  materialFeel: string;
  commonLocations: string[];
  comfortTendency: {
    label: string;
    range: string;
    color: string;
    description: string;
  };
  maintenance: {
    label: string;
    range: string;
    color: string;
    description: string;
  };
  durability: {
    label: string;
    range: string;
    color: string;
    description: string;
  };
  seasonalNote: string;
  tips: string[];
}

const benchTypesData: BenchTypeInfo[] = [
  {
    type: 'stone',
    name: '石凳',
    icon: <Mountain size={36} className="text-white" />,
    gradient: 'from-stone-500 to-amber-700',
    bgColor: 'bg-stone-50 dark:bg-stone-900/30',
    accentColor: 'text-stone-700 dark:text-stone-400',
    materialFeel: '坚硬冰冷，表面光滑或带有天然纹理。夏季凉爽宜人，冬季则寒气较重，久坐需铺垫。',
    commonLocations: ['公园主步道旁', '历史景点区域', '寺庙园林', '城市广场中心'],
    comfortTendency: {
      label: '舒适度评分',
      range: '2.0 - 3.5',
      color: 'text-amber-600 dark:text-amber-500',
      description: '坐感偏硬，缺少缓冲支撑。短时间歇脚尚可，长时间休憩易感不适。体型宽大的石凳可容纳多人，适合与朋友闲聊。',
    },
    maintenance: {
      label: '养护难度',
      range: '低',
      color: 'text-emerald-600 dark:text-emerald-500',
      description: '耐候性极强，风吹日晒雨淋皆不惧。几乎无需日常维护，仅需定期清理灰尘和落叶。使用寿命可达数十年。',
    },
    durability: {
      label: '耐用程度',
      range: '★★★★★',
      color: 'text-emerald-600 dark:text-emerald-500',
      description: '坚固耐用，抗腐蚀、抗老化。不怕日晒雨淋，不易损坏或被盗。唯一的天敌是人为破坏或重物撞击。',
    },
    seasonalNote: '夏季清凉解暑，冬季需隔垫而坐。春秋两季最为适宜，午后阳光晒过的石凳温度适中，体验最佳。',
    tips: [
      '冬天可随身携带便携坐垫',
      '选择向阳位置的石凳，温度更舒适',
      '注意表面是否有裂纹和尖锐边角',
    ],
  },
  {
    type: 'wood',
    name: '木椅',
    icon: <TreePine size={36} className="text-white" />,
    gradient: 'from-amber-600 to-yellow-800',
    bgColor: 'bg-amber-50 dark:bg-amber-900/30',
    accentColor: 'text-amber-700 dark:text-amber-400',
    materialFeel: '温润自然，木纹触感舒适。有恰到好处的弹性，坐感柔和不生硬，能与人体曲线较好贴合。',
    commonLocations: ['公园林荫步道', '湖畔亭台', '社区休闲区', '校园操场边'],
    comfortTendency: {
      label: '舒适度评分',
      range: '3.5 - 4.8',
      color: 'text-emerald-600 dark:text-emerald-500',
      description: '公认的最佳坐感！木质材料温度适中，冬不冰夏不烫。带靠背设计的木椅更能提供腰背支撑，久坐不累。',
    },
    maintenance: {
      label: '养护难度',
      range: '中',
      color: 'text-amber-600 dark:text-amber-500',
      description: '需要定期刷漆/防腐处理以延长寿命。注意防水防潮，长期积水会导致腐烂霉变。好的松木、柚木自然耐腐性较好。',
    },
    durability: {
      label: '耐用程度',
      range: '★★★☆☆',
      color: 'text-amber-600 dark:text-amber-500',
      description: '正常维护下可用10-20年。木材易受虫蛀、潮湿影响而老化。定期刷油保养可显著延长使用寿命。',
    },
    seasonalNote: '四季皆宜的经典选择。温度随环境变化温和，不会像金属那样暴晒后烫手，也不像石材那样冰寒刺骨。',
    tips: [
      '优先选择带靠背和扶手的款式',
      '雨天后检查椅面是否干燥',
      '留意是否有木刺、铁钉外露',
    ],
  },
  {
    type: 'other',
    name: '其他材质',
    icon: <Sparkles size={36} className="text-white" />,
    gradient: 'from-sky-500 to-indigo-600',
    bgColor: 'bg-sky-50 dark:bg-sky-900/30',
    accentColor: 'text-sky-700 dark:text-sky-400',
    materialFeel: '包罗万象：金属的现代感、塑料的轻便、藤编的透气、混凝土的粗犷、复合材料的创新。各有千秋。',
    commonLocations: ['现代艺术公园', '商业综合体', '体育场馆外', '新建景观区'],
    comfortTendency: {
      label: '舒适度评分',
      range: '1.5 - 4.5',
      color: 'text-sky-600 dark:text-sky-500',
      description: '差异悬殊！设计精良的金属+软垫组合舒适度堪比木椅；而裸露的铁皮椅则冬凉夏烫。塑料椅轻便但透气性差。',
    },
    maintenance: {
      label: '养护难度',
      range: '视材质',
      color: 'text-sky-600 dark:text-sky-500',
      description: '金属需防锈、塑料怕暴晒老化、藤编怕潮湿发霉、混凝土免维护但易开裂。新型复合材料通常保养最省心。',
    },
    durability: {
      label: '耐用程度',
      range: '★★★☆☆',
      color: 'text-sky-600 dark:text-sky-500',
      description: '不锈钢和混凝土最耐用，可达数十年。普通塑料椅3-5年会变脆。藤编和布艺需要精心呵护。',
    },
    seasonalNote: '材质决定季节表现。金属和塑料极端温度表现差；藤编透气适合夏季；带软垫的座椅四季舒适但怕雨淋。',
    tips: [
      '金属椅夏日暴晒后先试探温度再坐',
      '塑料椅注意是否有老化变脆迹象',
      '布艺/软垫座椅雨天需擦干再用',
      '创新设计的座椅往往有惊喜体验',
    ],
  },
];

const ScoreBar: React.FC<{ value: number; color: string }> = ({ value, color }) => (
  <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
    <div
      className={`h-full rounded-full transition-all duration-500 ${color}`}
      style={{ width: `${(value / 5) * 100}%` }}
    />
  </div>
);

export const BenchEncyclopediaPage: React.FC = () => {
  const navigate = useNavigate();

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

        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl p-6 mb-8 text-white shadow-lg">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0">
              <BookOpen size={32} />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold mb-1">长椅类型百科</h1>
              <p className="text-emerald-100 text-sm">
                了解不同材质长椅的特点，找到最适合你的歇脚方式
              </p>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-3">
            {benchTypesData.map((info) => (
              <button
                key={info.type}
                onClick={() => {
                  const el = document.getElementById(`bench-card-${info.type}`);
                  el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className="p-3 rounded-xl bg-white/15 hover:bg-white/25 transition-all text-center"
              >
                <div className="text-xs font-medium opacity-90">{info.name}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-8 pb-8">
          {benchTypesData.map((info) => (
            <div
              key={info.type}
              id={`bench-card-${info.type}`}
              className={`rounded-3xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-700 transition-colors duration-300 ${info.bgColor}`}
            >
              <div className={`bg-gradient-to-r ${info.gradient} p-6 text-white`}>
                <div className="flex items-start gap-4">
                  <div className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
                    {info.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-3xl font-bold mb-2">{info.name}</h2>
                    <p className="text-white/90 text-sm leading-relaxed">
                      {info.materialFeel}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-5 md:p-6 space-y-6 bg-white dark:bg-gray-800">
                <div className="flex flex-wrap items-start gap-2">
                  <MapPin size={18} className={`mt-0.5 flex-shrink-0 ${info.accentColor}`} />
                  <div>
                    <div className={`text-xs font-medium mb-1 ${info.accentColor}`}>常见位置</div>
                    <div className="flex flex-wrap gap-2">
                      {info.commonLocations.map((loc) => (
                        <span
                          key={loc}
                          className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                        >
                          {loc}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Heart size={16} className={`${info.accentColor}`} />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {info.comfortTendency.label}
                        </span>
                      </div>
                      <span className={`text-sm font-bold ${info.comfortTendency.color}`}>
                        {info.comfortTendency.range}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mb-2">
                      <ScoreBar value={3.2} color="bg-amber-500" />
                      <ScoreBar value={4.5} color="bg-emerald-500" />
                      <ScoreBar value={3.8} color="bg-sky-500" />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                      {info.comfortTendency.description}
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Wrench size={16} className={`${info.accentColor}`} />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {info.maintenance.label}
                        </span>
                      </div>
                      <span className={`text-sm font-bold ${info.maintenance.color}`}>
                        {info.maintenance.range}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                      {info.maintenance.description}
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Shield size={16} className={`${info.accentColor}`} />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {info.durability.label}
                        </span>
                      </div>
                      <span className={`text-sm font-bold ${info.durability.color}`}>
                        {info.durability.range}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                      {info.durability.description}
                    </p>
                  </div>
                </div>

                <div className={`rounded-2xl p-4 ${info.bgColor} border border-current/10`}>
                  <div className="flex items-start gap-3">
                    <div className="flex gap-1 mt-0.5 flex-shrink-0">
                      <Sun size={16} className="text-amber-500" />
                      <Snowflake size={16} className="text-sky-500" />
                    </div>
                    <div>
                      <div className={`text-xs font-semibold mb-1 ${info.accentColor}`}>季节贴士</div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                        {info.seasonalNote}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <div className={`text-xs font-semibold mb-2 flex items-center gap-1.5 ${info.accentColor}`}>
                    <Droplets size={14} />
                    实用建议
                  </div>
                  <ul className="space-y-2">
                    {info.tips.map((tip, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-400"
                      >
                        <span className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white bg-gradient-to-r ${info.gradient}`}>
                          {i + 1}
                        </span>
                        <span className="pt-0.5 leading-relaxed">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100 dark:border-gray-700">
                  <Clock size={14} className="text-gray-400" />
                  <span className="text-xs text-gray-400 dark:text-gray-500">
                    典型综合评分：{info.comfortTendency.range}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center pb-6">
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 rounded-xl bg-emerald-600 text-white font-medium hover:bg-emerald-700 dark:hover:bg-emerald-500 transition-colors shadow-md inline-flex items-center gap-2"
          >
            <ArrowLeft size={18} />
            返回地图探索长椅
          </button>
        </div>
      </div>
    </div>
  );
};
