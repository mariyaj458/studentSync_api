const express = require("express");
const User = require("../models/user");
const passport = require("passport");
const authenticate = require("../authenticate");

const router = express.Router();

router.post("/signup", (req, res) => {
  console.log("Received Signup Request:", req.body);

  User.register(
    new User({ username: req.body.username }),
    req.body.password,
    (err, user) => {
      if (err) {
        return res.status(500).json({ err });
      }

      res
        .status(200)
        .json({ success: true, status: "Registration Successful" });
    }
  );
});

router.post("/login", (req, res, next) => {
  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // No session, just return the token
    const token = authenticate.getToken({ _id: user._id });
    res
      .status(200)
      .json({ success: true, token, status: "You are successfully logged in" });
  })(req, res, next);
});

router.get("/logout", (req, res) => {
  res.status(200).json({ message: "Logged out successfully" });
});

module.exports = router;
