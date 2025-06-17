import React, { useState, useCallback } from 'react';
import MainMenu from './components/MainMenu';
import ProlongacionesView from './components/ProlongacionesView';
import { AppView } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.MAIN_MENU);

  const navigateTo = useCallback((view: AppView) => {
    setCurrentView(view);
  }, []);

  const renderView = () => {
    switch (currentView) {
      case AppView.PROLONGACIONES:
        return <ProlongacionesView navigateToMenu={() => navigateTo(AppView.MAIN_MENU)} />;
      case AppView.MAIN_MENU:
      default:
        return <MainMenu navigateTo={navigateTo} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-sky-100 text-slate-800 flex flex-col items-center p-4 sm:p-6 md:p-8">
      {renderView()}
    </div>
  );
};

export default App;
