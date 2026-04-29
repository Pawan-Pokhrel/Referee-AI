import AnalyticsClient from '@/components/AnalyticsClient';

export default function AnalyticsPage() {
  return (
    <div className="max-w-[1440px] mx-auto px-6 py-12 min-h-screen">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold mb-4">Performance Analytics</h1>
        <p className="text-[var(--color-text-muted)] max-w-2xl mx-auto">
          Comprehensive evaluation metrics for all 9 trained PyTorch models across Sport, Cricket, and Football classification tasks.
        </p>
      </div>
      <AnalyticsClient />
    </div>
  );
}
