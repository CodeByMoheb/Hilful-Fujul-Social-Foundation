import React, { useState, useEffect, useMemo, useRef } from 'react';
import { surahs } from '../data/surahs';
import type { Surah, Ayah } from '../types';
import { getAyahAudio } from '../services/geminiService';

// --- Audio Decoding Helpers ---

function decodeBase64(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodePcmAudioData(
  data: Uint8Array,
  ctx: AudioContext,
): Promise<AudioBuffer> {
  const sampleRate = 24000; // Gemini TTS default sample rate
  const numChannels = 1;
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
  const channelData = buffer.getChannelData(0);
  for (let i = 0; i < frameCount; i++) {
    channelData[i] = dataInt16[i] / 32768.0;
  }
  return buffer;
}


const Quran: React.FC = () => {
    const [selectedSurah, setSelectedSurah] = useState<Surah | null>(null);
    const [ayahs, setAyahs] = useState<Ayah[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    // --- Audio State ---
    const [playingVerse, setPlayingVerse] = useState<number | null>(null);
    const [loadingVerse, setLoadingVerse] = useState<number | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);
    
    // --- Effects for fetching and cleanup ---

    useEffect(() => {
        // Initialize AudioContext on first interaction
        if (!audioContextRef.current) {
            // FIX: Cast window to `any` to allow access to vendor-prefixed `webkitAudioContext` for older browser compatibility.
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }

        // Cleanup audio when component unmounts
        return () => {
            if (audioSourceRef.current) {
                audioSourceRef.current.stop();
            }
            if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
                audioContextRef.current.close();
            }
        };
    }, []);

    useEffect(() => {
        if (selectedSurah) {
            const fetchAyahs = async () => {
                setIsLoading(true);
                setError(null);
                setAyahs([]);
                try {
                    const response = await fetch(`https://api.alquran.cloud/v1/surah/${selectedSurah.number}/editions/quran-uthmani,bn.bengali`);
                    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                    
                    const data = await response.json();
                    if (data.code !== 200 || !data.data || data.data.length < 2) throw new Error('Invalid API response format.');
                    
                    const arabicAyahs = data.data[0].ayahs;
                    const banglaAyahs = data.data[1].ayahs;

                    const formattedAyahs: Ayah[] = arabicAyahs.map((ayah: any, index: number) => ({
                        verse: ayah.numberInSurah,
                        arabic: ayah.text,
                        bangla: banglaAyahs[index].text,
                    }));

                    setAyahs(formattedAyahs);

                } catch (e) {
                    console.error("Failed to fetch ayahs:", e);
                    setError("Could not load the Surah. Please try again later.");
                } finally {
                    setIsLoading(false);
                }
            };
            fetchAyahs();
        }
         // Stop any playing audio when the surah changes
        if (audioSourceRef.current) {
            audioSourceRef.current.stop();
            setPlayingVerse(null);
        }

    }, [selectedSurah]);

    const handlePlayAudio = async (ayah: Ayah) => {
        // Stop currently playing audio if any
        if (audioSourceRef.current) {
            audioSourceRef.current.stop();
            audioSourceRef.current = null;
            // If the same verse was clicked, just stop it.
            if (playingVerse === ayah.verse) {
                setPlayingVerse(null);
                return;
            }
        }

        if (!audioContextRef.current) return;
        if (audioContextRef.current.state === 'suspended') {
            audioContextRef.current.resume();
        }
        
        setPlayingVerse(null);
        setLoadingVerse(ayah.verse);

        try {
            const base64Audio = await getAyahAudio(ayah.arabic);
            const audioBytes = decodeBase64(base64Audio);
            const audioBuffer = await decodePcmAudioData(audioBytes, audioContextRef.current);
            
            const source = audioContextRef.current.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(audioContextRef.current.destination);
            source.start();
            
            source.onended = () => {
                setPlayingVerse(null);
                audioSourceRef.current = null;
            };

            audioSourceRef.current = source;
            setPlayingVerse(ayah.verse);

        } catch (err) {
            console.error("Failed to play audio:", err);
            alert("Sorry, could not play the recitation for this verse.");
        } finally {
            setLoadingVerse(null);
        }
    };

    const filteredSurahs = useMemo(() => {
        return surahs.filter(surah => 
            surah.englishName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            surah.englishNameTranslation.toLowerCase().includes(searchTerm.toLowerCase()) ||
            surah.name.includes(searchTerm) ||
            String(surah.number).includes(searchTerm)
        );
    }, [searchTerm]);

    // --- UI Components ---

    const SurahListItem: React.FC<{ surah: Surah }> = ({ surah }) => (
        <li 
            className="border-b border-brand-border-light last:border-b-0"
            onClick={() => setSelectedSurah(surah)}
        >
            <div className={`flex items-center justify-between p-4 hover:bg-brand-secondary cursor-pointer transition-colors duration-200 ${selectedSurah?.number === surah.number ? 'bg-brand-secondary' : ''}`}>
                <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 flex items-center justify-center bg-brand-light-bg rounded-md text-brand-primary font-bold">
                        {surah.number}
                    </div>
                    <div>
                        <p className="font-semibold text-brand-text-dark">{surah.englishName}</p>
                        <p className="text-sm text-brand-text-muted">{surah.englishNameTranslation}</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="font-serif text-lg text-brand-text-dark">{surah.name}</p>
                    <p className="text-xs text-brand-text-muted">{surah.revelationType} - {surah.numberOfAyahs} Ayahs</p>
                </div>
            </div>
        </li>
    );

    const AyahView: React.FC = () => (
        <div className="bg-white p-6 rounded-lg shadow-inner border border-brand-border-light">
             <div className="border-b border-brand-border-light pb-4 mb-4">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-3xl font-serif text-brand-primary">{selectedSurah?.englishName}</h2>
                        <p className="text-brand-text-muted">{selectedSurah?.englishNameTranslation}</p>
                    </div>
                    <h2 className="text-4xl font-serif text-brand-text-dark">{selectedSurah?.name}</h2>
                </div>
                {selectedSurah?.number !== 1 && selectedSurah?.number !== 9 && (
                     <p className="text-center text-2xl font-serif mt-6 text-brand-text-dark">بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</p>
                )}
            </div>
            
            {isLoading && <p className="text-center p-8 text-brand-text-muted">Loading...</p>}
            {error && <p className="text-center p-8 text-red-500">{error}</p>}
            
            <ul className="space-y-6">
                {ayahs.map((ayah) => (
                    <li key={ayah.verse} className="border-b border-brand-border-light/50 pb-6 last:border-0">
                        <div className="flex justify-between items-start">
                            <button onClick={() => handlePlayAudio(ayah)} className="mt-2 w-10 h-10 flex items-center justify-center rounded-full text-brand-primary hover:bg-brand-secondary transition-colors" aria-label={`Play audio for verse ${ayah.verse}`}>
                                {loadingVerse === ayah.verse ? (
                                    <svg className="animate-spin h-5 w-5 text-brand-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                ) : playingVerse === ayah.verse ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1zm4 0a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                    </svg>
                                )}
                            </button>
                            <p className="flex-1 text-right text-3xl font-serif leading-relaxed text-brand-text-dark mb-3 ml-4">
                               {ayah.arabic} <span className="text-lg font-sans text-brand-primary">({ayah.verse})</span>
                            </p>
                        </div>
                        <p className="text-lg text-brand-text-muted pl-14">{ayah.bangla}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
    
    return (
        <div className="bg-brand-light-bg py-12 min-h-screen">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-10">
                    <h1 className="text-5xl font-extrabold tracking-tight font-serif text-brand-text-dark">Al-Quran</h1>
                    <p className="mt-4 max-w-2xl mx-auto text-xl text-brand-text-muted">
                        Explore the divine revelations.
                    </p>
                    <div className="w-24 h-1 bg-brand-primary mx-auto mt-4"></div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Surah List */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24">
                             <input 
                                type="text"
                                placeholder="Search Surah by name or number..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-4 py-3 mb-4 bg-white border border-brand-border-light rounded-md shadow-sm focus:ring-brand-primary focus:border-brand-primary"
                            />
                            <div className="bg-white rounded-lg shadow-md border border-brand-border-light max-h-[70vh] overflow-y-auto">
                                <ul>
                                    {filteredSurahs.length > 0 ? (
                                        filteredSurahs.map(surah => <SurahListItem key={surah.number} surah={surah} />)
                                    ) : (
                                        <li className="p-4 text-center text-brand-text-muted">No Surahs found.</li>
                                    )}
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Ayah Display */}
                    <div className="lg:col-span-2">
                        {selectedSurah ? (
                            <AyahView />
                        ) : (
                            <div className="flex items-center justify-center h-full bg-white p-6 rounded-lg shadow-inner border border-brand-border-light text-center">
                                <p className="text-xl text-brand-text-muted">Select a Surah from the list to read.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Quran;