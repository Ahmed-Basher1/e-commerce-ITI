const express = require("express")
const router = express.Router();

const authController = require("../controllers/userAuth");

router.post('/login',authController.login)
router.post('/signup',authController.signup)
router.post('/resetPassword',authController.resetPassword)
router.post('/setnewPassword',authController.setNewPassword)

module.exports = router;