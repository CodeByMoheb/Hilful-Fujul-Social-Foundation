
import type { Project } from './types';

export const PROJECTS: Project[] = [
    {
        id: 1,
        title: 'Orphan Education Fund',
        image: 'https://picsum.photos/seed/project1/400/300',
        shortDescription: 'Providing quality education and a brighter future for orphaned children.',
        longDescription: 'Our Orphan Education Fund aims to break the cycle of poverty by providing scholarships, school supplies, and tutoring to orphaned children in underprivileged communities.',
        status: 'Active',
        goal: 50000,
        raised: 32500,
    },
    {
        id: 2,
        title: 'Community Iftar Program',
        image: 'https://picsum.photos/seed/project2/400/300',
        shortDescription: 'Sharing the blessings of Ramadan with those in need.',
        longDescription: 'Every Ramadan, we organize community iftars to provide warm, nutritious meals for fasting individuals and families, fostering a sense of community and solidarity.',
        status: 'Completed',
        goal: 15000,
        raised: 16200,
    },
    {
        id: 3,
        title: 'Clean Water Initiative',
        image: 'https://picsum.photos/seed/project3/400/300',
        shortDescription: 'Bringing safe and accessible drinking water to remote villages.',
        longDescription: 'Access to clean water is a basic human right. This project focuses on installing deep-water wells and purification systems in areas where water scarcity is a critical issue.',
        status: 'Active',
        goal: 75000,
        raised: 41000,
    },
    {
        id: 4,
        title: 'Winter Blanket Drive',
        image: 'https://picsum.photos/seed/project4/400/300',
        shortDescription: 'Providing warmth and comfort to the homeless during harsh winters.',
        longDescription: 'As temperatures drop, we distribute warm blankets, clothing, and hot meals to homeless individuals, offering them comfort and protection from the cold.',
        status: 'Completed',
        goal: 10000,
        raised: 11500,
    },
];

export const DONATION_CHART_DATA = [
    { month: 'Jan', donations: 4000 },
    { month: 'Feb', donations: 3000 },
    { month: 'Mar', donations: 5000 },
    { month: 'Apr', donations: 4500 },
    { month: 'May', donations: 6000 },
    { month: 'Jun', donations: 5500 },
];

export const MenuIcon = () => (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
    </svg>
);

export const CloseIcon = () => (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

export const BellIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
);

export const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0012 11z" clipRule="evenodd" />
    </svg>
);


export const donationBox = (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h7.5" />
        <path d="M16 19h6" />
        <path d="M19 16v6" />
        <path d="M3 10h18" />
        <path d="M12 15v-1" />
        <path d="M12 7V6" />
        <path d="M8 6v1" />
        <path d="M16 6v1" />
    </svg>
);
