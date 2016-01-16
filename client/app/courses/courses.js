angular.module('boorish.courses', [])
	.controller('coursesController', function($scope, Admin, $rootScope){
		$scope.courses = [];
		// if(!$rootScope.user.isAdmin){
		// 	$location.path('/questions');
		// }

		$scope.addCourse = function () {
			Admin.addCourse()
		}
	});