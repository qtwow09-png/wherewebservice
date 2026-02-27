import React from 'react';

export const Magazine: React.FC = () => {
  return (
    <div className="bg-slate-50 min-h-screen">
      {/* 매거진 iframe - 상단 프레임(헤더)은 Layout에서 유지됨 */}
      <iframe
        src="/magazine/magazine_20260227.html"
        className="w-full h-[calc(100vh-64px)] border-0"
        title="투자매거진"
      />
    </div>
  );
};
