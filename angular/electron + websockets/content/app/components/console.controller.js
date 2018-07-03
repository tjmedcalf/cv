angular.module('AKMU01A1.controllers').controller('ConsoleController', [ '$scope', '$rootScope', 'SocketService', '$state', '$stateParams', '$timeout',
	function($scope, $rootScope, SocketService, $state, $stateParams, $timeout) {
		console.log('console.controller', $stateParams);

		//First Load..
		//SocketService.emit('stateChange', {page: 'wall.explore', params: {catId: 1} });
		//SocketService.emit('stateChange', {page: 'wall.medalprofile', params: {medalId: 24}})

		$scope.current = $state.$current.name;

		if($state.$current.name == "console.idle") {
			$scope.showNav = false;
		} else {
			$scope.showNav = true;
		}

		$rootScope.restartTimeout = function() {
			$rootScope.setTimeOut();
		}

		//RESTARTS EACH TIME NAV
		$rootScope.setTimeOut = function() {
			console.log('set timeout');

			if($scope.timeout != undefined) {
				$timeout.cancel( $scope.timeout );
			}

			$scope.timeout = $timeout(function() {
				console.log('timeout callback');
				$state.go('console.idle');
			}, 18000000);
			// 30 mins
		}

		$rootScope.$on('$stateChangeSuccess',
			function(event, toState, toParams, fromState, fromParams){
				console.log("state", fromState.name, toState.name);

				$scope.current = toState.name;

				if(toState.name == "console.idle") {
					$scope.showNav = false;
				} else {
					$scope.showNav = true;
				}

				switch(toState.name) {
					case "console.360":
						SocketService.emit('stateChange', {page: 'wall.360'});
						break;
					case "console.decode":
						SocketService.emit('stateChange', {page: 'wall.medals'});
						break;
					case "console.explore":
						SocketService.emit('stateChange', {page: 'wall.medals'});
						break;
					case "console.idle":
						// SocketService.emit('stateChange', {page: 'wall.enticement'});
						break;
					case "console.feature":
						//SocketService.emit('stateChange', {page: 'wall.decode', params: toParams});
						break;
					case "console.profiles":
						SocketService.emit('stateChange', {page: 'wall.explore', params: toParams});
						break;
					case "console.profile":
						console.log();
						SocketService.emit('stateChange', {page: 'wall.medalprofile', params: toParams})
						break;
					/*case "console.explore":
						SocketService.emit('stateChange', {page: 'wall.enticement', params: toParams});
						break;*/
				}
			}
		)

		$rootScope.context = 'console';
	}
]);