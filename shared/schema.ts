import { pgTable, text, serial, integer, json, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

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
});

export const tripReports = pgTable("trip_reports", {
  id: serial("id").primaryKey(),
  spotId: integer("spot_id").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  date: timestamp("date").notNull(),
  conditions: text("conditions").notNull(),
  images: text("images").array().notNull(),
  gpxTrack: text("gpx_track"),
});

// Custom schema for trip reports that handles ISO date strings
export const insertTripReportSchema = createInsertSchema(tripReports, {
  date: z.string().transform((str) => new Date(str)),
}).omit({ id: true });

export const insertSpotSchema = createInsertSchema(spots).omit({ id: true });

export type InsertSpot = z.infer<typeof insertSpotSchema>;
export type InsertTripReport = z.infer<typeof insertTripReportSchema>;
export type Spot = typeof spots.$inferSelect;
export type TripReport = typeof tripReports.$inferSelect;