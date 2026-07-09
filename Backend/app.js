const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { isDatabaseReady } = require("./utils/db");
const authRoute = require("./routes/auth");
const donorRoute = require("./routes/donor");
const prospectRoute = require("./routes/prospect");
const emergencyRoute = require("./routes/emergency");

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  const databaseConnected = isDatabaseReady();
  res.status(databaseConnected ? 200 : 503).json({
    service: "bloodbank-api",
    status: databaseConnected ? "ok" : "degraded",
    database: databaseConnected ? "connected" : "disconnected",
  });
});

app.use("/api", (req, res, next) => {
  if (!isDatabaseReady()) {
    return res.status(503).json({
      message: "Database is temporarily unavailable. Check the Neon connection and try again.",
    });
  }
  next();
});

// Routes
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/donors", donorRoute);
app.use("/api/v1/prospects", prospectRoute);
app.use("/api/v1/emergencies", emergencyRoute);

app.use((err, req, res, next) => {
  console.error(err);
  if (res.headersSent) return next(err);
  return res.status(500).json({ message: "An unexpected server error occurred." });
});
module.exports = app; // Export the app
