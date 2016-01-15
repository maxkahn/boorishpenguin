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

		PostCtrl.addPost(req.body, function(answer) {
			db.Post.findById(req.body.QuestionId)
				.then(function(question){
					question.responses++;
					question.save();
					res.status(201).json(answer);
				});
		});
	},

	deleteAnswer: function(req, res) {

		PostCtrl.deletePost(req.body, function(code) {
			res.sendStatus(code);
		});
	},

	markAsCorrectAnswer: function(req, res) {
		PostCtrl.markAsPreferred(req.body, function(post) {
			res.status(201).json(post);
		});
	},

};