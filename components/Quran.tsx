import React, { useState, useEffect, useRef } from 'react';
import { surahs } from '../data/surahs';
import type { Surah, Ayah } from '../types';
import { getAyahAudio } from '../services/geminiService';

// Helper function to decode base64 string to bytes, as required for raw audio data.
function decode(base64: string) {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
}

// Helper function to decode raw PCM audio data into an AudioBuffer for playback.
async function decodeAudioData(
    data: Uint8Array,
    ctx: AudioContext,
    sampleRate: number,
    numChannels: number,
): Promise<AudioBuffer> {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

    for (let channel = 0; channel < numChannels; channel++) {
        const channelData = buffer.getChannelData(channel);
        for (let i = 0; i < frameCount; i++) {
            channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
        }
    }
    return buffer;
}


const Quran: React.FC = () => {
    const [selectedSurah, setSelectedSurah] = useState<Surah | null>(null);
    const [ayahs, setAyahs] = useState<Ayah[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [audioLoadingAyah, setAudioLoadingAyah] = useState<number | null>(null);
    const [isListeningToAll, setIsListeningToAll] = useState(false);

    const audioContextRef = useRef<AudioContext | null>(null);
    const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);
    const listenToAllRef = useRef(false);

    useEffect(() => {
        listenToAllRef.current = isListeningToAll;
    }, [isListeningToAll]);

    useEffect(() => {
        // Initialize AudioContext. The sample rate matches the Gemini TTS output.
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });

        return () => {
            audioContextRef.current?.close();
        };
    }, []);


    useEffect(() => {
        if (selectedSurah) {
            const fetchAyahs = async () => {
                setIsLoading(true);
                setError(null);
                setAyahs([]);
                try {
                    // Using a public API to get Quran text in Arabic and Bengali translation.
                    const response = await fetch(`https://api.alquran.cloud/v1/surah/${selectedSurah.number}/editions/quran-uthmani,bn.bengali`);
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    const data = await response.json();
                    
                    if (data.code !== 200) {
                        throw new Error(data.data || 'Failed to fetch Surah data.');
                    }

                    const arabicAyahs = data.data[0].ayahs;
                    const banglaAyahs = data.data[1].ayahs;

                    const combinedAyahs: Ayah[] = arabicAyahs.map((ayah: any, index: number) => ({
                        verse: ayah.numberInSurah,
                        arabic: ayah.text,
                        bangla: banglaAyahs[index].text,
                    }));
                    
                    setAyahs(combinedAyahs);

                } catch (err) {
                    const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
                    setError(errorMessage);
                    console.error("Failed to fetch Ayahs:", err);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchAyahs();
        }
    }, [selectedSurah]);

    const playAudio = async (arabicText: string, verseNumber: number, isFromSequence: boolean = false) => {
        if (!isFromSequence) {
            // If a user clicks a specific Ayah, always stop any "Listen All" sequence.
            setIsListeningToAll(false);
        }

        if (audioSourceRef.current) {
            audioSourceRef.current.stop();
        }

        if (!audioContextRef.current) return;
        if (audioContextRef.current.state === 'suspended') {
            await audioContextRef.current.resume();
        }
        
        setAudioLoadingAyah(verseNumber);
        setError(null);
        try {
            const base64Audio = await getAyahAudio(arabicText);
            const audioBytes = decode(base64Audio);
            // Use custom decoder for raw PCM audio from Gemini
            const audioBuffer = await decodeAudioData(audioBytes, audioContextRef.current, 24000, 1);
            
            const source = audioContextRef.current.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(audioContextRef.current.destination);
            source.start();

            audioSourceRef.current = source;
            source.onended = () => {
                setAudioLoadingAyah(null);
                if (audioSourceRef.current === source) {
                    audioSourceRef.current = null;
                }

                if (listenToAllRef.current) {
                    const currentAyahIndex = ayahs.findIndex(a => a.verse === verseNumber);
                    if (currentAyahIndex !== -1 && currentAyahIndex < ayahs.length - 1) {
                        const nextAyah = ayahs[currentAyahIndex + 1];
                        playAudio(nextAyah.arabic, nextAyah.verse, true);
                    } else {
                        setIsListeningToAll(false);
                    }
                }
            };

        } catch (err) {
            console.error('Failed to play audio:', err);
            setError('Could not play audio. See console for details.');
            setAudioLoadingAyah(null);
            setIsListeningToAll(false);
        }
    };

    const stopAllPlayback = () => {
        setIsListeningToAll(false);
        if (audioSourceRef.current) {
            audioSourceRef.current.stop();
        } else {
            setAudioLoadingAyah(null);
        }
    };

    const togglePlayAll = () => {
        if (isListeningToAll) {
            stopAllPlayback();
        } else {
            if (ayahs.length > 0) {
                setIsListeningToAll(true);
                playAudio(ayahs[0].arabic, ayahs[0].verse, true);
            }
        }
    };
    
    // Renders the detailed view for a selected Surah
    if (selectedSurah) {
        let playAllButtonText = 'Listen to Full Surah';
        if (isListeningToAll) {
            playAllButtonText = audioLoadingAyah !== null ? 'Loading...' : 'Stop Listening';
        }

        return (
            <div className="bg-brand-light-bg min-h-screen">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <button onClick={() => setSelectedSurah(null)} className="mb-6 bg-white border border-brand-border-light text-brand-text-dark px-4 py-2 rounded-lg font-semibold hover:bg-brand-secondary transition-colors">
                        &larr; Back to Surah List
                    </button>
                    <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg border border-brand-border-light">
                        <div className="text-center mb-8">
                            <h1 className="text-4xl lg:text-5xl font-serif font-bold text-brand-text-dark">{selectedSurah.name}</h1>
                            <h2 className="text-2xl lg:text-3xl font-serif text-brand-primary">{selectedSurah.englishName}</h2>
                            <p className="text-lg text-brand-text-muted">{selectedSurah.englishNameTranslation}</p>
                            <p className="text-sm text-brand-text-muted mt-1">{selectedSurah.revelationType} &bull; {selectedSurah.numberOfAyahs} Ayahs</p>
                            <div className="mt-6">
                                <button
                                    onClick={togglePlayAll}
                                    disabled={isLoading || (isListeningToAll && audioLoadingAyah !== null)}
                                    className="bg-brand-primary text-white font-bold py-3 px-8 rounded-lg shadow-sm hover:bg-green-800 transition-colors disabled:bg-brand-text-muted disabled:cursor-not-allowed"
                                >
                                    {playAllButtonText}
                                </button>
                            </div>
                        </div>

                        {isLoading && <div className="text-center p-8 text-brand-text-muted">Loading Ayahs...</div>}
                        {error && <div className="text-center p-8 text-red-500 bg-red-50 rounded-md">Error: {error}</div>}

                        {!isLoading && !error && (
                            <div className="space-y-8">
                                {ayahs.map(ayah => (
                                    <div key={ayah.verse} className="border-b border-brand-border-light pb-6 last:border-b-0">
                                        <div className="flex justify-between items-center mb-4">
                                            <span className="text-lg font-bold text-brand-primary">{selectedSurah.number}:{ayah.verse}</span>
                                            <button onClick={() => playAudio(ayah.arabic, ayah.verse)} disabled={audioLoadingAyah === ayah.verse} className="p-2 rounded-full hover:bg-brand-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                                                {audioLoadingAyah === ayah.verse ? (
                                                    <svg className="animate-spin h-6 w-6 text-brand-primary" xmlns="http://www.w.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                                ) : (
                                                    <svg xmlns="http://www.w.org/2000/svg" className="h-6 w-6 text-brand-primary" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
                                                )}
                                            </button>
                                        </div>
                                        <p className="text-3xl text-right font-serif mb-4 leading-relaxed text-brand-text-dark">{ayah.arabic}</p>
                                        <p className="text-lg text-brand-text-muted">{ayah.bangla}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // Renders the main list of all Surahs
    return (
        <div className="bg-brand-light-bg py-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center animate-fadeInUp">
                    <h1 className="text-5xl font-extrabold tracking-tight font-serif">Al-Quran</h1>
                    <p className="mt-4 max-w-2xl mx-auto text-xl text-brand-text-muted">
                        Browse and read the Holy Quran with translations and recitation.
                    </p>
                    <div className="w-24 h-1 bg-brand-primary mx-auto mt-4 mb-6"></div>
                </div>

                <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {surahs.map(surah => (
                        <div key={surah.number} onClick={() => setSelectedSurah(surah)} className="bg-white p-5 rounded-lg shadow-sm border border-brand-border-light hover:shadow-lg hover:border-brand-primary cursor-pointer transition-all flex items-center justify-between group">
                            <div className="flex items-center">
                                <span className="flex items-center justify-center h-12 w-12 bg-brand-secondary text-brand-primary font-bold rounded-md mr-4 group-hover:bg-brand-primary group-hover:text-white transition-colors">{surah.number}</span>
                                <div>
                                    <h2 className="text-lg font-semibold font-serif text-brand-text-dark">{surah.englishName}</h2>
                                    <p className="text-sm text-brand-text-muted">{surah.englishNameTranslation}</p>
                                </div>
                            </div>
                            <h3 className="text-xl font-serif text-brand-primary">{surah.name}</h3>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Quran;