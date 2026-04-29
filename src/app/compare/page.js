"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, Legend, CartesianGrid } from 'recharts';
import UploadZone from '@/components/UploadZone';
import ModelCompareGrid from '@/components/ModelCompareGrid';
import { compare } from '@/lib/api';

export default function ComparePage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleCompare = async (file) => {
    try {
      setLoading(true);
      setError(null);
      setResult(null);
      
      const res = await compare(file);
      setResult(res);
    } catch (err) {
      setError(err?.response?.data?.detail || "Failed to process comparison.");
    } finally {
      setLoading(false);
    }
  };

  // Build data for side-by-side grouped bar chart
  const getChartData = () => {
    if (!result) return [];
    
    // We want the classes of the routed sport
    const classes = Object.keys(result.signal_comparison.resnet50.all_probs);
    
    return classes.map(cls => ({
      name: cls,
      Baseline: result.signal_comparison.baseline.all_probs[cls] * 100,
      Improved: result.signal_comparison.improved.all_probs[cls] * 100,
      ResNet50: result.signal_comparison.resnet50.all_probs[cls] * 100,
    }));
  };

  const chartData = getChartData();

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-extrabold mb-4">Model Comparison</h1>
        <p className="text-[var(--color-text-muted)] max-w-2xl mx-auto">
          Evaluate an image across all three model architectures side-by-side. See how ResNet50 outperforms the simpler CNN models.
        </p>
      </motion.div>

      {error && (
        <div className="max-w-xl mx-auto mb-6 p-4 bg-[var(--color-danger)]/10 border border-[var(--color-danger)] text-[var(--color-danger)] rounded-xl flex justify-between items-center">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="text-xl">&times;</button>
        </div>
      )}

      <UploadZone onFileSelect={handleCompare} loading={loading} />

      {result && !loading && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-16"
        >
          {/* Winner Callout */}
          <div className="w-full p-4 bg-[var(--color-accent)]/10 border border-[var(--color-accent)] rounded-xl text-center mb-8 shadow-[0_0_20px_var(--color-accent-glow)]">
            <span className="text-lg font-medium">
              🏆 ResNet50 outperforms Baseline by <span className="font-bold text-[var(--color-accent)]">+{((result.signal_comparison.resnet50.confidence - result.signal_comparison.baseline.confidence) * 100).toFixed(1)}%</span> confidence
            </span>
          </div>

          <ModelCompareGrid 
            sportComparison={result.sport_comparison} 
            signalComparison={result.signal_comparison} 
          />

          {/* Grouped Bar Chart */}
          <div className="mt-16 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-8">
            <h3 className="text-xl font-semibold mb-8 text-center">Class Probability Distribution Across Models</h3>
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 50 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fill: '#8b8b9e', fontSize: 12 }} 
                    axisLine={false} 
                    tickLine={false} 
                    dy={10}
                    angle={-45}
                    textAnchor="end"
                  />
                  <YAxis 
                    tick={{ fill: '#8b8b9e', fontSize: 12 }} 
                    axisLine={false} 
                    tickLine={false}
                    domain={[0, 100]}
                    tickFormatter={(val) => `${val}%`}
                  />
                  <RechartsTooltip 
                    cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                    contentStyle={{ backgroundColor: '#1e1e2e', border: '1px solid #6366f1', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff' }}
                    formatter={(value) => [`${value.toFixed(1)}%`, '']}
                  />
                  <Legend wrapperStyle={{ paddingTop: '20px' }} />
                  <Bar dataKey="Baseline" fill="#55556a" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Improved" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="ResNet50" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
