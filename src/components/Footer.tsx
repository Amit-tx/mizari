'use client';

/**
 * Beautiful Minimalist Footer
 * Inspired by clean editorial design with warm tones
 * Colors: Carbon black (#000000) on white
 */

import Link from 'next/link';

const FooterLinks = [
  {
    section: 'Product',
    links: [
      { label: 'Features', href: '#features' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'Security', href: '#security' },
      { label: 'Status', href: 'https://status.mizari.cc' },
    ],
  },
  {
    section: 'Company',
    links: [
      { label: 'About', href: '#about' },
      { label: 'Blog', href: '#blog' },
      { label: 'Careers', href: '#careers' },
      { label: 'Contact', href: '#contact' },
    ],
  },
  {
    section: 'Legal',
    links: [
      { label: 'Privacy', href: '/privacy' },
      { label: 'Terms', href: '/terms' },
      { label: 'Cookies', href: '#cookies' },
      { label: 'GDPR', href: '#gdpr' },
    ],
  },
];

const SocialLinks = [
  { icon: '𝕏', label: 'Twitter', href: 'https://twitter.com/mizari' },
  { icon: '📷', label: 'Instagram', href: 'https://instagram.com/mizari' },
  { icon: '💬', label: 'Discord', href: 'https://discord.gg/mizari' },
  { icon: '🎬', label: 'YouTube', href: 'https://youtube.com/mizari' },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative mt-24 border-t border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-gray-900 dark:text-white">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute left-0 bottom-0 w-96 h-96 rounded-full opacity-10 dark:opacity-10 blur-3xl bg-black/5" />
        <div className="absolute right-0 top-1/3 w-72 h-72 rounded-full opacity-10 dark:opacity-10 blur-3xl bg-black/5" />
      </div>

      <div className="relative">
        {/* Main footer content */}
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          {/* Top section: Logo + tagline + social */}
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4 mb-16 pb-12 border-b border-gray-200 dark:border-slate-800">
            {/* Brand */}
            <div className="lg:col-span-1">
              <Link href="/" className="inline-block group">
                <h2 className="text-2xl font-bold text-black dark:text-white group-hover:opacity-70 transition-opacity">
                  mizari.cc
                </h2>
              </Link>
              <p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-slate-400 max-w-sm">
                One link. Infinite reach.
              </p>
              <p className="mt-6 text-xs font-medium text-gray-500 dark:text-slate-500">
                © {currentYear} mizari.cc. All rights reserved.
              </p>
            </div>

            {/* Footer sections */}
            {FooterLinks.map((group) => (
              <div key={group.section}>
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-white mb-4">
                  {group.section}
                </h3>
                <ul className="space-y-3">
                  {group.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-gray-600 dark:text-slate-400 hover:text-black dark:hover:text-white transition-colors duration-200"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom section: Social + credits */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Social links */}
            <div className="flex items-center gap-6">
              {SocialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-400 hover:border-black hover:text-black hover:bg-black/5 dark:hover:border-white dark:hover:text-white dark:hover:bg-white/10 transition-all duration-200"
                  aria-label={social.label}
                  title={social.label}
                >
                  <span className="text-lg">{social.icon}</span>
                </a>
              ))}
            </div>

            {/* Credits - Platform mentions */}
            <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-gray-500 dark:text-slate-500">
              <span>Built with</span>
              <div className="flex gap-2">
                <a href="https://nextjs.org" target="_blank" rel="noopener noreferrer" className="hover:text-gray-700 dark:hover:text-slate-300 transition-colors" title="Next.js">
                  Next.js
                </a>
                <span>•</span>
                <a href="https://tailwindcss.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-700 dark:hover:text-slate-300 transition-colors" title="Tailwind CSS">
                  Tailwind
                </a>
                <span>•</span>
                <a href="https://neon.tech" target="_blank" rel="noopener noreferrer" className="hover:text-gray-700 dark:hover:text-slate-300 transition-colors" title="Neon PostgreSQL">
                  Neon
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
