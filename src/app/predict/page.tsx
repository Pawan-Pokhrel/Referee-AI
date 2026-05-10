'use client';

import Navbar from '@/components/Navbar';
import PredictSection from '@/components/PredictSection';
import ErrorToast from '@/components/ui/ErrorToast';
import { useState } from 'react';

export default function PredictPage() {
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	return (
		<div className="min-h-screen flex flex-col">
			<Navbar />
			<main className="pt-20 flex-1 pb-10">
				<PredictSection onError={setErrorMessage} />
			</main>
			<ErrorToast
				message={errorMessage}
				onClose={() => setErrorMessage(null)}
			/>
		</div>
	);
}
