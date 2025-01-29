const mongoose = require("mongoose");

const ClickSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  ip: { type: String },
  userAgent: { type: String },
});

const LinkSchema = new mongoose.Schema({
  originalUrl: { type: String, required: true },
  shortUrl: { type: String, required: true, unique: true },
  shortUrl: { type: String, required: true },
  remark: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  expirationDate: { type: Date },
  clicks: [ClickSchema],
});

module.exports = mongoose.model("Link", LinkSchema);
