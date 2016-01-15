var db = require('../db/index.js');
var PostCtrl = require('./postController.js');


module.exports = {
	
	allComments: function(req, res) {
		PostCtrl.allPosts({
			isQuestionType: false,
			isAnswerType: false,
			ResponseId: req.params.id
		}, function(data) {
			res.status(200).json(data);
		});
	},

	newComment: function(req, res) {

		PostCtrl.addPost(req.body, function(comment) {
			db.Post.findById(req.body.responseId)
				.then(function(answer) {
					answer.responses++;
					answer.save();
					res.status(201).json(comment);
				});
		});
	},

	deleteComment: function(req, res) {

		PostCtrl.deletePost(req, function(code) {
			res.sendStatus(code);
		});
	},
};