'use client';

import UploadZone from '@/components/ui/UploadZone';
import { predict } from '@/lib/api';
import { formatConfidence } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useMemo, useState } from 'react';

type PredictSectionProps = {
	onError: (message: string) => void;
};

export default function PredictSection({ onError }: PredictSectionProps) {
	const [file, setFile] = useState<File | null>(null);
	const [result, setResult] = useState<any>(null);
	const [loading, setLoading] = useState(false);

	const chartData = useMemo(() => {
		if (!result?.all_signal_probs) return [];
		return Object.entries(result.all_signal_probs).map(([name, value]) => ({
			name,
			value: Number(value) * 100,
		}));
	}, [result]);

	const runPrediction = useCallback(
		async (nextFile?: File | null) => {
			const targetFile = nextFile ?? file;
			if (!targetFile) return;
			setLoading(true);
			setResult(null);
			try {
				const res = await predict(targetFile);
				setResult(res);
			} catch (err: any) {
				onError(err?.message || 'Prediction failed.');
			} finally {
				setLoading(false);
			}
		},
		[file, onError]
	);

	return (
		<section
			id="predict"
			className="max-w-400 mx-auto px-6 py-12 styled-section"
		>
			<div className="mb-10  max-w-2xl mx-auto text-center">
				<h2 className="text-4xl font-black mb-3">Hierarchical Prediction</h2>
				<p className="text-(--color-text-secondary) max-w-2xl">
					Upload an image to see the 2-stage ResNet50 pipeline in action. The
					image is first classified by sport, then routed to the specific signal
					classifier.
				</p>
			</div>

			<div className="mt-8">
				<div
					className={`grid grid-cols-1 ${result ? 'lg:grid-cols-2 gap-8' : ''}`}
				>
					<motion.div
						layout="position"
						transition={{ duration: 0.35, ease: 'easeOut' }}
						className={`space-y-6 flex flex-col ${!result ? 'mx-auto max-w-2xl' : 'h-full grid grid-rows-1'}`}
					>
						<UploadZone
							label="Drop a referee image here"
							helperText="or click to browse"
							onFileSelect={(nextFile) => {
								setFile(nextFile);
								runPrediction(nextFile);
							}}
							busy={loading}
							className={result ? 'flex-1 min-h-0 h-full' : ''}
						/>
					</motion.div>

					<AnimatePresence>
						{result && (
							<motion.div
								initial={{ opacity: 0, x: 30 }}
								animate={{ opacity: 1, x: 0 }}
								exit={{ opacity: 0, x: 30 }}
								className="space-y-6 flex flex-col h-full"
							>
								<div className="rounded-(--radius-card) bg-[#111118] border border-(--color-border) p-8 flex items-center justify-between">
									<div className="flex flex-col items-center gap-3">
										<div className="w-14 h-14 rounded-2xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.05)] flex items-center justify-center">
											<svg
												width="24"
												height="24"
												viewBox="0 0 24 24"
												fill="none"
												stroke="#6366f1"
												strokeWidth="2"
											>
												<rect
													x="3"
													y="3"
													width="18"
													height="18"
													rx="2"
													ry="2"
												></rect>
												<circle
													cx="8.5"
													cy="8.5"
													r="1.5"
												></circle>
												<polyline points="21 15 16 10 5 21"></polyline>
											</svg>
										</div>
										<span className="text-[10px] uppercase tracking-widest font-semibold text-(--color-text-muted)">
											Image Input
										</span>
									</div>

									<div className="flex-1 h-px bg-linear-to-r from-transparent via-[rgba(255,255,255,0.1)] to-transparent mx-4"></div>

									<div className="flex flex-col items-center gap-3">
										<div className="w-14 h-14 rounded-2xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.05)] flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.1)]">
											<svg
												width="24"
												height="24"
												viewBox="0 0 24 24"
												fill="none"
												stroke="#818cf8"
												strokeWidth="2"
											>
												<rect
													x="3"
													y="3"
													width="7"
													height="7"
												></rect>
												<rect
													x="14"
													y="3"
													width="7"
													height="7"
												></rect>
												<rect
													x="14"
													y="14"
													width="7"
													height="7"
												></rect>
												<rect
													x="3"
													y="14"
													width="7"
													height="7"
												></rect>
											</svg>
										</div>
										<span className="text-[10px] uppercase tracking-widest font-semibold text-(--color-text-muted)">
											Sport Detection
										</span>
									</div>

									<div className="flex-1 h-px bg-linear-to-r from-transparent via-[rgba(255,255,255,0.1)] to-transparent mx-4"></div>

									<div className="flex flex-col items-center gap-3">
										<div className="w-14 h-14 rounded-2xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.05)] flex items-center justify-center">
											<svg
												width="24"
												height="24"
												viewBox="0 0 24 24"
												fill="none"
												stroke="#6366f1"
												strokeWidth="2"
											>
												<circle
													cx="12"
													cy="12"
													r="10"
												></circle>
												<circle
													cx="12"
													cy="12"
													r="6"
												></circle>
												<circle
													cx="12"
													cy="12"
													r="2"
												></circle>
											</svg>
										</div>
										<span className="text-[10px] uppercase tracking-widest font-semibold text-(--color-text-muted)">
											Signal Routing
										</span>
									</div>

									<div className="flex-1 h-px bg-linear-to-r from-transparent via-[rgba(255,255,255,0.1)] to-transparent mx-4"></div>

									<div className="flex flex-col items-center gap-3">
										<div className="w-14 h-14 rounded-full bg-[rgba(34,197,94,0.1)] border border-[rgba(34,197,94,0.2)] flex items-center justify-center shadow-[0_0_20px_rgba(34,197,94,0.15)]">
											<svg
												width="24"
												height="24"
												viewBox="0 0 24 24"
												fill="none"
												stroke="#22c55e"
												strokeWidth="2"
											>
												<polyline points="20 6 9 17 4 12"></polyline>
											</svg>
										</div>
										<span className="text-[10px] uppercase tracking-widest font-semibold text-(--color-text-muted)">
											Classification
										</span>
									</div>
								</div>

								<div className="rounded-(--radius-card) bg-[#111118] border border-(--color-border) p-8 flex flex-col justify-between flex-1">
									<div className="mb-6">
										<div className="text-[10px] uppercase tracking-widest font-semibold text-(--color-text-muted) mb-3">
											Stage 1: Sport Detection
										</div>
										<div className="flex items-center gap-4">
											<div className="px-3 py-1 bg-[rgba(255,255,255,0.05)] rounded-md text-sm font-semibold capitalize border border-[rgba(255,255,255,0.1)]">
												{result.sport}
											</div>
											<div className="flex-1">
												<div className="flex justify-between items-center text-xs text-(--color-text-muted) mb-2">
													<span>Confidence</span>
													<span className="text-white font-medium">
														{formatConfidence(result.sport_confidence)}
													</span>
												</div>
												<div className="w-full bg-[rgba(255,255,255,0.05)] rounded-full h-1.5 overflow-hidden">
													<motion.div
														initial={{ width: 0 }}
														animate={{
															width: `${result.sport_confidence * 100}%`,
														}}
														transition={{ duration: 0.8, ease: 'easeOut' }}
														className="h-full bg-blue-500 rounded-full"
													/>
												</div>
											</div>
										</div>
									</div>

									<div className="mb-8">
										<div className="text-[10px] uppercase tracking-widest font-semibold text-(--color-text-muted) mb-3">
											Stage 2: Signal Classification
										</div>
										<div className="flex items-center gap-6">
											<div
												className="text-[2.5rem] font-black capitalize text-[#818cf8] leading-none shrink-0"
												style={{ textShadow: '0 0 30px rgba(129,140,248,0.4)' }}
											>
												{result.signal === 'noaction' ?
													'No Action'
												:	result.signal}
											</div>
											<div className="flex-1 mt-1">
												<div className="flex justify-between items-center text-xs text-(--color-text-muted) mb-2">
													<span>Confidence</span>
													<span className="text-white font-medium">
														{formatConfidence(result.signal_confidence)}
													</span>
												</div>
												<div className="w-full bg-[rgba(255,255,255,0.05)] rounded-full h-1.5 overflow-hidden">
													<motion.div
														initial={{ width: 0 }}
														animate={{
															width: `${result.signal_confidence * 100}%`,
														}}
														transition={{
															duration: 1,
															ease: 'easeOut',
															delay: 0.2,
														}}
														className="h-full bg-[#818cf8] rounded-full shadow-[0_0_10px_#818cf8]"
													/>
												</div>
											</div>
										</div>
									</div>

									<div>
										<div className="text-[10px] uppercase tracking-widest font-semibold text-(--color-text-muted) mb-4">
											Probability Distribution
										</div>
										<div className="space-y-2">
											{chartData
												.sort((a, b) => b.value - a.value)
												.slice(0, 6)
												.map((item: any, idx: number) => (
													<div
														key={item.name}
														className="flex items-center gap-3"
													>
														<span className="text-xs text-(--color-text-secondary) w-16 text-right capitalize truncate">
															{item.name === 'noaction' ?
																'No Action'
															:	item.name}
														</span>
														<div className="flex-1 h-3 bg-[rgba(255,255,255,0.03)] rounded overflow-hidden">
															<motion.div
																initial={{ width: 0 }}
																animate={{
																	width: `${Math.max(item.value, 1)}%`,
																}}
																transition={{
																	duration: 0.8,
																	delay: 0.3 + idx * 0.05,
																}}
																className={`h-full ${item.name === result.signal ? 'bg-[#818cf8]' : 'bg-[rgba(255,255,255,0.1)]'}`}
															/>
														</div>
													</div>
												))}
										</div>
									</div>
								</div>
							</motion.div>
						)}
					</AnimatePresence>
				</div>
			</div>
		</section>
	);
}
