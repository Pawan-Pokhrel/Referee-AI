"use client";

import { motion } from 'framer-motion';
import Image from 'next/image';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function ResultCard({ result }) {
  if (!result) return null;

  // Format the probabilities for the bar chart
  const signalData = Object.entries(result.all_signal_probs || {})
    .map(([name, prob]) => ({ name, probability: prob * 100 }))
    .sort((a, b) => b.probability - a.probability); // Sort descending

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl overflow-hidden shadow-xl h-full"
    >
      <div className="flex flex-col h-full p-8 justify-center">
          {/* Stage 1: Sport */}
          <div className="mb-6">
            <h4 className="text-xs uppercase tracking-wider text-[var(--color-text-dim)] font-semibold mb-2">
              Stage 1: Sport Detection
            </h4>
            <div className="flex items-center gap-4">
              <div className="px-3 py-1.5 bg-[#1a1a24] border border-[var(--color-border)] rounded-lg text-sm font-medium flex items-center">
                <span className="capitalize">{result.sport}</span>
              </div>
              <div className="flex-1">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-[var(--color-text-muted)]">Confidence</span>
                  <span className="font-medium text-[var(--color-text)]">
                    {(result.sport_confidence * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="h-1.5 bg-[#1a1a24] rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${result.sport_confidence * 100}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className="h-full bg-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Stage 2: Signal */}
          <div className="mb-8">
            <h4 className="text-xs uppercase tracking-wider text-[var(--color-text-dim)] font-semibold mb-2">
              Stage 2: Signal Classification
            </h4>
            <div className="flex items-end gap-4">
              <h2 className="text-4xl font-extrabold capitalize text-[var(--color-accent)] drop-shadow-[0_0_15px_var(--color-accent-glow)]">
                {result.signal}
              </h2>
              <div className="flex-1 pb-1">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-[var(--color-text-muted)]">Confidence</span>
                  <span className="font-medium text-[var(--color-text)]">
                    {(result.signal_confidence * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="h-1.5 bg-[#1a1a24] rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${result.signal_confidence * 100}%` }}
                    transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
                    className="h-full bg-[var(--color-accent)] shadow-[0_0_10px_var(--color-accent)]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Probability Distribution */}
          <div>
            <h4 className="text-xs uppercase tracking-wider text-[var(--color-text-dim)] font-semibold mb-4">
              Probability Distribution
            </h4>
            <div className="h-[140px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={signalData} layout="vertical" margin={{ top: 0, right: 30, left: 10, bottom: 0 }}>
                  <XAxis type="number" hide domain={[0, 100]} />
                  <YAxis
                    dataKey="name"
                    type="category"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#8b8b9e', fontSize: 11 }}
                    width={80}
                  />
                  <Tooltip
                    cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                    formatter={(value) => [`${value.toFixed(1)}%`, 'Confidence']}
                  />
                  <Bar dataKey="probability" radius={[0, 4, 4, 0]} barSize={12}>
                    {signalData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.name === result.signal ? 'var(--color-accent)' : '#2a2a35'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
    </motion.div>
  );
}
