import Link from 'next/link';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import Footer from '@/components/Footer';

const features = [
  {
    icon: '🎨',
    title: 'Beautiful Themes',
    description:
      'Choose from 20+ presets — Sakura, Tsukiyo, Yuki, Creator Card and more — each with live ambient animations.',
  },
  {
    icon: '🛍️',
    title: 'Product Cards',
    description:
      'Add affiliate products with prices, discount badges, and images. Turn your bio into a mini storefront.',
  },
  {
    icon: '📊',
    title: 'Click Analytics',
    description:
      'Track clicks on every link and product card in real-time. Know exactly what resonates with your audience.',
  },
  {
    icon: '📱',
    title: 'Instant QR Code',
    description:
      'Download a QR code in one click. Perfect for print, stories, and offline promotions.',
  },
  {
    icon: '🔗',
    title: 'Auto Link Icons',
    description:
      'mizari.cc auto-detects YouTube, Instagram, Spotify, and 30+ platforms and attaches the right icon automatically.',
  },
  {
    icon: '📝',
    title: 'Guestbook',
    description:
      'Let fans leave wish messages on your profile. Build community and show off your engagement.',
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
      <section className="bg-white dark:bg-black">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-36">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">

            {/* Left — copy */}
            <div>
              {/* Live badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-black/[0.03] px-4 py-1.5 text-sm font-medium text-black dark:border-white/15 dark:bg-white/5 dark:text-white">
                <span className="h-2 w-2 rounded-full bg-black dark:bg-white" />
                Free to get started · No credit card
              </div>

              <h1 className="mt-6 text-5xl font-extrabold tracking-tight text-black dark:text-white sm:text-6xl xl:text-7xl">
                One link.
                <br />
                Infinite reach.
              </h1>

              <p className="mt-6 text-lg leading-relaxed text-gray-600 dark:text-gray-400 sm:text-xl">
                Share everything you create, curate, and sell — Instagram, YouTube, products,
                and more — from one beautiful, customisable page.
              </p>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
                <Link
                  href="/signup"
                  className="group inline-flex items-center justify-center rounded-xl bg-black px-8 py-4 text-base font-semibold text-white transition-all duration-200 hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
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
                  className="inline-flex items-center gap-1.5 rounded-xl px-6 py-4 text-base font-medium text-gray-600 transition-colors hover:text-black dark:text-gray-400 dark:hover:text-white"
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
                    className="flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 dark:bg-white/10 dark:text-gray-300"
                  >
                    <svg className="h-3.5 w-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
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
                {/* Phone shell */}
                <div className="relative mx-auto h-[580px] w-[290px] overflow-hidden rounded-[3rem] border-[8px] border-black bg-black shadow-2xl dark:border-white/20">
                  {/* Notch */}
                  <div className="absolute left-1/2 top-0 z-20 h-6 w-24 -translate-x-1/2 rounded-b-2xl bg-black" />

                  {/* Screen */}
                  <div className="relative h-full w-full overflow-hidden bg-white">
                    {/* Profile content */}
                    <div className="flex flex-col items-center px-5 pt-10">
                      {/* Light/dark pill toggle */}
                      <div className="mb-3 flex w-full items-center justify-between">
                        <span className="text-[9px] font-semibold text-gray-500">mizari.cc/yourname</span>
                        <div className="flex items-center gap-0.5 rounded-full bg-black/5 p-0.5">
                          <span className="rounded-full bg-black px-2 py-0.5 text-[8px] font-bold text-white">Light</span>
                          <span className="px-2 py-0.5 text-[8px] font-bold text-gray-500">Dark</span>
                        </div>
                      </div>

                      {/* Avatar card */}
                      <div className="flex w-full flex-col items-center rounded-[22px] border border-black/10 bg-white p-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-black text-lg font-bold text-white">
                          Y
                        </div>
                        <p className="mt-2 text-sm font-bold text-black">@yourname</p>
                        <p className="text-[10px] text-gray-500">Creator · Mumbai, India</p>
                        <div className="mt-3 flex items-center gap-4">
                          <div className="text-center">
                            <p className="text-[11px] font-bold text-black">12.4k</p>
                            <p className="text-[8px] uppercase tracking-wide text-gray-400">views</p>
                          </div>
                          <div className="h-4 w-px bg-black/10" />
                          <div className="text-center">
                            <p className="text-[11px] font-bold text-black">697</p>
                            <p className="text-[8px] uppercase tracking-wide text-gray-400">clicks</p>
                          </div>
                        </div>
                      </div>

                      {/* Link cards */}
                      <div className="mt-3 w-full space-y-2">
                        {[
                          { icon: '📸', label: 'Instagram', product: false },
                          { icon: '▶️', label: 'YouTube Channel', product: false },
                          { icon: '🛍️', label: 'My Merch Store', product: true, price: '₹999' },
                          { icon: '🎵', label: 'Spotify Playlist', product: false },
                        ].map((link) => (
                          <div
                            key={link.label}
                            className="flex items-center gap-2.5 rounded-2xl border border-black/10 bg-white px-3.5 py-2.5 text-[11px] font-semibold text-black"
                          >
                            <span className="text-sm">{link.icon}</span>
                            <span className="flex-1">{link.label}</span>
                            {link.product && (
                              <span className="rounded bg-black px-1.5 py-0.5 text-[9px] font-bold text-white">
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
                <div className="absolute -right-8 top-14 rounded-2xl border border-black/10 bg-white px-4 py-2.5 shadow-xl dark:border-white/15 dark:bg-black">
                  <p className="text-[11px] font-semibold text-black dark:text-white">142 clicks today</p>
                </div>
                <div className="absolute -left-10 bottom-28 rounded-2xl border border-black/10 bg-white px-4 py-2.5 shadow-xl dark:border-white/15 dark:bg-black">
                  <p className="text-[11px] font-semibold text-black dark:text-white">20+ themes</p>
                </div>
                <div className="absolute -right-4 bottom-40 rounded-2xl border border-black/10 bg-white px-4 py-2.5 shadow-xl dark:border-white/15 dark:bg-black">
                  <p className="text-[11px] font-semibold text-black dark:text-white">Live in 2 min</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Stats bar ────────────────────────────────────── */}
      <section className="border-y border-gray-200 bg-white dark:border-white/10 dark:bg-black">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
            {[
              { value: '20+', label: 'Beautiful themes' },
              { value: '100%', label: 'Free to start' },
              { value: '∞', label: 'Links you can add' },
              { value: '2 min', label: 'Average setup time' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-extrabold text-black dark:text-white sm:text-4xl">
                  {stat.value}
                </p>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────── */}
      <section id="how-it-works" className="mx-auto max-w-7xl bg-white px-4 py-24 dark:bg-black sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-black dark:text-white sm:text-4xl">
            Up and running in minutes
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-gray-600 dark:text-gray-400">
            Three steps. That&apos;s all it takes to have your link-in-bio live and tracking.
          </p>
        </div>

        <div className="relative mt-16 grid gap-8 sm:grid-cols-3">
          {/* Connector line (desktop) */}
          <div className="absolute left-[17%] right-[17%] top-8 hidden h-px bg-black/10 dark:bg-white/10 sm:block" />

          {[
            { num: '1', icon: '✍️', title: 'Sign up free', body: 'Create your account in seconds — no credit card, no hassle, no waiting.' },
            { num: '2', icon: '🎨', title: 'Customise your page', body: 'Pick a theme, add your links, set your bio. Make it uniquely yours.' },
            { num: '3', icon: '🚀', title: 'Share everywhere', body: 'Drop your mizari.cc link in your bio across every platform and start growing.' },
          ].map((step) => (
            <div key={step.num} className="flex flex-col items-center text-center">
              <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl border border-black/10 bg-black/[0.03] text-2xl dark:border-white/15 dark:bg-white/5">
                {step.icon}
                <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-black text-[10px] font-bold text-white dark:bg-white dark:text-black">
                  {step.num}
                </span>
              </div>
              <h3 className="mt-5 text-base font-semibold text-black dark:text-white">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-500 dark:text-gray-400">{step.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 rounded-xl bg-black px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
          >
            Start for free
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────── */}
      <section id="features" className="bg-gray-50 py-24 dark:bg-white/[0.03]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-black dark:text-white sm:text-4xl">
              Everything you need to stand out
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-gray-600 dark:text-gray-400">
              mizari.cc packs powerful tools for creators, influencers, and small businesses — no coding needed.
            </p>
          </div>

          <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div
                key={f.title}
                className="group rounded-2xl border border-gray-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-black/30 dark:border-white/10 dark:bg-black dark:hover:border-white/30"
              >
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-black/[0.04] text-2xl dark:bg-white/10">
                  {f.icon}
                </div>
                <h3 className="mt-4 text-base font-semibold text-black dark:text-white">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-500 dark:text-gray-400">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ──────────────────────────────────────── */}
      <section id="pricing" className="mx-auto max-w-7xl bg-white px-4 py-24 dark:bg-black sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-black dark:text-white sm:text-4xl">Simple, transparent pricing</h2>
          <p className="mx-auto mt-4 max-w-xl text-gray-600 dark:text-gray-400">
            Start for free. Upgrade when you&apos;re ready.
          </p>
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:mx-auto lg:max-w-4xl">
          {/* Free */}
          <div className="flex flex-col rounded-2xl border border-gray-200 bg-white p-8 dark:border-white/10 dark:bg-black">
            <h3 className="text-lg font-semibold text-black dark:text-white">Free</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">For individuals getting started</p>
            <p className="mt-6">
              <span className="text-4xl font-bold text-black dark:text-white">$0</span>
              <span className="text-gray-500 dark:text-gray-400">/mo</span>
            </p>
            <ul className="mt-6 flex-1 space-y-3 text-sm text-gray-600 dark:text-gray-300">
              {['Unlimited links', 'Click analytics', 'Custom bio & avatar', 'QR code download'].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <span className="font-bold text-black dark:text-white">✓</span> {item}
                </li>
              ))}
              <li className="flex items-center gap-2">
                <span className="text-gray-400">–</span> Ad-supported
              </li>
            </ul>
            <Link
              href="/signup"
              className="mt-8 block w-full rounded-xl border border-gray-300 py-2.5 text-center text-sm font-semibold text-black transition-colors hover:bg-gray-50 dark:border-white/20 dark:text-white dark:hover:bg-white/5"
            >
              Get started free
            </Link>
          </div>

          {/* Pro */}
          <div className="relative flex flex-col rounded-2xl border-2 border-black bg-white p-8 dark:border-white dark:bg-black">
            <span className="absolute -top-3.5 left-6 rounded-full bg-black px-3 py-1 text-xs font-bold text-white dark:bg-white dark:text-black">
              Popular
            </span>
            <h3 className="text-lg font-semibold text-black dark:text-white">Pro</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">For creators who want more</p>
            <p className="mt-6">
              <span className="text-4xl font-bold text-black dark:text-white">$5</span>
              <span className="text-gray-500 dark:text-gray-400">/mo</span>
            </p>
            <ul className="mt-6 flex-1 space-y-3 text-sm text-gray-600 dark:text-gray-300">
              {['Everything in Free', 'No ads', 'Premium themes', 'Priority support', 'Custom domain (soon)'].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <span className="font-bold text-black dark:text-white">✓</span> {item}
                </li>
              ))}
            </ul>
            <Link
              href="/signup"
              className="mt-8 block w-full rounded-xl bg-black py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
            >
              Upgrade to Pro
            </Link>
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ───────────────────────────────────── */}
      <section className="bg-white px-4 pb-24 dark:bg-black sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="relative overflow-hidden rounded-3xl bg-black p-12 text-center dark:bg-white">
            <h2 className="relative text-3xl font-bold tracking-tight text-white dark:text-black sm:text-4xl">
              Ready to grow your audience?
            </h2>
            <p className="relative mx-auto mt-4 max-w-xl text-gray-300 dark:text-gray-600">
              Join creators who use mizari.cc to share their entire world from a single,
              beautiful link.
            </p>
            <Link
              href="/signup"
              className="relative mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-base font-semibold text-black transition-all duration-200 hover:bg-gray-100 dark:bg-black dark:text-white dark:hover:bg-gray-900"
            >
              Create your free page
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </>
  );
}
