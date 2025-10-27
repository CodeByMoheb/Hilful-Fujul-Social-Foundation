import React, { useState } from 'react';
import type { Page } from '../types';

interface LoginProps {
    setIsLoggedIn: (isLoggedIn: boolean) => void;
    setCurrentPage: (page: Page) => void;
}

const Login: React.FC<LoginProps> = ({ setIsLoggedIn, setCurrentPage }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Mock authentication
        if (username === 'admin' && password === 'password') {
            setError('');
            setIsLoggedIn(true);
            setCurrentPage('Dashboard');
        } else {
            setError('Invalid username or password.');
        }
    };

    return (
        <div className="bg-brand-light-bg py-20 flex items-center justify-center min-h-[70vh]">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-md">
                <div className="bg-white border border-brand-border-light p-8 md:p-12 rounded-lg shadow-lg text-center animate-fadeInUp">
                    <h1 className="text-4xl font-extrabold text-brand-text-dark tracking-tight font-serif">Admin Login</h1>
                    <div className="w-24 h-1 bg-brand-primary mx-auto mt-4 mb-8"></div>
                    
                    <form onSubmit={handleSubmit} className="space-y-6 text-left">
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-brand-text-muted">Username</label>
                            <input 
                                type="text" 
                                name="username" 
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required 
                                className="mt-1 block w-full px-4 py-3 bg-brand-light-bg border border-brand-border-light rounded-md shadow-sm focus:ring-brand-primary focus:border-brand-primary" 
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-brand-text-muted">Password</label>
                            <input 
                                type="password" 
                                name="password" 
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required 
                                className="mt-1 block w-full px-4 py-3 bg-brand-light-bg border border-brand-border-light rounded-md shadow-sm focus:ring-brand-primary focus:border-brand-primary" 
                            />
                        </div>

                        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                        <div>
                            <button 
                                type="submit" 
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-brand-primary hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary transition-colors"
                            >
                                Login
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;