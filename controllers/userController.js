const User = require("../models/User");
const Link = require("../models/Link");
const Click = require("../models/Click");
const jwt = require("jsonwebtoken");
exports.updateProfile = async (req, res) => {
  const user = await User.findById(req.user.id);
  if (
    req.body.email &&
    req.body.email !== user.email &&
    req.body.mobile !== user.mobile
  ) {
    user.email = req.body.email;
    await user.save();
    return res.json({ message: "Email updated, please log in again" });
  }
  user.name = req.body.name;
  await user.save();
  user.mobile = req.body.mobile;
  await user.save();
  res.json(user);
};

exports.deleteAccount = async (req, res) => {
  await Link.deleteMany({ user: req.user.id });
  await User.findByIdAndDelete(req.user.id);
  res.json({ message: "Account deleted" });
};
exports.getUserStats = async (req, res) => {
  try {
    const totalLinks = await Link.countDocuments({ user: req.user.id });
    const linkIds = await Link.find({ user: req.user.id }).select("_id");
    const totalClicks = await Click.countDocuments({ link: { $in: linkIds } });

    res.json({ totalLinks, totalClicks });
  } catch (error) {
    console.error("Error fetching user stats:", error.message);
    res.status(500).json({ message: "Failed to fetch user stats" });
  }
};
exports.getUserDetails = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || !decoded.id) {
      return res.status(401).json({ message: "Invalid token" });
    }
    const user = await User.findById(decoded.id).select("name email mobile");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res
      .status(200)
      .json({ name: user.name, email: user.email, mobile: user.mobile });
  } catch (error) {
    console.error("Error fetching user details:", error.message);
    res.status(500).json({ message: "Failed to fetch user details" });
  }
};
