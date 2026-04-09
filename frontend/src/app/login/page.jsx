'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Hexagon, Loader2, ArrowRight } from 'lucide-react';
import { api } from '@/lib/api';
import { saveToken, saveUser } from '@/lib/auth';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await api.post('/users/login', { email, password });
      const data = response.data;

      saveToken(data.token);
      saveUser({ _id: data._id, username: data.username, email: data.email });

      router.push('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden bg-[#0a0a0a]">
      {/* Background gradients */}
      <div className="absolute top-0 right-0 w-[40vw] h-[40vw] bg-brand/10 rounded-full mix-blend-screen filter blur-[100px] animate-float opacity-50" />
      <div className="absolute bottom-0 left-0 w-[40vw] h-[40vw] bg-blue-500/10 rounded-full mix-blend-screen filter blur-[100px] animate-float stagger-2 opacity-50" />

      <div className="w-full max-w-md z-10 animate-fade-in-up">
        {/* Logo Header */}
        <div className="text-center mb-8 flex flex-col items-center">
          <Link href="/" className="inline-flex items-center justify-center mb-4 cursor-pointer">
            <Hexagon className="w-12 h-12 text-brand animate-pulse-glow" />
          </Link>
          <h1 className="text-3xl font-bold tracking-tight text-white">Welcome back</h1>
          <p className="text-text-secondary mt-2">Log in to your RunSphere account</p>
        </div>

        {/* Login Card */}
        <div className="glass-card p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            {error &&
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-xl text-sm animate-slide-in-left">
                {error}
              </div>
            }
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2" htmlFor="email">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field"
                  placeholder="you@example.com"
                  required />
                
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2" htmlFor="password">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field"
                  placeholder="••••••••"
                  required />
                
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full group !py-4">
              
              {isLoading ?
              <Loader2 className="w-5 h-5 animate-spin" /> :

              <>
                  <span>Log In</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              }
            </button>
          </form>
        </div>

        {/* Footer Link */}
        <p className="text-center mt-6 text-text-secondary">
          Don't have an account?{' '}
          <Link href="/signup" className="text-brand hover:text-brand-light font-medium transition-colors">
            Sign up
          </Link>
        </p>
      </div>
    </div>);

}