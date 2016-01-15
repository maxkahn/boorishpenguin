angular.module('boorish.answers', [])
.controller('answersController', function($scope, $state, $window, $stateParams, $mdToast, $document, Answers, Questions, Users, Auth, $rootScope) {
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
    if ($scope.newAnswer.text.trim() === ''){
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

  $scope.markGoodQuestion = function(){
    Questions.markGoodQuestion(questionId)
      .then(function(){
        $scope.question.isPreferred = $scope.question.isPreferred ? false : true;
      });
  };

  $scope.markCorrectAnswer = function(answer){
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
        answer.votes = votes;
      });
  };

  if (questionId){
    getQuestion(questionId);
  }

});
