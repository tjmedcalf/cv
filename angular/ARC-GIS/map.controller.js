angular.module("blockSearch")
.controller("MapController", ["$scope", "esriLoader", "MapService", "$timeout", "$q",
	function($scope, esriLoader, MapService, $timeout, $q) {
		var self = this;
        self.deferred = $q.defer();

        $scope.$watch('blocksIDs', function(blockIdArray) {
            if(blockIdArray != undefined && blockIdArray.length > 0) {
                if(MapService.ready) {
                    MapService.filterMarkers(blockIdArray, function(myFeatureExtent, features) {
                        self.features = features;
                        self.map.setExtent(myFeatureExtent, true);
                        
                        //SCOTT: this throws errors in the console.
                        self.redrawClusterLayer();
                    });
                } else {
                    self.doPromise = true;

                    self.deferred.promise.then(function() {
                        MapService.filterMarkers(blockIdArray, function(myFeatureExtent, features) {
                            self.features = features;
                            self.map.setExtent(myFeatureExtent, true);
                            
                            //SCOTT: this throws errors in the console.
                            self.redrawClusterLayer();
                        });
                    });
                }
            }
        });

        $scope.$on('hoverEvent', function(event, data) {
            if(data.blockId != null) {
                switch(data.event.type) {
                    case "mouseover":

                    angular.forEach(self.features, function(graphic) {
                        if(graphic.attributes.BLOCK_ID == data.blockId) {
                            self.openInfoWindow(graphic);
                        }
                    })
                break;
                default:
                    /*if(!$scope.$parent.fixedHover) {
                        self.closeWindow();
                    }*/
                }
            }
        });

		esriLoader.require([
    		'dojo/dom', 
            'dojo/parser', 
            'dojo/ready',
            'dojo/_base/array',
            'dojo/_base/Color',
            'dojo/dom-style',
            'dojo/query',

            'esri/map', 
            'esri/graphicsUtils',
            'esri/layers/ArcGISTiledMapServiceLayer', 
            'esri/layers/FeatureLayer',
            'esri/geometry/Point', 'esri/SpatialReference',  //only needed for early dev
            'esri/geometry/Polygon',
            'esri/request',
            'esri/graphic',
            'esri/geometry/Extent',

            'esri/symbols/SimpleMarkerSymbol',
            'esri/symbols/SimpleLineSymbol',
            'esri/symbols/SimpleFillSymbol',
            'esri/symbols/PictureMarkerSymbol',
            'esri/renderers/ClassBreaksRenderer',
            'esri/dijit/BasemapGallery', 'esri/arcgis/utils',

            'esri/layers/GraphicsLayer',
            'esri/dijit/Basemap',
            'esri/dijit/BasemapLayer',

            'esri/layers/VectorTileLayer',
            'esri/renderers/SimpleRenderer',

            'esri/dijit/Popup', 
            'esri/dijit/PopupTemplate',
            'esri/geometry/webMercatorUtils',
            'esri/tasks/query', 'esri/tasks/QueryTask', 

            'extras/ClusterFeatureLayer',

            'dojo/dom-class', 'dojo/dom-construct', 'dojo/on',
            'dojo/domReady!',
            'dijit/layout/BorderContainer', 
            'dijit/layout/ContentPane', 'dijit/TitlePane'
        ], 
        function(dom, parser, ready, arrayUtils, Color, domStyle, query,
        Map, graphicsUtils,
        ArcGISTiledMapServiceLayer, 
        FeatureLayer,
        Point, SpatialReference, Polygon, //only needed for early dev
        esriRequest, Graphic, Extent,
        SimpleMarkerSymbol, SimpleLineSymbol, SimpleFillSymbol, PictureMarkerSymbol, ClassBreaksRenderer,
        BasemapGallery, arcgisUtils,
        GraphicsLayer, Basemap, BasemapLayer,
        VectorTileLayer,SimpleRenderer,
        Popup, PopupTemplate, webMercatorUtils, Query, QueryTask,
        ClusterFeatureLayer,
        domClass, domConstruct, on) {
        	//Need these to prevent DOJO console errors..
            loadingState = false;
            errorState = false;
            parser.parse();

            //Pass methods into service..
            MapService.init({
                BasemapLayer: BasemapLayer, 
                Basemap: Basemap, 
                FeatureLayer: FeatureLayer,
                SimpleLineSymbol: SimpleLineSymbol,
                Color: Color,
                SimpleFillSymbol: SimpleFillSymbol,
                SimpleMarkerSymbol: SimpleMarkerSymbol,
                Popup: Popup,
                PopupTemplate: PopupTemplate,
                ClusterFeatureLayer: ClusterFeatureLayer,
                Query: Query,
                QueryTask: QueryTask,
                graphicsUtils: graphicsUtils,
                VectorTileLayer: VectorTileLayer,
            }, function() {
                self.popup = new Popup(MapService.getPopUpParams(), domConstruct.create("div"));
                
                on(self.popup, "hide", function(evt) {
                    self.map.graphics.clear();
                    
                    if($scope.$parent.fixedHover) {
                        self.closeWindow();
                        $scope.$parent.fixedHover = false;
                        $scope.$parent.hoveredRow = "";
                        $scope.$apply();
                    }
                });
                
                //Add the myTheme theme which is specified in the <style> tag at the top of this page
                domClass.add(self.popup.domNode, "myTheme");

                if(self.doPromise) {
                   self.deferred.resolve();
                }

                self.map = new Map('map', {
                    infoWindow: self.popup,
                    smartNavigation: false,
                    isScrollWheel: false,
                    isScrollWheelZoom: false,
                });

                self.vectorLayer = MapService.addVectorLayer(function(vtLayer) {
                    self.map.addLayer(vtLayer);
                });

                //JUST FOR DEV - REMOVE AFTER
                var point = new Point([174.892, -41.031],new SpatialReference({ wkid:4326 }));
                self.map.centerAndZoom(point,6);
                //JUST FOR DEV - REMOVE THE ABOVE AFTER


                self.polygonFeatureLayer = MapService.addPolygons(function(polygonFeatureLayer) {
                    //Alternative to passing as param?
                    //polygonFeatureLayer.setDefinitionExpression( MapService.whereClause );

                    self.map.addLayer(polygonFeatureLayer);
                    on(polygonFeatureLayer, "mouse-over", function(evt) {
                        //console.log('mouse over', evt.graphic.attributes.BLOCK_ID);
                        $scope.$parent.hoveredRow = evt.graphic.attributes.BLOCK_ID;
                        $scope.$apply();
                    });
                    on(polygonFeatureLayer, "mouse-out", function(evt) {
                        //console.log('mouse over', evt.graphic.attributes.BLOCK_ID);
                        if(!$scope.$parent.fixedHover) {
                            $scope.$parent.hoveredRow = "";
                        } else {
                            $scope.$parent.hoveredRow = $scope.$parent.fixedHover;
                        }
                        
                        $scope.$apply();
                    });
                    on(polygonFeatureLayer, "click", function(evt) {
                        $scope.$parent.hoveredRow = evt.graphic.attributes.BLOCK_ID;
                        $scope.$parent.fixedHover = $scope.$parent.hoveredRow;
                        $scope.$apply();
                    });
                }, {definitionExpression: MapService.whereClause});

                self.map.on('load', function() { 
                    //self.clusterLayer = MapService.addClusters(self.map, self.afterAddCluster);
                });

                self.map.on('pan-end', function() { 
                    self.redrawClusterLayer() 
                });

                self.map.on('zoom-end', function() { 
                    if(self.map.getLevel() > 9 && $scope.$parent.block == undefined) {
                        MapService.getAllMarkers(function() {
                            self.clusterLayer = MapService.addClusters(self.map, self.afterAddCluster);
                        });
                        
                    }
                });
            });

            self.redrawClusterLayer = function() {
                if(self.clusterLayer != undefined) {
                    self.map.removeLayer( self.clusterLayer );    
                }
                
                self.clusterLayer = MapService.addClusters( self.map, self.afterAddCluster );

                self.polygonFeatureLayer.setDefinitionExpression( MapService.whereClause );
                self.polygonFeatureLayer.refresh();
            }

            self.afterAddCluster = function(clusterLayer) {
                // Providing a ClassBreakRenderer is also optional
                //clusterLayer.setRenderer(renderer);
                self.map.addLayer( clusterLayer );
                
                // close the info window when the map is clicked
                //map.on('click', cleanUp);  //This is needed but causes a problem with the polygon layer.  NEEDS THOUGHT!!!
                
                // close the info window when esc is pressed
                self.map.on('key-down', function(e) {
                    if (e.keyCode === 27) {
                        map.infoWindow.hide();
                    }
                });
            }

            self.openInfoWindow = function(feature) {
                self.map.graphics.clear();
                self.map.infoWindow.hide();

                self.map.graphics.clear();
                var point = feature.geometry.getCentroid();

                var marker = new PictureMarkerSymbol();
                //marker.setAngle(-360);
                marker.setHeight(65);
                marker.setWidth(49);
                marker.setOffset(0, -12);
                marker.setUrl("/img/Location_Icon.png");
                feature.setSymbol(marker);

                self.map.graphics.add(feature);
                self.map.infoWindow.setTitle("");
                self.map.infoWindow.setContent(feature.getContent());
                self.map.infoWindow.show(point);
                //self.map.centerAt(point);
            }
            self.closeWindow = function() {
                self.map.graphics.clear();
                self.map.infoWindow.hide();
            }
    	});
	}
]);


