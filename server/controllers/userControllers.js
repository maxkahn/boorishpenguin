var db = require('../db/index.js');
var User = db.User;

module.exports = {
  allUsers: function(req, res) {
    var course = req.body.coursename;

    User.findAll()
    .then(function(users) {
      var formattedUsers = users.map(function(user) {
        return {
          id: user.id,
          isTeacher: user.isTeacher,
          name: user.name,
          pendingTeacher: user.pendingTeacher,
          isAdmin: user.isAdmin,
          //TODO: reverse first name, last name convention
          name_first: user.name_last,
          name_last: user.name_first,
          email: user.email,
          reputation: user.reputation,
          image: user.image
        };
      });

      data = {};
      data.results = formattedUsers;
      res.json(data);
    });
  },

  oneUser: function(req, res) {
    var uid = req.params.id;

    User.findById(uid)
    .then(function(user) {
      var formattedUser = {
        id: user.id,
        isTeacher: user.isTeacher,
        name: user.name,
        pendingTeacher: user.pendingTeacher,
        isAdmin: user.isAdmin,
        //TODO: last name/first name
        name_first: user.name_last,
        name_last: user.name_first,
        email: user.email,
        reputation: user.reputation,
        image: user.image
      };

      data = {};
      data.results = formattedUser;
      res.json(data);
    });
  },

  newUser: function(req, res, next) {
    var user = req.body;
    User.create(user)
    .then(function(newUser) {
      res.status(200).json(newUser);
    });
  },

  isUserInDb: function(uname, callback) {
    User.count({
      where: {
        username: uname
      }
    })
    .then(function(number) {
      callback(!!number);
      return;
    });
  }
};
