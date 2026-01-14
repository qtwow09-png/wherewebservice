import React from 'react';

export interface NavItem {
  label: string;
  id: 'hero' | 'dashboard' | 'advisor' | 'report';
}

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