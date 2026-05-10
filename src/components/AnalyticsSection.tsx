'use client';

import MetricsTable from '@/components/ui/MetricsTable';
import { getMetrics } from '@/lib/api';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import {
	Bar,
	BarChart,
	CartesianGrid,
	PolarAngleAxis,
	PolarGrid,
	PolarRadiusAxis,
	Radar,
	RadarChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts';

// ── Design tokens (match ModelCard palette) ───────────────────────────────────
const C = {
	bg: '#0d0c18',
	card: '#13111f',
	border: 'rgba(255,255,255,0.06)',
	muted: '#6b6890',
	text: '#e2e0f0',
	accent: '#a78bfa',
	accentDim: 'rgba(167,139,250,0.12)',
	baseline: '#475569',
	improved: '#818cf8',
	resnet: '#a78bfa',
};

const MODEL_COLORS = {
	Baseline: C.baseline,
	Improved: C.improved,
	ResNet50: C.resnet,
};

// ── Shared chart tooltip ───────────────────────────────────────────────────────
function ChartTooltip({ active, payload, label }: any) {
	if (!active || !payload?.length) return null;
	return (
		<div
			style={{
				background: '#1a1830',
				border: '1px solid rgba(167,139,250,0.2)',
				borderRadius: 12,
				padding: '10px 14px',
				boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
				fontSize: 12,
			}}
		>
			{label && (
				<div
					style={{
						color: '#e2e0f0',
						fontWeight: 600,
						marginBottom: 6,
						fontSize: 13,
					}}
				>
					{label}
				</div>
			)}
			{payload.map((p: any) => (
				<div
					key={p.name}
					style={{
						display: 'flex',
						alignItems: 'center',
						gap: 8,
						marginBottom: 3,
					}}
				>
					<span
						style={{
							display: 'inline-block',
							width: 10,
							height: 10,
							borderRadius: 3,
							background: p.fill ?? p.stroke,
							flexShrink: 0,
						}}
					/>
					<span style={{ color: C.muted }}>{p.name}:</span>
					<span
						style={{
							color: '#fff',
							fontWeight: 700,
							marginLeft: 'auto',
							paddingLeft: 8,
						}}
					>
						{typeof p.value === 'number' ? p.value.toFixed(4) : p.value}
					</span>
				</div>
			))}
		</div>
	);
}

// ── Card shell ─────────────────────────────────────────────────────────────────
function Card({
	children,
	className = '',
	style = {},
}: {
	children: React.ReactNode;
	className?: string;
	style?: React.CSSProperties;
}) {
	return (
		<div
			className={className}
			style={{
				background: C.card,
				border: `1px solid ${C.border}`,
				borderRadius: 18,
				padding: '24px',
				...style,
			}}
		>
			{children}
		</div>
	);
}

// ── Stat card ─────────────────────────────────────────────────────────────────
function StatCard({
	label,
	value,
	index,
}: {
	label: string;
	value: number;
	index: number;
}) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.4, delay: index * 0.08 }}
		>
			<Card>
				{/* Accent top bar */}
				<div
					style={{
						height: 3,
						width: 36,
						borderRadius: 99,
						background: `linear-gradient(90deg, ${C.improved}, ${C.resnet})`,
						marginBottom: 16,
						boxShadow: `0 0 10px ${C.resnet}88`,
					}}
				/>
				<div
					style={{
						fontSize: 36,
						fontWeight: 800,
						color: '#fff',
						letterSpacing: '-0.02em',
						lineHeight: 1,
					}}
				>
					{value.toFixed(4)}
				</div>
				<div
					style={{
						fontSize: 11,
						color: C.muted,
						marginTop: 10,
						textTransform: 'uppercase',
						letterSpacing: '0.12em',
					}}
				>
					{label}
				</div>
			</Card>
		</motion.div>
	);
}

// ── Tab pill ──────────────────────────────────────────────────────────────────
function Tab({
	label,
	active,
	onClick,
}: {
	label: string;
	active: boolean;
	onClick: () => void;
}) {
	return (
		<button
			onClick={onClick}
			style={{
				padding: '7px 18px',
				borderRadius: 99,
				fontSize: 12,
				fontWeight: 600,
				cursor: 'pointer',
				transition: 'all 0.2s',
				border: active ? 'none' : `1px solid ${C.border}`,
				background:
					active ?
						`linear-gradient(90deg, #6c4fd4, ${C.resnet})`
					:	'transparent',
				color: active ? '#fff' : C.muted,
				boxShadow: active ? `0 0 16px ${C.resnet}55` : 'none',
				letterSpacing: '0.04em',
			}}
		>
			{label}
		</button>
	);
}

// ── Section label ─────────────────────────────────────────────────────────────
function SectionLabel({ children }: { children: React.ReactNode }) {
	return (
		<div
			style={{
				fontSize: 11,
				fontWeight: 700,
				textTransform: 'uppercase',
				letterSpacing: '0.16em',
				color: C.muted,
				marginBottom: 14,
			}}
		>
			{children}
		</div>
	);
}

// ── Count-up hook ─────────────────────────────────────────────────────────────
function useCountUp(target: number, active: boolean) {
	const [value, setValue] = useState(0);
	useEffect(() => {
		if (!active) return;
		let frame = 0;
		const total = 40;
		const timer = setInterval(() => {
			frame += 1;
			setValue((target * frame) / total);
			if (frame >= total) clearInterval(timer);
		}, 25);
		return () => clearInterval(timer);
	}, [target, active]);
	return value;
}

// ── Custom legend ─────────────────────────────────────────────────────────────
function ChartLegend() {
	return (
		<div
			style={{
				display: 'flex',
				gap: 20,
				justifyContent: 'center',
				marginTop: 12,
			}}
		>
			{(Object.entries(MODEL_COLORS) as [string, string][]).map(
				([name, color]) => (
					<div
						key={name}
						style={{ display: 'flex', alignItems: 'center', gap: 6 }}
					>
						<span
							style={{
								display: 'inline-block',
								width: 10,
								height: 10,
								borderRadius: 3,
								background: color,
							}}
						/>
						<span style={{ fontSize: 11, color: C.muted }}>{name}</span>
					</div>
				)
			)}
		</div>
	);
}

// ── Main ───────────────────────────────────────────────────────────────────────
type AnalyticsSectionProps = { onError: (message: string) => void };

export default function AnalyticsSection({ onError }: AnalyticsSectionProps) {
	const [metrics, setMetrics] = useState<any>(null);
	const [loading, setLoading] = useState(true);
	const [activeTab, setActiveTab] = useState<'sport' | 'cricket' | 'football'>(
		'sport'
	);
	const statsRef = useRef<HTMLDivElement | null>(null);
	const [statsVisible, setStatsVisible] = useState(false);

	useEffect(() => {
		let active = true;
		getMetrics()
			.then((data) => {
				if (active) setMetrics(data);
			})
			.catch((err) => onError(err?.message || 'Failed to load metrics.'))
			.finally(() => setLoading(false));
		return () => {
			active = false;
		};
	}, [onError]);

	useEffect(() => {
		const el = statsRef.current;
		if (!el) return;

		const obs = new IntersectionObserver(
			(entries) => {
				if (entries[0]?.isIntersecting) setStatsVisible(true);
			},
			{ threshold: 0.3 }
		);

		obs.observe(el);
		return () => obs.disconnect();
	}, []);

	useEffect(() => {
		const el = statsRef.current;
		if (!el) return;
		const obs = new IntersectionObserver(
			(entries) => {
				if (entries[0]?.isIntersecting) setStatsVisible(true);
			},
			{ threshold: 0.3 }
		);
		obs.observe(el);
		return () => obs.disconnect();
	}, []);

	const statCricket = metrics?.cricket?.ResNet50?.f1 ?? 0;
	const statSport = metrics?.sport?.ResNet50?.acc ?? 0;
	const statFootball = metrics?.football?.ResNet50?.f1 ?? 0;

	const countCricket = useCountUp(statCricket, statsVisible);
	const countSport = useCountUp(statSport, statsVisible);
	const countFootball = useCountUp(statFootball, statsVisible);

	// ── Loading skeleton ─────────────────────────────────────────────────────────
	if (loading) {
		return (
			<section
				id="analytics"
				style={{ maxWidth: 1400, margin: '0 auto', padding: '80px 24px' }}
			>
				<div style={{ textAlign: 'center', marginBottom: 40 }}>
					<h2 style={{ fontSize: 28, fontWeight: 800, color: '#fff' }}>
						Model Performance Analytics
					</h2>
				</div>
				<div
					style={{
						display: 'grid',
						gridTemplateColumns: 'repeat(3,1fr)',
						gap: 20,
					}}
				>
					{[1, 2, 3].map((i) => (
						<div
							key={i}
							style={{
								height: 112,
								borderRadius: 18,
								background: 'rgba(255,255,255,0.04)',
								animation: 'pulse 1.5s ease-in-out infinite',
							}}
						/>
					))}
				</div>
			</section>
		);
	}

	// ── Chart data ────────────────────────────────────────────────────────────────
	const radarData = [
		{
			subject: 'Accuracy',
			Baseline: metrics?.[activeTab]?.Baseline?.acc ?? 0,
			Improved: metrics?.[activeTab]?.Improved?.acc ?? 0,
			ResNet50: metrics?.[activeTab]?.ResNet50?.acc ?? 0,
		},
		{
			subject: 'Precision',
			Baseline: metrics?.[activeTab]?.Baseline?.prec ?? 0,
			Improved: metrics?.[activeTab]?.Improved?.prec ?? 0,
			ResNet50: metrics?.[activeTab]?.ResNet50?.prec ?? 0,
		},
		{
			subject: 'Recall',
			Baseline: metrics?.[activeTab]?.Baseline?.rec ?? 0,
			Improved: metrics?.[activeTab]?.Improved?.rec ?? 0,
			ResNet50: metrics?.[activeTab]?.ResNet50?.rec ?? 0,
		},
		{
			subject: 'F1 Score',
			Baseline: metrics?.[activeTab]?.Baseline?.f1 ?? 0,
			Improved: metrics?.[activeTab]?.Improved?.f1 ?? 0,
			ResNet50: metrics?.[activeTab]?.ResNet50?.f1 ?? 0,
		},
	];

	const summaryData = ['sport', 'cricket', 'football'].map((task) => ({
		name:
			task === 'sport' ? 'Sport'
			: task === 'cricket' ? 'Cricket'
			: 'Football',
		Baseline: metrics?.[task]?.Baseline?.f1 ?? 0,
		Improved: metrics?.[task]?.Improved?.f1 ?? 0,
		ResNet50: metrics?.[task]?.ResNet50?.f1 ?? 0,
	}));

	const TABS = [
		{ key: 'sport', label: 'Sport Classification' },
		{ key: 'cricket', label: 'Cricket Signals' },
		{ key: 'football', label: 'Football Signals' },
	] as const;

	return (
		<section
			id="analytics"
			style={{
				maxWidth: 1400,
				margin: '0 auto',
				padding: '20px 24px 60px 24px',
			}}
		>
			{/* ── Page header ───────────────────────────────────────────────────── */}
			<motion.div
				initial={{ opacity: 0, y: 16 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				style={{ textAlign: 'center', marginBottom: 48 }}
			>
				<div
					style={{
						display: 'inline-block',
						fontSize: 10,
						fontWeight: 700,
						letterSpacing: '0.2em',
						textTransform: 'uppercase',
						color: C.accent,
						background: C.accentDim,
						padding: '5px 14px',
						borderRadius: 99,
						marginBottom: 14,
					}}
				>
					Performance Analytics
				</div>
				<h2
					style={{
						fontSize: 30,
						fontWeight: 800,
						color: '#fff',
						letterSpacing: '-0.02em',
						margin: 0,
					}}
				>
					Model Performance Analytics
				</h2>
				<p style={{ color: C.muted, fontSize: 13, marginTop: 10 }}>
					Accuracy, F1-score, precision and recall across all three
					architectures
				</p>
			</motion.div>

			{/* ── Stat cards ────────────────────────────────────────────────────── */}
			<div
				ref={statsRef}
				style={{
					display: 'grid',
					gridTemplateColumns: 'repeat(3,1fr)',
					gap: 20,
					marginBottom: 40,
				}}
				className="grid-responsive"
			>
				<StatCard
					label="Best Cricket F1 Score"
					value={countCricket}
					index={0}
				/>
				<StatCard
					label="Best Sport Accuracy"
					value={countSport}
					index={1}
				/>
				<StatCard
					label="Best Football F1 Score"
					value={countFootball}
					index={2}
				/>
			</div>

			{/* ── Tab bar ───────────────────────────────────────────────────────── */}
			<div
				style={{
					display: 'flex',
					gap: 8,
					justifyContent: 'center',
					marginBottom: 32,
					flexWrap: 'wrap',
				}}
			>
				{TABS.map((t) => (
					<Tab
						key={t.key}
						label={t.label}
						active={activeTab === t.key}
						onClick={() => setActiveTab(t.key)}
					/>
				))}
			</div>

			{/* ── Table + Radar row ─────────────────────────────────────────────── */}
			<div
				style={{
					display: 'grid',
					gridTemplateColumns: '1fr 1fr',
					gap: 20,
					marginBottom: 20,
				}}
				className="grid-responsive"
			>
				{/* Metrics table */}
				<AnimatePresence mode="wait">
					<motion.div
						key={`table-${activeTab}`}
						initial={{ opacity: 0, x: -10 }}
						animate={{ opacity: 1, x: 0 }}
						exit={{ opacity: 0, x: 10 }}
						transition={{ duration: 0.25 }}
					>
						<Card style={{ height: '100%' }}>
							<SectionLabel>Metrics Table</SectionLabel>
							<MetricsTable data={metrics?.[activeTab]} />
						</Card>
					</motion.div>
				</AnimatePresence>

				{/* Radar chart */}
				<AnimatePresence mode="wait">
					<motion.div
						key={`radar-${activeTab}`}
						initial={{ opacity: 0, x: 10 }}
						animate={{ opacity: 1, x: 0 }}
						exit={{ opacity: 0, x: -10 }}
						transition={{ duration: 0.25 }}
					>
						<Card style={{ height: '100%' }}>
							<SectionLabel>Multidimensional Comparison</SectionLabel>
							<div style={{ height: 280 }}>
								<ResponsiveContainer
									width="100%"
									height="100%"
								>
									<RadarChart data={radarData}>
										<PolarGrid stroke="rgba(255,255,255,0.07)" />
										<PolarAngleAxis
											dataKey="subject"
											tick={{ fill: C.muted, fontSize: 11 }}
										/>
										<PolarRadiusAxis
											angle={30}
											domain={[0, 1]}
											tick={false}
										/>
										<Tooltip content={<ChartTooltip />} />
										<Radar
											dataKey="Baseline"
											stroke={C.baseline}
											fill={C.baseline}
											fillOpacity={0.12}
										/>
										<Radar
											dataKey="Improved"
											stroke={C.improved}
											fill={C.improved}
											fillOpacity={0.15}
										/>
										<Radar
											dataKey="ResNet50"
											stroke={C.resnet}
											fill={C.resnet}
											fillOpacity={0.18}
											style={{ filter: `drop-shadow(0 0 6px ${C.resnet}88)` }}
										/>
									</RadarChart>
								</ResponsiveContainer>
							</div>
							<ChartLegend />
						</Card>
					</motion.div>
				</AnimatePresence>
			</div>

			{/* ── F1 bar chart ──────────────────────────────────────────────────── */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true }}
				transition={{ duration: 0.4 }}
			>
				<Card>
					<SectionLabel>F1-Score Across All Tasks and Models</SectionLabel>
					<div style={{ height: 300 }}>
						<ResponsiveContainer
							width="100%"
							height="100%"
						>
							<BarChart
								data={summaryData}
								barCategoryGap="32%"
								barGap={4}
							>
								<CartesianGrid
									stroke="rgba(255,255,255,0.05)"
									vertical={false}
								/>
								<XAxis
									dataKey="name"
									tick={{ fill: C.muted, fontSize: 11 }}
									axisLine={false}
									tickLine={false}
								/>
								<YAxis
									domain={[0, 1]}
									tick={{ fill: C.muted, fontSize: 11 }}
									axisLine={false}
									tickLine={false}
									width={40}
									tickFormatter={(v) => v.toFixed(1)}
								/>
								<Tooltip
									content={<ChartTooltip />}
									cursor={{ fill: 'rgba(255,255,255,0.03)', radius: 4 }}
								/>
								<Bar
									dataKey="Baseline"
									fill={C.baseline}
									radius={[4, 4, 0, 0]}
									maxBarSize={32}
								/>
								<Bar
									dataKey="Improved"
									fill={C.improved}
									radius={[4, 4, 0, 0]}
									maxBarSize={32}
								/>
								<Bar
									dataKey="ResNet50"
									fill={C.resnet}
									radius={[4, 4, 0, 0]}
									maxBarSize={32}
									style={{ filter: `drop-shadow(0 0 6px ${C.resnet}77)` }}
								/>
							</BarChart>
						</ResponsiveContainer>
					</div>
					<ChartLegend />
				</Card>
			</motion.div>

			{/* ── Responsive grid breakpoint ────────────────────────────────────── */}
			<style>{`
        @media (max-width: 768px) {
          .grid-responsive { grid-template-columns: 1fr !important; }
        }
      `}</style>
		</section>
	);
}
