app.factory('geoCodeSrv', function ($http) {
    var promise = null;
    return function (query) {
        promise = $http({
            cache: false,
            method: 'GET',
            url: 'https://maps.googleapis.com/maps/api/geocode/json?address=' + query,
        })
        return promise;
    }
})
