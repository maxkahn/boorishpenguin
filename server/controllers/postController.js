var db = require('../db/index.js');
module.exports = {

	allPost: function(queryObject) {

		db.Post.findAll({
				where: queryObject,
				include: [db.User, db.Course, db.Tag]
			})
			.then(function(posts) {
				var formattedQs = posts.map(function(post) {
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
				data.results = formattedQs;
				res.json(data);
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


	//TODO: move to votes controller
	// upvotePost: function(queryObject) {

	// 	db.Vote.create({
	// 			where: queryObject,
	// 			include: [db.User, db.Post]
	// 		})
	// 		.then()
	// },

	deletePost: function(postId, userId, callback) {
		// var postId = req.params.id;
		// var reqName = req.user.profile.emails[0].value;
		db.User.findById(userId)
			.then(function(user) {
				db.Post.findById(postId)
					.then(function(post) {
						if (user.isAdmin || user.isTeacher || post.UserId === userId) {

							db.Vote.destroy({
									where: {
										PostId: postId
									}
								})
								.then(function() {
									callback(post);
								})
								.then(function() {
									res.sendStatus(204);
								})
						} else {
							res.sendStatus(404);
						}
					});
			});
	},

	markAsPreferred: function(postId, userId, callback) {
		db.Post.findById(postId)
			.then(function(post) {
				db.User.findById(userId)
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