const express = require("express");
const User = require("../models/user");
const passport = require("passport");
const authenticate = require("../authenticate");

const router = express.Router();

router.post("/signup", async (req, res) => {
  try {
    const existingUser = await User.findOne({ username: req.body.username });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "A user with this username already exists",
      });
    }

    User.register(
      new User({ username: req.body.username }),
      req.body.password,
      async (err, user) => {
        if (err) {
          return res.status(500).json({ err });
        }
        if (req.body.firstname) user.firstname = req.body.firstname;
        if (req.body.lastname) user.lastname = req.body.lastname;

        try {
          await user.save();
          res
            .status(200)
            .json({ success: true, status: "Registration Successful" });
        } catch (saveError) {
          return res.status(500).json({ err: saveError });
        }
      }
    );
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
});

router.post("/login", (req, res, next) => {
  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }
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
