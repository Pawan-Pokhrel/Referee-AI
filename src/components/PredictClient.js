"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
    <div className="max-w-[1600px] mx-auto px-6 py-6 min-h-[calc(100vh-5rem)] flex flex-col justify-center">
      <motion.div layout className={`mb-8 ${!result ? 'text-center mt-8' : ''}`}>
        <motion.h1 layout="position" className="text-4xl font-extrabold mb-4">Hierarchical Prediction</motion.h1>
        <motion.p layout="position" className={`text-[var(--color-text-muted)] text-lg max-w-2xl text-balance ${!result ? 'mx-auto' : ''}`}>
          Upload an image to see the 2-stage ResNet50 pipeline in action. The image is first classified by sport, then routed to the specific signal classifier.
        </motion.p>
      </motion.div>

      <div className={`flex-1 min-h-0 ${result ? 'grid grid-cols-1 lg:grid-cols-12 gap-8' : 'flex flex-col items-center justify-start max-w-3xl mx-auto w-full'}`}>
        <motion.div 
          layout 
          className={result ? 'lg:col-span-5 h-full min-h-[400px]' : 'w-full h-[500px]'}
        >
          <UploadZone onFileSelect={handlePredict} loading={loading} />
        </motion.div>

        <AnimatePresence mode="wait">
          {result && !loading && (
            <motion.div 
              key="results"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="lg:col-span-7 flex flex-col h-full space-y-6"
            >
              <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl px-6 py-2 shadow-sm">
                <PipelineFlow />
              </div>
              <div className="flex-1 min-h-0">
                <ResultCard result={result} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
