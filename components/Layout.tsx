import React from 'react';
import { Home, BarChart2, MessageSquare, Menu, X, Share2, UserCircle } from 'lucide-react';
import { NavItem } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  currentView: string;
  onNavigate: (view: 'hero' | 'magazine' | 'advisor' | 'report') => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentView, onNavigate }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const navItems: NavItem[] = [
    { label: '홈', id: 'hero' },
    { label: '스마트 검색', id: 'advisor' },
    { label: '투자매거진', id: 'magazine' },
    { label: '주간 리포트', id: 'report' },
  ];

  const handleNavClick = (id: 'hero' | 'magazine' | 'advisor' | 'report') => {
    onNavigate(id);
    setIsMobileMenuOpen(false);
  };

  const handleShare = () => {
    const subject = encodeURIComponent("어디살래 - AI 부동산 인사이트 추천");
    const body = encodeURIComponent(`친구야, 이 부동산 분석 서비스 정말 괜찮더라. 한번 확인해봐:\n${window.location.href}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div 
              className="flex items-center gap-2 cursor-pointer" 
              onClick={() => handleNavClick('hero')}
            >
              <div className="bg-primary text-white p-2 rounded-lg">
                <Home size={20} />
              </div>
              <span className="text-xl font-bold text-primary tracking-tight">어디살래</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-6">
              <nav className="flex space-x-6">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`text-sm font-medium transition-colors duration-200 ${
                      currentView === item.id
                        ? 'text-primary'
                        : 'text-slate-500 hover:text-primary-hover'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </nav>

              <div className="h-4 w-px bg-slate-200 mx-2"></div>
              
              {/* Actions */}
              <div className="flex items-center gap-3">
                <button
                  onClick={handleShare}
                  className="text-slate-400 hover:text-primary transition-colors p-1"
                  title="공유하기"
                >
                  <Share2 size={18} />
                </button>
                <button className="text-sm font-semibold text-slate-600 hover:text-primary transition-colors">
                  로그인
                </button>
                <button className="text-sm font-semibold bg-primary text-white px-4 py-2 rounded-full hover:bg-primary-hover transition-colors shadow-md shadow-primary/20">
                  회원가입
                </button>
              </div>
            </div>

            {/* Mobile Actions */}
            <div className="lg:hidden flex items-center gap-4">
               <button
                  onClick={handleShare}
                  className="text-slate-500 hover:text-primary focus:outline-none"
                  aria-label="공유하기"
                >
                  <Share2 size={24} />
                </button>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-slate-500 hover:text-primary focus:outline-none"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-slate-100">
            <div className="px-4 pt-4 pb-6 space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`block w-full text-left px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                    currentView === item.id
                      ? 'bg-primary/10 text-primary'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              <div className="border-t border-slate-100 my-4 pt-4 flex flex-col gap-3">
                <button className="w-full text-center py-3 font-semibold text-slate-600 hover:bg-slate-50 rounded-xl">
                  로그인
                </button>
                <button className="w-full text-center py-3 font-semibold bg-primary text-white rounded-xl shadow-md">
                  회원가입
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-slate-500 text-sm">
            © {new Date().getFullYear()} 어디살래 (Eodi-Sallae). All rights reserved.
          </div>
          <div className="flex space-x-6 text-slate-400 text-sm">
            <a href="#" className="hover:text-primary transition-colors">개인정보처리방침</a>
            <a href="#" className="hover:text-primary transition-colors">이용약관</a>
            <a href="#" className="hover:text-primary transition-colors">문의하기</a>
          </div>
        </div>
      </footer>
    </div>
  );
};