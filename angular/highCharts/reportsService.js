angular.module('CloudCreator.services').factory('ReportsService', ['$resource', '$q', '$timeout',
	function($resource, $q, $timeout) {
		var _self = {};
		var _privates = {
			promise: $q.defer(),
		}

		_privates.transformer = function(data, headersGetter, status) {
			var originalResponse = angular.fromJson(data),
				catTypes = [],
				$response = {
					range: {
						start: null,
						end: null,
						count: null,
						projected: false,
					},
					series: null
				};

			if(originalResponse.length > 0) {
				switch(originalResponse[0].DataSet[0].Category) {
					case 'vGB':
						//memory
						$response.title = "Assigned Memory";
						$response.tooltip = {
							options: {
								pointFormat: '<span style="color:{point.color}">\u25CF</span> <b>{point.y}</b> consumed<br/>',
							},
							subTitle: "Total memory consumption per month. Current month projected data is an estimation only.",
							datapoint: '<span style="color:{point.color}">\u25CF</span> <b>{point.y}</b> consumed<br/>',
						}
						
						$response.colors = [
							'#17B82C',
							'#0A77F7',
							'#F8C419',
							'#000000',
							'#CECECE',
						];
					break;
					case 'Storage':
						//storage
						$response.title = "Storage Allocation";
						$response.tooltip = {
							options: {
								pointFormat: '<span style="color:{point.color}">\u25CF</span> <b>{point.y}</b> consumed<br/>',	
							},
							subTitle: "Total storage consumption per month. Current month projected data is an estimation only.",
							datapoint: '<span style="color:{point.color}">\u25CF</span> <b>{point.y}</b> consumed<br/>',
						}
						$response.colors = [
							'#0A77F7',
							'#F8C419',
							'#17B82C',
							'#000000',
							'#CECECE',
						];
					break;
					case 'CloudSpend': 
						//spend
						$response.title = "Cloud Spend";
						$response.tooltip = {
							subTitle: "Total cloud spend per month. Current month projected spend is an estimation only.",
							options: {
								valueDecimals: 0,
								valuePrefix: '$',
								pointFormatter: function() {
									var msg;
									
									if(this.series.name.toLowerCase() == "projected") {
										msg = 'projected spend';
									} else {
										msg = 'spent';
									}

									return '<span style="color:' + this.color +'">\u25CF</span> <b>' + this.y +'</b> ' + msg + '. <br/>';
								}	
							},
							datapoint: '<span style="color:{point.color}">\u25CF</span> <b>{point.y}</b> spent<br/>',
						}
						$response.colors = [
							'#F8C419',
							'#CECECE',
						];
					break;
				}

				$response.series = {};
				$response.range.count = originalResponse[0].DataSet.length;

				angular.forEach(originalResponse, function(set) {
					
					//BUILD CAT TYPE TABLE AND SET RANGE
					angular.forEach(set.DataSet, function(item, index) {
						var label = item.Type;
						
						if(catTypes.indexOf(label) > -1 ) {
							//SKIP
						} else {
							catTypes.push(label);
						}
					});
				});

				if(catTypes.length > 0) {
					//BUILD SERIES OBJECT
					angular.forEach(catTypes, function(label) {
						$response.series[label] = [];
					});
				}

				angular.forEach(originalResponse, function(set, setIdx) {
					angular.forEach(set.DataSet, function(item, index) {
						angular.forEach($response.series, function(array, label) {
							if(label == item.Type) {
								if(index == 0 && setIdx ==0) {
									$response.range.start = item.StartDate;
								}

								if(item.CategoryType == 'Projected') {
									//SKIP PROJECTED 
									//TODO: Need to include this..
									//
									$response.range.projected = true;

									if(label == 'Total Spend') {
										if($response.series["Projected"] == undefined) {
											$response.series["Projected"] = [];
										}

										for(var i = 0; i<$response.series[label].length; i++) {
											$response.series["Projected"].push(0);
										}

										$response.series["Projected"].push( parseInt( item.Quantity.toFixed(0) ) );
										$response.series[label].push(0);
									} else {
										$response.series[label].push( parseInt( item.Quantity.toFixed(0) ) );
									}
								} else {
									$response.series[label].push( parseInt( item.Quantity.toFixed(0) ) );
								}
								

								if(index == (parseInt(set.DataSet.length) - 1) &&  setIdx == (parseInt(originalResponse.length) - 1)) {
									$response.range.end = item.EndDate;
									
									if(item.CategoryType == 'Projected') {
										$response.range.projected = true;
									}
								}
							}
						});
					});
				});
			}

			return $response;
		}

		return $resource('***/:key', {}, {
			get: {
				url: "***/:cloudGuid/***/:key",
				method: "get",
				transformResponse: _privates.transformer,
			},
			getAll: {
				method: 'get',
				transformResponse: _privates.transformer,
			},
			getLegacy: {
				url: "***/:cloudGuid/***",
				method: 'get',
				transformResponse: function(data, headersGetter, status) {
					var response = angular.fromJson(data),
						$return = {};

					angular.forEach(response, function(row) {
						//BUILD GROUPS
						if( Object.keys($return).indexOf(row.Category) > -1 ) {
							
						} else {
							$return[row.Category] = [];
						}
					});

					//Put in groups
					angular.forEach(response, function(row) {
						$return[row.Category].push(row);
					});

					return $return;
				}	
			}
		});
	}
]);

function getRandomArbitrary(min, max) {
	var random = Math.random() * (max - min) + min;
	//console.log(random);
    return random;
}


