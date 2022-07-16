const express = require("express");
const router = express.Router();

const controller = require("../controllers/productController");

const validationMW = require("./../middleWares/validationMW");
const { body, param } = require("express-validator");

router
  .route("/products")
  .get(controller.getAllProducts)
  .post(
    [
      body("name").isString().withMessage("product name should be characters"),
      body("description")
        .isString()
        .withMessage("product description should be characters"),
      body("price").isNumeric().withMessage("product price should be numeric"),
      body("quantity")
        .isNumeric()
        .withMessage("product quantity should be numeric"),
      body("category")
        .isMongoId()
        .withMessage("product category should be mongo ID"),
      body("businessId")
        .isMongoId()
        .withMessage("product businessId should be mongo ID"),
      body("imageLink")
        .optional()
        .isString()
        .withMessage("image link should be string"),
    ],
    validationMW,
    controller.addProduct
  )
  .put(
    [
      body("id")
        .notEmpty()
        .isMongoId()
        .withMessage("product id should be mongo id"),
      body("name")
        .optional()
        .isString()
        .withMessage("product name should be characters"),
      body("description")
        .optional()
        .isString()
        .withMessage("product description should be characters"),
      body("price")
        .optional()
        .isNumeric()
        .withMessage("product price should be numeric"),
      body("quantity")
        .optional()
        .isNumeric()
        .withMessage("product quantity should be numeric"),
      body("category")
        .optional()
        .isMongoId()
        .withMessage("product category should be mongo ID"),
      body("businessId")
        .optional()
        .isMongoId()
        .withMessage("product businessId should be mongo ID"),
      body("imageLink")
        .optional()
        .isString()
        .withMessage("image link should be string"),
    ],
    validationMW,
    controller.updateProduct
  );

router
  .route("/products/:id")
  .get(
    [
      param("id")
        .notEmpty()
        .isMongoId()
        .withMessage("Product id should be mongo id"),
    ],
    validationMW,
    controller.getOneProduct
  )
  .delete(
    [
      param("id")
        .notEmpty()
        .isMongoId()
        .withMessage("Product id should be mongo id"),
    ],
    validationMW,
    controller.deleteOneProduct
  );

module.exports = router;
