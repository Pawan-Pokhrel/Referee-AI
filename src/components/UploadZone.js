"use client";

import { useCallback, useState } from 'react';
import Image from 'next/image';

export default function UploadZone({ onFileSelect, loading }) {
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState(null);

  const handleFile = useCallback(
    (file) => {
      if (!file || !file.type.startsWith('image/')) return;
      setPreview(URL.createObjectURL(file));
      onFileSelect(file);
    },
    [onFileSelect]
  );

  const onDrop = useCallback(
    (e) => {
      e.preventDefault();
      setDragActive(false);
      if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
    },
    [handleFile]
  );

  const onDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };
  const onDragLeave = () => setDragActive(false);

  const onInputChange = (e) => {
    if (e.target.files?.[0]) handleFile(e.target.files[0]);
  };

  return (
    <div
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      className={`relative w-full h-full min-h-[200px] rounded-2xl border-2 border-dashed transition-all duration-200 cursor-pointer flex-1 ${
        dragActive
          ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/5 shadow-[0_0_30px_var(--color-accent-glow)]'
          : 'border-[var(--color-border)] hover:border-[var(--color-border-hover)] hover:bg-[var(--color-surface)] bg-[#111118]'
      }`}
    >
      <label className="flex flex-col items-center justify-center p-6 cursor-pointer w-full h-full">
        {preview ? (
          <div className="relative w-full h-full rounded-xl overflow-hidden">
            <Image
              src={preview}
              alt="Preview"
              fill
              className="object-contain"
              unoptimized
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#1a1a24] border border-[var(--color-border)] flex items-center justify-center mb-4 shadow-sm group-hover:shadow-md transition-shadow">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[var(--color-text-muted)]">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
              </svg>
            </div>
            <p className="text-sm font-medium text-[var(--color-text)]">
              Drop an image here or click to upload
            </p>
            <p className="text-xs text-[var(--color-text-dim)] mt-2">
              JPEG, PNG, WEBP (max 10MB)
            </p>
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          onChange={onInputChange}
          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
          disabled={loading}
        />
      </label>

      {loading && (
        <div className="absolute inset-0 rounded-2xl bg-[var(--color-bg)]/80 flex items-center justify-center backdrop-blur-sm">
          <div className="flex flex-col items-center gap-3">
            <div className="w-6 h-6 border-2 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin shadow-[0_0_15px_var(--color-accent-glow)]" />
            <span className="text-sm font-medium text-[var(--color-text)] animate-pulse">Running hierarchical pipeline...</span>
          </div>
        </div>
      )}
    </div>
  );
}
