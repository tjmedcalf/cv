angular.module("CloudCreator.services").factory("HighchartModel", ["$q",
	function($q) {
		return function( data ) {
			var _self = {};
			var deferred = $q.defer();
			 Highcharts.setOptions({
				 lang: {
					 thousandsSep:','
				 }
			 })

			_self.chart = deferred.promise;

			_self.data = {
				options: {
					credits: {
						enabled: false,
					},
					colors: data.colors,
					chart: {
						marginTop: 30,
						type: (data.chartType == undefined) ? 'column': data.chartType,
					},
					xAxis: {
						categories: data.categories,
					},
					yAxis: {
						title: {
							text: null,
						}
					},
				},
				series: data.series(),
				size: data.size,
				title: {
					text: null,
				},
				func: function(chart) {
					deferred.resolve(chart);
				},
			};

			if(data.chartType != undefined && data.chartType == 'areaspline') {
				_self.data.plotOptions = {
		            areaspline: {
		                fillOpacity: 0.3
		            }
		        };
			}
			if(data.projected != undefined && data.projected) {
				
				_self.data.options.xAxis.plotBands = [{
					from: 11.5,
					to: 12.5,
					color: 'rgba(54, 182, 255, .2)'
				}];;
			}
			if(data.pointFormat != null && data.pointFormat != undefined) {
				_self.data.tooltip = {
					pointFormat: data.pointFormat
				};
			}
			if(data.tooltipOptions != null && data.tooltipOptions != undefined) {
				
				_self.data.options.tooltip = data.tooltipOptions;
			}
			if(data.projected) {
				
			}

			return _self;
		}
	}
]);