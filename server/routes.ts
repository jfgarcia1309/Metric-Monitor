import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertManagerSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/managers", async (_req, res) => {
    const managers = await storage.getManagers();
    res.json(managers);
  });

  app.get("/api/managers/week/:week", async (req, res) => {
    const week = parseInt(req.params.week);
    if (isNaN(week)) {
      return res.status(400).json({ message: "Invalid week" });
    }
    const managers = await storage.getManagersByWeek(week);
    res.json(managers);
  });

  app.post("/api/managers", async (req, res) => {
    const authHeader = req.headers['x-admin-password'];
    if (authHeader !== 'Bogota123*') {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const result = insertManagerSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: "Invalid manager data" });
    }
    const manager = await storage.createManager(result.data);
    res.json(manager);
  });

  app.patch("/api/managers/:id", async (req, res) => {
    const password = req.headers['x-admin-password'];
    if (password !== 'Bogota123*') {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const result = insertManagerSchema.partial().safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: "Invalid manager data" });
    }
    const manager = await storage.updateManager(req.params.id, result.data);
    res.json(manager);
  });

  app.delete("/api/managers/:id", async (req, res) => {
    const password = req.headers['x-admin-password'];
    if (password !== 'Bogota123*') {
      return res.status(401).json({ message: "Unauthorized" });
    }
    await storage.deleteManager(req.params.id);
    res.sendStatus(204);
  });

  const httpServer = createServer(app);
  return httpServer;
}
