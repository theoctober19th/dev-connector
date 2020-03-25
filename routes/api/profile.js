const express = require("express");
const gravatar = require("gravatar");
const passport = require("passport");
const mongoose = require("mongoose");

const Profile = require("../../models/Profile");
const User = require("../../models/User");

const validateProfileInput = require("../../validators/profile");
const validateExperienceInput = require("../../validators/experience");
const validateEducationInput = require("../../validators/education");
const router = express.Router();

// @route   GET api/profile
// @desc    Get Current User Profile
// @access  Private
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (request, response) => {
    const currentUser = request.user;
    const errors = {};
    Profile.findOne({ user: currentUser._id })
      .populate("user", ["name", "avatar"])
      .then(profile => {
        if (!profile) {
          errors.profile = "There is no profile for this user.";
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
    const { errors, isValid } = validateProfileInput(request.body);

    if (!isValid) {
      response.status(400).json(errors);
    }
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

// @route   POST api/profile/handle/<handle>
// @desc    Get Profile By Handle
// @access  Public
router.get("/handle/:handle", (request, response) => {
  const errors = {};
  Profile.findOne({ handle: request.params.handle })
    .populate("user", ["name", "avatar"])
    .then(profile => {
      if (!profile) {
        errors.profile = "There is no profile for this user.";
        response.status(404).json(errors);
      } else {
        response.json(profile);
      }
    })
    .catch(error => response.status(404).json(error));
});

// @route   POST api/profile/user/<userid>
// @desc    Get Profile By Handle
// @access  Public
router.get("/user/:userid", (request, response) => {
  const errors = {};
  Profile.findOne({ user: request.params.userid })
    .populate("user", ["name", "avatar"])
    .then(profile => {
      if (!profile) {
        errors.profile = "There is no profile for this user.";
        response.status(404).json(errors);
      } else {
        response.json(profile);
      }
    })
    .catch(error =>
      response
        .status(404)
        .json({ profile: "There is no profile for this user" })
    );
});

// @route   POST api/profile/all
// @desc    Get all Profiles
// @access  Public
router.get("/all", (request, response) => {
  Profile.find()
    .populate("user", ["name", "avatar"])
    .then(profiles => {
      response.json(profiles);
    })
    .catch(error =>
      response.status(404).json({ profile: "Could not fetch the profiles." })
    );
});

// @route   POST api/profile/experience
// @desc    Add experience to profile
// @access  Private
router.post(
  "/experience",
  passport.authenticate("jwt", { session: false }),
  (request, response) => {
    const { errors, isValid } = validateExperienceInput(request.body);
    if (!isValid) {
      return response.status(400).json(errors);
    }
    Profile.findOne({ user: request.user._doc._id }).then(profile => {
      const experience = {
        title: request.body.title,
        company: request.body.company,
        location: request.body.location,
        from: request.body.from,
        to: request.body.to,
        isCurrentlyWorking: request.body.isCurrentlyWorking,
        description: request.body.description
      };
      profile.experience.unshift(experience);
      profile
        .save()
        .then(profile => response.json(profile))
        .catch(error => response.status(400).json(error));
    });
  }
);

// @route   POST api/profile/experience
// @desc    Add experience to profile
// @access  Private
router.post(
  "/education",
  passport.authenticate("jwt", { session: false }),
  (request, response) => {
    const { errors, isValid } = validateEducationInput(request.body);
    if (!isValid) {
      return response.status(400).json(errors);
    }
    Profile.findOne({ user: request.user._doc._id }).then(profile => {
      const education = {
        school: request.body.school,
        degree: request.body.degree,
        field: request.body.field,
        from: request.body.from,
        to: request.body.to,
        isCurrentlyStudying: request.body.isCurrentlyStudying,
        description: request.body.description
      };
      profile.education.unshift(education);
      profile
        .save()
        .then(profile => response.json(profile))
        .catch(error => response.status(400).json(error));
    });
  }
);

// @route   DELETE api/profile/experience/<expid>
// @desc    Delete Experience from Profile
// @access  Private
router.delete(
  "/experience/:expid",
  passport.authenticate("jwt", { session: false }),
  (request, response) => {
    Profile.findOne({ user: request.user._doc._id }).then(profile => {
      //Get remove index
      const removeIndex = profile.experience
        .map(item => item._id)
        .indexOf(request.params.expid);
      profile.experience.splice(removeIndex, 1);
      profile
        .save()
        .then(profile => {
          response.json(profile);
        })
        .catch(error => response.status(404).json(error));
    });
  }
);

// @route   DELETE api/profile/education/<expid>
// @desc    Delete education from Profile
// @access  Private
router.delete(
  "/education/:eduid",
  passport.authenticate("jwt", { session: false }),
  (request, response) => {
    Profile.findOne({ user: request.user._doc._id }).then(profile => {
      //Get remove index
      const removeIndex = profile.education
        .map(item => item._id)
        .indexOf(request.params.eduid);
      profile.education.splice(removeIndex, 1);
      profile
        .save()
        .then(profile => {
          response.json(profile);
        })
        .catch(error => response.status(404).json(error));
    });
  }
);

module.exports = router;
