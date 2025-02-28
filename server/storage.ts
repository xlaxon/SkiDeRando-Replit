import { type Spot, type InsertSpot, type TripReport, type InsertTripReport, type User, type FavoriteSpot, type UserFollow, spots, tripReports, users, favoriteSpots, userFollows } from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";

export interface IStorage {
  getSpots(): Promise<Spot[]>;
  getSpot(id: number): Promise<Spot | undefined>;
  createSpot(spot: InsertSpot): Promise<Spot>;
  getTripReports(spotId: number): Promise<TripReport[]>;
  createTripReport(report: InsertTripReport): Promise<TripReport>;

  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<Omit<User, "password"> | undefined>;
  getUserSpots(username: string): Promise<Spot[]>;
  getUserReports(username: string): Promise<TripReport[]>;

  // Favorites
  addFavoriteSpot(userId: number, spotId: number): Promise<FavoriteSpot>;
  removeFavoriteSpot(userId: number, spotId: number): Promise<void>;
  getUserFavorites(username: string): Promise<Spot[]>;

  // Following
  followUser(followerId: number, username: string): Promise<UserFollow>;
  unfollowUser(followerId: number, username: string): Promise<void>;
  getUserFollowing(username: string): Promise<Omit<User, "password">[]>;
  getUserFollowers(username: string): Promise<Omit<User, "password">[]>;
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

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<Omit<User, "password"> | undefined> {
    const [user] = await db
      .select({
        id: users.id,
        email: users.email,
        username: users.username,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(eq(users.username, username));
    return user;
  }

  async getUserSpots(username: string): Promise<Spot[]> {
    const userSpots = await db
      .select({
        spot: spots
      })
      .from(spots)
      .innerJoin(users, eq(spots.userId, users.id))
      .where(eq(users.username, username));
    return userSpots.map(({ spot }) => spot);
  }

  async getUserReports(username: string): Promise<TripReport[]> {
    const userReports = await db
      .select({
        report: tripReports
      })
      .from(tripReports)
      .innerJoin(users, eq(tripReports.userId, users.id))
      .where(eq(users.username, username));
    return userReports.map(({ report }) => report);
  }

  async addFavoriteSpot(userId: number, spotId: number): Promise<FavoriteSpot> {
    const [favorite] = await db
      .insert(favoriteSpots)
      .values({ userId, spotId })
      .returning();
    return favorite;
  }

  async removeFavoriteSpot(userId: number, spotId: number): Promise<void> {
    await db
      .delete(favoriteSpots)
      .where(
        and(
          eq(favoriteSpots.userId, userId),
          eq(favoriteSpots.spotId, spotId)
        )
      );
  }

  async getUserFavorites(username: string): Promise<Spot[]> {
    const favorites = await db
      .select({
        spot: spots
      })
      .from(spots)
      .innerJoin(favoriteSpots, eq(spots.id, favoriteSpots.spotId))
      .innerJoin(users, eq(favoriteSpots.userId, users.id))
      .where(eq(users.username, username));
    return favorites.map(({ spot }) => spot);
  }

  async followUser(followerId: number, username: string): Promise<UserFollow> {
    const [followedUser] = await db
      .select()
      .from(users)
      .where(eq(users.username, username));

    if (!followedUser) {
      throw new Error("User not found");
    }

    const [follow] = await db
      .insert(userFollows)
      .values({
        followerId,
        followedId: followedUser.id,
      })
      .returning();
    return follow;
  }

  async unfollowUser(followerId: number, username: string): Promise<void> {
    const [followedUser] = await db
      .select()
      .from(users)
      .where(eq(users.username, username));

    if (!followedUser) {
      throw new Error("User not found");
    }

    await db
      .delete(userFollows)
      .where(
        and(
          eq(userFollows.followerId, followerId),
          eq(userFollows.followedId, followedUser.id)
        )
      );
  }

  async getUserFollowing(username: string): Promise<Omit<User, "password">[]> {
    const following = await db
      .select({
        following: {
          id: users.id,
          username: users.username,
          email: users.email,
          createdAt: users.createdAt,
        },
      })
      .from(users)
      .innerJoin(userFollows, eq(userFollows.followedId, users.id))
      .innerJoin(users, eq(userFollows.followerId, users.id))
      .where(eq(users.username, username));
    return following.map(({ following }) => following);
  }

  async getUserFollowers(username: string): Promise<Omit<User, "password">[]> {
    const followers = await db
      .select({
        follower: {
          id: users.id,
          username: users.username,
          email: users.email,
          createdAt: users.createdAt,
        },
      })
      .from(users)
      .innerJoin(userFollows, eq(userFollows.followerId, users.id))
      .where(eq(users.username, username));
    return followers.map(({ follower }) => follower);
  }
}

export const storage = new DatabaseStorage();