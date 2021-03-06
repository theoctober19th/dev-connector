const validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateProfileInput(data) {
  let errors = {};

  const handle = !isEmpty(data.handle) ? data.handle : "";
  const status = !isEmpty(data.status) ? data.status : "";
  const skills = !isEmpty(data.skills) ? data.skills : "";

  if (!validator.isLength(handle, { min: 2, max: 40 })) {
    errors.handle = "Handle needs to be within 2 to 40 characters";
  }

  if (validator.isEmpty(handle)) {
    errors.handle = "Profile handle is required";
  }

  if (validator.isEmpty(status)) {
    errors.status = "Status field is required";
  }

  if (validator.isEmpty(skills)) {
    errors.skills = "Skills field is required";
  }

  if (!isEmpty(data.website)) {
    if (!validator.isURL(data.website)) {
      errors.website = "Not a valid URL";
    }
  }

  if (!isEmpty(data.facebook)) {
    if (!validator.isURL(data.facebook)) {
      errors.facebook = "Not a valid URL";
    }
  }

  if (!isEmpty(data.twitter)) {
    if (!validator.isURL(data.twitter)) {
      errors.twitter = "Not a valid URL";
    }
  }

  if (!isEmpty(data.youtube)) {
    if (!validator.isURL(data.youtube)) {
      errors.youtube = "Not a valid URL";
    }
  }

  if (!isEmpty(data.linkedin)) {
    if (!validator.isURL(data.linkedin)) {
      errors.linkedin = "Not a valid URL";
    }
  }

  if (!isEmpty(data.instagram)) {
    if (!validator.isURL(data.instagram)) {
      errors.instagram = "Not a valid URL";
    }
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
