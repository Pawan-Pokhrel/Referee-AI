"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import UploadZone from '@/components/UploadZone';
import ResultCard from '@/components/ResultCard';
import PipelineFlow from '@/components/PipelineFlow';
import { predict } from '@/lib/api';

export default function PredictPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);

  const handlePredict = async (file) => {
    try {
      setLoading(true);
      setError(null);
      setResult(null);
      
      setPreview(URL.createObjectURL(file));
      const res = await predict(file);
      setResult(res);
    } catch (err) {
      setError(err?.response?.data?.detail || "Failed to process image.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-extrabold mb-4">Hierarchical Prediction</h1>
        <p className="text-[var(--color-text-muted)] max-w-2xl mx-auto">
          Upload an image to see the 2-stage ResNet50 pipeline in action. The image is first classified by sport, then routed to the specific signal classifier.
        </p>
      </motion.div>

      {error && (
        <div className="max-w-xl mx-auto mb-6 p-4 bg-[var(--color-danger)]/10 border border-[var(--color-danger)] text-[var(--color-danger)] rounded-xl flex justify-between items-center">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="text-xl">&times;</button>
        </div>
      )}

      <UploadZone onFileSelect={handlePredict} loading={loading} />

      {result && !loading && (
        <>
          <PipelineFlow />
          <ResultCard imagePreview={preview} result={result} />
        </>
      )}
    </div>
  );
}
