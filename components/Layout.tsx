import React, { useState } from 'react';
import { Home, Menu, X, Share2, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AuthModal } from './AuthModal';
import { UserMenu } from './UserMenu';
import type { NavItem, View } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  currentView: string;
  onNavigate: (view: View) => void;
  showGatePopup: boolean;
  onCloseGatePopup: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentView, onNavigate, showGatePopup, onCloseGatePopup }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [authModal, setAuthModal] = useState<'login' | 'signup' | null>(null);
  const { user, profile, loading } = useAuth();

  const navItems: NavItem[] = [
    { label: '홈', id: 'hero' },
    { label: '스마트 검색', id: 'advisor' },
    { label: '투자매거진', id: 'magazine' },
    { label: '주간 리포트', id: 'report' },
  ];

  const handleNavClick = (id: View) => {
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

                {loading ? (
                  <div className="w-20 h-8 bg-slate-100 rounded-full animate-pulse" />
                ) : user && profile ? (
                  <UserMenu onNavigate={handleNavClick} />
                ) : (
                  <>
                    <button
                      onClick={() => setAuthModal('login')}
                      className="text-sm font-semibold text-slate-600 hover:text-primary transition-colors"
                    >
                      로그인
                    </button>
                    <button
                      onClick={() => setAuthModal('signup')}
                      className="text-sm font-semibold bg-primary text-white px-4 py-2 rounded-full hover:bg-primary-hover transition-colors shadow-md shadow-primary/20"
                    >
                      회원가입
                    </button>
                  </>
                )}
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
                {loading ? (
                  <div className="w-full h-12 bg-slate-100 rounded-xl animate-pulse" />
                ) : user && profile ? (
                  <div className="px-4">
                    <UserMenu onNavigate={handleNavClick} />
                  </div>
                ) : (
                  <>
                    <button
                      onClick={() => { setAuthModal('login'); setIsMobileMenuOpen(false); }}
                      className="w-full text-center py-3 font-semibold text-slate-600 hover:bg-slate-50 rounded-xl"
                    >
                      로그인
                    </button>
                    <button
                      onClick={() => { setAuthModal('signup'); setIsMobileMenuOpen(false); }}
                      className="w-full text-center py-3 font-semibold bg-primary text-white rounded-xl shadow-md"
                    >
                      회원가입
                    </button>
                  </>
                )}
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
            &copy; {new Date().getFullYear()} 어디살래 (Eodi-Sallae). All rights reserved.
          </div>
          <div className="flex space-x-6 text-slate-400 text-sm">
            <a href="#" className="hover:text-primary transition-colors">개인정보처리방침</a>
            <a href="#" className="hover:text-primary transition-colors">이용약관</a>
            <a href="#" className="hover:text-primary transition-colors">문의하기</a>
          </div>
        </div>
      </footer>

      {/* 비로그인 차단 팝업 */}
      {!loading && !user && showGatePopup && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="bg-primary px-6 py-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-lg">
                  <Lock className="text-yellow-300" size={24} />
                </div>
                <div>
                  <h2 className="text-white font-bold text-lg">회원 전용 서비스</h2>
                  <p className="text-indigo-200 text-sm">어디살래 - AI 부동산 인사이트</p>
                </div>
              </div>
              <button onClick={onCloseGatePopup} className="text-white/70 hover:text-white transition-colors" title="닫기">
                <X size={22} />
              </button>
            </div>
            <div className="p-6">
              <p className="text-slate-700 leading-relaxed text-sm whitespace-pre-line">
                본 서비스는 <strong>강남여의주의 부동산 비밀과외</strong> 네이버 프리미엄 컨텐츠 유료회원들만 이용하실 수 있습니다.{'\n\n'}네이버 프리미엄 컨텐츠 아이디와 동일한 ID로 회원가입후 승인을 받으면 이용하실 수 있습니다.{'\n\n'}승인처리는 2~3일 가량 시일이 걸릴 수 있으니 양해 부탁 드립니다.
              </p>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setAuthModal('login')}
                  className="flex-1 py-3 border border-primary text-primary rounded-xl font-semibold hover:bg-primary/5 transition-colors"
                >
                  로그인
                </button>
                <button
                  onClick={() => setAuthModal('signup')}
                  className="flex-1 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-hover transition-colors shadow-md shadow-primary/20"
                >
                  회원가입
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 승인 대기/거절 안내 */}
      {!loading && user && profile && profile.status === 'pending' && profile.role !== 'admin' && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="bg-amber-500 px-6 py-5">
              <h2 className="text-white font-bold text-lg">승인 대기중</h2>
            </div>
            <div className="p-6">
              <p className="text-slate-700 leading-relaxed text-sm">
                회원가입이 완료되었습니다. 관리자 승인 후 서비스를 이용하실 수 있습니다.{'\n\n'}승인처리는 2~3일 가량 시일이 걸릴 수 있으니 양해 부탁 드립니다.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Auth Modal */}
      {authModal && (
        <AuthModal
          mode={authModal}
          onClose={() => setAuthModal(null)}
          onSwitch={() => setAuthModal(authModal === 'login' ? 'signup' : 'login')}
        />
      )}
    </div>
  );
};
