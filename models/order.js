const mongoose = require("mongoose");

const { addressSchema } = require('./common')

const orderItemSchema = mongoose.Schema({
    productId: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'product',
    },
    businessId: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'user'
    },
    name: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    imageLink: {
        type: String,
        required: true
    },
    unitPrice: {
        type: Number,
        required: true
    }
}, {
    _id: false
})

// const reviewSchema = mongoose.Schema({
//     review: String,
//     rate: String
// }, { _id: false })

const orderSchema = mongoose.Schema(
    {
        _id: {
            type: mongoose.Types.ObjectId,
            required: true,
            auto: true
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'user',
        },
        orderItems: [{
            
            type: orderItemSchema,
            required: true,
        }],
     address: {
            type: addressSchema,
        },
        paymentMethod: {
            type: String,
            enum: ['COD', 'Credit Card', 'Paypal'],
            required: true,
        },
        paymentResult: {
            id: { type: String },
            status: { type: String },
            update_time: { type: String },
            email_address: { type: String },
        },
        shippingPrice: {
            type: Number,
            required: true,
            default: 0.0,
        },
        totalPrice: {
            type: Number,
            required: true,
            default: 0.0,
        },
        isPaid: {
            type: Boolean,
            required: true,
            default: false,
        },
        status: {
            type: String,
            enum :["Delivered","Shipped","order"],
            required: true,
            default: "order",
        },
        // review: reviewSchema,
        deliveredAt: Date,
        paidAt: Date,

    },
    {
        timestamps: true,
    }
)

module.exports = mongoose.model('orders', orderSchema)