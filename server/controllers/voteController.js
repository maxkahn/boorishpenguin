var db = require('../db/index.js');
//maybe require other controllers?

module.exports = {

	votePost: function(req, res) {

		var amount = req.body.isPositive === 'true' ? 1 : -1;
		console.log(amount)
		db.Votes.findOrCreate({
				where: {
					UserId: req.body.userId,
					PostId: req.params.id
				}
			})
			.then(function(vote) {
				if (vote[1]) {
					updateReputation(req.body.userId, req.params.id, amount, function(status) {
						res.sendStatus(status);
					});
				} else {

					if (String(vote[0].dataValues.isPositive) !== req.body.isPositive) {
						db.Votes.find({
							where: {
								UserId: req.body.userId,
								PostId: req.params.id
							}
						}).then(function(oldVote) {
							oldVote.updateAttributes({
								isPositive: req.body.isPositive
							}).then(function() {
								updateReputation(req.params.id, amount * 2, function(status) {
									res.sendStatus(status);
								});
							});
						});
					} else {
						res.sendStatus(200);
					}
				}
			});
	},
};

var updateReputation = function(postId, amount, callback) {
	db.Post.findById(postId).then(function(post) {
		var userId = post.dataValues.UserId;
		post.updateAttributes({
			votes: post.votes + amount
		}).then(function() {
			db.User.findById(userId).then(function(user) {
				var newRep = user.dataValues.reputation + amount;
				user.updateAttributes({
					reputation: newRep
				}).then(function(result) {
					callback(201);
				});
			});
		});
	});
};
