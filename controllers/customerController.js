const mongoose = require("mongoose");
require("../models/customer");
require("../models/product");
const Customer = mongoose.model("customer");
const Product = mongoose.model("product");

module.exports.addToCart = async (req, res, next) => {
  try {
    const customer = await Customer.findById(req.params.id, {
      cart: 1,
    });

    if (!customer)
      return next(new Error("Couldn't find a customer with that id."));

    const product = await Product.findById(req.body.productId, {
      price: 1,
      quantity: 1,
    });

    if (!product)
      return next(new Error("Couldn't find a product with that id."));

    const { price: productPrice, quantity: productQuantity } = product;

    if (productQuantity < req.body.quantity)
      return next(new Error(`Item quantity in stock: ${productQuantity}`));

    const cart = customer.cart;

    const addedProduct = {
      productId: req.body.productId,
      quantity: req.body.quantity,
    };

    const duplicateProductIndex = cart.products.findIndex(
      (product) => product.productId == addedProduct.productId
    );

    if (duplicateProductIndex >= 0) {
      cart.products[duplicateProductIndex].quantity += addedProduct.quantity;
    } else {
      cart.products.push(addedProduct);
    }

    cart.totalPrice += productPrice * req.body.quantity;

    customer.cart = cart;

    await customer.save();
    res.status(201).json({
      success: true,
      message: "Product(s) added to cart successfully!",
    });
  } catch (e) {
    next(e);
  }
};

module.exports.removeFromCart = async (req, res, next) => {
  const customer = await Customer.findById(req.params.id, {
    cart: 1,
  });

  if (!customer)
    return next(new Error("Couldn't find a customer with that id."));

  try {
    const product = await Product.findById(req.body.productId, {
      price: 1,
      quantity: 1,
    });

    if (!product)
      return next(new Error("Couldn't find a product with that id."));

    const { price: productPrice, quantity: productQuantity } = product;
    const cart = customer.cart;

    const removedProductIndex = cart.products.findIndex(
      (product) => product.productId == req.body.productId
    );

    if (removedProductIndex === -1)
      return next(new Error("Couldn't find this product in the cart"));

    cart.totalPrice -=
      productPrice * cart.products[removedProductIndex].quantity;

    cart.products.splice(removedProductIndex, 1);

    customer.cart = cart;

    await customer.save();

    res.status(200).json({
      success: true,
      message: "Product(s) removed from cart successfully!",
    });
  } catch (e) {
    next(e);
  }
};

module.exports.incrementProductInCart = async (req, res, next) => {
  try {
    const customer = await Customer.findById(req.params.id, {
      cart: 1,
    });

    if (!customer)
      return next(new Error("Couldn't find a customer with that id."));

    const product = await Product.findById(req.body.productId, {
      price: 1,
      quantity: 1,
    });

    if (!product)
      return next(new Error("Couldn't find a product with that id."));

    const { price: productPrice, quantity: productQuantity } = product;

    const cart = customer.cart;

    const productInCartIndex = cart.products.findIndex(
      (product) => product.productId == req.body.productId
    );

    if (productInCartIndex === -1)
      return next(new Error("Cannot increment, product is not in cart"));

    if (productQuantity < cart.products[productInCartIndex].quantity + 1)
      return next(
        new Error(
          `Cannot increment, product max quantity in stock is ${productQuantity}`
        )
      );

    cart.products[productInCartIndex].quantity++;
    cart.totalPrice += productPrice;

    customer.cart = cart;

    await customer.save();
    res.status(200).json({
      success: true,
      message: "Product incremented successfully!",
    });
  } catch (e) {
    next(e);
  }
};

module.exports.decrementProductInCart = async (req, res, next) => {
  try {
    const customer = await Customer.findById(req.params.id, {
      cart: 1,
    });

    if (!customer)
      return next(new Error("Couldn't find a customer with that id."));

    const product = await Product.findById(req.body.productId, {
      price: 1,
    });

    if (!product)
      return next(new Error("Couldn't find a product with that id."));

    const { price: productPrice } = product;

    const cart = customer.cart;

    const productInCartIndex = cart.products.findIndex(
      (product) => product.productId == req.body.productId
    );

    if (productInCartIndex === -1)
      return next(new Error("Cannot decrement, product is not in cart"));

    if (cart.products[productInCartIndex].quantity == 1)
      return next(
        new Error(
          `Cannot decrement less than 1, you can remove the item instead`
        )
      );

    cart.products[productInCartIndex].quantity--;
    cart.totalPrice -= productPrice;

    customer.cart = cart;

    await customer.save();
    res.status(200).json({
      success: true,
      message: "Product decremented successfully!",
    });
  } catch (e) {
    next(e);
  }
};
