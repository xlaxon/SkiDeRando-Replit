import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { insertSpotSchema, insertTripReportSchema } from "@shared/schema";

export async function registerRoutes(app: Express) {
  app.get("/api/spots", async (_req, res) => {
    const spots = await storage.getSpots();
    res.json(spots);
  });

  app.get("/api/spots/:id", async (req, res) => {
    const spot = await storage.getSpot(parseInt(req.params.id));
    if (!spot) {
      return res.status(404).json({ message: "Spot not found" });
    }
    res.json(spot);
  });

  app.post("/api/spots", async (req, res) => {
    const result = insertSpotSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ errors: result.error.errors });
    }
    const spot = await storage.createSpot(result.data);
    res.status(201).json(spot);
  });

  app.get("/api/spots/:id/reports", async (req, res) => {
    const reports = await storage.getTripReports(parseInt(req.params.id));
    res.json(reports);
  });

  app.post("/api/spots/:id/reports", async (req, res) => {
    const result = insertTripReportSchema.safeParse({
      ...req.body,
      spotId: parseInt(req.params.id),
    });
    if (!result.success) {
      return res.status(400).json({ errors: result.error.errors });
    }
    const report = await storage.createTripReport(result.data);
    res.status(201).json(report);
  });

  return createServer(app);
}
