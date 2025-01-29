const Link = require("../models/Link");
const Click = require("../models/Click");
exports.createLink = async (req, res) => {
  try {
    const { originalUrl, expirationDate, remark } = req.body;

    if (!originalUrl || !expirationDate || !remark) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const shortUrl = Math.random().toString(36).substring(2, 8);

    const newLink = await Link.create({
      originalUrl,
      shortUrl,
      remark,
      expirationDate,
      user: req.user.id,
    });

    res.status(201).json(newLink);
  } catch (error) {
    console.error("Error creating link:", error.message);
    res.status(500).json({ message: "Failed to create the link" });
  }
};
exports.getLinks = async (req, res) => {
  try {
    const links = await Link.find({ user: req.user.id }).populate("clicks");

    const response = links.map((link) => ({
      id: link._id,
      originalUrl: link.originalUrl,
      shortUrl: link.shortUrl,
      totalClicks: link.clicks.length,
      remark:link.remark,
      expirationDate:link.expirationDate,
      clicks: link.clicks.map((click) => ({
        timestamp: click.timestamp,
        ip: click.ip,
        userAgent: click.userAgent,
      })),
    }));
    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching links:", error.message);
    res.status(500).json({ message: "Failed to fetch links" });
  }
};
exports.trackClick = async (req, res) => {
  try {
    const { shortUrl } = req.params;
    const link = await Link.findOne({ shortUrl });
    if (!link) {
      return res.status(404).json({ message: "Link not found" });
    }
    const click = new Click({
      link: link._id,
      timestamp: new Date(),
      ip: req.ip || "N/A",
      userAgent: req.headers["user-agent"] || "Unknown",
    });
    await click.save();
    link.clicks.push(click);
    await link.save();
    res.redirect(link.originalUrl);
  } catch (error) {
    console.error("Error during redirection:", error.message);
    res.status(500).json({ message: "Failed to redirect" });
  }
};
exports.getStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const totalLinks = await Link.countDocuments({ user: userId });
    const userLinks = await Link.find({ user: userId }).select("_id");
    const linkIds = userLinks.map((link) => link._id);
    const clicks = await Click.find({ link: { $in: linkIds } });
    const totalClicks = clicks.length;
    const deviceTypes = clicks.reduce(
      (acc, click) => {
        const userAgent = click.userAgent.toLowerCase();
        if (userAgent.includes("mobile")) acc.Mobile += 1;
        else if (userAgent.includes("tablet")) acc.Tablet += 1;
        else acc.Desktop += 1;
        return acc;
      },
      { Mobile: 0, Desktop: 0, Tablet: 0 }
    );
    const dateWiseClicks = clicks.reduce((acc, click) => {
      const date = click.timestamp.toISOString().split("T")[0];
      const formattedDate = date.split("-").reverse().join("-");
      if (!acc[formattedDate]) {
        acc[formattedDate] = 0;
      }
      acc[formattedDate] += 1;
      return acc;
    }, {});
    const dateWiseClicksArray = Object.entries(dateWiseClicks).map(
      ([date, clicks]) => ({
        date,
        clicks,
      })
    );
    dateWiseClicksArray.sort((a, b) => new Date(b.date) - new Date(a.date));
    res.json({
      totalClicks,
      totalLinks,
      deviceTypes,
      dateWiseClicks: dateWiseClicksArray,
    });
  } catch (error) {
    console.error("Error fetching stats:", error.message);
    res.status(500).json({ message: "Failed to fetch stats" });
  }
};
exports.getAnalytics = async (req, res) => {
  try {
    const links = await Link.find({ user: req.user.id }).populate("clicks");

    const analytics = links.map((link) => ({
      id: link._id,
      originalUrl: link.originalUrl,
      shortUrl: link.shortUrl,
      totalClicks: link.clicks.length,
      clicks: link.clicks.map((click) => ({
        timestamp: click.timestamp,
        ip: click.ip,
        userAgent: click.userAgent,
      })),
    }));

    res.status(200).json(analytics);
  } catch (error) {
    console.error("Error fetching analytics:", error.message);
    res.status(500).json({ message: "Failed to fetch analytics" });
  }
};
exports.getClicksForUrl = async (req, res) => {
  try {
    const { shortUrl } = req.params;
    const link = await Link.findOne({ shortUrl });
    if (!link) {
      return res.status(404).json({ message: "Link not found" });
    }
    const clicks = await Click.find({ link: link._id }).sort({ timestamp: -1 });
    res.status(200).json({
      originalUrl: link.originalUrl,
      shortUrl: link.shortUrl,
      totalClicks: clicks.length,
      clicks: clicks,
    });
  } catch (error) {
    console.error("Error fetching clicks for URL:", error.message);
    res.status(500).json({ message: "Failed to fetch clicks for URL" });
  }
};
exports.updateLinkByShortUrl = async (req, res) => {
  try {
    const { shortUrl } = req.params;
    const updates = req.body;
    const updatedLink = await Link.findOneAndUpdate({ shortUrl }, updates, {
      new: true,
      runValidators: true,
    });
    if (!updatedLink) {
      return res.status(404).json({ message: "Link not found" });
    }
    res.status(200).json(updatedLink);
  } catch (error) {
    console.error("Error updating link:", error.message);
    res.status(500).json({ message: "Failed to update the link" });
  }
};
exports.deleteLinkByShortUrl = async (req, res) => {
  try {
    const { shortUrl } = req.params;
    const deletedLink = await Link.findOneAndDelete({ shortUrl });
    if (!deletedLink) {
      return res.status(404).json({ message: "Link not found" });
    }
    res.status(200).json({ message: "Link deleted successfully" });
  } catch (error) {
    console.error("Error deleting link:", error.message);
    res.status(500).json({ message: "Failed to delete the link" });
  }
};
