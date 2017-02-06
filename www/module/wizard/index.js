angular.module('ngWizard', [])

.constant('ngWizardPath', 'module/wizard/themes')

.controller('wizardController', ['$scope', '$timeout', '$ionicSlideBoxDelegate', 'ngWizardPath', function($scope, $timeout, $ionicSlideBoxDelegate, path) {
  var _this = this;
  _this.swipedItemIndex = 0;

  $scope.$on('$includeContentLoaded', function(){
    _this.addImageOnComponent(_this.data);
  });

  _this.addImageOnComponent = function(data) {
      $timeout(function() {
          if (data) {
              if (data.headerImage) {
                  angular.element('.container-hearder-image')
                   .css({'background-image': 'url("'+ data.headerImage + '")'});
              }
              if (data.backgroundImage) {
                  angular.element('.container-background')
                   .css({'background-image': 'url("'+ data.backgroundImage + '")'});
              }
              if (data.containerBodyImage) {
                  angular.element('.container-background-full')
                   .css({'background-image': 'url("'+ data.containerBodyImage + '")'});
              }
          }
      });
  };

  _this.contentUrl = function(type) {
      if (_this.theme) {
          if (type === "html") {
              return path + "/" + _this.theme + '/index.html';
          } else if (type === "css") {
              return path + "/" + _this.theme + "/style.css";
          }
      }
  };

  _this.changeSlide = function(direction) {
    if (_this.data.items.length > (_this.swipedItemIndex + direction)
      && (_this.swipedItemIndex + direction) >= 0) {
      $ionicSlideBoxDelegate._instances[0]
        .slide(_this.swipedItemIndex + direction, 0);
    }
  };

  _this.show = function(type) {
      var result = false;
      if (type == 'prev' && _this.swipedItemIndex > 0) {
          result = true;
      } else if (type == 'next' &&
        (_this.swipedItemIndex + 1) != _this.data.items.length) {
          result = true;
      } else if (type == 'finish' &&
        (_this.swipedItemIndex + 1) == _this.data.items.length) {
          result = true;
      }
      return result;
  };

  _this.onClick = function(event, e) {
      if (e) {
          e.stopPropagation();
      }

      if (_this.events && _this.events[event]) {
          _this.events[event]();
      }
  };

  _this.slideHasChanged = function (index) {
    _this.swipedItemIndex = index;
  };
}])

.directive('wizard', [function(){
    return {
        restrict: 'E',
        scope: {
            theme  : '=theme',
            data   : '=data',
            events : '=events'
        },
        bindToController : true,
        controllerAs: "wizardController",
        controller: "wizardController",
        template: '<link data-ng-href="{{wizardController.contentUrl(\'css\')}}" rel="stylesheet"/><div ng-include="wizardController.contentUrl(\'html\')"></div>'
    };
}]);
