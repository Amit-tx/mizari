'use client';

import { useState, useRef } from 'react';
import { LinkCard } from '@/components/LinkCard';
import { ProfilePreview } from '@/components/ProfilePreview';
import { AdSlot } from '@/components/AdSlot';
import { updateProfile, updateThemeSettings, removeBgImage, addLink, updateLink, deleteLink, reorderLinks } from './actions';
import type { Link } from '@/db/schema';

interface DashboardClientProps {
  user: { 
    id: number; 
    username: string; 
    bio: string; 
    avatarUrl: string;
    themeType: 'light' | 'dark' | 'custom';
    themeBgColor: string;
    themeTextColor: string;
    themeBgImage: string;
    themeButtonStyle: 'rounded-xl' | 'rounded-full' | 'rounded-none' | 'shadow';
  };
  initialLinks: Link[];
}

export function DashboardClient({ user, initialLinks }: DashboardClientProps) {
  const [bio, setBio] = useState(user.bio);
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl);
  
  // Theme States
  const [themeType, setThemeType] = useState<'light' | 'dark' | 'custom'>(user.themeType);
  const [themeBgColor, setThemeBgColor] = useState(user.themeBgColor);
  const [themeTextColor, setThemeTextColor] = useState(user.themeTextColor);
  const [themeBgImage, setThemeBgImage] = useState(user.themeBgImage);
  const [themeButtonStyle, setThemeButtonStyle] = useState<'rounded-xl' | 'rounded-full' | 'rounded-none' | 'shadow'>(user.themeButtonStyle);
  
  const [linksList, setLinksList] = useState(initialLinks);
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');
  
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingBg, setUploadingBg] = useState(false);
  const [message, setMessage] = useState('');

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const bgInputRef = useRef<HTMLInputElement>(null);

  const showMessage = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3000);
  };

  // Image Upload Handler
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'background') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (type === 'avatar') setUploadingAvatar(true);
    else setUploadingBg(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || 'Failed to upload image');
        return;
      }

      if (type === 'avatar') {
        setAvatarUrl(data.url);
        showMessage('Avatar updated!');
      } else {
        setThemeBgImage(data.url);
        setThemeType('custom');
        showMessage('Background image updated!');
      }
    } catch (err) {
      console.error(err);
      alert('Error uploading image');
    } finally {
      setUploadingAvatar(false);
      setUploadingBg(false);
    }
  };

  // Save Profile (Bio Only)
  const handleUpdateProfile = async () => {
    setSaving(true);
    await updateProfile(user.id, bio);
    setSaving(false);
    showMessage('Profile updated!');
  };

  // Save Theme Settings
  const handleSaveTheme = async () => {
    setSaving(true);
    await updateThemeSettings(user.id, themeType, themeBgColor, themeTextColor, themeButtonStyle);
    setSaving(false);
    showMessage('Theme settings saved!');
  };

  // Remove Background Image
  const handleRemoveBg = async () => {
    setSaving(true);
    await removeBgImage(user.id);
    setThemeBgImage('');
    setThemeType('light');
    setSaving(false);
    showMessage('Background image removed!');
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
          
          {/* Profile & Avatar Editor */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Profile Details</h2>
            <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-center">
              {/* Avatar Selector */}
              <div className="relative flex flex-col items-center">
                <div className="h-24 w-24 overflow-hidden rounded-full border-2 border-gray-200 bg-gray-50 dark:border-slate-700 dark:bg-slate-800">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-3xl font-bold text-gray-400">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  ref={avatarInputRef}
                  onChange={(e) => handleImageUpload(e, 'avatar')}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  disabled={uploadingAvatar}
                  onClick={() => avatarInputRef.current?.click()}
                  className="mt-2 text-xs font-semibold text-[#FF6B6B] hover:text-[#EE5A24]"
                >
                  {uploadingAvatar ? 'Uploading...' : 'Change Photo'}
                </button>
              </div>

              {/* Bio input */}
              <div className="flex-1 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">Bio</label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={2}
                    className="mt-1.5 block w-full rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm transition-colors focus:border-[#FF6B6B] focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                    placeholder="Tell the world about yourself..."
                  />
                </div>
                <button
                  onClick={handleUpdateProfile}
                  disabled={saving}
                  className="rounded-xl bg-gradient-to-r from-[#FF6B6B] to-[#EE5A24] px-5 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:shadow-md hover:brightness-110 disabled:opacity-60"
                >
                  Save Bio
                </button>
              </div>
            </div>
          </div>

          {/* Custom Theme & Background Builder */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Page Theme</h2>
            
            <div className="mt-4 space-y-4">
              {/* Theme Type Selector */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">Theme Type</label>
                <div className="mt-2 flex gap-3">
                  {(['light', 'dark', 'custom'] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setThemeType(type)}
                      className={`rounded-xl px-4 py-2 text-sm font-semibold capitalize border transition-all ${
                        themeType === type
                          ? 'border-[#FF6B6B] bg-[#FF6B6B]/5 text-[#FF6B6B]'
                          : 'border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-400'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Theme Options */}
              {themeType === 'custom' && (
                <div className="grid gap-4 sm:grid-cols-2 p-4 rounded-xl bg-gray-50 dark:bg-slate-900/50">
                  {/* Background Color */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-slate-400">Background Color</label>
                    <div className="mt-1.5 flex items-center gap-2">
                      <input
                        type="color"
                        value={themeBgColor}
                        onChange={(e) => setThemeBgColor(e.target.value)}
                        className="h-9 w-9 cursor-pointer rounded-lg border-0 bg-transparent"
                      />
                      <input
                        type="text"
                        value={themeBgColor}
                        onChange={(e) => setThemeBgColor(e.target.value)}
                        className="w-24 rounded-lg border border-gray-300 px-2.5 py-1.5 text-xs focus:outline-none dark:border-slate-700 dark:bg-slate-800"
                      />
                    </div>
                  </div>

                  {/* Text Color */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-slate-400">Text Color</label>
                    <div className="mt-1.5 flex items-center gap-2">
                      <input
                        type="color"
                        value={themeTextColor}
                        onChange={(e) => setThemeTextColor(e.target.value)}
                        className="h-9 w-9 cursor-pointer rounded-lg border-0 bg-transparent"
                      />
                      <input
                        type="text"
                        value={themeTextColor}
                        onChange={(e) => setThemeTextColor(e.target.value)}
                        className="w-24 rounded-lg border border-gray-300 px-2.5 py-1.5 text-xs focus:outline-none dark:border-slate-700 dark:bg-slate-800"
                      />
                    </div>
                  </div>

                  {/* Background Image Upload */}
                  <div className="sm:col-span-2 border-t border-gray-200 dark:border-slate-800 pt-3">
                    <label className="block text-xs font-medium text-gray-600 dark:text-slate-400">Background Image</label>
                    <div className="mt-2 flex items-center gap-4">
                      {themeBgImage ? (
                        <div className="relative h-12 w-20 overflow-hidden rounded-lg border border-gray-200">
                          <img src={themeBgImage} alt="Bg Preview" className="h-full w-full object-cover" />
                        </div>
                      ) : (
                        <div className="flex h-12 w-20 items-center justify-center rounded-lg border border-dashed border-gray-300 text-xs text-gray-400">
                          No Image
                        </div>
                      )}
                      
                      <div className="flex gap-2">
                        <input
                          type="file"
                          ref={bgInputRef}
                          onChange={(e) => handleImageUpload(e, 'background')}
                          accept="image/*"
                          className="hidden"
                        />
                        <button
                          type="button"
                          disabled={uploadingBg}
                          onClick={() => bgInputRef.current?.click()}
                          className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                        >
                          {uploadingBg ? 'Uploading...' : themeBgImage ? 'Replace Image' : 'Upload Image'}
                        </button>
                        {themeBgImage && (
                          <button
                            type="button"
                            onClick={handleRemoveBg}
                            className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100 dark:bg-red-950/20 dark:text-red-400"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Button Style Selector */}
                  <div className="sm:col-span-2 border-t border-gray-200 dark:border-slate-800 pt-3">
                    <label className="block text-xs font-medium text-gray-600 dark:text-slate-400 font-semibold mb-2">Button Style</label>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                      {(['rounded-xl', 'rounded-full', 'rounded-none', 'shadow'] as const).map((style) => (
                        <button
                          key={style}
                          type="button"
                          onClick={() => setThemeButtonStyle(style)}
                          className={`rounded-lg py-2 text-xs font-semibold border transition-all ${
                            themeButtonStyle === style
                              ? 'border-[#FF6B6B] bg-[#FF6B6B]/5 text-[#FF6B6B]'
                              : 'border-gray-200 dark:border-slate-800 text-gray-600 dark:text-slate-400'
                          }`}
                        >
                          {style === 'rounded-xl' && 'Rounded'}
                          {style === 'rounded-full' && 'Circular'}
                          {style === 'rounded-none' && 'Square'}
                          {style === 'shadow' && 'Soft Shadow'}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={handleSaveTheme}
                disabled={saving}
                className="rounded-xl bg-gradient-to-r from-[#FF6B6B] to-[#EE5A24] px-5 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:shadow-md hover:brightness-110 disabled:opacity-60"
              >
                Save Theme
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
                placeholder="Link title (e.g. My YouTube)"
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
              themeType={themeType}
              themeBgColor={themeBgColor}
              themeTextColor={themeTextColor}
              themeBgImage={themeBgImage}
              themeButtonStyle={themeButtonStyle}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
