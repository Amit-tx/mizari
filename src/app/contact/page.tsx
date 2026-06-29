export default function ContactPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          Contact{' '}
          <span className="bg-gradient-to-r from-[#FF6B6B] to-[#EE5A24] bg-clip-text text-transparent">
            Us
          </span>
        </h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-slate-300">
          Have questions or feedback? We would love to hear from you.
        </p>
      </div>

      <div className="mt-12 rounded-3xl border border-gray-100 bg-white p-8 shadow-md dark:border-slate-800 dark:bg-slate-900">
        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300">Name</label>
            <input
              type="text"
              required
              className="mt-1.5 block w-full rounded-2xl border border-gray-200 bg-white px-4 py-2.5 text-sm transition-all focus:border-[#FF6B6B] focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]/20 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
              placeholder="Your Name"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300">Email</label>
            <input
              type="email"
              required
              className="mt-1.5 block w-full rounded-2xl border border-gray-200 bg-white px-4 py-2.5 text-sm transition-all focus:border-[#FF6B6B] focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]/20 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300">Message</label>
            <textarea
              required
              rows={4}
              className="mt-1.5 block w-full rounded-2xl border border-gray-200 bg-white px-4 py-2.5 text-sm transition-all focus:border-[#FF6B6B] focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]/20 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
              placeholder="How can we help you?"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-2xl bg-gradient-to-r from-[#FF6B6B] to-[#EE5A24] py-3 text-center text-sm font-semibold text-white shadow-md hover:brightness-110 transition-all"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
}
