const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const sgMail = require('@sendgrid/mail');
require('dotenv').config();

const User = require('../models/user');
const Customer = require('../models/customer');
const Business = require('../models/business');

sgMail.setApiKey(process.env.SEND_GRID_KEY);

module.exports.login = function login(req, res, next) {
	const { email, password } = req.body;

	User.findOne({ email: email })
		.then((user) => {
			if (!user) {
				// no email found
				return res.status(401).json({
					success: false,
					message: 'invalid email or password',
				});
			} else {
				bcrypt.compare(password, user.password).then((isEqual) => {
					if (!isEqual) {
						// password is incorrect
						return res.status(401).json({
							success: false,
							message: 'invalid email or password',
						});
					} else {
						// successful login
						const token = jwt.sign(
							{
								id: user._id,
								email: user.email,
								role: user.role,
							},
							process.env.JWT_SECRET_KEY,
							{ expiresIn: '1h' }
						);
						res.status(200).json({
							success: true,
							message: 'successful login',
							token: token,
							expireIn: '3600',
						});
					}
				});
			}
		})
		.catch((err) => {
			err.status = 500;
			next(err);
		});
};

module.exports.signup = function signup(req, res, next) {
	const { email, password, role, phone } = req.body;
	const address = {
		city: req.body.city,
		street: req.body.street,
		building: req.body.building,
		floor: req.body.floor,
	};

	User.findOne({ email: email })
		.then((user) => {
			if (user) {
				// email already exist in database
				return res.status(401).json({
					success: false,
					message: 'this email exist on our data',
				});
			} else {
				// hashing password and save data in USER collection
				bcrypt.hash(password, 10).then((hashedPassword) => {
					return new User({
						email: email,
						password: hashedPassword,
						role: role,
						phone: phone,
						address: address,
					})
						.save()
						.then((user) => {
							// saving data in CUSTOMER or BUSINESS collection
							if (user.role === 'customer') {
								const data = {
									firstname: req.body.firstname,
									lastname: req.body.lastname,
								};
								addCustomerData(user._id, data);
							} else {
								const data = {
									name: req.body.name,
									description: req.body.description,
								};
								addBusinessData(user._id, data);
							}
						})
						.then(() => {
							res.status(201).json({
								success: true,
								message: 'User created Successfully',
							});
						});
				});
			}
		})
		.catch((err) => {
			err.status = 500;
			next(err);
		});
};

module.exports.resetPassword = (req, res, next) => {
	const email = req.body.email;
	User.findOne({ email: email }).then((user) => {
		if (!user) {
			return res.status(404).json({
				success: false,
				message: "this email doesn't exist in our database",
			});
		} else {
			crypto.randomBytes(32, (err, buffer) => {
				if (err) {
					return res.status(500).json({
						success: false,
						message: 'an error has occured in our server, please try again',
					});
				}
				const resetToken = buffer.toString('hex');
				user.resetToken = resetToken;
				user.resetTokenExpiration = new Date(Date.now() + 3600000);
				user.save().then((doc) => {
					sgMail
						.send({
							to: email,
							from: 'moemen.said@gmail.com',
							subject: 'reset password',
							html: `<p>You requested a new password</p>
							<p>Click this <a href="https://websiteLink/Account/newPassword/${resetToken}?id=${doc._id}">link</a> to set a new password`,
						})
						.then((data) => {
							if (data[0].statusCode === 202) {
								return res.status(200).json({
									success: true,
									message: 'An email has been sent to you',
								});
							} else {
								return res.status(500).json({
									success: false,
									message: 'please try again later',
								});
							}
						})
						.catch((error) => {
							next(error);
						});
				});
			});
		}
	});
};

module.exports.setNewPassword = (req, res, next) => {
	const { newPassword, userId, resetToken } = req.body;
	User.findOne({
		resetToken: resetToken,
		resetTokenExpiration: { $gt: Date.now() },
		_id: userId,
	})
		.then((user) => {
			if (!user) {
				return res.status(401).json({
					success: false,
					message: 'password cannot be reset, please request a new password again',
				});
			}
			bcrypt.hash(newPassword, 10).then((hashedPassword) => {
				user.password = hashedPassword;
				user.resetToken = undefined;
				user.resetTokenExpiration = undefined;
				user.save()
					.then(() => {
						sgMail.send({
							to: user.email,
							from: 'moemen.said@gmail.com',
							subject: 'New Password Set',
							html: `<p>You have created a new password successfully</p>`,
						});
					})
					.then((data) => {
						if (data[0].statusCode === 202) {
							return res.status(200).json({
								success: true,
								message: 'An email has been sent to you',
							});
						} else {
							return res.status(500).json({
								success: false,
								message: 'please try again later',
							});
						}
					});
			});
		})
		.catch((err) => {
			err.status = 500;
			next(err);
			return res.status(500).json({
				success: false,
				message: 'password cannot be reset, please request a new password again',
			});
		});
};

function addCustomerData(userId, data) {
	return new Customer({
		userId: userId,
		name: {
			firstname: data.firstname,
			lastname: data.lastname,
		},
		cart: {
			products: [],
			totalPrice: 0,
		},
	}).save();
}

function addBusinessData(userId, data) {
	fs.readFile(path.join(__dirname, '..', 'images', 'business', 'default.webp'), function (err, data) {
		if (err) throw err;
		fs.writeFile(path.join(__dirname, '../', 'images', 'business', userId + '.webp'), data, function (err) {
			if (err) throw err;
		});
	});
	return new Business({
		userId: userId,
		name: data.name,
		description: data.description,
		imageLink: path.join(__dirname, '../', 'images', 'business', userId + '.webp'),
	}).save();
}
