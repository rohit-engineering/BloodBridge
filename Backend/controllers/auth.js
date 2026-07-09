const CryptoJs = require("crypto-js");
const jwt = require("jsonwebtoken");
const { query } = require("../utils/db");

const publicUserColumns = `
  id::text AS "_id", name, email, status, role,
  created_at AS "createdAt", updated_at AS "updatedAt"
`;

const registerUser = async (req, res) => {
  try {
    const existingUsers = await query("SELECT COUNT(*)::integer AS count FROM users");
    if (existingUsers.rows[0].count > 0) {
      return res.status(403).json({
        message: "Initial admin setup is complete. New users must be created by an administrator.",
      });
    }
    const { name, email, password, role } = req.body;
    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string" ||
      password.length < 8
    ) {
      return res.status(400).json({
        message: "Name, email, and a password of at least 8 characters are required",
      });
    }
    if (role && !["user", "admin"].includes(role)) {
      return res.status(400).json({ message: "Role must be 'user' or 'admin'" });
    }

    const encryptedPassword = CryptoJs.AES.encrypt(password, process.env.PASS).toString();
    const result = await query(
      `INSERT INTO users (name, email, password, role)
       VALUES ($1, LOWER($2), $3, $4)
       RETURNING ${publicUserColumns}`,
      [name.trim(), email.trim(), encryptedPassword, "admin"]
    );
    return res.status(201).json(result.rows[0]);
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({ message: "An account with this email already exists" });
    }
    console.error("Registration failed:", error);
    return res.status(500).json({ message: "Could not register the user" });
  }
};

const getSetupStatus = async (req, res) => {
  try {
    const result = await query("SELECT COUNT(*)::integer AS count FROM users");
    return res.json({ setupRequired: result.rows[0].count === 0 });
  } catch (error) {
    console.error("Setup status failed:", error);
    return res.status(500).json({ message: "Could not check administrator setup" });
  }
};

const loginUser = async (req, res) => {
  try {
    if (typeof req.body.email !== "string" || typeof req.body.password !== "string") {
      return res.status(400).json({ message: "Email and password are required" });
    }
    const result = await query(
      `SELECT ${publicUserColumns}, password FROM users WHERE email = LOWER($1) LIMIT 1`,
      [req.body.email.trim()]
    );
    const user = result.rows[0];
    if (!user) return res.status(401).json({ message: "Invalid email or password" });

    const originalPassword = CryptoJs.AES.decrypt(user.password, process.env.PASS)
      .toString(CryptoJs.enc.Utf8);
    if (originalPassword !== req.body.password) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    delete user.password;
    const accessToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SEC,
      { expiresIn: "10d" }
    );
    return res.status(200).json({ ...user, accessToken });
  } catch (error) {
    console.error("Login failed:", error);
    return res.status(500).json({ message: "Could not sign in" });
  }
};

module.exports = { getSetupStatus, loginUser, registerUser };
