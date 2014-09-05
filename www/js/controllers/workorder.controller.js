
angular.module('starter.controllers').controller('WorkOrderCtrl', function($scope, $http,
       $cordovaGeolocation, $cordovaCamera, $stateParams,  $location, $cordovaFile, $upload, Workorders, Authentication, $ionicActionSheet, $q) {

    $scope.authentication = Authentication;
    $scope.user = $scope.authentication.user;

    $scope.workorders = [];
    $scope.current = {};
    $scope.workorder = {};
    $scope.latitude = '';
    $scope.longitude = '';
    $scope.lastTime = '';
    $scope.lastStatus = '';
    $scope.notes = [];

    console.log('work order');
    if (!$scope.user)
        $location.path('tab/signin');

    $scope.find = function() {
        Workorders.getByContact($scope.user._id,function(data) {
            console.log('getting work orders'+$scope.user._id)
            $scope.workorders = data;
        });
    };

    $scope.showOptions = function() {
        // Show the action sheet
        console.log('yo');
        var hideSheet = $ionicActionSheet.show({
            buttons: [
                { text: 'Travel Time', code:'travel' },
                { text: 'Working', code:'working' },
                { text: 'Getting Parts', code:'parts' },
                { text: 'Pause Working', code:'paused' },
                { text: 'Work Order Finished', code:'completed' }
            ],
            titleText: 'Update your status',
            cancelText: 'Cancel',
            cancel: function() {
                // add cancel code..
            },
            buttonClicked: function(index, buttons) {
                $scope.workorderLog(buttons.code);
                return true;
            }
        });
    };

    $cordovaGeolocation.getCurrentPosition().then(function(position) {
            // Position here: position.coords.latitude, position.coords.longitude
            $scope.latitude = position.coords.latitude;
            $scope.longitude = position.coords.longitude;

        }, function(err) {
            // error
        }
    );


    $scope.findOne = function() {
        Workorders.get($stateParams.workorderId, function(data) {
            $scope.workorder = data;
        });

    };

    $scope.findCurrent = function() {
      // if we know the current work order, great, if not find it
      // find it by getting the work order in the latest feed for this vendor user
      if ($scope.workorder)
        $scope.current = $scope.workorder;

    };

    $scope.workorderLog = function(entryType) {

        console.log(Authentication);
        var workorderLog = {
            vendorUser:Authentication.user._id,
            type:entryType,
            latitude: $scope.latitude,
            longitude: $scope.longitude,
            gpsLocation:$scope.latitude + ',' + $scope.longitude,
            start:new Date()
        };
        //console.log($scope.workorder);
        console.log(workorderLog);

        $scope.lastStatus = entryType;
        $scope.lastTime = new Date();

        $http.put('http://'+server+':'+port+'/workorders/log/'+Authentication.user.company+'/'+$scope.workorder._id, workorderLog).success(function(response) {
            // redirect to the "I completed a work order, aren't you proud page"
            if (entryType == 'completed')
                $location.path('tab/workorder/complete/'+$scope.workorder._id);

        });
    };

     $scope.completeWorkorder = function() {
        // save the notes
         console.log('submitted');
         console.log($scope.notes.note);
         $scope.workorder.notes.push({note: $scope.notes.note, date: new Date()});
         console.log($scope.workorder);
         $http.put('http://'+server+':'+port+'/workorders/'+$scope.workorder._id, $scope.workorder).success(function(response) {
             console.log('workorder notes added!');
             $scope.notes.submitted = true;
         });

     };


    $scope.takePicture = function() {
        var picoptions = {
            quality : 75,
            destinationType : Camera.DestinationType.FILE_URI,
            sourceType : Camera.PictureSourceType.CAMERA,
            allowEdit : true,
            encodingType: Camera.EncodingType.JPEG,
            //targetWidth: 100,
            //targetHeight: 100,
            popoverOptions: CameraPopoverOptions,
            saveToPhotoAlbum: true
        };

		
       $http.get('http://'+server+':'+port+'/aws/policy/'+Authentication.user.company).success(function(response) {
            // yay we posted a time clock entry
            var aws = response;
            var policy = aws.s3Policy;
            var signature = aws.s3Signature;
            var key = aws.AWSAccessKeyId;
            var s3URI = encodeURI("https://s3.amazonaws.com/PMToolbelt"),
               policyBase64 = policy;//"eyJleHBpcmF0aW9uIjoiMjAxNC04LTI5VDI2OjAwOjAwLjAwMFoiLCJjb25kaXRpb25zIjpbWyJzdGFydHMtd2l0aCIsIiRrZXkiLCJQTVRvb2xiZWx0LyJdLHsiYnVja2V0IjoiUE1Ub29sYmVsdCJ9LHsiYWNsIjoicHVibGljLXJlYWQifSxbInN0YXJ0cy13aXRoIiwiJENvbnRlbnQtVHlwZSIsIiJdLHsic3VjY2Vzc19hY3Rpb25fc3RhdHVzIjoiMjAxIn1dfQ==",
               signature = signature; //"BfyPzyhTmzAL7lHjjgHM2yaISnI=",
               awsKey = key; // 'AKIAJB5QLSKN3HNYTCEA',
               acl = "public-read";
           $cordovaCamera.getPicture(picoptions).then(function(imageData) {
               // Success! Image data is here
               console.log('got a pic');
               console.log(imageData);
               upload(imageData, $scope.workorder._id+$scope.workorder.photos.length+1+'img'+Math.round(Math.random() * 10000) + '$$'+'.jpg');
           }, function(err) {
               // An error occured. Show a message to the user
				  });
			
           function upload(imageURI, fileName) {
		
               console.log('lets upload!');
               var deferred = $q.defer(),
                   ft = new FileTransfer(),
                   options = new FileUploadOptions();
                   options.fileKey = "file";
                   options.fileName = fileName;
                   options.mimeType = "http://";
                   options.chunkedMode = false;
                   options.params = {
                       "key": 'PMToolbelt/'+fileName,
                       "acl": acl,
                       "Content-Type": "image/jpeg",
                       "AWSAccessKeyId": awsKey,
                       "success_action_status": "201",
                       "Policy": policyBase64,
                       "Signature": signature
               };
               ft.upload(imageURI, s3URI,
                   function (e) {
                       console.log('first e:');
                       console.log(e.response);
                       var data = xml2json.parser(e.response),
                            parsedData;
                        parsedData = {
                            location: data.postresponse.location,
                            bucket: data.postresponse.bucket,
                            key: data.postresponse.key,
                            etag: data.postresponse.etag
                        };
                       //console.log('the location is: '+data);
                       console.log(parsedData.location);
                       $scope.workorder.photos.push({name: fileName, url: parsedData.location});
                       console.log($scope.workorder);
                       $http.put('http://'+server+':'+port+'/workorders/'+$scope.workorder._id, $scope.workorder).success(function(response) {
                           console.log('workorder updated!');

                });
            
                       deferred.resolve(e);
                    },
                    function (e) {
                       deferred.reject(e);
                    }, options);

               return deferred.promise();

         
           }
           return {
               upload: upload
           };
        });
    }

});

