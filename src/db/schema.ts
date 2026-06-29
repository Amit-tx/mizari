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
    username: varchar('username', { length: 64 }).notNull().unique(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    passwordHash: text('password_hash'),
    bio: text('bio').default(''),
    avatarUrl: text('avatar_url').default(''),
    themeType: varchar('theme_type', { length: 20 }).default('light').notNull(), // 'light', 'dark', 'custom'
    themeBgColor: varchar('theme_bg_color', { length: 30 }).default('#fafafa').notNull(),
    themeTextColor: varchar('theme_text_color', { length: 30 }).default('#1a1a2e').notNull(),
    themeBgImage: text('theme_bg_image').default(''),
    themeButtonStyle: varchar('theme_button_style', { length: 30 }).default('rounded-xl').notNull(), // 'rounded-xl', 'rounded-full', 'rounded-none', 'shadow'
    deleteToken: varchar('delete_token', { length: 255 }),
    deleteTokenExpiresAt: timestamp('delete_token_expires_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
);

export const links = pgTable('links', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 255 }).notNull(),
  url: text('url').notNull(),
  icon: text('icon'),
  order: integer('order').default(0).notNull(),
  clicks: integer('clicks').default(0).notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  links: many(links),
}));

export const linksRelations = relations(links, ({ one }) => ({
  user: one(users, {
    fields: [links.userId],
    references: [users.id],
  }),
}));

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Link = typeof links.$inferSelect;
export type NewLink = typeof links.$inferInsert;
