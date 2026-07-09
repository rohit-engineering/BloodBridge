const express = require("express");
const {
  createEmergencyRequest,
  deleteEmergencyRequest,
  getEmergencyRequests,
  updateEmergencyStatus,
} = require("../controllers/emergency");
const { verifyTokenAndAuthorization } = require("../middlewares/verifyToken");

const router = express.Router();
router.get("/", getEmergencyRequests);
router.post("/", createEmergencyRequest);
router.patch("/:id/status", verifyTokenAndAuthorization, updateEmergencyStatus);
router.delete("/:id", verifyTokenAndAuthorization, deleteEmergencyRequest);

module.exports = router;
