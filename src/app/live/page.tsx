'use client';

import LiveSection from '@/components/LiveSection';
import Navbar from '@/components/Navbar';
import ErrorToast from '@/components/ui/ErrorToast';
import { useState } from 'react';

export default function LivePage() {
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	return (
		<div className="min-h-screen flex flex-col">
			<Navbar />
			<main className="pt-20 flex-1">
				<LiveSection onError={setErrorMessage} />
			</main>
			<ErrorToast
				message={errorMessage}
				onClose={() => setErrorMessage(null)}
			/>
		</div>
	);
}
