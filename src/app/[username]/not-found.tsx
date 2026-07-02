import Link from 'next/link';

export default function UserNotFound() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
      <div className="text-center">
        <div className="text-6xl">🔍</div>
        <h1 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">User not found</h1>
        <p className="mt-2 text-gray-600 dark:text-slate-400">
          This Mizari profile doesn&apos;t exist yet. Want it?
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link
            href="/signup"
            className="rounded-xl bg-gradient-to-r from-[#FF6B6B] to-[#EE5A24] px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:brightness-110 hover:shadow-md"
          >
            Claim this username
          </Link>
          <Link
            href="/"
            className="rounded-xl border border-gray-300 bg-white px-6 py-2.5 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}
