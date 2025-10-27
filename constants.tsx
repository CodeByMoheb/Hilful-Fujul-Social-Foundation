
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
