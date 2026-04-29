"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { label: 'Predict', href: '/predict' },
    { label: 'Compare', href: '/compare' },
    { label: 'Analytics', href: '/analytics' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#0a0a0fcc] backdrop-blur-[20px] border-b border-[var(--color-border)]'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--color-accent)] to-purple-500 flex items-center justify-center text-white text-sm font-bold">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10 2h4M12 14v4M12 2v2M4 10h2M18 10h2M12 22a8 8 0 100-16 8 8 0 000 16z"/>
            </svg>
          </div>
          <span className="text-lg font-bold text-[var(--color-text)] group-hover:text-[var(--color-accent-hover)] transition-colors">
            RefereeAI
          </span>
        </Link>

        <div className="flex items-center gap-2">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.label}
                href={link.href}
                className={`relative px-4 py-2 text-sm font-medium transition-colors rounded-lg hover:bg-[var(--color-surface)] ${
                  isActive ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
                }`}
              >
                {link.label}
                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--color-accent)] rounded-t-full shadow-[0_0_10px_var(--color-accent-glow)]" />
                )}
              </Link>
            );
          })}
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="ml-3 px-4 py-2 text-sm font-medium text-[var(--color-text-muted)] border border-[var(--color-border)] rounded-lg hover:border-[var(--color-border-hover)] hover:text-[var(--color-text)] transition-all"
          >
            GitHub
          </a>
        </div>
      </div>
    </nav>
  );
}
