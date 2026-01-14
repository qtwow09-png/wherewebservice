import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { Hero } from './components/Hero';
import { Dashboard } from './components/Dashboard';
import { AIAdvisor } from './components/AIAdvisor';
import { WeeklyReport } from './components/WeeklyReport';

// Simple view state management
type View = 'hero' | 'dashboard' | 'advisor' | 'report';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('hero');

  const renderView = () => {
    switch (currentView) {
      case 'hero':
        return <Hero onNavigate={setCurrentView} />;
      case 'dashboard':
        return <Dashboard />;
      case 'advisor':
        return <AIAdvisor />;
      case 'report':
        return <WeeklyReport />;
      default:
        return <Hero onNavigate={setCurrentView} />;
    }
  };

  return (
    <Layout currentView={currentView} onNavigate={setCurrentView}>
      {renderView()}
    </Layout>
  );
};

export default App;