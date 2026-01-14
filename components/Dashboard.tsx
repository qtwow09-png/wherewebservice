import React from 'react';
import { 
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend
} from 'recharts';
import { TrendingUp, Home, DollarSign, MapPin } from 'lucide-react';
import { StatCardProps } from '../types';

// Mock Data (Korean Context)
const priceData = [
  { month: '1월', avgPrice: 8.5, premium: 12.0 },
  { month: '2월', avgPrice: 8.6, premium: 12.1 },
  { month: '3월', avgPrice: 8.8, premium: 12.5 },
  { month: '4월', avgPrice: 8.7, premium: 12.4 },
  { month: '5월', avgPrice: 8.9, premium: 12.8 },
  { month: '6월', avgPrice: 9.1, premium: 13.0 },
  { month: '7월', avgPrice: 9.25, premium: 13.4 },
];

const districtPopularity = [
  { name: '강남구', score: 95 },
  { name: '마포구', score: 88 },
  { name: '성동구', score: 92 },
  { name: '용산구', score: 85 },
  { name: '송파구', score: 82 },
];

export const Dashboard: React.FC = () => {
  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h2 className="text-3xl font-bold text-slate-900">시장 분석 인사이트</h2>
          <p className="text-slate-600 mt-2">부동산 시장 트렌드를 실시간으로 분석합니다.</p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard 
            title="평균 거래가 (억)" 
            value="9.25억" 
            trend={5.4} 
            icon={<DollarSign size={24} className="text-white" />} 
          />
          <StatCard 
            title="활성 매물" 
            value="1,240건" 
            trend={-2.1} 
            icon={<Home size={24} className="text-white" />} 
          />
          <StatCard 
            title="핫 플레이스" 
            value="성동구" 
            trend={12.5} 
            icon={<MapPin size={24} className="text-white" />} 
          />
          <StatCard 
            title="시장 지수" 
            value="114.2" 
            trend={0.8} 
            icon={<TrendingUp size={24} className="text-white" />} 
          />
        </div>

        {/* Charts Section */}
        <div className="grid lg:grid-cols-2 gap-8 mb-10">
          {/* Price Trend Chart */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-6">가격 추이 (연초 대비)</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={priceData}>
                  <defs>
                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4c1d95" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#4c1d95" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} unit="억" />
                  <Tooltip 
                    formatter={(value: number) => [`${value}억`, '평균가']}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area type="monotone" dataKey="avgPrice" stroke="#4c1d95" strokeWidth={3} fillOpacity={1} fill="url(#colorPrice)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Popularity Bar Chart */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-6">인기 급상승 지역</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={districtPopularity} layout="vertical" margin={{ left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 14, fontWeight: 500}} width={80} />
                  <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Bar dataKey="score" fill="#8b5cf6" radius={[0, 4, 4, 0]} barSize={32} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Featured Properties Row (Mock) */}
        <div className="mb-10">
          <h3 className="text-lg font-bold text-slate-900 mb-6">주목할 만한 매물</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 group cursor-pointer">
                <div className="h-48 overflow-hidden">
                  <img 
                    src={`https://picsum.photos/seed/estate${i}/800/600`} 
                    alt="Property" 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-slate-900">프리미엄 아파트 {i}</h4>
                    <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-1 rounded-full">인기</span>
                  </div>
                  <p className="text-slate-500 text-sm mb-4">서울시 강남구 삼성동 • 방 3개</p>
                  <div className="flex justify-between items-center">
                    <span className="text-primary font-bold text-lg">25억 5천</span>
                    <button className="text-sm font-medium text-slate-400 hover:text-primary transition-colors">상세보기</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<StatCardProps> = ({ title, value, trend, icon }) => {
  const isPositive = trend >= 0;
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
        <h4 className="text-2xl font-bold text-slate-900">{value}</h4>
        <div className={`flex items-center text-sm font-medium mt-2 ${isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
          {isPositive ? '+' : ''}{trend}%
          <span className="text-slate-400 font-normal ml-1">전월 대비</span>
        </div>
      </div>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg ${isPositive ? 'bg-primary shadow-primary/30' : 'bg-slate-800 shadow-slate-800/30'}`}>
        {icon}
      </div>
    </div>
  );
};