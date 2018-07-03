angular.module('sharedDependencies')
.service('MapService', ['$q', '$resource',
	function($q, $resource) {
		var _self = {
			whereClause: "1=2",
			ready: false,
		};
		var _api = {};
		var _private = {
			setWhereClause: function(arrayOfInputs) {
	        	if(arrayOfInputs!= undefined && arrayOfInputs.length > 0) {
	        		var outputString;

	        		angular.forEach(arrayOfInputs, function(blockId, index) {
						if(index == 0) {
							outputString = '(BLOCK_ID=' + blockId + ')';
						} else {
							outputString = outputString + ' OR (BLOCK_ID=' + blockId + ')';
						}
					});

					return outputString;
	        	} else {
	        		return "1=1";
	        	}
	        },
			preparePopupTemplate: function() {
				// popupTemplate to work with attributes specific to this dataset
	            _self.popupTemplate = _api.PopupTemplate({
					//'title': '{BLOCK_NAME}',
					'title': '',
					description: 
						"<h3 class='infowindow__title'>{BLOCK_NAME}</h3>" +
						"<table class='infowindow__content'>" +
						"<tr><td class='infowindow__dataLabel'>Area</td><td class='infowindow__dataContent'>{BLOCK_AREA} ha</td></tr>" +
						"<tr><td class='infowindow__dataLabel'>Shares</td><td class='infowindow__dataContent'>{TOTAL_SHAR}</td></tr>" +
						"<tr><td class='infowindow__dataLabel'>Owners<td class='infowindow__dataContent'>{TOTAL_OWNE}</td></tr>" +
						"</table>",
					fieldInfos: [
						{ fieldName: "BLOCK_AREA", label: "Area", visible: true, format: { places: 1 } },		//sets the block area to 1 decimal place
						{ fieldName: "TOTAL_SHAR", label: "Shares", visible: true, format: { places: 0 } },		//sets the block area to 0 decimal places
						{ fieldName: "TOTAL_OWNE", label: "Owners", visible: true, format: { places: 0 } }		//sets the block area to 0 decimal places
					],
	            });
			},
			getRenderer: function(fillColor, lineColor, lineThickness) {
				var fillOptions = {
					color:Color = new _api.Color(fillColor),
				};

				var lineOptions = {
					style: _api.SimpleLineSymbol.STYLE_SOLID,
					color: new _api.Color(lineColor),
					thickness: lineThickness,
				};

				var line = new _api.SimpleLineSymbol(lineOptions.style , lineOptions.color, lineOptions.thickness);
				var fill = new _api.SimpleFillSymbol("solid", line, fillOptions.color);
				
				return new _api.SimpleRenderer(fill);
			},
			//TODO - add service wide URL vars;
			serviceUrl: [
				"https://***/MapServer/0",
				"https://***/MapServer/1",
				"https://***/MapServer",
			],
			featureLayerApi: {
				infrastructure: "https://***/MapServer/0",
				maraeAndUrupa: "https://***/MapServer/1"
			},
			arcgisUrlPrefix: "",
		}

		_self.init = function(api, callback) {
			angular.forEach(api, function(method, methodName) {
				_api[methodName] = method;
			});

			_private.preparePopupTemplate();
			_self.ready = true;

			if(_self.afterInit != undefined && typeof _self.afterInit === "function") {
				_self.afterInit();
			}

			callback();
		}

		_self.addBaseMapWidget = function(callback) {
		    //logic taken from https://bl.ocks.org/jpeterson/09aefe6ddc389a7aee7303d8d6a9abb7
		    //add the basemap gallery, in this case we'll display maps from ArcGIS.com including bing maps
		    var basemapLayers = {
		    	//topo map - Vector
		    	topoLayer: new _api.BasemapLayer({type: "VectorTileLayer", styleUrl:'https://www.arcgis.com/sharing/rest/content/items/7dc6cea0b1764a1f9af2e679f642f0f5/resources/styles/root.json'}),
		    	//streets - Vector
				streetsLayer: new _api.BasemapLayer({type: "VectorTileLayer", styleUrl:'https://www.arcgis.com/sharing/rest/content/items/7549fb39378a485ca0c9d18a2d968c15/resources/styles/root.json'}),
				
				//light grey - Vector
				ltGreyLayer: new _api.BasemapLayer({type: "VectorTileLayer", styleUrl:'https://www.arcgis.com/sharing/rest/content/items/8a2cba3b0ebf4140b7c0dc5ee149549a/resources/styles/root.json'}),

				//Imagery with Labels Basemap
				aerialLayer: new _api.BasemapLayer({url:'https://services.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer'}),
				aerialLabelsLayer: new _api.BasemapLayer({url:'https://services.arcgisonline.com/arcgis/rest/services/Reference/World_Transportation/MapServer'}),
		    }

		    var basemaps = {
		    	// topo item for gallery
		    	topoBasemap: new _api.Basemap({
					layers: [basemapLayers.topoLayer],
					id: 'topo',
					title: 'Topographic',
					thumbnailUrl:'https://www.arcgis.com/sharing/rest/content/items/67372ff42cd145319639a99152b15bc3/info/thumbnail/topographic_relief.jpg'
				}),
				streetsBasemap: new _api.Basemap({
					layers: [basemapLayers.streetsLayer],
					id: 'streets',
					title: 'Streets',
					thumbnailUrl:'https://www.arcgis.com/sharing/rest/content/items/7549fb39378a485ca0c9d18a2d968c15/info/thumbnail/Streets_Local_language.jpg'
				}),
				aerialBasemap: new _api.Basemap({
					  layers: [basemapLayers.aerialLayer, basemapLayers.aerialLabelsLayer],
					  id: 'aerial',
					  title: 'Aerial',
					  thumbnailUrl:'https://www.arcgis.com/sharing/rest/content/items/10df2279f9684e4a9f6a7f08febac2a9/info/thumbnail/ago_downloaded.jpg'
				}),
				ltGreyBasemap: new _api.Basemap({
					  layers: [basemapLayers.ltGreyLayer],
					  id: 'ltGrey',
					  title: 'Light grey canvas',
					  thumbnailUrl:'https://www.arcgis.com/sharing/rest/content/items/8a2cba3b0ebf4140b7c0dc5ee149549a/info/thumbnail/small.jpg'
				}),
		    }

			callback(basemaps);
		}

		_self.createSimpleFillSymbol = function(params) {
			var line = new _api.SimpleLineSymbol(params.lineStyle, new _api.Color(params.lineColor), params.lineThickness);
			var fillColor = new _api.Color(params.fillColor);

			return new _api.SimpleFillSymbol("solid", line, fillColor);
		}

		_self.getPopUpParams = function() {
			//The popup is the default info window so you only need to create the popup and 
			//assign it to the map if you want to change default properties. Here we are 
			//noting that the specified title content should display in the header bar 
			//and providing our own selection symbol for points.

			//this creates a symbology for a red box around the selected polygons on the map 
			var line = new _api.SimpleLineSymbol(_api.SimpleLineSymbol.STYLE_SOLID, new _api.Color([255,0,66]), 2);
			var fillColor = new _api.Color([153,11,29,0.5]);
			var fill = new _api.SimpleFillSymbol("solid", line, fillColor);

			//this creates a symbology for a red box around the selected point on the map 
			var newMarkerSymbol = new _api.SimpleMarkerSymbol({
				//"color": [208,2,27],
				"color": [153,11,29],
				"size": 20,
				"angle": -30,
				"xoffset": 0,
				"yoffset": 0,
				"type": "esriSMS",
				"style": "esriSMSCircle",
				"outline": {
					"color": [0,0,0,255],
					"width": 0,
					"type": "esriSLS",
					"style": "esriSLSSolid"
				}
			});

			//creates the pop and passes in the design parameters, adds red box symbol, 
			//removes title from body, anchors the popup above the point, creates the div, 
			//applies the 'myTheme' CSS
			return {
				fillSymbol: fill,
				markerSymbol: newMarkerSymbol,
				titleInBody: false,
				anchor: "top",
				pagingControls: false,
				pagingInfo: false,
			};
		}

		_self.addDynamicMapServiceLayer = function(callback) {
			var dynamicMapServiceLayer = new _api.ArcGISDynamicMapServiceLayer(_private.serviceUrl[2], {
                "opacity" : 0.55,
                "id" : 'Context'
            });

            callback(dynamicMapServiceLayer);
            return dynamicMapServiceLayer;
		}

		_self.addVectorLayer = function(callback) {
			var vtLayer = new _api.VectorTileLayer("https://www.arcgis.com/sharing/rest/content/items/8a2cba3b0ebf4140b7c0dc5ee149549a/resources/styles/root.json");
			
			callback(vtLayer);

			return vtLayer
		}

		_self.addFeature = function(params, callback) {
			var featureLayer = new _api.FeatureLayer(_private.featureLayerApi[params.servicePropName]);
			featureLayer.id = params.id;

			return featureLayer;
		}

		_self.addPolygons = function(callback, optionalParams) {
		  	//add the operational layer to the map.  Parameters set the URL to the service.  
		  	//State that each map request will refresh the data.  pass in the template.  limit the fields.
		  	var params = {
				mode: _api.FeatureLayer.MODE_ONDEMAND,
				id: 'blocks',
				infoTemplate: _self.popupTemplate,
				outFields: ["BLOCK_NAME", "BLOCK_AREA", "TOTAL_SHAR", "TOTAL_OWNE", "BLOCK_ID"],
			}

			if(optionalParams != undefined) {
				angular.extend(params, optionalParams);
			}

			polygonFeatureLayer = new _api.FeatureLayer(_private.serviceUrl[1], params);
            
            if(_api.SimpleRenderer != undefined) {
            	renderer = _private.getRenderer([204, 204, 204, 0.5], [0, 0, 0, 255], 0.4);
            	polygonFeatureLayer.setRenderer(renderer);
            }

			callback(polygonFeatureLayer);
			return polygonFeatureLayer;
        }

        _self.addClusters = function(map, callback) {
		    //logic taken from httpss://github.com/odoe/esri-clusterfeaturelayer 
            var clusterLayer = new _api.ClusterFeatureLayer({
              'url': _private.serviceUrl[0],
              'distance': 100,
              'id': 'clusters',
              'labelColor': '#fff',
              'resolution': map.extent.getWidth() / map.width,
              'singleColor': '#D0021B',
              'singleTemplate': _self.popupTemplate,
              'useDefaultSymbol': true,
              'objectIdField': 'OBJECTID', // define the objectid field
			  'where': _self.whereClause
            });            
            
            if(typeof callback === 'function') {
            	callback(clusterLayer);	
            }
            
            return clusterLayer;
        }
        _self.getAllMarkers = function(callback) {
        	_self.whereClause = _private.setWhereClause();
        	callback();
        }

        _self.filterMarkers = function(blocks, callback) {
        	var deferred = $q.defer();
			_self.whereClause = _private.setWhereClause(blocks);

        	var queryTask = new _api.QueryTask(_private.serviceUrl[1]);
			var query = new _api.Query();

			query.returnGeometry = true;
			query.outFields = ["BLOCK_ID", "BLOCK_NAME", "BLOCK_AREA", "TOTAL_SHAR", "TOTAL_OWNE"];

			query.where = _self.whereClause;
				
			queryTask.execute(query, function(results) {
				deferred.resolve(results);
			});

			deferred.promise.then(function(data) {
				var resultItems = [];
                var resultCount = data.features.length;

                angular.forEach(data.features, function(graphic) {
                	graphic.setInfoTemplate(_self.popupTemplate);
                });
                
                var myFeatureExtent = _api.graphicsUtils.graphicsExtent(data.features);

				callback(myFeatureExtent, data.features);
			});

			return deferred.promise;
        }

		return _self;
	}
]);

