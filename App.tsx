import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Layout } from './components/Layout';
import { Hero } from './components/Hero';
import { Magazine } from './components/Magazine';
import { AIAdvisor } from './components/AIAdvisor';
import { WeeklyReport } from './components/WeeklyReport';
import { AdminPanel } from './components/AdminPanel';
import type { View } from './types';

const AppContent: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('hero');
  const [showGatePopup, setShowGatePopup] = useState(true);
  const { user } = useAuth();

  const handleNavigate = (view: View) => {
    if (!user && view !== 'hero') {
      setShowGatePopup(true);
      return;
    }
    setCurrentView(view);
  };

  const renderView = () => {
    switch (currentView) {
      case 'hero':
        return <Hero onNavigate={handleNavigate} />;
      case 'magazine':
        return <Magazine />;
      case 'advisor':
        return <AIAdvisor />;
      case 'report':
        return <WeeklyReport />;
      case 'admin':
        return <AdminPanel />;
      default:
        return <Hero onNavigate={handleNavigate} />;
    }
  };

  return (
    <Layout
      currentView={currentView}
      onNavigate={handleNavigate}
      showGatePopup={showGatePopup}
      onCloseGatePopup={() => setShowGatePopup(false)}
    >
      {renderView()}
    </Layout>
  );
};

const App: React.FC = () => (
  <AuthProvider>
    <AppContent />
  </AuthProvider>
);

export default App;
