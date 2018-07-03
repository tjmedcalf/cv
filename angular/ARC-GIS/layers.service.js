angular.module('blockDetail')
.service('LayersService', ['$q',
	function($q) {
		var _helpers = {
			checkChildren: function(self) {
				angular.forEach(_self.checkboxes[self].nestedOptions, function(row){
					$(row.inputEl)[0].checked = true;
				});
			},
			uncheckSiblings: function(siblings) {
				angular.forEach(siblings, function(index) {
					$(_self.checkboxes[index].inputEl)[0].checked = false;
				
					angular.forEach(_self.checkboxes[index].nestedOptions, function(row){
						$(row.inputEl)[0].checked = false;
					});	
				});
			}
		}
		var _self = {
			checkboxes: {
				0: {
					neverVisible: true,
				},
				1: {
					neverVisible: true,
				},
				2: {
					onChecked: function(idx, callback) {
						var siblings = [5,8,11,15];
						_helpers.uncheckSiblings(siblings);
						_helpers.checkChildren(2);

						if(callback != undefined && typeof callback === 'function') {
							callback({layer: 'pasture'});
						}
					}
				},
				5: {
					onChecked: function(idx, callback) {
						var siblings = [8,2,11,15];
						_helpers.uncheckSiblings(siblings);
						_helpers.checkChildren(5);

						if(callback != undefined && typeof callback === 'function') {
							callback({layer: 'forestry'});
						}
					}
				},
				8: {
					onChecked: function(idx, callback) {
						var siblings = [2,5,11,15];
						_helpers.uncheckSiblings(siblings);
						_helpers.checkChildren(8);

						if(callback != undefined && typeof callback === 'function') {
							callback({layer: 'horticulture'});
						}
					}
				},
				11: {
					onChecked: function(idx, callback) {
						var siblings = [2,5,8,15];
						_helpers.uncheckSiblings(siblings);
						_helpers.checkChildren(11);

						if(callback != undefined && typeof callback === 'function') {
							callback({layer: 'land-use'});
						}
					}
				},
				15: {
					onChecked: function(idx, callback) {
						var siblings = [2,5,8,11];
						_helpers.uncheckSiblings(siblings);
						_helpers.checkChildren(15);

						if(callback != undefined && typeof callback === 'function') {
							callback({layer: 'land-use-suitability'});
						}
					}
				}
			},
		};

		_self.init = function(dom, callback) {
			var optionList = $(dom).children('li');

			angular.forEach(optionList, function(element) {
				var parentInput = $(element).children('.esriTitle').find('input');
				var parentLabel = $(parentInput).next('label').text();
				var childList = $(element).find('.esriSubList');
				var subLayerIndex = $(parentInput).attr("data-sublayer-index")

				if(_self.checkboxes[subLayerIndex] == undefined) {
					_self.checkboxes[subLayerIndex] = {};
				}

				_self.checkboxes[subLayerIndex].name = parentLabel;
				_self.checkboxes[subLayerIndex].inputEl = parentInput;

				if(childList.length > 0) {
					var childOptions = $(childList).children('.esriSubListLayer');

					_self.checkboxes[subLayerIndex].nestedOptions = [];

					angular.forEach(childOptions, function(element) {
						var inputField = $(element).find('input');
						var childLabel = $(inputField).next('label').text();

						$(inputField).attr("disabled", "disabled");

						_self.checkboxes[subLayerIndex].nestedOptions.push({
							name: childLabel,
							inputEl: inputField,
						});
					});
				}
			});
			
			if(callback != undefined && typeof callback === 'function') {
				callback();	
			}
		}

		//<input type="checkbox" id="layerlist_checkbox_sub_0_5" data-layer-index="0" data-sublayer-index="5" class="esriCheckbox">

		_self.visibleLayers = function() {
			var visibleLayers = [];

			angular.forEach(_self.checkboxes, function(row, index) {
				if($(row.inputEl)[0].checked) {
					if(row.neverVisible != undefined && row.neverVisible === true) {
						//SKIP
					} else {
						var sublayerIndex = $(row.inputEl).attr("data-sublayer-index");
						visibleLayers.push(sublayerIndex);

						if(row.nestedOptions != undefined && row.nestedOptions.length > 0) {
							angular.forEach(row.nestedOptions, function(child) {
								var sublayerIndex = $(child.inputEl).attr("data-sublayer-index");
								visibleLayers.push(sublayerIndex);
							});
						}
					}
				}
			});

			return visibleLayers;
		}

		_self.findInList = function(list, prop, search, callback) {
			var match = -1;

            angular.forEach(list, function(legend, index) {
                if(legend[prop] == search) {
                    match = index;
                }
            });

            callback(match);
		}

		return _self;
	}
]);
