"use client";

import { motion } from 'framer-motion';

export default function MetricsTable({ data, task }) {
  if (!data) return null;

  const models = ['Baseline', 'Improved', 'ResNet50'];
  const displayNames = {
    Baseline: 'Baseline CNN',
    Improved: 'Improved CNN',
    ResNet50: 'ResNet50',
  };

  const metrics = ['acc', 'prec', 'rec', 'f1'];
  const metricNames = {
    acc: 'Accuracy',
    prec: 'Precision',
    rec: 'Recall',
    f1: 'F1 Score'
  };

  // Find max value per metric to highlight
  const bestVals = {};
  metrics.forEach(m => {
    bestVals[m] = Math.max(...models.map(mod => data[mod]?.[m] || 0));
  });

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr>
            <th className="py-4 px-6 text-[var(--color-text-dim)] font-semibold text-sm border-b border-[var(--color-border)]">Model Architecture</th>
            {metrics.map(m => (
              <th key={m} className="py-4 px-6 text-[var(--color-text-dim)] font-semibold text-sm border-b border-[var(--color-border)] text-center">
                {metricNames[m]}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {models.map((mod, i) => (
            <motion.tr 
              key={mod}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="border-b border-[var(--color-border)] hover:bg-[var(--color-surface)]/50 transition-colors"
            >
              <td className="py-4 px-6 font-medium">
                <div className="flex items-center gap-3">
                  <span className={`w-2 h-2 rounded-full ${mod === 'resnet50' ? 'bg-[var(--color-accent)]' : 'bg-[#55556a]'}`} />
                  {displayNames[mod]}
                </div>
              </td>
              {metrics.map(m => {
                const val = data[mod]?.[m] || 0;
                const isBest = val === bestVals[m] && val > 0;
                
                return (
                  <td key={m} className="py-4 px-6 text-center">
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold transition-all ${
                      isBest 
                        ? 'bg-[var(--color-accent)]/20 text-[var(--color-accent)] border border-[var(--color-accent)]/30' 
                        : 'text-[var(--color-text)]'
                    }`}>
                      {(val * 100).toFixed(1)}%
                    </span>
                  </td>
                );
              })}
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
