const validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateLoginInput(data) {
  let errors = {};

  const email = !isEmpty(data.email) ? data.email : "";
  const password = !isEmpty(data.password) ? data.password : "";

  if (!validator.isEmail(email)) {
    errors.email = "Email is invalid.";
  }

  if (validator.isEmpty(email)) {
    errors.email = "Email is required.";
  }

  if (validator.isEmpty(password)) {
    errors.password = "Password is required.";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
