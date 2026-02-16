import React, { useState, useEffect } from 'react';
import { Shield, CheckCircle, XCircle, Clock, Users, Loader2, Send, MessageSquare, ChevronDown, ChevronUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getAllProfiles, updateUserStatus, sendMessage, getMessages, getAdminId, markMessagesRead } from '../services/authService';
import type { UserProfile, Message } from '../types';

export const AdminPanel: React.FC = () => {
  const { profile: adminProfile, isAdmin } = useAuth();
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'pending' | 'approved' | 'rejected' | 'messages'>('pending');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // 메시지 관련
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [replyText, setReplyText] = useState('');
  const [sendingReply, setSendingReply] = useState(false);
  const [expandedUser, setExpandedUser] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [allProfiles, allMessages] = await Promise.all([
        getAllProfiles(),
        adminProfile ? getMessages(adminProfile.id) : Promise.resolve([]),
      ]);
      setProfiles(allProfiles.filter(p => p.id !== adminProfile?.id));
      setMessages(allMessages);
      if (adminProfile) await markMessagesRead(adminProfile.id);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (userId: string, status: 'approved' | 'rejected') => {
    setActionLoading(userId);
    try {
      await updateUserStatus(userId, status);
      await loadData();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleSendReply = async (receiverId: string) => {
    if (!replyText.trim() || !adminProfile) return;
    setSendingReply(true);
    try {
      await sendMessage(adminProfile.id, receiverId, replyText.trim());
      setReplyText('');
      await loadData();
    } catch (err) {
      console.error(err);
    } finally {
      setSendingReply(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-slate-500">접근 권한이 없습니다.</p>
      </div>
    );
  }

  const filtered = profiles.filter(p => {
    if (tab === 'messages') return true;
    return p.status === tab;
  });

  const pendingCount = profiles.filter(p => p.status === 'pending').length;

  const getUserMessages = (userId: string) =>
    messages.filter(m => m.sender_id === userId || m.receiver_id === userId);

  const tabs = [
    { id: 'pending' as const, label: '승인 대기', icon: Clock, count: pendingCount },
    { id: 'approved' as const, label: '승인 완료', icon: CheckCircle },
    { id: 'rejected' as const, label: '거절', icon: XCircle },
    { id: 'messages' as const, label: '메시지', icon: MessageSquare },
  ];

  return (
    <div className="bg-slate-50 min-h-[calc(100vh-4rem)] py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 bg-primary rounded-xl">
            <Shield className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">관리자 대시보드</h1>
            <p className="text-sm text-slate-500">회원 관리 및 승인</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
            <div className="flex items-center gap-2 text-slate-500 text-sm mb-1">
              <Users size={16} /> 전체 회원
            </div>
            <p className="text-2xl font-bold text-slate-800">{profiles.length}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-amber-100 shadow-sm">
            <div className="flex items-center gap-2 text-amber-600 text-sm mb-1">
              <Clock size={16} /> 대기중
            </div>
            <p className="text-2xl font-bold text-amber-600">{pendingCount}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-green-100 shadow-sm">
            <div className="flex items-center gap-2 text-green-600 text-sm mb-1">
              <CheckCircle size={16} /> 승인
            </div>
            <p className="text-2xl font-bold text-green-600">{profiles.filter(p => p.status === 'approved').length}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-red-100 shadow-sm">
            <div className="flex items-center gap-2 text-red-500 text-sm mb-1">
              <XCircle size={16} /> 거절
            </div>
            <p className="text-2xl font-bold text-red-500">{profiles.filter(p => p.status === 'rejected').length}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                tab === t.id
                  ? 'bg-primary text-white shadow-md shadow-primary/20'
                  : 'bg-white text-slate-500 border border-slate-200 hover:border-primary/30'
              }`}
            >
              <t.icon size={16} />
              {t.label}
              {t.count !== undefined && t.count > 0 && (
                <span className={`px-1.5 py-0.5 rounded-full text-xs ${
                  tab === t.id ? 'bg-white/20' : 'bg-amber-100 text-amber-700'
                }`}>
                  {t.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="animate-spin text-primary" size={32} />
            </div>
          ) : tab === 'messages' ? (
            /* 메시지 탭 */
            <div className="divide-y divide-slate-100">
              {profiles.length === 0 ? (
                <div className="py-16 text-center text-slate-400">가입된 회원이 없습니다.</div>
              ) : (
                profiles.map((p) => {
                  const userMsgs = getUserMessages(p.id);
                  const isExpanded = expandedUser === p.id;
                  return (
                    <div key={p.id}>
                      <button
                        onClick={() => setExpandedUser(isExpanded ? null : p.id)}
                        className="w-full flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                            <MessageSquare size={16} className="text-primary" />
                          </div>
                          <div className="text-left">
                            <p className="font-medium text-slate-800">{p.nickname}</p>
                            <p className="text-xs text-slate-400">{p.email}</p>
                          </div>
                          {userMsgs.length > 0 && (
                            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                              {userMsgs.length}
                            </span>
                          )}
                        </div>
                        {isExpanded ? <ChevronUp size={18} className="text-slate-400" /> : <ChevronDown size={18} className="text-slate-400" />}
                      </button>
                      {isExpanded && (
                        <div className="px-6 pb-4 bg-slate-50">
                          <div className="max-h-60 overflow-y-auto space-y-2 mb-3">
                            {userMsgs.length === 0 ? (
                              <p className="text-sm text-slate-400 py-4 text-center">메시지가 없습니다.</p>
                            ) : (
                              userMsgs.map((m) => (
                                <div
                                  key={m.id}
                                  className={`p-3 rounded-xl text-sm max-w-[80%] ${
                                    m.sender_id === adminProfile?.id
                                      ? 'bg-primary text-white ml-auto'
                                      : 'bg-white border border-slate-200'
                                  }`}
                                >
                                  <p>{m.content}</p>
                                  <p className={`text-xs mt-1 ${m.sender_id === adminProfile?.id ? 'text-indigo-200' : 'text-slate-400'}`}>
                                    {new Date(m.created_at).toLocaleString('ko-KR')}
                                  </p>
                                </div>
                              ))
                            )}
                          </div>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={expandedUser === p.id ? replyText : ''}
                              onChange={(e) => setReplyText(e.target.value)}
                              placeholder="답변을 입력하세요..."
                              className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                              onKeyDown={(e) => e.key === 'Enter' && handleSendReply(p.id)}
                            />
                            <button
                              onClick={() => handleSendReply(p.id)}
                              disabled={sendingReply || !replyText.trim()}
                              className="px-4 py-2.5 bg-primary text-white rounded-xl hover:bg-primary-hover disabled:opacity-50 transition-all"
                            >
                              <Send size={16} />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          ) : (
            /* 회원 목록 탭 */
            <div className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <div className="py-16 text-center text-slate-400">
                  {tab === 'pending' ? '대기 중인 회원이 없습니다.' : '해당하는 회원이 없습니다.'}
                </div>
              ) : (
                filtered.map((p) => (
                  <div key={p.id} className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                        <Users size={16} />
                      </div>
                      <div>
                        <p className="font-medium text-slate-800">{p.nickname}</p>
                        <p className="text-xs text-slate-400">{p.email}</p>
                        <p className="text-xs text-slate-400">
                          가입: {new Date(p.created_at).toLocaleDateString('ko-KR')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {tab === 'pending' && (
                        <>
                          <button
                            onClick={() => handleAction(p.id, 'approved')}
                            disabled={actionLoading === p.id}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-sm font-medium hover:bg-green-100 transition-colors disabled:opacity-50"
                          >
                            {actionLoading === p.id ? <Loader2 className="animate-spin" size={14} /> : <CheckCircle size={14} />}
                            승인
                          </button>
                          <button
                            onClick={() => handleAction(p.id, 'rejected')}
                            disabled={actionLoading === p.id}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors disabled:opacity-50"
                          >
                            <XCircle size={14} />
                            거절
                          </button>
                        </>
                      )}
                      {tab === 'approved' && (
                        <button
                          onClick={() => handleAction(p.id, 'rejected')}
                          disabled={actionLoading === p.id}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors disabled:opacity-50"
                        >
                          <XCircle size={14} />
                          이용 중지
                        </button>
                      )}
                      {tab === 'rejected' && (
                        <button
                          onClick={() => handleAction(p.id, 'approved')}
                          disabled={actionLoading === p.id}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-sm font-medium hover:bg-green-100 transition-colors disabled:opacity-50"
                        >
                          <CheckCircle size={14} />
                          승인
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
