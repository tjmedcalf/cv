angular.module("successionApplication")
.controller("successionApplicationController", ["$scope", "$q","$rootScope", "FormService", "$location", "$state", "$window", "$stateParams", "LandBlockService", "SuccessionApplicationService",
	function($scope, $q, $rootScope, FormService, $location, $state, $window, $stateParams, LandBlockService, SuccessionApplicationService) {
		$scope.$parent.formName = "Succession Application";
		$scope.$parent.submitBtnText = "Send for Check";

		//FUTURE FEATURE: Continue Saved Request..
		if($stateParams.requestId) {

		} else {
			// Setup new form object
			$rootScope.parcel.contents = FormService.successionApplication.new();
		}

		$scope.$watch("parcel.contents", function(val) {
			//console.log("parcel contents:", val);
		}, true);

		//Define form sections
		$rootScope.sections = [
			{
				name: "Whenua",
				route: $state.href("form.page", {pageNumber: 1, pageName: 'whenua'}),
			}, {
				name: "Applicant", 
				route: $state.href("form.page", {pageNumber: 2, pageName: 'applicant'}), //==> radiobtn to show details of admin

			}, {
				name: "The deceased",
				route: $state.href("form.page", {pageNumber: 3, pageName: 'deceased'}),

			}, {
				name: "Whakapapa",
				route: $state.href("form.page", {pageNumber: 4, pageName: 'whakapapa'}),

			}, {
			    name: "Whānau",
				route: $state.href("form.page", {pageNumber: 5, pageName: 'whanau'}),

			}, {
				name: "Is there a will?",
				route: $state.href("form.page", {pageNumber: 6, pageName: 'will'}),

			}, {
			    name: "Previous succession, Whānau trust",
				route: $state.href("form.page", {pageNumber: 7, pageName: 'transfer'}),

			},
			{
				name: "Application filled in",
				route: $state.href("form.page", {pageNumber: 9, pageName: 'finished'}),
				navOptions: {
					hideNext: true,
				}
			}, {
				name: "Checklist & documents",
				route: $state.href("form.page", {pageNumber: 10, pageName: 'checklist'}),
			}
		];

		//Get params from URL..
		var queryParams = $window.location.search;
		var promises = [];

		if(queryParams.length > 0) {
			queryParams = queryParams.split("&");

			angular.forEach(queryParams, function(value, index) {
				//?landBlock=1234
				queryParams[index] = value.replace("?", "");
				//landBlock=1234
				queryParams[index] = queryParams[index].split("=");

				promises.push(LandBlockService.get({blockId: queryParams[index][1]}).$promise);
			});

			$q.all(promises).then(function(data) {
				angular.forEach(data, function(block) {
					FormService.blocks.add(block);
				});
			}).catch(function(err) {
				$rootScope.dataError = true;
			});
		}

		FormService.setAction( SuccessionApplicationService.post );
	}
]);