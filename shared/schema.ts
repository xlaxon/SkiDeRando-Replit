import { pgTable, text, serial, integer, json, timestamp, varchar, uniqueIndex } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull(),
  username: varchar("username", { length: 50 }).notNull(),
  password: varchar("password", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  emailIdx: uniqueIndex("email_idx").on(table.email),
  usernameIdx: uniqueIndex("username_idx").on(table.username),
}));

export const spots = pgTable("spots", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  difficulty: text("difficulty").notNull(),
  elevation: integer("elevation").notNull(),
  location: json("location").$type<{lat: number, lng: number}>().notNull(),
  access: text("access").notNull(),
  bestSeason: text("best_season").notNull(),
  images: text("images").array().notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const tripReports = pgTable("trip_reports", {
  id: serial("id").primaryKey(),
  spotId: integer("spot_id").references(() => spots.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  date: timestamp("date").notNull(),
  conditions: text("conditions").notNull(),
  images: text("images").array().notNull(),
  gpxTrack: text("gpx_track"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const favoriteSpots = pgTable("favorite_spots", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  spotId: integer("spot_id").references(() => spots.id).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  uniqueFavorite: uniqueIndex("unique_favorite_idx").on(table.userId, table.spotId),
}));

export const userFollows = pgTable("user_follows", {
  id: serial("id").primaryKey(),
  followerId: integer("follower_id").references(() => users.id).notNull(),
  followedId: integer("followed_id").references(() => users.id).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  uniqueFollow: uniqueIndex("unique_follow_idx").on(table.followerId, table.followedId),
}));

// Custom schema for trip reports that handles ISO date strings
export const insertTripReportSchema = createInsertSchema(tripReports, {
  date: z.string().transform((str) => new Date(str)),
}).omit({ id: true, createdAt: true });

export const insertSpotSchema = createInsertSchema(spots).omit({ id: true, createdAt: true });

// User schemas with validation
export const insertUserSchema = createInsertSchema(users, {
  email: z.string().email("Invalid email address"),
  username: z.string().min(3).max(50).regex(/^[a-zA-Z0-9_-]+$/, "Username can only contain letters, numbers, underscores and dashes"),
  password: z.string().min(8, "Password must be at least 8 characters"),
}).omit({ id: true, createdAt: true });

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string(),
  captchaToken: z.string(),
});

// Types
export type InsertSpot = z.infer<typeof insertSpotSchema>;
export type InsertTripReport = z.infer<typeof insertTripReportSchema>;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Spot = typeof spots.$inferSelect;
export type TripReport = typeof tripReports.$inferSelect;
export type User = typeof users.$inferSelect;
export type UserFollow = typeof userFollows.$inferSelect;
export type FavoriteSpot = typeof favoriteSpots.$inferSelect;