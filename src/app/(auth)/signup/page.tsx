'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const referredBy = searchParams.get('ref') || '';

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password, referredBy }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Something went wrong');
        setLoading(false);
        return;
      }

      // Auto sign-in after signup
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Account created but sign-in failed. Please log in.');
        setLoading(false);
        return;
      }

      router.push('/dashboard');
      router.refresh();
    } catch (err) {
      console.error(err);
      setError('An error occurred during signup');
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">
            Create your{' '}
            <span className="bg-gradient-to-r from-[#FF6B6B] to-[#EE5A24] bg-clip-text text-transparent">
              Mizari
            </span>
          </h1>
          <p className="mt-2 text-gray-600 dark:text-slate-400">
            Get your own link-in-bio page in seconds
          </p>
        </div>

        <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          {error && (
            <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="signup-username" className="block text-sm font-medium text-gray-700 dark:text-slate-300">
                Username
              </label>
              <div className="mt-1.5 flex items-center rounded-xl border border-gray-300 bg-white transition-colors focus-within:border-[#FF6B6B] focus-within:ring-2 focus-within:ring-[#FF6B6B]/20 dark:border-slate-600 dark:bg-slate-700">
                <span className="pl-4 text-sm text-gray-400 dark:text-slate-500">mizari.cc/</span>
                <input
                  id="signup-username"
                  type="text"
                  required
                  pattern="[a-zA-Z0-9_-]+"
                  minLength={3}
                  maxLength={30}
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
                  className="w-full bg-transparent px-1 py-2.5 text-sm focus:outline-none dark:text-white"
                  placeholder="yourname"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500 dark:text-slate-400">
                Letters, numbers, hyphens, underscores. 3–30 characters.
              </p>
            </div>
            <div>
              <label htmlFor="signup-email" className="block text-sm font-medium text-gray-700 dark:text-slate-300">
                Email
              </label>
              <input
                id="signup-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1.5 block w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm transition-colors focus:border-[#FF6B6B] focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label htmlFor="signup-password" className="block text-sm font-medium text-gray-700 dark:text-slate-300">
                Password
              </label>
              <div className="relative mt-1.5 flex items-center">
                <input
                  id="signup-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-xl border border-gray-300 bg-white pl-4 pr-16 py-2.5 text-sm transition-colors focus:border-[#FF6B6B] focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-xs font-bold text-gray-500 hover:text-gray-700 focus:outline-none dark:text-slate-400"
                >
                  {showPassword ? 'Hide 🔒' : 'Show 👁️'}
                </button>
              </div>
              <p className="mt-1 text-xs text-gray-500 dark:text-slate-400">Minimum 8 characters</p>
            </div>
            {referredBy && (
              <div className="rounded-xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/50 p-3 text-xs font-semibold text-purple-600 dark:text-purple-400 flex items-center gap-1.5">
                ✨ Referred by: <span className="font-extrabold">@{referredBy}</span> (Bonus XP will be granted!)
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-[#FF6B6B] to-[#EE5A24] py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:shadow-md hover:brightness-110 disabled:opacity-60"
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-slate-600" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-4 text-gray-500 dark:bg-slate-800 dark:text-slate-400">or</span>
              </div>
            </div>

            <button
              onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
              className="mt-4 flex w-full items-center justify-center gap-3 rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50 hover:shadow-md dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Continue with Google
            </button>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100 dark:border-slate-700 text-center">
            <p className="text-sm text-gray-500 dark:text-slate-400">
              Already have an account?
            </p>
            <Link 
              href="/login" 
              className="mt-2 inline-block w-full rounded-xl border border-gray-300 bg-gray-50 py-2 text-sm font-bold text-gray-700 hover:bg-gray-100 transition-colors"
            >
              Sign In to your account Key 🔐
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="min-h-[calc(100vh-4rem)] flex items-center justify-center text-sm font-bold text-gray-500">Loading...</div>}>
      <SignupForm />
    </Suspense>
  );
}
