angular.module('boorish.answers', [])
.controller('answersController', function($scope, $state, $window, $stateParams, Answers, Questions, Users, Auth) {
  var questionId = $stateParams.id;

  $scope.question = {};
  $scope.answers = {};
  $scope.newAnswer = {};
  $scope.newComment = {};

  var getQuestion = function(questionId){
    Questions.getQuestion(questionId).then(function(res) {
      $scope.question = res[0];
      $scope.answers = res.slice(1);
    });
  };

  $scope.submitAnswer = function(){
    console.log($scope.newAnswer);
    $scope.newAnswer.text = '';
  };

  $scope.submitComment = function(answerId){
    console.log(answerId);
    console.log($scope.newComment.text);
    $scope.newComment.text = '';
    console.log('submit comment');
  };

  if (questionId){
    getQuestion(questionId);
  }

});