'use client';

import { predictFrame } from '@/lib/api';
import { Camera } from '@mediapipe/camera_utils';
import { Hands } from '@mediapipe/hands';
import { useCallback, useEffect, useRef, useState } from 'react';

const DEFAULT_FRAME_INTERVAL_MS = 500;
const DEFAULT_FRAME_SIZE = 224;

// ── Design tokens ─────────────────────────────────────────────────────────────
const C = {
	card: '#13111f',
	border: 'rgba(255,255,255,0.06)',
	muted: '#6b6890',
	text: '#e2e0f0',
	accent: '#a78bfa',
	accentDim: 'rgba(167,139,250,0.12)',
	improved: '#818cf8',
	success: '#4ade80',
	danger: '#f87171',
};

function drawLandmarks(ctx, landmarks) {
	ctx.fillStyle = 'rgba(167,139,250,0.9)';
	ctx.shadowColor = 'rgba(167,139,250,0.6)';
	ctx.shadowBlur = 8;

	for (const point of landmarks) {
		ctx.beginPath();
		ctx.arc(point.x, point.y, 4, 0, Math.PI * 2);
		ctx.fill();
	}

	ctx.shadowBlur = 0;
}

// ── Stat row ──────────────────────────────────────────────────────────────────
function StatRow({ label, value, accent = false }) {
	return (
		<div
			style={{
				display: 'flex',
				justifyContent: 'space-between',
				alignItems: 'center',
				padding: '7px 0',
				borderBottom: `1px solid ${C.border}`,
			}}
		>
			<span
				style={{
					fontSize: 12,
					color: C.muted,
					textTransform: 'uppercase',
					letterSpacing: '0.1em',
					fontWeight: 600,
				}}
			>
				{label}
			</span>

			<span
				style={{
					fontSize: 13,
					fontWeight: 700,
					color: accent ? C.accent : C.text,
				}}
			>
				{value}
			</span>
		</div>
	);
}

// ── Main ───────────────────────────────────────────────────────────────────────
export default function LiveWebcamPredictor({
	frameIntervalMs = DEFAULT_FRAME_INTERVAL_MS,
	frameSize = DEFAULT_FRAME_SIZE,
}) {
	const [liveActive, setLiveActive] = useState(false);
	const [liveResult, setLiveResult] = useState(null);
	const [liveError, setLiveError] = useState(null);

	const videoRef = useRef(null);
	const overlayRef = useRef(null);
	const captureRef = useRef(null);
	const handsRef = useRef(null);
	const cameraRef = useRef(null);
	const intervalRef = useRef(null);
	const busyRef = useRef(false);

	const stopLive = useCallback(() => {
		if (intervalRef.current) {
			clearInterval(intervalRef.current);
			intervalRef.current = null;
		}

		if (cameraRef.current) {
			cameraRef.current.stop();
			cameraRef.current = null;
		}

		if (videoRef.current?.srcObject) {
			videoRef.current.srcObject.getTracks().forEach((t) => t.stop());
			videoRef.current.srcObject = null;
		}

		setLiveActive(false);
	}, []);

	const captureFrame = useCallback(async () => {
		const video = videoRef.current;
		const canvas = captureRef.current;

		if (!video || !canvas || video.readyState < 2) return null;

		canvas.width = frameSize;
		canvas.height = frameSize;

		const ctx = canvas.getContext('2d');
		if (!ctx) return null;

		ctx.drawImage(video, 0, 0, frameSize, frameSize);

		return new Promise((resolve) =>
			canvas.toBlob((blob) => resolve(blob), 'image/jpeg', 0.85)
		);
	}, [frameSize]);

	const startLive = useCallback(async () => {
		try {
			setLiveError(null);
			setLiveResult(null);

			if (!handsRef.current) {
				const hands = new Hands({
					locateFile: (f) =>
						`https://cdn.jsdelivr.net/npm/@mediapipe/hands/${f}`,
				});

				hands.setOptions({
					maxNumHands: 2,
					modelComplexity: 1,
					minDetectionConfidence: 0.6,
					minTrackingConfidence: 0.6,
				});

				hands.onResults((results) => {
					const canvas = overlayRef.current;
					const video = videoRef.current;

					if (!canvas || !video) return;

					const w = video.videoWidth || 640;
					const h = video.videoHeight || 480;

					canvas.width = w;
					canvas.height = h;

					const ctx = canvas.getContext('2d');
					if (!ctx) return;

					ctx.clearRect(0, 0, w, h);

					if (results.multiHandLandmarks) {
						for (const landmarks of results.multiHandLandmarks) {
							drawLandmarks(
								ctx,
								landmarks.map((p) => ({
									x: p.x * w,
									y: p.y * h,
								}))
							);
						}
					}
				});

				handsRef.current = hands;
			}

			const camera = new Camera(videoRef.current, {
				onFrame: async () => {
					if (handsRef.current) {
						await handsRef.current.send({
							image: videoRef.current,
						});
					}
				},
				width: 1280,
				height: 720,
			});

			cameraRef.current = camera;
			camera.start();

			setLiveActive(true);

			intervalRef.current = setInterval(async () => {
				if (busyRef.current) return;

				busyRef.current = true;

				try {
					const blob = await captureFrame();
					if (!blob) return;

					const file = new File([blob], 'frame.jpg', {
						type: 'image/jpeg',
					});

					const res = await predictFrame(file);
					setLiveResult(res);
				} catch {
					setLiveError('Live prediction failed.');
				} finally {
					busyRef.current = false;
				}
			}, frameIntervalMs);
		} catch {
			setLiveError('Unable to access webcam. Check browser permissions.');
			stopLive();
		}
	}, [captureFrame, frameIntervalMs, stopLive]);

	useEffect(() => {
		return () => stopLive();
	}, [stopLive]);

	const fpsDisplay = (1000 / frameIntervalMs).toFixed(1);

	return (
		<div
			style={{
				background: C.card,
				border: `1px solid ${C.border}`,
				borderRadius: 22,
				padding: '28px 28px 24px',
				boxShadow: '0 0 48px rgba(167,139,250,0.06)',
			}}
		>
			{/* ── Header ─────────────────────────────────────────────────────── */}
			<div
				style={{
					display: 'flex',
					flexWrap: 'wrap',
					alignItems: 'flex-start',
					justifyContent: 'space-between',
					gap: 16,
					marginBottom: 24,
				}}
			>
				<div>
					<div
						style={{
							fontSize: 10,
							fontWeight: 700,
							letterSpacing: '0.18em',
							textTransform: 'uppercase',
							color: C.accent,
							background: C.accentDim,
							display: 'inline-block',
							padding: '4px 12px',
							borderRadius: 99,
							marginBottom: 10,
						}}
					>
						Live Tracking
					</div>

					<h2
						style={{
							fontSize: 22,
							fontWeight: 800,
							color: '#fff',
							margin: 0,
							letterSpacing: '-0.02em',
						}}
					>
						Live Hand Tracking
					</h2>

					<p
						style={{
							fontSize: 12,
							color: C.muted,
							margin: '6px 0 0',
							maxWidth: 480,
							lineHeight: 1.6,
						}}
					>
						Real-time hand landmark tracking with model inference. Ideal for
						computer-vision demos and interactive signal recognition.
					</p>
				</div>

				<div style={{ display: 'flex', gap: 10 }}>
					{!liveActive ?
						<button
							title="Start webcam live tracking"
							onClick={startLive}
							style={{
								padding: '9px 22px',
								borderRadius: 10,
								fontWeight: 700,
								fontSize: 13,
								cursor: 'pointer',
								background: `linear-gradient(90deg, #6c4fd4, ${C.accent})`,
								color: '#fff',
								border: 'none',
								boxShadow: `0 0 18px ${C.accent}55`,
							}}
						>
							Start Live
						</button>
					:	<button
							title="Stop webcam live tracking"
							onClick={stopLive}
							style={{
								padding: '9px 22px',
								borderRadius: 10,
								fontWeight: 600,
								fontSize: 13,
								cursor: 'pointer',
								background: 'transparent',
								color: C.danger,
								border: `1px solid ${C.danger}55`,
							}}
						>
							Stop Live
						</button>
					}
				</div>
			</div>

			{/* ── Main grid ──────────────────────────────────────────────────── */}
			<div
				style={{
					display: 'grid',
					gridTemplateColumns: '2fr 1fr',
					gap: 16,
				}}
				className="webcam-grid"
			>
				{/* Video */}
				<div
					style={{
						position: 'relative',
						borderRadius: 16,
						overflow: 'hidden',
						background: '#09080f',
						border: `1px solid ${C.border}`,
						aspectRatio: '16/9',
					}}
				>
					<video
						ref={videoRef}
						style={{
							width: '100%',
							height: '100%',
							objectFit: 'cover',
							display: 'block',
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

					{/* Live badge */}
					{liveActive && (
						<div
							style={{
								position: 'absolute',
								top: 14,
								left: 14,
								display: 'flex',
								alignItems: 'center',
								gap: 6,
								background: 'rgba(9,8,15,0.8)',
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
									animation: 'live-pulse 1.4s infinite',
								}}
							/>

							<span
								style={{
									fontSize: 10,
									fontWeight: 700,
									color: C.success,
									letterSpacing: '0.1em',
									textTransform: 'uppercase',
								}}
							>
								Live
							</span>
						</div>
					)}

					{/* Overlay result */}
					{liveResult && (
						<div
							style={{
								position: 'absolute',
								bottom: 14,
								left: 14,
								right: 14,
								background: 'rgba(9,8,15,0.88)',
								border: `1px solid ${C.border}`,
								borderRadius: 14,
								padding: '10px 16px',
								backdropFilter: 'blur(10px)',
							}}
						>
							<div
								style={{
									fontSize: 10,
									textTransform: 'uppercase',
									letterSpacing: '0.14em',
									color: C.muted,
									marginBottom: 4,
									fontWeight: 600,
								}}
							>
								Live Prediction
							</div>

							<div
								style={{
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'space-between',
								}}
							>
								<div
									style={{
										fontSize: 18,
										fontWeight: 800,
										textTransform: 'capitalize',
										color: C.accent,
										letterSpacing: '-0.01em',
									}}
								>
									{liveResult.signal}
								</div>

								<div
									style={{
										fontSize: 13,
										color: C.muted,
										fontWeight: 600,
									}}
								>
									{(liveResult.signal_confidence * 100).toFixed(1)}%
								</div>
							</div>
						</div>
					)}
				</div>

				{/* Status sidebar */}
				<div
					style={{
						background: '#0d0c18',
						border: `1px solid ${C.border}`,
						borderRadius: 16,
						padding: 20,
						display: 'flex',
						flexDirection: 'column',
						gap: 8,
					}}
				>
					<div
						style={{
							fontSize: 10,
							fontWeight: 700,
							textTransform: 'uppercase',
							letterSpacing: '0.16em',
							color: C.muted,
							marginBottom: 6,
						}}
					>
						Status
					</div>

					<StatRow
						label="Mode"
						value={liveActive ? 'Running' : 'Stopped'}
						accent={liveActive}
					/>

					<StatRow
						label="Frame Rate"
						value={`~${fpsDisplay} FPS`}
					/>

					<StatRow
						label="Input Size"
						value={`${frameSize} × ${frameSize}`}
					/>

					{liveError && (
						<div
							style={{
								marginTop: 8,
								fontSize: 12,
								color: C.danger,
								background: 'rgba(248,113,113,0.08)',
								padding: '8px 12px',
								borderRadius: 8,
								lineHeight: 1.5,
							}}
						>
							{liveError}
						</div>
					)}

					{liveResult && (
						<div
							style={{
								marginTop: 12,
								background: C.card,
								border: `1px solid ${C.border}`,
								borderRadius: 12,
								padding: '14px 16px',
							}}
						>
							<div
								style={{
									fontSize: 10,
									fontWeight: 700,
									textTransform: 'uppercase',
									letterSpacing: '0.14em',
									color: C.muted,
									marginBottom: 10,
								}}
							>
								Detected Sport
							</div>

							<div
								style={{
									fontSize: 15,
									fontWeight: 800,
									color: '#fff',
									textTransform: 'capitalize',
									letterSpacing: '-0.01em',
								}}
							>
								{liveResult.sport}
							</div>

							<div
								style={{
									fontSize: 12,
									color: C.accent,
									fontWeight: 600,
									marginTop: 4,
								}}
							>
								{(liveResult.sport_confidence * 100).toFixed(1)}% confidence
							</div>
						</div>
					)}
				</div>
			</div>

			<style>{`
        @media (max-width: 768px) {
          .webcam-grid {
            grid-template-columns: 1fr !important;
          }
        }

        @keyframes live-pulse {
          0%, 100% {
            opacity: 1;
            box-shadow: 0 0 8px #4ade80;
          }

          50% {
            opacity: 0.4;
            box-shadow: none;
          }
        }
      `}</style>
		</div>
	);
}
