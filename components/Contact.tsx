import React from 'react';

const Contact: React.FC = () => {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert('Thank you for your message! We will get back to you shortly.');
    };

    return (
        <div className="bg-brand-light-bg py-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center animate-fadeInUp">
                    <h1 className="text-5xl font-extrabold tracking-tight font-serif">Get In Touch</h1>
                    <p className="mt-4 max-w-2xl mx-auto text-xl text-brand-text-muted">
                        We'd love to hear from you. Whether it's a question, a suggestion, or a partnership, feel free to reach out.
                    </p>
                    <div className="w-24 h-1 bg-brand-primary mx-auto mt-4 mb-6"></div>
                </div>

                <div className="mt-16 max-w-5xl mx-auto grid md:grid-cols-2 gap-10 bg-white p-8 rounded-lg shadow-lg border border-brand-border-light">
                    <div className="animate-fadeInUp" style={{animationDelay: '200ms'}}>
                        <h2 className="text-3xl font-bold text-brand-text-dark font-serif">Send us a Message</h2>
                        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-brand-text-muted">Full Name</label>
                                <input type="text" name="name" id="name" required className="mt-1 block w-full px-4 py-3 bg-brand-light-bg border border-brand-border-light rounded-md shadow-sm focus:ring-brand-primary focus:border-brand-primary" />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-brand-text-muted">Email Address</label>
                                <input type="email" name="email" id="email" required className="mt-1 block w-full px-4 py-3 bg-brand-light-bg border border-brand-border-light rounded-md shadow-sm focus:ring-brand-primary focus:border-brand-primary" />
                            </div>
                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-brand-text-muted">Message</label>
                                <textarea name="message" id="message" rows={4} required className="mt-1 block w-full px-4 py-3 bg-brand-light-bg border border-brand-border-light rounded-md shadow-sm focus:ring-brand-primary focus:border-brand-primary"></textarea>
                            </div>
                            <div>
                                <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-brand-primary hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary transition-colors">
                                    Submit
                                </button>
                            </div>
                        </form>
                    </div>

                    <div className="space-y-8 animate-fadeInUp" style={{animationDelay: '400ms'}}>
                        <div>
                            <h3 className="text-2xl font-semibold text-brand-text-dark font-serif">Visit Our Office</h3>
                            <p className="mt-2 text-brand-text-muted">123 Foundation St, Community City, 12345</p>
                        </div>
                        <div>
                            <h3 className="text-2xl font-semibold text-brand-text-dark font-serif">Email Us</h3>
                            <p className="mt-2 text-brand-text-muted">contact@hfsf.org</p>
                        </div>
                        <div>
                            <h3 className="text-2xl font-semibold text-brand-text-dark font-serif">Call Us</h3>
                            <p className="mt-2 text-brand-text-muted">(123) 456-7890</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;