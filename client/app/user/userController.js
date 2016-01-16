angular.module('boorish.user', [])
.controller('userController', function($scope, $state, $stateParams, Users) {
  var userId = $stateParams.id;
  $scope.user = {};

  var getProfile = function(userId){
    Users.getFullProfile(userId)
      .then(function(userInfo){
        $scope.user = userInfo;
      });
  };

  $scope.goToQuestion = function(questionId){
    $state.go('answers', {id: questionId});
  };

  $scope.searchByText = function(text){
    $scope.searchText = text;
  };

  if (userId){
    getProfile(userId);
  }
});