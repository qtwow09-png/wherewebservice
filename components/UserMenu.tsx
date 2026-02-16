import React, { useState, useRef, useEffect } from 'react';
import { User, LogOut, Shield, MessageSquare, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { signOut } from '../services/authService';
import type { View } from '../types';

interface UserMenuProps {
  onNavigate: (view: View) => void;
}

export const UserMenu: React.FC<UserMenuProps> = ({ onNavigate }) => {
  const { profile, isAdmin } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = async () => {
    await signOut();
    setOpen(false);
  };

  const statusLabel = {
    pending: '승인 대기중',
    approved: '이용중',
    rejected: '승인 거절',
  };

  const statusColor = {
    pending: 'text-amber-600 bg-amber-50',
    approved: 'text-green-600 bg-green-50',
    rejected: 'text-red-600 bg-red-50',
  };

  if (!profile) return null;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-primary transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
          <User size={16} className="text-primary" />
        </div>
        <span className="hidden sm:inline">{profile.nickname}</span>
        <ChevronDown size={14} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-50">
          {/* 사용자 정보 */}
          <div className="px-4 py-3 border-b border-slate-100">
            <p className="font-semibold text-slate-800">{profile.nickname}</p>
            <p className="text-xs text-slate-400 mt-0.5">{profile.email}</p>
            <span className={`inline-block mt-1.5 text-xs font-medium px-2 py-0.5 rounded-full ${statusColor[profile.status]}`}>
              {statusLabel[profile.status]}
            </span>
          </div>

          {/* 메뉴 항목 */}
          <div className="py-1">
            {isAdmin && (
              <button
                onClick={() => { onNavigate('admin'); setOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
              >
                <Shield size={16} />
                <span>관리자 대시보드</span>
              </button>
            )}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
            >
              <LogOut size={16} />
              <span>로그아웃</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
