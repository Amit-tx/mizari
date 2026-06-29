export default function TermsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl mb-8">Terms of Service</h1>
      
      <div className="space-y-6 text-gray-600 dark:text-slate-300 leading-relaxed text-sm">
        <p>Last updated: June 29, 2026</p>
        
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">1. Acceptable Use</h2>
          <p>You are solely responsible for the links and content you publish on your Mizari page. You must not publish malicious links, phishing schemes, illegal material, or copyrighted content that you do not own the rights to.</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">2. Account Termination</h2>
          <p>We reserve the right to suspend or terminate accounts that violate our acceptable use policy or engage in spamming activities.</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">3. Disclaimer</h2>
          <p>Mizari is provided &quot;as is&quot; without warranties of any kind. We are not liable for any damages arising from your use of our platform or the unavailability of your public page.</p>
        </section>
      </div>
    </div>
  );
}
