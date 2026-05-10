'use client';

import ConfidenceBar from '@/components/ui/ConfidenceBar';
import SportBadge from '@/components/ui/SportBadge';
import { sendLiveFrame } from '@/lib/api';
import { formatConfidence } from '@/lib/utils';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
	Bar,
	BarChart,
	CartesianGrid,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts';

// ── Design tokens ─────────────────────────────────────────────────────────────
const C = {
	bg: '#0d0c18',
	card: '#13111f',
	border: 'rgba(255,255,255,0.06)',
	muted: '#6b6890',
	text: '#e2e0f0',
	accent: '#a78bfa',
	accentDim: 'rgba(167,139,250,0.12)',
	improved: '#818cf8',
	danger: '#f87171',
	success: '#4ade80',
	warning: '#fbbf24',
};

const VARIANTS = [
	{ id: 'baseline', label: 'Baseline' },
	{ id: 'improved', label: 'Improved' },
	{ id: 'resnet50', label: 'ResNet-50' },
];

// ── Shared card shell ─────────────────────────────────────────────────────────
function Card({
	children,
	style = {},
}: {
	children: React.ReactNode;
	style?: React.CSSProperties;
}) {
	return (
		<div
			style={{
				background: C.card,
				border: `1px solid ${C.border}`,
				borderRadius: 18,
				padding: 24,
				...style,
			}}
		>
			{children}
		</div>
	);
}

// ── Section label ─────────────────────────────────────────────────────────────
function SectionLabel({ children }: { children: React.ReactNode }) {
	return (
		<div
			style={{
				fontSize: 10,
				fontWeight: 700,
				textTransform: 'uppercase' as const,
				letterSpacing: '0.16em',
				color: C.muted,
				marginBottom: 14,
			}}
		>
			{children}
		</div>
	);
}

// ── Variant tab pill ──────────────────────────────────────────────────────────
function VariantPill({
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
				padding: '6px 16px',
				borderRadius: 99,
				fontSize: 12,
				fontWeight: 600,
				cursor: 'pointer',
				transition: 'all 0.2s',
				border: active ? 'none' : `1px solid ${C.border}`,
				background:
					active ?
						`linear-gradient(90deg, #6c4fd4, ${C.accent})`
					:	'transparent',
				color: active ? '#fff' : C.muted,
				boxShadow: active ? `0 0 14px ${C.accent}55` : 'none',
				letterSpacing: '0.04em',
			}}
		>
			{label}
		</button>
	);
}

// ── Chart tooltip ─────────────────────────────────────────────────────────────
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
				<div style={{ color: C.text, fontWeight: 600, marginBottom: 6 }}>
					{label}
				</div>
			)}
			{payload.map((p: any) => (
				<div
					key={p.name}
					style={{ display: 'flex', alignItems: 'center', gap: 8 }}
				>
					<span
						style={{
							display: 'inline-block',
							width: 8,
							height: 8,
							borderRadius: 2,
							background: p.fill,
						}}
					/>
					<span style={{ color: C.muted }}>{p.dataKey}:</span>
					<span style={{ color: '#fff', fontWeight: 700 }}>
						{Number(p.value).toFixed(1)}%
					</span>
				</div>
			))}
		</div>
	);
}

// ── Main ───────────────────────────────────────────────────────────────────────
export default function LiveSection({
	onError,
}: {
	onError: (message: string) => void;
}) {
	const [active, setActive] = useState(false);
	const [variant, setVariant] = useState('resnet50');
	const [result, setResult] = useState<any>(null);
	const [history, setHistory] = useState<Array<any>>([]);
	const [fps, setFps] = useState(0);
	const [permissionError, setPermErr] = useState(false);
	const [noCamera, setNoCamera] = useState(false);
	const [handVisible, setHandVisible] = useState(false);
	const [isFullscreen, setIsFullscreen] = useState(false);

	const videoRef = useRef<HTMLVideoElement | null>(null);
	const overlayRef = useRef<HTMLCanvasElement | null>(null);
	const captureRef = useRef<HTMLCanvasElement | null>(null);
	const containerRef = useRef<HTMLDivElement | null>(null);
	const intervalRef = useRef<any>(null);
	const frameCountRef = useRef(0);
	const lastTimeRef = useRef<number | null>(null);
	const handsRef = useRef<any>(null);
	const cameraRef = useRef<any>(null);
	const handVisRef = useRef(false);
	const lastHandRef = useRef(0);
	const inFlightRef = useRef(false);

	useEffect(() => {
		lastTimeRef.current = Date.now();
	}, []);

	const stopStream = useCallback(() => {
		if (intervalRef.current) clearInterval(intervalRef.current);
		intervalRef.current = null;
		if (cameraRef.current?.stop) cameraRef.current.stop();
		cameraRef.current = null;
		if (videoRef.current?.srcObject) {
			(videoRef.current.srcObject as MediaStream)
				.getTracks()
				.forEach((t) => t.stop());
			videoRef.current.srcObject = null;
		}
		handVisRef.current = false;
		lastHandRef.current = 0;
		setHandVisible(false);
		setActive(false);
	}, []);

	const startStream = useCallback(async () => {
		setPermErr(false);
		setNoCamera(false);
		setHandVisible(false);
		handVisRef.current = false;
		lastHandRef.current = 0;
		try {
			const stream = await navigator.mediaDevices.getUserMedia({ video: true });
			if (videoRef.current) {
				videoRef.current.srcObject = stream;
				await videoRef.current.play();
			}

			const { Hands } = await import('@mediapipe/hands');
			const { Camera } = await import('@mediapipe/camera_utils');
			const hands = new Hands({
				locateFile: (f: string) =>
					`https://cdn.jsdelivr.net/npm/@mediapipe/hands/${f}`,
			});
			hands.setOptions({
				maxNumHands: 2,
				modelComplexity: 1,
				minDetectionConfidence: 0.6,
				minTrackingConfidence: 0.6,
			});
			hands.onResults((results: any) => {
				const canvas = overlayRef.current;
				const video = videoRef.current;
				if (!canvas || !video) return;
				const w = video.videoWidth || 640,
					h = video.videoHeight || 480;
				canvas.width = w;
				canvas.height = h;
				const ctx = canvas.getContext('2d');
				if (!ctx) return;
				ctx.clearRect(0, 0, w, h);
				ctx.fillStyle = 'rgba(167,139,250,0.85)';
				const hasHand = !!results.multiHandLandmarks?.length;
				if (hasHand) lastHandRef.current = Date.now();
				const visible = Date.now() - lastHandRef.current < 600;
				if (handVisRef.current !== visible) {
					handVisRef.current = visible;
					setHandVisible(visible);
				}
				results.multiHandLandmarks?.forEach((landmarks: any) => {
					landmarks.forEach((point: any) => {
						ctx.beginPath();
						ctx.arc(point.x * w, point.y * h, 4, 0, Math.PI * 2);
						ctx.fill();
					});
				});
			});
			handsRef.current = hands;

			const camera = new Camera(videoRef.current, {
				onFrame: async () => {
					await hands.send({ image: videoRef.current });
				},
				width: 1280,
				height: 720,
			});
			cameraRef.current = camera;
			camera.start();
			setActive(true);
		} catch (err: any) {
			if (err?.name === 'NotFoundError') setNoCamera(true);
			if (err?.name === 'NotAllowedError') setPermErr(true);
			onError('Unable to start camera stream.');
			stopStream();
		}
	}, [onError, stopStream]);

	const captureFrame = useCallback(async () => {
		const canvas = captureRef.current;
		const video = videoRef.current;
		if (!canvas || !video || video.readyState < 2) return null;
		canvas.width = 224;
		canvas.height = 224;
		const ctx = canvas.getContext('2d');
		if (!ctx) return null;
		ctx.drawImage(video, 0, 0, 224, 224);
		return new Promise<Blob | null>((resolve) =>
			canvas.toBlob((b) => resolve(b), 'image/jpeg', 0.75)
		);
	}, []);

	useEffect(() => {
		if (!active) return;
		intervalRef.current = setInterval(async () => {
			if (!handVisRef.current || inFlightRef.current) return;
			const blob = await captureFrame();
			if (!blob) return;
			inFlightRef.current = true;
			try {
				const res = await sendLiveFrame(blob, variant);
				if (res) {
					setResult(res);
					setHistory((prev) => [
						{ time: new Date().toLocaleTimeString(), ...res },
						...prev.slice(0, 19),
					]);
				}
			} finally {
				inFlightRef.current = false;
			}
			frameCountRef.current += 1;
			const now = Date.now();
			if (now - lastTimeRef.current >= 1000) {
				setFps(frameCountRef.current);
				frameCountRef.current = 0;
				lastTimeRef.current = now;
			}
		}, 1000);
		return () => clearInterval(intervalRef.current);
	}, [active, captureFrame, variant]);

	useEffect(() => () => stopStream(), [stopStream]);
	useEffect(() => {
		const onChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
		document.addEventListener('fullscreenchange', onChange);
		return () => document.removeEventListener('fullscreenchange', onChange);
	}, []);

	const toggleFullscreen = useCallback(async () => {
		const el = containerRef.current;
		if (!el) return;
		if (!document.fullscreenElement) await el.requestFullscreen();
		else await document.exitFullscreen();
	}, []);

	const probsData =
		result?.all_signal_probs ?
			Object.entries(result.all_signal_probs).map(([name, value]: any) => ({
				name,
				value: value * 100,
			}))
		:	[];

	return (
		<section
			id="live"
			style={{
				maxWidth: 1400,
				margin: '0 auto',
				padding: '20px 24px 40px 24px',
			}}
		>
			{/* ── Header ───────────────────────────────────────────────────────── */}
			<div style={{ textAlign: 'center', marginBottom: 40 }}>
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
					Live Inference
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
					Live Signal Detection
				</h2>
				<p style={{ color: C.muted, fontSize: 13, marginTop: 10 }}>
					Real-time hand landmark detection with per-frame model inference
				</p>
			</div>

			{/* ── Controls bar ─────────────────────────────────────────────────── */}
			<div
				style={{
					display: 'flex',
					flexWrap: 'wrap',
					alignItems: 'center',
					justifyContent: 'space-between',
					gap: 12,
					marginBottom: 28,
				}}
			>
				{/* Start / Stop */}
				<div style={{ display: 'flex', gap: 10 }}>
					<button
						onClick={startStream}
						style={{
							padding: '8px 20px',
							borderRadius: 10,
							fontSize: 13,
							fontWeight: 700,
							cursor: 'pointer',
							background: `linear-gradient(90deg, #6c4fd4, ${C.accent})`,
							color: '#fff',
							border: 'none',
							boxShadow: `0 0 18px ${C.accent}55`,
							transition: 'all 0.2s',
						}}
					>
						Start Camera
					</button>
					<button
						onClick={stopStream}
						style={{
							padding: '8px 20px',
							borderRadius: 10,
							fontSize: 13,
							fontWeight: 600,
							cursor: 'pointer',
							background: 'transparent',
							color: C.danger,
							border: `1px solid ${C.danger}55`,
							transition: 'all 0.2s',
						}}
					>
						Stop
					</button>
				</div>

				{/* Model variant pills */}
				<div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
					{VARIANTS.map((v) => (
						<VariantPill
							key={v.id}
							label={v.label}
							active={variant === v.id}
							onClick={() => setVariant(v.id)}
						/>
					))}
				</div>

				{/* FPS badge */}
				<div
					style={{
						fontSize: 12,
						fontWeight: 600,
						color: C.muted,
						background: C.card,
						border: `1px solid ${C.border}`,
						padding: '6px 14px',
						borderRadius: 99,
						letterSpacing: '0.06em',
					}}
				>
					FPS:{' '}
					<span style={{ color: active ? C.success : C.muted }}>{fps}</span>
				</div>
			</div>

			{/* ── Main grid ────────────────────────────────────────────────────── */}
			<div
				style={{
					display: 'grid',
					gridTemplateColumns: '2fr 1fr',
					gap: 20,
					minHeight: '70vh',
				}}
				className="live-grid"
			>
				{/* Video panel */}
				<div
					ref={containerRef}
					style={{
						position: 'relative',
						borderRadius: 18,
						overflow: 'hidden',
						background: '#09080f',
						border: `1px solid ${C.border}`,
						height: '65vh',
					}}
				>
					{permissionError ?
						<div style={{ padding: 40, textAlign: 'center' }}>
							<div
								style={{
									fontSize: 16,
									fontWeight: 700,
									color: '#fff',
									marginBottom: 8,
								}}
							>
								Camera access denied
							</div>
							<div style={{ fontSize: 13, color: C.muted, marginBottom: 20 }}>
								Enable camera permissions and try again.
							</div>
							<button
								onClick={startStream}
								style={{
									padding: '8px 20px',
									borderRadius: 10,
									background: `linear-gradient(90deg,#6c4fd4,${C.accent})`,
									color: '#fff',
									border: 'none',
									fontWeight: 700,
									cursor: 'pointer',
								}}
							>
								Retry
							</button>
						</div>
					: noCamera ?
						<div style={{ padding: 40, textAlign: 'center' }}>
							<div
								style={{
									fontSize: 16,
									fontWeight: 700,
									color: '#fff',
									marginBottom: 8,
								}}
							>
								No camera detected
							</div>
							<div style={{ fontSize: 13, color: C.muted }}>
								Connect a camera and refresh the page.
							</div>
						</div>
					:	<>
							<video
								ref={videoRef}
								style={{
									position: 'absolute',
									inset: 0,
									width: '100%',
									height: '100%',
									objectFit: 'cover',
								}}
								muted
								playsInline
							/>
							<canvas
								ref={overlayRef}
								style={{
									position: 'absolute',
									inset: 0,
									width: '100%',
									height: '100%',
								}}
							/>
							<canvas
								ref={captureRef}
								style={{ display: 'none' }}
							/>

							{/* Live indicator dot */}
							{active && (
								<div
									style={{
										position: 'absolute',
										top: 16,
										left: 16,
										display: 'flex',
										alignItems: 'center',
										gap: 6,
										background: 'rgba(9,8,15,0.75)',
										border: `1px solid ${C.border}`,
										padding: '5px 12px',
										borderRadius: 99,
										backdropFilter: 'blur(8px)',
									}}
								>
									<span
										style={{
											width: 7,
											height: 7,
											borderRadius: '50%',
											background: C.success,
											display: 'inline-block',
											boxShadow: `0 0 8px ${C.success}`,
										}}
										className="pulse-dot"
									/>
									<span
										style={{
											fontSize: 11,
											fontWeight: 700,
											color: C.success,
											letterSpacing: '0.08em',
											textTransform: 'uppercase',
										}}
									>
										Live
									</span>
								</div>
							)}

							{/* Hand prompt */}
							{active && !handVisible && (
								<div
									style={{
										position: 'absolute',
										bottom: 20,
										left: '50%',
										transform: 'translateX(-50%)',
										background: 'rgba(9,8,15,0.8)',
										border: `1px solid ${C.border}`,
										padding: '8px 18px',
										borderRadius: 99,
										backdropFilter: 'blur(8px)',
										fontSize: 12,
										color: C.muted,
										whiteSpace: 'nowrap',
									}}
								>
									Show your hand to start predictions
								</div>
							)}

							{/* Overlay prediction badge */}
							{result && (
								<div
									style={{
										position: 'absolute',
										top: 16,
										right: 16,
										background: 'rgba(9,8,15,0.85)',
										border: `1px solid ${C.border}`,
										padding: '8px 16px',
										borderRadius: 14,
										backdropFilter: 'blur(8px)',
										display: 'flex',
										alignItems: 'center',
										gap: 10,
									}}
								>
									{result.signal !== 'noaction' && (
										<SportBadge sport={result.sport} />
									)}
									<span
										style={{
											fontSize: 14,
											fontWeight: 700,
											color: '#fff',
											textTransform: 'capitalize',
										}}
									>
										{result.signal === 'noaction' ? 'No action' : result.signal}
									</span>
									<span style={{ fontSize: 12, color: C.muted }}>
										{formatConfidence(result.signal_confidence)}
									</span>
								</div>
							)}

							{/* Fullscreen button */}
							<button
								onClick={toggleFullscreen}
								style={{
									position: 'absolute',
									bottom: 16,
									right: 16,
									background: 'rgba(9,8,15,0.75)',
									border: `1px solid ${C.border}`,
									color: C.muted,
									fontSize: 11,
									fontWeight: 600,
									padding: '5px 12px',
									borderRadius: 8,
									cursor: 'pointer',
									letterSpacing: '0.06em',
								}}
							>
								{isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
							</button>
						</>
					}
				</div>

				{/* Sidebar */}
				<div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
					{/* Current prediction */}
					<Card>
						<SectionLabel>Current Prediction</SectionLabel>
						{result ?
							<>
								<div
									style={{
										display: 'flex',
										alignItems: 'center',
										gap: 10,
										marginBottom: 16,
									}}
								>
									<SportBadge sport={result.sport} />
									{result.sport === 'football' && (
										<span
											style={{
												fontSize: 9,
												textTransform: 'uppercase',
												letterSpacing: '0.12em',
												color: C.warning,
												background: 'rgba(251,191,36,0.1)',
												padding: '3px 8px',
												borderRadius: 99,
												fontWeight: 700,
											}}
										>
											Experimental
										</span>
									)}
									<div
										style={{
											fontSize: 22,
											fontWeight: 800,
											color: '#fff',
											textTransform: 'capitalize',
											letterSpacing: '-0.01em',
										}}
									>
										{result.signal}
									</div>
								</div>
								<div
									style={{
										display: 'flex',
										justifyContent: 'space-between',
										fontSize: 12,
										color: C.muted,
										marginBottom: 10,
									}}
								>
									<span>Confidence</span>
									<span style={{ color: '#fff', fontWeight: 700 }}>
										{formatConfidence(result.signal_confidence)}
									</span>
								</div>
								<ConfidenceBar value={result.signal_confidence} />
							</>
						:	<div style={{ fontSize: 13, color: C.muted, lineHeight: 1.6 }}>
								Start the camera to stream frames for live inference.
							</div>
						}
					</Card>

					{/* Signal probabilities */}
					<Card>
						<SectionLabel>Signal Probabilities</SectionLabel>
						<div style={{ height: 200 }}>
							<ResponsiveContainer
								width="100%"
								height="100%"
							>
								<BarChart
									data={probsData}
									margin={{ top: 4, right: 8, left: -16, bottom: 4 }}
								>
									<CartesianGrid
										stroke="rgba(255,255,255,0.05)"
										vertical={false}
									/>
									<XAxis
										dataKey="name"
										tick={{ fill: C.muted, fontSize: 10 }}
										axisLine={false}
										tickLine={false}
									/>
									<YAxis
										domain={[0, 100]}
										tick={{ fill: C.muted, fontSize: 10 }}
										axisLine={false}
										tickLine={false}
										tickFormatter={(v) => `${v}%`}
									/>
									<Tooltip
										content={<ChartTooltip />}
										cursor={{ fill: 'rgba(255,255,255,0.03)' }}
									/>
									<Bar
										dataKey="value"
										fill={C.accent}
										radius={[4, 4, 0, 0]}
										isAnimationActive={false}
										maxBarSize={24}
										style={{ filter: `drop-shadow(0 0 5px ${C.accent}88)` }}
									/>
								</BarChart>
							</ResponsiveContainer>
						</div>
					</Card>

					{/* History */}
					<Card style={{ flex: 1, minHeight: 0 }}>
						<SectionLabel>Prediction History</SectionLabel>
						<div
							style={{
								maxHeight: 180,
								overflowY: 'auto',
								display: 'flex',
								flexDirection: 'column',
								gap: 6,
							}}
						>
							{history.length === 0 ?
								<div style={{ fontSize: 12, color: C.muted }}>
									No predictions yet.
								</div>
							:	history.map((item, idx) => (
									<div
										key={`${item.time}-${idx}`}
										style={{
											display: 'flex',
											alignItems: 'center',
											gap: 8,
											fontSize: 11,
											fontFamily: 'monospace',
											color: C.muted,
										}}
									>
										<span style={{ color: '#3d3a55', flexShrink: 0 }}>
											[{item.time}]
										</span>
										<span
											style={{ color: C.improved, textTransform: 'capitalize' }}
										>
											{item.sport}
										</span>
										<span
											style={{
												color: '#fff',
												fontWeight: 600,
												textTransform: 'capitalize',
											}}
										>
											{item.signal}
										</span>
										<span
											style={{
												marginLeft: 'auto',
												color: C.accent,
												flexShrink: 0,
											}}
										>
											{formatConfidence(item.signal_confidence)}
										</span>
									</div>
								))
							}
						</div>
					</Card>
				</div>
			</div>

			<style>{`
        @media (max-width: 900px) {
          .live-grid { grid-template-columns: 1fr !important; }
        }
        .pulse-dot { animation: pulse-glow 1.5s ease-in-out infinite; }
        @keyframes pulse-glow {
          0%, 100% { opacity: 1; box-shadow: 0 0 8px #4ade80; }
          50% { opacity: 0.5; box-shadow: 0 0 3px #4ade80; }
        }
      `}</style>
		</section>
	);
}
