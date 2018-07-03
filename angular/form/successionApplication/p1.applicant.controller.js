angular.module("successionApplication")
.controller("ApplicantController", ["$scope", "$rootScope", "FormService", "$stateParams", "$state",
	function($scope, $rootScope, FormService, $stateParams, $state) {
		$scope.form = $rootScope.parcel.contents;

		$scope.districts = {
			"Taitokerau": ["Kaitaia", "Kaikohe", "Whangārei", "Auckland"],
			"Waikato-Maniapoto": ["Hamilton", "Thames", "Tauranga", "Te Kuiti"],
			"Wairaiki": ["Rotorua", "Whakatāne", "Ōpōtiki", "Taupō"],
			"Tairāwhiti": ["Gisborne", "Ruatōria", "Wairoa"],
			"Tākitimu": ["Hastings", "Masterton"],
			"Aotea": ["Whanganui", "Palmerston North", "Hāwera", "New Plymouth", "Taumarunui", "Tūrangi", "Levin", "Wellington"],
			"Te Waipounamu": ["Christchurch", "Nelson", "Blenheim", "Dunedin", "Invercargill", "Chatham Islands"],
		};

		$scope.$watch('form.applicant.isAdmin', function(newValue, oldValue) {
			if(newValue != undefined) {
				if(newValue == "true" && (oldValue == "false" || oldValue == undefined)) {
					var newPage = {
						name: "Details of administration",
						route: $state.href("form.page", {pageNumber: 8, pageName: 'details'}),
					};

					$rootScope.sections.splice(7, 0, newPage);
				} else if(oldValue == "true" && newValue == "false") {
					//TODO: find the index dynamically..
					$rootScope.sections.splice(7, 1);
				}
			}
		});
	}
]);