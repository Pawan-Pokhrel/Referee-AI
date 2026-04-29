import CompareClient from '@/components/CompareClient';

export default function ComparePage() {
  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen">
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">Model Architecture Comparison</h1>
        <p className="text-[var(--color-text-muted)] max-w-3xl mx-auto text-lg leading-relaxed">
          Evaluate an image across all three model architectures side-by-side. Observe the confidence deltas and probability distributions to see how <strong className="text-white font-semibold">ResNet50</strong> systematically outperforms simpler CNN models.
        </p>
      </div>
      <CompareClient />
    </div>
  );
}
