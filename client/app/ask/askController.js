angular.module('boorish.ask', [])

.controller('askController', function($scope, $window, $state, $mdToast, Courses, Questions) {
  $scope.question = {};
  $scope.topics = [];

  Courses.getCourses().then(function(data) {
    $scope.courseOptions = {
      availableOptions: data,
      selectedOption: data[data.length - 1],
    };
  });

  $scope.addQuestion = function() {
    var questionToInsert = {
      isQuestionType: true,
      isAnswerType: false,
      title: $scope.question.title,
      text: $scope.question.text,
      userId: 2, //TODO: get this from Auth
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