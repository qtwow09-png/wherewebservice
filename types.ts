import React from 'react';

export interface NavItem {
  label: string;
  id: View;
}

export type View = 'hero' | 'magazine' | 'advisor' | 'report' | 'admin';

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  isError?: boolean;
}

export interface StatCardProps {
  title: string;
  value: string;
  trend: number;
  icon: React.ReactNode;
}

export interface UserProfile {
  id: string;
  email: string;
  nickname: string;
  naver_premium_id?: string;
  role: 'user' | 'admin';
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at?: string;
}

export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
}