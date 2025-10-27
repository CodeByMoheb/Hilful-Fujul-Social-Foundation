
import React from 'react';
import { PROJECTS } from '../constants';

const Home: React.FC = () => {
    return (
        <div className="bg-white text-brand-text-dark">
            {/* Hero Section */}
            <section className="relative bg-brand-light-bg pt-24 pb-32 text-center">
                 <div className="absolute inset-0 bg-cover bg-center opacity-10" style={{backgroundImage: "url('https://www.transparenttextures.com/patterns/islamic-style.png')"}}></div>
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight font-serif animate-fadeInUp">
                        Hilful Fuzul <span className="text-brand-primary">Social Foundation</span>
                    </h1>
                    <p className="mt-6 max-w-3xl mx-auto text-xl text-brand-text-muted animate-fadeInUp" style={{animationDelay: '200ms'}}>
                        Inspired by faith, driven by compassion. We are dedicated to serving humanity through charity, education, and community welfare.
                    </p>
                    <div className="mt-10 animate-fadeInUp" style={{animationDelay: '400ms'}}>
                        <button className="bg-brand-primary text-white hover:bg-green-800 font-bold py-4 px-10 rounded-md text-lg shadow-lg transition-transform transform hover:scale-105">
                            Support Our Cause
                        </button>
                    </div>
                </div>
            </section>

            {/* Our Mission Section */}
            <section className="py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h2 className="text-4xl font-bold font-serif">Our Core Missions</h2>
                        <div className="w-24 h-1 bg-brand-primary mx-auto mt-4 mb-10"></div>
                    </div>
                    <div className="grid md:grid-cols-3 gap-10 text-center">
                        <div className="p-6">
                           <div className="text-5xl text-brand-primary mb-4">🤝</div>
                           <h3 className="text-2xl font-semibold font-serif">Community Service</h3>
                           <p className="mt-2 text-brand-text-muted">Engaging in hands-on projects that uplift and support local communities.</p>
                        </div>
                        <div className="p-6">
                            <div className="text-5xl text-brand-primary mb-4">🎓</div>
                            <h3 className="text-2xl font-semibold font-serif">Education For All</h3>
                            <p className="mt-2 text-brand-text-muted">Providing educational opportunities to underprivileged children and adults.</p>
                        </div>
                        <div className="p-6">
                            <div className="text-5xl text-brand-primary mb-4">❤️</div>
                            <h3 className="text-2xl font-semibold font-serif">Welfare Projects</h3>
                            <p className="mt-2 text-brand-text-muted">Running initiatives for clean water, food security, and healthcare.</p>
                        </div>
                    </div>
                </div>
            </section>
            
            {/* Featured Projects Section */}
            <section className="bg-brand-light-bg py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h2 className="text-4xl font-bold font-serif">Featured Projects</h2>
                        <div className="w-24 h-1 bg-brand-primary mx-auto mt-4 mb-10"></div>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {PROJECTS.slice(0, 3).map((project) => (
                             <div key={project.id} className="bg-white rounded-lg shadow-md overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 border border-brand-border-light">
                                <img src={project.image} alt={project.title} className="h-56 w-full object-cover"/>
                                <div className="p-6">
                                    <h3 className="text-xl font-bold font-serif">{project.title}</h3>
                                    <p className="mt-2 text-brand-text-muted">{project.shortDescription}</p>
                                    <button className="mt-4 font-semibold text-brand-primary hover:text-green-800 transition-colors">Learn More &rarr;</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

        </div>
    );
};

export default Home;
