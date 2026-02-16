import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { Layout } from './components/Layout';
import { Hero } from './components/Hero';
import { Magazine } from './components/Magazine';
import { AIAdvisor } from './components/AIAdvisor';
import { WeeklyReport } from './components/WeeklyReport';
import { AdminPanel } from './components/AdminPanel';
import type { View } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('hero');

  const renderView = () => {
    switch (currentView) {
      case 'hero':
        return <Hero onNavigate={setCurrentView} />;
      case 'magazine':
        return <Magazine />;
      case 'advisor':
        return <AIAdvisor />;
      case 'report':
        return <WeeklyReport />;
      case 'admin':
        return <AdminPanel />;
      default:
        return <Hero onNavigate={setCurrentView} />;
    }
  };

  return (
    <AuthProvider>
      <Layout currentView={currentView} onNavigate={setCurrentView}>
        {renderView()}
      </Layout>
    </AuthProvider>
  );
};

export default App;
