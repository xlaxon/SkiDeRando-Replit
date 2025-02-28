import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { insertSpotSchema, insertTripReportSchema } from "@shared/schema";
import { sessionMiddleware, register, login, logout, getCurrentUser, requireAuth } from "./auth";

export async function registerRoutes(app: Express) {
  // Session middleware
  app.use(sessionMiddleware);

  // Auth routes
  app.post("/api/auth/register", register);
  app.post("/api/auth/login", login);
  app.post("/api/auth/logout", logout);
  app.get("/api/auth/me", getCurrentUser);

  // Protected routes
  app.post("/api/spots", requireAuth, async (req, res) => {
    const result = insertSpotSchema.safeParse({ ...req.body, userId: req.session.userId });
    if (!result.success) {
      return res.status(400).json({ errors: result.error.errors });
    }
    const spot = await storage.createSpot(result.data);
    res.status(201).json(spot);
  });

  app.post("/api/spots/:id/reports", requireAuth, async (req, res) => {
    const result = insertTripReportSchema.safeParse({
      ...req.body,
      spotId: parseInt(req.params.id),
      userId: req.session.userId,
    });
    if (!result.success) {
      return res.status(400).json({ errors: result.error.errors });
    }
    const report = await storage.createTripReport(result.data);
    res.status(201).json(report);
  });

  // Public routes
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

  app.get("/api/spots/:id/reports", async (req, res) => {
    const reports = await storage.getTripReports(parseInt(req.params.id));
    res.json(reports);
  });

  // User profile routes
  app.get("/api/users/:username", async (req, res) => {
    const user = await storage.getUserByUsername(req.params.username);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  });

  app.get("/api/users/:username/spots", async (req, res) => {
    const spots = await storage.getUserSpots(req.params.username);
    res.json(spots);
  });

  app.get("/api/users/:username/reports", async (req, res) => {
    const reports = await storage.getUserReports(req.params.username);
    res.json(reports);
  });

  // Favorites
  app.post("/api/spots/:id/favorite", requireAuth, async (req, res) => {
    const favorite = await storage.addFavoriteSpot(req.session.userId!, parseInt(req.params.id));
    res.status(201).json(favorite);
  });

  app.delete("/api/spots/:id/favorite", requireAuth, async (req, res) => {
    await storage.removeFavoriteSpot(req.session.userId!, parseInt(req.params.id));
    res.status(204).send();
  });

  app.get("/api/users/:username/favorites", async (req, res) => {
    const favorites = await storage.getUserFavorites(req.params.username);
    res.json(favorites);
  });

  // Following
  app.post("/api/users/:username/follow", requireAuth, async (req, res) => {
    const follow = await storage.followUser(req.session.userId!, req.params.username);
    res.status(201).json(follow);
  });

  app.delete("/api/users/:username/follow", requireAuth, async (req, res) => {
    await storage.unfollowUser(req.session.userId!, req.params.username);
    res.status(204).send();
  });

  app.get("/api/users/:username/following", async (req, res) => {
    const following = await storage.getUserFollowing(req.params.username);
    res.json(following);
  });

  app.get("/api/users/:username/followers", async (req, res) => {
    const followers = await storage.getUserFollowers(req.params.username);
    res.json(followers);
  });

  return createServer(app);
}