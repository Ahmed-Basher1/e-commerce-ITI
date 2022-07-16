const express = require("express");
const controller = require("../controllers/customerController");
const router = express.Router();
const { body, param } = require("express-validator");
const validationMW = require("../middlewares/validationMW");

router
  .route("/customers/:id/cart")
  .post(
    [
      param("id")
        .isMongoId()
        .withMessage("Customer id should be a valid MongoID."),
      body("productId")
        .isMongoId()
        .withMessage("Product id should be a valid MongoID."),
      body("quantity")
        .isInt({ min: 1 })
        .withMessage("Quantity should be a number above 0"),
    ],
    validationMW,
    controller.addToCart
  )
  .delete(
    [
      param("id")
        .isMongoId()
        .withMessage("Customer id should be a valid MongoID."),
      body("productId")
        .isMongoId()
        .withMessage("Product id should be a valid MongoID."),
    ],
    validationMW,
    controller.removeFromCart
  );

router.put(
  "/customers/:id/cart/increment",
  [
    param("id")
      .isMongoId()
      .withMessage("Customer id should be a valid MongoID."),
    body("productId")
      .isMongoId()
      .withMessage("Product id should be a valid MongoID."),
  ],
  validationMW,
  controller.incrementProductInCart
);

router.put(
  "/customers/:id/cart/decrement",
  [
    param("id")
      .isMongoId()
      .withMessage("Customer id should be a valid MongoID."),
    body("productId")
      .isMongoId()
      .withMessage("Product id should be a valid MongoID."),
  ],
  validationMW,
  controller.decrementProductInCart
);
module.exports = router;
