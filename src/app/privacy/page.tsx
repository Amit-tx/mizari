export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl mb-8">Privacy Policy</h1>
      
      <div className="space-y-6 text-gray-600 dark:text-slate-300 leading-relaxed text-sm">
        <p>Last updated: June 29, 2026</p>
        
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">1. Information We Collect</h2>
          <p>We collect information you provide directly to us when creating an account, such as your username, email address, and any profile details (bio, avatar image) you upload.</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">2. Link Analytics</h2>
          <p>We track the number of clicks on the links you publish on your public profile. This is done to provide you with link click counts in your dashboard. We do not track or sell individual visitor IPs or browsing history.</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">3. Image Uploads</h2>
          <p>Images uploaded to our platform (avatar, custom backgrounds) are hosted securely via Vercel Blob. When you replace or delete an image from your dashboard, the old image is permanently deleted from our servers.</p>
        </section>
      </div>
    </div>
  );
}
