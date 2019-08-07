const express = require('express');
const router = express.Router();
const Article = require('../models/ArticleModel');
const User = require('../models/UserModel');
const Comment = require('../models/CommentModel');
// const expressValidator = require('../validators/expressValidator');
const { check, validationResult } = require('express-validator');

// GET HOMEPAGE articles
router.get('/', (req, res) => {
	Article.find()
		.sort({ date: -1 })
		.exec((err, articles) => {
			if (err) {
				return console.log(err);
			} else {
				// console.log('the order id is ' + articles);
				res.render('homepage', { articles });
			}
		});
});

// GET INFO on AN Article
router.get('/info/:id', (req, res) => {
	Article.findById(req.params.id)
		.populate('comments')
		.exec((err, article) => {
			if (err) {
				return console.log(err);
			} else {
				User.findById(article.author, (err, usercomment) => {
					if (err) {
						return console.log(err);
					} else {
						// console.log(usercomment);
						// console.log('author id : ' + article.author);
						// console.log('The author is ' + user.name);
						res.render('article_info', { article, usercomment });
					}
				});
			}
		});
});

//ADD AN ARTICLE

// GET an article form
router.get('/add', ensureAuthenticated, (req, res) => {
	res.render('add_article');
});
// router.get("/add",(req,res)=>{
// 	res.send("yes")
// })

// POST an Article
router.post(
	'/add',
	[
		check('title', 'title is required')
			.not()
			.isEmpty(),

		check('description', 'description is required')
			.not()
			.isEmpty(),
	],
	(req, res) => {
		// Finds the validation errors in this request and wraps them in an object with handy functions
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			// const firsterror = errors.array()
			// console.log( firsterror[1].msg)
			req.flash('errors', errors.array());
			return res.render('add_article', { errors: req.flash('errors') });
		} else {
			const article = new Article();
			article.title = req.body.title;
			article.author = req.user._id;
			article.description = req.body.description;

			article.save(err => {
				if (err) {
					return console.log(err);
				} else {
					req.flash('success', 'Article added');
					res.redirect('/articles');
				}
			});
		}
	}
);

// UPDATE AN ARTICLE

//GET article by ID to update
router.get('/update/:id', ensureAuthenticated, (req, res) => {
	Article.findById(req.params.id, (err, article) => {
		if (article.author != req.user._id) {
			req.flash('danger', ' not authorized');
			res.redirect('/articles');
		} else {
			// res.send(article)
			res.render('update_article', { article });
		}
	});
});
//POST updated article
router.post('/update/:id', ensureAuthenticated, (req, res) => {
	Article.findByIdAndUpdate(req.params.id, req.body, (err, article) => {
		if (err) {
			return console.log(err);
		} else {
			res.redirect('/articles/info/' + req.params.id);
		}
	});
});

// Delete an Article
router.delete('/delete/:id', ensureAuthenticated, (req, res) => {
	if (!req.user._id) {
		res.status(500).send();
	}
	Article.findById(req.params.id, (err, article) => {
		if (article.author != req.user._id) {
			res.status(500).send();
		} else {
			Article.findByIdAndDelete(req.params.id, err => {
				if (err) {
					return console.log(err);
				} else {
					res.send('success');
				}
			});
		}
	});
});

//VIEW ALL Articles by one Author
router.get("/author/:id", ensureAuthenticated,(req,res)=>{
	Article.find({author:req.params.id})
	.sort({ date: -1 })
	.then(articles=>{
		res.render("authorArticles",{articles})
	})
	.catch(err=>{
		console.log(err)
	})
})

// Access Control
function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	} else {
		req.flash('danger', 'Please Login');
		res.redirect('/user/login');
	}
}

module.exports = router;
