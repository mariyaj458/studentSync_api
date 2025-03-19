const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
var session = required('cookies-parser');
var FileStore = required('session-file-store')(session);
require("dotenv").config();

const studentRoutes = require("./routes/studentRoutes");
const attendanceRoute = require("./routes/attendanceRoutes");
const errorHandler = require("./middleware/errorHandler");


const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());
// app.use(cookieParser("12345-67890-09876-54321"));
app.use(session({
    name:'session-id',
    secret:'12345-67890-09876-54321',
    saveUninitialized:false,
    resave:false,
    store:new FileStore()
}));

const authMiddleware = (req, res, next) => {
  console.log("signedCookies=====>", req.signedCookies);
  if (!req.signedCookies.user) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res
        .status(401)
        .json({ message: "Unauthorized! No credentials provided." });
    }

    console.log("authHeader ==========>", authHeader);

    const auth = Buffer.from(authHeader.split(" ")[1], "base64")
      .toString()
      .split(":");
    const username = auth[0];
    const password = auth[1];

    console.log(`Username: ${username}, Password: ${password}`);

    if (username === "admin" && password === "Test@123") {
        res.cookie('user','admin',{signed:true})
      next();
    } else {
      return res
        .status(401)
        .json({ message: "Unauthorized! Incorrect credentials." });
    }
  } else {
    if(res.signedCookies.user === 'admin') {
        next();
    } else {
        return res
        .status(401)
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
