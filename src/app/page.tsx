import Link from 'next/link';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

const features = [
  {
    icon: '🌸',
    bg: 'bg-pink-50 dark:bg-pink-950/30',
    title: 'Beautiful Themes',
    description:
      'Choose from 20+ Japanese-inspired presets — Sakura, Tsukiyo, Yuki and more — each with live ambient animations.',
  },
  {
    icon: '🛍️',
    bg: 'bg-orange-50 dark:bg-orange-950/30',
    title: 'Product Cards',
    description:
      'Add affiliate products with prices, discount badges, and images. Turn your bio into a mini storefront.',
  },
  {
    icon: '📊',
    bg: 'bg-blue-50 dark:bg-blue-950/30',
    title: 'Click Analytics',
    description:
      'Track clicks on every link and product card in real-time. Know exactly what resonates with your audience.',
  },
  {
    icon: '📱',
    bg: 'bg-violet-50 dark:bg-violet-950/30',
    title: 'Instant QR Code',
    description:
      'Download a brand-colored QR code in one click. Perfect for print, stories, and offline promotions.',
  },
  {
    icon: '🔗',
    bg: 'bg-green-50 dark:bg-green-950/30',
    title: 'Auto Link Icons',
    description:
      'Mizari auto-detects YouTube, Instagram, Spotify, and 30+ platforms and attaches the right icon automatically.',
  },
  {
    icon: '🎋',
    bg: 'bg-teal-50 dark:bg-teal-950/30',
    title: 'Guestbook',
    description:
      'Let fans leave colorful wish messages on your profile. Build community and show off your engagement.',
  },
];

export default async function HomePage() {
  const session = await auth();
  if (session?.user) {
    redirect('/dashboard');
  }

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        {/* Ambient blobs */}
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <div className="absolute left-1/2 top-0 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/3 rounded-full bg-gradient-to-br from-[#FF6B6B]/20 to-[#EE5A24]/10 blur-3xl" />
          <div className="absolute right-0 top-1/3 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-[#FF6B6B]/10 to-transparent blur-3xl" />
          <div className="absolute left-0 bottom-0 h-[400px] w-[400px] rounded-full bg-gradient-to-tr from-[#EE5A24]/10 to-transparent blur-3xl" />
        </div>

        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-36">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">

            {/* Left — copy */}
            <div>
              {/* Live badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-[#FF6B6B]/30 bg-[#FF6B6B]/5 px-4 py-1.5 text-sm font-medium text-[#EE5A24] dark:border-[#FF6B6B]/40 dark:bg-[#FF6B6B]/10">
                <span className="h-2 w-2 animate-pulse rounded-full bg-[#FF6B6B]" />
                Free to get started · No credit card
              </div>

              <h1 className="mt-6 text-5xl font-extrabold tracking-tight sm:text-6xl xl:text-7xl">
                One link.{' '}
                <span className="bg-gradient-to-r from-[#FF6B6B] to-[#EE5A24] bg-clip-text text-transparent">
                  Infinite reach.
                </span>
              </h1>

              <p className="mt-6 text-lg leading-relaxed text-gray-600 dark:text-slate-300 sm:text-xl">
                Share everything you create, curate, and sell — Instagram, YouTube, products,
                and more — from one beautiful, customisable page.
              </p>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
                <Link
                  href="/signup"
                  className="group inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-[#FF6B6B] to-[#EE5A24] px-8 py-4 text-base font-semibold text-white shadow-lg shadow-[#FF6B6B]/25 transition-all duration-300 hover:brightness-110 hover:shadow-xl hover:shadow-[#FF6B6B]/30"
                >
                  Create your free page
                  <svg
                    className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
                <Link
                  href="/#how-it-works"
                  className="inline-flex items-center gap-1.5 rounded-xl px-6 py-4 text-base font-medium text-gray-600 transition-colors hover:text-gray-900 dark:text-slate-300 dark:hover:text-white"
                >
                  See how it works
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </Link>
              </div>

              {/* Trust pills */}
              <div className="mt-8 flex flex-wrap gap-3">
                {['No credit card required', 'Free forever plan', 'Setup in 2 minutes'].map((t) => (
                  <span
                    key={t}
                    className="flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600 dark:bg-slate-800 dark:text-slate-300"
                  >
                    <svg className="h-3.5 w-3.5 text-green-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Right — phone mockup */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                {/* Glow */}
                <div className="absolute inset-0 scale-90 rounded-[3rem] bg-gradient-to-br from-[#FF6B6B]/30 to-[#EE5A24]/20 blur-2xl" />

                {/* Phone shell */}
                <div className="relative mx-auto h-[580px] w-[290px] overflow-hidden rounded-[3rem] border-[8px] border-gray-900 bg-gray-900 shadow-2xl dark:border-slate-700">
                  {/* Notch */}
                  <div className="absolute left-1/2 top-0 z-20 h-6 w-24 -translate-x-1/2 rounded-b-2xl bg-gray-900 dark:bg-slate-700" />

                  {/* Screen */}
                  <div className="relative h-full w-full overflow-hidden bg-gradient-to-b from-[#FFE5EC] to-[#FFC2D1]">
                    {/* Floating sakura petals */}
                    <div className="absolute top-12 left-5 text-pink-300 opacity-40 text-xl select-none">🌸</div>
                    <div className="absolute top-20 right-8 text-pink-300 opacity-30 text-sm select-none">🌸</div>
                    <div className="absolute bottom-32 left-10 text-pink-200 opacity-25 text-xs select-none">🌸</div>
                    <div className="absolute bottom-16 right-5 text-pink-300 opacity-35 text-lg select-none">🌸</div>

                    {/* Profile content */}
                    <div className="flex flex-col items-center px-5 pt-12">
                      {/* Avatar */}
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#FF6B6B] to-[#EE5A24] text-2xl shadow-lg">
                        🌸
                      </div>
                      <p className="mt-2 text-sm font-bold text-gray-900">@yourname</p>
                      <p className="text-[11px] text-gray-600">Creator · Mumbai, India</p>

                      {/* Link cards */}
                      <div className="mt-5 w-full space-y-2.5">
                        {[
                          { icon: '📸', label: 'Instagram', product: false },
                          { icon: '▶️', label: 'YouTube Channel', product: false },
                          { icon: '🛍️', label: 'My Merch Store', product: true, price: '₹999' },
                          { icon: '🎵', label: 'Spotify Playlist', product: false },
                          { icon: '💻', label: 'GitHub Portfolio', product: false },
                        ].map((link) => (
                          <div
                            key={link.label}
                            className={`flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-[11px] font-semibold shadow-sm ${
                              link.product
                                ? 'bg-gradient-to-r from-[#FF6B6B] to-[#EE5A24] text-white'
                                : 'bg-white/80 text-gray-800 backdrop-blur-sm'
                            }`}
                          >
                            <span className="text-sm">{link.icon}</span>
                            <span className="flex-1">{link.label}</span>
                            {link.product && (
                              <span className="rounded bg-white/20 px-1.5 py-0.5 text-[9px] font-bold">
                                {link.price}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating stat cards */}
                <div className="absolute -right-8 top-14 rounded-2xl bg-white px-4 py-2.5 shadow-xl dark:bg-slate-800 dark:shadow-slate-900">
                  <p className="text-[11px] font-semibold text-gray-700 dark:text-slate-200">📊 142 clicks today</p>
                </div>
                <div className="absolute -left-10 bottom-28 rounded-2xl bg-white px-4 py-2.5 shadow-xl dark:bg-slate-800 dark:shadow-slate-900">
                  <p className="text-[11px] font-semibold text-gray-700 dark:text-slate-200">🎨 20+ themes</p>
                </div>
                <div className="absolute -right-4 bottom-40 rounded-2xl bg-white px-4 py-2.5 shadow-xl dark:bg-slate-800 dark:shadow-slate-900">
                  <p className="text-[11px] font-semibold text-gray-700 dark:text-slate-200">⚡ Live in 2 min</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Stats bar ────────────────────────────────────── */}
      <section className="border-y border-gray-200/60 bg-gray-50/50 dark:border-slate-700/60 dark:bg-slate-900/30">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
            {[
              { value: '20+', label: 'Beautiful themes' },
              { value: '100%', label: 'Free to start' },
              { value: '∞', label: 'Links you can add' },
              { value: '2 min', label: 'Average setup time' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-extrabold bg-gradient-to-r from-[#FF6B6B] to-[#EE5A24] bg-clip-text text-transparent sm:text-4xl">
                  {stat.value}
                </p>
                <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────── */}
      <section id="how-it-works" className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Up and running in{' '}
            <span className="bg-gradient-to-r from-[#FF6B6B] to-[#EE5A24] bg-clip-text text-transparent">
              minutes
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-gray-600 dark:text-slate-300">
            Three steps. That&apos;s all it takes to have your link-in-bio live and tracking.
          </p>
        </div>

        <div className="relative mt-16 grid gap-8 sm:grid-cols-3">
          {/* Connector line (desktop) */}
          <div className="absolute left-[17%] right-[17%] top-8 hidden h-px bg-gradient-to-r from-[#FF6B6B]/30 via-[#EE5A24]/30 to-[#FF6B6B]/30 sm:block" />

          {[
            { num: '1', icon: '✍️', title: 'Sign up free', body: 'Create your account in seconds — no credit card, no hassle, no waiting.' },
            { num: '2', icon: '🎨', title: 'Customise your page', body: 'Pick a theme, add your links, set your bio. Make it uniquely yours.' },
            { num: '3', icon: '🚀', title: 'Share everywhere', body: 'Drop your Mizari link in your bio across every platform and start growing.' },
          ].map((step) => (
            <div key={step.num} className="flex flex-col items-center text-center">
              <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl border border-[#FF6B6B]/20 bg-gradient-to-br from-[#FF6B6B]/10 to-[#EE5A24]/10 text-2xl shadow-sm">
                {step.icon}
                <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-[#FF6B6B] to-[#EE5A24] text-[10px] font-bold text-white shadow">
                  {step.num}
                </span>
              </div>
              <h3 className="mt-5 text-base font-semibold text-gray-900 dark:text-white">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-500 dark:text-slate-400">{step.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#FF6B6B] to-[#EE5A24] px-7 py-3.5 text-sm font-semibold text-white shadow-md shadow-[#FF6B6B]/20 transition-all hover:brightness-110 hover:shadow-lg"
          >
            Start for free
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────── */}
      <section id="features" className="bg-gray-50/50 py-24 dark:bg-slate-900/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Everything you need to{' '}
              <span className="bg-gradient-to-r from-[#FF6B6B] to-[#EE5A24] bg-clip-text text-transparent">
                stand out
              </span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-gray-600 dark:text-slate-300">
              Mizari packs powerful tools for creators, influencers, and small businesses — no coding needed.
            </p>
          </div>

          <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div
                key={f.title}
                className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#FF6B6B]/30 hover:shadow-lg hover:shadow-[#FF6B6B]/5 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-[#FF6B6B]/30"
              >
                <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${f.bg} text-2xl`}>
                  {f.icon}
                </div>
                <h3 className="mt-4 text-base font-semibold text-gray-900 dark:text-white">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-500 dark:text-slate-400">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ──────────────────────────────────────── */}
      <section id="pricing" className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Simple, transparent pricing</h2>
          <p className="mx-auto mt-4 max-w-xl text-gray-600 dark:text-slate-300">
            Start for free. Upgrade when you&apos;re ready.
          </p>
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:mx-auto lg:max-w-4xl">
          {/* Free */}
          <div className="flex flex-col rounded-2xl border border-gray-200 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Free</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">For individuals getting started</p>
            <p className="mt-6">
              <span className="text-4xl font-bold text-gray-900 dark:text-white">$0</span>
              <span className="text-gray-500 dark:text-slate-400">/mo</span>
            </p>
            <ul className="mt-6 flex-1 space-y-3 text-sm text-gray-600 dark:text-slate-300">
              {['Unlimited links', 'Click analytics', 'Custom bio & avatar', 'QR code download'].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <span className="text-green-500 font-bold">✓</span> {item}
                </li>
              ))}
              <li className="flex items-center gap-2">
                <span className="text-gray-400">–</span> Ad-supported
              </li>
            </ul>
            <Link
              href="/signup"
              className="mt-8 block w-full rounded-xl border border-gray-300 py-2.5 text-center text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              Get started free
            </Link>
          </div>

          {/* Pro */}
          <div className="relative flex flex-col rounded-2xl border-2 border-[#FF6B6B] bg-white p-8 shadow-lg dark:bg-slate-800">
            <span className="absolute -top-3.5 left-6 rounded-full bg-gradient-to-r from-[#FF6B6B] to-[#EE5A24] px-3 py-1 text-xs font-bold text-white shadow">
              Popular
            </span>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Pro</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">For creators who want more</p>
            <p className="mt-6">
              <span className="text-4xl font-bold text-gray-900 dark:text-white">$5</span>
              <span className="text-gray-500 dark:text-slate-400">/mo</span>
            </p>
            <ul className="mt-6 flex-1 space-y-3 text-sm text-gray-600 dark:text-slate-300">
              {['Everything in Free', 'No ads', 'Premium themes', 'Priority support', 'Custom domain (soon)'].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <span className="text-green-500 font-bold">✓</span> {item}
                </li>
              ))}
            </ul>
            <Link
              href="/signup"
              className="mt-8 block w-full rounded-xl bg-gradient-to-r from-[#FF6B6B] to-[#EE5A24] py-2.5 text-center text-sm font-semibold text-white shadow-sm transition-all hover:brightness-110 hover:shadow-md"
            >
              Upgrade to Pro
            </Link>
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ───────────────────────────────────── */}
      <section className="px-4 pb-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#FF6B6B] to-[#EE5A24] p-12 text-center shadow-2xl shadow-[#FF6B6B]/20">
            <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

            <h2 className="relative text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to grow your audience?
            </h2>
            <p className="relative mx-auto mt-4 max-w-xl text-rose-100">
              Join creators who use Mizari to share their entire world from a single,
              beautiful link.
            </p>
            <Link
              href="/signup"
              className="relative mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-base font-semibold text-[#EE5A24] shadow-lg transition-all duration-200 hover:brightness-105 hover:shadow-xl"
            >
              Create your free page
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
