angular.module('boorish.ask', [])

.controller('askController', function($scope, $window, $location, Tags, Courses, Questions) {
  $scope.question = {};
  $scope.topics = [];

  Courses.getCourses().then(function(data) {
    $scope.courseOptions = {
      availableOptions: data,
      selectedOption: data[data.length - 1],
    };
  });

  $scope.addQuestion = function() {
    console.log($scope.topics);
    $scope.question.userId = $window.localStorage.getItem('com.boorish');  // pulls userId from localStorage
    $scope.question.course = $scope.courseOptions.selectedOption.name; // pulls selected course
    $scope.question.tag = $scope.tagOptions.selectedOption.name;  // pulls selected tag
  };
});
  


