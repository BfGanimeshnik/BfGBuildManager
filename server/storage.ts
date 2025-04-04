import { 
  users, type User, type InsertUser,
  builds, type Build, type InsertBuild,
  botSettings, type BotSettings, type InsertBotSettings
} from "@shared/schema";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

// Create connect-pg-simple session store
const PostgresSessionStore = connectPg(session);

export interface IStorage {
  // User management
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Build management
  getBuilds(): Promise<Build[]>;
  getBuild(id: number): Promise<Build | undefined>;
  getBuildByCommandAlias(commandAlias: string): Promise<Build | undefined>;
  getBuildsByActivityType(activityType: string): Promise<Build[]>;
  createBuild(build: InsertBuild): Promise<Build>;
  updateBuild(id: number, build: Partial<InsertBuild>): Promise<Build | undefined>;
  deleteBuild(id: number): Promise<boolean>;

  // Bot settings
  getBotSettings(): Promise<BotSettings | undefined>;
  updateBotSettings(settings: InsertBotSettings): Promise<BotSettings>;
  
  // Session store for express-session
  sessionStore: session.Store;
}

import createMemoryStore from "memorystore";
import { eq, and } from "drizzle-orm";
import { db } from "./db";

// Create memory store for MemStorage
const MemoryStore = createMemoryStore(session);

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private builds: Map<number, Build>;
  private botSettings: BotSettings | undefined;
  private userId: number;
  private buildId: number;
  public sessionStore: session.Store;

  constructor() {
    this.users = new Map();
    this.builds = new Map();
    this.userId = 1;
    this.buildId = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    });
    
    // Add default admin user
    this.createUser({
      username: "admin",
      password: "admin",
      isAdmin: true
    });

    // Add some example builds for testing
    this.createBuild({
      name: "Great Axe Solo Build",
      description: "A high-damage, mobile build for solo PvP engagements. Great for ganking and small-scale fights.",
      activityType: "Solo PvP",
      commandAlias: "greataxe-solo",
      tier: "T8",
      estimatedCost: "1.2M Silver",
      equipment: {
        weapon: {
          name: "Great Axe",
          tier: "T8",
          quality: "Exceptional",
        },
        offHand: {
          name: "Torch",
          tier: "T8",
        },
        head: {
          name: "Mercenary Hood",
          tier: "T8",
        },
        chest: {
          name: "Stalker Jacket",
          tier: "T8",
        },
        shoes: {
          name: "Scholar Sandals",
          tier: "T8",
        },
        cape: {
          name: "Thetford Cape",
          tier: "T8",
        },
        food: {
          name: "Beef Stew",
          tier: "T8",
        },
        potion: {
          name: "Resistance Potion",
          tier: "T8",
        }
      },
      alternatives: {
        weapons: [
          { name: "Halberd", description: "For more range but less mobility." },
          { name: "Carrioncaller", description: "For sustained fights with healing reduction." }
        ],
        armor: [
          { name: "Hellion Jacket", description: "For more sustain through lifesteal." },
          { name: "Hunter Shoes", description: "For extra mobility with Rush." }
        ],
        consumables: [
          { name: "Omelette", description: "For cheaper food option with less stats." },
          { name: "Gigantify Potion", description: "For CC resistance when needed." }
        ]
      },
      isMeta: false,
      tags: ["ganking", "physical dps", "solo"]
    });
    
    this.createBuild({
      name: "Arcane ZvZ Support",
      description: "Support build for large-scale fights, focusing on crowd control and utility.",
      activityType: "Group PvP",
      commandAlias: "arcane-zvz",
      tier: "T8",
      estimatedCost: "2.5M Silver",
      equipment: {
        weapon: {
          name: "Locus",
          tier: "T8",
        },
        offHand: {
          name: "Tome",
          tier: "T8",
        },
        head: {
          name: "Royal Cowl",
          tier: "T8",
        },
        chest: {
          name: "Cleric Robe",
          tier: "T8",
        },
        shoes: {
          name: "Royal Sandals",
          tier: "T8",
        },
        cape: {
          name: "Martlock Cape",
          tier: "T8",
        },
        food: {
          name: "Cabbage Soup",
          tier: "T8",
        },
        potion: {
          name: "Energy Potion",
          tier: "T8",
        }
      },
      isMeta: true,
      tags: ["zvz", "support", "group play"]
    });
    
    this.createBuild({
      name: "Nature Gatherer",
      description: "Escape-focused build for safe resource gathering in high-risk zones.",
      activityType: "Gathering",
      commandAlias: "gatherer-nature",
      tier: "T8",
      estimatedCost: "1.8M Silver",
      equipment: {
        weapon: {
          name: "Blight Staff",
          tier: "T8",
        },
        head: {
          name: "Harvester Cap",
          tier: "T8",
        },
        chest: {
          name: "Gatherer Jacket",
          tier: "T8",
        },
        shoes: {
          name: "Gatherer Workboots",
          tier: "T8",
        },
        cape: {
          name: "Fort Sterling Cape",
          tier: "T8",
        },
        food: {
          name: "Fish",
          tier: "T8",
        },
        potion: {
          name: "Invisibility Potion",
          tier: "T8",
        },
        mount: {
          name: "Swiftclaw",
          tier: "T8",
        }
      },
      isMeta: false,
      tags: ["gathering", "escape", "economy"]
    });
  }

  // User management methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const user: User = { 
      ...insertUser, 
      id,
      isAdmin: insertUser.isAdmin ?? false
    };
    this.users.set(id, user);
    return user;
  }

  // Build management methods
  async getBuilds(): Promise<Build[]> {
    return Array.from(this.builds.values());
  }

  async getBuild(id: number): Promise<Build | undefined> {
    return this.builds.get(id);
  }

  async getBuildByCommandAlias(commandAlias: string): Promise<Build | undefined> {
    return Array.from(this.builds.values()).find(
      (build) => build.commandAlias === commandAlias,
    );
  }

  async getBuildsByActivityType(activityType: string): Promise<Build[]> {
    return Array.from(this.builds.values()).filter(
      (build) => build.activityType === activityType,
    );
  }

  async createBuild(build: InsertBuild): Promise<Build> {
    const id = this.buildId++;
    const now = new Date();
    const newBuild: Build = { 
      ...build, 
      id,
      createdAt: now,
      updatedAt: now,
    };
    this.builds.set(id, newBuild);
    return newBuild;
  }

  async updateBuild(id: number, buildUpdate: Partial<InsertBuild>): Promise<Build | undefined> {
    const existingBuild = this.builds.get(id);
    if (!existingBuild) {
      return undefined;
    }

    const updatedBuild: Build = {
      ...existingBuild,
      ...buildUpdate,
      updatedAt: new Date(),
    };
    
    this.builds.set(id, updatedBuild);
    return updatedBuild;
  }

  async deleteBuild(id: number): Promise<boolean> {
    return this.builds.delete(id);
  }

  // Bot settings methods
  async getBotSettings(): Promise<BotSettings | undefined> {
    return this.botSettings;
  }

  async updateBotSettings(settings: InsertBotSettings): Promise<BotSettings> {
    const id = 1; // Only one settings record
    this.botSettings = { ...settings, id };
    return this.botSettings;
  }
}

export class DatabaseStorage implements IStorage {
  public sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({ 
      pool, 
      createTableIfMissing: true 
    });
  }

  // User management methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    // Ensure isAdmin is properly set
    const userData = {
      ...insertUser,
      isAdmin: insertUser.isAdmin ?? false
    };
    const [user] = await db.insert(users).values(userData).returning();
    return user;
  }

  // Build management methods
  async getBuilds(): Promise<Build[]> {
    return await db.select().from(builds);
  }

  async getBuild(id: number): Promise<Build | undefined> {
    const [build] = await db.select().from(builds).where(eq(builds.id, id));
    return build;
  }

  async getBuildByCommandAlias(commandAlias: string): Promise<Build | undefined> {
    const [build] = await db.select().from(builds).where(eq(builds.commandAlias, commandAlias));
    return build;
  }

  async getBuildsByActivityType(activityType: string): Promise<Build[]> {
    return await db.select().from(builds).where(eq(builds.activityType, activityType));
  }

  async createBuild(build: InsertBuild): Promise<Build> {
    const [newBuild] = await db.insert(builds).values(build).returning();
    return newBuild;
  }

  async updateBuild(id: number, buildUpdate: Partial<InsertBuild>): Promise<Build | undefined> {
    // Set updated timestamp
    const updateData = {
      ...buildUpdate,
      updatedAt: new Date()
    };
    
    const [updatedBuild] = await db
      .update(builds)
      .set(updateData)
      .where(eq(builds.id, id))
      .returning();
    
    return updatedBuild;
  }

  async deleteBuild(id: number): Promise<boolean> {
    await db.delete(builds).where(eq(builds.id, id));
    // If no error was thrown, we consider it successful
    return true;
  }

  // Bot settings methods
  async getBotSettings(): Promise<BotSettings | undefined> {
    const [settings] = await db.select().from(botSettings);
    return settings;
  }

  async updateBotSettings(settings: InsertBotSettings): Promise<BotSettings> {
    // Check if settings exist first
    const existingSettings = await this.getBotSettings();
    
    if (existingSettings) {
      // Update existing settings
      const [updatedSettings] = await db
        .update(botSettings)
        .set(settings)
        .where(eq(botSettings.id, existingSettings.id))
        .returning();
      
      return updatedSettings;
    } else {
      // Create new settings
      const [newSettings] = await db.insert(botSettings).values(settings).returning();
      return newSettings;
    }
  }
}

// Switch to database storage
export const storage = new DatabaseStorage();
