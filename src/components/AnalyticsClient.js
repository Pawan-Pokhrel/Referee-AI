"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, Legend, CartesianGrid } from 'recharts';
import toast from 'react-hot-toast';
import { getMetrics } from '@/lib/api';
import MetricsTable from '@/components/MetricsTable';
import MetricsRadarChart from '@/components/MetricsRadarChart';

export default function AnalyticsClient() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('sport');

  useEffect(() => {
    async function loadMetrics() {
      try {
        const data = await getMetrics();
        setMetrics(data);
      } catch (err) {
        toast.error("Failed to load metrics. Ensure metrics.json exists in backend.");
      } finally {
        setLoading(false);
      }
    }
    loadMetrics();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin shadow-[0_0_15px_var(--color-accent-glow)]" />
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-[var(--color-text-dim)]">
        No metrics data available.
      </div>
    );
  }

  const tabs = [
    { id: 'sport', label: 'Sport Classification' },
    { id: 'cricket', label: 'Cricket Signals' },
    { id: 'football', label: 'Football Signals' },
  ];

  let bestF1 = 0;
  if (metrics.sport?.ResNet50?.f1) bestF1 = Math.max(bestF1, metrics.sport.ResNet50.f1);
  if (metrics.cricket?.ResNet50?.f1) bestF1 = Math.max(bestF1, metrics.cricket.ResNet50.f1);
  if (metrics.football?.ResNet50?.f1) bestF1 = Math.max(bestF1, metrics.football.ResNet50.f1);

  const summaryData = tabs.map(t => ({
    name: t.label,
    Baseline: (metrics[t.id]?.Baseline?.f1 || 0) * 100,
    Improved: (metrics[t.id]?.Improved?.f1 || 0) * 100,
    ResNet50: (metrics[t.id]?.ResNet50?.f1 || 0) * 100,
  }));

  return (
    <>
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-12 flex justify-center"
      >
        <div className="px-8 py-6 bg-[var(--color-surface)] border border-[var(--color-accent)]/50 rounded-2xl shadow-[0_0_30px_var(--color-accent-glow)] text-center">
          <div className="text-sm uppercase tracking-widest text-[var(--color-text-muted)] font-semibold mb-2">Peak F1-Score (ResNet50)</div>
          <div className="text-6xl font-black bg-gradient-to-br from-[var(--color-accent)] to-purple-400 bg-clip-text text-transparent">
            {(bestF1 * 100).toFixed(1)}%
          </div>
        </div>
      </motion.div>

      <div className="flex flex-wrap justify-center gap-2 mb-8 border-b border-[var(--color-border)] pb-px">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 font-medium text-sm rounded-t-lg transition-colors relative ${
              activeTab === tab.id 
                ? 'text-[var(--color-text)] bg-[var(--color-surface)] border border-[var(--color-border)] border-b-transparent'
                : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface)]/50'
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute -bottom-[1px] left-0 right-0 h-[1px] bg-[var(--color-surface)]" />
            )}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
        <motion.div 
          key={`table-${activeTab}`}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl overflow-hidden"
        >
          <MetricsTable data={metrics[activeTab]} task={activeTab} />
        </motion.div>

        <motion.div 
          key={`radar-${activeTab}`}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 flex flex-col items-center justify-center"
        >
          <h3 className="text-lg font-semibold mb-4 text-center">Multidimensional Comparison</h3>
          <MetricsRadarChart data={metrics[activeTab]} />
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-8"
      >
        <h3 className="text-xl font-semibold mb-8 text-center">Overall F1-Score Summary</h3>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={summaryData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis 
                dataKey="name" 
                tick={{ fill: '#8b8b9e', fontSize: 13 }} 
                axisLine={false} 
                tickLine={false} 
                dy={10}
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
                formatter={(value) => [`${value.toFixed(1)}%`, 'F1 Score']}
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              <Bar dataKey="Baseline" fill="#55556a" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Improved" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              <Bar dataKey="ResNet50" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </>
  );
}
