import React, { useState, useEffect, useRef } from 'react';
import { PROJECTS, IMPACT_STATS, NEWS_EVENTS } from '../constants';
import type { Page } from '../types';

const useAnimateOnScroll = (threshold = 0.1) => {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(entry.target);
                }
            },
            { threshold }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if(ref.current) {
                observer.unobserve(ref.current);
            }
        };
    }, []);

    return [ref, isVisible] as const;
};

const AnimatedCounter: React.FC<{ target: number, isCurrency?: boolean, suffix: string }> = ({ target, isCurrency = false, suffix }) => {
    const [count, setCount] = useState(0);
    const [ref, isVisible] = useAnimateOnScroll();

    const formatNumber = (num: number) => {
      if (isCurrency) {
        return `$${Math.floor(num / 1000)}k`;
      }
      return Math.floor(num).toLocaleString();
    };

    useEffect(() => {
        if (isVisible) {
            let start = 0;
            const end = target;
            if (start === end) return;

            const duration = 2000;
            let stepTime = Math.abs(Math.floor(duration / end));
            if(end > 500) stepTime = 1;


            const timer = setInterval(() => {
                start += 1;
                if (start > end) {
                    setCount(end);
                    clearInterval(timer);
                } else {
                    setCount(start);
                }
            }, stepTime);
            return () => clearInterval(timer);
        }
    }, [isVisible, target]);

    return (
        <p ref={ref as React.RefObject<HTMLParagraphElement>} className="text-5xl font-extrabold text-brand-primary font-serif">
            {formatNumber(count)}{suffix.replace(/\d+/g, '').replace('k','').replace('$', '')}
        </p>
    );
};


const Home: React.FC<{ setCurrentPage: (page: Page) => void }> = ({ setCurrentPage }) => {
    const featuredProjects = PROJECTS.filter(p => p.status === 'Active').slice(0, 3);
    const [activeTab, setActiveTab] = useState<'mission' | 'vision'>('mission');
    
    const [tabRef, isTabVisible] = useAnimateOnScroll();
    const [projectsRef, isProjectsVisible] = useAnimateOnScroll();
    const [impactRef, isImpactVisible] = useAnimateOnScroll();

    const TabButton: React.FC<{ tabId: 'mission' | 'vision'; title: string }> = ({ tabId, title }) => (
        <button
            onClick={() => setActiveTab(tabId)}
            className={`w-1/2 py-4 text-center font-serif text-xl font-bold transition-colors duration-300 border-b-4 ${
                activeTab === tabId 
                ? 'border-brand-primary text-brand-primary' 
                : 'border-transparent text-brand-text-muted hover:text-brand-text-dark'
            }`}
        >
            {title}
        </button>
    );

    return (
        <div className="bg-brand-light-bg">
            
            {/* Tabbed Content Section */}
            <section ref={tabRef} className="py-20">
                <div className={`container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl transition-all duration-700 ${isTabVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                    <div className="bg-white rounded-lg shadow-lg border border-brand-border-light overflow-hidden">
                        <div className="flex">
                           <TabButton tabId="mission" title="Our Mission"/>
                           <TabButton tabId="vision" title="Community Updates"/>
                        </div>
                        <div className="p-8 md:p-12">
                            {activeTab === 'mission' && (
                                <div className="animate-fadeInUp">
                                    <h2 className="text-3xl font-bold text-brand-text-dark font-serif">Guiding Principles</h2>
                                    <p className="mt-4 text-lg text-brand-text-muted">
                                       To build a compassionate and self-reliant society by providing essential services in education, healthcare, and social welfare, guided by the principles of trust, transparency, and community spirit.
                                    </p>
                                </div>
                            )}
                            {activeTab === 'vision' && (
                                <div className="animate-fadeInUp">
                                    <h2 className="text-3xl font-bold text-brand-text-dark font-serif">Latest News & Events</h2>
                                    <ul className="mt-4 space-y-4">
                                      {NEWS_EVENTS.map(event => (
                                        <li key={event.id} className="text-lg text-brand-text-muted">
                                          <strong className="text-brand-primary">{event.date}:</strong> {event.title}
                                        </li>
                                      ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
            
             {/* Featured Projects Section */}
            <section ref={projectsRef} className="py-20 bg-white border-y border-brand-border-light">
                 <div className={`container mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-700 ${isProjectsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                    <h2 className="text-4xl font-bold text-center text-brand-text-dark font-serif">Featured Projects</h2>
                     <div className="w-24 h-1 bg-brand-primary mx-auto mt-4 mb-6"></div>
                    <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {featuredProjects.map((project, index) => (
                            <div key={project.id} className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 group hover:shadow-2xl hover:-translate-y-2 border border-brand-border-light">
                                <div className="overflow-hidden"><img src={project.image} alt={project.title} className="h-64 w-full object-cover group-hover:scale-105 transition-transform duration-500"/></div>
                                <div className="p-6">
                                    <h3 className="text-2xl font-bold text-brand-text-dark font-serif">{project.title}</h3>
                                    <p className="mt-2 text-brand-text-muted h-16">{project.description}</p>
                                    <button onClick={() => setCurrentPage('Projects')} className="mt-6 text-brand-primary hover:text-green-800 font-bold">Learn More &rarr;</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Impact Stats Section */}
            <section ref={impactRef} className="py-20 bg-brand-light-bg">
                 <div className={`container mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-700 ${isImpactVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                     <h2 className="text-4xl font-bold text-center text-brand-text-dark font-serif">Our Impact</h2>
                      <div className="w-24 h-1 bg-brand-primary mx-auto mt-4 mb-6"></div>
                    <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        {IMPACT_STATS.map(stat => (
                            <div key={stat.label}>
                                <AnimatedCounter target={stat.numericValue!} isCurrency={stat.isCurrency} suffix={stat.value.slice(-1)} />
                                <p className="mt-2 text-lg text-brand-text-muted">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;