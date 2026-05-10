'use client';
import { healthCheck } from '@/lib/api';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

const links = [
	{ href: '/', label: 'Home' },
	{ href: '/predict', label: 'Predict' },
	{ href: '/compare', label: 'Compare' },
	{ href: '/analytics', label: 'Analytics' },
	{ href: '/live', label: 'Live' },
];

export default function Navbar() {
	const pathname = usePathname();
	const [healthOk, setHealthOk] = useState(false);

	useEffect(() => {
		let active = true;

		const run = async () => {
			try {
				const status = await healthCheck();

				if (active) {
					setHealthOk(status?.status === 'ok');
				}
			} catch {
				if (active) {
					setHealthOk(false);
				}
			}
		};

		run();

		const timer = setInterval(run, 30000);

		return () => {
			active = false;
			clearInterval(timer);
		};
	}, []);

	const navLinks = useMemo(() => links, []);

	return (
		<nav className="fixed top-0 left-0 right-0 z-50 bg-[rgba(8,8,15,0.82)] backdrop-blur-[18px] border-b border-(--color-border)">
			<div className="max-w-400 mx-auto px-6 h-16 flex items-center justify-between">
				{/* Logo */}
				<Link
					href="/"
					className="flex items-center gap-3 group"
					title="Go to homepage"
				>
					<div className="w-8 h-8 rounded-lg bg-[rgba(99,102,241,0.18)] flex items-center justify-center transition-all duration-200 group-hover:bg-[rgba(99,102,241,0.28)] group-hover:shadow-[0_0_18px_rgba(99,102,241,0.28)]">
						<svg
							width="18"
							height="18"
							viewBox="0 0 24 24"
							fill="none"
							stroke="#a78bfa"
							strokeWidth="2"
						>
							<path d="M3 12a9 9 0 1118 0 9 9 0 01-18 0z" />
							<path d="M8 12h8" />
							<path d="M12 7v10" />
						</svg>
					</div>

					<span className="text-lg font-semibold bg-linear-to-r from-white to-(--color-accent) bg-clip-text text-transparent transition-opacity duration-200 group-hover:opacity-80">
						RefereeAI
					</span>
				</Link>

				{/* Navigation Links */}
				<div className="hidden md:flex items-center gap-2 text-sm">
					{navLinks.map((link) => {
						const isActive = pathname === link.href;

						return (
							<Link
								key={link.href}
								href={link.href}
								prefetch={true}
								title={`Go to ${link.label}`}
								className={`
									relative
									px-4
									py-2
									rounded-lg
									font-medium
									transition-all
									duration-200
									${
										isActive ?
											'text-white bg-[rgba(99,102,241,0.08)]'
										:	'text-(--color-text-muted) hover:text-white hover:bg-(--color-surface)'
									}
								`}
							>
								{link.label}

								{isActive && (
									<motion.div
										layoutId="nav-underline"
										className="absolute bottom-0 left-2 right-2 h-0.5 bg-(--color-accent) rounded-full shadow-[0_0_12px_var(--color-accent-glow)"
									/>
								)}
							</Link>
						);
					})}
				</div>

				{/* Right Side */}
				<div className="flex items-center gap-4">
					{/* API Status */}
					<div className="flex items-center gap-2 text-xs text-(--color-text-secondary) glass-chip px-3 py-1 rounded-full">
						<span
							className={`h-2 w-2 rounded-full ${
								healthOk ?
									'bg-(--color-success) shadow-[0_0_10px_var(--color-success)'
								:	'bg-(--color-danger) shadow-[0_0_10px_var(--color-danger)'
							}`}
						/>

						<span className="font-medium">API</span>
					</div>

					{/* GitHub Button */}
					<Link
						href="https://github.com/Pawan-Pokhrel/Referee-AI"
						target="_blank"
						rel="noreferrer"
						prefetch={false}
						title="View project repository on GitHub"
						className="
							group
							text-xs
							font-medium
							text-(--color-text-secondary)
							border
							border-(--color-border)
							px-3
							py-1.5
							rounded-full
							inline-flex
							items-center
							gap-2
							glass-chip
							transition-all
							duration-200
							hover:text-white
							hover:border-(--color-accent)
							hover:bg-[rgba(99,102,241,0.08)]
							hover:shadow-[0_0_20px_rgba(99,102,241,0.22)]
						"
					>
						<svg
							width="14"
							height="14"
							viewBox="0 0 24 24"
							fill="currentColor"
							aria-hidden="true"
							className="transition-transform duration-200 group-hover:scale-110"
						>
							<path d="M12 2a10 10 0 00-3.16 19.48c.5.09.68-.22.68-.48v-1.7c-2.77.6-3.35-1.33-3.35-1.33-.45-1.14-1.1-1.45-1.1-1.45-.9-.61.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.08 2.9.83.09-.64.35-1.08.63-1.33-2.21-.25-4.54-1.1-4.54-4.9 0-1.08.39-1.96 1.02-2.65-.1-.25-.44-1.27.1-2.64 0 0 .83-.27 2.72 1.01a9.4 9.4 0 014.95 0c1.89-1.28 2.72-1.01 2.72-1.01.54 1.37.2 2.39.1 2.64.64.69 1.02 1.57 1.02 2.65 0 3.8-2.33 4.65-4.55 4.9.36.31.68.92.68 1.86v2.76c0 .27.18.58.69.48A10 10 0 0012 2z" />
						</svg>

						<span className="transition-colors duration-200">GitHub</span>
					</Link>
				</div>
			</div>
		</nav>
	);
}
