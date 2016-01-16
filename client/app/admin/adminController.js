angular.module('boorish.admin', [])
	.controller('adminController', function($scope, Admin, $rootScope, $location) {

		if(!$rootScope.user.isAdmin){
			$location.path('/questions');
		}

		$scope.confirmTeacher = function() {

			if (this.pendingTeacher) {
				moveUser($scope.pending, $scope.confirmed, this.pendingTeacher);
			} else {
				moveUser($scope.students, $scope.confirmed, this.student);
			}
			Admin.confirmTeacher($rootScope.user.id, this);
		};


		$scope.moveToStudent = function() {

			if (this.pendingTeacher) {
				moveUser($scope.pending, $scope.students, this.pendingTeacher);
			} else {
				moveUser($scope.confirmed, $scope.students, this.teacher);
			}
			Admin.moveToStudent($rootScope.user.id, this);
		};

		$scope.moveToPending = function() {

			if (this.teacher) {
				moveUser($scope.confirmed, $scope.pending, this.teacher);
			} else {
				moveUser($scope.students, $scope.pending, this.student);
			}
			Admin.moveToPending($rootScope.user.id, this);
		};

		$scope.deleteUser = function() {

		};
		var moveUser = function(startingArr, endingArr, userType) {
			var index = startingArr.indexOf(userType);
			var person = startingArr.splice(index, 1);
			endingArr.unshift(person[0]);
		};

		Admin.getPendingTeachers()
			.then(function(results) {
				$scope.pending = results.pending;
				$scope.confirmed = results.confirmed;
				$scope.students = results.students;
			});
	});