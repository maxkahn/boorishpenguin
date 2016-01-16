angular.module('boorish.services', [])

// Questions factory handles all requests to add, retrieve, or modify questions in the database

.factory('Questions', function($http, $location, $rootScope) {
  return {
    // add a question from /ask
    addQuestion: function(question) {
      return $http({
        method: 'POST',
        url: '/api/questions',
        data: question
      });
    },

    getAllQuestions: function() {
      return $http({
        method: 'GET',
        url: '/api/questions'
      })
      .then(function(res) {
        return res.data.results;
      });

    },

    getQuestion: function(questionId) {
      return $http({
        method: 'GET',
        url: '/api/questions/' + questionId
      })
      .then(function(res) {
        return res.data;
      });
    },

    // updates a question. takes in the id of the question and the required modification
    updateQuestion: function(id, mod) {
      return $http({
        method: 'POST',
        url: 'api/questions/' + id,
        data: { mod: mod } // possible mods = 'like' to increase like points, 'good' to mark as good (by teacher), 'answered', 'closed'
      });
    },

    // removes a question. Only available to the user who posted it or a Teacher (isAdmin = true)
    removeQuestion: function(questionID) {
      return $http({
        method: 'DELETE',
        url: 'api/questions/' + questionID
      });
    },

    markGoodQuestion: function(questionId){
      return $http({
        method: 'PUT',
        url: '/api/questions/markAsGood/' + questionId,
        data: { userId: $rootScope.user.id }
      });
    },

    voteQuestion: function(questionId, vote){
      return $http({
        method: 'PUT',
        url: '/api/questions/vote/' + questionId,
        data: vote
      })
      .then(function(votes) {
        return votes.data;
      });
    },

    removePost: function(postId){
      return $http({
        method: 'POST',
        url: '/api/questions/removePost',
        data: { postId: postId }
      });
    },

    closePost: function(postId){
      return $http({
        method: 'POST',
        url: '/api/questions/closePost',
        data: { postId: postId }
      });
    }
  };
})

// Answers factory handles all requests to add, retrieve, or modify answers in the database

.factory('Answers', function($http, $rootScope) {

  return {
    // get all answers
    getAnswers: function() {
      return $http({
        method: 'GET',
        url: 'api/answers',
      })
      .then(function(res) {
        return res.data;
      });
    },

    // adds an answer to a question. requires the answer object and question ID
    addAnswer: function(answer) {

      return $http({
        method: 'POST',
        url: 'api/answers',
        data: answer
      });
      
    },

    // updates an answer. requires the answerID and requested modification (mod). mod is a string.
    updateAnswer: function(answerID, mod) {
      return $http({
        method: 'POST',
        url: 'api/answers/' + answerID,
        data: JSON.stringify({
          id_answer: answerID,
          mod: mod // possible mods: 'like' to increase the number of points on a question, 'good' to mark as good
        })
      });
    },

    // removes an answer. requires the id of the answer
    removeAnswer: function(answerID) {
      return $http({
        method: 'DELETE',
        url: 'api/answers/' + answerID
      });
    },

    markCorrectAnswer: function(answerId){
      return $http({
        method: 'PUT',
        url: '/api/answers/markAsCorrect/' + answerId,
        data: { userId: $rootScope.user.id }
      });
    },

    getCommentsOfAnAnswer: function(answerId) {
      return $http({
        method: 'GET',
        url: '/api/comments/' + answerId,
      })
      .then(function(comments) {
        return comments.data.results;
      });
    },

    addCommentToAnswer: function(comment) {
      return $http({
        method: 'POST',
        url: '/api/comments',
        data: comment
      });
    },

    voteAnswer: function(answerId, vote){
      return $http({
        method: 'PUT',
        url: '/api/answers/vote/' + answerId,
        data: vote
      })
      .then(function(votes) {
        return votes.data;
      });
    }

  };
})

// Users factory handles all requests to add and retrieve users in the database

.factory('Users', function($http, $window){

  return {

    allUsers: function(){
      return $http({
        method: 'GET',
        url: '/api/users'
      })
      .then(function(res){
        return res.data;
      });
    },

    // users the userID that is stored in localStorage to obtain the user from the database
    getUserWithId: function() {
      var userID = $window.localStorage.getItem('com.boorish');
      return $http({
        method: 'GET',
        url: '/api/users/' + userID
      }).then(function(res) {
        return res.data.results.id;
      });
    },

    addUser: function(user) {
      return $http({
        method: 'POST',
        url: '/api/users',
        data: JSON.stringify({
          username: user.username,
          password: user.password,
          name: user.name,
          isTeacher: user.isTeacher,
          points: 0,
          email: user.email,
          picture: user.picture
        })
      });
    },

    getFullProfile: function(userId){
      return $http({
        method: 'GET',
        url: '/api/users/getFullProfile/' + userId
      }).then(function(userInfo) {
        return userInfo.data;
      });
    },

    becomeTeacherRequest: function(userId){
      return $http({
        method: 'POST',
        url: '/api/users/becomeTeacherRequest',
        data: { userId: userId }
      });
    }
  };
})

// Tags and Course factories just pull Tags and Courses from the database

.factory('Tags', function($http) {
  
  return {

    getTags: function() {
      return $http({
        method: 'GET',
        url: '/api/tags'
      })
      .then(function(res) {
        return res.data;
      });
    }

  };
})

.factory('Courses', function($http) {
  return {

    getCourses: function() {
      return $http({
        method: 'GET',
        url: '/api/courses'

      })
      .then(function(res) {
        return res.data;
      });
    },
    updateCourse: function(name, status) {
      return $http({
        method: 'PUT',
        url: '/api/courses',
        data : {
          name : name,
          isActive : !status
        }

      })
      .then(function(res) {
        return res.data.results;
      });
    },
    addCourse: function(course) {
      return $http({
        method: 'POST',
        url: '/api/courses',
        data : course

      })
      .then(function(res) {
        return course;
      });
    }
  };
})

.factory('Auth', function ($http, $location, $window, $rootScope) {
  var user = {};

  return {
    
    setUser: function () {
      return $http({
        method: 'GET',
        url: '/auth/google'
      })
      .then(function (res) {

        user.google = res.data.email || res.data.profile.emails[0].value;

        return $http({
          method: 'GET',
          url: '/api/users'
        })
        .then(function(res) {
          var users = res.data.results;
          var isUser = false;
          for (var i = 0; i < users.length; i++) {
            if (users[i].email === user.google) {
              isUser = true;
              $rootScope.user = users[i];
              continue;
            }
          }
          if (isUser) {

            $location.path('/questions');
          } else {
            $location.path('/auth/google');
          }
        });
      });
    },

    isAuth: function () {
      return !!$rootScope.user;
    },

    signout: function () {
      $rootScope.user = undefined;
      $location.path('/signin');
    }
  };
})

.factory('Admin', function ($http){
  return {

    addCourse : function(courseName) {
      return $http({
        method: 'POST',
        url: '/api/courses',
        data: JSON.stringify({
          name: courseName,
        })
      })
      .then(function(res) {
        return res.data;
      });
    },
    getPendingTeachers : function () {
      return $http({
        method: 'GET',
        url: '/api/admin'
      })
      .then(function(res) {
        return res.data;
      });
    },

    confirmTeacher : function(userId, user) {
    var member = user.student || user.pendingTeacher;
       return $http({
        method: 'PUT',
        url: '/api/admin/' + member.id,
        data: JSON.stringify({
          userId: userId,
          isTeacher: true
        })
      });
    },
    moveToStudent : function(userId, user) {
        var member = user.pendingTeacher || user.teacher;
       return $http({
        method: 'PUT',
        url: '/api/admin/' + member.id,
        data: JSON.stringify({
          userId: userId,
          pendingTeacher: false,
          isTeacher: false,
        })
      });
    },
    moveToPending : function(userId, user) {
      var member = user.student || user.teacher;
       return $http({
        method: 'PUT',
        url: '/api/admin/' + member.id,
        data: JSON.stringify({
          userId: userId,
          pendingTeacher: true
        })
      });
    },

    signout: function() {
      $rootScope.user = undefined;
      $location.path('/signin');
    }
  };
});
