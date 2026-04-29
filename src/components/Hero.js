"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-[var(--color-accent)] opacity-[0.07] rounded-full blur-[120px]" />
        <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] bg-purple-600 opacity-[0.06] rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
        {/* Floating badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] text-sm text-[var(--color-text-muted)] mb-8 shadow-sm"
        >
          <span className="w-2 h-2 rounded-full bg-[var(--color-success)] animate-pulse shadow-[0_0_8px_var(--color-success)]" />
          9 Models Trained · 2 Sports · 11 Signal Classes
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-5xl md:text-7xl font-extrabold leading-tight mb-6 tracking-tight"
        >
          <span className="bg-gradient-to-br from-[var(--color-accent)] via-purple-400 to-violet-400 bg-clip-text text-transparent drop-shadow-sm">
            Referee Signal
          </span>
          <br />
          <span className="text-[var(--color-text)]">Recognition</span>
        </motion.h1>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-lg md:text-xl text-[var(--color-text-muted)] max-w-2xl mx-auto mb-10 leading-relaxed font-medium"
        >
          Hierarchical deep learning pipeline — sport detection followed by
          signal classification. Powered by BaselineCNN, ImprovedCNN, and
          ResNet50.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/predict"
            className="px-8 py-3.5 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white font-semibold rounded-xl transition-all duration-200 shadow-[0_0_20px_var(--color-accent-glow)] hover:shadow-[0_0_30px_var(--color-accent-glow)]"
          >
            Try Prediction
          </Link>
          <Link
            href="/analytics"
            className="px-8 py-3.5 border border-[var(--color-border)] hover:border-[var(--color-border-hover)] text-[var(--color-text)] font-semibold rounded-xl transition-all duration-200 hover:bg-[var(--color-surface)]"
          >
            View Analytics
          </Link>
        </motion.div>

        {/* Pipeline diagram preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mt-16 flex items-center justify-center gap-2 md:gap-3 text-sm text-[var(--color-text-muted)] flex-wrap"
        >
          {['Upload Image', 'Sport Detection', 'Signal Classification', 'Result'].map(
            (step, i) => (
              <div key={step} className="flex items-center gap-2 md:gap-3">
                <span className="px-4 py-2 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] whitespace-nowrap font-medium shadow-sm">
                  {step}
                </span>
                {i < 3 && (
                  <svg width="20" height="12" viewBox="0 0 20 12" className="text-[var(--color-text-dim)] hidden sm:block">
                    <path d="M0 6h16M12 1l5 5-5 5" stroke="currentColor" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
            )
          )}
        </motion.div>
      </div>
    </section>
  );
}
