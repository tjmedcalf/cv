angular.module('sharedDependencies')
.service('SuccessionApplicationService', ['$q', '$resource', 
	function($q, $resource) {
		var _private = {
			resources: {
				succession: {
					save: $resource("***/Create", {}, {}),
				},
			},
		}

		var _self = {
			model: {},
			post: _private.resources.succession.save,
		}
		
		return _self;
	}
]);