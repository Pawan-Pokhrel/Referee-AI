'use client';

export default function Footer() {
	return (
		<footer className="border-t border-(--color-border) py-4 styled-section">
			<div className="max-w-400 mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
				<div className="text-sm text-(--color-text-secondary)">
					<span className="font-semibold text-(--color-accent)">RefereeAI</span>{' '}
					· Hierarchical deep learning for referee signal classification
				</div>
				<div className="flex flex-wrap items-center gap-2 text-xs text-(--color-text-secondary)">
					<span className="px-3 py-1 rounded-full bg-(--color-card) border border-(--color-border) glass-chip">
						PyTorch
					</span>
					<span className="px-3 py-1 rounded-full bg-(--color-card) border border-(--color-border) glass-chip">
						ResNet-50
					</span>
					<span className="px-3 py-1 rounded-full bg-(--color-card) border border-(--color-border) glass-chip">
						FastAPI
					</span>
					<span className="px-3 py-1 rounded-full bg-(--color-card) border border-(--color-border) glass-chip">
						Next.js
					</span>
				</div>
			</div>
		</footer>
	);
}
