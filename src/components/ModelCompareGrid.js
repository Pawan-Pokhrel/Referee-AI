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

  const renderGrid = (title, comparisonData) => {
    const baselineConf = comparisonData['baseline'].confidence;
    
    return (
      <div className="text-center">
        <h3 className="text-2xl font-bold mb-8 text-[var(--color-text)]">
          {title}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {models.map((variant, i) => {
            const data = comparisonData[variant];
            const isBest = variant === 'resnet50';
            const delta = ((data.confidence - baselineConf) * 100).toFixed(1);
            const deltaColor = delta > 0 ? 'text-[var(--color-success)]' : 'text-[var(--color-text-muted)]';

            return (
              <motion.div
                key={variant}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                className={`relative overflow-hidden bg-gradient-to-b from-[var(--color-surface)] to-[#0c0c12] p-8 rounded-3xl border ${
                  isBest
                    ? 'border-[var(--color-accent)] shadow-[0_8px_30px_-5px_var(--color-accent-glow)]'
                    : 'border-[var(--color-border)] hover:border-[var(--color-border-hover)]'
                } transition-all duration-300`}
              >
                {/* Subtle background glow for the best model */}
                {isBest && <div className="absolute -top-20 -right-20 w-40 h-40 bg-[var(--color-accent)] blur-[80px] opacity-20 pointer-events-none" />}
                
                {isBest && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 rounded-b-xl px-4 py-1.5 bg-gradient-to-r from-[var(--color-accent)] to-purple-600 text-white text-[10px] font-black uppercase tracking-widest shadow-lg">
                    Best Model
                  </div>
                )}
                
                <div className="text-center mb-6">
                  <h4 className="font-bold text-lg">{displayNames[variant]}</h4>
                  <span className="text-xs text-[var(--color-text-dim)]">{archTags[variant]}</span>
                </div>

                <div className="flex flex-col items-center justify-center mb-8 relative z-10">
                  {/* Confidence Ring/Donut representation */}
                  <div className="relative w-36 h-36 flex items-center justify-center mb-6">
                    <svg className="w-full h-full transform -rotate-90 drop-shadow-md" viewBox="0 0 128 128">
                      <circle cx="64" cy="64" r="56" fill="none" stroke="#1a1a24" strokeWidth="8" />
                      <motion.circle
                        initial={{ strokeDasharray: "0 400" }}
                        animate={{ strokeDasharray: `${data.confidence * 351.8} 400` }}
                        transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }}
                        cx="64" cy="64" r="56" fill="none"
                        stroke={isBest ? 'url(#accent-gradient)' : '#55556a'}
                        strokeWidth="8" strokeLinecap="round"
                      />
                      <defs>
                        <linearGradient id="accent-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="var(--color-accent)" />
                          <stop offset="100%" stopColor="#c084fc" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute flex flex-col items-center justify-center text-center">
                      <span className="text-3xl font-black tracking-tight">{(data.confidence * 100).toFixed(1)}<span className="text-xl text-[var(--color-text-muted)]">%</span></span>
                      <span className="text-[9px] font-bold text-[var(--color-text-dim)] uppercase tracking-widest mt-1">Confidence</span>
                    </div>
                  </div>
                  
                  <div className="w-full bg-[#16161f] rounded-xl p-4 text-center border border-[var(--color-border)] shadow-inner">
                    <div className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-dim)] mb-2">Prediction Output</div>
                    <div className={`text-2xl font-black capitalize ${isBest ? 'bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent' : 'text-[var(--color-text)]'}`}>
                      {data.prediction}
                    </div>
                  </div>
                </div>

                {variant !== 'baseline' && (
                  <div className="text-center pt-5 border-t border-[var(--color-border)]/50 relative z-10">
                    <span className="text-xs font-medium text-[var(--color-text-muted)]">Performance vs Baseline: </span>
                    <span className={`text-sm font-bold ml-1 ${deltaColor} px-2 py-1 rounded-md bg-[#16161f]`}>
                      {delta > 0 ? '+' : ''}{delta}%
                    </span>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="mt-8 space-y-16">
      {renderGrid("Stage 1: Sport Detection Models", sportComparison)}
      {renderGrid(`Stage 2: Routed Signal Classification (${sportComparison['resnet50'].prediction})`, signalComparison)}
    </div>
  );
}
