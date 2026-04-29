"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, Legend, CartesianGrid } from 'recharts';
import toast from 'react-hot-toast';
import UploadZone from '@/components/UploadZone';
import ModelCompareGrid from '@/components/ModelCompareGrid';
import { compare } from '@/lib/api';

export default function CompareClient() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleCompare = async (file) => {
    try {
      setLoading(true);
      setResult(null);
      
      const toastId = toast.loading('Running comparison across all models...');
      const res = await compare(file);
      setResult(res);
      toast.success('Comparison complete!', { id: toastId });
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Failed to process comparison.");
    } finally {
      setLoading(false);
    }
  };

  const getChartData = () => {
    if (!result) return [];
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
    <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
      {/* Left Column: Input */}
      <div className="xl:col-span-1 flex flex-col h-[500px] xl:h-[calc(100vh-14rem)] sticky top-24">
        <UploadZone onFileSelect={handleCompare} loading={loading} />
      </div>

      {/* Right Column: Grid */}
      <div className="xl:col-span-3">
        {result && !loading ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col space-y-8"
          >
            <div className="w-full p-4 bg-[var(--color-accent)]/10 border border-[var(--color-accent)] rounded-xl text-center shadow-[0_0_20px_var(--color-accent-glow)]">
              <span className="text-lg font-medium">
                ResNet50 outperforms Baseline by <span className="font-bold text-[var(--color-accent)]">+{((result.signal_comparison.resnet50.confidence - result.signal_comparison.baseline.confidence) * 100).toFixed(1)}%</span> confidence
              </span>
            </div>

            <ModelCompareGrid 
              sportComparison={result.sport_comparison} 
              signalComparison={result.signal_comparison} 
            />

            <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-8">
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
        ) : (
          <div className="h-full min-h-[400px] border-2 border-dashed border-[var(--color-border)] rounded-2xl flex flex-col items-center justify-center text-[var(--color-text-muted)] bg-[var(--color-surface)]/20">
            <p className="font-medium">Upload an image to compare models</p>
          </div>
        )}
      </div>
    </div>
  );
}
