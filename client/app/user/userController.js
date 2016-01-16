angular.module('boorish.user', [])
.controller('userController', function($scope, $state, $stateParams, Users, $rootScope, $mdToast) {
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

  $scope.showBecomeTeacherButtom = function(){
    if (userId.toString() === $rootScope.user.id.toString()){
      if ($scope.user.profile.pendingTeacher === false){
        return true;
      }
    }
    return false;
  };

  $scope.becomeTeacherRequest = function(userId){
    Users.becomeTeacherRequest(userId)
      .then(function(){
        showBecomeTeacherRequestToast();
      });
  };

  var showBecomeTeacherRequestToast = function() {
    $mdToast.show(
      $mdToast.simple()
        .textContent('Your request is being processed')
        .position('top right')
        .hideDelay(2000)
    );
  };

  if (userId){
    getProfile(userId);
  }
});