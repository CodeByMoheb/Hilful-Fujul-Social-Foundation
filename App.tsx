import React, { useState, useMemo } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import About from './components/About';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import type { Page } from './types';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('Home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const renderPage = () => {
    switch (currentPage) {
      case 'Home':
        return <Home setCurrentPage={setCurrentPage} />;
      case 'About':
        return <About />;
      case 'Projects':
        return <Projects />;
      case 'Contact':
        return <Contact />;
      case 'Login':
        return <Login setIsLoggedIn={setIsLoggedIn} setCurrentPage={setCurrentPage} />;
      case 'Dashboard':
        return isLoggedIn ? <Dashboard /> : <Login setIsLoggedIn={setIsLoggedIn} setCurrentPage={setCurrentPage} />;
      default:
        return <Home setCurrentPage={setCurrentPage} />;
    }
  };
  
  // By changing the key, we force React to re-mount the main content, which re-triggers our entry animation
  const animatedPage = useMemo(() => (
    <div key={currentPage}>
        {renderPage()}
    </div>
  ), [currentPage, isLoggedIn]);


  return (
    <div className="bg-brand-light-bg min-h-screen font-sans text-brand-text-dark">
      <Header currentPage={currentPage} setCurrentPage={setCurrentPage} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <main>{animatedPage}</main>
      <Footer />
    </div>
  );
};

export default App;