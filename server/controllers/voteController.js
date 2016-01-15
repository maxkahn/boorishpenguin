var db = require('../db/index.js');
//maybe require other controllers?

module.exports = {

	votePost: function(req, res) {

		var amount = req.body.isPositive === 'true' ? 1 : -1;
		db.Votes.findOrCreate({
				where: {
					UserId: req.body.userId,
					PostId: req.params.id
				}
			})
			.then(function(vote) {
				if (vote[1]) {
					updateReputation(req, amount, function(reputation) {
						res.status(201).json(reputation);
					});
				} else {
					if (String(vote[0].dataValues.isPositive) !== req.body.isPositive) {
						updateReputation(req, amount * 2, function(reputation) {
							res.status(201).json(reputation);
						});
					} else {
						updateReputation(req, 0, function(reputation) {
							res.status(201).json(reputation);
						});
					}
				}
			});
	},
};

var updateReputation = function(req, amount, callback) {
	db.Votes.find({
		where: {
			UserId: req.body.userId,
			PostId: req.params.id
		}
	}).then(function(oldVote) {
		oldVote.updateAttributes({
			isPositive: req.body.isPositive
		}).then(function() {
			db.Post.findById(req.params.id).then(function(post) {
				var creatorId = post.dataValues.UserId;
				post.updateAttributes({
					votes: post.votes + amount
				}).then(function(changedPost) {
					db.User.findById(creatorId).then(function(user) {
						var newRep = user.dataValues.reputation + amount;
						user.updateAttributes({
							reputation: newRep
						}).then(function(result) {
							callback(changedPost.dataValues.votes);
						});
					});
				});
			});
		});
	});
};