'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect } from 'react';

type ErrorToastProps = {
	message: string | null;
	onClose: () => void;
};

export default function ErrorToast({ message, onClose }: ErrorToastProps) {
	useEffect(() => {
		if (!message) return;
		const timer = setTimeout(() => onClose(), 5000);
		return () => clearTimeout(timer);
	}, [message, onClose]);

	return (
		<AnimatePresence>
			{message && (
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: 20 }}
					className="fixed bottom-6 right-6 z-50 bg-(--color-danger) text-white px-5 py-3 rounded-lg shadow-lg flex items-center gap-4"
				>
					<span className="text-sm font-semibold">{message}</span>
					<button
						className="text-white text-lg"
						onClick={onClose}
					>
						×
					</button>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
