import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { getCities } from "./data/cities";
import { getPollutionData } from "./data/pollutionData";

export async function registerRoutes(app: Express): Promise<Server> {
  // API Routes
  
  // Get list of available cities
  app.get("/api/cities", (req, res) => {
    const cities = getCities();
    res.json(cities);
  });
  
  // Get pollution data for a specific city
  app.get("/api/pollution/:cityId", (req, res) => {
    const { cityId } = req.params;
    const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;
    
    try {
      const data = getPollutionData(cityId, offset);
      res.json(data);
    } catch (error) {
      res.status(404).json({ 
        message: error instanceof Error ? error.message : "City not found" 
      });
    }
  });
  
  const httpServer = createServer(app);
  return httpServer;
}
