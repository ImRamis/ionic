angular.module('ion-affix', ['ionic']).directive('ionAffix', ['$ionicPosition', '$compile', function(n,t){function i(n,t){return angular.element(ionic.DomUtil.getParentWithClass(n[0],t))}function e(n){return ionic.Utils.throttle(n)}function o(n){return ionic.requestAnimationFrame(n)}function r(t){return n.offset(t)}function a(t){return n.position(t)}function l(n,t){n.style[ionic.CSS.TRANSFORM]==t||(n.style[ionic.CSS.TRANSFORM]=t)}function f(n,t,i){var e=0==t?"translate3d(0px, 0px, 0px)":"translate3d(0px, -"+t+"px, 0px)";i?l(n,e):o(function(){l(n,e)})}var u=500;return{restrict:"A",require:"^$ionicScroll",link:function(n,o,l,c){var s;l.affixWithinParentWithClass?(s=i(o,l.affixWithinParentWithClass),s||(s=o.parent())):s=o.parent();var m=0,p=0,x=0,v=function(n){var t=a(s),i=r(o),e=t.top,l=t.height,f=i.height;m=n+e,p=m+l,x=p-f},g=e(v,u,{trailing:!1}),h=null,d=function(){var i=o.clone().css({position:"absolute",top:0,left:0,right:0});return l.affixClass&&i.addClass(l.affixClass),i.removeAttr("ion-affix").removeAttr("data-ion-affix").removeAttr("x-ion-affix"),angular.element(c.element).append(i),t(i)(n),i},A=function(){h&&h.remove(),h=null};n.$on("$destroy",function(){A(),angular.element(c.element).off("scroll")}),angular.element(c.element).on("scroll",function(n){var t=(n.detail||n.originalEvent&&n.originalEvent.detail).scrollTop;if(0==t?v(t):g(t),t>=m&&p>=t){var i=!1;h||(h=d(),i=!0),t>x?f(h[0],Math.floor(t-x),i):f(h[0],0,i)}else A()})}}}]);

angular.module('ngListView', ['ion-affix'])

.constant('ngListViewPath', 'module/listView/themes/')

.controller('listViewController', ['$scope', 'ngListViewPath', '$timeout', '$ionicSlideBoxDelegate', function($scope, path, $timeout, $ionicSlideBoxDelegate) {
    var _this = this;

    _this.randomAnimations = ['fade-in-left-item', 'fade-in-right-item', 'fade-in-down-item', 'fade-in-item', 'zoom-in'];
    _this.swipedItemIndex = -1;
    _this.noMoreItemsAvailable = false;
    _this.animationItems = [];

    $scope.$on('$includeContentLoaded', function(){
        $timeout(function() {
            _this.animationClass = _this.randomAnimations[_this.getRandomInt(0, 5)];
            angular.element('.collapsible').collapsible({accordion : true});
        });
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

    _this.doRefresh = function () {
      if (_this.events && _this.events['doRefresh']) {
        _this.events['doRefresh']();
      } else {
        $scope.$broadcast('scroll.refreshComplete');
      }
    };

    _this.getRandomInt = function(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    };

    _this.deleteItem = function(index) {
        if (_this.data.items) {
          _this.data.items.splice(index, 1);
        } else {
          _this.data.splice(index, 1);
        }
        _this.animationItems.splice(index, 1);
        _this.swipedItemIndex = -1;
    };

    _this.undo = function() {
      if (_this.swipedItemIndex != -1) {
          $ionicSlideBoxDelegate._instances[_this.swipedItemIndex].slide(0, 1000);
      } else {
          _this.swipedItemIndex = -1;
      }
    };

    _this.setSwipeIndex = function (index, item) {
        if (_this.data.items) {
          _this.swipedItemIndex = _this.data.items.indexOf(item);
        } else {
          _this.swipedItemIndex  = _this.data.indexOf(item);
        }
        if (index == 0) {
          _this.swipedItemIndex = -1;
        } else if (index == 2) {
          _this.deleteItem(_this.swipedItemIndex);
        }
    };

    _this.slideHasChanged = function (index, item) {
        if (_this.swipedItemIndex != -1 && index != 2) {
           $ionicSlideBoxDelegate._instances[_this.swipedItemIndex].slide(0, 1000);
        }
        _this.setSwipeIndex(index, item);
    };

    _this.reorderItem = function(fromIndex, toIndex) {
        var item = _this.data.items.splice(fromIndex, 1)[0];
        _this.data.items.splice(toIndex, 0, item);
    };


    _this.onClick = function(event, item, e) {
        if (e) {
            e.stopPropagation();
        }

        if (event == 'onFavorite' && item.favorite != null) {
            item.favorite = !item.favorite;
        }

        if (_this.events && _this.events[event]) {
            _this.events[event](item);
        }
    };

    _this.loadMore = function () {
      if (_this.data.items) {
        if (_this.data.items.length > 0) {
          _this.animationItems.push(_this.data.items.pop());
        }
      } else {
        if (_this.data.length > 0) {
           _this.animationItems.push(_this.data.pop());
        }
      }
      var length = _this.data.items ? _this.data.items.length : _this.data.length;
      if(length == 0) {
        _this.noMoreItemsAvailable = true;
      }
      $scope.$broadcast('scroll.infiniteScrollComplete');
    };

    _this.contentUrl = function(directiveType, type) {
        if (_this.theme) {
            if (type === "html") {
                return  path + directiveType + '/' + _this.theme + '/index.html';
            } else if (type === "css") {
                return path + directiveType + '/' + _this.theme + "/style.css";
            }
        }
    };
}])

.directive('expandable', [function() {
    return {
        restrict: 'E',
        scope: {
            theme  : '=theme',
            data   : '=data',
            events : '=events'
        },
        bindToController : true,
        controllerAs: "listViewController",
        controller: "listViewController",
        template: '<link data-ng-href="{{listViewController.contentUrl(\'expandable\',\'css\')}}" rel="stylesheet"/><div ng-include="listViewController.contentUrl(\'expandable\',\'html\')"></div>'
    };
}])

.directive('dragAndDrop', [function() {
    return {
        restrict: 'E',
        scope: {
            theme  : '=theme',
            data   : '=data',
            events : '=events'
        },
        bindToController : true,
        controllerAs: "listViewController",
        controller: "listViewController",
        template: '<link data-ng-href="{{listViewController.contentUrl(\'dragAndDrop\',\'css\')}}" rel="stylesheet"/><div ng-include="listViewController.contentUrl(\'dragAndDrop\',\'html\')"></div>'
    };
}])

.directive('swipeToDismiss', [function() {
    return {
        restrict: 'E',
        scope: {
            theme  : '=theme',
            data   : '=data',
            events : '=events'
        },
        bindToController : true,
        controllerAs: "listViewController",
        controller: "listViewController",
        template: '<link data-ng-href="{{listViewController.contentUrl(\'swipeToDismiss\',\'css\')}}" rel="stylesheet"/><div ng-include="listViewController.contentUrl(\'swipeToDismiss\',\'html\')"></div>'
    };
}])
.directive('appearanceAnimation', [function() {
    return {
        restrict: 'E',
        scope: {
            theme  : '=theme',
            data   : '=data',
            events : '=events'
        },
        bindToController : true,
        controllerAs: "listViewController",
        controller: "listViewController",
        template: '<link data-ng-href="{{listViewController.contentUrl(\'appearanceAnimations\',\'css\')}}" ' +
        'rel="stylesheet"/><div ng-include="listViewController.contentUrl(\'appearanceAnimations\',\'html\')"></div>'
    };
}])

.directive('googleCards', [function() {
    return {
        restrict: 'E',
        scope: {
            theme  : '=theme',
            data   : '=data',
            events : '=events'
        },
        bindToController : true,
        controllerAs: "listViewController",
        controller: "listViewController",
        template: '<link data-ng-href="{{listViewController.contentUrl(\'googleCards\',\'css\')}}" rel="stylesheet"/><div ng-include="listViewController.contentUrl(\'googleCards\',\'html\')"></div>'
    };
}])

.directive('stickyListHeaders', [function() {
    return {
        restrict: 'E',
        scope: {
            theme  : '=theme',
            data   : '=data',
            events : '=events'
        },
        bindToController : true,
        controllerAs: "listViewController",
        controller: "listViewController",
        template: '<link data-ng-href="{{listViewController.contentUrl(\'stickyListHeaders\',\'css\')}}" rel="stylesheet"/><div ng-include="listViewController.contentUrl(\'stickyListHeaders\',\'html\')"></div>'
    };
}]);
