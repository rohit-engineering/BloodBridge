const express = require("express");
const {
  createProspect,
  getAllProspects,
  updateProspect,
  deleteProspect,
  getOneProspect, // Import all necessary functions
  approveProspect,
} = require("../controllers/prospect"); // Ensure the path is correct
const { verifyTokenAndAuthorization } = require("../middlewares/verifyToken");

const router = express.Router();

// ADD PROSPECT
router.post("/", createProspect);

// GET ALL PROSPECTS
router.get("/", getAllProspects);

// ATOMICALLY APPROVE AND MOVE TO DONORS
router.post("/:id/approve", verifyTokenAndAuthorization, approveProspect);

// UPDATE PROSPECT
router.put("/:id", updateProspect);

// DELETE PROSPECT
router.delete("/:id", deleteProspect);

// GET ONE PROSPECT
router.get("/find/:id", getOneProspect); // Change this to GET instead of POST for fetching

module.exports = router;
