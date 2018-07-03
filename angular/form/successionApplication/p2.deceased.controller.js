angular.module("successionApplication")
.controller("DeceasedController", ["$scope", "$rootScope", "FormService", "$stateParams",
	function($scope, $rootScope, FormService, $stateParams) {
		$scope.addAlias = function() {
			var alias = {
				firstName: $scope.fName,
				lastName: $scope.lName
			}

			$scope.parcel.contents.deceased.alias.push(alias);

			$scope.fName = "";
			$scope.lName = "";
		}
	}
]);