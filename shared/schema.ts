import { pgTable, text, serial, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Equipment piece schema
export const equipmentPiece = pgTable("equipment_pieces", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  tier: text("tier").notNull(),
  quality: text("quality").default("Normal"),
  description: text("description"),
  imageUrl: text("image_url"),
});

// Export types for equipment pieces
export type EquipmentPiece = typeof equipmentPiece.$inferSelect;
export const insertEquipmentPieceSchema = createInsertSchema(equipmentPiece).omit({ id: true });
export type InsertEquipmentPiece = z.infer<typeof insertEquipmentPieceSchema>;

// Build schema
export const builds = pgTable("builds", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  activityType: text("activity_type").notNull(),
  commandAlias: text("command_alias").notNull().unique(),
  tier: text("tier").default("T8"),
  imgUrl: text("img_url"),
  estimatedCost: text("estimated_cost"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  equipment: jsonb("equipment").notNull(),
  alternatives: jsonb("alternatives"),
  isMeta: boolean("is_meta").default(false),
  tags: text("tags").array(),
});

// Equipment object with all slots
export const equipmentSchema = z.object({
  weapon: z.object({
    name: z.string(),
    tier: z.string(),
    quality: z.string().optional(),
    imageUrl: z.string().optional(),
  }),
  offHand: z.object({
    name: z.string().optional(),
    tier: z.string().optional(),
    quality: z.string().optional(),
    imageUrl: z.string().optional(),
  }).optional(),
  head: z.object({
    name: z.string(),
    tier: z.string(),
    quality: z.string().optional(),
    imageUrl: z.string().optional(),
  }),
  chest: z.object({
    name: z.string(),
    tier: z.string(),
    quality: z.string().optional(),
    imageUrl: z.string().optional(),
  }),
  shoes: z.object({
    name: z.string(),
    tier: z.string(),
    quality: z.string().optional(),
    imageUrl: z.string().optional(),
  }),
  cape: z.object({
    name: z.string().optional(),
    tier: z.string().optional(),
    quality: z.string().optional(),
    imageUrl: z.string().optional(),
  }).optional(),
  food: z.object({
    name: z.string().optional(),
    tier: z.string().optional(),
    imageUrl: z.string().optional(),
  }).optional(),
  potion: z.object({
    name: z.string().optional(),
    tier: z.string().optional(),
    imageUrl: z.string().optional(),
  }).optional(),
  mount: z.object({
    name: z.string().optional(),
    tier: z.string().optional(),
    imageUrl: z.string().optional(),
  }).optional(),
});

// Alternatives schema
export const alternativesSchema = z.object({
  weapons: z.array(z.object({
    name: z.string(),
    description: z.string().optional(),
  })).optional(),
  armor: z.array(z.object({
    name: z.string(),
    description: z.string().optional(),
  })).optional(),
  consumables: z.array(z.object({
    name: z.string(),
    description: z.string().optional(),
  })).optional(),
});

// Full build schema for zod validation
export const buildSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  activityType: z.string().min(1, "Activity type is required"),
  commandAlias: z.string()
    .min(1, "Command alias is required")
    .regex(/^[a-z0-9-]+$/, "Command alias can only contain lowercase letters, numbers, and hyphens"),
  tier: z.string().default("T8"),
  imgUrl: z.string().optional(),
  estimatedCost: z.string().optional(),
  equipment: equipmentSchema,
  alternatives: alternativesSchema.optional(),
  isMeta: z.boolean().default(false),
  tags: z.array(z.string()).optional(),
});

// Export build types
export type Build = typeof builds.$inferSelect;
export const insertBuildSchema = createInsertSchema(builds).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertBuild = z.infer<typeof insertBuildSchema>;

// User schema (for admin access)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  isAdmin: boolean("is_admin").default(false),
});

export type User = typeof users.$inferSelect;
export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export type InsertUser = z.infer<typeof insertUserSchema>;

// Bot settings schema
export const botSettings = pgTable("bot_settings", {
  id: serial("id").primaryKey(),
  token: text("token"),
  clientId: text("client_id"),
  guildId: text("guild_id"),
  prefix: text("prefix").default("/"),
});

export type BotSettings = typeof botSettings.$inferSelect;
export const insertBotSettingsSchema = createInsertSchema(botSettings).omit({ id: true });
export type InsertBotSettings = z.infer<typeof insertBotSettingsSchema>;
