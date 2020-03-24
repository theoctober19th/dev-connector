const express = require("express");
const gravatar = require("gravatar");
const passport = require("passport");
const mongoose = require("mongoose");

const Profile = require("../../models/Profile");
const User = require("../../models/User");

const router = express.Router();

// @route   GET api/profile/test
// @desc    Test profile route
// @access  Public
router.get("/test", (request, response) =>
  response.json({ msg: "Hello, Profile Works" })
);

// @route   GET api/profile
// @desc    Get Current User Profile
// @access  Private
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (request, response) => {
    const currentUser = request.user;
    const errors = {};
    Profile.findOne({ user: currentUser._doc._id })
      .then(profile => {
        if (!profile) {
          errors.noprofile = "There is no profile for this user.";
          return response.status(404).json(errors);
        } else {
          response.json(profile);
        }
      })
      .catch(error => response.status(404).json(error));
  }
);

// @route   POST api/profile
// @desc    Create or Edit new User Profile
// @access  Private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (request, response) => {
    //get fields from the body
    const skills = [];
    const profileFields = {};
    profileFields.user = request.user._doc._id;
    if (request.body.handle) profileFields.handle = request.body.handle;
    if (request.body.company) profileFields.company = request.body.company;
    if (request.body.website) profileFields.website = request.body.website;
    if (request.body.location) profileFields.location = request.body.location;
    if (request.body.bio) profileFields.bio = request.body.bio;
    if (request.body.status) profileFields.status = request.body.status;
    if (request.body.githubUsername)
      profileFields.githubUsername = request.body.githubUsername;

    if (typeof request.body.skills !== undefined) {
      profileFields.skills = request.body.skills.split(",");
    }

    profileFields.social = {};
    if (request.body.youtube)
      profileFields.social.youtube = request.body.youtube;
    if (request.body.twitter)
      profileFields.social.twitter = request.body.twitter;
    if (request.body.facebook)
      profileFields.social.facebook = request.body.facebook;
    if (request.body.linkedin)
      profileFields.social.linkedin = request.body.linkedin;
    if (request.body.instagram)
      profileFields.social.instagram = request.body.instagram;

    Profile.findOne({ user: request.user._doc._id }).then(profile => {
      if (profile) {
        //do update
        Profile.findOneAndUpdate(
          { user: request.user._doc._id },
          { $set: profileFields },
          { new: true }
        ).then(profile => response.json(profile));
      } else {
        //do create
        Profile.findOne({ handle: profileFields.handle }).then(profile => {
          if (profile) {
            errors.handle = "That handle already exists.";
            response.status(400).json(errors);
          }
          new Profile(profileFields)
            .save()
            .then(profile => response.json(profile));
        });
      }
    });
  }
);
module.exports = router;
