var db = require('../db/index.js');

function timeSince(date) {
  var seconds = Math.floor((new Date() - date) / 1000);
  var interval = Math.floor(seconds / 31536000);
  if (interval >= 1) {
      return interval + " years ago";
  }
  interval = Math.floor(seconds / 2592000);
  if (interval >= 1) {
      return interval + " months ago";
  }
  interval = Math.floor(seconds / 86400);
  if (interval >= 1) {
      return interval + " days ago";
  }
  interval = Math.floor(seconds / 3600);
  if (interval >= 1) {
      return interval + " hours ago";
  }
  interval = Math.floor(seconds / 60);
  if (interval >= 1) {
      return interval + " minutes ago";
  }
  if (seconds < 5){
    return "just now";
  }
  return Math.floor(seconds) + " seconds ago";
}


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
						isPreferred: post.isPreferred,
						isClosed: post.isClosed,
						votes: post.votes,
						createdAt: timeSince(post.createdAt),
						course: post.CourseId,
						coursename: post.Course ? post.Course.name : "",
						tagname: post.TagId,
						user: post.User ? post.User.name : "",
						imgUrl: post.User ? post.User.picture : "",
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
				text: postData.text,
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