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
const PORT = process.env.PORT || 5000;

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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
