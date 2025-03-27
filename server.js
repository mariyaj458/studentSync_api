const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const passport = require("passport");
require("dotenv").config();

const userRoutes = require("./routes/userRoutes");
const studentRoutes = require("./routes/studentRoutes");
const attendanceRoute = require("./routes/attendanceRoutes");
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.all("*", (req, res, next) => {
  if (req.secure || !app.get("secPort")) {
    return next();
  }
  res.redirect(307, `https://${req.hostname}:${app.get("secPort")}${req.url}`);
});

// Middleware
app.use(express.json());
app.use(cors());

app.use(passport.initialize());

app.use("/api/users", userRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/attendance", attendanceRoute);
app.use(errorHandler);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI);
mongoose.connection.on("error", (err) =>
  console.log("MongoDB Connection Error:", err)
);
mongoose.connection.once("open", () =>
  console.log("MongoDB connected successfully")
);

module.exports = app;
