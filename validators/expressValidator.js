const { check, validationResult } = require('express-validator');

exports.expressValidator = (req, res, next) => {
	check('title', 'title is required')
		.not()
		.isEmpty(),
		check('author', 'author is required')
			.not()
			.isEmpty(),
		check('description', 'description is required')
			.not()
			.isEmpty();
	// Finds the validation errors in this request and wraps them in an object with handy functions
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		// const firsterror = errors.array()
		console.log( errors)
		req.flash('errors', errors.array());
		res.render('add_article', { errors: req.flash('errors') });
	}
	next();
};
