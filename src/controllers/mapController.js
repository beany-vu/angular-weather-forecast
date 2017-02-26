app.controller('mapCtrl',['$scope', '$http', 'darkSkySvr', 'geoCodeSrv',  '$compile',
    function ($scope, $http, darkSkySvr, geoCodeSrv, $compile) {
        $scope.config = {
            id: 'map',
            lat: 20.8467333,
            lng: 106.6637273,
            zoom: 4
        },
            $scope.cities = [],
            $scope.mapObj = '',
            $scope.markers = [],
            $scope.myError = {},
            $scope.myError.citiesSearch = '',
            /**
             * Map initialization
             * The default configuration is set inside $scope.config
             * Some attributes are required to create a map:
             *  - id: identification of a tag that map will display inside
             *  - lat & lng: latitude and longitude of the start location (we need a location for map)
             *  - zoom: the scale of the map
             */
            $scope.init = function () {
                // the map need a location so that it can initialize
                $scope.mapObj = new google.maps.Map(document.getElementById($scope.config.id), {
                    center: {lat: $scope.config.lat, lng: $scope.config.lng},
                    zoom: $scope.config.zoom
                });
            },
            /**
             * Return the list of cities that match the search keywords
             */
            $scope.search = function () {
                $scope.cities = [];
                if (typeof $scope.query !== "undefined") {
                    if($scope.query !== '') {
                        ga('send', 'event', 'Weather Forecast', 'search', 'Location', $scope.query);
                        $scope.getCodeLoading = true;
                        geoCodeSrv($scope.query).then(
                            function (response) {
                                if (response.data.results.length > 0) {
                                    $scope.cities = response.data.results;
                                    $scope.myError.citiesSearch = "";
                                }
                                else {
                                    // if the search query successes and there's no match
                                    $scope.myError.citiesSearch = "There's no result that matches the keyword!"
                                }
                                $scope.getCodeLoading = false;

                            },
                            function (response) {
                                // if the query cannot reach (because of 500, 501, 404...)
                                $scope.myError.citiesSearch = "There's a connection problem!"
                                $scope.getCodeLoading = false;
                            }
                        )
                    }
                    else {
                        $scope.myError.citiesSearch = "The keyword cannot be empty!"
                        $scope.getCodeLoading = false;
                    }
                }
                else {
                    $scope.myError.citiesSearch = "The keyword cannot be empty!"
                    $scope.getCodeLoading = false;
                }
            },
            $scope.reset = function () {
                $scope.cities = [];
                $scope.removeMarkers();
                $scope.removeInfoBoxes();
                $scope.query = '';
            },
            $scope.updateMap = function (index,lat, lng) {
                ga('send', 'event', 'Weather Forecast', 'view_result', 'Location', $scope.cities[index].formatted_address);
                var loc, marker;
                if (arguments.length == 0) {
                    // create a location
                    // add a location into the map
                    loc = {lat: $scope.config.lat, lng: $scope.config.lng};
                }
                else {
                    loc = {lat: lat, lng: lng}
                }
                marker = new google.maps.Marker({
                    position: loc,
                    map: $scope.mapObj
                })
                $scope.darkSkyInforLoading = true;
                darkSkySvr(lat, lng).then(
                    function(response) {
                    $scope.cities[index].darkSkyInfor = response.data;
                    $scope.darkSkyInforLoading = false;
                },
                    function (response) {
                        darkSkyInforError = true;
                    }
                );
                $scope.removeInfoBoxes();
                $scope.removeMarkers();
                $scope.markers.push(marker);
                $scope.markers.map(function(marker, i) {
                    google.maps.event.addListener(marker, 'click', function() {
                        $scope.getInfoBox(index).open($scope.mapObj, this);
                    })
                })
                $scope.mapObj.setCenter(loc);
            },
            $scope.removeMarkers = function () {
                $scope.markers.forEach(function (marker) {
                    marker.setMap(null);
                });
            },
            $scope.getInfoBox = function(index) {
                if(typeof  InfoBox !== 'undefined') {
                    return new InfoBox({
                        content: $scope.getInfoBoxContent(index),
                        disableAutoPan: true,
                        maxWidth: 0,
                        pixelOffset: new google.maps.Size(40, -190),
                        closeBoxMargin: '5px -20px 2px 2px',
                        closeBoxURL: "http://www.google.com/intl/en_us/mapfiles/close.gif",
                        isHidden: false,
                        pane: 'floatPane',
                        enableEventPropagation: true
                    });

                }
            },
            $scope.getInfoBoxContent = function (index) {
                var content = '<div today-info-directive city="cities[' + index+ ']"></div>';
                var compiled = $compile(content)($scope);
                return compiled[0];
            },
            $scope.removeInfoBoxes = function() {
                jQuery('div.infoBox').remove();
            },
            $scope.removeMarkers = function() {
                var length = $scope.markers.length,
                    i = 0;
                if( typeof length !== undefined) {
                    for(i = 0; i < length; i++) {
                        (function(j) {
                            $scope.markers[j].setMap(null);
                        })(i)
                    }
                }
            }
    }])