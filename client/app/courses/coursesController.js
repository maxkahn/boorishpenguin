angular.module('boorish.courses', [])
	.controller('coursesController', function($scope, Admin, $rootScope, Courses) {


		if (!$rootScope.user.isAdmin) {
			$location.path('/questions');
		}
		Courses.getCourses().then(function(data) {

			$scope.activeCourses = data.active;
			$scope.inactiveCourses = data.inactive;

		});
		$scope.addCourse = function() {
			var courseToInsert = {
				name: $scope.newCourse,
				isActive: true,
			};

			Courses.addCourse(courseToInsert)
				.then(function(result) {
					$scope.activeCourses.unshift(courseToInsert);

				});
		};

		$scope.changeCourse = function(isActive) {
			var index, course;

			if (isActive) {
				$scope.activeCourses.forEach(function(tempCourse, curIndex) {
					if (tempCourse.name === this.course.name) {
						index = curIndex;
					}
				}.bind(this));
				course = $scope.activeCourses.splice(index, 1);
				$scope.inactiveCourses.unshift(course[0]);
			} else {
				$scope.inactiveCourses.forEach(function(tempCourse, curIndex) {
					if (tempCourse.name === this.course.name) {
						index = curIndex;
					}
				}.bind(this));
				course = $scope.inactiveCourses.splice(index, 1);
				$scope.activeCourses.unshift(course[0]);
			}
			Courses.updateCourse(this.course.name, isActive);
		};

	});