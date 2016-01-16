angular.module('boorish.answers', [])
.controller('answersController', function($scope, $state, $stateParams, $mdToast, $document, Answers, Questions, Users, $rootScope, $mdDialog) {
  var questionId = $stateParams.id;

  $scope.question = {};
  $scope.answers = {};
  $scope.newAnswer = {};
  $scope.newComment = {};

  var getQuestion = function(questionId){
    Questions.getQuestion(questionId).then(function(res) {
      $scope.question = res[0];
      $scope.answers = res.slice(1);
      for (var i=0; i<$scope.answers.length; i++){
        $scope.answers[i].newComment = {};
        $scope.answers[i].newComment.text = "";
      }
    });
  };

  $scope.submitAnswer = function(){
    if ($scope.newAnswer.text === undefined || $scope.newAnswer.text.trim() === ''){
      return;
    }

    var answerToInsert = {
      QuestionId: questionId,
      isQuestionType: false,
      isAnswerType: true,
      title: '',
      text: $scope.newAnswer.text,
      userId: $rootScope.user.id
    };

    Answers.addAnswer(answerToInsert)
      .then(function(newAnswer){
        showAnswerSubmittedToast();
        $scope.answers.push({
          id: newAnswer.data.id,
          text: newAnswer.data.text,
          isCorrectAnswer: false,
          votes: 0,
          createdAt: 'just now',
          user: $rootScope.user.name,
          imgUrl: $rootScope.user.picture,
          userId: $rootScope.user.id
        });
      });

    $scope.newAnswer.text = '';
  };

  var showAnswerSubmittedToast = function() {
    $mdToast.show(
      $mdToast.simple()
        .textContent('Answer Submitted')
        .position('top left')
        .parent($document[0].querySelector('#answer_container_id'))
        .hideDelay(2000)
    );
  };

  var showCantVoteTwiceToast = function() {
    $mdToast.show(
      $mdToast.simple()
        .textContent("Can't vote twice on same question/answer")
        .position('top right')
        .hideDelay(2000)
    );
  };

  $scope.markGoodQuestion = function(){
    if (!$rootScope.user.isTeacher){
      return;
    }

    Questions.markGoodQuestion(questionId)
      .then(function(){
        $scope.question.isPreferred = $scope.question.isPreferred ? false : true;
      });
  };

  $scope.markCorrectAnswer = function(answer){
    if (!$rootScope.user.isTeacher){
      return;
    }

    Answers.markCorrectAnswer(answer.id)
      .then(function(){
        answer.isPreferred = answer.isPreferred ? false : true;
      });
  };

  $scope.showComments = function(answer){
    if (answer.comments && answer.comments.length > 0){
      answer.comments = [];
    } else {
      answer.comments = [];
      Answers.getCommentsOfAnAnswer(answer.id)
        .then(function(comments){
          answer.comments = comments;
        });
    }
  };

  $scope.submitComment = function(answer){
    if (answer.newComment.text.trim() === ''){
      return;
    }

    if (!answer.comments){
      answer.comments = [];
    }

    var commentToInsert = {
      text: answer.newComment.text,
      userId: $rootScope.user.id,
      responseId: answer.id
    };

    Answers.addCommentToAnswer(commentToInsert)
      .then(function(){
        Answers.getCommentsOfAnAnswer(answer.id)
          .then(function(comments){
            answer.comments = comments;
            answer.newComment.text = '';
            if (!answer.responses){
              answer.responses = 0;
            }
            answer.responses++;
          });
      });
  };

  $scope.upVoteQuestion = function(question){
    voteQuestion('true', question);
  };

  $scope.downVoteQuestion = function(question){
    voteQuestion('false', question);
  };

  var voteQuestion = function(isPositive, question){
    var vote = {
      isPositive: isPositive,
      userId: $rootScope.user.id
    };

    Questions.voteQuestion(questionId, vote)
      .then(function(votes){
        if (question.votes === votes){
          showCantVoteTwiceToast();
        }
        question.votes = votes;
      });
  };

  $scope.upVoteAnswer = function(answer){
    voteAnswer('true', answer);
  };

  $scope.downVoteAnswer = function(answer){
    voteAnswer('false', answer);
  };

  var voteAnswer = function(isPositive, answer){
    var vote = {
      isPositive: isPositive,
      userId: $rootScope.user.id
    };

    Answers.voteAnswer(answer.id, vote)
      .then(function(votes){
        if (answer.votes === votes){
          showCantVoteTwiceToast();
        }
        answer.votes = votes;
      });
  };

  $scope.removePost = function(ev, post, index, comments) {
    var confirm = $mdDialog.confirm()
          .title('Would you like to delete this?')
          .ariaLabel('delete confirmation')
          .targetEvent(ev)
          .ok('Yes, Remove this')
          .cancel('Cancel');
    $mdDialog.show(confirm).then(function() {
      Questions.removePost(post.id)
        .then(function(){
          if (post.isAnswerType){
            $scope.answers.splice(index, 1);
          } else if (post.isAnswerType === false && post.isQuestionType === false){
            comments.splice(index, 1);
          }
        });
    }, function() {
      
    });
  };

  $scope.closeQuestion = function(ev, question) {
    var confirm = $mdDialog.confirm()
          .title('Would you like to close this question?')
          .textContent('Question content and answers will be visible but readonly.')
          .ariaLabel('close confirmation')
          .targetEvent(ev)
          .ok('Yes, Close question')
          .cancel('Cancel');
    $mdDialog.show(confirm).then(function() {
      Questions.closePost(question.id)
        .then(function(){
          
        });
    }, function() {
    });
  };

  $scope.goToUserProfile = function(userId){
    $state.go('user', {id: userId});
  };

  if (questionId){
    getQuestion(questionId);
  }

});
