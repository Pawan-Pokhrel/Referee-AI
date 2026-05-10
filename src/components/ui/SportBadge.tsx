'use client';

type SportBadgeProps = {
  sport: string;
};

export default function SportBadge({ sport }: SportBadgeProps) {
  const isCricket = sport.toLowerCase() === 'cricket';
  const label = isCricket ? 'Cricket' : 'Football';
  const emoji = isCricket ? '🏏' : '⚽';
  const color = isCricket ? 'bg-[rgba(34,197,94,0.2)] text-[#22c55e]' : 'bg-[rgba(245,158,11,0.2)] text-[#f59e0b]';

  return (
    <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold ${color}`}>
      <span>{emoji}</span>
      {label}
    </span>
  );
}
