angular.module('main.controller', [])
  .controller('MainController', function ($scope, $timeout, $log, $location, $mdSidenav, $state, $rootScope) {
    $scope.logout = function() {
      $rootScope.user = undefined;
      $location.path('/');
    };
  });