const express = require("express")
const router = express.Router();

const orderController = require("../controllers/order-paymentController")

const authMw =  require("../middlewares/isAuthenticated");
const { body, param } = require("express-validator");
const validationMW = require("../middlewares/validationMW");

router.route("/orders").get(authMw,orderController.getOrders)
router.get("/myorders",authMw,orderController.getMyOrder)
router.route("/orders").post([body("userId")
.isMongoId()
.withMessage("User id should be a valid MongoID."),
body("orderItems")
.isArray()
.withMessage("orderItems  should be a valid Array."),
body("paymentMethod")
.isString()
.withMessage("paymentMethod should be a String"),
body("paymentResult").isObject()
.withMessage('paymentMethod  should be a valid Object.'),
body("shippingPrice").isNumeric()
.withMessage('shippingPrice  should be a valid Number.'),
body("totalPrice").isNumeric()
.withMessage('totalPrice  should be a valid Number.')
]
,authMw,validationMW,orderController.addOrders)
router.route('/getSingleOrder/:id').get(authMw,orderController.getOrderById)
router.route('/:id/pay').put(authMw,orderController.updateOrderToPaid)
router.route('/:id/deliver').put(authMw,orderController.updateOrderToDelivered)

module.exports = router