'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useEffect } from 'react';

export default function HeroSection() {
	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	return (
		<section
			id="hero"
			className="relative min-h-[calc(100vh-80px)] flex items-center justify-center px-6 styled-section"
		>
			{/* Background Glow */}
			<div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.08),transparent_60%)]" />

			{/* Top Line */}
			<div className="absolute inset-x-0 top-24 h-px bg-linear-to-r from-transparent via-[rgba(99,102,241,0.35)] to-transparent" />

			{/* Main Content */}
			<div className="relative max-w-400 text-center z-10">
				{/* Heading */}
				<motion.h1
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					className="text-4xl md:text-7xl font-extrabold leading-tight"
				>
					<span className="bg-linear-to-r from-indigo-400 via-violet-400 to-purple-500 bg-clip-text text-transparent">
						Referee Signal
					</span>

					<br />

					<span>Recognition</span>
				</motion.h1>

				{/* Description */}
				<motion.p
					initial={{ opacity: 0, y: 16 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.1, duration: 0.5 }}
					className="mt-5 text-lg text-(--color-text-secondary) max-w-140 mx-auto leading-relaxed"
				>
					Advanced deep learning pipeline for Cricket signal classification,
					with Football signal recognition as an experimental side feature.
				</motion.p>

				{/* Buttons */}
				<motion.div
					initial={{ opacity: 0, y: 14 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.2, duration: 0.5 }}
					className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
				>
					{/* Prediction Button */}
					<Link
						href="/predict"
						className="px-6 py-3 rounded-lg bg-(--color-accent) text-white font-semibold shadow-[0_0_20px_var(--color-accent-glow) hover:bg-(--color-accent-hover) transition-all duration-200"
						title="Go to prediction page"
					>
						Try Prediction
					</Link>

					{/* Analytics Button */}
					<Link
						href="/analytics"
						className="px-6 py-3 rounded-lg border border-(--color-accent) text-(--color-accent) font-semibold hover:bg-[rgba(99,102,241,0.08)] transition-all duration-200"
						title="View analytics dashboard"
					>
						View Analytics
					</Link>
				</motion.div>

				{/* Stats Chip */}
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.3, duration: 0.6 }}
					className="mt-8 inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[rgba(99,102,241,0.08)] text-sm text-(--color-text-secondary) glass-chip"
				>
					9 Models Trained · 2 Sports · 11 Signal Classes
				</motion.div>
			</div>
		</section>
	);
}
