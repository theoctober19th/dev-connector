const express = require("express");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");

const router = express.Router();
const User = require("../../models/User");

//load input validation
const validateRegisterInput = require("../../validators/register");
const validateLoginInput = require("../../validators/login");

// @route   POST api/users/register
// @desc    Register new users
// @access  Public
router.post("/register", (request, response) => {
  const { errors, isValid } = validateRegisterInput(request.body);
  if (!isValid) {
    return response.status(400).json(errors);
  }
  const email = request.body.email;
  User.findOne({ email: email }).then(user => {
    if (user) {
      errors.email = "Email already exists.";
      return response.status(400).json(errors);
    } else {
      const avatar = gravatar.url(email, { s: "200", r: "pg", d: "mm" });
      const user = new User({
        name: request.body.name,
        email,
        avatar,
        password: request.body.password
      });
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(user.password, salt, (err, hash) => {
          if (err) throw err;
          user.password = hash;
          user
            .save()
            .then(user => {
              response.json(user);
            })
            .catch(error => console.log(error));
        });
      });
    }
  });
});

// @route   POST api/users/login
// @desc    Login a user
// @acces   Public
router.post("/login", (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ email }).then(user => {
    if (!user) {
      errors.email = "Email Does not exist.";
      return res.status(404).json(errors);
    }
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        // res.json({ message: "Success" });
        const payload = { ...user, password: null };
        const keys = require("../../config/keys");
        jwt.sign(
          payload,
          keys.secretOrKey,
          { expiresIn: 3600 },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token
            });
          }
        );
      } else {
        errors.password = "Password doesnt match the email.";
        return res.status(400).json(errors);
      }
    });
  });
});

// @route   POST api/users/current
// @desc    Return current user
// @access  Private
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    safeuser = { ...req.user._doc, password: null };
    res.json(safeuser);
  }
);

module.exports = router;
