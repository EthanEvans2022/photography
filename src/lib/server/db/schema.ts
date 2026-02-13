import { pgTable, text, timestamp, boolean, jsonb, primaryKey } from 'drizzle-orm/pg-core';

// ============================================================
// Users & Sessions
// ============================================================

export const user = pgTable('user', {
	id: text('id').primaryKey(),
	username: text('username').notNull().unique(),
	passwordHash: text('password_hash').notNull(),
	displayName: text('display_name').notNull(),
	email: text('email').notNull().unique(),
	avatarUrl: text('avatar_url')
});

export const session = pgTable('session', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'date' }).notNull()
});

// ============================================================
// Photos
// ============================================================

export const photo = pgTable('photo', {
	id: text('id').primaryKey(),
	ownerId: text('owner_id')
		.notNull()
		.references(() => user.id),
	src: text('src').notNull(),
	favorite: boolean('favorite').notNull().default(false),
	visibility: text('visibility', { enum: ['public', 'shared', 'private'] })
		.notNull()
		.default('private'),
	tags: jsonb('tags').$type<string[]>().notNull().default([]),
	people: jsonb('people').$type<string[]>().notNull().default([]),
	metadata: jsonb('metadata')
		.$type<{
			datetime: string;
			location?: { longitude: number; latitude: number };
		}>()
		.notNull(),
	deletedAt: timestamp('deleted_at', { withTimezone: true, mode: 'date' }),
	createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow()
});

// ============================================================
// Albums
// ============================================================

export const album = pgTable('album', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	ownerId: text('owner_id')
		.notNull()
		.references(() => user.id),
	coverPhotoId: text('cover_photo_id').references(() => photo.id),
	visibility: text('visibility', { enum: ['public', 'shared', 'private'] })
		.notNull()
		.default('private'),
	createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow()
});

export const albumPhoto = pgTable(
	'album_photo',
	{
		albumId: text('album_id')
			.notNull()
			.references(() => album.id, { onDelete: 'cascade' }),
		photoId: text('photo_id')
			.notNull()
			.references(() => photo.id, { onDelete: 'cascade' })
	},
	(table) => [primaryKey({ columns: [table.albumId, table.photoId] })]
);

// ============================================================
// Inferred types
// ============================================================

export type Session = typeof session.$inferSelect;
export type User = typeof user.$inferSelect;
export type Photo = typeof photo.$inferSelect;
export type Album = typeof album.$inferSelect;
export type AlbumPhoto = typeof albumPhoto.$inferSelect;
