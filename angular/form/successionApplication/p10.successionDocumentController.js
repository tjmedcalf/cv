angular.module("successionApplication")
.controller("DocumentController", ["$scope", "$rootScope", "FormService", "$stateParams",
	function($scope, $rootScope, FormService, $stateParams) {
		$scope.vm = {
			uploadme: {},
		};
		
		$scope.$watch('vm', function(val) {
			if(val.uploadme != undefined) {
				if(val.uploadme.error == undefined) {
					if($scope.fileError != undefined) {
						delete $scope.fileError;
					}

					if(val.uploadme.$file != undefined) {
						$rootScope.parcel.contents.files.push({
							fileName: val.uploadme.$file.name,
							content: val.uploadme._fileContents,
						});
					}
				} else {
					$scope.fileError = val.uploadme.error;
				}
			}
		}, true);

		$scope.removeDocument = function() {
			var fileIndex = "";

			angular.forEach($rootScope.parcel.contents.files, function(file, index) {
				console.log(file.fileName, $scope.vm.uploadme.$file.name);

				if(file.fileName == $scope.vm.uploadme.$file.name) {
					console.log('match..');
					fileIndex = index;
				}
			});

			if(fileIndex !== "") {
				$rootScope.parcel.contents.files.splice(fileIndex, 1);
				$scope.vm.uploadme = {};
			}
		}
	}
]);