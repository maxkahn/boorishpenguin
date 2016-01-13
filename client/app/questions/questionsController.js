angular.module('boorish.questions', [])
.controller('questionsController', function($scope, $window, $location, Questions) {
  $scope.questions = [];

  $scope.init = function() {
    Questions.getAllQuestions().then(function(data) {
      console.log(data);
      $scope.questions = data;
    });
  };

  $scope.init();
});