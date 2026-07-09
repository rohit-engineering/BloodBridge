const express = require("express");
const {
  getSetupStatus,
  loginUser,
  registerUser,
} = require("../controllers/auth");
const router = express.Router();

// LOGIN ROUTER
router.post("/login", loginUser);

// CHECK WHETHER THE FIRST ADMIN MUST BE CREATED
router.get("/setup-status", getSetupStatus);

// REGISTER ROUTER
router.post("/register", registerUser);

module.exports = router; // Ensure you're exporting the router correctly
