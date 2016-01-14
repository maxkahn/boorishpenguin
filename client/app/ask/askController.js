angular.module('boorish.ask', [])

.controller('askController', function($scope, $window, $location, Tags, Courses, Questions) {
  $scope.question = {};

  Courses.getCourses().then(function(data) {
  	console.log(data);
    $scope.courseOptions = {
      availableOptions: data,
      selectedOption: data[data.length - 1],
    }
  }); 

  // Tags.getTags()
  // .then(function(data) {
  //   $scope.tagOptions = {
  //     availableOptions: data.results,
  //     selectedOption: data.results[data.results.length - 1]
  //   }
  //   return;
  // })
  // .then(function() {
  //   return Courses.getCourses();
  // })
  // .then(function(data) {
  // 	console.log(data);
  //   $scope.courseOptions = {
  //     availableOptions: data,
  //     selectedOption: data[data.length - 1]
  //   };
  // });

  $scope.addQuestion = function() {
    $scope.question.userId = $window.localStorage.getItem('com.boorish');  // pulls userId from localStorage
    $scope.question.course = $scope.courseOptions.selectedOption.name; // pulls selected course
    $scope.question.tag = $scope.tagOptions.selectedOption.name;  // pulls selected tag
    // Questions.addQuestion($scope.question).then(function() { // adds new Question with addQuestion factory method
    //   $location.path('/questions'); // redirects to all questions
    // });

  }
});
  


