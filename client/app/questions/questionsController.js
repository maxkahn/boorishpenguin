angular.module('boorish.questions', [])
.controller('questionsController', function($scope, $state, Questions) {
  $scope.questions = [];

  $scope.init = function() {
    Questions.getAllQuestions().then(function(data) {
      $scope.questions = data;
    });
  };

  $scope.init();

  $scope.goToQuestion = function(questionId){
    $state.go('answers', {id: questionId});
  };

  $scope.searchByText = function(text){
    $scope.searchText = text;
  };

  $scope.goToUserProfile = function(userId){
    $state.go('user', {id: userId});
  };

});