
export type Page = 'Home' | 'About' | 'Projects' | 'Contact' | 'Login' | 'Dashboard' | 'Quran' | 'Hadith' | 'PrayerTimes' | 'Masayel' | 'Dua' | 'Article';

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
