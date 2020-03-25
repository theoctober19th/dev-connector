const validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateRegisterInput(data) {
  let errors = {};

  const name = !isEmpty(data.name) ? data.name : "";
  const email = !isEmpty(data.email) ? data.email : "";
  const password = !isEmpty(data.password) ? data.password : "";
  const password2 = !isEmpty(data.password2) ? data.password2 : "";

  if (!validator.isLength(name, { min: 2, max: 30 })) {
    errors.name = "Name must be between 2 and 30 characters";
  }

  if (!validator.isEmail(email)) {
    errors.email = "Email is invalid.";
  }

  if (validator.isEmpty(email)) {
    errors.email = "Email is required.";
  }

  if (validator.isEmpty(password)) {
    errors.password = "Password is required.";
  }

  if (!validator.equals(password, password2)) {
    errors.password2 = "Password and Confirm password fields should be same.";
  }

  if (validator.isEmpty(password2)) {
    errors.password2 = "Confirm Password is required.";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
