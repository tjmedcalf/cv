angular.module("blockDetail")
.controller("MapController", ["$scope", "esriLoader", "MapService", "$timeout", "$q", "LayersService",
	function($scope, esriLoader, MapService, $timeout, $q, LayersService) {
		var self = this;

        $scope.showControlPanel = "";

        $scope.toggleCP = function(control) {
            if(control == $scope.showControlPanel) {
                $scope.showControlPanel = "";
            } else {
                $scope.showControlPanel = control;
            }
        }

        //Watching scope var inside map event which lets us know when the polygons/graphics are loaded.
        $scope.$watch('graphicCount', function(val) {
            if(val != undefined) {
                //We hope the featured block has loaded..
                if($scope.features != undefined) {
                    angular.forEach($scope.features, function(feature) {
                        angular.forEach(self.polygonFeatureLayer.graphics, function(graphic) {
                            if(graphic.attributes.BLOCK_ID == feature.attributes.BLOCK_ID) {
                                self.polygonFeatureLayer.remove(graphic);
                                //graphic.hide();
                            }
                        });
                    });
                } else {
                    //do a promise or something..
                    // this bit largely untested.. hard to simulate.
                    // contingency if feature loads slower than polygons - rare.
                    self.afterFeature = $q.defer();
                    
                    self.afterFeature.promise.then(function() {
                        //Trigger watcher
                        $scope.graphicCount = $scope.graphicCount + 1;
                    });
                }
            }
        });

		esriLoader.require([
            'dojo/dom',                 //yup
            'dojo/parser',              //yup
            'dojo/ready',
            'dojo/_base/array',
            'dojo/_base/Color',
            'dojo/dom-style',
            'dojo/query',

            'esri/map',                     //yup
            'esri/graphicsUtils',           //yup
            'esri/layers/FeatureLayer',     //yup
            'esri/layers/ArcGISDynamicMapServiceLayer', //yup
            'esri/request',
            'esri/graphic',                 //yup
            'esri/geometry/Extent',

            'esri/symbols/SimpleMarkerSymbol',
            'esri/symbols/SimpleLineSymbol',    //yup
            'esri/symbols/SimpleFillSymbol',    //yup
            'esri/dijit/BasemapGallery',        //yup
            'esri/arcgis/utils',

            'esri/layers/GraphicsLayer',        //yup
            'esri/dijit/Basemap',               //yup
            'esri/dijit/BasemapLayer',          //yup

            'esri/layers/VectorTileLayer',
            'esri/renderers/SimpleRenderer',
            
            'esri/dijit/LayerList',             //yup
            'esri/dijit/Legend',                //yup
            'esri/dijit/Popup',                 //yup
            'esri/dijit/PopupTemplate',         //yup
            'esri/dijit/HomeButton',
            'esri/geometry/webMercatorUtils',
            'esri/tasks/query', 'esri/tasks/QueryTask',     //yup
            'esri/toolbars/navigation',
            'dojo/dom-class', 'dojo/dom-construct', 'dojo/on',  //yup
            'dojo/domReady!',   //yup
            'dijit/layout/BorderContainer',     //yup
            'dijit/layout/ContentPane', 'dijit/TitlePane'   //yup
        ], 
        function(dom, parser, ready, arrayUtils, Color, domStyle, query,
        Map, graphicsUtils,
        FeatureLayer,
        ArcGISDynamicMapServiceLayer, 
        esriRequest, Graphic, Extent,
        SimpleMarkerSymbol, SimpleLineSymbol, SimpleFillSymbol, 
        BasemapGallery, arcgisUtils,
        GraphicsLayer, Basemap, BasemapLayer, 
        VectorTileLayer, SimpleRenderer,
        LayerList, Legend,
        Popup, PopupTemplate, HomeButton,
        webMercatorUtils, 
        Query, QueryTask,
        Navigation,
        domClass, domConstruct, on) {
        	//Need these to prevent DOJO console errors..
            loadingState = false;
            errorState = false;
            parser.parse();

            //Pass methods into service..
            MapService.init({
                SimpleLineSymbol: SimpleLineSymbol,
                Color: Color,
                SimpleFillSymbol: SimpleFillSymbol,
                SimpleMarkerSymbol: SimpleMarkerSymbol,
                PopupTemplate: PopupTemplate,
                Basemap: Basemap,
                BasemapLayer: BasemapLayer,
                QueryTask: QueryTask,
                Query: Query,
                graphicsUtils: graphicsUtils,
                ArcGISDynamicMapServiceLayer: ArcGISDynamicMapServiceLayer,
                FeatureLayer: FeatureLayer,
                VectorTileLayer: VectorTileLayer,
                SimpleRenderer: SimpleRenderer,
            }, function() {
                //create popup object.
                self.popup = new Popup(MapService.getPopUpParams(), domConstruct.create("div"));
                
                //Add the myTheme theme which is specified in the <style> tag at the top of this page
                domClass.add(self.popup.domNode, "myTheme");

                self.map = new Map('map', {
                    infoWindow: self.popup,
                    smartNavigation: false,
                    isScrollWheel: false,
                    isScrollWheelZoom: false,
                });

                self.vectorLayer = MapService.addVectorLayer(function(vtLayer) {
                    self.map.addLayer(vtLayer);
                });

                self.infrastructureFeatureLayer = MapService.addFeature({servicePropName: "infrastructure", id: "Infrastructure"});
                self.maraeAndUrupaFeatureLayer = MapService.addFeature({servicePropName: "maraeAndUrupa", id: "MaraeAndUrupa"});

                self.navToolbar = new Navigation(self.map);

                //Add base maps.
                MapService.addBaseMapWidget(function(basemaps) {
                    var basemapGallery = new BasemapGallery({
                        showArcGISBasemaps: false,
                        map: self.map,
                        basemaps: [basemaps.topoBasemap, basemaps.streetsBasemap, basemaps.aerialBasemap, basemaps.ltGreyBasemap]
                    }, "basemapGallery");
                    
                    basemapGallery.startup();

                    basemapGallery.on("error", function(msg) {
                        console.log("basemap gallery error:  ", msg);
                    });
                });
                
                //Add polygons - other shapes and popups?
                self.polygonFeatureLayer = MapService.addPolygons(function(polygonFeatureLayer) {
                    self.map.addLayer(polygonFeatureLayer);

                    //TODO: need handler for errors.
                    self.dynamicMapServiceLayer = MapService.addDynamicMapServiceLayer(function(layer) {
                        //Add overlay layer(s);
                        self.map.addLayer(layer);
                    });
                });

                //Do Legend & LayerList stuff..
                self.legendDijit = new Legend({
                    map: self.map,
                    layerInfos: [{layer: self.map.getLayer("Context"), title:'Context Information'}],
                }, "legendDiv");

                self.layerListDijit = new LayerList({
                    map: self.map,
                    layers: [{layer:self.map.getLayer("Context"), title:'Context Information'}],
                    showOpacitySlider: true,
                    showLegend: true,
                    visible: true,
                }, "layerlist");

                //TODO: maybe move into the map.onload??
                self.legendDijit.startup();
                self.layerListDijit.startup();


                //-- Map EVENTS --//
                on(self.map, 'load', function() { 
                    //Set Extent.. need to wait for map to load..

                    MapService.filterMarkers([$scope.id], function(myFeatureExtent, features) {
                        self.featureExtent = myFeatureExtent;

                        self.map.graphics.clear();
                        
                        self.map.setExtent(myFeatureExtent, true);

                        self.homeButton = new HomeButton({
                            theme: "HomeButton",
                            map: self.map,
                            extent: self.featureExtent,
                            visible: true,
                        }, "startView");

                        self.homeButton.startup();
                        on(self.homeButton, "home", function (evt) {
                            var level = self.map.getLevel();
                        
                            if (level > 14) {
                                self.map.setLevel(level-3);
                            }
                        });

                        if(features.length > 0) {
                           //Set current block as red.
                           var fillSymbol = MapService.createSimpleFillSymbol({
                                lineStyle: SimpleLineSymbol.STYLE_SOLID,
                                lineColor: [255,0,66],
                                lineThickness: 2,
                                fillColor: [153,11,29,0],
                            });
                            
                            angular.forEach(features, function(feature) {
                                feature.setSymbol(fillSymbol);
                                self.map.graphics.add(feature);
                            });

                            //Let scope know we have features;
                            $scope.features = features;
                            
                            if(self.afterFeature != undefined) {
                                self.afterFeature.resolve();
                            }
                        }
                        
                        var level = self.map.getLevel();
                        
                        if (level > 14) {
                            self.map.setLevel(level-3);

                            //SCOTT: This method doesn't exist.
                            //self.map.refresh();
                        }
                    });
                });
                on(self.map, "zoom-end", function() {
                    if($scope.graphicCount != undefined) {
                        //ALT OPTION - Set graphicCount back to zero or -1 or something
                        //to avoid contaminating update-end value.
                        $scope.graphicCount++;
                        $scope.$apply('graphicCount');
                    }
                });


                //-- LayerList DIJIT EVENTS --//
                on(self.layerListDijit, 'load', function(evt){
                    LayersService.init( $(".esriTab[data-tab-id='sublayers']").children('.esriSubList'), function() {
                        
                        LayersService.checkboxes[0].onChecked = function(idx, callback) {
                            if(LayersService.checkboxes[idx].inputEl[0].checked) {
                                self.map.addLayer(self.infrastructureFeatureLayer);
                                var legend = {
                                    title: "Infrastructure",
                                    layer: self.infrastructureFeatureLayer,
                                }

                                self.legendLayers.push(legend);
                            } else {
                                self.map.removeLayer(self.infrastructureFeatureLayer);
                                
                                LayersService.findInList(self.legendLayers, "title", "Infrastructure", function(index) {
                                    if(index > -1) {
                                        self.legendLayers.splice(index, 1);
                                    }
                                });
                            }
                        }

                        LayersService.checkboxes[1].onChecked = function(idx, callback) {
                            if(LayersService.checkboxes[idx].inputEl[0].checked) {
                                self.map.addLayer(self.maraeAndUrupaFeatureLayer);
                                var legend = {
                                    title: "Marae And Urupā",
                                    layer: self.maraeAndUrupaFeatureLayer,
                                }
                                self.legendLayers.push(legend);
                            } else {
                                self.map.removeLayer(self.maraeAndUrupaFeatureLayer);

                                LayersService.findInList(self.legendLayers, "title", "Marae And Urupā", function(index) {
                                    if(index > -1) {
                                        self.legendLayers.splice(index, 1);
                                    }
                                });
                            }
                        }
                    });

                    //Disable Context Layer toggling; 
                    $("#layerlist_checkbox_0").attr("disabled", "disabled");

                    //Create Legend Layer Array..;
                    self.legendLayers = [];
                });
                on(self.layerListDijit, 'toggle', function(evt){
                    var listChange = evt;
                    var layerIndex = listChange.layerIndex;
                    var subLayerIndex = listChange.subLayerIndex;

                    if(LayersService.checkboxes[subLayerIndex].onChecked != undefined) {
                        LayersService.checkboxes[subLayerIndex].onChecked(subLayerIndex, function(params) {
                            if(params.layer != undefined) {
                                if($scope.$parent.additionalData == params.layer) {
                                    //Reset..
                                    delete $scope.$parent.additionalData;
                                } else {
                                    $scope.$parent.additionalData = params.layer;    
                                }    
                            }
                            
                            $scope.$apply();
                        });
                    }

                    self.dynamicMapServiceLayer.setVisibleLayers( LayersService.visibleLayers() );

                    //Update Legend..
                    var contextLayer = self.map.getLayer("Context");
                    
                    LayersService.findInList(self.legendLayers, "title", "Other", function(index) {
                        if(index > -1) {
                            self.legendLayers.splice(index, 1);
                        }

                        self.legendLayers.push({layer:contextLayer, title:'Other'}); 
                    });
                    
                    self.legendDijit.refresh(self.legendLayers);
                });


                //-- Feature Layer EVENTS --//
                on(self.polygonFeatureLayer, "click", function(evt) {
                    console.log('update block details?', evt.graphic.attributes.BLOCK_ID);
                });
                on(self.polygonFeatureLayer, "update-end", function() {
                    if($scope.graphicCount == self.polygonFeatureLayer.graphics.length) {
                        //Sometimes graphicCount is already this value
                        //Probably because zoom-end is updating it
                        //So we need to make sure it gets updated
                        $scope.graphicCount++;
                    } else {
                        $scope.graphicCount = self.polygonFeatureLayer.graphics.length;    
                    }
                    
                    $scope.$apply('graphicCount');
                });


                //-- Navigation EVENTS --//
                on(self.navToolbar, "onExtentHistoryChange", function(evt) {
                    on.byId("previousView").disabled = self.navToolbar.isFirstExtent();
                    on.byId("nextView").disabled = self.navToolbar.isLastExtent();
                });
                on(dom.byId("previousView"), "click", function (evt) {
                    self.navToolbar.zoomToPrevExtent();
                });
                on(dom.byId("nextView"), "click", function (evt) {
                    self.navToolbar.zoomToNextExtent();
                });
            });
    	});
	}
]);


