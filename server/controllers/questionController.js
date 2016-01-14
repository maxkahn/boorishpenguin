var db = require('../db/index.js');
var PostCtrl = require('./postController.js');
var AnswCtrl = require('./answerController.js');


module.exports = {
	allQuestions: function(req, res) {
		console.log('server-side allQuestions invoked');

		console.log('server-side allQuestions invoked');

	PostCtrl.allPosts({isQuestionType: true}, function(data) {
			res.json(data);
		});
	},

	renderQuestion: function(req, res) {
		db.Post.findById(req.params.id)
			.then(function(question) {
				var questionComponents = [question];
				question.body = {};
				question.body.questionId = req.params.id;
				AnswCtrl.allAnswers(question, res, function(data) {
						//data should ba an array of answer objects with a comments property
						//which is an array of comment objects.
						var questionData = questionComponents.concat(data);
					})
					.then(function(result) {
						res.json(questionData);
					});

			});
	},

	newQuestion: function(req, res) {
		PostCtrl.addPost(req.body, function(data) {
			res.status(201).json(data);
		});

	},

	deleteQuestion: function(req, res) {
		//console.log(req.user)
		PostCtrl.deletePost(req, function(code) {
			res.sendStatus(code);
		});
	},

	markAsGoodQuestion: function(req, res) {
		PostCtrl.markAsPreferred(req, function(post) {
			res.status(201).json(post);
		});
	},

	toggleCloseQuestion: function(req, res) {
		//we need postId, userid, boolean close/open
		db.User.findById(req.body.userId)
			.then(function(user) {
				if (user.isTeacher || user.isAdmin) {
					db.Post.findById(req.params.id)
						.then(function(post) {
							post.update({
									isClosed: !post.isClosed
								})
								.then(function() {
									res.status(201).json(post);
								});
						});
				} else {
					res.sendStatus(404);
				}
			});
	}
};