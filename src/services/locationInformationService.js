/**
 * This service query information from the google geocode API and return the data about a location
 * The typical returned object like this {name:'city name', lat: 'latitude value', lng: 'longitude'}
 */
app.service('locationInformation', function () {
    this.getCityLocation = function (query) {
        $scope.search = $http.get('https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyB188arA6DgkuIaDG1tszq9XufFmjrcxR8&address=' + query)
            .then(
                function (response) {
                    $rootScope.city = response.data.results[0];
                },
                function (response) {
                    $rootScope.city = '';
                    alert(response.error_message);
                })
    }
})