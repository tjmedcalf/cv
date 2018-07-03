angular.module('sharedDependencies')
.service('FormService', ['$q', '$timeout',
	function($q, $timeout) {
		var _self = {};
		var _private = {};

		_private.blocks = [];

		_self.blocks = {
			add: function(block) {
				_private.blocks.push(block);
			},
			save: function(data) {
				_private.blocks = data;
			},
			get: function() {
				return _private.blocks;
			},
			delete: function(blockId, callback) {
				var indexToRemove = "";

				angular.forEach(_private.blocks, function(block, index) {
					if(block.blockId == blockId) {
						indexToRemove = index;
					}
				});

				if(indexToRemove !== "") {
					_private.blocks.splice(indexToRemove, 1);
				}
			},
			getNames: function() {
				var names = [];

				angular.forEach(_private.blocks, function(block, index) {
					names.push(block.blockName);
				});

				return names;
			},
			getIDs: function() {
				var arr = [];

				angular.forEach(_private.blocks, function(block, index) {
					arr.push(block.blockId);
				});

				return arr;
			}
		}
		_self.getField = function(field) {
			return _private.storage[field];
		};
		
		_self.getAll = function(callback) {
			if(callback != undefined && typeof callback === 'function') {
				callback(_private.storage);
			}
			return _private.storage;
		};

		_self.successionApplication = {
			new: function() {
				_private.storage = {
					blocks: _private.blocks,
					applicant: {},
					deceased: {
						alias: [],
					},
					files: [],
				};

				return _private.storage;
			}
		};

		_self.serviceRequest = {
			new: function() {
				return {
					blocks: _private.blocks,
					interests: [],
					message: "",
				}
			}
		};

		_self.deliveryMan = {
			post: function(params, parcel, callback) {
				if(_private.formPost != undefined) {
					var resource = _private.formPost.save(params, parcel, function(result) {
						callback(result, true);
					});

					resource.$promise.catch(function (err) {
						callback(err, false);
					});
				} else {
					$timeout(function() {
						callback({
							status: 403,
						}, false);
					}, 2000);

					console.warn('form action not set..');
				}
			}
		}

		_self.setAction = function(action) {
			if(action.save != undefined && typeof action.save === 'function') {
				_private.formPost = action;	
			} else {
				console.warn("Action doesn't have SAVE method..");
			}
		}

		return _self;
	}
]);