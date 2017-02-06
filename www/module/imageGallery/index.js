angular.module('ngImageGallery', [])

.constant('ngImageGalleryPath', 'module/imageGallery/themes')

.controller('imageGalleryController', ['$scope', '$location', '$state', '$timeout', 'ngImageGalleryPath', function($scope, $location, $state, $timeout, path) {
    var _this = this;
    _this.subitems = null;

    $scope.$on('$includeContentLoaded', function(){
      $timeout(function() {
          if (_this.data) {
              if (_this.data.headerImage) {
                  angular.element('.container-hearder-image')
                   .css({'background-image': 'url("'+ _this.data.headerImage + '")'});
              }
              if (_this.data.backgroundImage) {
                  angular.element('.container-background')
                   .css({'background-image': 'url("'+ _this.data.backgroundImage + '")'});
              }
              if (_this.data.containerBodyImage) {
                  angular.element('.container-background-full')
                   .css({'background-image': 'url("'+ _this.data.containerBodyImage + '")'});
              }
          }
      });
    });

    if ($state.params.id) {
        for (var i in _this.data.items) {
            if (_this.data.items[i].id == $state.params.id) {
              _this.subitems = _this.data.items[i].items;
              break;
            }
        }
    }

    _this.onClick = function(item, type, event) {
        if (event) {
            event.stopPropagation();
        }
        if (type === 'open') {
            for (var i in _this.data.items) {
                  if (_this.data.items[i].id == item.id) {
                    _this.data.subTitle = _this.data.items[i].title;
                    break;
                  }
            }
            $location.path('app/imageGallery/' + item.id);
        } else {
            if (_this.events && _this.events[type]) {
                _this.events[type](item);
            }
        }
    };
    _this.contentUrl = function(type, sub) {
        if (_this.theme) {
            var basePath = path + '/' + _this.theme + '/';

            if (type === "html") {
                return (sub === true) ? basePath + 'sub-items.html' : basePath + 'index.html';
            } else if (type === "css") {
                return basePath + 'style.css';
            }
        }
    };
}])

.directive('imageGallery', [function() {
    return {
        restrict: 'E',
        scope: {
            theme : '=theme',
            data  : '=data',
            events: '=events'
        },
        bindToController : true,
        controllerAs: "imageGalleryController",
        controller: "imageGalleryController",
        template: '<link data-ng-href="{{imageGalleryController.contentUrl(\'css\')}}" rel="stylesheet"/><div ng-include="imageGalleryController.contentUrl(\'html\')"></div>'
      };
}])

.directive('subImageGallery', [function() {
    return {
        restrict: 'E',
        scope: {
            theme : '=theme',
            data  : '=data'
        },
        bindToController : true,
        controllerAs: "imageGalleryController",
        controller: "imageGalleryController",
        template: '<link data-ng-href="{{imageGalleryController.contentUrl(\'css\')}}" rel="stylesheet"/><div ng-include="imageGalleryController.contentUrl(\'html\', true)"></div>'
      };
}]);
