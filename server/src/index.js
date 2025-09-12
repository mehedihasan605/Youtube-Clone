import dotenv from "dotenv";
import dbConnect from "./db/dbConnect.js";
import { app } from "./app.js";
import mongoose from "mongoose";

dotenv.config({
  path: "./.env",
});


// Root route (health check)
app.get("/", (_, res) => {
  const uptime = process.uptime();
  const memoryUsage = process.memoryUsage();

  // Check DB connection state
  const dbState = mongoose.connection.readyState; 
  // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting

  const healthData = {
    status: dbState === 1 ? "OK" : "ERROR",
    database: 
      dbState === 0 ? "Disconnected" :
      dbState === 1 ? "Connected" :
      dbState === 2 ? "Connecting..." :
      "Disconnecting...",
    timestamp: new Date().toLocaleString(),
    uptime: `${Math.floor(uptime / 3600)}h ${Math.floor((uptime % 3600) / 60)}m ${Math.floor(uptime % 60)}s`,
    memory: {
      rss: `${Math.round(memoryUsage.rss / 1024 / 1024)} MB`,
      heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)} MB`,
      heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)} MB`,
    },
    environment: process.env.NODE_ENV || "development",
  };

  return res.json(healthData);
});

// DB Connection Intry Point
dbConnect()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is Running at Port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("MongoDB Connection Error", err);
  });
