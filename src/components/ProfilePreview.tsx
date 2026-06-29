interface ProfilePreviewProps {
  username: string;
  bio: string;
  avatarUrl: string;
  links: Array<{ id: number; title: string; url: string }>;
}

export function ProfilePreview({ username, bio, avatarUrl, links }: ProfilePreviewProps) {
  return (
    <div className="mx-auto w-full max-w-sm overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl transition-colors dark:border-slate-700 dark:bg-slate-800">
      <div className="h-20 bg-gradient-to-r from-[#FF6B6B] to-[#EE5A24]" />
      <div className="px-6 pb-8">
        <div className="-mt-10 flex justify-center">
          <div className="h-20 w-20 overflow-hidden rounded-full border-4 border-white bg-gray-200 dark:border-slate-800 dark:bg-slate-700">
            {avatarUrl ? (
              <img src={avatarUrl} alt={username} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-gray-400 dark:text-slate-500">
                {username?.charAt(0)?.toUpperCase() || '?'}
              </div>
            )}
          </div>
        </div>
        <div className="mt-3 text-center">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">@{username}</h2>
          {bio && <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">{bio}</p>}
        </div>
        <div className="mt-6 space-y-3">
          {links.length === 0 && (
            <p className="text-center text-sm text-gray-400 dark:text-slate-500">No links yet. Add your first link!</p>
          )}
          {links.map((link) => (
            <div key={link.id} className="block w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-center text-sm font-medium text-gray-700 transition-all duration-200 hover:border-[#FF6B6B]/40 hover:bg-[#FF6B6B]/5 hover:text-[#FF6B6B] dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:hover:border-[#FF6B6B]/40 dark:hover:bg-[#FF6B6B]/10 dark:hover:text-[#FF6B6B]">
              {link.title}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
