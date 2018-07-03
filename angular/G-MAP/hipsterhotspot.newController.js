angular.module('hipsterhotspots.controllers').controller('NewController', ['$scope', 'ReviewService', 'GMapService', 'PayloadModel', 'MarkerService', 'RatingService',  
    function ($scope, ReviewService, GMapService, PayloadModel, MarkerService, RatingService) {
        $scope.$parent.showReview = true;

        $scope.$watch('mapReady', function (val) {
            console.log('map ready in watcher', val);
            
            if(val) {
                GMapService.init($scope.$parent.maps, $scope.$parent.mapInstance);
            }
        });

        $scope.showHelp = false;

        $scope.term = '';
        $scope.payload = new PayloadModel();
        $scope.results = [];
        $scope.beanies = 0;

        $scope.subTotal = 0;
        $scope.total = 0;
        
        $scope.hasReview = false;

        $scope.$watch('term', function (val) {
            var request = GMapService.nearbySearch(val);
            
            $scope.payload.name = '';
            $scope.payload.lat = '';
            $scope.payload.lon = '';
            $scope.payload.address = '';
            $scope.hasReview = false;
            
            request.then(function(data) {
                //Clear previous results
                $scope.results = [];

                _.forEach(data, function(result, i) {
                    $scope.results.push(result);
                });
            }, function(message) {
                console.log(message);
                $scope.results = [];
            });
        });

        $scope.calcTotal = function() {
            $scope.subTotal = 0;
            _.forEach($scope.payload.ratings, function(rating) {
                if(rating.score != '') {
                    $scope.subTotal = $scope.subTotal + rating.score;
                }
            });

            if($scope.payload.beanies > 0) {
                $scope.total = $scope.subTotal * $scope.payload.beanies;
            }
        }

        $scope.$watch('payload.beanies', function(val) {
            $scope.calcTotal();
            $scope.total = $scope.subTotal * $scope.payload.beanies;
        });

        $scope.loadPlace = function(result) {
            //check if already existing based on place_id
            $scope.payload.placeId = result.place_id;

            MarkerService.get({id: result.place_id}, function(data) {
                if(data.spots) {
                    console.log('Already in DB, edit?');
                    $scope.hasReview = true;
                } else {
                    $scope.payload.name = result.name;

                    $scope.payload.lat = result.geometry.location.G;
                    $scope.payload.lon = result.geometry.location.K;

                    //GET ADDRESS
                    var request = GMapService.getAddress(result.place_id);
                    
                    request.then(function(response) {
                        $scope.payload.address = GMapService.formatAddress(response);
                    });
                }
            });
        }

        $scope.submitForm = function() {
            //VALIDATION!!! ( maybe clientside on blur??? )

            $scope.payload.ratingsEncoded = angular.toJson($scope.payload.ratings);
            $scope.payload.author = $scope.$parent.visitorName;

            var $request = ReviewService.save({}, $scope.payload, function(data) {
                if(data.id) {
                    //ONLY REVIEW ADDED
                    $scope.$parent.closeReview();
                } else if(data.place_id) {
                    // REFRESH MARKERS || OPEN REVIEW.
                    $scope.$emit('addMarker', data.place_id);
                } else {
                    console.log('POST did something weird..', data);
                }
            
            }, function(data) {
                //fail
                console.log('service post response fail' , data);
                // SHOW ERROR ON SCREEN.
                alert('check console for error.');
            });
        }
    }
]);