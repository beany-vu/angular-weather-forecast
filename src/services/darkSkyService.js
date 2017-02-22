app.factory('darkSkySvr', function ($http) {
    var promise = null;
    return function (lat, lng) {
        promise = $http({
            cache: false,
            method: 'GET',
            url: 'http://api.thoitiethanoi.dev2.sutunam.com/forecast/' + lat + ',' + lng,
        })
        return promise;
    }
})