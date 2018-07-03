angular.module('CloudCreator.controllers').controller('ReportsSummaryController', ['$scope', '$rootScope', 'vcsService', 'vcService', '$timeout', 'ReportsService', 'HighchartModel', '$q', '$modal',
	function($scope, $rootScope, vcsService, vcService, $timeout, ReportsService, HighchartModel, $q, $modal) {
		$scope.configs = [];
		$scope.titles = [];
		if($rootScope.chosenReport != undefined) {
			delete $rootScope.chosenReport;
		}
		
		//Date Control gets set first from 1 year ago until now.
		$scope.reportParams = {
			cloudId: ($scope.$parent.selectedCloud != undefined) ? $scope.$parent.selectedCloud: null,
			start: moment.tz('Pacific/Auckland').subtract(12, 'M').startOf("M"),
			end: moment.tz('Pacific/Auckland').endOf('M')
		}
		
		$scope.size = {
			height: 1,
		};

		//Create Scoped object for chart objects.
		$scope.charts = [];

		$scope.$on('updateCloud', function(e, data) {
			$scope.reportParams.cloudId = data;
		});

		//Watching dateRange so we can update data.
		$scope.$watch('reportParams', function(newVal, oldVal) {
			if(newVal.cloudId != null) {
				$scope.resolved = false;
				var start = newVal.start.format('MM/DD/YYYY');
				var end = newVal.end.format('MM/DD/YYYY');

				var date1 = new Date(start);
				var date2 = new Date(end);
				var selectedRange = selectionRange(date1,date2);

				if(newVal === oldVal) {
					//DO NUTHN
				} else {
					$scope.From = newVal.start.format('MMM, YYYY');
					$scope.To = newVal.end.format('MMM, YYYY');

					if($scope.interacted) {
						$scope.dateFormatted = {
							dateFrom: newVal.start.format('MMM, YYYY'),
							dateTo: newVal.end.format('MMM, YYYY')
						}
					}
					if(newVal.cloudId !== null) {
						var promises = [
							ReportsService.get({key: 'spend', cloudGuid: newVal.cloudId, startDate:start, endDate:end}).$promise,
							ReportsService.get({key: 'memory', cloudGuid: newVal.cloudId, startDate:start, endDate:end}).$promise,
							ReportsService.get({key: 'storage', cloudGuid: newVal.cloudId, startDate:start, endDate:end}).$promise
						];
					} else {
						var promises = [
							ReportsService.getAll({key: 'spend', startDate:start, endDate:end}).$promise,
							ReportsService.getAll({key: 'memory', startDate:start, endDate:end}).$promise,
							ReportsService.getAll({key: 'storage', startDate:start, endDate:end}).$promise
						]
					}

					$q.all(promises).then(function(data) {
						$scope.resolved = true;

						if($scope.configs.length > 0) {
							$scope.configs = [];
							$scope.charts = [];
							$scope.titles = [];
						}

						//LOOPING THROUGH EACH PROMISE ABOVE. ie. spend, memory, storage
						angular.forEach(data, function(reportData, index) {
							if(reportData.series != null) {
								var chartModel = new HighchartModel( {
									pointFormat: reportData.tooltip.datapoint,
									tooltipOptions: reportData.tooltip.options,
									title: reportData.title,
									categories: $scope.generateDates(reportData.range, selectedRange),
									colors: reportData.colors,
									size: $scope.size,
									series: function() {
										var $series = [];
										angular.forEach(reportData.series, function(value, index) {
											var row = {
												name: index,
												data: value
											}
											$series.push(row);
										});

										return $series;
									},
								});

								$scope.configs.push( chartModel.data );
								$scope.charts.push( chartModel.chart );
								$scope.titles.push( {
									title: reportData.title,
									tip: reportData.tooltip.subTitle
								});
							}
						});
						
						$scope.loading = false;
					});
				}
			}
		}, true);

		$scope.series = [];
		$scope.loading = true;

		$scope.$watch('loading', function() {
			if(!$scope.loading) {
				$scope.size.height = 400;
			}
		});

		var selectionRange = function(d1, d2) {
			var months;
			months = (d2.getFullYear() - d1.getFullYear()) * 12;
			months -= d1.getMonth();
			months += d2.getMonth() + 1;
			return months <= 0 ? 0 : months;
		}


		$scope.generateDates = function(range, selectedRange) {
			var dates = [],
			startMonth = parseInt(moment(range.start).format('M'));
			
			for(var i = startMonth; i < startMonth + selectedRange; i++) {
				var relativeOffset = i - startMonth,
				date = moment(range.start).add( relativeOffset, 'month' ).format('MMM YY');
				dates.push( date );
			}

			return dates;
		}
	}
]);
