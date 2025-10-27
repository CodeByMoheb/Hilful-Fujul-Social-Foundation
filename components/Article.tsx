
import React from 'react';

const Article: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-20 text-center">
      <h1 className="text-5xl font-extrabold tracking-tight font-serif">Articles</h1>
      <p className="mt-4 max-w-2xl mx-auto text-xl text-brand-text-muted">
        Read insightful articles on various Islamic topics. This section is currently under development.
      </p>
      <div className="w-24 h-1 bg-brand-primary mx-auto mt-4 mb-6"></div>
    </div>
  );
};

export default Article;
