/**
 * Created with JetBrains WebStorm.
 * User: zeeshanhanif
 * Date: 7/26/14
 * Time: 10:49 AM
 * To change this template use File | Settings | File Templates.
 */


angular.module('starter.controllers')
    .controller('HomeCtrl', function($scope, $location, Authentication) {

    $scope.authentication = Authentication;
    $scope.user = $scope.authentication.user;

    console.log('home');
        if (!$scope.user)
            $location.path('tab/signin');

    console.log($scope.user);

});