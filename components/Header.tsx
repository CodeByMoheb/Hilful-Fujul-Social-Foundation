import React, { useState } from 'react';
import type { Page } from '../types';
import { LOGO_URL, Icons } from '../constants';

interface HeaderProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ currentPage, setCurrentPage, isLoggedIn, setIsLoggedIn }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentPage('Home');
    setIsMenuOpen(false);
  }
  
  const handleProfileClick = () => {
      if (isLoggedIn) {
          setCurrentPage('Dashboard');
      } else {
          setCurrentPage('Login');
      }
  }

  const navLinks: Page[] = ['Home', 'About', 'Projects', 'Contact'];

  const NavLink: React.FC<{ page: Page, isMobile?: boolean }> = ({ page, isMobile = false }) => (
    <button
      onClick={() => {
        setCurrentPage(page);
        setIsMenuOpen(false);
      }}
      className={`font-serif transition-colors duration-300 ${isMobile ? 'block w-full text-left px-4 py-3 text-lg' : 'px-4 py-2 text-md'} ${
        currentPage === page
          ? 'text-brand-primary font-bold'
          : 'text-brand-text-dark hover:text-brand-primary'
      }`}
    >
      {page.charAt(0).toUpperCase() + page.slice(1)}
    </button>
  );

  return (
    <header className="bg-brand-secondary/80 backdrop-blur-sm border-b border-brand-border-light sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex-shrink-0">
            <button onClick={() => setCurrentPage('Home')}>
              <img className="h-16 w-16 object-contain rounded-full border-2 border-brand-primary p-1" src={LOGO_URL} alt="HFSF Logo" />
            </button>
          </div>
          
          <div className="hidden md:flex items-center justify-center flex-1">
              <div className="flex items-baseline space-x-6">
                {navLinks.map((link) => (
                    <NavLink key={link} page={link} />
                ))}
              </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <button onClick={() => alert('Redirecting to Donation Portal...')} className="bg-white text-brand-primary border border-brand-border-light hover:bg-brand-light-bg font-bold py-2 px-4 rounded-md shadow-sm transition-all text-sm flex items-center space-x-2">
                <span>Donate</span>
                <span className="text-yellow-500">❤️</span>
            </button>
            <button onClick={() => setCurrentPage('Contact')} className="bg-brand-primary text-white hover:bg-green-800 font-bold py-2 px-4 rounded-md shadow-sm transition-transform transform hover:scale-105 text-sm flex items-center space-x-2">
                <span>Volunteer</span>
                <span>→</span>
            </button>
            <button className="p-2 rounded-full hover:bg-gray-200 transition-colors text-brand-text-muted">
                {Icons.bell}
            </button>
             <button onClick={handleProfileClick} className="p-2 rounded-full hover:bg-gray-200 transition-colors text-brand-text-muted">
                {Icons.user}
            </button>
          </div>

          <div className="flex md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-brand-text-dark hover:text-brand-primary focus:outline-none"
              aria-label="Main menu"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? Icons.close : Icons.menu}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'} absolute top-20 left-0 w-full bg-white shadow-xl`}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
                <NavLink key={link} page={link} isMobile />
            ))}
             <button
              onClick={() => {
                handleProfileClick();
                setIsMenuOpen(false);
              }}
              className="block w-full text-left px-4 py-3 text-lg font-serif text-brand-text-dark hover:text-brand-primary"
            >
              {isLoggedIn ? 'Dashboard' : 'Login'}
            </button>
             {isLoggedIn && (
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-3 text-lg font-serif text-red-600 hover:text-red-800"
                >
                  Logout
                </button>
            )}
          </div>
      </div>
    </header>
  );
};

export default Header;