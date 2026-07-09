const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cron = require("node-cron");
const { dbConnection, isDatabaseReady } = require("./utils/db");
const {
  sendDetailsProspectEmail,
} = require("./EmailServices/sendDetailsProspect");
const {
  sendEligibilityEmail,
} = require("./EmailServices/sendEligibilityEmail");
const {
  sendBloodDonationReminder,
} = require("./EmailServices/sendBloodDonationReminder");
const {
  sendDonorDetailsEmail,
} = require("./EmailServices/sendDonorDetailsEmail");
const {
  sendEmergencyRequestEmails,
} = require("./EmailServices/sendEmergencyRequest");
const { isEmailConfigured } = require("./helpers/sendmail");
dotenv.config();

//SCHEDULE TASK
const run = () => {
  if (run.started) return;
  run.started = true;
  console.log(`Email scheduler started (${process.env.CRON_SCHEDULE || "0 * * * *"})`);
  cron.schedule(process.env.CRON_SCHEDULE || "0 * * * *", async () => {
    if (!isDatabaseReady()) {
      console.warn("Skipping email run because Neon PostgreSQL is disconnected.");
      return;
    }
    if (!isEmailConfigured()) {
      console.warn("Skipping email run: configure RESEND_API_KEY and EMAIL_FROM.");
      return;
    }
    await sendEligibilityEmail();
    await Promise.allSettled([
      sendDetailsProspectEmail(),
      sendBloodDonationReminder(),
      sendDonorDetailsEmail(),
    ]);
  });
  cron.schedule(process.env.EMERGENCY_CRON_SCHEDULE || "* * * * *", async () => {
    if (!isDatabaseReady() || !isEmailConfigured()) return;
    try {
      await sendEmergencyRequestEmails();
    } catch (error) {
      console.error("Emergency notification job failed:", error.message);
    }
  });
};

//SERVER
const PORT = process.env.PORT || 8001;

app.get("/health", (req, res) => {
  const databaseConnected = isDatabaseReady();
  res.status(databaseConnected ? 200 : 503).json({
    service: "bloodbank-background-services",
    status: databaseConnected ? "ok" : "degraded",
    database: databaseConnected ? "connected" : "disconnected",
    scheduler: run.started ? "running" : "waiting-for-database",
    email: isEmailConfigured() ? "configured" : "not-configured",
  });
});

app.listen(PORT, () => {
  console.log(`Background services are running on http://localhost:${PORT}`);
  dbConnection();
  run();
});
