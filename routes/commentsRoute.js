const express = require('express');
const router = express.Router();
const Article = require('../models/ArticleModel');

const Comment = require('../models/CommentModel');
/*
-------------------
COMMENTS ROUTES
------------------
*/
// GET A NEW comment form
router.get('/:id/comment/new', ensureAuthenticated, (req, res) => {
	Article.findById(req.params.id, (err, article) => {
		if (err) {
			console.log('error:Page not found');
		} else {
			console.log(article);
			res.render('newComment', { article });
		}
	});
	// console.log("The article URL is : " + req.originalUrl)
	// console.log("The article id is : "+ req.params.id )
	// res.send("Add new form")
});

// POST a NEW Comment to an article

router.post('/:id/comment', ensureAuthenticated, (req, res) => {
	// Look up Article by ID
	Article.findById(req.params.id, (err, article) => {
		// console.log("article is " + article)
		if (err) {
			console.log(err);
			res.redirect('/articles');
		} else {
			// create new Comment
			Comment.create(req.body.comment, (err, comment) => {
				if (err) {
					console.log(err);
				} else {
					// add username and user id to comment model
					comment.id = req.user._id;
					comment.username = req.user.username;
					// save the comment
					comment.save();

					article.comments.push(comment);
					article.save();

					// Redirect to article info show page
					req.flash('success', 'Successfully added a comment');
					// res.send("Added coment")
					res.redirect('/articles/info/' + article._id);
				}
			});
		}
	});
});

// Delete A Comment

router.delete('/:id/comment/:comment_id', ensureAuthenticated, (req, res) => {
	if (!req.user._id) {
		res.status(500).send();
	}

	Article.findByIdAndUpdate(
		req.params.id,
		{
			$pull: { comments: req.params.comment_id },
		},
		err => {
			if (err) {
				res.status(500).send('Internal Error');
			} else {
				Comment.findByIdAndDelete(req.params.comment_id, err => {
					if (err) {
						req.flash('error', err.message);
						return res.redirect('back');
					} else {
						res.send('success');
					}
				});
			}
		}
	);

	// console.log("the endpoint works here")
	// res.send("hurray")
});

// GET a comment form to UPDATE
router.get('/:id/comment/:comment_id/update', ensureAuthenticated, (req, res) => {
	Comment.findById(req.params.comment_id, (err, comment) => {
		console.log('the comment object is : ' + comment);
		if (comment.id.equals(req.user._id)) {
			res.render('commentUpdate', { comment, artId: req.params.id });
		} else {
			req.flash('danger', ' not authorized');
			res.redirect('/articles/' + req.params.id);
		}
	});
});

//POST updated article
router.post('/:id/comment/:comment_id/update', ensureAuthenticated, (req, res) => {
	console.log(req.params.id);
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, article) => {
		console.log('The article object is :' + article);
		if (err) {
			return res.send(err);
		} else {
			res.redirect('/articles/info/' + req.params.id);
			// res.send(article)
		}
	});
	// res.send("comment updated")
});

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
//

