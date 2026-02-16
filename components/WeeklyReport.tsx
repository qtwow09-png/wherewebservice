import React, { useState, useEffect } from 'react';
import { FileText, TrendingUp, Calendar, ArrowRight, ArrowLeft, X } from 'lucide-react';

interface Report {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  summary: string;
  tag: string;
  fileName: string;
  highlights: {
    policyDirection: string;
    marketSentiment: string;
    outlook: string;
  };
  keyMetrics: {
    buyerIndex?: number;
    jeonseIndex?: number;
    weeklyChange: string;
    totalListings?: number;
    avgPrice?: string;
  };
  featured: boolean;
  special?: string;
}

interface ReportsData {
  reports: Report[];
  nextPublishDate: string;
  publishDay: string;
}

export const WeeklyReport: React.FC = () => {
  const [reportsData, setReportsData] = useState<ReportsData | null>(null);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      const response = await fetch('/reports/reports.json');
      const data = await response.json();
      setReportsData(data);
    } catch (error) {
      console.error('리포트 목록 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const getTagColor = (direction: string) => {
    switch (direction) {
      case '강화': return 'bg-red-100 text-red-700';
      case '완화': return 'bg-green-100 text-green-700';
      case '상승': return 'bg-orange-100 text-orange-700';
      case '하락': return 'bg-blue-100 text-blue-700';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  // 리포트 상세보기 모드
  if (selectedReport) {
    return (
      <div className="bg-slate-50 min-h-screen">
        {/* 상단 네비게이션 바 */}
        <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
            <button
              onClick={() => setSelectedReport(null)}
              className="flex items-center gap-2 text-slate-600 hover:text-primary transition-colors"
            >
              <ArrowLeft size={20} />
              <span>목록으로</span>
            </button>
            <div className="text-sm text-slate-500">
              {formatDate(selectedReport.date)} 발행
            </div>
            <button
              onClick={() => setSelectedReport(null)}
              className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* 리포트 iframe */}
        <iframe
          src={`/reports/${selectedReport.fileName}`}
          className="w-full h-[calc(100vh-56px)] border-0"
          title={selectedReport.title}
        />
      </div>
    );
  }

  // 로딩 상태
  if (loading) {
    return (
      <div className="bg-slate-50 min-h-screen py-12 flex items-center justify-center">
        <div className="text-slate-500">리포트를 불러오는 중...</div>
      </div>
    );
  }

  const reports = reportsData?.reports || [];
  const featuredReport = reports.find(r => r.featured) || reports[0];
  const otherReports = reports.filter(r => r.id !== featuredReport?.id);

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4">
            <FileText className="text-primary" size={32} />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-3">주간 부동산 리포트</h2>
          <p className="text-slate-600">AI가 분석한 최신 시장 트렌드와 인사이트를 매주 받아보세요.</p>
        </div>

        <div className="space-y-6">
          {/* Main Featured Report */}
          {featuredReport && (
            <div
              className="bg-white rounded-2xl shadow-lg border border-primary/20 overflow-hidden relative cursor-pointer hover:shadow-xl transition-shadow"
              onClick={() => setSelectedReport(featuredReport)}
            >
              <div className="absolute top-0 right-0 bg-primary text-white text-xs font-bold px-3 py-1 rounded-bl-xl">
                최신
              </div>
              <div className="p-8">
                <div className="flex items-center gap-2 text-primary font-medium mb-3">
                  <TrendingUp size={18} />
                  <span>{featuredReport.subtitle}</span>
                  {featuredReport.special && (
                    <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2 py-1 rounded-md ml-2">
                      📊 {featuredReport.special}
                    </span>
                  )}
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">
                  {featuredReport.title}
                </h3>
                <p className="text-slate-600 mb-6 leading-relaxed">
                  {featuredReport.summary}
                </p>

                {/* 핵심 지표 */}
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="bg-slate-50 rounded-lg p-3 text-center">
                    <div className="text-xs text-slate-500 mb-1">정책 방향</div>
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${getTagColor(featuredReport.highlights.policyDirection)}`}>
                      {featuredReport.highlights.policyDirection}
                    </span>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-3 text-center">
                    <div className="text-xs text-slate-500 mb-1">시장 심리</div>
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${getTagColor(featuredReport.highlights.marketSentiment)}`}>
                      {featuredReport.highlights.marketSentiment}
                    </span>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-3 text-center">
                    <div className="text-xs text-slate-500 mb-1">주간 변동</div>
                    <span className="text-lg font-bold text-red-600">
                      {featuredReport.keyMetrics.weeklyChange}
                    </span>
                  </div>
                </div>

                {/* 추가 지표 (매수우위지수, 전세수급지수, 매물수) */}
                {(featuredReport.keyMetrics.buyerIndex || featuredReport.keyMetrics.totalListings) && (
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    {featuredReport.keyMetrics.buyerIndex && (
                      <div className="bg-red-50 rounded-lg p-3 text-center">
                        <div className="text-xs text-slate-500 mb-1">매수우위지수</div>
                        <span className="text-lg font-bold text-red-600">
                          {featuredReport.keyMetrics.buyerIndex}
                        </span>
                      </div>
                    )}
                    {featuredReport.keyMetrics.jeonseIndex && (
                      <div className="bg-blue-50 rounded-lg p-3 text-center">
                        <div className="text-xs text-slate-500 mb-1">전세수급지수</div>
                        <span className="text-lg font-bold text-blue-600">
                          {featuredReport.keyMetrics.jeonseIndex}
                        </span>
                      </div>
                    )}
                    {featuredReport.keyMetrics.totalListings && (
                      <div className="bg-slate-100 rounded-lg p-3 text-center">
                        <div className="text-xs text-slate-500 mb-1">총 매물수</div>
                        <span className="text-lg font-bold text-slate-700">
                          {featuredReport.keyMetrics.totalListings.toLocaleString()}건
                        </span>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-between border-t border-slate-100 pt-6">
                  <div className="flex items-center gap-2 text-slate-400 text-sm">
                    <Calendar size={16} />
                    <span>{formatDate(featuredReport.date)} 발행</span>
                  </div>
                  <button className="flex items-center gap-2 text-primary font-bold hover:text-primary-hover transition-colors">
                    리포트 전체 보기 <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Report List (이전 리포트들) */}
          {otherReports.length > 0 && (
            <div className="grid gap-4">
              {otherReports.map((report) => (
                <div
                  key={report.id}
                  className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center cursor-pointer"
                  onClick={() => setSelectedReport(report)}
                >
                  <div className="flex-grow">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="bg-slate-100 text-slate-600 text-xs font-bold px-2 py-1 rounded-md">
                        {report.tag}
                      </span>
                      <span className="text-slate-400 text-xs flex items-center gap-1">
                        <Calendar size={12} /> {formatDate(report.date)}
                      </span>
                    </div>
                    <h4 className="text-lg font-bold text-slate-900 mb-2">
                      {report.title} ({report.subtitle})
                    </h4>
                    <p className="text-slate-500 text-sm line-clamp-2">{report.summary}</p>
                  </div>
                  <button className="flex-shrink-0 p-3 text-slate-400 hover:text-primary hover:bg-slate-50 rounded-full transition-all">
                    <ArrowRight size={20} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* 리포트가 없을 때 */}
          {reports.length === 0 && (
            <div className="bg-white rounded-2xl p-12 text-center">
              <FileText className="mx-auto text-slate-300 mb-4" size={48} />
              <h3 className="text-xl font-bold text-slate-700 mb-2">아직 발행된 리포트가 없습니다</h3>
              <p className="text-slate-500">첫 번째 주간 리포트를 기대해주세요!</p>
            </div>
          )}
        </div>

        {/* Subscribe Banner */}
        <div className="mt-12 bg-slate-900 text-white rounded-2xl p-8 text-center">
          <h3 className="text-xl font-bold mb-3">중요한 정보를 놓치지 마세요</h3>
          <p className="text-slate-300 mb-6 text-sm">
            {reportsData?.nextPublishDate && (
              <>다음 리포트: {formatDate(reportsData.nextPublishDate)} ({reportsData.publishDay})</>
            )}
          </p>
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
