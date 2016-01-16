angular.module('Main', ['ui.router', 'ngMaterial', 'main.controller', 'boorish.questions' ,'boorish.services', 'boorish.ask', 'boorish.answers', 'boorish.login', 'boorish.admin', 'boorish.user', 'boorish.courses'])
  .config(function ($stateProvider, $mdThemingProvider, $urlRouterProvider) {

    var checkLoggedin = function($q, $http, $location, $rootScope, $state) {
     var deferred = $q.defer();

     $http.get('/api/loggedin').success(function(user) {
       if (user !== '0') {
         $rootScope.user = user;
         deferred.resolve();
       } else {
         deferred.reject();
         $state.go('login');
       }
     });

       return deferred.promise;
     };

    $stateProvider
      .state('login', {
        url: '/login',
        templateUrl : 'app/login/index.html',
        controller: 'loginController'
      })
      .state('questions', {
        url: '/questions',
        templateUrl : 'app/questions/index.html',
        controller: 'questionsController',
        resolve: { loggedin: checkLoggedin }
      })
      .state('answers', {
        url: '/questions/:id',
        templateUrl : 'app/answers/index.html',
        controller: 'answersController',
        resolve: { loggedin: checkLoggedin }
      })
      .state('user', {
        url: '/user/:id',
        templateUrl : 'app/user/index.html',
        controller: 'userController',
        resolve: { loggedin: checkLoggedin }
      })
      .state('ask', {
        url: '/ask',
        templateUrl : 'app/ask/index.html',
        controller: 'askController',
        resolve: { loggedin: checkLoggedin }
      })
      .state('admin', {
        url: '/admin',
        templateUrl : 'app/admin/index.html',
        controller : 'adminController',
        resolve: { loggedin : checkLoggedin }
      })
      .state('courses', {
        url: '/admin/courses',
        templateUrl : 'app/courses/index.html',
        controller : 'coursesController',
        resolve: { loggedin : checkLoggedin }
      });

      $urlRouterProvider
        .otherwise('/login');

      $mdThemingProvider.theme('default')
        .primaryPalette('deep-purple')
        .accentPalette('blue-grey');

  })

  .run(function () {
  });
 

 /*
Possible Angular Material Themes to explore:
red
pink
purple
deep-purple
indigo
blue
light-blue
cyan
teal
green
light-green
lime
yellow
amber
orange
deep-orange
brown
grey
blue-grey
 */
