import React from 'react';
import type { Project, NewsEvent, Stat, DonationData } from './types';

export const LOGO_URL = "data:image/jpeg;base64,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";

export const PROJECTS: Project[] = [
  {
    id: 1,
    title: 'Community Iftar Program',
    description: 'Providing meals during Ramadan to families in need.',
    longDescription: 'Our annual Community Iftar Program aims to bring joy and relief during the holy month of Ramadan. We set up distribution points in various neighborhoods to provide hot, nutritious meals to families, the elderly, and anyone in need of a warm iftar.',
    image: 'https://picsum.photos/seed/project1/600/400',
    goal: 10000,
    raised: 7500,
    status: 'Active',
  },
  {
    id: 2,
    title: 'Orphan Education Support',
    description: 'Sponsoring the educational expenses of orphan children.',
    longDescription: 'Education is the key to a brighter future. Through this project, we identify orphan children in our community and sponsor their complete educational journey, including school fees, books, uniforms, and stationery. Our goal is to empower them to become self-reliant.',
    image: 'https://picsum.photos/seed/project2/600/400',
    goal: 25000,
    raised: 18000,
    status: 'Active',
  },
  {
    id: 3,
    title: 'Winter Blanket Drive',
    description: 'Distributing warm blankets to the homeless during winter.',
    longDescription: 'As winter approaches, many vulnerable individuals face the harsh cold without adequate protection. Our Winter Blanket Drive, completed last season, successfully distributed over 2,000 high-quality blankets to the homeless and those in inadequate shelters, providing essential warmth and comfort.',
    image: 'https://picsum.photos/seed/project3/600/400',
    goal: 5000,
    raised: 5000,
    status: 'Completed',
  },
  {
    id: 4,
    title: 'Clean Water Well Installation',
    description: 'Building wells in remote villages to provide access to clean water.',
    longDescription: 'Access to clean drinking water is a basic human right. This ongoing project focuses on identifying remote villages with water scarcity and installing deep tube wells. Each well serves hundreds of people, drastically reducing waterborne diseases and improving overall community health.',
    image: 'https://picsum.photos/seed/project4/600/400',
    goal: 15000,
    raised: 9500,
    status: 'Active',
  },
];

export const NEWS_EVENTS: NewsEvent[] = [
    {
        id: 1,
        title: 'Annual Fundraising Gala 2024',
        date: 'October 25, 2024',
        description: 'Join us for an evening of inspiration and generosity as we share our successes and future plans.',
        image: 'https://picsum.photos/seed/event1/600/400',
    },
    {
        id: 2,
        title: 'Volunteer Appreciation Day',
        date: 'September 10, 2024',
        description: 'A special day to honor and thank our dedicated volunteers who make our work possible.',
        image: 'https://picsum.photos/seed/event2/600/400',
    }
];

export const IMPACT_STATS: Stat[] = [
    { label: 'Families Supported', value: '1,200+', numericValue: 1200 },
    { label: 'Projects Completed', value: '25+', numericValue: 25 },
    { label: 'Volunteers Engaged', value: '300+', numericValue: 300 },
    { label: 'Funds Raised', value: '$250k+', isCurrency: true, numericValue: 250000 },
];

export const DONATION_CHART_DATA: DonationData[] = [
  { month: 'Jan', donations: 4000 },
  { month: 'Feb', donations: 3000 },
  { month: 'Mar', donations: 5000 },
  { month: 'Apr', donations: 4500 },
  { month: 'May', donations: 6000 },
  { month: 'Jun', donations: 5500 },
];


export const Icons = {
    menu: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 6h16M4 12h16m-7 6h7"
        />
      </svg>
    ),
    close: (
        <svg 
            className="w-6 h-6" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
        >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
    ),
    bell: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
    ),
    user: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
        </svg>
    ),
};