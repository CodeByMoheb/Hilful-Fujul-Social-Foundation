import React from 'react';

const Footer: React.FC = () => {
  const socialLinks = [
    { name: 'Facebook', url: '#', icon: 'f' },
    { name: 'Twitter', url: '#', icon: 't' },
    { name: 'Instagram', url: '#', icon: 'i' },
    { name: 'YouTube', url: '#', icon: 'y' },
  ];

  return (
    <footer className="bg-white text-brand-text-muted border-t border-brand-border-light">
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <h3 className="text-xl font-bold font-serif text-brand-primary">Hilful Fuzul Social Foundation</h3>
            <p className="mt-4 text-brand-text-muted">Building a better society through community service, charity, education, and welfare projects in the light of Islamic values.</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold tracking-wider uppercase text-brand-text-dark">Contact Us</h3>
            <ul className="mt-4 space-y-2 text-brand-text-muted">
              <li>123 Foundation St, Community City, 12345</li>
              <li>Email: contact@hfsf.org</li>
              <li>Phone: (123) 456-7890</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold tracking-wider uppercase text-brand-text-dark">Follow Us</h3>
            <div className="mt-4 flex space-x-4">
              {socialLinks.map((social) => (
                <a key={social.name} href={social.url} className="text-brand-text-muted hover:text-brand-primary transition-colors">
                  <span className="sr-only">{social.name}</span>
                  <div className="w-10 h-10 rounded-full bg-brand-light-bg hover:bg-brand-secondary flex items-center justify-center font-bold text-lg transition-all">
                    {social.icon}
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-brand-border-light pt-8 text-center text-brand-text-muted/80">
          <p>&copy; {new Date().getFullYear()} Hilful Fuzul Social Foundation. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;