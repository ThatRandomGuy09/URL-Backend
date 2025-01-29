const mongoose = require("mongoose");

const clickSchema = new mongoose.Schema({
  link: { type: mongoose.Schema.Types.ObjectId, ref: "Link", required: true },
  ip: { type: String, required: true },
  userAgent: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Click", clickSchema);
