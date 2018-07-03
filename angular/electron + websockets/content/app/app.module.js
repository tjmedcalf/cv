angular.module('AKMU01A1', [
	'ngRoute',
	'ngResource',
	'ngAnimate',
	'ui.router',
	'AKMU01A1.controllers',
	'btford.socket-io',
	'AKMU01A1.services',
	'AKMU01A1.shared'
]).run(['$rootScope',
	function($rootScope) {
		console.log('APP INITIATE');
		
		// MediaService.query().$promise.then(function(data) {
			//console.log('media', data);
		// });

		// manage resize
		$(window).on('resizeend', function(event){
			$(document).trigger('app:resize');
		});

		Transitionner.init({
			transitionBasePath: "assets/img/transitions/",
			backgroundBasePath: "assets/img/backgrounds/"
		});

		$rootScope.apiURL = "http://dev.akmu01w1.welldev/api";
	}
]);

angular.module('AKMU01A1.controllers', []);
angular.module('AKMU01A1.services', []);
angular.module('AKMU01A1.shared', []);