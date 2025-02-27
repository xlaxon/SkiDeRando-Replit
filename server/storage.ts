import { type Spot, type InsertSpot, type TripReport, type InsertTripReport, spots, tripReports } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getSpots(): Promise<Spot[]>;
  getSpot(id: number): Promise<Spot | undefined>;
  createSpot(spot: InsertSpot): Promise<Spot>;
  getTripReports(spotId: number): Promise<TripReport[]>;
  createTripReport(report: InsertTripReport): Promise<TripReport>;
}

export class DatabaseStorage implements IStorage {
  async getSpots(): Promise<Spot[]> {
    return await db.select().from(spots);
  }

  async getSpot(id: number): Promise<Spot | undefined> {
    const [spot] = await db.select().from(spots).where(eq(spots.id, id));
    return spot;
  }

  async createSpot(spot: InsertSpot): Promise<Spot> {
    const [created] = await db.insert(spots).values(spot).returning();
    return created;
  }

  async getTripReports(spotId: number): Promise<TripReport[]> {
    return await db.select().from(tripReports).where(eq(tripReports.spotId, spotId));
  }

  async createTripReport(report: InsertTripReport): Promise<TripReport> {
    const [created] = await db.insert(tripReports).values(report).returning();
    return created;
  }
}

export const storage = new DatabaseStorage();