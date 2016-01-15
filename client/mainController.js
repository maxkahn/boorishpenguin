// top level Equip controller

angular.module('main.controller', [])
  .controller('MainController', function ($scope, $timeout, $log, $location, $mdSidenav, $state, $rootScope) {
    // $scope.aab = 'Equip';

    $scope.logout = function() {
      $rootScope.user = undefined;
      $location.path('/');
    };

    //determine our route when this controller is loaded - this will display the sign in page if the user is not signe in, and the main page otherwise
    // if (!Auth.isAuthorized()) {
    //   $state.go('signUp');
    // } else {
    //   $state.go('main')
    // }

    //the logout function will handle logging us out and taking us back to the sign up page
    // $scope.logout = function () {
    //   Auth.logout();
    //   $state.transitionTo('signUp');
    // }

    // $scope.login = function () {
    //   $state.transitionTo('signIn');
    // }
  });