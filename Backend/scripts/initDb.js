const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config();
const { getPool } = require("../utils/db");

const initialize = async () => {
  const sql = fs.readFileSync(path.join(__dirname, "../db/schema.sql"), "utf8");
  const pool = getPool();
  try {
    await pool.query(sql);
    console.log("Neon schema initialized: users, prospects, donors, and emergency requests are ready.");
  } finally {
    await pool.end();
  }
};

initialize().catch((error) => {
  console.error("Database initialization failed:", error.message);
  process.exitCode = 1;
});
