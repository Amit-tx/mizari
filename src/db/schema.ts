import {
  pgTable,
  serial,
  varchar,
  text,
  integer,
  timestamp,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const users = pgTable(
  'users',
  {
    id: serial('id').primaryKey(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    passwordHash: text('password_hash'),
    deleteToken: varchar('delete_token', { length: 255 }),
    deleteTokenExpiresAt: timestamp('delete_token_expires_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
);

export const profiles = pgTable(
  'profiles',
  {
    id: serial('id').primaryKey(),
    userId: integer('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    username: varchar('username', { length: 64 }).notNull().unique(),
    profileType: varchar('profile_type', { length: 30 }).default('personal').notNull(), // 'personal', 'business', 'gaming'
    bio: text('bio').default(''),
    avatarUrl: text('avatar_url').default(''),
    themeType: varchar('theme_type', { length: 30 }).default('light').notNull(),
    themeBgColor: varchar('theme_bg_color', { length: 30 }).default('#fafafa').notNull(),
    themeTextColor: varchar('theme_text_color', { length: 30 }).default('#1a1a2e').notNull(),
    themeBgImage: text('theme_bg_image').default(''),
    themeButtonStyle: varchar('theme_button_style', { length: 30 }).default('rounded-xl').notNull(),
    themeBackdrop: varchar('theme_backdrop', { length: 30 }).default('glass-light').notNull(),
    themeRotateInterval: varchar('theme_rotate_interval', { length: 20 }).default('none').notNull(),
    lastThemeRotatedAt: timestamp('last_theme_rotated_at', { withTimezone: true }),
    likes: integer('likes').default(0).notNull(), // Reactions count
    showWishes: integer('show_wishes').default(1).notNull(), // 1 = enabled, 0 = disabled
    views: integer('views').default(0).notNull(),
    referrals: integer('referrals').default(0).notNull(),
    dailyActiveDays: integer('daily_active_days').default(0).notNull(),
    lastActiveAt: timestamp('last_active_at', { withTimezone: true }),
    xp: integer('xp').default(0).notNull(),
    prestige: integer('prestige').default(0).notNull(),
    guestbookStyle: varchar('guestbook_style', { length: 30 }).default('tanabata').notNull(),
    guestbookHeading: varchar('guestbook_heading', { length: 100 }).default('Guestbook').notNull(),
    reactionLike: integer('reaction_like').default(0).notNull(),
    reactionLove: integer('reaction_love').default(0).notNull(),
    reactionHaha: integer('reaction_haha').default(0).notNull(),
    reactionWow: integer('reaction_wow').default(0).notNull(),
    reactionSad: integer('reaction_sad').default(0).notNull(),
    reactionFire: integer('reaction_fire').default(0).notNull(),
    announcementText: text('announcement_text').default(''),
    announcementLink: text('announcement_link').default(''),
    announcementActive: integer('announcement_active').default(0).notNull(),
    announcementColor: varchar('announcement_color', { length: 30 }).default('#FF6B6B').notNull(),
    birthday: varchar('birthday', { length: 10 }).default('').notNull(),
    enableDynamicTheme: integer('enable_dynamic_theme').default(0).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  }
);

export const links = pgTable('links', {
  id: serial('id').primaryKey(),
  profileId: integer('profile_id')
    .notNull()
    .references(() => profiles.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 255 }).notNull(),
  url: text('url').notNull(),
  icon: text('icon'),
  order: integer('order').default(0).notNull(),
  clicks: integer('clicks').default(0).notNull(),
  isProduct: integer('is_product').default(0).notNull(), // 0 = standard, 1 = product
  price: varchar('price', { length: 30 }).default(''),
  discount: varchar('discount', { length: 30 }).default(''),
  productImage: text('product_image').default(''),
  scheduledStart: timestamp('scheduled_start', { withTimezone: true }),
  scheduledEnd: timestamp('scheduled_end', { withTimezone: true }),
  productCategory: varchar('product_category', { length: 100 }).default('').notNull(),
  isSensitive: integer('is_sensitive').default(0).notNull(),
});

export const wishes = pgTable('wishes', {
  id: serial('id').primaryKey(),
  profileId: integer('profile_id')
    .notNull()
    .references(() => profiles.id, { onDelete: 'cascade' }),
  sender: varchar('sender', { length: 100 }).default('Anonymous').notNull(),
  text: text('text').notNull(),
  color: varchar('color', { length: 20 }).default('#FFD6E0').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const themePurchases = pgTable('theme_purchases', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  themeId: varchar('theme_id', { length: 64 }).notNull(),
  pricePaid: integer('price_paid').default(0).notNull(), // in paise (₹49 = 4900)
  orderId: varchar('order_id', { length: 128 }),         // Razorpay order ID
  paymentId: varchar('payment_id', { length: 128 }),     // Razorpay payment ID
  status: varchar('status', { length: 20 }).default('pending').notNull(), // pending | paid
  purchasedAt: timestamp('purchased_at', { withTimezone: true }).defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  profiles: many(profiles),
  themePurchases: many(themePurchases),
}));

export const profilesRelations = relations(profiles, ({ one, many }) => ({
  user: one(users, {
    fields: [profiles.userId],
    references: [users.id],
  }),
  links: many(links),
  wishes: many(wishes),
}));

export const linksRelations = relations(links, ({ one }) => ({
  profile: one(profiles, {
    fields: [links.profileId],
    references: [profiles.id],
  }),
}));

export const wishesRelations = relations(wishes, ({ one }) => ({
  profile: one(profiles, {
    fields: [wishes.profileId],
    references: [profiles.id],
  }),
}));

export const themePurchasesRelations = relations(themePurchases, ({ one }) => ({
  user: one(users, {
    fields: [themePurchases.userId],
    references: [users.id],
  }),
}));

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Profile = typeof profiles.$inferSelect;
export type NewProfile = typeof profiles.$inferInsert;
export type Link = typeof links.$inferSelect;
export type NewLink = typeof links.$inferInsert;
export type Wish = typeof wishes.$inferSelect;
export type NewWish = typeof wishes.$inferInsert;
export type ThemePurchase = typeof themePurchases.$inferSelect;

export const marketplaceThemes = pgTable('marketplace_themes', {
  id: serial('id').primaryKey(),
  creatorId: integer('creator_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 128 }).notNull(),
  price: integer('price').default(49).notNull(), // In INR (e.g. 49, 99)
  bgColor: varchar('bg_color', { length: 30 }).default('#fafafa').notNull(),
  textColor: varchar('text_color', { length: 30 }).default('#1a1a2e').notNull(),
  bgImage: text('bg_image').default(''),
  buttonStyle: varchar('button_style', { length: 30 }).default('rounded-xl').notNull(),
  backdropStyle: varchar('backdrop_style', { length: 30 }).default('glass-light').notNull(),
  status: varchar('status', { length: 20 }).default('active').notNull(), // active | pending | rejected
  salesCount: integer('sales_count').default(0).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const marketplaceTransactions = pgTable('marketplace_transactions', {
  id: serial('id').primaryKey(),
  themeId: integer('theme_id')
    .notNull()
    .references(() => marketplaceThemes.id, { onDelete: 'cascade' }),
  buyerId: integer('buyer_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  orderId: varchar('order_id', { length: 128 }),
  totalAmount: integer('total_amount').default(0).notNull(),     // in paise (e.g. 4900)
  creatorEarnings: integer('creator_earnings').default(0).notNull(), // 85% share (in paise)
  platformFee: integer('platform_fee').default(0).notNull(),         // 15% share (in paise)
  status: varchar('status', { length: 20 }).default('pending').notNull(), // pending | paid
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const creatorBalances = pgTable('creator_balances', {
  userId: integer('user_id')
    .primaryKey()
    .references(() => users.id, { onDelete: 'cascade' }),
  totalEarned: integer('total_earned').default(0).notNull(),       // in paise
  pendingWithdrawal: integer('pending_withdrawal').default(0).notNull(), // in paise
  paidOut: integer('paid_out').default(0).notNull(),               // in paise
  upiId: varchar('upi_id', { length: 128 }).default(''),
});

// Relations
export const marketplaceThemesRelations = relations(marketplaceThemes, ({ one }) => ({
  creator: one(users, {
    fields: [marketplaceThemes.creatorId],
    references: [users.id],
  }),
}));

export const marketplaceTransactionsRelations = relations(marketplaceTransactions, ({ one }) => ({
  theme: one(marketplaceThemes, {
    fields: [marketplaceTransactions.themeId],
    references: [marketplaceThemes.id],
  }),
  buyer: one(users, {
    fields: [marketplaceTransactions.buyerId],
    references: [users.id],
  }),
}));

export const creatorBalancesRelations = relations(creatorBalances, ({ one }) => ({
  user: one(users, {
    fields: [creatorBalances.userId],
    references: [users.id],
  }),
}));

export type MarketplaceTheme = typeof marketplaceThemes.$inferSelect;
export type NewMarketplaceTheme = typeof marketplaceThemes.$inferInsert;
export type MarketplaceTransaction = typeof marketplaceTransactions.$inferSelect;
export type CreatorBalance = typeof creatorBalances.$inferSelect;

export const clickLogs = pgTable('click_logs', {
  id: serial('id').primaryKey(),
  visitorIp: varchar('visitor_ip', { length: 128 }).notNull(),
  targetId: integer('target_id').notNull(), // linkId for clicks, profileId for views
  targetType: varchar('target_type', { length: 20 }).notNull(), // 'click' | 'view'
  referrer: varchar('referrer', { length: 255 }).default('direct').notNull(),
  device: varchar('device', { length: 50 }).default('desktop').notNull(),
  browser: varchar('browser', { length: 50 }).default('unknown').notNull(),
  country: varchar('country', { length: 50 }).default('unknown').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export type ClickLog = typeof clickLogs.$inferSelect;
export type NewClickLog = typeof clickLogs.$inferInsert;

// Tracks each visitor's single active reaction per profile, keyed by a
// hashed IP (same hashing approach as clickLogs). This is the source of
// truth the server checks before adjusting reaction counters — the client
// can no longer just claim "my old reaction was X" and get counters
// incremented for free every time localStorage is cleared or a different
// device/browser is used.
export const profileReactions = pgTable('profile_reactions', {
  id: serial('id').primaryKey(),
  profileId: integer('profile_id').notNull(),
  visitorHash: varchar('visitor_hash', { length: 64 }).notNull(),
  reactionType: varchar('reaction_type', { length: 20 }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export type ProfileReaction = typeof profileReactions.$inferSelect;
export type NewProfileReaction = typeof profileReactions.$inferInsert;

