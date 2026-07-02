import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          About{' '}
          <span className="bg-gradient-to-r from-[#FF6B6B] to-[#EE5A24] bg-clip-text text-transparent">
            Mizari
          </span>
        </h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-slate-300">
          One beautiful link to connect your entire digital world.
        </p>
      </div>

      <div className="mt-12 space-y-8 text-gray-600 dark:text-slate-300 leading-relaxed text-base">
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Our Mission</h2>
          <p>
            At Mizari, we believe that sharing your online presence should be beautiful, simple, and customizable. Whether you are a creator, artist, entrepreneur, or developer, Mizari helps you unify all your content, social channels, and links into a single landing page.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Why Mizari?</h2>
          <p>
            Unlike other link-in-bio tools that lock customization options behind expensive paywalls, Mizari offers unprecedented control over your page aesthetic. With our <strong>20+ preset Japanese-inspired themes</strong>, custom background image uploads, and customizable buttons, you can design a page that truly reflects your brand.
          </p>
        </section>

        <div className="mt-12 flex justify-center">
          <Link
            href="/signup"
            className="rounded-2xl bg-gradient-to-r from-[#FF6B6B] to-[#EE5A24] px-8 py-3.5 text-base font-semibold text-white shadow-md hover:brightness-110"
          >
            Create Your Page Now
          </Link>
        </div>
      </div>
    </div>
  );
}
