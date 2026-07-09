const app = require("./app");
const dotenv = require("dotenv");
const { dbConnection } = require("./utils/db");

// Load environment variables
dotenv.config();

// PORT
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`API server is running on http://localhost:${PORT}`);
  dbConnection();
});
