
import React, { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import About from './components/About';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Quran from './components/Quran';
import Hadith from './components/Hadith';
import PrayerTimes from './components/PrayerTimes';
import Masayel from './components/Masayel';
import Dua from './components/Dua';
import Article from './components/Article';
import type { Page } from './types';

const App: React.FC = () => {
    const [currentPage, setCurrentPage] = useState<Page>('Home');
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const renderPage = () => {
        // Redirect to login if trying to access dashboard while logged out
        if (!isLoggedIn && currentPage === 'Dashboard') {
            return <Login setIsLoggedIn={setIsLoggedIn} setCurrentPage={setCurrentPage} />;
        }

        switch (currentPage) {
            case 'Home':
                return <Home />;
            case 'About':
                return <About />;
            case 'Projects':
                return <Projects />;
            case 'Contact':
                return <Contact />;
            case 'Login':
                 return <Login setIsLoggedIn={setIsLoggedIn} setCurrentPage={setCurrentPage} />;
            case 'Dashboard':
                return <Dashboard />;
            case 'Quran':
                return <Quran />;
            case 'Hadith':
                return <Hadith />;
            case 'PrayerTimes':
                return <PrayerTimes />;
            case 'Masayel':
                return <Masayel />;
            case 'Dua':
                return <Dua />;
            case 'Article':
                return <Article />;
            default:
                return <Home />;
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-brand-light-bg font-sans">
            <Header setCurrentPage={setCurrentPage} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
            <main className="flex-grow">
                {renderPage()}
            </main>
            <Footer />
        </div>
    );
};

export default App;
