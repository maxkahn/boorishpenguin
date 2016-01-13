var db = require('../db/index.js');
var PostCtrl = require('./postController.js');

module.exports = {

	allAnswers: function(req, res, callback) {

	PostCtrl.allPosts({isAnswerType: true,
		QuestionId: req.body.questionId}, function(data) {
			//data an array of answers
				//add the question at the head of the array
				//for each answer, attach an array of comments
			callback(data);
		});
	},

	newAnswer: function(req, res) {

		PostCtrl.addPost(req.body, function(data) {
			res.status(201).json(data);
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