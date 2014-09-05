angular.module('starter.services', [])

/**
 * A simple example service that returns some data.
 */
.factory('Workorders', function($http) {
        var workorders = [];



       /* $http.get('http://107.170.103.224\:3000/workorders/list/53c81302267b651d15546e8f').
            success(function(data) {
                workorders = data;
        });*/

        function getById(arr, id) {
            for (var d = 0, len = arr.length; d < len; d += 1) {
                if (arr[d]._id === id) {
                    return arr[d];
                }
            }
        }

        return {
            getByContact:function(contactId, callback){
                $http.get('http://'+server+':'+port+'/workorders/contacts/'+contactId).success(callback);
            },
            all: function(callback) {
                 $http.get('http://'+server+':'+port+'/workorders/list/53c81302267b651d15546e8f').success(callback);
                //return workorders;
            },
            get: function(workorderId, callback) {
              // Simple index lookup
               // console.log(workorders);
              //  console.log(workorders[workorderId]);
               // return getById(workorders, workorderId);
                $http.get('http://'+server+':'+port+'/workorders/'+workorderId).success(callback);
        }
  }
}).factory('Authentication', [

        function() {
            var _this = this;

            _this._data = {
                user: window.user
            };

            return _this._data;
        }
    ]).factory('xmlParser', function () {
        var x2js = new X2JS();
        return {
            xml2json: function (args) {
                return angular.bind(x2js, x2js.xml2json, args)();
            },
            xml_str2json: function (args) {
                return angular.bind(x2js, x2js.xml_str2json, args)();
            },
            json2xml_str: function (args) {
                return angular.bind(x2js, x2js.json2xml_str, args)();
            }
        }
    });

