const Link = require("../models/Link");
const Click = require("../models/Click");

exports.getLinkAnalytics = async (req, res) => {
  try {
    const { shortUrl } = req.params; 
    const link = await Link.findOne({ shortUrl });
    if (!link) {
      return res.status(404).json({ message: "Link not found" });
    }
    const userIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'];
    const newClick = new Click({
      link: link._id,
      ip: userIp,
      userAgent: userAgent,
      timestamp: new Date(),
    });
    await newClick.save();
    link.clicks.push(newClick);
    await link.save();
    res.status(200).json({ message: "Click logged successfully" });
  } catch (error) {
    console.error("Error logging click:", error.message);
    res.status(500).json({ message: "Failed to log click" });
  }
};
