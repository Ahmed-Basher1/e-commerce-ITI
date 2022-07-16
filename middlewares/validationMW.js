const { validationResult } = require("express-validator");

module.exports = (request, response, next) => {
  const result = validationResult(request);
  if (!result.isEmpty()) {
    const message = result.errors.reduce(
      (current, error) => current + error.msg + " ",
      ""
    );
    let error = new Error(message);
    error.status = 442;
    throw error;
  }
  next();
};
