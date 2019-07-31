const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { check, validationResult, body } = require('express-validator');
const passport = require('passport');

//Bring in User Model
const User = require('../models/UserModel');

// GET Register Form
router.get('/register', (req, res) => {
	res.render('register');
});

// POST register form
router.post(
	'/register',
	[
		check('name' )
			.not()
			.isEmpty().withMessage('Name is required')
			.matches(/^[a-zA-Z]+$/).withMessage("Name must ONLY BE  Alpha chars"),
		check('email', 'Email is required')
			.not()
			.isEmpty(),
		check('email', 'Email is not Valid').isEmail(),

		check('username' )
			.not()
			.isEmpty().withMessage('UserName is required')
			.matches("^[a-zA-Z0-9_]*$").withMessage("UserName must ONLY be AlphaNumeric"),
		
		check('password', 'Password is required')
			.not()
			.isEmpty(),
			check("password").isLength({min:5}).withMessage("Password must be at least 5 chars long"),
		check('password2', 'Passwords do not match').custom((value, { req }) => value === req.body.password),
	],

	(req, res) => {
		const name = req.body.name;
		const email = req.body.email;
		const username = req.body.username;
		const password = req.body.password;
		const password2 = req.body.password2;

		// Finds the validation errors in this request and wraps them in an object with handy functions
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			// const firsterror = errors.array()
			console.log(req.body);
			req.flash('errors', errors.array());
			return res.render('register', { errors: req.flash('errors'), newuser: req.body });
		} else {
			const newUser = new User({
				name,
				email,
				username,
				password,
			});

			bcrypt.genSalt(10, function(err, salt) {
				bcrypt.hash(newUser.password, salt, function(err, hash) {
					if (err) {
						console.log(err);
					}
					// Store hash in your password DB.
					newUser.password = hash;
					newUser.save(err => {
						if (err) {
							
							req.flash('danger', err.message);
							res.render('register');
							return;
						} else {
							req.flash('success', 'You are now registered');
							res.redirect('/user/login');
						}
					});
				});
			});
		}
	}
);

// GET LOGIN form
router.get('/login', (req, res) => {
	res.render('login');
});

//Login Check
router.post(
	'/login',
	passport.authenticate('local', {
		successRedirect: '/articles',
		failureRedirect: '/user/login',
		failureFlash: true,
		successFlash: 'Welcome to Author PAge',
	})
);

// logout
router.get('/logout', function(req, res) {
	req.logout();
	req.flash('success', 'You are logged out');
	res.redirect('/user/login');
});

module.exports = router;
/////

