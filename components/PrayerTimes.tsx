
import React from 'react';

const PrayerTimes: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-20 text-center">
      <h1 className="text-5xl font-extrabold tracking-tight font-serif">Prayer Times</h1>
      <p className="mt-4 max-w-2xl mx-auto text-xl text-brand-text-muted">
        Find accurate prayer times for your location. This feature is currently under development.
      </p>
      <div className="w-24 h-1 bg-brand-primary mx-auto mt-4 mb-6"></div>
    </div>
  );
};

export default PrayerTimes;
