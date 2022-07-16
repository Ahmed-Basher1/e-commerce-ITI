const mongoose = require("mongoose");


const { nameSchema } = require("./common");


const productsSchema = mongoose.Schema(
  {
    productId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "product",
    },
    quantity: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

const cartSchema = mongoose.Schema(
  {
    products: [
      {
        type: productsSchema,
        required: false,
      },
    ],
    totalPrice: {
      type: Number,
      default: 0,
      required: false,
    },
  },
  { _id: false }
);

const customerSchema = mongoose.Schema({
  _id: {
    type: mongoose.Types.ObjectId,
    required: true,
    auto: true,
  },
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "user",
    unique: true,
    required: true

  },
  name: {
    type: nameSchema,
    required: true,
  },
  cart: {
    type: cartSchema,
    default: { products: [], totalPrice: 0 },
  },
});

module.exports = mongoose.model("customer", customerSchema);
