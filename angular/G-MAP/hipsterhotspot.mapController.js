angular.module('hipsterhotspots.controllers').controller('MapController', ['$scope', 'uiGmapGoogleMapApi', 'MarkerModel', 'MarkerService', '$location', 'uiGmapIsReady', '$cookies',
    function ($scope, uiGmapGoogleMapApi, MarkerModel, MarkerService, $location, uiGmapIsReady, $cookies) {
        $scope.markers = MarkerModel.markers;

        $scope.showReview = false;
        $scope.mapReady = false;
        $scope.visitorName = '';
        $scope.showOverlay = true;

        $scope.closeReview = function() {
            $scope.showReview = false;
            $location.path('/');
        }

        $scope.checkCookie = function() {
            console.log('checking for cookie..', $cookies.get('name'));
            
            if($cookies.get('name')) {
                $scope.visitorName = $cookies.get('name');
                $scope.showOverlay = false;
            }
        }

        $scope.newCookie = function() {
            if($scope.visitorName != '') {
                $cookies.put('name', $scope.visitorName);
                $scope.showOverlay = false;
            } else {
                $scope.validationMsg = 'Please don\'t leave this blank!';
            }
        }

        MarkerService.get(function(data) {
            MarkerModel.init(data);
        });
        
        $scope.map = {
            center: {
                latitude: -41.29335, 
                longitude: 174.779048
            },
            zoom: 16,
            styles: [{"featureType":"administrative","stylers":[{"visibility":"off"}]},{"featureType":"poi","stylers":[{"visibility":"simplified"}]},{"featureType":"road","elementType":"labels","stylers":[{"visibility":"simplified"}]},{"featureType":"water","stylers":[{"visibility":"simplified"}]},{"featureType":"transit","stylers":[{"visibility":"simplified"}]},{"featureType":"landscape","stylers":[{"visibility":"simplified"}]},{"featureType":"road.highway","stylers":[{"visibility":"off"}]},{"featureType":"road.local","stylers":[{"visibility":"on"}]},{"featureType":"road.highway","elementType":"geometry","stylers":[{"visibility":"on"}]},{"featureType":"water","stylers":[{"color":"#84afa3"},{"lightness":52}]},{"stylers":[{"saturation":-17},{"gamma":0.36}]},{"featureType":"transit.line","elementType":"geometry","stylers":[{"color":"#3f518c"}]}],
            events: {
                drag: function(map) {
                    //"https://maps.google.com/maps?ll=-41.29335,174.779048&z=16&t=m&hl=en&gl=US&mapclient=apiv3"
                    $scope.$apply(function () {
                        //console.log(map);
                    });
                    
                },
                bounds_changed: function(map) {

                },
                center_changed: function(map) {

                }
            }
        }

        $scope.mapOptions =  {
            disableDefaultUI: true,
        }

        uiGmapGoogleMapApi.then(function(maps) {
            //Load API into scope.
            $scope.maps = maps;

            $scope.markerOptions = {
                animation: maps.Animation.DROP,
            };
        });

        //create service object from api + map instance once instance is ready.
        uiGmapIsReady.promise(1).then(function(instances) {
            $scope.mapReady = true;
            $scope.mapInstance = instances[0].map;
        })

        $scope.markerClick = function(marker) {
            $scope.showReview = true;
            $location.path('/review/' + marker.key);
        }

        $scope.$on('addMarker', function(event, spot_id) {
            MarkerService.get({id: spot_id}, function(data) {
                MarkerModel.add(data.spots[0]);
            });

            $scope.showReview = false;
            $location.path('/');
        });
    }
]);