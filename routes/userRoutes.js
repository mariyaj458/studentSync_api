var express = require("express");
const bodyParser = require("body-parser");
var User = require("../models/user");

var router = express.Router();
router.use(bodyParser.json());

router.post("/signup", (req, res, next) => {
  User.findOne({ username: req.body.username })
    .then((user) => {
      if (user != null) {
        var err = new Error("User " + req.body.username + " already exist");
        err.Status = 403;
        next(err);
      } else {
        return User.create({
          username: req.body.username,
          password: req.body.password,
        });
      }
    })
    .then(
      (user) => {
        res.StatusCode == 200;
        res.setHeader("Content-Type", "application/json");
        res.json({ status: "Registeration Sucessful", user: user });
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
});

router.post("/login", (req, res, next) => {
  if (!req.session.user) {
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
    User.findOne({ username: username })
      .then((user) => {
        if (user === null) {
          return res
            .status(403)
            .json({ message: "User" + username + "does not exist!" });
        } else if (user.password !== password) {
          return res
            .status(403)
            .json({ message: "Your password is incorrect" });
        } else if (user.username === username && user.password === password) {
          req.session.user = "autheticated";
          res.statusCode = 200;
          res.setHeader("Content-Type", "text/plain");
          res.end("You are Autheticated");
        }
      })
      .catch((err) => next(err));
  } else {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    res.end("You are Already Autheticated");
  }
});

router.get("/logout", (req, res, next) => {
  if (req.session) {
    req.session.destroy();
    res.clearCookie("session-id");
    res.status(200).json({ message: "Logged out successfully" });
    // res.redirect("/login");
  } else {
    var err = new Error("You are not logged in!");
    err.status = 403;
    next(err);
  }
});

module.exports = router;
