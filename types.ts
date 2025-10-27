export type Page = 'Home' | 'About' | 'Projects' | 'Contact' | 'Dashboard' | 'Donate' | 'Login';

export interface Project {
  id: number;
  title: string;
  description: string;
  longDescription: string;
  image: string;
  goal: number;
  raised: number;
  status: 'Active' | 'Completed';
}

export interface NewsEvent {
  id: number;
  title: string;
  date: string;
  description: string;
  image: string;
}

export interface Stat {
    label: string;
    value: string;
    isCurrency?: boolean;
    numericValue?: number;
}

export interface DonationData {
    month: string;
    donations: number;
}