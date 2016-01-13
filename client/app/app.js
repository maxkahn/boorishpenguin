angular.module('Main', ['ui.router', 'ngMaterial', 'main.controller', 'boorish.questions' ,'boorish.services', 'boorish.ask'])
  .config(function ($stateProvider, $mdThemingProvider) {
    $stateProvider
      .state('questions', {
        url: '/questions',
        templateUrl : 'app/questions/index.html',
        controller: 'questionsController'
      })
      .state('ask', {
        url: '/ask',
        templateUrl : 'app/ask/index.html',
        controller: 'askController'
      });

      $mdThemingProvider.theme('default')
        .primaryPalette('deep-purple')
        .accentPalette('orange');

  }).run(function () {
    console.log('running');
  });
 




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
