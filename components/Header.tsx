import React, { useState } from 'react';
import type { Page } from '../types';
import { BellIcon, UserIcon, donationBox } from '../constants';


interface HeaderProps {
    setCurrentPage: (page: Page) => void;
    isLoggedIn: boolean;
    setIsLoggedIn: (isLoggedIn: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ setCurrentPage, isLoggedIn, setIsLoggedIn }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const banglaNavLinks: { name: string, page: Page }[] = [
        { name: 'কুরআন', page: 'Quran' },
        { name: 'হাদীস', page: 'Hadith' },
        { name: 'নামাজের সময়', page: 'PrayerTimes' },
        { name: 'মাসায়ালা', page: 'Masayel' },
        { name: 'দু\'আ', page: 'Dua' },
        { name: 'প্রবন্ধ', page: 'Article' },
    ];
    
    const otherPages: Page[] = ['About', 'Projects', 'Contact'];


    const handleLogout = () => {
        setIsLoggedIn(false);
        setCurrentPage('Home');
    };

    const NavLink: React.FC<{ page: Page, children: React.ReactNode, isMobile?: boolean }> = ({ page, children, isMobile = false }) => (
        <button
            onClick={() => {
                setCurrentPage(page);
                if (isMobile) setIsMenuOpen(false);
                setIsDropdownOpen(false);
            }}
            className="text-brand-text-dark hover:text-brand-primary transition-colors duration-300 font-medium px-3 py-2 rounded-md w-full text-left font-serif"
        >
            {children}
        </button>
    );

    return (
        <header className="bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-brand-border-light">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <button onClick={() => setCurrentPage('Home')} className="flex items-center space-x-2">
                             <div className="w-12 h-12 rounded-full border-2 border-brand-primary flex items-center justify-center">
                                {/* Simplified representation of the logo */}
                                <svg className="w-8 h-8 text-brand-primary" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
                                </svg>
                            </div>
                        </button>
                    </div>

                    {/* Desktop Menu */}
                    <nav className="hidden md:flex items-center space-x-1">
                        {banglaNavLinks.map(link => <NavLink key={link.name} page={link.page}>{link.name}</NavLink>)}
                        
                        <div className="relative">
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)}
                                className="text-brand-text-dark hover:text-brand-primary transition-colors duration-300 font-medium px-3 py-2 rounded-md flex items-center font-serif"
                            >
                                অন্যান্য
                                <svg className={`w-4 h-4 ml-1 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                            </button>
                            {isDropdownOpen && (
                                <div className="absolute mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 border border-brand-border-light">
                                    {otherPages.map(page => <NavLink key={page} page={page}>{page}</NavLink>)}
                                    {isLoggedIn && <NavLink page="Dashboard">Dashboard</NavLink>}
                                </div>
                            )}
                        </div>
                    </nav>

                    {/* Action Buttons & User */}
                    <div className="hidden md:flex items-center space-x-3">
                         <button className="flex items-center space-x-2 bg-white border border-brand-border-light text-brand-text-dark font-semibold px-4 py-2 rounded-lg shadow-sm hover:bg-brand-secondary transition-colors">
                            <span>ডোনেশন</span>
                            <div className="text-brand-primary">{donationBox}</div>
                        </button>
                        <button className="flex items-center space-x-2 bg-brand-primary text-white font-semibold px-4 py-2 rounded-lg shadow-sm hover:bg-green-800 transition-colors">
                            <span>ডাউনলোড</span>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l-7-7 1.41-1.41L11 15.17V3h2v12.17l4.59-4.58L19 12l-7 7z"></path></svg>
                        </button>
                        <button className="relative p-2 rounded-full hover:bg-brand-secondary">
                            <BellIcon/>
                            <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
                        </button>
                        {isLoggedIn ? (
                           <button onClick={handleLogout} className="p-2 rounded-full hover:bg-brand-secondary">
                                Logout
                           </button>
                        ) : (
                             <button onClick={() => setCurrentPage('Login')} className="p-2 rounded-full hover:bg-brand-secondary">
                                <UserIcon/>
                             </button>
                        )}
                    </div>


                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-brand-text-dark focus:outline-none">
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"} />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden pb-4">
                        <nav className="flex flex-col space-y-2">
                             {banglaNavLinks.map(link => <NavLink key={link.name} page={link.page} isMobile>{link.name}</NavLink>)}
                             <div className="border-t border-brand-border-light my-2"></div>
                             {otherPages.map(page => <NavLink key={page} page={page} isMobile>{page}</NavLink>)}
                              {isLoggedIn ? (
                                <>
                                    <NavLink page="Dashboard" isMobile>Dashboard</NavLink>
                                    <button onClick={handleLogout} className="text-left text-brand-text-dark hover:text-brand-primary transition-colors duration-300 font-medium px-3 py-2 rounded-md w-full">
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <NavLink page="Login" isMobile>Admin Login</NavLink>
                            )}
                        </nav>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;