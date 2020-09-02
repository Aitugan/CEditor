var express = require("express");
var router = express.Router();

var nodemailer = require("nodemailer");
var config = require("../config");
var transporter = nodemailer.createTransport(config.mailer);

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", {
    title: "CEditor - code editor for working on code with teammate.",
  });
});

router.get("/about", function (req, res, next) {
  res.render("about", {
    title: "CEditor - code editor for working on code with teammate.",
  });
});

router
  .route("/contact")
  .get(function (req, res, next) {
    res.render("contact", {
      title: "CEditor - code editor for working on code with teammate.",
    });
  })
  .post(function (req, res, next) {
    req.checkBody("name", "Empty name").notEmpty();
    req.checkBody("email", "Invalid email").isEmail();
    req.checkBody("message", "Empty message").notEmpty();
    var errors = req.validationErrors();

    if (errors) {
      res.render("contact", {
        title: "CEditor - code editor for working on code with teammate.",
        name: req.body.name,
        email: req.body.email,
        message: req.body.message,
        errorMessages: errors,
      });
    } else {
      var mailOption = {
        from: "CEditor <no-reply@ceditor.com>",
        to: "mirash2001@gmail.com",
        subject: "You got a new message from visitor 👋🏻",
        text: req.body.message,
      };

      transporter.sendMail(mailOption, (error, info) => {
        if (error) {
          return console.log(error);
        }
      });

      res.render("thank", {
        title: "CEditor - code editor for working on code with teammate.",
      });
    }
  });

module.exports = router;
