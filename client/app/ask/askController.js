angular.module('boorish.ask', [])

.controller('askController', function($scope, $window, $state, Courses, Questions) {
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
        //TODO show a message that the question was submitted
        $state.go('questions');
      });
  };

});