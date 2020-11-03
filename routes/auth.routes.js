const express = require("express");
const router = express.Router();
const passport = require("passport");
const ensureLogin = require("connect-ensure-login");
// Require user model
const User = require("../models/User.model");
// Add bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

//sign up functionality
router.get("/signup", (req, res) => {
  res.render("auth/signup");
});

router.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  if (password.length < 8) {
    res.render("auth/signup", {
      message: "Your password must be 8 characters minimum",
    });
    return;
  }
  if (username === "") {
    res.render("auth/signup", { message: "Your username cannot be empty" });
    return;
  }

  User.findOne({ username: username }).then((found) => {
    if (found !== null) {
      res.render("auth/signup", { message: "Username is already taken" });
    } else {
      const salt = bcrypt.genSaltSync();
      const hashPass = bcrypt.hashSync(password, salt);

      User.create({ username: username, password: hashPass })
        .then((dbUser) => {
          res.render("auth/login");
        })
        .catch((err) => {
          next(err);
        });
    }
  });
});

//login functionality
router.get("/login", (req, res, next) => {
  res.render("auth/login", { "message": req.flash("error") });
});

router.post("/login",
  passport.authenticate("local", {
    successRedirect: "/private",
    failureRedirect: "/login",
    failureFlash: true,
    passReqToCallback: true,
  })
);

// Add passport for authentication. Must go below other routes.
router.get("/private", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("private", { user: req.user });
});

//Logout
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/login");
});

module.exports = router;
