angular.module('AKMU01A1')
.config(['$stateProvider',
	function($stateProvider) {
		//console.log('test');

		$stateProvider
		.state('wall', {
			url: '/wall',
			templateUrl: '/app/components/wall.html',
			controller: 'WallController'
		})
		.state('console', {
			url: '/console',
			templateUrl: '/app/components/console.html',
			controller: 'ConsoleController'
		})
		.state('wall.enticement', {
			url: '/enticement',
			templateUrl: '/app/components/enticement/enticement.template.html',
			controller: 'EnticementController'
		})
		.state('wall.medals', {
			url: '/medals_en_masse',
			templateUrl: '/app/components/medals_en_masse/medalsEnMasse.template.html',
			controller: 'MedalsEnMasseController',
			background: 'wall-medals.jpg'
		})
		.state('console.decode', {
			url: '/page/:page',
			templateUrl: '/app/components/landing/landing.template.html',
			controller: 'LandingController'
		})
		.state('console.360', {
			url: '/360',
			templateUrl: '/app/components/360/360.template.html',
			controller: '360Controller'
		})
		.state('console.feature', {
			url: '/feature/:option',
			templateUrl: '/app/components/feature/feature.template.html',
			controller: 'FeatureController',
			background: {
				'bars clasps': 'features/bars-clasps.jpg',
				'suspensions': 'features/suspensions.jpg',
				'shapes': 'features/shapes.jpg',
				'ribbons': 'features/ribbons.jpg',
				'symbolism': 'features/symbolism.jpg'
			}
		})
		.state('wall.decode', {
			url: '/decode/:id',
			templateUrl: '/app/components/split_view/splitview.template.html',
			controller: 'SplitViewController'
		})
		.state('wall.360', {
			url: '/360/:tmpl',
			templateUrl: '/app/components/split_view/splitview.template.html',
			controller: 'SplitViewController',
			background: 'medals-features.jpg'
		})
		.state('wall.medalprofile', {
			url: '/medal_profile/:id',
			templateUrl: '/app/components/medal_profile/medalprofile.template.html',
			controller: 'MedalProfileController'
		})
		.state('console.explore', {
			url: '/explore',
			templateUrl: '/app/components/categories/categories.template.html',
			controller: 'CategoriesController',
			background: 'landing-console.jpg'
		})
		.state('console.profiles', {
			url: '/explore/:catId/:category',
			templateUrl: '/app/components/profiles/profiles.template.html',
			controller: 'ProfilesController',
			background: 'explore-console-1.jpg'
		})
		.state('console.profile', {
			url: '/profile/:id',
			templateUrl: '/app/components/profile/profile.template.html',
			controller: 'ProfileController',
			background: 'explore-profile-console-1.jpg'
		})
		.state('wall.explore', {
			url: '/explore/:catId',
			templateUrl: '/app/components/split_view/splitview.template.html',
			controller: 'SplitViewController',
			background: 'decode.jpg'
		})
		.state('console.idle', {
			url: '/idle?skipStart',
			templateUrl: '/app/components/home/home.template.html',
			controller: 'HomeController',
			background: 'idle-console.jpg'
		})
		.state('home', {
			url: '/',
			redirectTo: 'console.idle'
		});
	}
])
.run(['$state', '$rootScope', 'SocketService', function($state, $rootScope, SocketService) {
    $rootScope.$on('$stateChangeStart', function(e, toState, toParams, fromState, fromParams) {

		if($rootScope.stateChangeBypass) {
			$rootScope.stateChangeBypass = false;
			return;
		}

		console.log('prevent state change on start');
		e.preventDefault();

    	Transitionner.show({
    		context: $rootScope.context,
    		background: (typeof toState.background === "object") ? "/console/"+toState.background[toParams.option.toLowerCase()] : toState.background || null,
			callback: function() {
				$(document).trigger('section:leave');
				$rootScope.stateChangeBypass = true;
				$state.previous = fromState;
    			
    			console.log('state go on show');
    			$state.go(toState, toParams);
			}
		});
    });

    $rootScope.$on('$stateChangeSuccess', function(e, toState, toParams, fromState, fromParams) {
    	console.log('prevent state change on success');
    	e.preventDefault();

    	Transitionner.hide({
    		context: $rootScope.context,
    		callback: function() {
    			setTimeout(function(){
    				$rootScope.$broadcast('section:ready');
    				
    				SocketService.emit('transitionerReady', { state: true })
    				
    				if($rootScope.setTimeOut != undefined) {
    					console.log('set timeout on change');
    					$rootScope.setTimeOut();
    				}
    				
    				$state.go(toState.name, toParams);
    			}, 1000)
    		}
    	});
    });
}]);