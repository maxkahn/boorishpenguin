var db = require('../db/index.js');
var PostCtrl = require('./postController.js');
var CommentCtrl = require('./commentController.js');

module.exports = {

	allAnswers: function(req, res, callback) {
		PostCtrl.allPosts({
			isAnswerType: true,
			QuestionId: req.params.id
		}, function(answers) {
			callback(answers.results);
		});
	},

	newAnswer: function(req, res) {
		db.Post.findById(req.body.QuestionId)
			.then(function(question) {
				if (question.isClosed) {
					res.sendStatus(404);
				} else {
					PostCtrl.addPost(req.body, function(answer) {
						question.responses++;
						question.save();
						res.status(201).json(answer);
					});
				}
			});
	},

	deleteAnswer: function(req, res) {
		PostCtrl.deletePost(req, function(code) {
			res.sendStatus(code);
		});
	},

	markAsCorrectAnswer: function(req, res) {
		PostCtrl.markAsPreferred(req, function(post) {
			res.status(201).json(post);
		});
	},

};