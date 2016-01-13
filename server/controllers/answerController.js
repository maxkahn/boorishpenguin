var db = require('../db/index.js');
var UCtrl = require('./userControllers.js');

module.exports = {
  newAnswer: function(req, res) {
    var txt = req.body.text;
    var uid = req.body.id_user;
    var qid = req.body.id_question;

    db.Post.findById(qid)
    .then(function(question) {
      if (!question.isClosed) {
        question.update({
          responses: question.responses + 1
        })
        .then(function() {
          return db.User.findById(uid);
        })
        .then(function(user) {
          db.Post.create({
            text: txt,
            isCorrectAnswer: true,
            UserId: uid,
            QuestionId: qid,
            CourseId: question.CourseId,
            TagId: question.TagId
          })
          .then(function(answer) {
            question.update({
              updatedAt: Sequelize.fn('NOW')
            })
            .then(function() {
              return user.update({
                points: user.points + 1
              });
            })
            .then(function() {
              res.status(201).json(answer);
            });
          });
        });
      } else {
        res.sendStatus(404);
      }
    });
  },

  modAnswer: function(req, res) {
    var aid = req.params.id;
    var mod = req.body.mod;
    var reqName = req.user.profile.emails[0].value;

    db.Post.findById(aid)
    .then(function(answer) {
      var uid = answer.UserId;

      db.User.findById(uid)
      .then(function(user) {
        if (mod === 'good') {
          UCtrl.isUserTeacher(reqName, function(is) {
            if (is) {
              answer.update({
                isGood: !answer.isGood
              })
              .then(function(answer) {
                if (answer.isGood) {
                  return user.update({
                    points: user.points + 1
                  })
                } else {
                  return user.update({
                    points: user.points - 1
                  })
                }
              })
              .then(function() {
                res.status(201).json(answer);
              });
            } else {
              res.sendStatus(404);
            }
          });
        } else if (mod === 'like') {
          db.User.find({
            where: {
              username: reqName
            }
          })
          .then(function(requester) {
            return answer.getVote({
              where: ['UserId='+requester.id+' AND PostId='+answer.id]
            })
            .then(function(result) {
              if (!result.length) {
                return answer.addVote(requester)
                .then(function() {
                  return answer.update({
                    points: answer.points + 1
                  });
                })
                .then(function(answer) {
                  return user.update({
                    points: user.points + 1
                  });
                });
              } else {
                return answer.removeVote(requester)
                .then(function() {
                  return answer.update({
                    points: answer.points - 1
                  });
                })
                .then(function(answer) {
                  return user.update({
                    points: user.points - 1
                  });
                });
              }
            });
          })
          .then(function() {
            res.status(201).json(answer);
          });
        } else {
          res.sendStatus(404);
        }
      });
    });
  },

  deleteAnswer: function(req, res) {
    var aid = req.params.id;
    var reqName = req.user.profile.emails[0].value;

    db.Post.findById(aid)
    .then(function(answer) {
      var uid = answer.UserId;

      db.User.findById(uid)
      .then(function(user) {
        var authorname = user.username;

        UCtrl.isUserTeacher(reqName, function(is) {
          if (is || reqName === authorname) {
            var qid = answer.QuestionId;

            db.Post.findById(qid)
            .then(function(question) {
              return question.update({
                responses: question.responses - 1
              })
            })
            .then(function() {
              return user.update({
                points: user.points - 1
              });
            })
            .then(function() {
              return answer.destroy()
              .then(function() {
                res.sendStatus(204);
              });
            });
          } else {
            res.sendStatus(404);
          }
        });
      });
    });
  }
};
