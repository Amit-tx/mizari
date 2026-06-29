'use client';

import { useState, useRef } from 'react';
import { LinkCard } from '@/components/LinkCard';
import { ProfilePreview } from '@/components/ProfilePreview';
import { AdSlot } from '@/components/AdSlot';
import { JAPANESE_THEMES } from '@/components/Themes';
import { QRCodeModal } from '@/components/QRCodeModal';
import { 
  updateProfile, 
  updateThemeSettings, 
  removeBgImage, 
  addLink, 
  updateLink, 
  deleteLink, 
  reorderLinks,
  requestAccountDeletion 
} from './actions';
import type { Link } from '@/db/schema';

interface DashboardClientProps {
  user: { 
    id: number; 
    username: string; 
    bio: string; 
    avatarUrl: string;
    themeType: string;
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
  const [themeType, setThemeType] = useState<string>(user.themeType);
  const [themeBgColor, setThemeBgColor] = useState(user.themeBgColor);
  const [themeTextColor, setThemeTextColor] = useState(user.themeTextColor);
  const [themeBgImage, setThemeBgImage] = useState(user.themeBgImage);
  const [themeButtonStyle, setThemeButtonStyle] = useState<'rounded-xl' | 'rounded-full' | 'rounded-none' | 'shadow'>(user.themeButtonStyle);
  
  const [linksList, setLinksList] = useState(initialLinks);
  
  // Input fields for standard links & products
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [isProduct, setIsProduct] = useState(0); // 0 = standard, 1 = product
  const [price, setPrice] = useState('');
  const [discount, setDiscount] = useState('');
  const [productImage, setProductImage] = useState('');
  
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingBg, setUploadingBg] = useState(false);
  const [uploadingProd, setUploadingProd] = useState(false);
  const [message, setMessage] = useState('');
  
  // Deletion & Share States
  const [deletionLink, setDeletionLink] = useState('');
  const [requestingDelete, setRequestingDelete] = useState(false);
  const [copied, setCopied] = useState(false);

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const bgInputRef = useRef<HTMLInputElement>(null);
  const prodImgInputRef = useRef<HTMLInputElement>(null);

  const showMessage = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3000);
  };

  // Share profile from dashboard
  const handleShareProfile = async () => {
    const profileUrl = `${window.location.origin}/${user.username}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `@${user.username} on Mizari`,
          text: `Check out my links on Mizari!`,
          url: profileUrl,
        });
      } catch (e) {
        console.error('Error sharing:', e);
      }
    } else {
      try {
        await navigator.clipboard.writeText(profileUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (e) {
        console.error('Error copying:', e);
      }
    }
  };

  // Image Upload Handler
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'background' | 'product') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (type === 'avatar') setUploadingAvatar(true);
    else if (type === 'background') setUploadingBg(true);
    else setUploadingProd(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'background'); // Stores as background/product type

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
      } else if (type === 'background') {
        setThemeBgImage(data.url);
        setThemeType('custom');
        showMessage('Background image updated!');
      } else {
        setProductImage(data.url);
        showMessage('Product image uploaded!');
      }
    } catch (err) {
      console.error(err);
      alert('Error uploading image');
    } finally {
      setUploadingAvatar(false);
      setUploadingBg(false);
      setUploadingProd(false);
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
  const handleSaveTheme = async (newThemeType?: string) => {
    setSaving(true);
    const targetType = newThemeType || themeType;
    await updateThemeSettings(user.id, targetType, themeBgColor, themeTextColor, themeButtonStyle);
    setSaving(false);
    showMessage('Theme settings saved!');
  };

  // Select Preset Theme
  const handleSelectPreset = async (presetId: string) => {
    setThemeType(presetId);
    await handleSaveTheme(presetId);
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

  // Account Deletion Link Generator
  const handleRequestDeletion = async () => {
    setRequestingDelete(true);
    try {
      const res = await requestAccountDeletion(user.id);
      if (res.success && res.token) {
        const fullLink = `${window.location.origin}/delete-confirm?token=${res.token}`;
        setDeletionLink(fullLink);
      } else {
        alert('Failed to generate deletion token. Please try again.');
      }
    } catch (err) {
      console.error(err);
      alert('Error requesting deletion');
    } finally {
      setRequestingDelete(false);
    }
  };

  const handleAddLink = async () => {
    if (!newTitle.trim() || !newUrl.trim()) return;
    setSaving(true);
    const link = await addLink(
      user.id, 
      newTitle, 
      newUrl, 
      linksList.length, 
      isProduct, 
      price, 
      discount, 
      productImage
    );
    if (link) {
      setLinksList([...linksList, link]);
      setNewTitle('');
      setNewUrl('');
      setPrice('');
      setDiscount('');
      setProductImage('');
      setIsProduct(0);
      showMessage('Product/Link added!');
    }
    setSaving(false);
  };

  const handleUpdateLink = async (
    id: number, 
    title: string, 
    url: string,
    isProd: number,
    prc: string,
    disc: string,
    img: string
  ) => {
    await updateLink(id, user.id, title, url, isProd, prc, disc, img);
    setLinksList(linksList.map((l) => (l.id === id ? { ...l, title, url, isProduct: isProd, price: prc, discount: disc, productImage: img } : l)));
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
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 flex flex-col justify-between gap-4 border-b border-gray-100 dark:border-slate-800 pb-6 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">Dashboard</h1>
          <div className="mt-2 flex flex-wrap items-center gap-2.5 text-sm text-gray-500 dark:text-slate-400">
            <span>Manage your Mizari profile at</span>
            <a
              href={`/${user.username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-[#FF6B6B] hover:underline"
            >
              mizari.cc/{user.username}
            </a>
            
            <button
              onClick={handleShareProfile}
              className="inline-flex items-center gap-1 rounded-full bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 px-2.5 py-1 text-xs font-semibold text-gray-600 dark:text-slate-300 transition-colors"
            >
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 10.742l4.622-2.312m0 7.14l-4.622-2.312M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9zm-13.5 0a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm10.5-4.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm0 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
              </svg>
              <span>{copied ? 'Copied!' : 'Share'}</span>
            </button>

            <QRCodeModal username={user.username} />
          </div>
        </div>
      </div>

      {message && (
        <div className="mb-6 rounded-xl bg-green-50 p-4 text-sm font-semibold text-green-600 dark:bg-green-900/20 dark:text-green-400 animate-fade-in">
          {message}
        </div>
      )}

      {/* Main Responsive Grid */}
      <div className="grid gap-8 lg:grid-cols-5">
        {/* Left Column: Editor Forms */}
        <div className="space-y-6 lg:col-span-3">
          
          {/* Profile & Avatar Editor */}
          <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm dark:border-slate-850 dark:bg-slate-900">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Profile Details</h2>
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
              {/* Avatar Selector */}
              <div className="relative flex flex-col items-center">
                <div className="group relative h-28 w-28 overflow-hidden rounded-full border-4 border-white bg-gray-50 shadow-md dark:border-slate-800 dark:bg-slate-800">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-4xl font-bold text-gray-400">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                  )}
                  {/* Hover Overlay */}
                  <div 
                    onClick={() => avatarInputRef.current?.click()}
                    className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    <span className="text-xs font-bold text-white">Change</span>
                  </div>
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
                  className="mt-2.5 text-xs font-bold text-[#FF6B6B] hover:underline"
                >
                  {uploadingAvatar ? 'Uploading...' : 'Change Photo'}
                </button>
              </div>

              {/* Bio input */}
              <div className="flex-1 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300">Bio</label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={3}
                    className="mt-1.5 block w-full rounded-2xl border border-gray-200 bg-white px-4 py-2.5 text-sm transition-all focus:border-[#FF6B6B] focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]/20 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                    placeholder="Tell the world about yourself..."
                  />
                </div>
                <button
                  onClick={handleUpdateProfile}
                  disabled={saving}
                  className="rounded-2xl bg-gradient-to-r from-[#FF6B6B] to-[#EE5A24] px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-[#FF6B6B]/20 transition-all hover:brightness-110 disabled:opacity-60"
                >
                  Save Bio
                </button>
              </div>
            </div>
          </div>

          {/* Preset Japanese Themes */}
          <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm dark:border-slate-850 dark:bg-slate-900">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Japanese Preset Themes</h2>
            <p className="text-xs text-gray-500 mb-6">Choose a beautiful predefined theme inspired by Japan.</p>
            
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 max-h-72 overflow-y-auto pr-1">
              {JAPANESE_THEMES.map((theme) => (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => handleSelectPreset(theme.id)}
                  className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all duration-200 ${
                    themeType === theme.id
                      ? 'border-[#FF6B6B] bg-[#FF6B6B]/5 scale-95 ring-2 ring-[#FF6B6B]/20'
                      : 'border-gray-100 hover:border-gray-300 dark:border-slate-800 dark:hover:border-slate-700'
                  }`}
                  style={{ background: theme.bgGradient || theme.bgColor }}
                >
                  <span className="text-2xl mb-1">{theme.emoji}</span>
                  <span className="text-xs font-bold" style={{ color: theme.textColor }}>{theme.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Theme & Background Builder */}
          <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm dark:border-slate-850 dark:bg-slate-900">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Custom Theme Builder</h2>
            
            <div className="space-y-6">
              {/* Theme Type Selector */}
              <div className="flex gap-2">
                {(['light', 'dark', 'custom'] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setThemeType(type)}
                    className={`rounded-xl px-4 py-2 text-xs font-bold capitalize border transition-all ${
                      themeType === type
                        ? 'border-[#FF6B6B] bg-[#FF6B6B]/5 text-[#FF6B6B]'
                        : 'border-gray-200 dark:border-slate-800 text-gray-600 dark:text-slate-400'
                    }`}
                  >
                    {type === 'custom' ? '🎨 Custom' : type}
                  </button>
                ))}
              </div>

              {/* Custom Theme Options */}
              {(themeType === 'custom' || !JAPANESE_THEMES.some(t => t.id === themeType)) && (
                <div className="grid gap-6 sm:grid-cols-2 p-6 rounded-2xl bg-gray-50 dark:bg-slate-800/50">
                  {/* Background Color */}
                  <div>
                    <label className="block text-xs font-bold text-gray-600 dark:text-slate-400">Background Color</label>
                    <div className="mt-2 flex items-center gap-2">
                      <input
                        type="color"
                        value={themeBgColor}
                        onChange={(e) => { setThemeBgColor(e.target.value); setThemeType('custom'); }}
                        className="h-10 w-10 cursor-pointer rounded-xl border-0 bg-transparent"
                      />
                      <input
                        type="text"
                        value={themeBgColor}
                        onChange={(e) => { setThemeBgColor(e.target.value); setThemeType('custom'); }}
                        className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none dark:border-slate-700 dark:bg-slate-800"
                      />
                    </div>
                  </div>

                  {/* Text Color */}
                  <div>
                    <label className="block text-xs font-bold text-gray-600 dark:text-slate-400">Text Color</label>
                    <div className="mt-2 flex items-center gap-2">
                      <input
                        type="color"
                        value={themeTextColor}
                        onChange={(e) => { setThemeTextColor(e.target.value); setThemeType('custom'); }}
                        className="h-10 w-10 cursor-pointer rounded-xl border-0 bg-transparent"
                      />
                      <input
                        type="text"
                        value={themeTextColor}
                        onChange={(e) => { setThemeTextColor(e.target.value); setThemeType('custom'); }}
                        className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none dark:border-slate-700 dark:bg-slate-800"
                      />
                    </div>
                  </div>

                  {/* Background Image Upload */}
                  <div className="sm:col-span-2 border-t border-gray-200/60 dark:border-slate-800 pt-4">
                    <label className="block text-xs font-bold text-gray-600 dark:text-slate-400">Background Image</label>
                    <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-center">
                      {themeBgImage ? (
                        <div className="relative h-16 w-28 overflow-hidden rounded-xl border border-gray-200 shadow-sm">
                          <img src={themeBgImage} alt="Bg Preview" className="h-full w-full object-cover" />
                        </div>
                      ) : (
                        <div className="flex h-16 w-28 items-center justify-center rounded-xl border-2 border-dashed border-gray-200 text-xs text-gray-400">
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
                          className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                        >
                          {uploadingBg ? 'Uploading...' : themeBgImage ? 'Replace Image' : 'Upload Image'}
                        </button>
                        {themeBgImage && (
                          <button
                            type="button"
                            onClick={handleRemoveBg}
                            className="rounded-xl bg-red-50 px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-100 dark:bg-red-950/20 dark:text-red-400"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Button Style Selector */}
                  <div className="sm:col-span-2 border-t border-gray-200/60 dark:border-slate-800 pt-4">
                    <label className="block text-xs font-bold text-gray-600 dark:text-slate-400 mb-3">Button Style</label>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                      {(['rounded-xl', 'rounded-full', 'rounded-none', 'shadow'] as const).map((style) => (
                        <button
                          key={style}
                          type="button"
                          onClick={() => { setThemeButtonStyle(style); setThemeType('custom'); }}
                          className={`rounded-xl py-2.5 text-xs font-bold border transition-all ${
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
                onClick={() => handleSaveTheme()}
                disabled={saving}
                className="rounded-2xl bg-gradient-to-r from-[#FF6B6B] to-[#EE5A24] px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-[#FF6B6B]/20 transition-all hover:brightness-110 disabled:opacity-60"
              >
                Save Custom Theme
              </button>
            </div>
          </div>

          {/* Add Link or Product Card */}
          <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm dark:border-slate-850 dark:bg-slate-900">
            <div className="flex gap-4 border-b border-gray-100 dark:border-slate-850 pb-4 mb-4">
              <button
                type="button"
                onClick={() => setIsProduct(0)}
                className={`flex-1 py-2 text-sm font-bold border rounded-2xl transition-all ${
                  isProduct === 0
                    ? 'border-[#FF6B6B] bg-[#FF6B6B]/5 text-[#FF6B6B]'
                    : 'border-gray-200 dark:border-slate-800 text-gray-500 dark:text-slate-400'
                }`}
              >
                🔗 Add Standard Link
              </button>
              <button
                type="button"
                onClick={() => setIsProduct(1)}
                className={`flex-1 py-2 text-sm font-bold border rounded-2xl transition-all ${
                  isProduct === 1
                    ? 'border-[#FF6B6B] bg-[#FF6B6B]/5 text-[#FF6B6B]'
                    : 'border-gray-200 dark:border-slate-800 text-gray-500 dark:text-slate-400'
                }`}
              >
                🛍️ Add Product Card
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col gap-4 sm:flex-row">
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="flex-1 rounded-2xl border border-gray-200 bg-white px-4 py-2.5 text-sm transition-all focus:border-[#FF6B6B] focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]/20 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                  placeholder={isProduct === 1 ? 'Product Name (e.g. Anime Figurine)' : 'Link Title (e.g. My Website)'}
                />
                <input
                  type="url"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  className="flex-1 rounded-2xl border border-gray-200 bg-white px-4 py-2.5 text-sm transition-all focus:border-[#FF6B6B] focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]/20 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                  placeholder="https://..."
                />
              </div>

              {isProduct === 1 && (
                <div className="grid gap-4 sm:grid-cols-2 p-4 rounded-2xl bg-gray-50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-800 animate-fade-in">
                  <div>
                    <label className="block text-xs font-bold text-gray-600 dark:text-slate-400">Price (e.g. $29.99)</label>
                    <input
                      type="text"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-gray-250 bg-white px-3 py-2 text-xs focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                      placeholder="e.g. $49"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 dark:text-slate-400">Discount Tag (e.g. 10% OFF)</label>
                    <input
                      type="text"
                      value={discount}
                      onChange={(e) => setDiscount(e.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-gray-250 bg-white px-3 py-2 text-xs focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                      placeholder="e.g. 20% OFF"
                    />
                                <div className="sm:col-span-2 border-t border-gray-200/60 dark:border-slate-800 pt-3 space-y-2">
                    <label className="block text-xs font-bold text-gray-600 dark:text-slate-400">Product Image</label>
                    <div className="flex flex-col gap-2">
                      <input
                        type="url"
                        value={productImage}
                        onChange={(e) => setProductImage(e.target.value)}
                        className="w-full rounded-xl border border-gray-250 bg-white px-3.5 py-1.5 text-xs focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                        placeholder="Paste Image URL here (e.g. Amazon image URL)..."
                      />
                      <div className="flex items-center gap-4">
                        {productImage && (
                          <img src={productImage} alt="Product" className="h-14 w-14 rounded-xl object-cover border" />
                        )}
                        <input
                          type="file"
                          ref={prodImgInputRef}
                          onChange={(e) => handleImageUpload(e, 'product')}
                          accept="image/*"
                          className="hidden"
                        />
                        <button
                          type="button"
                          disabled={uploadingProd}
                          onClick={() => prodImgInputRef.current?.click()}
                          className="rounded-xl border border-gray-250 bg-white px-4 py-2 text-xs font-bold text-gray-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-350"
                        >
                          {uploadingProd ? 'Uploading...' : 'Or Upload Local File'}
                        </button>
                      </div>
                    </div>
                  </div>     </div>
                </div>
              )}

              <button
                onClick={handleAddLink}
                disabled={saving || !newTitle.trim() || !newUrl.trim() || (isProduct === 1 && uploadingProd)}
                className="w-full rounded-2xl bg-gradient-to-r from-[#FF6B6B] to-[#EE5A24] py-3 text-sm font-semibold text-white shadow-md shadow-[#FF6B6B]/20 transition-all hover:brightness-110 disabled:opacity-60"
              >
                Add {isProduct === 1 ? 'Product Card' : 'Link'}
              </button>
            </div>
          </div>

          {/* Links list */}
          <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm dark:border-slate-850 dark:bg-slate-900">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
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

          {/* Danger Zone: Delete Account */}
          <div className="rounded-3xl border border-red-250 bg-red-50/10 p-6 shadow-sm dark:border-red-900/20 dark:bg-red-950/5">
            <h2 className="text-xl font-bold text-red-600 mb-2">Danger Zone</h2>
            <p className="text-xs text-gray-500 dark:text-slate-450 mb-4">
              Permanently delete your Mizari account, links, and all uploaded files. This action cannot be undone.
            </p>
            
            <div className="space-y-4">
              {!deletionLink ? (
                <button
                  onClick={handleRequestDeletion}
                  disabled={requestingDelete}
                  className="rounded-2xl bg-red-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-red-700 transition-all disabled:opacity-60"
                >
                  {requestingDelete ? 'Requesting...' : 'Delete Account'}
                </button>
              ) : (
                <div className="space-y-3 p-4 rounded-2xl bg-white border border-red-200 dark:bg-slate-900 dark:border-red-900/40 animate-fade-in">
                  <p className="text-xs font-bold text-red-600">
                    ⚠️ To confirm deletion, click the link below or copy and paste it into your browser. This link will expire in 1 hour.
                  </p>
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    <input
                      type="text"
                      readOnly
                      value={deletionLink}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 p-2 text-xs font-mono text-gray-600 select-all focus:outline-none dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300"
                    />
                    <a
                      href={deletionLink}
                      className="rounded-xl bg-red-600 px-4 py-2 text-center text-xs font-bold text-white hover:bg-red-700 transition-all whitespace-nowrap"
                    >
                      Verify & Delete Now
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right column: live preview */}
        <div className="hidden lg:block lg:col-span-2">
          <div className="sticky top-24">
            <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">Live Preview</h2>
            <ProfilePreview
              username={user.username}
              bio={bio}
              avatarUrl={avatarUrl}
              links={linksList.map((l) => ({ id: l.id, title: l.title, url: l.url, isProduct: l.isProduct, price: l.price, discount: l.discount, productImage: l.productImage }))}
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
