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
		PostCtrl.allPosts({
			id: req.params.id
		}, function(question){
			question = question.results;
			AnswCtrl.allAnswers(req, res, function(answers) {
				question = question.concat(answers);
				res.status(200).json(question);
			});
		});
	},

	newQuestion: function(req, res) {

		PostCtrl.addPost(req.body, function(data) {
			res.status(201).json(data);
		});

	},

	deleteQuestion: function(req, res) {
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
	},

	removePost: function(req, res, next){
		var postId = req.body.postId;
		db.Post.findById(postId)
			.then(function(post){
				post.isDeleted = true;
				post.save();
				res.sendStatus(200);
			});
	},

	closePost: function(req, res, next){
		var postId = req.body.postId;
		db.Post.findById(postId)
			.then(function(post){
				post.isClosed = true;
				post.save();
				res.sendStatus(200);
			});
	}
};