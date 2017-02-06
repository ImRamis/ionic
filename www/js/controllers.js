angular.module('controllers', [])
    .controller('SplashScreenCtrl', ['$scope', '$state', '$window', function($scope, $state, $window) {
        $scope.url = 'skill';
        if ($window.localStorage['region'] == undefined || $window.localStorage['subregion'] == undefined)
            $scope.url = 'search';

        $scope.params = {
            'data': {
                'duration': 3000,
                'backgroundImage': 'img/31.jpg',
                'logo': 'img/login-universal-light.png',
                'title': 'WorkFellas',
                'url': $scope.url
            },
            'theme': "layuot3"
        }
    }])
    
    .controller('tourCtrl', ['$scope', '$location', function($scope, $location) {
        $scope.params = {
            'data': {
                'containerBodyImage': 'img/back.jpg',
                'btnPrev': 'Previous',
                'btnNext': 'Next',
                'btnFinish': 'Finish',
                'items': [{
                        logo: '',
                        iconSlider: 'icon-star-outline',
                        title: 'Welcome to the World Tour',
                        buttonNext: 'Next',
                        description:'i got this feeling of noo no no '
                    },
                    {
                        logo: '',
                        iconSlider: 'icon-star-half',
                        title: 'Important',
                        buttonNext: 'Next',
                        buttonPrevious: 'Previous',
                        description:'i got this feeling of noo no no '
                    },
                    {
                        logo: '',
                        iconSlider: '',
                        title: 'Nothing',
                        buttonPrevious: 'Previous',
                        buttonFinish: 'Finish',
                        description:'i got this feeling of noo no no '
                    }
                ]
            },
            'events': {
                onFinish: function() {
                    $location.path("/leftMenu");
                }
            },
            'theme': "layout1"
        }
    }])
    .controller('searchCtrl', ['$scope', '$state', 'apiService', '$window','$ionicLoading', function($scope, $state, apiService, $window,$ionicLoading) {
        $scope.invalid = 'Please Select';
        $scope.saveLocation = function(search) {
            $window.localStorage['region'] = search.region;
            $window.localStorage['subregion'] = search.subregion;
            $state.go('skill');
        };
        var g = function(){
        $ionicLoading.show({ template: 'Loading' });
        apiService.getData('region').then(function success(response) { $scope.region = response.data; })
        apiService.getData('region_areas').then(function success(response) { $scope.subregion = response.data; $ionicLoading.hide(); })
    };
    g();
    }])
    .controller('skillCtrl', ['$scope', '$state', 'apiService','$ionicLoading', function($scope, $state, apiService,$ionicLoading) {
        $scope.fetchSkills = function() {
            $ionicLoading.show({ template: 'Loading' });
            apiService.getData('occupation').then(function success(response) {
                $ionicLoading.hide();
                $scope.category = [];

                $scope.category = response.data;
            })
        };
        $scope.selectCategory = function(item) {
            $state.go('list', { occupation: item.ID });
        };
    }])
    .controller('listCtrl', ['$scope', '$stateParams', 'apiService', '$window', '$ionicLoading', '$ionicPopup', '$state', '$filter', function($scope, $stateParams, apiService, $window, $ionicLoading, $ionicPopup, $state, $filter) {
        $scope.occ = $stateParams.occupation;
        $scope.init = function() {
            $scope.handy = 0;
            $ionicLoading.show({ template: 'Fetching...' });
            apiService.getData('handyView/AREAID/' + 120).then(function success(response) {
                if (response.data.error == undefined) {
                    response.data = $filter('filter')(response.data, { 'OCCUPATIONID': $scope.occ });
                    response.data = $filter('unique')(response.data, "HANDYMANID");
                    $ionicLoading.hide();
                    $scope.$broadcast('scroll.refreshComplete');
                    if (response.data.length > 0) {
                        $scope.handy = response.data;
                    } else
                        tryAgain();
                } else {
                    tryAgain();
                }
            });
        }
        $scope.profile = function(Id) {
            $state.go('profile', { id: Id });
        }
        tryAgain = function() {
            $ionicLoading.hide();
            $ionicPopup.alert({
                title: 'Try again later!',
                template: 'The selected Category has no worker on your area or try again later!',
            });
            $state.go('skill');
        }
        $scope.init();
    }]).controller('profileCtrl', function($scope, apiService, $ionicLoading, $stateParams, $filter) {
        $scope.init = function() {
            $ionicLoading.show({ template: 'Loading Handyman' });
            apiService.getData('handyView/HANDYMANID/' + $stateParams.id).then(function success(response) {
                $ionicLoading.hide();
                $scope.handyman = response.data;
            });
        };
    });