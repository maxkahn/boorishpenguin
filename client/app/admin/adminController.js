angular.module('boorish.admin', [])
	.controller('adminController', function($scope, Admin, $rootScope) {
		$scope.confirmTeacher = function(){
			Admin.confirmTeacher("$rootScope.user.id", this);
		};
		$scope.fireTeacher = function(){
			Admin.fireTeacher("$rootScope.user.id", this);
		};
		$scope.moveTeacherToPending = function(){
			Admin.moveTeacherToPending("$rootScope.user.id", this);
		};


		Admin.getPendingTeachers()
			.then(function(results){
				$scope.pending = results.pending;
				$scope.confirmed = results.confirmed;
			})
	});

