const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  createLink,
  getLinks,
  getStats,
  trackClick,
  getAnalytics,
  getClicksForUrl,
  deleteLinkByShortUrl,
  updateLinkByShortUrl,
} = require("../controllers/linkController");
const router = express.Router();

router.post("/", protect, createLink);
router.get("/", protect, getLinks);
router.get("/stats", protect, getStats);
router.get("/:shortUrl", trackClick);
router.get("/analytics", protect, getAnalytics);
router.get("/:shortUrl/clicks", protect, getClicksForUrl);
router.put("/short/:shortUrl", protect, updateLinkByShortUrl);
router.delete("/short/:shortUrl", protect, deleteLinkByShortUrl);

module.exports = router;
