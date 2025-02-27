import { type Spot, type InsertSpot, type TripReport, type InsertTripReport } from "@shared/schema";

export interface IStorage {
  getSpots(): Promise<Spot[]>;
  getSpot(id: number): Promise<Spot | undefined>;
  createSpot(spot: InsertSpot): Promise<Spot>;
  getTripReports(spotId: number): Promise<TripReport[]>;
  createTripReport(report: InsertTripReport): Promise<TripReport>;
}

export class MemStorage implements IStorage {
  private spots: Map<number, Spot>;
  private tripReports: Map<number, TripReport>;
  private spotId: number;
  private reportId: number;

  constructor() {
    this.spots = new Map();
    this.tripReports = new Map();
    this.spotId = 1;
    this.reportId = 1;
  }

  async getSpots(): Promise<Spot[]> {
    return Array.from(this.spots.values());
  }

  async getSpot(id: number): Promise<Spot | undefined> {
    return this.spots.get(id);
  }

  async createSpot(insertSpot: InsertSpot): Promise<Spot> {
    const id = this.spotId++;
    const spot: Spot = { ...insertSpot, id };
    this.spots.set(id, spot);
    return spot;
  }

  async getTripReports(spotId: number): Promise<TripReport[]> {
    return Array.from(this.tripReports.values()).filter(
      (report) => report.spotId === spotId
    );
  }

  async createTripReport(insertReport: InsertTripReport): Promise<TripReport> {
    const id = this.reportId++;
    const report: TripReport = { ...insertReport, id };
    this.tripReports.set(id, report);
    return report;
  }
}

export const storage = new MemStorage();
