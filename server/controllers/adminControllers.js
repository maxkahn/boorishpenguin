var db = require('../db/index.js');

module.exports = {
	toggleTeacherAccess : function(req, res) {
		db.User.findById(req.body.userId)
			.then(function(admin){
				if(admin.isAdmin){
				db.User.findById(req.params.id)
					.then(function(user) {
						user.updateAttributes({
							isTeacher: !user.isTeacher,
							pendingTeacher : false
						}).then(function(result) {
							res.status(200).json(result);
						});
					});
				} else {
					res.sendStatus(404);
				}
			});
	},

	getPendingTeachers : function(req, res){
		db.User.findAll({where: { pendingTeacher : true } })
			.then(function(pendingTeachers){
				res.status(200).json(pendingTeachers);
			});
	}
};