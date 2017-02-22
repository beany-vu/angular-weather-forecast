var app = angular.module("weatherForecast", []);


jQuery(document).ready(function() {
    jQuery('#tab-popup a').click(function (e) {
        e.preventDefault()
        jQuery(this).tab('show')
    })
});