/**
 * Created with JetBrains WebStorm.
 * User: zeeshanhanif
 * Date: 7/26/14
 * Time: 10:49 AM
 * To change this template use File | Settings | File Templates.
 */

angular.module('starter.controllers')
    .controller('TimeCtrl', function($scope, $location, $cordovaGeolocation, Authentication, $http) {

        console.log('time');
        $scope.authentication = Authentication;
        $scope.user = $scope.authentication.user;

        if (!$scope.user)
            $location.path('tab/signin');
    $scope.timeClock = function(entryType) {

        $cordovaGeolocation.getCurrentPosition().then(function(position) {

            // Position here: position.coords.latitude, position.coords.longitude
            $scope.latitude = position.coords.latitude;
            $scope.longitude = position.coords.longitude;

            var clockEntry = {
                contact:Authentication.user._id,
                timeClockStatus:entryType,
                timeStamp:new Date(),
                gpsLocation:{
                    latitude:$scope.latitude,
                    longitude:$scope.longitude
                }
            };

            console.log(clockEntry);
            $http.post('http://'+server+':'+port+'/contacts/timeclock/'+Authentication.user._id, clockEntry).success(function(response) {
                // yay we posted a time clock entry

            });

        }, function(err) {
            // error
        });


    };


});