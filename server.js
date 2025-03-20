const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
var session = require("express-session");
var FileStore = require("session-file-store")(session);
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
app.use(
  session({
    name: "session-id",
    secret: "12345-67890-09876-54321",
    saveUninitialized: false,
    resave: false,
    store: new FileStore(),
    cookie: { maxAge: 60000 },
  })
);

app.use("/api/users", userRoutes);

const authMiddleware = (req, res, next) => {
  console.log("signedCookies=====>", req.session);
  if (!req.session.user) {
    return res
      .status(401)
      .json({ message: "Unauthorized! No credentials provided." });
  } else {
    if (req.session.user === "authenticated") {
      next();
    } else {
      return res
        .status(403)
        .json({ message: "Unauthorized! No credentials provided." });
    }
  }
};

// Apply authMiddleware to student routes

app.use("/api/students", authMiddleware, studentRoutes);
app.use("/api/attendance", authMiddleware, attendanceRoute);

app.use(errorHandler);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI);
const db = mongoose.connection;
db.on("error", (err) => console.log("MongoDB Connection Error:", err));
db.once("open", () => console.log("MongoDB connected successfully"));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
