import React, { useState } from 'react';
import BottomNav from './BottomNav';
import InstallPrompt from './InstallPrompt';
import Home from '../pages/Home';
import ConversionsGuide from '../pages/ConversionsGuide';
import Calculator from '../pages/Calculator';
import Printables from '../pages/Printables';
import FAQ from '../pages/FAQ';
import About from '../pages/About';


const AppLayout: React.FC = () => {
  const [activePage, setActivePage] = useState('home');

  const renderPage = () => {
    switch (activePage) {
      case 'home':
        return <Home onNavigate={setActivePage} />;
      case 'guide':
        return <ConversionsGuide />;
      case 'calculator':
        return <Calculator />;
      case 'printables':
        return <Printables />;
      case 'faq':
        return <FAQ />;
      case 'about':
        return <About />;
      default:
        return <Home onNavigate={setActivePage} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f1ed]">
      {renderPage()}
      <InstallPrompt />
      <BottomNav active={activePage} onNavigate={setActivePage} />
    </div>
  );

};

export default AppLayout;
