var db = require('../db/index.js');
module.exports = {

	allPosts: function(queryObject, callback) {

		db.Post.findAll({
				where: queryObject,
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
						isClosed: post.isClosed,
						createdAt: post.createdAt,
						coursename: post.Course.name,
						tagname: post.Tag.name,
						user: post.User.name,
						imgUrl: post.User.picture,
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
			.then(callback(result));
	},

	deletePost: function(deleteData, callback) {
		// var postId = req.params.id;
		// var reqName = req.user.profile.emails[0].value;
		db.User.findById(deleteData.userId)
			.then(function(user) {
				db.Post.findById(deleteData.postId)
					.then(function(post) {
						if (user.isAdmin || user.isTeacher || post.UserId === deleteData.userId) {

							db.Vote.destroy({
									where: {
										PostId: deleteData.postId
									}
								})
								.then(function() {
									callback(204);
								});
						} else {
							callback(404);
						}
					});
			});
	},

	markAsPreferred: function(markData, callback) {
		db.Post.findById(markData.postId)
			.then(function(post) {
				db.User.findById(markData.userId)
					.then(function(user) {
						if (user.isTeacher) {
							post.update({
									isPreferred: true
								})
								.then(function() {
									callback(post);
								});
						}
					});
			});
	}

};