angular.module('AKMU01A1.controllers').controller('WallController', [ '$scope', '$rootScope', 'SocketService', '$state', '$stateParams',
	function($scope, $rootScope, SocketService, $state, $stateParams) {
		console.log('wall.controller');
		$rootScope.context = 'wall';

		SocketService.on('to', function(data) {
			console.log('listen for emit');
			var $to = data.page;

			//TODO: do we need this???
			$rootScope.feature = data.params;

			//Navigate to page.
			$rootScope.params = data.params;

			// store background
			$rootScope.background = (data.params) ? data.params.background : null;

			console.log('state go w:', data.params);
			$state.go($to, data.params);
		});

		$rootScope.$on('$stateChangeSuccess',
			function(event, toState, toParams, fromState, fromParams){

				//console.log('state change event in wall controller..', event);
			}
		);

		$rootScope.$on('params', function(event, data) {
			//SETUP LISTENER..
		});
	}
]);