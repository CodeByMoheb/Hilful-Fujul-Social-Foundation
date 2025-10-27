
import React, { useState } from 'react';
import type { Page } from '../types';

interface HeaderProps {
    setCurrentPage: (page: Page) => void;
    isLoggedIn: boolean;
    setIsLoggedIn: (isLoggedIn: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ setCurrentPage, isLoggedIn, setIsLoggedIn }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const navLinks: { name: Page | 'Islamic Resources'; page?: Page; dropdown?: Page[] }[] = [
        { name: 'Home', page: 'Home' },
        { name: 'About', page: 'About' },
        { name: 'Projects', page: 'Projects' },
        {
            name: 'Islamic Resources',
            dropdown: ['Quran', 'Hadith', 'PrayerTimes', 'Masayel', 'Dua', 'Article']
        },
        { name: 'Contact', page: 'Contact' },
    ];

    const handleLogout = () => {
        setIsLoggedIn(false);
        setCurrentPage('Home');
    };

    const NavLink: React.FC<{ page: Page, children: React.ReactNode }> = ({ page, children }) => (
        <button
            onClick={() => {
                setCurrentPage(page);
                setIsMenuOpen(false);
                setIsDropdownOpen(false);
            }}
            className="text-brand-text-dark hover:text-brand-primary transition-colors duration-300 font-medium px-3 py-2 rounded-md w-full text-left"
        >
            {children}
        </button>
    );

    return (
        <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <div className="flex-shrink-0">
                        <button onClick={() => setCurrentPage('Home')} className="text-2xl font-bold font-serif text-brand-primary">
                            HFSF
                        </button>
                    </div>

                    {/* Desktop Menu */}
                    <nav className="hidden md:flex items-center space-x-1">
                        {navLinks.map((link) =>
                            link.page ? (
                                <NavLink key={link.name} page={link.page}>{link.name}</NavLink>
                            ) : (
                                <div className="relative" key={link.name}>
                                    <button
                                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                        onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)}
                                        className="text-brand-text-dark hover:text-brand-primary transition-colors duration-300 font-medium px-3 py-2 rounded-md flex items-center"
                                    >
                                        {link.name}
                                        <svg className={`w-4 h-4 ml-1 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                    </button>
                                    {isDropdownOpen && (
                                        <div className="absolute mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 border border-brand-border-light">
                                            {link.dropdown?.map(item => <NavLink key={item} page={item}>{item}</NavLink>)}
                                        </div>
                                    )}
                                </div>
                            )
                        )}
                         {isLoggedIn ? (
                            <>
                                <NavLink page="Dashboard">Dashboard</NavLink>
                                <button onClick={handleLogout} className="ml-4 bg-brand-secondary text-brand-primary hover:bg-red-200 font-bold py-2 px-4 rounded-md transition-colors">
                                    Logout
                                </button>
                            </>
                        ) : (
                            <button onClick={() => setCurrentPage('Login')} className="ml-4 bg-brand-primary text-white hover:bg-green-800 font-bold py-2 px-4 rounded-md transition-transform transform hover:scale-105">
                                Admin Login
                            </button>
                        )}
                    </nav>

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
                             {navLinks.map((link) =>
                                link.page ? (
                                    <NavLink key={link.name} page={link.page}>{link.name}</NavLink>
                                ) : (
                                    <div key={link.name}>
                                        <h3 className="text-brand-text-dark font-medium px-3 py-2">{link.name}</h3>
                                        <div className="flex flex-col pl-4">
                                            {link.dropdown?.map(item => <NavLink key={item} page={item}>{item}</NavLink>)}
                                        </div>
                                    </div>
                                )
                            )}
                            {isLoggedIn ? (
                                <>
                                    <NavLink page="Dashboard">Dashboard</NavLink>
                                    <button onClick={handleLogout} className="text-left text-brand-text-dark hover:text-brand-primary transition-colors duration-300 font-medium px-3 py-2 rounded-md">
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <NavLink page="Login">Admin Login</NavLink>
                            )}
                        </nav>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;
