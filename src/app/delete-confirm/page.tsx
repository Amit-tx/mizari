'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { confirmAccountDeletion } from '../dashboard/actions';
import { signOut } from 'next-auth/react';
import Link from 'next/link';

function DeleteConfirmContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setErrorMsg('No verification token found. Please check your deletion link.');
      return;
    }

    const executeDeletion = async () => {
      try {
        const res = await confirmAccountDeletion(token);
        if (res.success) {
          // Log out the user session
          await signOut({ redirect: false });
          setStatus('success');
        } else {
          setStatus('error');
          setErrorMsg(res.error || 'Invalid or expired token.');
        }
      } catch (err) {
        console.error(err);
        setStatus('error');
        setErrorMsg('An unexpected error occurred. Please try again.');
      }
    };

    executeDeletion();
  }, [token]);

  return (
    <div className="mx-auto max-w-md px-4 py-20 text-center">
      <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-xl dark:border-slate-800 dark:bg-slate-900">
        {status === 'loading' && (
          <div className="space-y-4">
            <div className="text-4xl animate-bounce">⚠️</div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Deleting Account</h1>
            <p className="text-sm text-gray-500">Verifying security token and deleting your profile data...</p>
          </div>
        )}

        {status === 'success' && (
          <div className="space-y-6">
            <div className="text-5xl">🗑️</div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Account Deleted</h1>
            <p className="text-sm text-gray-600 dark:text-slate-400">
              Your Mizari profile, custom links, and uploaded files have been permanently removed. Thank you for using Mizari.
            </p>
            <Link
              href="/"
              className="inline-block w-full rounded-2xl bg-gradient-to-r from-[#FF6B6B] to-[#EE5A24] py-3 text-sm font-semibold text-white shadow-md hover:brightness-110"
            >
              Go to Homepage
            </Link>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-6">
            <div className="text-5xl">❌</div>
            <h1 className="text-2xl font-bold text-red-600">Deletion Failed</h1>
            <p className="text-sm text-gray-600 dark:text-slate-400">{errorMsg}</p>
            <Link
              href="/dashboard"
              className="inline-block w-full rounded-2xl border border-gray-200 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Back to Dashboard
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default function DeleteConfirmPage() {
  return (
    <Suspense fallback={<div className="text-center py-20">Loading...</div>}>
      <DeleteConfirmContent />
    </Suspense>
  );
}
