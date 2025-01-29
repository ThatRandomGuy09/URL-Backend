const express = require("express");
const {
  getLinkAnalytics,
} = require("../controllers/analyticsController");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/:shortUrl", protect, getLinkAnalytics);

module.exports = router;
