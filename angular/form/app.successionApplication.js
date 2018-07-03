angular.module('successionApplication', [
	'ngResource',
	'ngRoute',
	'ui.router',
	'ngCookies',
	'ngStorage',
	'sharedDependencies',
])
.config(['$stateProvider', '$urlRouterProvider', '$templateRequestProvider', 
	function($stateProvider, $urlRouterProvider, $templateRequestProvider) {
		$stateProvider
			.state('form', {
				url: "/form",
				controller: "successionApplicationController",
				templateUrl: "/js/widgets/components/form/form.view.html",
			})
			.state('form.page', {
				url: "/:pageNumber/:pageName",
				templateProvider: ['$templateRequest', '$stateParams',
					function(templateRequest, $stateParams) {
						var tplPath = "/js/widgets/components/succession-application/pages/",
							tplUrl = tplPath + $stateParams.pageName + ".view.html";

						return templateRequest(tplUrl);
					}
			    ],
			})
			.state('form.confirmation', {
				url: "/thank-you",
				templateUrl: "/js/widgets/components/succession-application/pages/confirmation.view.html",
				//controller: [],
			})



		$urlRouterProvider.otherwise('/form/1/whenua');
	}
])
.config(['$locationProvider', function($locationProvider){
    //$locationProvider.html5Mode(true);
}]);