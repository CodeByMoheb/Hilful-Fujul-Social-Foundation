import React, { useState, useMemo } from 'react';
import { PROJECTS } from '../constants';
import type { Project } from '../types';

const ProjectCard: React.FC<{ project: Project }> = ({ project }) => {
    const percentage = Math.round((project.raised / project.goal) * 100);
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 flex flex-col group border border-brand-border-light hover:shadow-xl">
            <div className="relative overflow-hidden">
                <img src={project.image} alt={project.title} className="h-60 w-full object-cover group-hover:scale-105 transition-transform duration-500"/>
                <span className={`absolute top-4 right-4 px-3 py-1 text-xs font-semibold rounded-full ${project.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {project.status}
                </span>
            </div>
            <div className="p-6 flex flex-col flex-grow">
                <h3 className="mt-2 text-2xl font-bold text-brand-text-dark font-serif">{project.title}</h3>
                <p className="mt-2 text-brand-text-muted flex-grow">{project.longDescription}</p>
                <div className="mt-6">
                    <div className="flex justify-between items-center text-sm font-medium text-brand-text-muted">
                        <span>Raised: <span className="font-bold text-brand-text-dark">${project.raised.toLocaleString()}</span></span>
                        <span>Goal: <span className="font-bold text-brand-text-dark">${project.goal.toLocaleString()}</span></span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div className="bg-brand-primary h-2 rounded-full" style={{ width: `${percentage}%` }}></div>
                    </div>
                    <div className="text-right text-sm font-semibold text-brand-primary mt-1">{percentage}% Funded</div>
                </div>
                 <button className="mt-6 w-full bg-brand-primary text-white hover:bg-green-800 font-bold py-3 px-4 rounded-md shadow-sm transition-transform transform hover:scale-105">
                    Donate to this Project
                </button>
            </div>
        </div>
    );
};
const Projects: React.FC = () => {
    const [filter, setFilter] = useState<'All' | 'Active' | 'Completed'>('All');

    const filteredProjects = useMemo(() => {
        if (filter === 'All') return PROJECTS;
        return PROJECTS.filter(p => p.status === filter);
    }, [filter]);

    const FilterButton: React.FC<{ status: 'All' | 'Active' | 'Completed' }> = ({ status }) => (
        <button
            onClick={() => setFilter(status)}
            className={`px-6 py-2 rounded-md font-semibold text-sm transition-colors ${
                filter === status ? 'bg-brand-primary text-white shadow-sm' : 'bg-white text-brand-text-dark hover:bg-brand-light-bg border border-brand-border-light'
            }`}
        >
            {status}
        </button>
    );

    return (
        <div className="bg-brand-light-bg py-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center animate-fadeInUp">
                    <h1 className="text-5xl font-extrabold tracking-tight font-serif">Our Community Projects</h1>
                    <p className="mt-4 max-w-2xl mx-auto text-xl text-brand-text-muted">
                       Making a tangible difference, one project at a time.
                    </p>
                    <div className="w-24 h-1 bg-brand-primary mx-auto mt-4 mb-6"></div>
                </div>

                <div className="mt-10 flex justify-center space-x-4 animate-fadeInUp" style={{ animationDelay: '200ms' }}>
                    <FilterButton status="All" />
                    <FilterButton status="Active" />
                    <FilterButton status="Completed" />
                </div>

                <div className="mt-12 grid gap-10 md:grid-cols-2 lg:grid-cols-3">
                    {filteredProjects.map((project, index) => (
                        <div className="animate-fadeInUp" style={{animationDelay: `${index * 150 + 400}ms`}} key={project.id}>
                            <ProjectCard project={project} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Projects;