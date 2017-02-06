angular.module('ngParallax', [])

.constant('ngParallaxPath', 'module/parallax/themes/')

.directive('parallax', ['ngParallaxPath', function(path) {
    return {
        restrict: 'E',
        scope: {
            theme  : '=theme',
            data   : '=data',
            events : '=events'
        },
        bindToController : true,
        controllerAs: 'parallaxController',
        controller: ['$scope', '$timeout', function($scope, $timeout) {
            var _this = this;
            $scope.$on('$includeContentLoaded', function(){
              angular.element('.parallax').parallax();
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

            _this.onClick = function(event, item, e) {
                if (e) {
                    e.stopPropagation();
                }

                if (_this.events && _this.events[event]) {
                  if (event == 'onRates') {
                    _this.events[event](_this.data.iconsStar, item);
                  } else {
                    _this.events[event](item);
                  }
                }
            };

            _this.setSlider = function(isActive) {
                var header = angular.element('#elastic-header');
                var image = angular.element('.box');

                if (isActive) {
                    if (!header.hasClass('active-slider')) {
                      header.height(header.parent().height() * 0.79);
                      header.addClass('active-slider');
                    }
                } else {
                    if (header.hasClass('active-slider')) {
                      header.height(270);
                      header.removeClass('active-slider');
                    }
                }
            };

            _this.toggleExpand = function() {
                var header = angular.element('#elastic-header');
                _this.setSlider(!header.hasClass('active-slider'));
            };

            _this.starClass = function(star) {
               return star.isActive? star.iconActive : star.iconInactive;
            };

            _this.contentUrl = function(type) {
                if (_this.theme) {
                    if (type === 'html') {
                        return path + _this.theme + '/index.html';
                    } else if (type === "css") {
                        return path + _this.theme + '/style.css';
                    }
                }
            };
        }],
       template: '<link data-ng-href="{{parallaxController.contentUrl(\'css\')}}" rel="stylesheet"/><div ng-include="parallaxController.contentUrl(\'html\')"></div>'
    };
}])

  .directive('elasticHeader', function($ionicScrollDelegate) {
    return {
      restrict: 'A',
      link: function(scope, scroller, attr) {
        var scrollerHandle = $ionicScrollDelegate.$getByHandle(attr.delegateHandle);
        var header = document.getElementById(attr['elasticHeader']);
        var headerHeight = header.clientHeight;
        var translateAmt, scaleAmt, scrollTop;
        var ticking = false;

        // Set transform origin to top:
        header.style[ionic.CSS.TRANSFORM + 'Origin'] = 'center bottom';

        // Update header height on resize:
        window.addEventListener('resize', function() {
          headerHeight = header.clientHeight;
        }, false);

        scroller[0].addEventListener('scroll', requestTick);

        function requestTick() {
          if (!ticking) {
            ionic.requestAnimationFrame(updateElasticHeader);
          }
          ticking = true;
        }

        function updateElasticHeader() {

          scrollTop = scrollerHandle.getScrollPosition().top;

          if (scrollTop >= 0) {
            // Scrolling up. Header should shrink:
            translateAmt = scrollTop / 2;
            scaleAmt = 1;
          } else {
            // Scrolling down. Header should expand:
            translateAmt = 0;
            scaleAmt = -scrollTop / headerHeight + 1;
          }

          // Update header with new position/size:
          header.style[ionic.CSS.TRANSFORM] = 'translate3d(0,'+translateAmt+'px,0) scale('+scaleAmt+','+scaleAmt+')';

          ticking = false;
        }
      }
    }
  });
