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
app.get("/", (req, res) => {
  res.json({
    message: "BloodBridge Backend is running",
    version: "NEW_DEPLOYMENT",
  });
});
// =========================
// CORS
// =========================
const allowedOrigins = [
  "http://localhost:5173",
  "https://blood-bridge-gsfkvov7y-rohits-projects-e5c27de7.vercel.app",
  "https://blood-bridge-git-main-rohits-projects-e5c27de7.vercel.app/",
  "https://blood-bridge-taupe.vercel.app", // <-- match your real Vercel URL exactly
];

app.use(
  cors({
    origin: function (origin, callback) {
  if (!origin) return callback(null, true);
  if (allowedOrigins.includes(origin)) {
    return callback(null, true);
  }
  console.warn("Blocked by CORS, origin was:", origin); // helpful for debugging
  return callback(new Error("Not allowed by CORS"));
},
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// Health Check
app.get("/health", (req, res) => {
  const databaseConnected = isDatabaseReady();

  res.status(databaseConnected ? 200 : 503).json({
    service: "bloodbank-api",
    status: databaseConnected ? "ok" : "degraded",
    database: databaseConnected ? "connected" : "disconnected",
  });
});

// Database check middleware
app.use("/api", (req, res, next) => {
  if (!isDatabaseReady()) {
    return res.status(503).json({
      message:
        "Database is temporarily unavailable. Check the Neon connection and try again.",
    });
  }

  next();
});

// Routes
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/donors", donorRoute);
app.use("/api/v1/prospects", prospectRoute);
app.use("/api/v1/emergencies", emergencyRoute);

// Error Handler
app.use((err, req, res, next) => {
  console.error(err);

  if (res.headersSent) {
    return next(err);
  }

  res.status(500).json({
    message: err.message || "Internal Server Error",
  });
});

module.exports = app;