import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { getCities } from "./data/cities";
import { getPollutionData } from "./data/pollutionData";
// @ts-ignore
import fetch from "node-fetch";

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
  
  // Proxy OpenAQ v3 endpoints to bypass CORS
  // Proxy: /api/openaq/cities → https://api.openaq.org/v3/cities
  app.get("/api/openaq/cities", async (req, res) => {
    try {
      const url = new URL("https://api.openaq.org/v3/cities");
      Object.entries(req.query).forEach(([key, value]) => {
        if (value) url.searchParams.append(key, String(value));
      });
      const apiKey = process.env.VITE_OPENAQ_API_KEY || process.env.OPENAQ_API_KEY;
      const response = await fetch(url.toString(), {
        headers: {
          accept: "application/json",
          ...(apiKey ? { "X-API-Key": apiKey } : {}),
        },
      });
      const data = await response.json();
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.status(response.status).json(data);
    } catch (err) {
      res.status(500).json({ message: "Errore proxy OpenAQ /cities", error: String(err) });
    }
  });

  // Proxy: /api/openaq/locations → https://api.openaq.org/v3/locations
  app.get("/api/openaq/locations", async (req, res) => {
    try {
      const url = new URL("https://api.openaq.org/v3/locations");
      Object.entries(req.query).forEach(([key, value]) => {
        if (value) url.searchParams.append(key, String(value));
      });
      const apiKey = process.env.VITE_OPENAQ_API_KEY || process.env.OPENAQ_API_KEY;
      const response = await fetch(url.toString(), {
        headers: {
          accept: "application/json",
          ...(apiKey ? { "X-API-Key": apiKey } : {}),
        },
      });
      const data = await response.json();
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.status(response.status).json(data);
    } catch (err) {
      res.status(500).json({ message: "Errore proxy OpenAQ /locations", error: String(err) });
    }
  });

  // Proxy: /api/openaq/measurements → https://api.openaq.org/v3/measurements
  app.get("/api/openaq/measurements", async (req, res) => {
    try {
      const url = new URL("https://api.openaq.org/v3/measurements");
      Object.entries(req.query).forEach(([key, value]) => {
        if (value) url.searchParams.append(key, String(value));
      });
      const apiKey = process.env.VITE_OPENAQ_API_KEY || process.env.OPENAQ_API_KEY;
      const response = await fetch(url.toString(), {
        headers: {
          accept: "application/json",
          ...(apiKey ? { "X-API-Key": apiKey } : {}),
        },
      });
      const data = await response.json();
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.status(response.status).json(data);
    } catch (err) {
      res.status(500).json({ message: "Errore proxy OpenAQ /measurements", error: String(err) });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
