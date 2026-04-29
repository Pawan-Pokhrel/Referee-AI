"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import UploadZone from '@/components/UploadZone';
import ResultCard from '@/components/ResultCard';
import PipelineFlow from '@/components/PipelineFlow';
import { predict } from '@/lib/api';

export default function PredictClient() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [preview, setPreview] = useState(null);

  const handlePredict = async (file) => {
    try {
      setLoading(true);
      setResult(null);
      setPreview(URL.createObjectURL(file));
      
      const toastId = toast.loading('Running hierarchical pipeline...');
      const res = await predict(file);
      setResult(res);
      toast.success('Prediction complete!', { id: toastId });
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Failed to process image.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto px-6 py-6 h-[calc(100vh-5rem)] flex flex-col">
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold mb-1">Hierarchical Prediction</h1>
        <p className="text-[var(--color-text-muted)] text-sm">
          Real-time 2-stage ResNet50 inference pipeline.
        </p>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">
        {/* Left Column: Input */}
        <div className="lg:col-span-5 h-full min-h-[400px]">
          <UploadZone onFileSelect={handlePredict} loading={loading} />
        </div>

        {/* Right Column: Results */}
        <div className="lg:col-span-7 flex flex-col h-full min-h-0">
          {result && !loading ? (
            <div className="flex flex-col h-full space-y-6">
              <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl px-6 py-2 shadow-sm">
                <PipelineFlow />
              </div>
              <div className="flex-1 min-h-0">
                <ResultCard result={result} />
              </div>
            </div>
          ) : (
            <div className="flex-1 border-2 border-dashed border-[var(--color-border)] rounded-2xl flex flex-col items-center justify-center text-[var(--color-text-muted)] bg-[var(--color-surface)]/20">
              <div className="w-12 h-12 mb-4 rounded-xl bg-[#1a1a24] border border-[var(--color-border)] flex items-center justify-center shadow-sm">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              </div>
              <p className="font-medium text-sm">Awaiting Image Upload</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
