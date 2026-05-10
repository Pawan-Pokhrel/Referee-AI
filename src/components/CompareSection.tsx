'use client';

import ModelCard from '@/components/ui/ModelCard';
import UploadZone from '@/components/ui/UploadZone';
import { compare } from '@/lib/api';
import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useMemo, useState } from 'react';
import ClassProbabilityChart from './ClassProbabilityChart';

type CompareSectionProps = {
	onError: (message: string) => void;
};

export default function CompareSection({ onError }: CompareSectionProps) {
	const [file, setFile] = useState<File | null>(null);
	const [result, setResult] = useState<any>(null);
	const [loading, setLoading] = useState(false);

	const chartData = useMemo(() => {
		if (!result?.signal_comparison?.resnet50?.all_probs) return [];
		return Object.keys(result.signal_comparison.resnet50.all_probs).map(
			(cls) => ({
				name: cls,
				Baseline: result.signal_comparison.baseline.all_probs[cls] * 100,
				Improved: result.signal_comparison.improved.all_probs[cls] * 100,
				ResNet50: result.signal_comparison.resnet50.all_probs[cls] * 100,
			})
		);
	}, [result]);

	const runCompare = useCallback(
		async (nextFile?: File | null) => {
			const targetFile = nextFile ?? file;
			if (!targetFile) return;
			setLoading(true);
			setResult(null);
			try {
				const res = await compare(targetFile);
				setResult(res);
			} catch (err: any) {
				onError(err?.message || 'Comparison failed.');
			} finally {
				setLoading(false);
			}
		},
		[file, onError]
	);

	useEffect(() => {
		if (!file) return;

		const timeout = setTimeout(() => {
			runCompare(file);
		}, 0);

		return () => clearTimeout(timeout);
	}, [file, runCompare]);

	const baselineConfidence =
		result?.signal_comparison?.baseline?.confidence ?? 0;
	const resnetConfidence = result?.signal_comparison?.resnet50?.confidence ?? 0;
	const delta = (resnetConfidence - baselineConfidence) * 100;

	return (
		<section
			id="compare"
			className="max-w-400 mx-auto px-6 py-12 styled-section"
		>
			<div className="flex flex-col mb-10 w-full col-span-full">
				{/* We can hide title text similar to screenshot or leave it. We'll leave it out since screenshot jumps straight into Grid */}
			</div>

			<div
				className={`grid grid-cols-1 ${result ? 'lg:grid-cols-4 gap-8' : ''}`}
			>
				<motion.div
					layout="position"
					transition={{ duration: 0.35, ease: 'easeOut' }}
					className={`${result ? 'lg:col-span-1 h-[calc(100vh-150px)] sticky top-20 ' : 'mx-auto max-w-2xl w-full'}`}
				>
					<UploadZone
						label="Drop a comparison image"
						helperText="See all model variants side-by-side"
						onFileSelect={setFile}
						busy={loading}
					/>
				</motion.div>

				<AnimatePresence>
					{result && (
						<motion.div
							initial={{ opacity: 0, x: 30 }}
							animate={{ opacity: 1, x: 0 }}
							exit={{ opacity: 0, x: 30 }}
							className="lg:col-span-3 space-y-12"
						>
							<div>
								<h3 className="text-xl font-bold text-center mb-8">
									Stage 1: Sport Detection Models
								</h3>
								<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
									{['baseline', 'improved', 'resnet50'].map((variant) => (
										<ModelCard
											key={variant}
											title={
												variant === 'resnet50' ? 'ResNet50'
												: variant === 'improved' ?
													'Improved CNN'
												:	'Baseline CNN'
											}
											tag={
												variant === 'resnet50' ? 'Pretrained Backbone'
												: variant === 'improved' ?
													'Double Conv + BN'
												:	'3 Conv Blocks'
											}
											confidence={result.sport_comparison[variant].confidence}
											prediction={result.sport_comparison[variant].prediction}
											highlight={variant === 'resnet50'}
											delta={
												variant === 'baseline' ? null : (
													(result.sport_comparison[variant].confidence -
														result.sport_comparison.baseline.confidence) *
													100
												)
											}
										/>
									))}
								</div>
							</div>

							<div>
								<h3 className="text-xl font-bold text-center mb-8 capitalize">
									Stage 2: Routed Signal Classification (
									{result.sport_comparison?.resnet50?.prediction || 'cricket'})
								</h3>
								<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
									{['baseline', 'improved', 'resnet50'].map((variant) => (
										<ModelCard
											key={variant}
											title={
												variant === 'resnet50' ? 'ResNet50'
												: variant === 'improved' ?
													'Improved CNN'
												:	'Baseline CNN'
											}
											tag={
												variant === 'resnet50' ? 'Pretrained Backbone'
												: variant === 'improved' ?
													'Double Conv + BN'
												:	'3 Conv Blocks'
											}
											confidence={result.signal_comparison[variant].confidence}
											prediction={result.signal_comparison[variant].prediction}
											highlight={variant === 'resnet50'}
											delta={
												variant === 'baseline' ? null : (
													(result.signal_comparison[variant].confidence -
														result.signal_comparison.baseline.confidence) *
													100
												)
											}
										/>
									))}
								</div>
								<ClassProbabilityChart chartData={chartData} />
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</section>
	);
}
