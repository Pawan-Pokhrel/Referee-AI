"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

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
      <div className="max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between ">
        <Link href="/" className="flex items-center gap-4 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--color-accent)] to-purple-500 flex items-center justify-center text-white text-sm font-bold">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10 2h4M12 14v4M12 2v2M4 10h2M18 10h2M12 22a8 8 0 100-16 8 8 0 000 16z"/>
            </svg>
          </div>
          <span className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-br from-white to-purple-500 bg-clip-text text-transparent group-hover:opacity-80 transition-opacity">
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
                prefetch={true}
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
          <Link
            href="https://github.com/Pawan-Pokhrel/Referee-AI"
            target="_blank"
            rel="noreferrer"
            prefetch={false}
            className="ml-3 px-4 py-2 text-sm font-medium text-[var(--color-text-muted)] border border-[var(--color-border)] rounded-lg hover:border-[var(--color-border-hover)] hover:text-[var(--color-text)] transition-all flex items-center gap-2"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            GitHub
          </Link>
        </div>
      </div>
    </nav>
  );
}
