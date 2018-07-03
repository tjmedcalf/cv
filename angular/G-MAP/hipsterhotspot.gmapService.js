angular.module('hipsterhotspots.services').service('GMapService', ['$q',
	function ($q) {
        
    	var self = this;

    	self.results = [];

    	self.init = function(maps, instance) {
    		self.maps = maps;

    		self.LatLng = new maps.LatLng(-41.289916, 174.780121);
    		self.placeService = new maps.places.PlacesService(instance);
    		self.geocoder = new maps.Geocoder;
    	}

    	self.nearbySearch = function(term) {
    		var deferred = $q.defer();

    		var request = {
                location: self.LatLng,
                radius: '30000',
                name: term
            }

            if(term != '') {
                self.placeService.nearbySearch(request, function(data, status) {
                	if(status == self.maps.places.PlacesServiceStatus.OK) {
                		deferred.resolve(data);
		            } else {
		            	deferred.reject(status);
		            }
                });
            } else {
                deferred.reject({error: 'term empty'});
            }

            return deferred.promise;
    	}

    	self.getAddress = function(place_id) {
    		var deferred = $q.defer();

    		self.geocoder.geocode({'placeId': place_id}, function(results, status) {
                
                var address = {
                	'st_num': results[0].address_components[0].long_name,
                	'st_name': results[0].address_components[1].long_name,
                	'suburb': results[0].address_components[2].long_name,
                	'city': results[0].address_components[3].long_name,
				}

                deferred.resolve(address);
            });

            return deferred.promise;
    	}

    	self.formatAddress = function(a) {
    		return a.st_num + " " + a.st_name + " " + a.suburb + " " + a.city;
    	}

    	
    }
]);

// if(status == $scope.$parent.maps.places.PlacesServiceStatus.OK) {
//                 $scope.results = [];

//                 _.forEach(data, function(result, i) {
//                     $scope.results.push(result);
//                 });

//             } else {
//                 $scope.results = [];
//             }