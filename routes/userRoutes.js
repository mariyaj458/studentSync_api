var express = require("express");
const bodyParser = require("body-parser");
var User = require("../models/user");
var passport = require("passport");

var router = express.Router();
router.use(bodyParser.json());

router.post("/signup", (req, res, next) => {
  console.log("Received Signup Request:", req.body);
  User.register(
    new User({ username: req.body.username }),
    req.body.password,
    (err, user) => {
      if (err) {
        res.statusCode = 500;
        res.setHeader("Content-Type", "application/json");
        res.json({ err: err });
      } else {
        passport.authenticate("local")(req, res, () => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json({ success: true, status: "Registeration Sucessful" });
        });
      }
    }
  );
});

router.post("/login", passport.authenticate("local"), (req, res) => {
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.json({ success: true, status: "You are successfully loggedin " });
});

router.get("/logout", (req, res, next) => {
  if (req.session) {
    req.session.destroy();
    res.clearCookie("session-id");
    res.status(200).send("Logged out successfully");
    // res.redirect("/login");
  } else {
    var err = new Error("You are not logged in!");
    err.status = 403;
    next(err);
  }
});

module.exports = router;
