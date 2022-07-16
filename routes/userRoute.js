const express = require("express");
const controller = require("../controllers/userController");
const router = express.Router();
const { body, param } = require("express-validator");
const validationMW = require("../middlewares/validationMW");

router
  .route("/users/:id")
  .put(
    [
      param("id")
        .isMongoId()
        .withMessage("User'is id should be a valid MongoID"),
      body("email")
        .optional()
        .isEmail()
        .withMessage("User's email should be a valid email"),
      body("phone")
        .optional()
        .isNumeric()
        .withMessage("User's phone should be a valid phone number"),
      body("city")
        .optional()
        .isString()
        .withMessage("Users's city should be a valid string"),
      body("street")
        .optional()
        .isString()
        .withMessage("Users's street should be a valid string"),
      body("building")
        .optional()
        .isNumeric()
        .withMessage("Users's building should be a valid number"),
    ],
    validationMW,
    controller.updateUser
  )
  .delete(
    [
      param("id")
        .isMongoId()
        .withMessage("User'is id should be a valid MongoID"),
    ],
    validationMW,
    controller.removeUser
  );

module.exports = router;
