const validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateEducationData(data) {
  let errors = {};

  const school = !isEmpty(data.school) ? data.school : "";
  const degree = !isEmpty(data.degree) ? data.degree : "";
  const field = !isEmpty(data.field) ? data.field : "";
  const from = !isEmpty(data.from) ? data.from : "";

  if (validator.isEmpty(school)) {
    errors.school = "School field is required.";
  }
  if (validator.isEmpty(degree)) {
    errors.degree = "Degree field is required.";
  }
  if (validator.isEmpty(from)) {
    errors.from = "From date field is required.";
  }
  if (validator.isEmpty(field)) {
    errors.field = "Study field is required.";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
