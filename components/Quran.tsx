
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { surahs } from '../data/surahs';
import type { Surah, Ayah } from '../types';
import { getAyahAudio } from '../services/geminiService';

// Helper icon components
const PlayIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const LoadingSpinner = () => (
    <svg className="animate-spin h-6 w-6 text-brand-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

const BackIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
    </svg>
);


// Audio decoding functions from Gemini guidelines
function decode(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
): Promise<AudioBuffer> {
  // Gemini TTS provides raw PCM data at 24000Hz, mono.
  const sampleRate = 24000;
  const numChannels = 1;
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
    const [searchTerm, setSearchTerm] = useState('');
    const [playingAyah, setPlayingAyah] = useState<{verse: number, audio: AudioBufferSourceNode | null} | null>(null);
    const [loadingAudioVerse, setLoadingAudioVerse] = useState<number | null>(null);

    const audioContextRef = useRef<AudioContext | null>(null);

    useEffect(() => {
        if (!selectedSurah) return;

        const fetchAyahs = async () => {
            setIsLoading(true);
            setError(null);
            try {
                // Using a public Quran API to get Arabic text and Bengali translation
                const response = await fetch(`https://api.alquran.cloud/v1/surah/${selectedSurah.number}/editions/quran-uthmani,bn.bengali`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                
                const arabicAyahs = data.data[0].ayahs;
                const banglaAyahs = data.data[1].ayahs;

                const combinedAyahs: Ayah[] = arabicAyahs.map((ayah: any, index: number) => ({
                    verse: ayah.numberInSurah,
                    arabic: ayah.text,
                    bangla: banglaAyahs[index].text,
                }));

                setAyahs(combinedAyahs);
            } catch (e) {
                console.error("Failed to fetch ayahs:", e);
                setError('Failed to load Surah. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchAyahs();
    }, [selectedSurah]);

    const handlePlayAudio = async (ayah: Ayah) => {
        if (playingAyah?.verse === ayah.verse) {
             playingAyah.audio?.stop();
             setPlayingAyah(null);
             return;
        }

        if (playingAyah?.audio) {
            playingAyah.audio.stop();
        }

        setLoadingAudioVerse(ayah.verse);
        setPlayingAyah(null);

        try {
            const base64Audio = await getAyahAudio(ayah.arabic);
            
            if (!audioContextRef.current) {
                audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
            }
            const audioCtx = audioContextRef.current;
            const decodedBytes = decode(base64Audio);
            const audioBuffer = await decodeAudioData(decodedBytes, audioCtx);

            const source = audioCtx.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(audioCtx.destination);
            source.start();
            source.onended = () => {
                setPlayingAyah(null);
            };
            setPlayingAyah({ verse: ayah.verse, audio: source });

        } catch (err) {
            console.error("Failed to play audio:", err);
            alert("Could not play audio. Please check console for details.");
        } finally {
            setLoadingAudioVerse(null);
        }
    };

    const filteredSurahs = useMemo(() =>
        surahs.filter(surah =>
            surah.englishName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            surah.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            surah.number.toString().includes(searchTerm)
        ), [searchTerm]);

    if (selectedSurah) {
        return (
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fadeIn">
                <button
                    onClick={() => {
                        setSelectedSurah(null);
                        setAyahs([]);
                    }}
                    className="mb-6 flex items-center text-brand-primary font-semibold hover:underline"
                >
                    <BackIcon /> All Surahs
                </button>
                <div className="text-center mb-10">
                    <h1 className="text-4xl md:text-5xl font-bold font-serif text-brand-text-dark">{selectedSurah.name}</h1>
                    <h2 className="text-2xl text-brand-text-muted">{selectedSurah.englishName} - "{selectedSurah.englishNameTranslation}"</h2>
                    <p className="text-brand-text-muted mt-2">{selectedSurah.revelationType} &bull; {selectedSurah.numberOfAyahs} Ayahs</p>
                </div>

                {isLoading && <div className="text-center p-10"><LoadingSpinner /></div>}
                {error && <p className="text-center text-red-500">{error}</p>}
                
                <div className="space-y-4">
                    {ayahs.map((ayah) => (
                        <div key={ayah.verse} className="bg-white p-6 rounded-lg shadow-sm border border-brand-border-light">
                             <div className="flex justify-between items-center mb-4">
                                <span className="text-lg font-bold text-brand-primary bg-brand-light-bg px-3 py-1 rounded-md">{selectedSurah.number}:{ayah.verse}</span>
                                <button onClick={() => handlePlayAudio(ayah)} disabled={loadingAudioVerse === ayah.verse} className="text-brand-primary disabled:text-brand-text-muted">
                                    {loadingAudioVerse === ayah.verse ? <LoadingSpinner /> : <PlayIcon />}
                                </button>
                             </div>
                            <p className="text-3xl text-right font-quranic leading-relaxed text-brand-text-dark mb-4">{ayah.arabic}</p>
                            <p className="text-lg text-brand-text-muted">{ayah.bangla}</p>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-brand-light-bg py-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center animate-fadeInUp">
                    <h1 className="text-5xl font-extrabold tracking-tight font-serif">আল-কুরআন</h1>
                     <p className="mt-4 max-w-2xl mx-auto text-xl text-brand-text-muted">
                        Explore the divine revelations. Select a Surah to begin reading.
                    </p>
                    <div className="w-24 h-1 bg-brand-primary mx-auto mt-4 mb-6"></div>
                </div>

                <div className="my-8 max-w-xl mx-auto">
                    <input
                        type="text"
                        placeholder="Search for a Surah by name or number..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-3 bg-white border border-brand-border-light rounded-md shadow-sm focus:ring-brand-primary focus:border-brand-primary"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredSurahs.map(surah => (
                        <div
                            key={surah.number}
                            onClick={() => setSelectedSurah(surah)}
                            className="bg-white p-6 rounded-lg shadow-sm border border-brand-border-light hover:shadow-lg hover:border-brand-primary transition-all duration-300 cursor-pointer flex items-center justify-between"
                        >
                            <div className="flex items-center">
                                <span className="text-xl font-bold text-brand-primary bg-brand-light-bg w-12 h-12 flex items-center justify-center rounded-md mr-4">{surah.number}</span>
                                <div>
                                    <h3 className="text-xl font-bold font-serif text-brand-text-dark">{surah.englishName}</h3>
                                    <p className="text-sm text-brand-text-muted">{surah.englishNameTranslation}</p>
                                </div>
                            </div>
                            <h2 className="text-2xl font-quranic text-brand-text-dark">{surah.name}</h2>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Quran;
