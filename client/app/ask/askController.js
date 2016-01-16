angular.module('boorish.ask', [])

.controller('askController', function($scope, $state, $mdToast, Courses, Questions, $rootScope) {
  $scope.question = {};
  $scope.topics = [];
  $scope.courses = [];

  Courses.getCourses().then(function(data) {
    $scope.courseOptions = {
      availableOptions: data.active,
      selectedOption: data.active[data.length - 1],
    };
  });

  $scope.addQuestion = function() {
    var questionToInsert = {
      isQuestionType: true,
      isAnswerType: false,
      title: $scope.question.title,
      text: $scope.question.text,
      userId: $rootScope.user.id,
      tagsArray: $scope.topics.join(),
      CourseId: $scope.courseOptions.selectedOption
    };

    Questions.addQuestion(questionToInsert)
      .then(function(){
        showQuestionSubmittedToast();
        $state.go('questions');
      });
  };

  var showQuestionSubmittedToast = function() {
    $mdToast.show(
      $mdToast.simple()
        .textContent('Question Submitted')
        .position('top right')
        .hideDelay(2000)
    );
  };

});