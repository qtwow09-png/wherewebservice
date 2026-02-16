import React from 'react';
import { ArrowRight, Search, TrendingUp, ShieldCheck, FileText } from 'lucide-react';
import type { View } from '../types';

interface HeroProps {
  onNavigate: (view: View) => void;
}

export const Hero: React.FC<HeroProps> = ({ onNavigate }) => {
  return (
    <div className="relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-primary-light/30 -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary-light/30 text-primary text-sm font-semibold mb-8">
            <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
            AI 기반 부동산 분석 인텔리전스
          </div>
          
          <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-8 leading-tight">
            당신이 꿈꾸던 곳, <br className="hidden md:block" />
            <span className="text-primary">바로 여기서 찾으세요</span>
          </h1>
          
          <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed keep-all">
            '어디살래'는 첨단 시장 데이터와 개인화된 AI 가이드를 결합하여 
            당신의 다음 보금자리를 위한 가장 현명한 선택을 돕습니다.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => onNavigate('advisor')}
              className="w-full sm:w-auto px-8 py-4 bg-primary text-white rounded-xl font-semibold shadow-lg shadow-primary/30 hover:bg-primary-hover hover:shadow-primary/40 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              스마트 위치 검색 <ArrowRight size={20} />
            </button>
            <button
              onClick={() => onNavigate('magazine')}
              className="w-full sm:w-auto px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-xl font-semibold hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center gap-2"
            >
              투자매거진 <TrendingUp size={20} />
            </button>
            <button
              onClick={() => onNavigate('report')}
              className="w-full sm:w-auto px-8 py-4 bg-slate-100 text-slate-700 border border-slate-200 rounded-xl font-semibold hover:bg-slate-200 hover:border-slate-300 transition-all flex items-center justify-center gap-2"
            >
              주간 리포트 <FileText size={20} />
            </button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-24">
          <FeatureCard 
            icon={<Search className="text-primary" size={32} />}
            title="스마트 위치 검색"
            description="AI가 당신의 라이프스타일과 예산을 분석하여 생각지 못한 최적의 동네를 제안합니다."
          />
          <FeatureCard 
            icon={<TrendingUp className="text-primary" size={32} />}
            title="데이터 기반 트렌드"
            description="독자적인 시장 지수를 통해 가격 변동, 성장세, 미래 예측을 시각적으로 확인하세요."
          />
          <FeatureCard 
            icon={<ShieldCheck className="text-primary" size={32} />}
            title="신뢰할 수 있는 인사이트"
            description="검증된 데이터 소스만을 사용하여 투자를 위한 가장 정확한 정보를 제공합니다."
          />
        </div>
      </div>
    </div>
  );
};

const FeatureCard: React.FC<{ icon: React.ReactNode, title: string, description: string }> = ({ icon, title, description }) => (
  <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
    <div className="mb-6 bg-primary-light/20 w-16 h-16 rounded-xl flex items-center justify-center">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
    <p className="text-slate-600 leading-relaxed keep-all">{description}</p>
  </div>
);