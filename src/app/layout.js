import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "RefereeAI | Hierarchical Signal Classification",
  description: "Two-stage deep learning pipeline for referee signal recognition.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-[#0a0a0f] text-white min-h-screen flex flex-col`}>
        <Navbar />
        <Toaster position="top-right" toastOptions={{ className: 'dark-toast', style: { background: '#1e1e2e', color: '#fff', border: '1px solid #6366f1' } }} />
        <main className="flex-1 pt-16">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
