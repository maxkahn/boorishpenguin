var db = require('../db/index.js');
var PostCtrl = require('./postController.js');
var AnswCtrl = require('./answerController.js');


module.exports = {
	allQuestions: function(req, res) {

	PostCtrl.allPosts({isQuestionType: true}, function(data) {
			res.json(data);
		});
	},

	renderQuestion: function(req, res) {
		db.Post.findById(req.params.id)
			.then(function(question){
				var questionComponents = [];
				AnswCtrl.allAnswers(req, res, function(data) {
			})
				.then(function(result){
					res.json(result);
				});

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