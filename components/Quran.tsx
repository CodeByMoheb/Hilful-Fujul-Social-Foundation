import React, { useState, useMemo, useEffect } from 'react';
import { surahs as allSurahs } from '../data/surahs';
import type { Surah, Ayah } from '../types';
import { getSurahDetails } from '../services/geminiService';


const SurahCard: React.FC<{ surah: Surah; onSelect: () => void; }> = ({ surah, onSelect }) => (
    <div
        onClick={onSelect}
        className="bg-white rounded-lg p-4 shadow-sm border border-brand-border-light hover:shadow-md hover:border-brand-primary hover:-translate-y-1 transition-all duration-300 cursor-pointer animate-fadeInUp"
    >
        <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
                <div className="flex-shrink-0 w-10 h-10 bg-brand-secondary text-brand-primary rounded-md flex items-center justify-center font-serif font-bold text-lg">
                    {surah.number}
                </div>
                <div>
                    <h3 className="font-bold text-lg font-serif text-brand-text-dark">{surah.englishName}</h3>
                    <p className="text-xs text-brand-text-muted">{surah.englishNameTranslation}</p>
                </div>
            </div>
            <div className="text-right">
                <p className="text-2xl font-serif text-brand-primary" dir="rtl">{surah.name}</p>
                <p className="text-xs text-brand-text-muted">{surah.numberOfAyahs} Ayahs</p>
            </div>
        </div>
    </div>
);

const Quran: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('Surahs');
    const [selectedSurah, setSelectedSurah] = useState<Surah | null>(null);
    const [ayahs, setAyahs] = useState<Ayah[] | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);


    useEffect(() => {
        if (selectedSurah) {
            const fetchAyahs = async () => {
                setIsLoading(true);
                setError(null);
                setAyahs(null);
                try {
                    const fetchedAyahs = await getSurahDetails(selectedSurah.englishName);
                    setAyahs(fetchedAyahs);
                } catch (err) {
                    setError('Failed to load Surah details. Please try again.');
                    console.error(err);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchAyahs();
        }
    }, [selectedSurah]);


    const filteredSurahs = useMemo(() =>
        allSurahs.filter(surah =>
            surah.englishName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            surah.name.includes(searchTerm) ||
            surah.number.toString().includes(searchTerm)
        ),
        [searchTerm]
    );

    const handleSurahSelect = (surah: Surah) => {
        setSelectedSurah(surah);
    };

    if (selectedSurah) {
        return (
            <div className="bg-white py-10">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <button
                        onClick={() => { setSelectedSurah(null); setAyahs(null); }}
                        className="mb-6 font-semibold text-brand-primary hover:text-green-800 transition-colors flex items-center space-x-2"
                    >
                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                        <span>Back to Surah List</span>
                    </button>
                    <div className="text-center p-6 bg-brand-light-bg rounded-lg mb-8 border border-brand-border-light">
                        <h1 className="text-4xl font-serif font-bold text-brand-primary" dir="rtl">{selectedSurah.name}</h1>
                        <h2 className="text-2xl font-serif text-brand-text-dark">{selectedSurah.englishName}</h2>
                        <p className="text-brand-text-muted">{selectedSurah.englishNameTranslation}</p>
                        <div className="mt-2 text-sm text-brand-text-muted">
                            <span>{selectedSurah.revelationType}</span> &bull; <span>{selectedSurah.numberOfAyahs} Ayahs</span>
                        </div>
                    </div>

                    {isLoading && <div className="text-center py-10">Loading...</div>}
                    {error && <div className="text-center py-10 text-red-500">{error}</div>}
                    
                    {ayahs && (
                        <div className="space-y-4">
                            {ayahs.map((ayah) => (
                                <div key={ayah.verse} className="bg-white p-6 rounded-lg shadow-sm border border-brand-border-light">
                                    <div className="flex justify-between items-start mb-4">
                                        <span className="text-sm font-bold text-brand-primary bg-brand-secondary px-3 py-1 rounded-full">{selectedSurah.number}:{ayah.verse}</span>
                                        <button className="text-brand-primary hover:text-green-800">
                                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"></path></svg>
                                        </button>
                                    </div>
                                    <p className="text-3xl text-right font-serif text-brand-text-dark mb-4 leading-relaxed" dir="rtl">{ayah.arabic}</p>
                                    <p className="text-lg text-brand-text-muted">{ayah.bangla}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        );
    }


    return (
        <div className="bg-brand-light-bg">
            {/* Hero Section */}
            <section className="relative bg-brand-primary/10 py-16 text-center">
                <div className="absolute inset-0 bg-cover bg-center opacity-5" style={{ backgroundImage: "url('https://picsum.photos/seed/quran-bg/1200/400')" }}></div>
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
                    <h1 className="text-4xl font-bold font-serif text-brand-text-dark">কুরআনের সূরা সমূহ</h1>
                    <p className="mt-2 text-brand-text-muted">মোট সূরা - ১১৪ টি</p>
                    <div className="mt-6 max-w-2xl mx-auto">
                        <input
                            type="text"
                            placeholder="Search Surah (e.g., Fatihah, فاتحة, 1)"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-5 py-3 bg-white border border-brand-border-light rounded-lg shadow-sm focus:ring-brand-primary focus:border-brand-primary"
                        />
                    </div>
                </div>
            </section>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {/* Tabs */}
                <div className="flex border-b-2 border-brand-border-light mb-8">
                    <button
                        onClick={() => setActiveTab('Surahs')}
                        className={`px-6 py-3 font-semibold font-serif transition-colors ${activeTab === 'Surahs' ? 'border-b-2 border-brand-primary text-brand-primary' : 'text-brand-text-muted hover:text-brand-text-dark'}`}
                    >
                        সূরাসমূহ
                    </button>
                    <button
                        onClick={() => setActiveTab('Topics')}
                        className={`px-6 py-3 font-semibold font-serif transition-colors ${activeTab === 'Topics' ? 'border-b-2 border-brand-primary text-brand-primary' : 'text-brand-text-muted hover:text-brand-text-dark'}`}
                    >
                        বিষয়ভিত্তিক
                    </button>
                </div>

                {/* Content */}
                {activeTab === 'Surahs' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {filteredSurahs.map(surah => (
                           <SurahCard key={surah.number} surah={surah} onSelect={() => handleSurahSelect(surah)} />
                        ))}
                    </div>
                )}
                {activeTab === 'Topics' && (
                    <div className="text-center py-16 text-brand-text-muted">
                        <p>Topic-based search is coming soon.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Quran;
