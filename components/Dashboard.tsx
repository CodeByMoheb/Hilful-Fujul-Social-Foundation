import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DONATION_CHART_DATA, PROJECTS } from '../constants';
import { generateSuccessStory } from '../services/geminiService';

const StatCard: React.FC<{ title: string; value: string; change: string; changeType: 'increase' | 'decrease' }> = ({ title, value, change, changeType }) => (
    <div className="bg-white p-6 rounded-lg shadow-md border border-brand-border-light">
        <h3 className="text-sm font-medium text-brand-text-muted">{title}</h3>
        <p className="text-3xl font-bold text-brand-text-dark mt-1">{value}</p>
        <p className={`mt-2 text-sm ${changeType === 'increase' ? 'text-green-600' : 'text-red-600'}`}>
            {change} from last month
        </p>
    </div>
);

const Dashboard: React.FC = () => {
    const [selectedProject, setSelectedProject] = useState(PROJECTS[0]?.title || '');
    const [storyTopic, setStoryTopic] = useState('');
    const [generatedStory, setGeneratedStory] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleGenerateStory = async () => {
        if (!selectedProject || !storyTopic) {
            alert('Please select a project and provide a topic.');
            return;
        }
        setIsLoading(true);
        setGeneratedStory('');
        try {
            const story = await generateSuccessStory(selectedProject, storyTopic);
            setGeneratedStory(story);
        } catch (error) {
            console.error('Error generating story:', error);
            setGeneratedStory('Failed to generate story. Please check the console for details.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-brand-light-bg min-h-screen text-brand-text-dark">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h1 className="text-4xl font-bold font-serif">Admin Dashboard</h1>
                
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard title="Total Donations" value="$32,450" change="+12.5%" changeType="increase" />
                    <StatCard title="New Volunteers" value="18" change="+5" changeType="increase" />
                    <StatCard title="Active Projects" value="4" change="-1" changeType="decrease" />
                    <StatCard title="Funds Distributed" value="$21,800" change="+8.2%" changeType="increase" />
                </div>

                <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md border border-brand-border-light">
                        <h2 className="text-xl font-semibold mb-4 font-serif">Donation Trends (Last 6 Months)</h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={DONATION_CHART_DATA}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                                <XAxis dataKey="month" tick={{ fill: '#6c757d' }} />
                                <YAxis tick={{ fill: '#6c757d' }} />
                                <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #dee2e6' }} />
                                <Legend wrapperStyle={{ color: '#212529' }}/>
                                <Bar dataKey="donations" fill="#0A6847" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md border border-brand-border-light">
                        <h2 className="text-xl font-semibold mb-4 font-serif">Recent Activity</h2>
                        <ul className="space-y-4 text-brand-text-muted">
                           <li className="text-sm"><strong className="text-brand-text-dark">Aisha Rahman</strong> donated $100 to 'Orphan Education'.</li>
                           <li className="text-sm">New volunteer registration: <strong className="text-brand-text-dark">Ali Ahmed</strong>.</li>
                           <li className="text-sm"><strong className="text-brand-text-dark">Winter Blanket Drive</strong> project marked as completed.</li>
                           <li className="text-sm"><strong className="text-brand-text-dark">Fatima Khan</strong> donated $50 to 'Community Iftar'.</li>
                        </ul>
                    </div>
                </div>

                {/* Gemini Success Story Generator */}
                <div className="mt-8 bg-white p-6 rounded-lg shadow-md border border-brand-border-light">
                    <h2 className="text-xl font-semibold mb-4 font-serif">Success Story Generator</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="project-select" className="block text-sm font-medium text-brand-text-muted">Select Project</label>
                            <select
                                id="project-select"
                                value={selectedProject}
                                onChange={(e) => setSelectedProject(e.target.value)}
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base bg-brand-light-bg border-brand-border-light focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm rounded-md"
                            >
                                {PROJECTS.map(p => <option key={p.id}>{p.title}</option>)}
                            </select>
                             <label htmlFor="story-topic" className="block text-sm font-medium text-brand-text-muted mt-4">Key points or topic</label>
                             <textarea
                                id="story-topic"
                                rows={3}
                                value={storyTopic}
                                onChange={(e) => setStoryTopic(e.target.value)}
                                placeholder="e.g., How a family benefited, impact on a student, a volunteer's experience..."
                                className="mt-1 block w-full p-2 bg-brand-light-bg border border-brand-border-light rounded-md shadow-sm focus:ring-brand-primary focus:border-brand-primary"
                            />
                            <button
                                onClick={handleGenerateStory}
                                disabled={isLoading}
                                className="mt-4 w-full bg-brand-primary text-white font-bold py-2 px-4 rounded-md hover:bg-green-800 disabled:bg-brand-text-muted transition-colors"
                            >
                                {isLoading ? 'Generating...' : 'Generate Story'}
                            </button>
                        </div>
                        <div>
                             <h3 className="text-lg font-semibold font-serif">Generated Story:</h3>
                             <div className="mt-2 p-4 h-56 bg-brand-light-bg rounded-md border border-brand-border-light overflow-y-auto whitespace-pre-wrap text-brand-text-muted">
                                {generatedStory || 'Your generated success story will appear here...'}
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Dashboard;