import React from 'react';
import { FileText, TrendingUp, Calendar, ArrowRight, Download } from 'lucide-react';

export const WeeklyReport: React.FC = () => {
  const reports = [
    {
      id: 1,
      title: "10월 4주차 주택 시장 동향",
      date: "2023.10.23",
      summary: "서울 주요 지역 아파트 가격 상승세 둔화, 전세 수요는 여전히 강세. 강남 3구 거래량 분석 및 향후 전망.",
      tag: "시장 동향"
    },
    {
      id: 2,
      title: "신규 분양 단지 분석: 판교 vs 광교",
      date: "2023.10.20",
      summary: "수도권 남부 핵심 지역 신규 분양가 비교 분석. 교통 호재와 학군을 중심으로 본 투자 가치 리포트.",
      tag: "분양 분석"
    },
    {
      id: 3,
      title: "금리 인상과 부동산 대출 전략",
      date: "2023.10.15",
      summary: "시중 은행 주택담보대출 금리 현황 및 특례보금자리론 마감 전 체크포인트. 현명한 대출 갈아타기 가이드.",
      tag: "금융/정책"
    }
  ];

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4">
            <FileText className="text-primary" size={32} />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-3">주간 부동산 리포트</h2>
          <p className="text-slate-600">전문가들이 분석한 최신 시장 트렌드와 인사이트를 매주 받아보세요.</p>
        </div>

        <div className="space-y-6">
          {/* Main Featured Report */}
          <div className="bg-white rounded-2xl shadow-lg border border-primary/20 overflow-hidden relative">
            <div className="absolute top-0 right-0 bg-primary text-white text-xs font-bold px-3 py-1 rounded-bl-xl">
              최신
            </div>
            <div className="p-8">
              <div className="flex items-center gap-2 text-primary font-medium mb-3">
                <TrendingUp size={18} />
                <span>금주의 핫 이슈</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">
                2024년 부동산 정책 변화와 투자 지형도
              </h3>
              <p className="text-slate-600 mb-6 leading-relaxed">
                정부의 새로운 주택 공급 대책 발표에 따른 시장 반응과 1기 신도시 재건축 특별법 통과 가능성 분석. 
                변화하는 정책 환경 속에서 실수요자와 투자자가 주목해야 할 핵심 포인트를 정리해 드립니다.
              </p>
              <div className="flex items-center justify-between border-t border-slate-100 pt-6">
                <div className="flex items-center gap-2 text-slate-400 text-sm">
                  <Calendar size={16} />
                  <span>2023.10.27 발행</span>
                </div>
                <button className="flex items-center gap-2 text-primary font-bold hover:text-primary-hover transition-colors">
                  리포트 전체 보기 <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Report List */}
          <div className="grid gap-4">
            {reports.map((report) => (
              <div key={report.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                <div className="flex-grow">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="bg-slate-100 text-slate-600 text-xs font-bold px-2 py-1 rounded-md">
                      {report.tag}
                    </span>
                    <span className="text-slate-400 text-xs flex items-center gap-1">
                      <Calendar size={12} /> {report.date}
                    </span>
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 mb-2">{report.title}</h4>
                  <p className="text-slate-500 text-sm line-clamp-2">{report.summary}</p>
                </div>
                <button className="flex-shrink-0 p-3 text-slate-400 hover:text-primary hover:bg-slate-50 rounded-full transition-all" title="PDF 다운로드">
                  <Download size={20} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Subscribe Banner */}
        <div className="mt-12 bg-slate-900 text-white rounded-2xl p-8 text-center">
          <h3 className="text-xl font-bold mb-3">중요한 정보를 놓치지 마세요</h3>
          <p className="text-slate-300 mb-6 text-sm">주간 리포트가 발행되면 이메일로 알림을 보내드립니다.</p>
          <div className="flex max-w-md mx-auto gap-2">
            <input 
              type="email" 
              placeholder="이메일 주소를 입력하세요" 
              className="flex-grow px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-slate-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
            <button className="px-6 py-3 bg-primary hover:bg-primary-hover rounded-xl font-bold transition-colors">
              구독하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};