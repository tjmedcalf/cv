angular.module('AKMU01A1.controllers').controller('HomeController', [ '$scope', '$rootScope', 'SocketService', '$state', '$stateParams',
	function($scope, $rootScope, SocketService, $state, $stateParams) {
		$scope.$on('section:ready', function(e, val) {
			$('.js-handler-left').connector({
				firstLineStartGap: 100,
				lineStartGap: 20
			});
		});

		if($stateParams.skipStart && $state.previous.name) {
			SocketService.emit('stateChange', {page: 'wall.medals'});
			TweenMax.set('.js-handler', {
                x: -3840
            });
            $scope.$on('section:ready', function(e, val) {
            	showElements();
            });
		}
		else{
			SocketService.emit('stateChange', {page: 'wall.enticement'});
		}

		function showElements() {
			$('.container__wrapper--right').connector({
				initialDelay: 0.5,
				delay: 1,
				firstLineStartGap: 40,
				lineStartGap: 20,
				lineEndGap: 20,
				hasBorder: true
			});
		}

		$scope.$on('animatetionComplete', function(e, val) {
			showElements();
			SocketService.emit('stateChange', {page: 'wall.medals'});
		});

		$scope.connectorParams2 = {
			delay: true
		}

		$scope.node1 = {
			type: 'img',
			content: '/assets/img/portraits/explore-node.png',
			hasBorder: true,
			link: 'console.explore',
			children: {
				"nodes" : [
					{
						type: 'label-small',
						content: {
							title: 'Why do people get awarded medals?'
						},
						distance: 175,
						angle: 270,
						children: [
							{
								type: 'button',
								display: 'satellite',
								distance: 100,
								angle: 265,
								content: {
									src: '/assets/img/icons/look.svg',
									class: 'icon-eye'
								},
								link: 'console.explore'
							}
						]
					}
				],
				"satellites" : {
					"display" : {
						start: -20,
						range: 95,
						distance: 300
					},
					"elements" : [
						{
							type: 'img',
							content: '/assets/img/idle/idle-1.png',
							link: 'console.explore'
						},
						{
							type: 'img',
							content: '/assets/img/idle/idle-2.png',
							link: 'console.explore'
						},
						{
							type: 'img',
							content: '/assets/img/idle/idle-3.png',
							link: 'console.explore'
						},
						{
							type: 'img',
							content: '/assets/img/idle/idle-4.png',
							link: 'console.explore'
						}
					]
				}
			}
		};

		$scope.satelliteNodes = {
			type: 'text',
			content: 'Start',
			hasBorder: true,
			children: {
				"nodes" : [
					{
						type: 'text',
						content: 'Touch the buttons to find out more',
						distance: 300,
						angle: 268,
						children: [
							{
								type: 'text',
								display: 'corners',
								content: 'Alternatively, swipe to begin',
								distance: 300,
								angle: 160,
							}
						]
					}
				]
			}
		};



		$scope.node2 = {
			type: 'img',
			content: '/assets/img/medals/360_mini.png',
			hasBorder: true,
			link: 'console.360',
			children: {
				"nodes" : [
					{
						type: 'label-small',
						content: {
							title: 'Medal details'
						},
						distance: 175,
						angle: 270,
						children: [
							{
								type: 'button',
								display: "satellite",
								distance: 100,
								angle: 275,
								content: {
									src: '/assets/img/icons/look.svg',
									class: 'icon-eye'
								},
								link: 'console.360'
							}
						]
					}
				],
				"satellites" : {
					"display" : {
						start: 95,
						range: 130,
						distance: 300
					},
					"elements" : [
						{
							type: 'img',
							content: '/assets/img/idle/idle-1b.png',
							link: 'console.360'
						},
						{
							type: 'img',
							content: '/assets/img/idle/idle-2b.png',
							link: 'console.360'
						},
						{
							type: 'img',
							content: '/assets/img/idle/idle-3b.png',
							link: 'console.360'
						},
						{
							type: 'img',
							content: '/assets/img/idle/idle-4b.png',
							link: 'console.360'
						},
						{
							type: 'img',
							content: '/assets/img/idle/idle-5b.png',
							link: 'console.360'
						}
					]
				}
			}
		};
	}
]);