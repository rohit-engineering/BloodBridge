const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
dotenv.config();

// Verifies if the token is valid
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.token || req.headers.authorization; // Check both common headers
  if (authHeader) {
    const token = authHeader.split(" ")[1]; // Split by space and get the token (second part)
    jwt.verify(token, process.env.JWT_SEC, (err, user) => {
      if (err) return res.status(403).json("Token is not valid.");
      req.user = user;
      next();
    });
  } else {
    return res.status(401).json("You are not authenticated.");
  }
};

// Verifies the token and checks if the user is an admin
const verifyTokenAndAuthorization = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user && req.user.role === "admin") {
      next();
    } else {
      return res.status(403).json("You are not authorized.");
    }
  });
};

module.exports = { verifyTokenAndAuthorization };
