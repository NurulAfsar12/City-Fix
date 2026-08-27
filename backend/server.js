import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import express from "express";
import cors from "cors";
import apiRoutes from "./src/routes/index.js";

// 1. Mandatory Environment Variables Check
const requiredEnvs = ["JWT_SECRET"];
for (const env of requiredEnvs) {
  if (!process.env[env]) {
    console.error(`FATAL ERROR: Environment variable ${env} is missing.`);
    process.exit(1);
  }
}

const app = express();

// 2. Dynamic CORS Options Setup
const clientUrl = process.env.CLIENT_URL || "*";
const corsOptions = {
  origin: clientUrl === "*" ? "*" : clientUrl.split(",").map((url) => url.trim()),
  credentials: clientUrl !== "*", // Dynamic credentials allow, wildcard thakle false
};

app.use(cors(corsOptions));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

// 3. Static File Directory Initialization
const uploadsDir = path.join(process.cwd(), "uploads", "reports");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// 4. API Routes & Health Check
const getHealthStatus = (_req, res) => {
  res.status(200).json({
    success: true,
    message: "CityFix API is running.",
    service: "cityfix-backend",
    timestamp: new Date().toISOString(),
  });
};

app.get("/api/health", getHealthStatus);
app.use("/api", apiRoutes);

// 5. 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found.`,
  });
});
// 6. Global Error Handler
app.use((err, req, res, _next) => {
  const status = err.status ?? err.statusCode ?? 500;
  const isProduction = process.env.NODE_ENV === "production";

  const message =
    status < 500
      ? err.message
      : isProduction
      ? "Internal server error. Please try again later."
      : err.message;

  if (status >= 500) {
    console.error(`[SERVER ERROR] ${req.method} ${req.originalUrl}:`, err);
  }

  const response = {
    success: false,
    message,
    ...(isProduction ? {} : { stack: err.stack }),
  };

  res.status(status).json(response);
});

// 7. Graceful Server Initialization
const port = Number(process.env.PORT) || 5000;
const environment = process.env.NODE_ENV || "development";

const server = app.listen(port, () => {
  console.log(`CityFix API running on http://localhost:${port} [${environment}]`);
});

const handleShutdown = (signal) => {
  console.log(`Received ${signal}. Closing HTTP server cleanly...`);
  server.close(() => {
    console.log("HTTP server closed cleanly.");
    process.exit(0);
  });
};

["SIGTERM", "SIGINT"].forEach((signal) => {
  process.on(signal, () => handleShutdown(signal));
});