const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const linkRoutes = require("./routes/linkRoutess");
const userRoutes = require("./routes/userRoutes");
const errorHandler = require("./utils/errorHandler");
const analyticsRoutes = require("./routes/analyticsRoutes");

require("dotenv").config();
connectDB();

const app = express();
app.use(
  cors({
    origin: "https://url-shortner-manager.vercel.app",
    credentials: true,
  })
);
app.options("*", cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/links", linkRoutes);
app.use("/api/user", userRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use(errorHandler);

app.listen(5000, () => console.log("Server running on port 5000"));
