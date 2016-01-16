var db = require('../db/index.js');
var User = db.User;
var PostCtrl = require('./postController.js');

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
  },

  getFullProfile: function(req, res, next){
    var userId = req.params.id;
    var result = {profile: null, questions: null, answers: null};

    User.findById(userId)
      .then(function(user) {
        result.profile = user;
        PostCtrl.allPosts({isQuestionType: true, userId: userId}, function(userQuestions){
          result.questions = userQuestions.results;
          PostCtrl.allPosts({isAnswerType: true, userId: userId}, function(userAnswers){
            result.answers = userAnswers.results;
            res.status(200).json(result);
          });
        });
      });
  },

  becomeTeacherRequest: function(req, res, next){
    var userId = req.body.userId;
    User.findById(userId)
      .then(function(user) {
        user.pendingTeacher = true;
        user.save();
        res.sendStatus(200);
      });
  }
};
