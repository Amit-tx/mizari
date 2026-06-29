'use client';

import { useState } from 'react';
import { LinkCard } from '@/components/LinkCard';
import { ProfilePreview } from '@/components/ProfilePreview';
import { AdSlot } from '@/components/AdSlot';
import { updateProfile, addLink, updateLink, deleteLink, reorderLinks } from './actions';
import type { Link } from '@/db/schema';

interface DashboardClientProps {
  user: { id: number; username: string; bio: string; avatarUrl: string };
  initialLinks: Link[];
}

export function DashboardClient({ user, initialLinks }: DashboardClientProps) {
  const [bio, setBio] = useState(user.bio);
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl);
  const [linksList, setLinksList] = useState(initialLinks);
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const showMessage = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleUpdateProfile = async () => {
    setSaving(true);
    await updateProfile(user.id, bio, avatarUrl);
    setSaving(false);
    showMessage('Profile updated!');
  };

  const handleAddLink = async () => {
    if (!newTitle.trim() || !newUrl.trim()) return;
    setSaving(true);
    const link = await addLink(user.id, newTitle, newUrl, linksList.length);
    if (link) {
      setLinksList([...linksList, link]);
      setNewTitle('');
      setNewUrl('');
    }
    setSaving(false);
  };

  const handleUpdateLink = async (id: number, title: string, url: string) => {
    await updateLink(id, user.id, title, url);
    setLinksList(linksList.map((l) => (l.id === id ? { ...l, title, url } : l)));
    showMessage('Link updated!');
  };

  const handleDeleteLink = async (id: number) => {
    await deleteLink(id, user.id);
    setLinksList(linksList.filter((l) => l.id !== id));
    showMessage('Link deleted!');
  };

  const handleMoveUp = async (id: number) => {
    const idx = linksList.findIndex((l) => l.id === id);
    if (idx <= 0) return;
    const newList = [...linksList];
    [newList[idx - 1], newList[idx]] = [newList[idx], newList[idx - 1]];
    setLinksList(newList);
    await reorderLinks(newList.map((l) => l.id), user.id);
  };

  const handleMoveDown = async (id: number) => {
    const idx = linksList.findIndex((l) => l.id === id);
    if (idx >= linksList.length - 1) return;
    const newList = [...linksList];
    [newList[idx], newList[idx + 1]] = [newList[idx + 1], newList[idx]];
    setLinksList(newList);
    await reorderLinks(newList.map((l) => l.id), user.id);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
            Manage your Mizari profile at{' '}
            <a
              href={`/${user.username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-[#FF6B6B] hover:text-[#EE5A24] transition-colors"
            >
              mizari.cc/{user.username}
            </a>
          </p>
        </div>
      </div>

      {message && (
        <div className="mb-6 rounded-lg bg-green-50 p-3 text-sm font-medium text-green-600 dark:bg-green-900/20 dark:text-green-400">
          {message}
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-5">
        {/* Left column: edit forms */}
        <div className="space-y-6 lg:col-span-3">
          {/* Profile editor */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Profile</h2>
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">Bio</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  className="mt-1.5 block w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm transition-colors focus:border-[#FF6B6B] focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                  placeholder="Tell the world about yourself..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">Avatar URL</label>
                <input
                  type="url"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  className="mt-1.5 block w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm transition-colors focus:border-[#FF6B6B] focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                  placeholder="https://example.com/avatar.jpg"
                />
              </div>
              <button
                onClick={handleUpdateProfile}
                disabled={saving}
                className="rounded-xl bg-gradient-to-r from-[#FF6B6B] to-[#EE5A24] px-5 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:shadow-md hover:brightness-110 disabled:opacity-60"
              >
                {saving ? 'Saving...' : 'Save profile'}
              </button>
            </div>
          </div>

          {/* Ad slot */}
          <AdSlot slot="dashboard-inline" size="responsive" className="!h-[60px]" />

          {/* Add link */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Add new link</h2>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="flex-1 rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm transition-colors focus:border-[#FF6B6B] focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                placeholder="Link title"
              />
              <input
                type="url"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                className="flex-1 rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm transition-colors focus:border-[#FF6B6B] focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                placeholder="https://..."
              />
              <button
                onClick={handleAddLink}
                disabled={saving || !newTitle.trim() || !newUrl.trim()}
                className="rounded-xl bg-gradient-to-r from-[#FF6B6B] to-[#EE5A24] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:shadow-md hover:brightness-110 disabled:opacity-60"
              >
                Add
              </button>
            </div>
          </div>

          {/* Links list */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Your links ({linksList.length})
            </h2>
            <div className="mt-4 space-y-3">
              {linksList.length === 0 && (
                <p className="py-8 text-center text-sm text-gray-400 dark:text-slate-500">
                  No links yet. Add your first link above!
                </p>
              )}
              {linksList.map((link, index) => (
                <LinkCard
                  key={link.id}
                  link={link}
                  onUpdate={handleUpdateLink}
                  onDelete={handleDeleteLink}
                  onMoveUp={handleMoveUp}
                  onMoveDown={handleMoveDown}
                  isFirst={index === 0}
                  isLast={index === linksList.length - 1}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right column: live preview */}
        <div className="lg:col-span-2">
          <div className="sticky top-24">
            <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Live Preview</h2>
            <ProfilePreview
              username={user.username}
              bio={bio}
              avatarUrl={avatarUrl}
              links={linksList.map((l) => ({ id: l.id, title: l.title, url: l.url }))}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
