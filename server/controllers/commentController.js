var db = require('../db/index.js');
var PostCtrl = require('./postController.js');


module.exports = {
	allComments: function(req, res, callback) {

	PostCtrl.allPosts({
		isQuestionType: false, 
		isAnswerType: false, 
		ResponseId: req.body.responseId }, function(data) {
			callback(data);
		});
	},

	newComment: function(req, res) {

		PostCtrl.addPost(req.body, function(data) {
			res.status(201).json(data);
		});

	},

	deleteComment: function(req, res) {

		PostCtrl.deletePost(req.body, function(code) {
			res.sendStatus(code);
		});
	},
};