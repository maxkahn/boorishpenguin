var db = require('../db/index.js');
//maybe require other controllers?

module.exports = {

	votePost: function(req, res) {

		var queryObject = {
			isPositive : req.body.isPositive,
			userId : req.body.userId,
			postId : req.body.postId
		};
		var up = queryObject.isPositive ? 1 : -1;
		db.Vote.create({
				where: queryObject,
				include: [db.User, db.Post]
			})
			.then(function() {
				db.User.findById(queryObject.userId)
					.then(function(user) {
						user.update({
								reputation: user.reputation + up
							})
							.then(function() {
								db.Post.findById(queryObject.postId)
									.then(function(post) {
										post.update({
											votes: post.votes + up
										});
									});
							});
					});

			});
	}



};