import Link from 'next/link';
import { Hexagon } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#0a0a0a]">
      {/* Animated Hexagon Background Pattern */}
      <div className="absolute inset-0 z-0 opacity-10">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MiIgaGVpZ2h0PSI0NCIgdmlld0JveD0iMCAwIDQyIDQ0Ij48cGF0aCBkPSJNMjEgMEw0MiAxMVYzM0wyMSA0NEwwIDMzVjExTDIxIDBaIiBmaWxsPSJub25lIiBzdHJva2U9IiNmZmZmZmYiIHN0cm9rZS13aWR0aD0iMSIvPjwvc3ZnPg==')] bg-[length:42px_44px] animate-shimmer" />
      </div>

      {/* Main Content */}
      <main className="relative z-10 flex flex-col items-center justify-center w-full max-w-4xl px-6 text-center">
        <div className="flex items-center justify-center mb-6 animate-fade-in-up">
          <Hexagon className="w-16 h-16 text-brand mr-3 animate-pulse-glow" strokeWidth={1.5} />
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-brand-light to-brand-dark">
            RunSphere
          </h1>
        </div>

        <p className="mt-6 text-xl md:text-2xl text-text-secondary max-w-2xl animate-fade-in-up stagger-1">
          Conquer your city, one run at a time. Gamify your fitness by capturing territory with every step you take.
        </p>

        <div className="mt-12 flex flex-col sm:flex-row gap-4 w-full sm:w-auto animate-fade-in-up stagger-2">
          <Link href="/signup" className="btn-primary py-4 px-8 text-lg w-full sm:w-auto">
            Get Started
          </Link>
          <Link href="/login" className="btn-outline py-4 px-8 text-lg w-full sm:w-auto bg-black/50 backdrop-blur-sm">
            Log In
          </Link>
        </div>
      </main>

      {/* Decorative Gradient Blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand/20 rounded-full mix-blend-screen filter blur-[100px] animate-float" />
      <div className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-indigo-500/10 rounded-full mix-blend-screen filter blur-[120px] animate-float stagger-2" />
    </div>);

}