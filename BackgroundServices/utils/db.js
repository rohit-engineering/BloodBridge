const { Pool } = require("pg");

let pool;
let connected = false;
let retryTimer;

const getPool = () => {
  if (!pool) {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL is missing from BackgroundServices/.env");
    }
    const databaseUrl = new URL(process.env.DATABASE_URL);
    databaseUrl.searchParams.delete("sslmode");
    databaseUrl.searchParams.delete("channel_binding");
    pool = new Pool({
      connectionString: databaseUrl.toString(),
      ssl: { rejectUnauthorized: true },
      enableChannelBinding: true,
      max: 2,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 15000,
      keepAlive: true,
    });
    pool.on("error", (error) => {
      connected = false;
      console.error("Unexpected PostgreSQL pool error:", error.message);
      clearTimeout(retryTimer);
      retryTimer = setTimeout(dbConnection, 5000);
    });
  }
  return pool;
};

const dbConnection = async () => {
  try {
    await getPool().query("SELECT 1");
    if (!connected) console.log("Neon PostgreSQL connected successfully");
    connected = true;
    clearTimeout(retryTimer);
    return true;
  } catch (error) {
    connected = false;
    console.error(`Neon PostgreSQL unavailable (${error.message}). Retrying in 5 seconds...`);
    clearTimeout(retryTimer);
    retryTimer = setTimeout(dbConnection, 5000);
    return false;
  }
};

const query = async (text, params) => {
  try {
    const result = await getPool().query(text, params);
    connected = true;
    return result;
  } catch (error) {
    connected = false;
    throw error;
  }
};

module.exports = { dbConnection, query, isDatabaseReady: () => connected };
