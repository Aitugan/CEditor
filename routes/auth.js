var express = require("express");
var router = express.Router();
var passport = require("passport");

router
  .route("/login")
  .get((req, res, next) => {
    res.render("login", { title: "Login" });
  })
  .post(
    passport.authenticate("local", {
      failureRedirect: "/login",
    }),
    function (req, res) {
      res.redirect("/");
    }
  );

router
  .route("/register")
  .get((req, res, next) => {
    res.render("register", { title: "Register a new account" });
  })
  .post(function (req, res, next) {
    req.checkBody("name", "Empty name").notEmpty();
    req.checkBody("email", "Invalid email").notEmpty();
    req.checkBody("password", "Empty password").notEmpty();
    req
      .checkBody("password", "password do not match")
      .equals(req.body.confirmPassword)
      .notEmpty();

    var errors = req.validationErrors();
    if (errors) {
      res.render("register", {
        name: req.body.name,
        email: req.body.email,
        errorMessages: errors,
      });
    } else {
      var user = new User();
      user.name = req.body.name;
      user.email = req.body.email;
      user.setPassword(req.body.password);
      user.save(function (err) {
        if (err) {
          res.render("register", { errorMessages: err });
        } else {
          res.redirect("/login");
        }
      });
    }
  });

router.get("/logout", function (req, res) {
  req.logout();
  res.redirect("/");
});

router.get(
  "/auth/facebook",
  passport.authenticate("facebook", { scope: "email" })
);
router.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", {
    successRedirect: "/",
    failureRedirect: "/",
  })
);

module.exports = router;
