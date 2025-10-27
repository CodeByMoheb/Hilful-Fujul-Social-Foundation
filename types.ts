export type Page =
    | 'Home'
    | 'About'
    | 'Projects'
    | 'Contact'
    | 'Login'
    | 'Dashboard'
    | 'Quran'
    | 'Hadith'
    | 'PrayerTimes'
    | 'Masayel'
    | 'Dua'
    | 'Article'
    | 'কুরআন'
    | 'হাদীস'
    | 'নামাজের সময়'
    | 'মাসায়ালা'
    | 'দু\'আ'
    | 'প্রবন্ধ';


export interface Project {
    id: number;
    title: string;
    image: string;
    shortDescription: string;
    longDescription: string;
    status: 'Active' | 'Completed';
    goal: number;
    raised: number;
}

export interface Surah {
    number: number;
    name: string;
    englishName: string;
    englishNameTranslation: string;
    revelationType: 'Meccan' | 'Medinan';
    numberOfAyahs: number;
}

export interface Ayah {
  verse: number;
  arabic: string;
  bangla: string;
}