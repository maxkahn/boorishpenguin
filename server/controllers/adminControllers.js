var db = require('../db/index.js');

module.exports = {
	toggleTeacherAccess: function(req, res) {
		db.User.findById(req.body.userId)
			.then(function(admin) {
				if (admin.isAdmin) {
					db.User.findById(req.params.id)
						.then(function(user) {
							user.updateAttributes({
								isTeacher: req.body.isTeacher || false,
								pendingTeacher: req.body.pendingTeacher || false
							}).then(function(result) {
								res.status(200).json(result);
							});
						});
				} else {
					res.sendStatus(404);
				}
			});
	},

	getStaff: function(req, res) {
		db.User.findAll({
				where: { pendingTeacher: true }
			})
			.then(function(pendingTeachers) {
				db.User.findAll({
						where: { isTeacher: true }
					})
					.then(function(currentTeacher) {
						db.User.findAll({
								where: {
									isTeacher: false,
									pendingTeacher : false
								}
							})
							.then(function(students) {
								var data = {
									confirmed: currentTeacher,
									pending: pendingTeachers,
									students: students
								};
								res.status(200).json(data);
							});
					});
			});
	}
};