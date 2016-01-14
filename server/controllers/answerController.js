var db = require('../db/index.js');
var PostCtrl = require('./postController.js');
var CommentCtrl = require('./commentController.js');

module.exports = {

	allAnswers: function(req, res, callback) {

	PostCtrl.allPosts({isAnswerType: true,
		QuestionId: req.body.questionId}, function(data) {
			//data an array of answers
				//add the question at the head of the array
				//for each answer, attach an array of comments
			var answerArray = data.map(function(answer) {
				answer.body = {};
				answer.body.responseId = answer.id;
				CommentCtrl.allComments(answer, res, function(data) {
					answer.comments = data;
				});
				return answer;
			})
			.then(function(){
				callback(answerArray);
			});
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