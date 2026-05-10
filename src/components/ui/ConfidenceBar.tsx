'use client';

import { motion } from 'framer-motion';

type ConfidenceBarProps = {
  value: number;
  color?: string;
};

export default function ConfidenceBar({ value, color = 'var(--color-accent)' }: ConfidenceBarProps) {
  return (
    <div className="w-full h-2 bg-[#1e1e2a] rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(value * 100, 100)}%` }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="h-full"
        style={{ background: color }}
      />
    </div>
  );
}
