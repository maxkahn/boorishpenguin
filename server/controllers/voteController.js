var db = require('../db/index.js');
//maybe require other controllers?

module.exports = {

	votePost: function(req, res) {

		var queryObject = {
			isPositive : req.body.isPositive,
		  UserId : req.body.userId, 
			PostId : req.params.id
		};
		var up = queryObject.isPositive ? 1 : -1;
		db.Votes.create({
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
								db.Post.findById(queryObject.PostId)
									.then(function(post) {
										post.update({
											votes: post.votes + up
										})
										.then(function() {
											res.sendStatus(200);
										});
									});
							});
					});

			});
	}



};