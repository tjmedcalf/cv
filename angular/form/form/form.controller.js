angular.module("sharedDependencies")
.controller("FormController", ["$scope", "$rootScope", 'FormService', '$location', '$window', '$cookies', 'SearchService', '$state', '$timeout', '$anchorScroll',
	function($scope, $rootScope, FormService, $location, $window, $cookies, SearchService, $state, $timeout, $anchorScroll) {
		$rootScope.parcel = {
			preFlight: {},
			contents: {},
		};
		
		$rootScope.$watch('sections', function() {
			$scope.pageSections = $rootScope.sections;

			angular.forEach($scope.pageSections, function(section, index) {
				if(section.route.indexOf($location.path()) > -1) {
					$scope.pageIndex = index;
				}
			});

			//Redirect if form thank you is refreshed..
			if($state.current.name == "form.confirmation" && !$scope.formSubmitted) {
				$location.path($scope.pageSections[0].route);
			}
		});

		$scope.$watch('pageIndex', function(val) {
			if(val !== undefined) {
				if($scope.navOptions != undefined) {
					delete $scope.navOptions;
				}

				if($scope.pageSections[val].navOptions != undefined) {
					if($scope.pageSections[val].navOptions) {
						$scope.navOptions = $scope.pageSections[val].navOptions;
					}
				}
			}
		})

		$scope.$on('$stateChangeSuccess', function(e, toState, toParams, fromState, fromParams) {
			//Find the current state index in the array by matching the url. section.route == #!/form/4/whakapapa
			angular.forEach($scope.pageSections, function(section, index) {
				if(section.route.indexOf($location.path()) > -1) {
					$scope.pageIndex = index;
				}
			});

			$scope.pageNumber = toParams.pageNumber;

			$anchorScroll();
		});
	    $scope.eyebrowsMessage = "";

		$scope.formSubmit = function() {
			$scope.loading = true;

			FormService.deliveryMan.post({}, $rootScope.parcel.contents, function(result, success) {
				if(success) {
					console.log("Form Success:", result);

					if($scope.confirmationPage != undefined) {
						$window.location.href = $scope.confirmationPage;
					} else {
						$scope.resetForm();
						$state.go("form");
					}
				} else {
					console.warn("Form POST Fail:", result);
				    $scope.eyebrowsMessage =
				        "Sorry, the form submission was unsuccessful. Please ensure you have completed ALL fields.";
                    $timeout(function() {
                        $scope.eyebrowsMessage = "";
                    }, 5000);
				}

				$scope.loading = false;
			});
		}

		$scope.setFormDetails = function (url, username, email) {
		    $scope.confirmationPage = url;
		    $scope.username = username;
		    $scope.email = email;
		}

		$scope.resetForm = function() {
			$scope.loading = false;
			
			$rootScope.parcel = {
				preFlight: {},
				contents: {},
			};
		}
	}
]);