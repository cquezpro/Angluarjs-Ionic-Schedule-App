/**
 * Created with JetBrains WebStorm.
 * User: zeeshanhanif
 * Date: 7/26/14
 * Time: 10:51 AM
 * To change this template use File | Settings | File Templates.
 */

angular.module('starter.controllers')
    .controller('AuthenticationCtrl', function($scope, Authentication, $http, $location, $state, $ionicTabsDelegate){

    $scope.authentication = Authentication;
    $scope.credentials = {};

        console.log('user');

   // $scope.credentials.username = "foo@foo.com";
    //$scope.credentials.password = "foo";

    $scope.signin = function() {

        //http://localhost:3000
        console.log($scope.credentials);
        $http.post('http://'+server+':'+port+'/auth/contact/signin', $scope.credentials).success(function(response) {
            //If successful we assign the response to the global user model
            $scope.authentication.user = response;

            //And redirect to the index page
           // $state.transitionTo("tab.workorder");
           // $ionicTabsDelegate.select(3, true);
            $location.path('tab/workorder');
        }).error(function(response) {
                //console.log(error);
                $scope.error = response.message;
            });

    };

});