import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'RefereeAI | Hierarchical Signal Classification',
	description:
		'Advanced deep learning pipeline for Cricket signal classification, with Football signal recognition as an experimental side feature.',
};

export default function RootLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<html lang="en">
			<body
				className={`${inter.className} bg-(--color-bg) text-(--color-text)`}
			>
				{children}
			</body>
		</html>
	);
}
