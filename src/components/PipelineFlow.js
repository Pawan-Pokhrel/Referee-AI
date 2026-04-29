"use client";

import { motion } from 'framer-motion';

export default function PipelineFlow() {
  const nodes = [
    { label: 'Image', icon: '📸', delay: 0 },
    { label: 'Sport Model', icon: '🧠', delay: 0.2 },
    { label: 'Signal Model', icon: '🔍', delay: 0.4 },
    { label: 'Result', icon: '✅', delay: 0.6 },
  ];

  return (
    <div className="flex items-center justify-center py-10 w-full overflow-x-auto">
      {nodes.map((node, i) => (
        <div key={node.label} className="flex items-center">
          {/* Node */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: node.delay, duration: 0.5, type: 'spring' }}
            className="flex flex-col items-center"
          >
            <div className="w-14 h-14 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-center text-xl shadow-lg relative z-10">
              {node.icon}
            </div>
            <span className="text-xs font-medium text-[var(--color-text-muted)] mt-2 whitespace-nowrap">
              {node.label}
            </span>
          </motion.div>

          {/* Connector Arrow */}
          {i < nodes.length - 1 && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 40 }}
              transition={{ delay: node.delay + 0.1, duration: 0.3 }}
              className="relative mx-2 h-[2px] bg-[var(--color-border)] -mt-6"
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 border-t-2 border-r-2 border-[var(--color-border)] rotate-45" />
            </motion.div>
          )}
        </div>
      ))}
    </div>
  );
}
