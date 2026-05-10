'use client';
import {
	Bar,
	BarChart,
	CartesianGrid,
	Cell,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts';

// ── Types ──────────────────────────────────────────────────────────────────────
// Each entry: { name: string; Baseline: number; Improved: number; ResNet50: number }
// Values are already in % (0–100), matching how CompareSection builds chartData.
type ChartEntry = {
	name: string;
	Baseline: number;
	Improved: number;
	ResNet50: number;
};

type ClassProbabilityChartProps = {
	chartData: ChartEntry[];
};

// ── Colors ─────────────────────────────────────────────────────────────────────
const MODEL_COLORS = {
	Baseline: '#475569',
	Improved: '#818cf8',
	ResNet50: '#a78bfa',
};

// ── Custom tooltip ─────────────────────────────────────────────────────────────
function CustomTooltip({ active, payload, label }: any) {
	if (!active || !payload?.length) return null;
	return (
		<div
			className="rounded-xl px-4 py-3 text-xs"
			style={{
				background: '#1a1830',
				border: '1px solid rgba(167,139,250,0.2)',
				boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
				minWidth: 160,
			}}
		>
			<div className="font-semibold text-white mb-2 text-[13px]">{label}</div>
			{payload.map((entry: any) => (
				<div
					key={entry.name}
					className="flex items-center gap-2 mb-1"
				>
					<span
						className="inline-block w-2.5 h-2.5 rounded-sm shrink-0"
						style={{ background: entry.fill }}
					/>
					<span style={{ color: '#9b99b8' }}>{entry.name}:</span>
					<span className="font-bold text-white ml-auto pl-2">
						{Number(entry.value).toFixed(1)}%
					</span>
				</div>
			))}
		</div>
	);
}

// ── Custom legend ──────────────────────────────────────────────────────────────
function CustomLegend() {
	return (
		<div className="flex items-center justify-center gap-6 mt-5">
			{(Object.entries(MODEL_COLORS) as [string, string][]).map(
				([name, color]) => (
					<div
						key={name}
						className="flex items-center gap-2"
					>
						<span
							className="inline-block w-3 h-3 rounded-sm"
							style={{ background: color }}
						/>
						<span
							className="text-[11px]"
							style={{ color: '#6b6890' }}
						>
							{name === 'Baseline' ?
								'Baseline CNN'
							: name === 'Improved' ?
								'Improved CNN'
							:	'ResNet50'}
						</span>
					</div>
				)
			)}
		</div>
	);
}

// ── Main ───────────────────────────────────────────────────────────────────────
export default function ClassProbabilityChart({
	chartData,
}: ClassProbabilityChartProps) {
	if (!chartData?.length) return null;

	return (
		<div
			className="rounded-2xl px-6 pt-6 pb-4 w-full mt-8"
			style={{
				background: '#13111f',
				border: '1px solid rgba(255,255,255,0.06)',
			}}
		>
			{/* Header */}
			<div className="mb-6 text-center">
				<h3 className="text-[15px] font-semibold text-white tracking-tight">
					Class Probability Distribution Across Models
				</h3>
				<p
					className="text-[11px] mt-1"
					style={{ color: '#6b6890' }}
				>
					Per-class softmax probabilities for each architecture
				</p>
			</div>

			{/* Chart */}
			<ResponsiveContainer
				width="100%"
				height={320}
			>
				<BarChart
					data={chartData}
					margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
					barCategoryGap="28%"
					barGap={3}
				>
					<CartesianGrid
						strokeDasharray="3 3"
						stroke="rgba(255,255,255,0.05)"
						vertical={false}
					/>
					<XAxis
						dataKey="name"
						tick={{ fill: '#6b6890', fontSize: 11 }}
						axisLine={false}
						tickLine={false}
					/>
					<YAxis
						tickFormatter={(v) => `${v.toFixed(0)}%`}
						tick={{ fill: '#6b6890', fontSize: 11 }}
						axisLine={false}
						tickLine={false}
						domain={[0, 100]}
						ticks={[0, 25, 50, 75, 100]}
						width={44}
					/>
					<Tooltip
						content={<CustomTooltip />}
						cursor={{ fill: 'rgba(255,255,255,0.03)', radius: 4 }}
					/>

					<Bar
						dataKey="Baseline"
						fill={MODEL_COLORS.Baseline}
						radius={[4, 4, 0, 0]}
						maxBarSize={28}
					/>
					<Bar
						dataKey="Improved"
						fill={MODEL_COLORS.Improved}
						radius={[4, 4, 0, 0]}
						maxBarSize={28}
					/>
					<Bar
						dataKey="ResNet50"
						fill={MODEL_COLORS.ResNet50}
						radius={[4, 4, 0, 0]}
						maxBarSize={28}
					>
						{chartData.map((_, i) => (
							<Cell
								key={i}
								fill={MODEL_COLORS.ResNet50}
								style={{
									filter: 'drop-shadow(0 0 5px rgba(167,139,250,0.55))',
								}}
							/>
						))}
					</Bar>
				</BarChart>
			</ResponsiveContainer>

			<CustomLegend />
		</div>
	);
}
