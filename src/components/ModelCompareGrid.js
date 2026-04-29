"use client";

import { motion } from 'framer-motion';

export default function ModelCompareGrid({ sportComparison, signalComparison }) {
  if (!sportComparison || !signalComparison) return null;

  const models = ['baseline', 'improved', 'resnet50'];
  const displayNames = {
    baseline: 'Baseline CNN',
    improved: 'Improved CNN',
    resnet50: 'ResNet50',
  };

  const archTags = {
    baseline: '3 Conv Blocks',
    improved: 'Double Conv + BN',
    resnet50: 'Pretrained Backbone',
  };

  const baselineSignalConf = signalComparison['baseline'].confidence;

  return (
    <div className="mt-8 space-y-10">
      <div className="text-center">
        <h3 className="text-xl font-semibold mb-6 text-[var(--color-text)]">
          Stage 2: Routed Signal Classification
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {models.map((variant, i) => {
            const data = signalComparison[variant];
            const isBest = variant === 'resnet50';
            const delta = ((data.confidence - baselineSignalConf) * 100).toFixed(1);
            const deltaColor = delta > 0 ? 'text-[var(--color-success)]' : 'text-[var(--color-text-muted)]';

            return (
              <motion.div
                key={variant}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                className={`relative bg-[var(--color-surface)] p-6 rounded-2xl border ${
                  isBest
                    ? 'border-[var(--color-accent)] shadow-[0_0_20px_var(--color-accent-glow)]'
                    : 'border-[var(--color-border)]'
                }`}
              >
                {isBest && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-[var(--color-accent)] text-white text-xs font-bold rounded-full shadow-lg">
                    BEST
                  </div>
                )}
                
                <div className="text-center mb-6">
                  <h4 className="font-bold text-lg">{displayNames[variant]}</h4>
                  <span className="text-xs text-[var(--color-text-dim)]">{archTags[variant]}</span>
                </div>

                <div className="flex flex-col items-center justify-center mb-6">
                  {/* Confidence Ring/Donut representation */}
                  <div className="relative w-32 h-32 flex items-center justify-center mb-4">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="64" cy="64" r="56" fill="none" stroke="#1a1a24" strokeWidth="8" />
                      <motion.circle
                        initial={{ strokeDasharray: "0 400" }}
                        animate={{ strokeDasharray: `${data.confidence * 351.8} 400` }}
                        transition={{ duration: 1.5, delay: 0.5 }}
                        cx="64" cy="64" r="56" fill="none"
                        stroke={isBest ? 'var(--color-accent)' : '#55556a'}
                        strokeWidth="8" strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center justify-center">
                      <span className="text-2xl font-bold">{(data.confidence * 100).toFixed(1)}%</span>
                      <span className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-wider">Confidence</span>
                    </div>
                  </div>
                  
                  <div className="w-full bg-[#1a1a24] rounded-lg p-3 text-center border border-[var(--color-border)]">
                    <div className="text-[10px] uppercase text-[var(--color-text-dim)] mb-1">Prediction</div>
                    <div className="text-xl font-bold capitalize text-[var(--color-text)]">
                      {data.prediction}
                    </div>
                  </div>
                </div>

                {variant !== 'baseline' && (
                  <div className="text-center pt-4 border-t border-[var(--color-border)]">
                    <span className="text-xs text-[var(--color-text-muted)]">vs Baseline: </span>
                    <span className={`text-sm font-semibold ${deltaColor}`}>
                      {delta > 0 ? '+' : ''}{delta}%
                    </span>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
