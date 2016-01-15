angular.module('Main', ['ui.router', 'ngMaterial', 'main.controller', 'boorish.questions' ,'boorish.services', 'boorish.ask', 'boorish.answers', 'boorish.login'])
  .config(function ($stateProvider, $mdThemingProvider, $urlRouterProvider) {

    var checkLoggedin = function($q, $http, $location, $rootScope) {
     var deferred = $q.defer();

     $http.get('/api/loggedin').success(function(user) {
       if (user !== '0') {
         $rootScope.user = user;
         deferred.resolve();
       } else {
         deferred.reject();
         $location.url('/');
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
      .state('ask', {
        url: '/ask',
        templateUrl : 'app/ask/index.html',
        controller: 'askController',
        resolve: { loggedin: checkLoggedin }
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
Possible Angular Material Themes:
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




// angular.module('boorishpenguin', [
//   'boorish.services',
//   'boorish.users',
//   'boorish.ask',
//   'boorish.questions',
//   'boorish.answers',
//   'boorish.auth',
//   'ngRoute'
//   ])

// .config(function ($routeProvider, $sceProvider) {
//   $routeProvider
//     .when('/', {
//       templateUrl: 'app/questions/questions.html',
//       controller: 'questionsController'
//     })
//     .when('/ask', {
//       templateUrl: 'app/ask/ask.html',
//       controller: 'askController'
//     })
//     .when('/questions', {
//       templateUrl: 'app/questions/questions.html',
//       controller: 'questionsController'
//     })
//     .when('/questions/:id', {
//       templateUrl: 'app/answers/answers.html',
//       controller: 'answersController'
//     })
//     .when('/users', {
//       templateUrl: 'app/users/users.html',
//       controller: 'UsersController'
//     })
//     .when('/signin', {
//       templateUrl: 'app/auth/signin.html',
//       controller: 'AuthController'
//     })
//     .otherwise({
//       routeTo: '/signin'
//     })

//   $sceProvider.enabled(false);
// });
