var db = require('../db/index.js');
module.exports = {

	allPosts: function(queryObject, callback) {
		db.Post.findAll({
				where: {
					isQuestionType: false
				},
				include: [db.User, db.Course, db.Tag]
			})
			.then(function(posts) {
				var formattedPosts = posts.map(function(post) {
					return {
						id: post.id,
						title: post.title,
						text: post.text,
						isCorrectAnswer: false,
						points: post.points,
						responses: post.responses,
						isAnswered: post.isAnswered,
						isGood: post.isGood,
						isPreferred: post.isPreferred,
						isClosed: post.isClosed,
						createdAt: post.createdAt,
						course: post.CourseId,
						tagname: post.TagId,
						user: post.UserId,
						// imgUrl: post.User.picture,
						updatedAt: post.updatedAt
					};
				});

				data = {};
				data.results = formattedPosts;
				callback(data);
			});
	},
	addPost: function(postData, callback) {

		db.Post.create({
				title: postData.title,
				text: postData.message,
				UserId: postData.userId,
				QuestionId: postData.questionId,
				ResponseId: postData.responseId,
				CourseId: postData.CourseId,
				TagId: postData.TagId
			})
			.then(function(result) {
				callback(result);
			});
	},

	deletePost: function(req, callback) {
		var postNumber = req.params.id;
		//TODO extract the user id out of the req somehow
		//or do the authentication in the front end
		var reqUserId = req.body.userId;
		db.Post.findById(postNumber)
			.then(function(post) {
				db.User.findById(reqUserId)
					.then(function(user) {
						if (user.isAdmin || user.isTeacher || user.id === post.userId) {
							db.Post.destroy({
									where: {
										id: postNumber,
									}
								})
								.then(function(post) {
									db.Votes.destroy({
											where: {
												PostId: postNumber
											}
										})
										.then(function() {
											callback(204);
										});
								});
						} else {
							callback(404);
						}
					});
			});
	},


	markAsPreferred: function(req, callback) {
		var postId = req.params.id;
		// reqUserId = req.body.userId;
		// db.Post.findById(req.params.id)
		// 	.then(function(post) {
		// 		db.User.findById(reqUserId)
		// 			.then(function(user) {
		// 				if (user.isTeacher) {
							db.Post.update({
									isPreferred: true
								}, {where : { id : postId }})
								.then(function(result) {
									callback(result);
								});
					// 	} else {
					// 		res.sendStatus(404);
					// 	}
					// });
			// });
	}

};