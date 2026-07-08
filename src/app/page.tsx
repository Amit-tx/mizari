import Link from 'next/link';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

const features = [
  {
    icon: '🌸',
    title: 'Japanese Preset Themes',
    description: 'Choose from 20+ preset themes like Sakura (with falling cherry blossom animation), Tsukiyo, and Yuki.',
  },
  {
    icon: '🛍️',
    title: 'Affiliate Product Cards',
    description: 'Add products with price tags, discounts, and custom images directly from URLs (Amazon/Myntra support).',
  },
  {
    icon: '📱',
    title: 'Instant QR Code',
    description: 'Download a beautifully styled brand-colored QR code to share your profile offline.',
  },
  {
    icon: '🔗',
    title: 'Auto Link Icons',
    description: 'Mizari automatically detects and attaches beautiful social icons for YouTube, Instagram, Spotify, etc.',
  },
  {
    icon: '📊',
    title: 'Click Analytics',
    description: 'Track clicks on each link and product card in real-time to understand your audience.',
  },
  {
    icon: '🗑️',
    title: 'Secure Account Deletion',
    description: 'Completely remove your account, links, and uploaded files instantly via secure verification link.',
  },
];

export default async function HomePage() {
  // If user is logged in, redirect to dashboard
  const session = await auth();
  if (session?.user) {
    redirect('/dashboard');
  }

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Background gradient decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-[#FF6B6B]/20 to-[#EE5A24]/10 blur-3xl" />
          <div className="absolute right-0 top-1/3 h-[400px] w-[400px] rounded-full bg-gradient-to-br from-[#FF6B6B]/10 to-transparent blur-3xl" />
        </div>

        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              One link.{' '}
              <span className="bg-gradient-to-r from-[#FF6B6B] to-[#EE5A24] bg-clip-text text-transparent">
                Infinite reach.
              </span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-gray-600 dark:text-slate-300 sm:text-xl">
              Share everything you create, curate, and sell from your Instagram, TikTok,
              Twitter, and other social media profiles with one simple link in your bio.
            </p>
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/signup"
                className="group relative inline-flex items-center justify-center overflow-hidden rounded-xl bg-gradient-to-r from-[#FF6B6B] to-[#EE5A24] px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-[#FF6B6B]/25 transition-all duration-300 hover:shadow-xl hover:shadow-[#FF6B6B]/30 hover:brightness-110"
              >
                Get Started — it&apos;s free
                <svg className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link
                href="/#features"
                className="inline-flex items-center rounded-xl border border-gray-300 bg-white px-8 py-3.5 text-base font-semibold text-gray-700 shadow-sm transition-all duration-200 hover:bg-gray-50 hover:shadow-md dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
              >
                Learn more
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Everything you need to{' '}
            <span className="bg-gradient-to-r from-[#FF6B6B] to-[#EE5A24] bg-clip-text text-transparent">
              stand out
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-gray-600 dark:text-slate-300">
            Mizari gives you the tools to organize, share, and track all your links in one place.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#FF6B6B]/30 hover:shadow-lg hover:shadow-[#FF6B6B]/5 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-[#FF6B6B]/30"
            >
              <span className="inline-block text-3xl">{feature.icon}</span>
              <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-500 dark:text-slate-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="border-t border-gray-200/60 bg-gray-50 py-20 transition-colors dark:border-slate-700/60 dark:bg-slate-900/50">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Simple, transparent pricing</h2>
          <p className="mx-auto mt-4 max-w-xl text-gray-600 dark:text-slate-300">
            Start for free. Upgrade when you&apos;re ready.
          </p>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:mx-auto lg:max-w-4xl">
            {/* Free tier */}
            <div className="rounded-2xl border border-gray-200 bg-white p-8 text-left shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Free</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">For individuals getting started</p>
              <p className="mt-6"><span className="text-4xl font-bold text-gray-900 dark:text-white">$0</span><span className="text-gray-500 dark:text-slate-400">/mo</span></p>
              <ul className="mt-6 space-y-3 text-sm text-gray-600 dark:text-slate-300">
                <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Unlimited links</li>
                <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Click analytics</li>
                <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Custom bio</li>
                <li className="flex items-center gap-2"><span className="text-gray-400">–</span> Ad-supported</li>
              </ul>
              <Link href="/signup" className="mt-8 block w-full rounded-xl border border-gray-300 py-2.5 text-center text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700">
                Get started
              </Link>
            </div>
            {/* Pro tier */}
            <div className="relative rounded-2xl border-2 border-[#FF6B6B] bg-white p-8 text-left shadow-lg dark:bg-slate-800">
              <span className="absolute -top-3 left-6 rounded-full bg-gradient-to-r from-[#FF6B6B] to-[#EE5A24] px-3 py-0.5 text-xs font-semibold text-white">Popular</span>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Pro</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">For creators who want more</p>
              <p className="mt-6"><span className="text-4xl font-bold text-gray-900 dark:text-white">$5</span><span className="text-gray-500 dark:text-slate-400">/mo</span></p>
              <ul className="mt-6 space-y-3 text-sm text-gray-600 dark:text-slate-300">
                <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Everything in Free</li>
                <li className="flex items-center gap-2"><span className="text-green-500">✓</span> No ads</li>
                <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Custom themes</li>
                <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Priority support</li>
              </ul>
              <Link href="/signup" className="mt-8 block w-full rounded-xl bg-gradient-to-r from-[#FF6B6B] to-[#EE5A24] py-2.5 text-center text-sm font-semibold text-white shadow-sm transition-all hover:brightness-110 hover:shadow-md">
                Upgrade to Pro
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
