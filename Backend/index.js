const dotenv = require("dotenv");
dotenv.config();

const app = require("./app");
const { dbConnection } = require("./utils/db");

const PORT = process.env.PORT || 8000;

app.listen(PORT, async () => {
  console.log(`API server is running on port ${PORT}`);

  await dbConnection();
});