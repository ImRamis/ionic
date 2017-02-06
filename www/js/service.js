angular.module('services', [])
    .service('apiService', function ($http) {
        var url = 'http://elistt.com/admin/includes/index/';
        return {
            getData: function (table) {
                return $http({
                    method: 'GET',
                    url: url + table,
                    headers: {
                        'Content-Type': 'application/json;'
                    }
                })
            }
        }
    })