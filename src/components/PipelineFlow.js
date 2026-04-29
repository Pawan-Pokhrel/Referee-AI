"use client";

import { motion } from 'framer-motion';

const ImageSvg = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
    <circle cx="8.5" cy="8.5" r="1.5"/>
    <polyline points="21 15 16 10 5 21"/>
  </svg>
);

const NetworkSvg = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-400">
    <rect x="4" y="4" width="16" height="16" rx="2" ry="2"/>
    <path d="M4 12h16"/>
    <path d="M12 4v16"/>
  </svg>
);

const TargetSvg = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--color-accent)]">
    <circle cx="12" cy="12" r="10"/>
    <circle cx="12" cy="12" r="6"/>
    <circle cx="12" cy="12" r="2"/>
  </svg>
);

const CheckSvg = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-400">
    <path d="M20 6L9 17l-5-5"/>
  </svg>
);

export default function PipelineFlow() {
  const nodes = [
    { label: 'Image Input', icon: <ImageSvg />, delay: 0 },
    { label: 'Sport Detection', icon: <NetworkSvg />, delay: 0.2 },
    { label: 'Signal Routing', icon: <TargetSvg />, delay: 0.4 },
    { label: 'Classification', icon: <CheckSvg />, delay: 0.6 },
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
            <div className="w-14 h-14 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-center shadow-lg relative z-10">
              {node.icon}
            </div>
            <span className="text-xs font-semibold text-[var(--color-text-muted)] mt-3 whitespace-nowrap uppercase tracking-wider">
              {node.label}
            </span>
          </motion.div>

          {/* Connector Arrow */}
          {i < nodes.length - 1 && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 40 }}
              transition={{ delay: node.delay + 0.1, duration: 0.3 }}
              className="relative mx-3 h-[1px] bg-[var(--color-border)] -mt-6"
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 border-t border-r border-[var(--color-border)] rotate-45" />
            </motion.div>
          )}
        </div>
      ))}
    </div>
  );
}
