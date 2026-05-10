import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import Navbar from '@/components/Navbar';

export default function HomePage() {
	return (
		<div className="min-h-screen flex flex-col">
			<Navbar />
			<main className="pt-20 flex-1">
				<HeroSection />
			</main>
			<Footer />
		</div>
	);
}
