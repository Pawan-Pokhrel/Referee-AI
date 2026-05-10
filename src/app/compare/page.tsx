'use client';

import CompareSection from '@/components/CompareSection';
import Navbar from '@/components/Navbar';
import ErrorToast from '@/components/ui/ErrorToast';
import { useState } from 'react';

export default function ComparePage() {
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	return (
		<div className="min-h-screen flex flex-col">
			<Navbar />
			<main className="pt-20 flex-1 pb-10">
				<CompareSection onError={setErrorMessage} />
			</main>
			<ErrorToast
				message={errorMessage}
				onClose={() => setErrorMessage(null)}
			/>
		</div>
	);
}
