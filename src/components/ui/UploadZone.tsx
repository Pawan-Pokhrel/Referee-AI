'use client';

import Image from 'next/image';
import { useCallback, useState } from 'react';

type UploadZoneProps = {
	label: string;
	helperText: string;
	onFileSelect: (file: File | null) => void;
	busy?: boolean;
	className?: string;
};

export default function UploadZone({
	label,
	helperText,
	onFileSelect,
	busy,
	className = '',
}: UploadZoneProps) {
	const [preview, setPreview] = useState<string | null>(null);
	const [fileMeta, setFileMeta] = useState<{
		name: string;
		size: string;
	} | null>(null);
	const [dragActive, setDragActive] = useState(false);

	const handleFile = useCallback(
		(file: File | null) => {
			if (!file) {
				setPreview(null);
				setFileMeta(null);
				onFileSelect(null);
				return;
			}
			if (!file.type.startsWith('image/')) return;
			setPreview(URL.createObjectURL(file));
			setFileMeta({
				name: file.name,
				size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
			});
			onFileSelect(file);
		},
		[onFileSelect]
	);

	const onDrop = useCallback(
		(event: React.DragEvent<HTMLDivElement>) => {
			event.preventDefault();
			setDragActive(false);
			const file = event.dataTransfer.files?.[0];
			if (file) handleFile(file);
		},
		[handleFile]
	);

	const onDragOver = (event: React.DragEvent<HTMLDivElement>) => {
		event.preventDefault();
		setDragActive(true);
	};

	const onDragLeave = () => setDragActive(false);

	return (
		<div
			onDrop={onDrop}
			onDragOver={onDragOver}
			onDragLeave={onDragLeave}
			className={`rounded-xl border border-[rgba(255,255,255,0.05)] transition-all duration-200 bg-[#111118] h-full flex flex-col items-center justify-center p-10 ${
				dragActive ?
					'border-(--color-accent) shadow-[0_0_20px_var(--color-accent-glow)'
				:	'hover:border-(--color-accent)'
			} ${busy ? 'opacity-50 pointer-events-none' : ''}`}
		>
			<label className="flex flex-col items-center justify-center p-2 w-full h-full cursor-pointer relative overflow-hidden">
				{preview ?
					<div className="w-full flex flex-col items-center gap-4">
						<div
							className="relative w-full h-122.5 flex items-center justify-center"
							title="Click to remove the uplaoded image"
						>
							<Image
								src={preview}
								alt="Preview"
								fill
								unoptimized
								className="object-contain rounded-lg shadow-lg"
							/>
							<button
								type="button"
								className="absolute -top-2 -right-2 bg-[rgba(0,0,0,0.5)] border border-[rgba(255,255,255,0.1)] hover:bg-(--color-danger) text-white w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer backdrop-blur-md"
								onClick={(event) => {
									event.preventDefault();
									handleFile(null);
								}}
								title="Remove Image"
							>
								×
							</button>
						</div>
					</div>
				:	<div className="flex flex-col items-center gap-3 text-center py-20">
						<div className="w-12 h-12 rounded-full bg-[rgba(99,102,241,0.15)] flex items-center justify-center">
							<svg
								width="22"
								height="22"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="1.5"
							>
								<path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
								<path d="M17 8l-5-5-5 5" />
								<path d="M12 3v12" />
							</svg>
						</div>
						<div className="text-lg font-semibold">{label}</div>
						<div className="text-sm text-(--color-text-secondary)">
							{helperText}
						</div>
						<div className="text-xs text-(--color-text-muted) bg-(--color-surface) px-3 py-1 rounded-full">
							JPG · PNG · WEBP
						</div>
					</div>
				}
				<input
					type="file"
					accept="image/*"
					className="hidden"
					onChange={(event) => handleFile(event.target.files?.[0] ?? null)}
					disabled={busy}
				/>
			</label>
		</div>
	);
}
