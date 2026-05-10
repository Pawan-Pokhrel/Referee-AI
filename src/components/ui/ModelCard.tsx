'use client';
import { motion } from 'framer-motion';
import { useState } from 'react';

type ModelCardProps = {
	title: string;
	tag: string;
	confidence: number;
	prediction: string;
	highlight?: boolean;
	delta?: number | null;
};

function Tooltip({ text }: { text: string }) {
	return (
		<div
			className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-3 w-56 rounded-lg px-3 py-2 text-xs text-slate-300 pointer-events-none"
			style={{
				background: '#1a1a2e',
				border: '1px solid rgba(255,255,255,0.1)',
				boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
			}}
		>
			{text}
			<div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#1a1a2e]" />
		</div>
	);
}

function TooltipWrapper({
	children,
	tip,
}: {
	children: React.ReactNode;
	tip: string;
}) {
	const [show, setShow] = useState(false);
	return (
		<div
			className="relative flex items-center justify-center w-full"
			onMouseEnter={() => setShow(true)}
			onMouseLeave={() => setShow(false)}
		>
			{children}
			{show && <Tooltip text={tip} />}
		</div>
	);
}

export default function ModelCard({
	title,
	tag,
	confidence,
	prediction,
	highlight,
	delta,
}: ModelCardProps) {
	const circumference = 2 * Math.PI * 56;
	const strokeOffset = circumference - Math.min(confidence, 1) * circumference;

	// Tooltip text describes the model itself
	const modelTooltip = `${title} (${tag}) — confidence: ${(confidence * 100).toFixed(1)}%`;

	if (highlight) {
		return (
			<div className="relative flex flex-col items-center">
				{/* BEST MODEL badge */}
				<div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-20">
					<span
						className="whitespace-nowrap text-white text-[10px] font-bold uppercase tracking-[0.16em] px-4 py-1.25 rounded-[5px]"
						style={{
							background: 'linear-gradient(90deg, #6c4fd4 0%, #9b7fe8 100%)',
							boxShadow: '0 0 16px rgba(139,100,235,0.7)',
						}}
					>
						Best Model
					</span>
				</div>

				{/* Gradient border shell */}
				<div
					className="rounded-2xl w-full"
					style={{
						padding: '1.5px',
						background:
							'linear-gradient(135deg, #a78bfa 0%, #7c5fcf 25%, #4f3da8 50%, #2d2060 75%, #1e1540 100%)',
						boxShadow:
							'0 0 0 1px rgba(139,92,246,0.15), 0 0 24px 2px rgba(120,80,220,0.25), 0 0 60px 8px rgba(100,60,200,0.12)',
					}}
				>
					<TooltipWrapper tip={modelTooltip}>
						<motion.div
							initial={{ opacity: 0, y: 24 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true, margin: '-20%' }}
							transition={{ duration: 0.4 }}
							className="rounded-[14px] flex flex-col items-center px-6 pt-7 pb-5 min-h-97.5 w-full cursor-default"
							style={{ background: '#13111f' }}
						>
							{/* Title */}
							<div className="text-center w-full mb-1 mt-2">
								<div className="text-[18px] font-bold text-white tracking-tight">
									{title}
								</div>
								<div
									className="text-[12px] mt-1 font-normal"
									style={{ color: '#6b6890' }}
								>
									{tag}
								</div>
							</div>

							{/* Confidence ring */}
							<div className="relative flex items-center justify-center my-6">
								<svg
									width="148"
									height="148"
									viewBox="0 0 148 148"
									style={{ transform: 'rotate(-90deg)' }}
								>
									<circle
										cx="74"
										cy="74"
										r="56"
										fill="none"
										stroke="rgba(120,80,220,0.15)"
										strokeWidth="11"
									/>
									<defs>
										<linearGradient
											id="ringGradHighlight"
											x1="0%"
											y1="0%"
											x2="100%"
											y2="100%"
										>
											<stop
												offset="0%"
												stopColor="#c084fc"
											/>
											<stop
												offset="40%"
												stopColor="#818cf8"
											/>
											<stop
												offset="100%"
												stopColor="#6366f1"
											/>
										</linearGradient>
									</defs>
									<motion.circle
										initial={{ strokeDashoffset: circumference }}
										animate={{ strokeDashoffset: strokeOffset }}
										transition={{ duration: 1, ease: 'easeOut' }}
										cx="74"
										cy="74"
										r="56"
										fill="none"
										stroke="url(#ringGradHighlight)"
										strokeWidth="11"
										strokeLinecap="round"
										strokeDasharray={circumference}
										style={{
											filter: 'drop-shadow(0 0 8px rgba(167,139,250,0.9))',
										}}
									/>
								</svg>
								<div className="absolute inset-0 flex flex-col items-center justify-center">
									<div className="flex items-baseline">
										<span className="text-[30px] font-bold text-white leading-none">
											{(confidence * 100).toFixed(1)}
										</span>
										<span className="text-[14px] text-slate-400 ml-0.5 font-semibold">
											%
										</span>
									</div>
									<div
										className="text-[9px] tracking-[0.2em] uppercase mt-1"
										style={{ color: '#6b6890' }}
									>
										Confidence
									</div>
								</div>
							</div>

							{/* Bottom */}
							<div className="w-full mt-auto space-y-4">
								<div
									className="w-full rounded-xl px-4 py-4 text-center"
									style={{ background: 'rgba(255,255,255,0.04)' }}
								>
									<div
										className="text-[9px] tracking-[0.2em] uppercase mb-2 font-semibold"
										style={{ color: '#6b6890' }}
									>
										Prediction Output
									</div>
									<div className="text-[21px] font-bold text-white capitalize">
										{prediction}
									</div>
								</div>

								{delta !== null && delta !== undefined && (
									<div className="flex items-center justify-between text-[12px] w-full px-0.5">
										<span style={{ color: '#6b6890' }}>
											Performance vs Baseline:
										</span>
										<span
											className="font-bold px-2.5 py-0.5 rounded text-[12px]"
											style={{
												color: delta >= 0 ? '#4ade80' : '#f87171',
												background:
													delta >= 0 ?
														'rgba(74,222,128,0.12)'
													:	'rgba(248,113,113,0.12)',
											}}
										>
											{delta >= 0 ? '+' : ''}
											{delta.toFixed(1)}%
										</span>
									</div>
								)}
							</div>
						</motion.div>
					</TooltipWrapper>
				</div>
			</div>
		);
	}

	// ── Non-highlighted card ──────────────────────────────────────────
	const plainCircumference = 2 * Math.PI * 54;
	const plainStroke = Math.min(confidence, 1) * plainCircumference;

	return (
		<TooltipWrapper tip={modelTooltip}>
			<motion.div
				initial={{ opacity: 0, y: 24 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true, margin: '-20%' }}
				transition={{ duration: 0.4 }}
				className="relative rounded-2xl flex flex-col items-center px-6 pt-7 pb-5 min-h-97.5 w-full cursor-default"
				style={{
					background: '#13111f',
					border: '1px solid rgba(255,255,255,0.07)',
				}}
			>
				<div className="text-center w-full mb-1 mt-2">
					<div className="text-[18px] font-bold text-white tracking-tight">
						{title}
					</div>
					<div
						className="text-[12px] mt-1 font-normal"
						style={{ color: '#6b6890' }}
					>
						{tag}
					</div>
				</div>

				<div className="relative flex items-center justify-center my-6">
					<svg
						width="140"
						height="140"
						viewBox="0 0 140 140"
						style={{ transform: 'rotate(-90deg)' }}
					>
						<circle
							cx="70"
							cy="70"
							r="54"
							fill="none"
							stroke="rgba(255,255,255,0.05)"
							strokeWidth="10"
						/>
						<motion.circle
							initial={{ strokeDashoffset: plainCircumference }}
							animate={{ strokeDashoffset: plainCircumference - plainStroke }}
							transition={{ duration: 0.9, ease: 'easeOut' }}
							cx="70"
							cy="70"
							r="54"
							fill="none"
							stroke="#334155"
							strokeWidth="10"
							strokeLinecap="round"
							strokeDasharray={plainCircumference}
						/>
					</svg>
					<div className="absolute inset-0 flex flex-col items-center justify-center">
						<div className="flex items-baseline">
							<span className="text-[27px] font-bold text-white leading-none">
								{(confidence * 100).toFixed(1)}
							</span>
							<span className="text-[13px] text-slate-400 ml-0.5 font-semibold">
								%
							</span>
						</div>
						<div
							className="text-[9px] tracking-[0.2em] uppercase mt-1"
							style={{ color: '#6b6890' }}
						>
							Confidence
						</div>
					</div>
				</div>

				<div className="w-full mt-auto space-y-4">
					<div
						className="w-full rounded-xl px-4 py-4 text-center"
						style={{ background: 'rgba(255,255,255,0.03)' }}
					>
						<div
							className="text-[9px] tracking-[0.2em] uppercase mb-2 font-semibold"
							style={{ color: '#6b6890' }}
						>
							Prediction Output
						</div>
						<div className="text-[21px] font-bold text-white capitalize">
							{prediction}
						</div>
					</div>

					{delta !== null && delta !== undefined && (
						<div className="flex items-center justify-between text-[12px] w-full px-0.5">
							<span style={{ color: '#6b6890' }}>Performance vs Baseline:</span>
							<span
								className="font-bold px-2.5 py-0.5 rounded text-[12px]"
								style={{
									color: delta >= 0 ? '#4ade80' : '#f87171',
									background:
										delta >= 0 ?
											'rgba(74,222,128,0.12)'
										:	'rgba(248,113,113,0.12)',
								}}
							>
								{delta >= 0 ? '+' : ''}
								{delta.toFixed(1)}%
							</span>
						</div>
					)}
				</div>
			</motion.div>
		</TooltipWrapper>
	);
}
