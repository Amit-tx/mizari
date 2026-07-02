'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LinkCard } from '@/components/LinkCard';
import { ProfilePreview } from '@/components/ProfilePreview';
import { STORE_THEMES } from '@/components/StoreThemes';
import { japanThemes, animeThemes } from '@/data/themes';
import { QRCodeModal } from '@/components/QRCodeModal';
import { 
  updateProfile, 
  updateThemeSettings, 
  removeBgImage, 
  addLink, 
  updateLink, 
  deleteLink, 
  reorderLinks,
  requestAccountDeletion,
  createProfile,
  updateWishTreeToggle,
  changeUserEmail,
  ascendProfilePrestige,
  updateAnnouncementSettings,
  updateGuestbookSettings,
  deleteGuestbookWish,
  updateDynamicThemeSettings
} from './actions';
import { publishTheme, requestPayout, getCreatorStats } from './marketplaceActions';
import { getLevelInfo, LEVEL_MAP } from '@/utils/xp-client';
import type { Link } from '@/db/schema';

const THEME_TABS = [
  { id: 'japan', label: 'Japan presets', emoji: '🇯🇵' },
  { id: 'anime', label: 'Anime themes', emoji: '🍥' },
  { id: 'romantic', label: 'Romantic', emoji: '❤️' },
  { id: 'fire', label: 'Fire & Energy', emoji: '🔥' },
  { id: 'space', label: 'Space', emoji: '🌌' },
  { id: 'glass', label: 'Glass & Modern', emoji: '💎' },
  { id: 'developer', label: 'Developer', emoji: '💻' },
  { id: 'gradient', label: 'Gradients', emoji: '🌈' },
  { id: 'seasonal', label: 'Seasonal', emoji: '🎄' },
  { id: 'country', label: 'Countries', emoji: '🌍' },
  { id: 'vehicle', label: 'Vehicles', emoji: '🚗' },
  { id: 'gaming', label: 'Gaming', emoji: '🎮' },
  { id: 'cyberpunk', label: 'Cyberpunk', emoji: '🦾' },
  { id: 'mystic', label: 'Mystic & Magic', emoji: '🔮' },
];

interface ProfileInfo {
  id: number;
  username: string;
  profileType: 'personal' | 'business' | 'gaming';
}

interface DashboardClientProps {
  userId: number;
  userProfiles: ProfileInfo[];
  activeProfile: {
    id: number;
    username: string;
    profileType: 'personal' | 'business' | 'gaming';
    bio: string;
    avatarUrl: string;
    themeType: string;
    themeBgColor: string;
    themeTextColor: string;
    themeBgImage: string;
    themeButtonStyle: 'rounded-xl' | 'rounded-full' | 'rounded-none' | 'shadow';
    themeBackdrop: string;
    themeRotateInterval: string;
    likes: number;
    showWishes: number;
    xp: number;
    prestige: number;
    guestbookStyle: 'tanabata' | 'classic';
    guestbookHeading: string;
    announcementText: string;
    announcementLink: string;
    announcementActive: number;
    announcementColor: string;
    birthday: string;
    enableDynamicTheme: number;
  };
  userEmail: string;
  initialLinks: Link[];
  totalClicks: number;
  purchasedThemeIds: string[];
  profileWishes?: { id: number; sender: string; text: string; color: string; createdAt: string }[];
  profileClickLogs?: { id: number; visitorIp: string; targetId: number; targetType: string; referrer: string; device: string; browser: string; country: string; createdAt: string }[];
}

export function DashboardClient({ 
  userId, 
  userProfiles, 
  activeProfile, 
  userEmail,
  initialLinks,
  totalClicks,
  purchasedThemeIds,
  profileWishes = [],
  profileClickLogs = []
}: DashboardClientProps) {
  const router = useRouter();

  const [bio, setBio] = useState(activeProfile.bio);
  const [avatarUrl, setAvatarUrl] = useState(activeProfile.avatarUrl);
  const [email, setEmail] = useState(userEmail);
  const [showWishes, setShowWishes] = useState(activeProfile.showWishes === 1);
  const [xp, setXp] = useState(activeProfile.xp || 0);
  const [prestige, setPrestige] = useState(activeProfile.prestige || 0);
  const [ascending, setAscending] = useState(false);

  useEffect(() => {
    setXp(activeProfile.xp || 0);
    setPrestige(activeProfile.prestige || 0);
  }, [activeProfile.id, activeProfile.xp, activeProfile.prestige]);
  
  // Theme States
  const [themeType, setThemeType] = useState<string>(activeProfile.themeType);
  const [themeBgColor, setThemeBgColor] = useState(activeProfile.themeBgColor);
  const [themeTextColor, setThemeTextColor] = useState(activeProfile.themeTextColor);
  const [themeBgImage, setThemeBgImage] = useState(activeProfile.themeBgImage);
  const [themeButtonStyle, setThemeButtonStyle] = useState<'rounded-xl' | 'rounded-full' | 'rounded-none' | 'shadow'>(activeProfile.themeButtonStyle);
  const [themeBackdrop, setThemeBackdrop] = useState<string>(activeProfile.themeBackdrop || 'glass-light');
  const [themeRotateInterval, setThemeRotateInterval] = useState<string>(activeProfile.themeRotateInterval || 'none');
  const [themeSearchQuery, setThemeSearchQuery] = useState('');
  const [activeThemeTab, setActiveThemeTab] = useState<string>('japan');
  
  const [linksList, setLinksList] = useState(initialLinks);
  
  // Input fields for standard links & products
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [isProduct, setIsProduct] = useState(0); // 0 = standard, 1 = product
  const [price, setPrice] = useState('');
  const [discount, setDiscount] = useState('');
  const [productImage, setProductImage] = useState('');
  const [scheduledStart, setScheduledStart] = useState('');
  const [scheduledEnd, setScheduledEnd] = useState('');
  const [productCategory, setProductCategory] = useState('');
  const [isSensitive, setIsSensitive] = useState(0);

  // Pagination for themes
  const [visibleThemesCount, setVisibleThemesCount] = useState(20);

  // Reset pagination when tab or search changes
  useEffect(() => {
    setVisibleThemesCount(20);
  }, [activeThemeTab, themeSearchQuery]);

  // Announcement Banner States
  const [announcementText, setAnnouncementText] = useState(activeProfile.announcementText || '');
  const [announcementLink, setAnnouncementLink] = useState(activeProfile.announcementLink || '');
  const [announcementActive, setAnnouncementActive] = useState(activeProfile.announcementActive === 1);
  const [announcementColor, setAnnouncementColor] = useState(activeProfile.announcementColor || '#FF6B6B');

  // Guestbook Style & Heading States
  const [guestbookStyle, setGuestbookStyle] = useState<'tanabata' | 'classic'>(activeProfile.guestbookStyle || 'tanabata');
  const [guestbookHeading, setGuestbookHeading] = useState(activeProfile.guestbookHeading || 'Guestbook');
  const [wishesList, setWishesList] = useState(profileWishes);

  // Dynamic Themes States
  const [enableDynamicTheme, setEnableDynamicTheme] = useState(activeProfile.enableDynamicTheme === 1);
  const [birthday, setBirthday] = useState(activeProfile.birthday || '');
  
  // New Profile States
  const [newProfileName, setNewProfileName] = useState('');
  const [newProfileType, setNewProfileType] = useState<'personal' | 'business' | 'gaming'>('personal');
  const [showNewProfileModal, setShowNewProfileModal] = useState(false);

  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingBg, setUploadingBg] = useState(false);
  const [uploadingProd, setUploadingProd] = useState(false);
  const [message, setMessage] = useState('');
  const [showMobilePreview, setShowMobilePreview] = useState(false);

  // Marketplace States
  const [creatorStats, setCreatorStats] = useState<{
    totalEarned: number;
    pendingWithdrawal: number;
    paidOut: number;
    upiId: string;
    sales: any[];
  }>({ totalEarned: 0, pendingWithdrawal: 0, paidOut: 0, upiId: '', sales: [] });

  const [marketThemeName, setMarketThemeName] = useState('');
  const [marketThemePrice, setMarketThemePrice] = useState(49);
  const [upiId, setUpiId] = useState('');
  const [payoutAmount, setPayoutAmount] = useState('');
  const [publishingMarketTheme, setPublishingMarketTheme] = useState(false);
  const [requestingPayout, setRequestingPayout] = useState(false);

  // Load Creator Stats
  useEffect(() => {
    async function loadStats() {
      try {
        const stats = await getCreatorStats(userId);
        setCreatorStats(stats);
        if (stats.upiId) setUpiId(stats.upiId);
      } catch (err) {
        console.error('Failed to load creator stats:', err);
      }
    }
    loadStats();
  }, [userId]);
  
  // Deletion & Share States
  const [deletionLink, setDeletionLink] = useState('');
  const [requestingDelete, setRequestingDelete] = useState(false);
  const [copied, setCopied] = useState(false);

  // Drag and Drop States
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const bgInputRef = useRef<HTMLInputElement>(null);
  const prodImgInputRef = useRef<HTMLInputElement>(null);

  const showMessage = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3000);
  };

  // Switch Profile
  const handleProfileSwitch = (id: number) => {
    router.push(`/dashboard?profileId=${id}`);
  };

  // Trigger Prestige Ascension
  const handlePrestigeAscend = async () => {
    if (xp < 450000) {
      alert("You need at least 450,000 XP (Level 30) to ascend to the next Prestige tier!");
      return;
    }

    const nextPrestigeRank = prestige + 1;
    const confirmAscension = confirm(
      `🌟 Congratulations on reaching Shogun Level 30!\n\nWould you like to Ascend to Prestige Rank ${nextPrestigeRank}?\nThis will reset your XP to 0 for the next tier, but will permanently display your Prestige Badge next to your profile. This action cannot be undone.`
    );

    if (!confirmAscension) return;

    setAscending(true);
    try {
      const res = await ascendProfilePrestige(activeProfile.id, userId);
      if (res.success && res.newPrestige !== undefined) {
        setXp(0);
        setPrestige(res.newPrestige);
        showMessage(`✨ You have Ascended to Prestige Rank ${res.newPrestige}!`);
        router.refresh();
      } else {
        alert(res.error || 'Ascension failed. Please try again.');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred during ascension.');
    } finally {
      setAscending(false);
    }
  };

  // Create New Profile
  const handleCreateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProfileName.trim()) return;

    setSaving(true);
    const res = await createProfile(userId, newProfileName, newProfileType);
    setSaving(false);
    
    if (res.success) {
      setNewProfileName('');
      setShowNewProfileModal(false);
      showMessage('New profile created successfully!');
      router.refresh();
    } else {
      alert(res.error || 'Failed to create profile.');
    }
  };

  // Share profile from dashboard
  const handleShareProfile = async () => {
    const profileUrl = `${window.location.origin}/${activeProfile.username}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `@${activeProfile.username} on Mizari`,
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
      formData.append('type', type === 'avatar' ? 'avatar' : 'background'); 
      formData.append('profileId', String(activeProfile.id));

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
    await updateProfile(activeProfile.id, userId, bio);
    setSaving(false);
    showMessage('Profile updated!');
  };

  // Toggle Tanabata Wish Tree
  const handleToggleWishes = async (checked: boolean) => {
    setShowWishes(checked);
    setSaving(true);
    try {
      await updateWishTreeToggle(activeProfile.id, userId, checked ? 1 : 0);
      showMessage(checked ? 'Tanabata Wish Tree enabled!' : 'Tanabata Wish Tree disabled!');
    } catch (err) {
      console.error(err);
      setShowWishes(!checked); // revert
      alert('Failed to update wish tree status.');
    } finally {
      setSaving(false);
    }
  };

  // Change Account Email Address
  const handleEmailChange = async () => {
    if (!email.trim() || !email.includes('@')) {
      alert('Please enter a valid email address.');
      return;
    }

    setSaving(true);
    try {
      const res = await changeUserEmail(userId, email);
      if (res.success) {
        showMessage('Email address updated successfully!');
      } else {
        alert(res.error || 'Failed to update email address.');
        setEmail(userEmail); // revert
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Save Theme Settings
  const handleSaveTheme = async (newThemeType?: string, newRotateInterval?: string) => {
    setSaving(true);
    const targetType = newThemeType || themeType;
    const targetInterval = newRotateInterval !== undefined ? newRotateInterval : themeRotateInterval;
    await updateThemeSettings(activeProfile.id, userId, targetType, themeBgColor, themeTextColor, themeButtonStyle, themeBackdrop, targetInterval);
    setSaving(false);
    showMessage('Theme settings saved!');
  };

  // Select Preset Theme
  const handleSelectPreset = async (presetId: string) => {
    // 1. Get theme data from catalog
    const theme = STORE_THEMES.find((t) => t.id === presetId);
    if (theme) {
      // Update states instantly so the Live Preview refreshes immediately!
      setThemeType(theme.id);
      setThemeBgColor(theme.bgColor);
      setThemeTextColor(theme.textColor);
      setThemeBgImage('');
    } else {
      setThemeType(presetId);
    }
    // 2. Save in the background (no UI blocking spinner)
    const targetType = presetId;
    const targetBg = theme?.bgColor || themeBgColor;
    const targetText = theme?.textColor || themeTextColor;
    updateThemeSettings(
      activeProfile.id,
      userId,
      targetType,
      targetBg,
      targetText,
      themeButtonStyle,
      themeBackdrop,
      themeRotateInterval
    ).catch((err) => {
      console.error(err);
    });
  };

  // Remove Background Image
  const handleRemoveBg = async () => {
    setSaving(true);
    await removeBgImage(activeProfile.id, userId);
    setThemeBgImage('');
    setThemeType('light');
    setSaving(false);
    showMessage('Background image removed!');
  };

  // Publish Custom Theme to Marketplace
  const handlePublishTheme = async () => {
    if (!marketThemeName.trim()) {
      alert('Please enter a theme name.');
      return;
    }
    setPublishingMarketTheme(true);
    try {
      const res = await publishTheme(activeProfile.id, userId, marketThemeName, marketThemePrice);
      if (res.success) {
        alert('🎉 Custom theme listed for sale in the Theme Store successfully!');
        setMarketThemeName('');
      } else {
        alert(res.error || 'Failed to publish theme.');
      }
    } catch (err) {
      console.error(err);
      alert('Error publishing theme.');
    } finally {
      setPublishingMarketTheme(false);
    }
  };

  // Request Payout
  const handleRequestPayout = async () => {
    const amount = Number(payoutAmount);
    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid payout amount.');
      return;
    }

    setRequestingPayout(true);
    try {
      const res = await requestPayout(userId, upiId, amount);
      if (res.success) {
        alert('🎉 Payout request submitted successfully! Platform owner will process it shortly.');
        setPayoutAmount('');
        // Reload stats
        const stats = await getCreatorStats(userId);
        setCreatorStats(stats);
      } else {
        alert(res.error || 'Payout request failed.');
      }
    } catch (err) {
      console.error(err);
      alert('Error requesting payout.');
    } finally {
      setRequestingPayout(false);
    }
  };

  // Account Deletion Link Generator
  const handleRequestDeletion = async () => {
    setRequestingDelete(true);
    try {
      const res = await requestAccountDeletion(userId);
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
      activeProfile.id,
      userId, 
      newTitle, 
      newUrl, 
      linksList.length, 
      isProduct, 
      price, 
      discount, 
      productImage,
      scheduledStart || null,
      scheduledEnd || null,
      productCategory,
      isSensitive
    );
    if (link) {
      setLinksList([...linksList, link]);
      setNewTitle('');
      setNewUrl('');
      setPrice('');
      setDiscount('');
      setProductImage('');
      setIsProduct(0);
      setScheduledStart('');
      setScheduledEnd('');
      setProductCategory('');
      setIsSensitive(0);
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
    img: string,
    schStart: string | null = null,
    schEnd: string | null = null,
    category: string = '',
    sensitive: number = 0
  ) => {
    await updateLink(id, activeProfile.id, userId, title, url, isProd, prc, disc, img, schStart, schEnd, category, sensitive);
    setLinksList(linksList.map((l) => (
      l.id === id 
        ? { 
            ...l, 
            title, 
            url, 
            isProduct: isProd, 
            price: prc, 
            discount: disc, 
            productImage: img,
            scheduledStart: schStart ? new Date(schStart) : null,
            scheduledEnd: schEnd ? new Date(schEnd) : null,
            productCategory: category,
            isSensitive: sensitive
          } 
        : l
    )));
    showMessage('Link updated!');
  };

  const handleDeleteLink = async (id: number) => {
    await deleteLink(id, activeProfile.id, userId);
    setLinksList(linksList.filter((l) => l.id !== id));
    showMessage('Link deleted!');
  };

  const handleMoveUp = async (id: number) => {
    const idx = linksList.findIndex((l) => l.id === id);
    if (idx <= 0) return;
    const newList = [...linksList];
    [newList[idx - 1], newList[idx]] = [newList[idx], newList[idx - 1]];
    setLinksList(newList);
    await reorderLinks(newList.map((l) => l.id), activeProfile.id, userId);
  };

  const handleMoveDown = async (id: number) => {
    const idx = linksList.findIndex((l) => l.id === id);
    if (idx >= linksList.length - 1) return;
    const newList = [...linksList];
    [newList[idx], newList[idx + 1]] = [newList[idx + 1], newList[idx]];
    setLinksList(newList);
    await reorderLinks(newList.map((l) => l.id), activeProfile.id, userId);
  };

  const handleSaveAnnouncement = async () => {
    setSaving(true);
    try {
      await updateAnnouncementSettings(
        activeProfile.id,
        userId,
        announcementText,
        announcementLink,
        announcementActive ? 1 : 0,
        announcementColor
      );
      showMessage('Announcement settings saved!');
    } catch(e) {
      console.error(e);
      alert('Failed to save announcement settings');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveGuestbook = async () => {
    setSaving(true);
    try {
      await updateGuestbookSettings(
        activeProfile.id,
        userId,
        guestbookStyle,
        guestbookHeading
      );
      showMessage('Guestbook preferences saved!');
    } catch(e) {
      console.error(e);
      alert('Failed to save guestbook preferences');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteWish = async (wishId: number) => {
    if (!confirm('Are you sure you want to delete this guestbook entry?')) return;
    try {
      await deleteGuestbookWish(wishId, activeProfile.id, userId);
      setWishesList(wishesList.filter(w => w.id !== wishId));
      showMessage('Guestbook entry deleted!');
    } catch(e) {
      console.error(e);
      alert('Failed to delete guestbook entry');
    }
  };

  const handleSaveDynamicTheme = async () => {
    setSaving(true);
    try {
      await updateDynamicThemeSettings(
        activeProfile.id,
        userId,
        enableDynamicTheme ? 1 : 0,
        birthday
      );
      showMessage('Dynamic theme settings saved!');
    } catch(e) {
      console.error(e);
      alert('Failed to save dynamic theme settings');
    } finally {
      setSaving(false);
    }
  };

  // --- HTML5 Drag & Drop handlers ---
  const handleDragStart = (idx: number) => {
    setDraggedIdx(idx);
  };

  const handleDragOver = (e: React.DragEvent, targetIdx: number) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === targetIdx) return;

    const newList = [...linksList];
    const draggedItem = newList[draggedIdx];
    newList.splice(draggedIdx, 1);
    newList.splice(targetIdx, 0, draggedItem);
    
    setDraggedIdx(targetIdx);
    setLinksList(newList);
  };

  const handleDragEnd = async () => {
    setDraggedIdx(null);
    await reorderLinks(linksList.map((l) => l.id), activeProfile.id, userId);
    showMessage('Links order saved!');
  };

  // Calculate Level Details
  // Calculate Level Details
  const levelInfo = getLevelInfo(xp, prestige);
  const currentLevelMapIndex = LEVEL_MAP.findIndex((l) => l.level === levelInfo.level);
  const currentThreshold = LEVEL_MAP[currentLevelMapIndex]?.xpRequired || 0;
  const nextThreshold = levelInfo.nextLevelXp;
  
  const xpInCurrentTier = xp - currentThreshold;
  const xpNeededInCurrentTier = nextThreshold - currentThreshold;
  const progressPercent = xpNeededInCurrentTier > 0 
    ? Math.min(100, Math.max(0, (xpInCurrentTier / xpNeededInCurrentTier) * 100))
    : 100;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      {/* Top Gamified Creator Level Bar */}
      <div className="mb-8 p-5 rounded-3xl bg-gradient-to-r from-indigo-50/70 via-purple-50/70 to-pink-50/70 dark:from-indigo-950/20 dark:via-purple-950/20 dark:to-pink-950/20 border border-purple-100/50 dark:border-purple-900/20 flex flex-col md:flex-row md:items-center md:justify-between gap-6 shadow-sm">
        <div className="flex items-center gap-3.5">
          <span className="text-3xl filter drop-shadow-md">🏆</span>
          <div>
            <h4 className="font-extrabold text-xs tracking-wider uppercase text-gray-400 dark:text-slate-400">Creator Rank</h4>
            <div className="flex items-center gap-2 mt-1">
              <span className="rounded-xl bg-purple-600 dark:bg-purple-500 px-2 py-0.5 text-[10px] font-extrabold text-white shadow-sm shadow-purple-500/20">
                {levelInfo.isPrestige ? `PRESTIGE ${levelInfo.prestigeLevel}` : `LVL ${levelInfo.level}`}
              </span>
              <span className="text-sm font-black text-gray-800 dark:text-slate-100 flex items-center gap-1">
                {levelInfo.name}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex-1 max-w-md flex flex-col gap-1.5">
          <div className="flex justify-between text-[10px] font-bold text-gray-500 dark:text-slate-400">
            <span>{xp.toLocaleString()} XP</span>
            {levelInfo.level === 30 && !levelInfo.isPrestige ? (
              <span className="text-emerald-500 animate-pulse font-extrabold">🌟 MAX LEVEL - READY TO ASCEND!</span>
            ) : (
              <span>Next Rank: {nextThreshold.toLocaleString()} XP</span>
            )}
          </div>
          <div className="h-2.5 w-full bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden border border-gray-200/25 dark:border-slate-700/20">
            <div className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-700 rounded-full" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>

        {/* Prestige Ascension Action Button */}
        {levelInfo.level === 30 && !levelInfo.isPrestige && (
          <button
            type="button"
            onClick={handlePrestigeAscend}
            disabled={ascending}
            className="rounded-2xl bg-gradient-to-r from-[#FF6B6B] to-[#EE5A24] px-5 py-2 text-xs font-black text-white shadow-md shadow-[#FF6B6B]/25 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 flex items-center gap-1.5"
          >
            {ascending ? 'Ascending...' : '🌟 Ascend to Prestige'}
          </button>
        )}
      </div>

      {/* Header & Profile Switcher */}
      <div className="mb-8 flex flex-col justify-between gap-4 border-b border-gray-100 dark:border-slate-800 pb-6 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">Dashboard</h1>
            {/* Profile Dropdown Switcher */}
            <div className="relative inline-block">
              <select
                value={activeProfile.id}
                onChange={(e) => handleProfileSwitch(parseInt(e.target.value))}
                className="rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-xs font-bold text-gray-700 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white cursor-pointer"
              >
                {userProfiles.map((p) => (
                  <option key={p.id} value={p.id}>
                    @{p.username} ({p.profileType})
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={() => setShowNewProfileModal(true)}
              className="rounded-full bg-[#FF6B6B]/10 hover:bg-[#FF6B6B]/20 text-[#FF6B6B] p-1.5 text-xs font-bold"
              title="Create New Profile"
            >
              ➕
            </button>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2.5 text-sm text-gray-500 dark:text-slate-400">
            <span>Manage your Mizari profile at</span>
            <a
              href={`/${activeProfile.username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-[#FF6B6B] hover:underline"
            >
              mizari.cc/{activeProfile.username}
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

            <QRCodeModal username={activeProfile.username} />
          </div>
        </div>
      </div>

      {message && (
        <div className="mb-6 rounded-xl bg-green-50 p-4 text-sm font-semibold text-green-600 dark:bg-green-900/20 dark:text-green-400 animate-fade-in">
          {message}
        </div>
      )}

      {/* Create Profile Modal */}
      {showNewProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm rounded-3xl border border-gray-100 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 animate-scale-up">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Create New Profile</h3>
            <p className="text-xs text-gray-550 mt-1">Add another personal, business, or gaming page.</p>

            <form onSubmit={handleCreateProfile} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Username (unique)</label>
                <input
                  type="text"
                  required
                  value={newProfileName}
                  onChange={(e) => setNewProfileName(e.target.value)}
                  className="w-full rounded-2xl border border-gray-200 bg-white px-3.5 py-2 text-sm focus:outline-none focus:border-[#FF6B6B] dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                  placeholder="e.g. amit_gaming"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Profile Type</label>
                <select
                  value={newProfileType}
                  onChange={(e) => setNewProfileType(e.target.value as any)}
                  className="w-full rounded-2xl border border-gray-200 bg-white px-3.5 py-2 text-sm focus:outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                >
                  <option value="personal">Personal</option>
                  <option value="business">Business / Shop</option>
                  <option value="gaming">Gaming</option>
                </select>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 rounded-2xl bg-gradient-to-r from-[#FF6B6B] to-[#EE5A24] py-2.5 text-xs font-bold text-white shadow-md hover:brightness-110"
                >
                  {saving ? 'Creating...' : 'Create Profile'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewProfileModal(false)}
                  className="flex-1 rounded-2xl border border-gray-200 py-2.5 text-xs font-bold text-gray-650 hover:bg-gray-50 dark:border-slate-800 dark:text-slate-350 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
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
                      {activeProfile.username.charAt(0).toUpperCase()}
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
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pt-2">
                  <button
                    onClick={handleUpdateProfile}
                    disabled={saving}
                    className="rounded-2xl bg-gradient-to-r from-[#FF6B6B] to-[#EE5A24] px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-[#FF6B6B]/20 transition-all hover:brightness-110 disabled:opacity-60"
                  >
                    Save Bio
                  </button>
                  <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-bold text-gray-600 dark:text-slate-400">
                    <input
                      type="checkbox"
                      checked={showWishes}
                      onChange={(e) => handleToggleWishes(e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-[#FF6B6B] focus:ring-[#FF6B6B]"
                    />
                    <span>Enable Tanabata Wish Tree 🎋</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Preset Japanese & Anime Themes */}
          <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm dark:border-slate-850 dark:bg-slate-900">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Preset & Seasonal Themes</h2>
            <p className="text-xs text-gray-500 mb-6">Select a predefined theme to instant-apply beautiful animated day/night styles.</p>

            {/* Theme Auto-Rotator Timer */}
            <div className="mb-6 p-4 rounded-2xl bg-gray-50 dark:bg-slate-800/40 border border-gray-100 dark:border-slate-800/60 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                  ⏱️ Theme Auto-Rotator
                </h3>
                <p className="text-[11px] text-gray-500 dark:text-slate-400 mt-0.5">
                  Automatically change your profile theme periodically using available themes.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={themeRotateInterval}
                  onChange={async (e) => {
                    const val = e.target.value;
                    setThemeRotateInterval(val);
                    await handleSaveTheme(themeType, val);
                  }}
                  className="rounded-xl border border-gray-200 px-3 py-2 text-xs font-semibold focus:outline-none dark:border-slate-700 dark:bg-slate-800 text-gray-700 dark:text-slate-200 cursor-pointer"
                >
                  <option value="none">Off (No rotation)</option>
                  <option value="3h">Every 3 hours</option>
                  <option value="5h">Every 5 hours</option>
                  <option value="6h">Every 6 hours</option>
                  <option value="12h">Every 12 hours</option>
                  <option value="24h">Every 24 hours</option>
                </select>
              </div>
            </div>

            {/* Theme Search Input */}
            <div className="mb-4 relative">
              <input
                type="text"
                placeholder="🔍 Search themes by name, tags, description..."
                value={themeSearchQuery}
                onChange={(e) => setThemeSearchQuery(e.target.value)}
                className="w-full rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]/20 text-gray-800 dark:text-slate-100 shadow-sm"
              />
              {themeSearchQuery && (
                <button
                  type="button"
                  onClick={() => setThemeSearchQuery('')}
                  className="absolute right-3 top-3 text-xs text-gray-400 hover:text-gray-655"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Theme Tabs */}
            <div className="flex gap-2 mb-6 border-b border-gray-100 dark:border-slate-800 pb-3 overflow-x-auto no-scrollbar scrollbar-thin">
              {THEME_TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveThemeTab(tab.id)}
                  className={`px-4 py-2 text-xs font-bold rounded-xl border transition-all whitespace-nowrap ${
                    activeThemeTab === tab.id
                      ? 'border-[#FF6B6B] bg-[#FF6B6B]/5 text-[#FF6B6B]'
                      : 'border-gray-200 dark:border-slate-800 text-gray-650 dark:text-slate-400 bg-white dark:bg-slate-850'
                  }`}
                >
                  {tab.emoji} {tab.label}
                </button>
              ))}
            </div>

            {/* Themes Grid */}
            <div 
              className="grid grid-cols-2 gap-3 sm:grid-cols-4 max-h-80 overflow-y-auto pr-1"
              onScroll={(e) => {
                const target = e.currentTarget;
                if (target.scrollHeight - target.scrollTop <= target.clientHeight + 20) {
                  setVisibleThemesCount((prev) => prev + 10);
                }
              }}
            >
              {(() => {
                const filteredThemes = STORE_THEMES.filter((t) => {
                  if (themeSearchQuery.trim() !== '') {
                    const q = themeSearchQuery.toLowerCase();
                    return (
                      t.name.toLowerCase().includes(q) ||
                      t.description.toLowerCase().includes(q) ||
                      t.categories.some(cat => cat.toLowerCase().includes(q)) ||
                      t.tags.some(tag => tag.toLowerCase().includes(q))
                    );
                  }
                  if (activeThemeTab === 'japan') {
                    return japanThemes.some((jt) => jt.slug === t.id) || t.id === 'sakura' || t.id === 'momiji' || t.id === 'zen' || t.id === 'ame' || t.id === 'mizukaze' || t.id === 'aozora';
                  } else if (activeThemeTab === 'anime') {
                    return animeThemes.some((at) => at.slug === t.id) || t.id === 'tsukiyo' || t.id === 'frieren' || t.id === 'demon_slayer';
                  } else {
                    return t.categories?.some(c => c.toLowerCase() === activeThemeTab);
                  }
                });

                return filteredThemes.slice(0, visibleThemesCount).map((theme) => {
                  const isFree = theme.price === 0;
                  const isUnlocked = isFree || email.toLowerCase() === 'amit_trillion@proton.me' || purchasedThemeIds.includes(theme.id);

                  return (
                    <div key={theme.id} className="relative group min-w-0 overflow-hidden">
                      <button
                        type="button"
                        onClick={() => {
                          if (isUnlocked) {
                            handleSelectPreset(theme.id);
                          } else {
                            if (confirm(`"${theme.name}" is a premium theme. Would you like to go to the Theme Store to unlock it?`)) {
                              router.push('/store');
                            }
                          }
                        }}
                        className={`w-full h-20 flex flex-col items-center justify-center p-2 rounded-2xl border transition-all duration-200 min-w-0 overflow-hidden ${
                          themeType === theme.id
                            ? 'border-[#FF6B6B] bg-[#FF6B6B]/5 scale-95 ring-2 ring-[#FF6B6B]/20'
                            : 'border-gray-250 hover:border-gray-350 dark:border-slate-800 dark:hover:border-slate-700'
                        } ${!isUnlocked ? 'opacity-85 saturate-[0.85] hover:opacity-100' : ''}`}
                        style={{ background: theme.bgGradient || theme.bgColor }}
                      >
                        <span className="text-xl mb-0.5 relative flex items-center justify-center">
                          {theme.emoji}
                          {!isUnlocked && (
                            <span className="absolute -top-1 -right-1 text-[10px] bg-black/75 rounded-full p-0.5" title="Premium Theme (Locked)">
                              🔒
                            </span>
                          )}
                        </span>
                        <span className="text-[10px] font-extrabold text-center block truncate w-full px-1" style={{ color: theme.textColor }}>
                          {theme.name}
                        </span>
                      </button>
                    </div>
                  );
                });
              })()}
            </div>
          </div>

          {/* Custom Theme & Background Builder */}
          <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm dark:border-slate-855 dark:bg-slate-900">
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
              {(themeType === 'custom' || !STORE_THEMES.some((t) => t.id === themeType)) && (
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
                          className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
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

                  {/* Backdrop Style Selector */}
                  <div className="sm:col-span-2 border-t border-gray-200/60 dark:border-slate-800 pt-4">
                    <label className="block text-xs font-bold text-gray-600 dark:text-slate-400 mb-3">Card Backdrop Style (Behind Text & Links)</label>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
                      {[
                        { id: 'none', label: '🫙 None' },
                        { id: 'glass-light', label: '⚪ Light Glass' },
                        { id: 'glass-dark', label: '⚫ Dark Glass' },
                        { id: 'solid-light', label: '⬜ Solid Light' },
                        { id: 'solid-dark', label: '⬛ Solid Dark' },
                      ].map((b) => (
                        <button
                          key={b.id}
                          type="button"
                          onClick={() => { setThemeBackdrop(b.id); setThemeType('custom'); }}
                          className={`rounded-xl py-2 text-xs font-bold border transition-all ${
                            themeBackdrop === b.id
                              ? 'border-[#FF6B6B] bg-[#FF6B6B]/5 text-[#FF6B6B]'
                              : 'border-gray-200 dark:border-slate-800 text-gray-600 dark:text-slate-400'
                          }`}
                        >
                          {b.label}
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

          {/* Sell Theme in Marketplace Card */}
          <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Sell Theme in Marketplace 💰</h2>
            <p className="text-xs text-gray-500 mb-4">List your current custom theme config for sale in the Theme Store. You keep 85% of each sale!</p>
            
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-gray-600 dark:text-slate-400 mb-1">Theme Name</label>
                  <input
                    type="text"
                    value={marketThemeName}
                    onChange={(e) => setMarketThemeName(e.target.value)}
                    placeholder="e.g. Cherry Forest"
                    className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-xs focus:outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-white focus:border-[#FF6B6B]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 dark:text-slate-400 mb-1">Price (₹10 - ₹500)</label>
                  <input
                    type="number"
                    value={marketThemePrice}
                    onChange={(e) => setMarketThemePrice(Number(e.target.value))}
                    placeholder="49"
                    className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-xs focus:outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-white focus:border-[#FF6B6B]"
                  />
                </div>
              </div>
              
              <button
                type="button"
                onClick={handlePublishTheme}
                disabled={publishingMarketTheme || !marketThemeName.trim()}
                className="w-full rounded-2xl bg-black dark:bg-white dark:text-black text-white px-6 py-2.5 text-xs font-bold transition-all hover:opacity-90 disabled:opacity-50"
              >
                {publishingMarketTheme ? 'Publishing...' : 'List Theme for Sale 🚀'}
              </button>
            </div>
          </div>

          {/* Earnings & Payouts Card */}
          <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Creator Earnings & Payouts 💳</h2>
            <p className="text-xs text-gray-500 mb-6">Track your theme marketplace sales and request withdrawals to your UPI account.</p>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 mb-6">
              <div className="p-4 rounded-2xl bg-gray-50 dark:bg-slate-800/50">
                <span className="text-[10px] uppercase font-bold text-gray-400">Total Earned</span>
                <p className="text-lg font-black text-gray-900 dark:text-white mt-1">₹{(creatorStats.totalEarned / 100).toFixed(2)}</p>
              </div>
              <div className="p-4 rounded-2xl bg-gray-50 dark:bg-slate-800/50">
                <span className="text-[10px] uppercase font-bold text-gray-400">Pending Payout</span>
                <p className="text-lg font-black text-gray-900 dark:text-white mt-1">₹{(creatorStats.pendingWithdrawal / 100).toFixed(2)}</p>
              </div>
              <div className="p-4 rounded-2xl bg-gray-50 dark:bg-slate-800/50">
                <span className="text-[10px] uppercase font-bold text-gray-400">Paid Out</span>
                <p className="text-lg font-black text-gray-900 dark:text-white mt-1">₹{(creatorStats.paidOut / 100).toFixed(2)}</p>
              </div>
              <div className="p-4 rounded-2xl bg-green-50/50 dark:bg-green-950/10 border border-green-100 dark:border-green-900/20">
                <span className="text-[10px] uppercase font-bold text-green-600 dark:text-green-400">Available</span>
                <p className="text-lg font-black text-green-700 dark:text-green-400 mt-1">
                  ₹{((creatorStats.totalEarned - creatorStats.pendingWithdrawal - creatorStats.paidOut) / 100).toFixed(2)}
                </p>
              </div>
            </div>

            {/* Payout Form */}
            <div className="p-4 rounded-2xl bg-gray-50 dark:bg-slate-800/50 space-y-4">
              <h3 className="text-xs font-bold text-gray-700 dark:text-slate-300">Request Payout (Min. ₹500)</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  type="text"
                  placeholder="UPI ID (e.g. user@ybl)"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs focus:outline-none dark:border-slate-850 dark:bg-slate-800 dark:text-white focus:border-[#FF6B6B]"
                />
                <input
                  type="number"
                  placeholder="Amount in ₹ (e.g. 500)"
                  value={payoutAmount}
                  onChange={(e) => setPayoutAmount(e.target.value)}
                  className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs focus:outline-none dark:border-slate-850 dark:bg-slate-800 dark:text-white focus:border-[#FF6B6B]"
                />
              </div>
              <button
                type="button"
                onClick={handleRequestPayout}
                disabled={requestingPayout || !upiId.trim() || !payoutAmount}
                className="w-full rounded-xl bg-[#FF6B6B] text-white px-4 py-2.5 text-xs font-bold transition-all hover:opacity-90 disabled:opacity-50"
              >
                {requestingPayout ? 'Submitting request...' : 'Request Payout 💸'}
              </button>
            </div>

            {/* Sales List */}
            {creatorStats.sales && creatorStats.sales.length > 0 && (
              <div className="mt-6 border-t border-gray-100 dark:border-slate-800 pt-6">
                <h3 className="text-xs font-bold text-gray-700 dark:text-slate-300 mb-3">Recent Sales Transactions</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {creatorStats.sales.map((sale: any) => (
                    <div key={sale.id} className="flex items-center justify-between p-3 rounded-xl border border-gray-100 dark:border-slate-800 text-xs">
                      <div>
                        <p className="font-extrabold text-gray-900 dark:text-white">{sale.themeName}</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">{new Date(sale.createdAt).toLocaleDateString()}</p>
                      </div>
                      <span className="font-bold text-green-600">+₹{(sale.earnings / 100).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Add Link or Product Card */}
          <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm dark:border-slate-850 dark:bg-slate-900">
            <div className="flex gap-4 border-b border-gray-100 dark:border-slate-855 pb-4 mb-4">
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
                  className="flex-1 rounded-2xl border border-gray-250 bg-white px-4 py-2.5 text-sm transition-all focus:border-[#FF6B6B] focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]/20 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                  placeholder={isProduct === 1 ? 'Product Name (e.g. Anime Figurine)' : 'Link Title (e.g. My Website)'}
                />
                <input
                  type="url"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  className="flex-1 rounded-2xl border border-gray-250 bg-white px-4 py-2.5 text-sm transition-all focus:border-[#FF6B6B] focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]/20 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
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
                      className="mt-1.5 w-full rounded-xl border border-gray-255 bg-white px-3 py-2 text-xs focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                      placeholder="e.g. $49"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 dark:text-slate-400">Discount Tag (e.g. 10% OFF)</label>
                    <input
                      type="text"
                      value={discount}
                      onChange={(e) => setDiscount(e.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-gray-255 bg-white px-3 py-2 text-xs focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                      placeholder="e.g. 20% OFF"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-gray-600 dark:text-slate-400">Product Category (e.g. Clothing, Tech)</label>
                    <input
                      type="text"
                      value={productCategory}
                      onChange={(e) => setProductCategory(e.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-gray-255 bg-white px-3 py-2 text-xs focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                      placeholder="e.g. Tech Accessories"
                    />
                  </div>

                  <div className="sm:col-span-2 border-t border-gray-200/60 dark:border-slate-800 pt-3 space-y-2">
                    <label className="block text-xs font-bold text-gray-600 dark:text-slate-400">Product Image</label>
                    <div className="flex flex-col gap-2">
                      <input
                        type="url"
                        value={productImage}
                        onChange={(e) => setProductImage(e.target.value)}
                        className="w-full rounded-xl border border-gray-255 bg-white px-3.5 py-1.5 text-xs focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
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
                          className="rounded-xl border border-gray-250 bg-white px-4 py-2 text-xs font-bold text-gray-750 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-355"
                        >
                          {uploadingProd ? 'Uploading...' : 'Or Upload Local File'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Scheduling and sensitive settings */}
              <div className="grid gap-4 sm:grid-cols-3 p-4 rounded-2xl bg-gray-55 dark:bg-slate-850/40 border border-gray-200 dark:border-slate-800">
                <div>
                  <label className="block text-xs font-bold text-gray-650 dark:text-slate-400">18+ Sensitive Warning</label>
                  <select
                    value={isSensitive}
                    onChange={(e) => setIsSensitive(Number(e.target.value))}
                    className="mt-1.5 w-full rounded-xl border border-gray-250 bg-white px-3 py-2 text-xs focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white font-bold"
                  >
                    <option value={0}>Auto-Detect (OnlyFans, Fansly, etc.)</option>
                    <option value={1}>Always Show 18+ Warning</option>
                    <option value={-1}>Bypass Warning</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-655 dark:text-slate-400">Start Schedule (Optional)</label>
                  <input
                    type="datetime-local"
                    value={scheduledStart}
                    onChange={(e) => setScheduledStart(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-gray-250 bg-white px-3 py-1.5 text-xs focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-655 dark:text-slate-400">End Schedule (Optional)</label>
                  <input
                    type="datetime-local"
                    value={scheduledEnd}
                    onChange={(e) => setScheduledEnd(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-gray-250 bg-white px-3 py-1.5 text-xs focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <button
                onClick={handleAddLink}
                disabled={saving || !newTitle.trim() || !newUrl.trim() || (isProduct === 1 && uploadingProd)}
                className="w-full rounded-2xl bg-gradient-to-r from-[#FF6B6B] to-[#EE5A24] py-3 text-sm font-semibold text-white shadow-md shadow-[#FF6B6B]/20 transition-all hover:brightness-110 disabled:opacity-60"
              >
                Add {isProduct === 1 ? 'Product Card' : 'Link'}
              </button>
            </div>
          </div>

          {/* Links list with Drag and Drop */}
          <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm dark:border-slate-850 dark:bg-slate-900">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Your links ({linksList.length})
            </h2>
            <p className="text-xs text-gray-550 mb-4">Drag and drop the cards below to reorder them instantly.</p>
            
            <div className="mt-4 space-y-3">
              {linksList.length === 0 && (
                <p className="py-8 text-center text-sm text-gray-400 dark:text-slate-500">
                  No links yet. Add your first link above!
                </p>
              )}
              {linksList.map((link, index) => (
                <div
                  key={link.id}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                  className={`cursor-grab active:cursor-grabbing transition-transform duration-150 ${
                    draggedIdx === index ? 'opacity-40 scale-95 border-dashed border-2 border-purple-500' : ''
                  }`}
                >
                  <LinkCard
                    link={link}
                    onUpdate={handleUpdateLink}
                    onDelete={handleDeleteLink}
                    onMoveUp={handleMoveUp}
                    onMoveDown={handleMoveDown}
                    isFirst={index === 0}
                    isLast={index === linksList.length - 1}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Visitor Analytics Panel */}
          <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm dark:border-slate-850 dark:bg-slate-900">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Visitor Analytics 📊</h2>
            <p className="text-xs text-gray-500 mb-6">Real-time traffic analysis, referrer sources, and visitor devices.</p>

            {/* Total count summaries */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="p-4 rounded-2xl bg-gray-50 dark:bg-slate-800/40">
                <span className="text-[10px] uppercase font-bold text-gray-400">Profile Views</span>
                <p className="text-xl font-black text-gray-900 dark:text-white mt-1">
                  {profileClickLogs.filter(l => l.targetType === 'view').length}
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-gray-55 dark:bg-slate-800/40">
                <span className="text-[10px] uppercase font-bold text-gray-400">Link Clicks</span>
                <p className="text-xl font-black text-gray-900 dark:text-white mt-1">
                  {profileClickLogs.filter(l => l.targetType === 'click').length}
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-gray-55 dark:bg-slate-800/40">
                <span className="text-[10px] uppercase font-bold text-gray-400">Click-Through</span>
                <p className="text-xl font-black text-gray-900 dark:text-white mt-1">
                  {(() => {
                    const views = profileClickLogs.filter(l => l.targetType === 'view').length;
                    const clicks = profileClickLogs.filter(l => l.targetType === 'click').length;
                    if (views === 0) return '0.0%';
                    return `${((clicks / views) * 100).toFixed(1)}%`;
                  })()}
                </p>
              </div>
            </div>

            {/* Traffic Sources Breakdown */}
            <div className="space-y-6">
              <div>
                <h3 className="text-xs font-extrabold text-gray-700 dark:text-slate-350 uppercase mb-3">Top Traffic Sources</h3>
                <div className="space-y-2">
                  {(() => {
                    const referrers: Record<string, number> = {};
                    profileClickLogs.forEach(l => {
                      const ref = l.referrer || 'direct';
                      referrers[ref] = (referrers[ref] || 0) + 1;
                    });
                    const sorted = Object.entries(referrers).sort((a, b) => b[1] - a[1]).slice(0, 5);
                    const total = profileClickLogs.length || 1;

                    return sorted.map(([ref, count]) => {
                      const pct = Math.round((count / total) * 100);
                      return (
                        <div key={ref} className="space-y-1">
                          <div className="flex justify-between text-xs font-bold text-gray-650 dark:text-slate-400">
                            <span>{ref === 'direct' ? 'Direct / Search' : ref}</span>
                            <span>{count} ({pct}%)</span>
                          </div>
                          <div className="h-2 w-full rounded-full bg-gray-100 dark:bg-slate-800">
                            <div className="h-full rounded-full bg-[#FF6B6B]" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>

              {/* Device and Browser Breakdown */}
              <div className="grid gap-6 sm:grid-cols-2 pt-4 border-t border-gray-100 dark:border-slate-800">
                <div>
                  <h4 className="text-xs font-extrabold text-gray-750 dark:text-slate-350 uppercase mb-3">Devices</h4>
                  <div className="space-y-2">
                    {(() => {
                      const devices: Record<string, number> = {};
                      profileClickLogs.forEach(l => {
                        const dev = l.device || 'desktop';
                        devices[dev] = (devices[dev] || 0) + 1;
                      });
                      const total = profileClickLogs.length || 1;
                      return Object.entries(devices).map(([dev, count]) => {
                        const pct = Math.round((count / total) * 100);
                        return (
                          <div key={dev} className="flex items-center justify-between text-xs font-bold text-gray-650 dark:text-slate-400">
                            <span className="capitalize">{dev}</span>
                            <span>{pct}%</span>
                          </div>
                        );
                      });
                    })()}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-extrabold text-gray-750 dark:text-slate-355 uppercase mb-3">Browsers</h4>
                  <div className="space-y-2">
                    {(() => {
                      const browsers: Record<string, number> = {};
                      profileClickLogs.forEach(l => {
                        const br = l.browser || 'chrome';
                        browsers[br] = (browsers[br] || 0) + 1;
                      });
                      const total = profileClickLogs.length || 1;
                      return Object.entries(browsers).sort((a,b)=>b[1]-a[1]).slice(0, 3).map(([br, count]) => {
                        const pct = Math.round((count / total) * 100);
                        return (
                          <div key={br} className="flex items-center justify-between text-xs font-bold text-gray-650 dark:text-slate-400">
                            <span className="capitalize">{br}</span>
                            <span>{pct}%</span>
                          </div>
                        );
                      });
                    })()}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Announcement Banner Settings */}
          <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm dark:border-slate-850 dark:bg-slate-900">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Announcement Banner 📢</h2>
            <p className="text-xs text-gray-500 mb-6">Display a prominent flashing announcement bar at the top of your page.</p>

            <div className="space-y-4">
              <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-bold text-gray-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={announcementActive}
                  onChange={(e) => setAnnouncementActive(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-[#FF6B6B] focus:ring-[#FF6B6B]"
                />
                <span>Active Banner</span>
              </label>

              <div>
                <label className="block text-xs font-bold text-gray-650 dark:text-slate-400 mb-1">Banner Text</label>
                <input
                  type="text"
                  value={announcementText}
                  onChange={(e) => setAnnouncementText(e.target.value)}
                  placeholder="e.g. 🔥 New Merchandise available now! Get 20% OFF!"
                  className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-xs focus:outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-650 dark:text-slate-400 mb-1">Banner Link (Optional Redirect URL)</label>
                <input
                  type="url"
                  value={announcementLink}
                  onChange={(e) => setAnnouncementLink(e.target.value)}
                  placeholder="https://..."
                  className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-xs focus:outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-655 dark:text-slate-400 mb-2">Banner Color</label>
                <div className="flex gap-2">
                  {['#FF6B6B', '#3498db', '#2ecc71', '#f1c40f', '#9b59b6'].map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setAnnouncementColor(color)}
                      className={`h-7 w-7 rounded-full transition-transform ${
                        announcementColor === color ? 'scale-110 ring-2 ring-[#FF6B6B]/40' : ''
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                  <input
                    type="color"
                    value={announcementColor}
                    onChange={(e) => setAnnouncementColor(e.target.value)}
                    className="h-7 w-7 cursor-pointer border-0 bg-transparent rounded-full"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handleSaveAnnouncement}
                disabled={saving}
                className="w-full rounded-xl bg-black dark:bg-white dark:text-black text-white py-2.5 text-xs font-bold transition-all hover:opacity-90"
              >
                {saving ? 'Saving...' : 'Save Banner Settings 📢'}
              </button>
            </div>
          </div>

          {/* Guestbook preferences & moderation */}
          <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm dark:border-slate-850 dark:bg-slate-900">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Guestbook & Moderation 🎋</h2>
            <p className="text-xs text-gray-500 mb-6">Change your guestbook layout and moderate entries left by visitors.</p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-650 dark:text-slate-400 mb-2">Guestbook Style</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-1.5 cursor-pointer text-xs font-bold text-gray-600 dark:text-slate-400">
                    <input
                      type="radio"
                      name="guestbookStyle"
                      value="tanabata"
                      checked={guestbookStyle === 'tanabata'}
                      onChange={() => setGuestbookStyle('tanabata')}
                      className="text-[#FF6B6B] focus:ring-[#FF6B6B]"
                    />
                    <span>🎋 Tanabata Tree</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer text-xs font-bold text-gray-600 dark:text-slate-400">
                    <input
                      type="radio"
                      name="guestbookStyle"
                      value="classic"
                      checked={guestbookStyle === 'classic'}
                      onChange={() => setGuestbookStyle('classic')}
                      className="text-[#FF6B6B] focus:ring-[#FF6B6B]"
                    />
                    <span>📓 Classic Guestbook</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-650 dark:text-slate-400 mb-1">Guestbook Heading</label>
                <input
                  type="text"
                  value={guestbookHeading}
                  onChange={(e) => setGuestbookHeading(e.target.value)}
                  placeholder="e.g. Leave a wish"
                  className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-xs focus:outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <button
                type="button"
                onClick={handleSaveGuestbook}
                disabled={saving}
                className="w-full rounded-xl bg-black dark:bg-white dark:text-black text-white py-2.5 text-xs font-bold transition-all hover:opacity-90"
              >
                {saving ? 'Saving...' : 'Save Guestbook Settings 🎋'}
              </button>

              {/* Moderate Entries list */}
              <div className="pt-4 border-t border-gray-100 dark:border-slate-800">
                <h3 className="text-xs font-extrabold text-gray-700 dark:text-slate-350 uppercase mb-3">Moderate Wishes ({wishesList.length})</h3>
                {wishesList.length === 0 ? (
                  <p className="text-[11px] text-gray-400 dark:text-slate-500 py-2">No wishes written yet.</p>
                ) : (
                  <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
                    {wishesList.map((wish) => (
                      <div key={wish.id} className="flex items-center justify-between p-3 rounded-xl border border-gray-200 bg-gray-50 dark:border-slate-800 dark:bg-slate-850">
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-gray-800 dark:text-slate-200 truncate">{wish.text}</p>
                          <p className="text-[10px] text-gray-500 mt-0.5">By {wish.sender || 'Anonymous'} &bull; {new Date(wish.createdAt).toLocaleDateString()}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeleteWish(wish.id)}
                          className="rounded-lg p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
                          title="Delete post"
                        >
                          🗑️
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Dynamic Light/Dark Theme & Birthdays */}
          <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm dark:border-slate-850 dark:bg-slate-900">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Dynamic & Birthday Themes 🎂</h2>
            <p className="text-xs text-gray-500 mb-6">Automatically change profile style by time of day (Day/Night) or your Birthday.</p>

            <div className="space-y-4">
              <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-bold text-gray-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={enableDynamicTheme}
                  onChange={(e) => setEnableDynamicTheme(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-[#FF6B6B] focus:ring-[#FF6B6B]"
                />
                <span>Enable Dynamic Light/Dark Theme (Morning/Night cycle)</span>
              </label>

              <div>
                <label className="block text-xs font-bold text-gray-655 dark:text-slate-400 mb-1">Your Birthday (MM-DD format)</label>
                <input
                  type="text"
                  value={birthday}
                  onChange={(e) => setBirthday(e.target.value)}
                  placeholder="e.g. 07-28"
                  className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-xs focus:outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-white font-mono"
                />
                <p className="text-[10px] text-gray-500 dark:text-slate-450 mt-1">
                  On this day, visitors will see a festive birthday confetti shower and a customized celebration card!
                </p>
              </div>

              <button
                type="button"
                onClick={handleSaveDynamicTheme}
                disabled={saving}
                className="w-full rounded-xl bg-black dark:bg-white dark:text-black text-white py-2.5 text-xs font-bold transition-all hover:opacity-90"
              >
                {saving ? 'Saving...' : 'Save Dynamic & Birthday Settings 🎂'}
              </button>
            </div>
          </div>

          {/* Account Settings: Change Email */}
          <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm dark:border-slate-850 dark:bg-slate-900">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Account Settings</h2>
            <p className="text-xs text-gray-500 mb-4">Update your registered email address.</p>
            
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 rounded-2xl border border-gray-250 bg-white px-4 py-2.5 text-sm transition-all focus:border-[#FF6B6B] focus:outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                placeholder="newemail@example.com"
              />
              <button
                onClick={handleEmailChange}
                disabled={saving}
                className="rounded-2xl bg-[#FF6B6B]/10 hover:bg-[#FF6B6B]/20 text-[#FF6B6B] px-6 py-2.5 text-xs font-bold transition-all disabled:opacity-60"
              >
                Update Email
              </button>
            </div>
          </div>

          {/* Danger Zone: Delete Account */}
          <div className="rounded-3xl border border-red-250 bg-red-50/10 p-6 shadow-sm dark:border-red-900/20 dark:bg-red-955/5">
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
                      className="w-full rounded-xl border border-gray-250 bg-gray-55 p-2 text-xs font-mono text-gray-600 select-all focus:outline-none dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300"
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
              username={activeProfile.username}
              bio={bio}
              avatarUrl={avatarUrl}
              links={linksList.map((l) => ({ id: l.id, title: l.title, url: l.url, isProduct: l.isProduct, price: l.price, discount: l.discount, productImage: l.productImage }))}
              themeType={themeType}
              themeBgColor={themeBgColor}
              themeTextColor={themeTextColor}
              themeBgImage={themeBgImage}
              themeButtonStyle={themeButtonStyle}
              themeBackdrop={themeBackdrop}
            />
          </div>
        </div>
      </div>

      {/* Floating Action Button for Mobile Preview */}
      <button
        onClick={() => setShowMobilePreview(true)}
        className="fixed bottom-6 right-6 z-40 lg:hidden flex items-center gap-2 rounded-full bg-gradient-to-r from-[#FF6B6B] to-[#EE5A24] px-5 py-3 font-bold text-white shadow-xl shadow-[#FF6B6B]/25 hover:scale-105 active:scale-95 transition-all duration-200"
      >
        <span>📱</span>
        <span>Preview</span>
      </button>

      {/* Mobile Preview Drawer Modal */}
      {showMobilePreview && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-sm lg:hidden">
          <div className="relative w-full max-h-[90vh] rounded-t-[32px] border-t border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900 p-5 shadow-2xl flex flex-col transition-transform duration-300">
            {/* Header/Close */}
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-bold text-gray-500 dark:text-slate-400">Live Preview</span>
              <button 
                onClick={() => setShowMobilePreview(false)}
                className="rounded-full bg-gray-200 dark:bg-slate-800 px-3 py-1.5 text-xs font-bold text-gray-700 dark:text-slate-300 hover:bg-gray-300 dark:hover:bg-slate-700"
              >
                ✕ Close
              </button>
            </div>
            
            {/* Content area */}
            <div className="overflow-y-auto flex-1 pb-8">
              <ProfilePreview
                username={activeProfile.username}
                bio={bio}
                avatarUrl={avatarUrl}
                links={linksList.map((l) => ({ id: l.id, title: l.title, url: l.url, isProduct: l.isProduct, price: l.price, discount: l.discount, productImage: l.productImage }))}
                themeType={themeType}
                themeBgColor={themeBgColor}
                themeTextColor={themeTextColor}
                themeBgImage={themeBgImage}
                themeButtonStyle={themeButtonStyle}
                themeBackdrop={themeBackdrop}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
