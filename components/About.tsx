import React, { useState, useEffect, useRef } from 'react';

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

const About: React.FC = () => {
    const teamMembers = [
        { name: 'Dr. Ahmad Hasan', role: 'Founder & President', image: 'https://picsum.photos/seed/team1/200/200' },
        { name: 'Fatima Khan', role: 'Director of Operations', image: 'https://picsum.photos/seed/team2/200/200' },
        { name: 'Yusuf Ali', role: 'Head of Community Outreach', image: 'https://picsum.photos/seed/team3/200/200' },
    ];

    const [headerRef, isHeaderVisible] = useAnimateOnScroll();
    const [historyRef, isHistoryVisible] = useAnimateOnScroll();
    const [teamRef, isTeamVisible] = useAnimateOnScroll();


    return (
        <div className="bg-white text-brand-text-dark">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div ref={headerRef} className={`text-center transition-all duration-700 ${isHeaderVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                    <h1 className="text-5xl font-extrabold tracking-tight font-serif">About HFSF</h1>
                    <p className="mt-4 max-w-2xl mx-auto text-xl text-brand-text-muted">
                        Learn about our journey, values, and the people dedicated to our cause.
                    </p>
                     <div className="w-24 h-1 bg-brand-primary mx-auto mt-4 mb-6"></div>
                </div>

                <div ref={historyRef} className="mt-16 grid md:grid-cols-2 gap-16 items-center">
                    <div className={`transition-all duration-700 ${isHistoryVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`} style={{transitionDelay: '200ms'}}>
                        <h2 className="text-4xl font-bold text-brand-text-dark font-serif">Our History & Vision</h2>
                        <p className="mt-4 text-lg text-brand-text-muted">
                            Hilful Fuzul Social Foundation was established in 2020, inspired by the historic alliance of justice and compassion formed in pre-Islamic Makkah. Our founders envisioned an organization that would revive this spirit of collective responsibility in the modern era.
                        </p>
                        <p className="mt-4 text-lg text-brand-text-muted">
                            Our vision is a world where every individual has the opportunity to live with dignity, purpose, and hope. We strive to create sustainable solutions for poverty, illiteracy, and social inequality, empowering communities to build a brighter future for themselves.
                        </p>
                    </div>
                    <div className={`rounded-lg overflow-hidden shadow-lg border border-brand-border-light transition-all duration-700 ${isHistoryVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`} style={{transitionDelay: '400ms'}}>
                        <img src="https://picsum.photos/seed/about/600/500" alt="Community gathering" className="w-full h-full object-cover"/>
                    </div>
                </div>
                
                <div ref={teamRef} className={`mt-24 transition-all duration-700 ${isTeamVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                    <h2 className="text-4xl font-bold text-center text-brand-text-dark font-serif">Meet Our Team</h2>
                    <div className="w-24 h-1 bg-brand-primary mx-auto mt-4 mb-6"></div>
                    <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                        {teamMembers.map((member, index) => (
                            <div key={member.name} className={`text-center group transition-all duration-700 ${isTeamVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{transitionDelay: `${index * 150}ms`}}>
                                <img className="w-40 h-40 mx-auto rounded-full shadow-lg border-4 border-brand-border-light group-hover:border-brand-primary transition-colors duration-300" src={member.image} alt={member.name} />
                                <h3 className="mt-6 text-2xl font-semibold font-serif">{member.name}</h3>
                                <p className="text-brand-primary">{member.role}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;