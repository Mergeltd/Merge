import Link from 'next/link';
import { Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';
import { Logo } from './logo';

const columns = [
  {
    heading: 'Platform',
    links: [
      { href: '/marketplace', label: 'Technician Marketplace' },
      { href: '/vacancies', label: 'Rental Vacancies' },
      { href: '/how-it-works', label: 'How It Works' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { href: '/about', label: 'About Us' },
      { href: '/contact', label: 'Contact' },
    ],
  },
  {
    heading: 'Get Started',
    links: [
      { href: '/register', label: 'Create an Account' },
      { href: '/login', label: 'Log In' },
      { href: '/register', label: 'Join as a Technician' },
    ],
  },
];

const socials = [
  { href: 'https://twitter.com', icon: Twitter, label: 'Twitter' },
  { href: 'https://linkedin.com', icon: Linkedin, label: 'LinkedIn' },
  { href: 'https://instagram.com', icon: Instagram, label: 'Instagram' },
  { href: 'https://facebook.com', icon: Facebook, label: 'Facebook' },
];

export function SiteFooter() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2">
            <Logo dark />
            <p className="mt-4 text-sm text-slate-400 max-w-xs">
              Connecting residents, property managers, landlords, and verified local technicians
              in one secure, AI-powered ecosystem.
            </p>
            <div className="mt-6 flex items-center gap-3">
              {socials.map(({ href, icon: Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 hover:bg-indigo-600 hover:text-white transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.heading}>
              <h3 className="text-sm font-semibold text-white">{col.heading}</h3>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm text-slate-400 hover:text-white transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            &copy; {new Date().getFullYear()} MERGE. All rights reserved.
          </p>
          <p className="text-xs text-slate-500">Connecting Homes, People &amp; Trusted Services.</p>
        </div>
      </div>
    </footer>
  );
}
