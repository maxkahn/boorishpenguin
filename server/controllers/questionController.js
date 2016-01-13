var db = require('../db/index.js');
var UCtrl = require('./userControllers.js');
var PostCtrl = require('./postController.js');


module.exports = {
	allQuestions: function(req, res) {

	PostCtrl.allPost({isQuestionType: true}, function(data) {
			res.json(data);
		});
	},

	newQuestion: function(req, res) {

		PostCtrl.addPost(req.body, function(data) {
			res.status(201).json(data);
		});

	},

	deleteQuestion: function(req, res) {

		PostCtrl.deletePost(req.body, function(code) {
			res.sendStatus(code);
		});
	},

	markAsGoodQuestion: function(req, res) {
		PostCtrl.markAsPreferred(req.body, function(post) {
			res.status(201).json(post);
		});
	},

	toggleCloseQuestion: function(req, res) {
		//we need postId, userid, boolean close/open
		db.User.findById(req.body.userId)
			.then(function(user) {
				if (user.isTeacher || user.isAdmin) {
					db.Post.findById(req.body.postId)
						.then(function(post) {
							post.update({
								isClosed: req.body.isClosed
							})
							.then(function() {
								res.status(201).json(post);
							});
						});
				}
				else {
					res.sendStatus(404);
				}
			});
	}
};