export const metadata = {
  title: 'Themes',
  description: 'All themes are available free in your dashboard.',
};

export default function StorePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950 px-4">
      <div className="text-center max-w-md">
        <h1 className="text-4xl font-black text-[#FF6B6B] mb-2">🎨 All Themes Free</h1>
        <p className="text-gray-600 dark:text-slate-400 mb-6">
          All 11 beautiful themes are now available free in your dashboard. No store needed!
        </p>
        <div className="bg-gradient-to-r from-[#FF6B6B]/10 to-[#EE5A24]/10 rounded-2xl p-6 mb-6">
          <p className="text-sm font-semibold text-gray-800 dark:text-slate-200">
            ✨ Dashboard Themes:
          </p>
          <p className="text-xs text-gray-600 dark:text-slate-400 mt-2">
            Clean Light, Midnight Dark, Sakura, Tsukiyo Moon, Mizukaze Wave, Aozora Sky, Kurohana, Momiji Autumn, Ame Rain, Zen Stone, Yakutsk Frost
          </p>
        </div>
        <a
          href="/dashboard"
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#FF6B6B] to-[#EE5A24] px-6 py-3 text-sm font-bold text-white transition-all hover:scale-105 active:scale-95"
        >
          🎨 Go to Dashboard
        </a>
      </div>
    </div>
  );
}
