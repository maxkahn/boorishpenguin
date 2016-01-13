var db = require('../db/index.js');
//maybe require other controllers?

module.exports = {

	votePost: function(queryObject) {
		//queryObject should look like {isPositive: true,
		//postId: postId, userId: userId}
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