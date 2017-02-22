app.directive("todayInfoDirective", function ($compile) {
    return {
        templateUrl: './src/views/infoBox.html',
        link: function($scope, element, attrs) {
            $scope.city = $scope.$eval(attrs.city);
        },

    }
});