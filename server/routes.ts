import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import { insertBuildSchema, buildSchema } from "@shared/schema";
import multer from "multer";
import path from "path";
import fs from "fs";
import { initBot } from "./discord/bot";

// Configure multer for file uploads
const uploadDir = path.join(process.cwd(), "dist", "public", "uploads");

// Ensure upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage2 = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage2,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|svg/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("Only image files are allowed!"));
  }
});

import { setupAuth } from "./auth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes
  setupAuth(app);
  const httpServer = createServer(app);
  
  // Error handler middleware
  const handleError = (err: any, res: Response) => {
    console.error(err);
    if (err instanceof ZodError) {
      const validationError = fromZodError(err);
      return res.status(400).json({ 
        message: validationError.message,
        errors: err.errors 
      });
    }
    res.status(500).json({ message: err.message || "Internal server error" });
  };

  // Authentication is handled by setupAuth function

  // Build endpoints
  app.get("/api/builds", async (req: Request, res: Response) => {
    try {
      const activityType = req.query.activityType as string;
      
      let builds;
      if (activityType) {
        builds = await storage.getBuildsByActivityType(activityType);
      } else {
        builds = await storage.getBuilds();
      }
      
      res.json(builds);
    } catch (err) {
      handleError(err, res);
    }
  });
  
  app.get("/api/builds/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const build = await storage.getBuild(id);
      
      if (!build) {
        return res.status(404).json({ message: "Build not found" });
      }
      
      res.json(build);
    } catch (err) {
      handleError(err, res);
    }
  });
  
  app.post("/api/builds", upload.single("image"), async (req: Request, res: Response) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      // Parse and validate the build data
      const buildData = JSON.parse(req.body.data);
      
      // If an image was uploaded, set the imageUrl
      if (req.file) {
        buildData.imgUrl = `/uploads/${req.file.filename}`;
      }
      
      // Validate the build data
      const validatedBuild = buildSchema.parse(buildData);
      
      // Check if the command alias is already in use
      const existingBuild = await storage.getBuildByCommandAlias(validatedBuild.commandAlias);
      if (existingBuild) {
        return res.status(400).json({ message: "Command alias already in use" });
      }
      
      // Create the build
      const newBuild = await storage.createBuild(validatedBuild);
      
      res.status(201).json(newBuild);
    } catch (err) {
      handleError(err, res);
    }
  });
  
  app.put("/api/builds/:id", upload.single("image"), async (req: Request, res: Response) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      // Get existing build
      const existingBuild = await storage.getBuild(id);
      if (!existingBuild) {
        return res.status(404).json({ message: "Build not found" });
      }
      
      // Parse and validate the update data
      const buildData = JSON.parse(req.body.data);
      
      // If an image was uploaded, set the imageUrl
      if (req.file) {
        buildData.imgUrl = `/uploads/${req.file.filename}`;
        
        // If replacing an existing image, delete the old one
        if (existingBuild.imgUrl && existingBuild.imgUrl.startsWith('/uploads/')) {
          const oldImagePath = path.join(uploadDir, path.basename(existingBuild.imgUrl));
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        }
      }
      
      // Check if command alias changed and is unique
      if (buildData.commandAlias && buildData.commandAlias !== existingBuild.commandAlias) {
        const aliasExists = await storage.getBuildByCommandAlias(buildData.commandAlias);
        if (aliasExists) {
          return res.status(400).json({ message: "Command alias already in use" });
        }
      }
      
      // Update the build
      const updatedBuild = await storage.updateBuild(id, buildData);
      
      if (!updatedBuild) {
        return res.status(404).json({ message: "Build not found" });
      }
      
      res.json(updatedBuild);
    } catch (err) {
      handleError(err, res);
    }
  });
  
  app.delete("/api/builds/:id", async (req: Request, res: Response) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      // Get existing build
      const existingBuild = await storage.getBuild(id);
      if (!existingBuild) {
        return res.status(404).json({ message: "Build not found" });
      }
      
      // If the build has an image, delete it
      if (existingBuild.imgUrl && existingBuild.imgUrl.startsWith('/uploads/')) {
        const imagePath = path.join(uploadDir, path.basename(existingBuild.imgUrl));
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }
      
      // Delete the build
      const success = await storage.deleteBuild(id);
      
      if (!success) {
        return res.status(404).json({ message: "Build not found" });
      }
      
      res.json({ message: "Build deleted successfully" });
    } catch (err) {
      handleError(err, res);
    }
  });

  // Bot settings endpoints
  app.get("/api/bot-settings", async (req: Request, res: Response) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const settings = await storage.getBotSettings();
      res.json(settings || { token: "", clientId: "", guildId: "", prefix: "/" });
    } catch (err) {
      handleError(err, res);
    }
  });
  
  app.post("/api/bot-settings", async (req: Request, res: Response) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const { token, clientId, guildId, prefix } = req.body;
      
      const settings = await storage.updateBotSettings({
        token,
        clientId,
        guildId,
        prefix: prefix || "/",
      });
      
      // Try to initialize the bot with the new settings
      if (token && clientId) {
        try {
          await initBot();
        } catch (botError) {
          console.error("Failed to initialize bot:", botError);
          // Continue even if bot init fails
        }
      }
      
      res.json(settings);
    } catch (err) {
      handleError(err, res);
    }
  });

  // Initialize the Discord bot if settings are available
  try {
    const settings = await storage.getBotSettings();
    if (settings && settings.token && settings.clientId) {
      await initBot();
    }
  } catch (err) {
    console.error("Failed to initialize Discord bot:", err);
  }

  return httpServer;
}
