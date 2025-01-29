const express = require("express");
const {
  updateProfile,
  deleteAccount,
  getUserStats,
  getUserName,
  getUserDetails,
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

router.put("/update", protect, updateProfile);
router.delete("/delete", protect, deleteAccount);
router.get("/stats", protect, getUserStats);
router.get("/details", protect, getUserDetails);

module.exports = router;
