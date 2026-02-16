import { supabase } from './supabaseClient';
import type { UserProfile } from '../types';

// 회원가입
export async function signUp(email: string, password: string, nickname: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { nickname } },
  });
  if (error) throw error;

  // 프로필 생성 (status: pending → 관리자 승인 대기)
  if (data.user) {
    const { error: profileError } = await supabase.from('profiles').insert({
      id: data.user.id,
      email,
      nickname,
      role: 'user',
      status: 'pending',
    });
    if (profileError) throw profileError;
  }
  return data;
}

// 로그인
export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

// 로그아웃
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

// 현재 사용자 프로필 조회
export async function getProfile(userId: string): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  if (error) return null;
  return data as UserProfile;
}

// 전체 사용자 목록 (관리자용)
export async function getAllProfiles(): Promise<UserProfile[]> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []) as UserProfile[];
}

// 사용자 승인/거절 (관리자용)
export async function updateUserStatus(userId: string, status: 'approved' | 'rejected') {
  const { error } = await supabase
    .from('profiles')
    .update({ status })
    .eq('id', userId);
  if (error) throw error;
}

// 메시지 전송
export async function sendMessage(senderId: string, receiverId: string, content: string) {
  const { error } = await supabase.from('messages').insert({
    sender_id: senderId,
    receiver_id: receiverId,
    content,
  });
  if (error) throw error;
}

// 내 메시지 조회
export async function getMessages(userId: string) {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
    .order('created_at', { ascending: true });
  if (error) throw error;
  return data || [];
}

// 안읽은 메시지 수
export async function getUnreadCount(userId: string): Promise<number> {
  const { count, error } = await supabase
    .from('messages')
    .select('*', { count: 'exact', head: true })
    .eq('receiver_id', userId)
    .eq('is_read', false);
  if (error) return 0;
  return count || 0;
}

// 메시지 읽음 처리
export async function markMessagesRead(userId: string) {
  const { error } = await supabase
    .from('messages')
    .update({ is_read: true })
    .eq('receiver_id', userId)
    .eq('is_read', false);
  if (error) throw error;
}

// 관리자 ID 조회
export async function getAdminId(): Promise<string | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('id')
    .eq('role', 'admin')
    .limit(1)
    .single();
  if (error) return null;
  return data?.id || null;
}
