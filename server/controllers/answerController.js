var db = require('../db/index.js');
var PostCtrl = require('./postController.js');
var CommentCtrl = require('./commentController.js');

module.exports = {

	allAnswers: function(req, res, callback) {
		console.log(req.body.id);
		PostCtrl.allPosts({ isAnswerType: true, QuestionId: req.params.id }, function(data) {
			//data an array of answers
			//add the question at the head of the array
			//for each answer, attach an array of comments

			// var answerArray = data.results.map(function(answer) {
			// 	answer.body = {};
			// 	answer.body.responseId = answer.id;
			// 	// CommentCtrl.allComments(answer, res, function(data) {
			// 	// 	answer.comments = data;
			// 	// });
			// 	return answer;
			// })
			// .then(function(){
			// 	callback(answerArray);
			// });

			// data.results.forEach(function(answer){
			// 	req.body.responseId = answer.id;
			// 	CommentCtrl.allComments(req, res, function(comments) {
			// 		answer.comments = comments;
			// 	});
			// });

			callback(data.results);
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