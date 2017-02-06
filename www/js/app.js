angular.module('ion-affix', ['ionic']).directive('ionAffix', ['$ionicPosition', '$compile', function(n,t){function i(n,t){return angular.element(ionic.DomUtil.getParentWithClass(n[0],t))}function e(n){return ionic.Utils.throttle(n)}function o(n){return ionic.requestAnimationFrame(n)}function r(t){return n.offset(t)}function a(t){return n.position(t)}function l(n,t){n.style[ionic.CSS.TRANSFORM]==t||(n.style[ionic.CSS.TRANSFORM]=t)}function f(n,t,i){var e=0==t?"translate3d(0px, 0px, 0px)":"translate3d(0px, -"+t+"px, 0px)";i?l(n,e):o(function(){l(n,e)})}var u=500;return{restrict:"A",require:"^$ionicScroll",link:function(n,o,l,c){var s;l.affixWithinParentWithClass?(s=i(o,l.affixWithinParentWithClass),s||(s=o.parent())):s=o.parent();var m=0,p=0,x=0,v=function(n){var t=a(s),i=r(o),e=t.top,l=t.height,f=i.height;m=n+e,p=m+l,x=p-f},g=e(v,u,{trailing:!1}),h=null,d=function(){var i=o.clone().css({position:"absolute",top:0,left:0,right:0});return l.affixClass&&i.addClass(l.affixClass),i.removeAttr("ion-affix").removeAttr("data-ion-affix").removeAttr("x-ion-affix"),angular.element(c.element).append(i),t(i)(n),i},A=function(){h&&h.remove(),h=null};n.$on("$destroy",function(){A(),angular.element(c.element).off("scroll")}),angular.element(c.element).on("scroll",function(n){var t=(n.detail||n.originalEvent&&n.originalEvent.detail).scrollTop;if(0==t?v(t):g(t),t>=m&&p>=t){var i=!1;h||(h=d(),i=!0),t>x?f(h[0],Math.floor(t-x),i):f(h[0],0,i)}else A()})}}}]);

angular.module('starter', ['ionic','ion-affix', 'ngSplashScreen','ngParallax', 'controllers','ngImageGallery','ui.router', 'ngWizard', 'services', 'angular.filter'])
    .run(function($ionicPlatform) {
        $ionicPlatform.ready(function() {
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                cordova.plugins.Keyboard.disableScroll(true);
            }
            if (window.StatusBar) {
                StatusBar.styleDefault();
            }
        });
    })
    .config(function($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('app', {
                url: '/app',
                templateUrl: 'templates/splashscreen.html',
                controller: 'SplashScreenCtrl'
            })
            .state('tour', {
                url: '/tour',
                templateUrl: 'templates/tour.html',
                controller: 'tourCtrl'
            })
            .state('search', {
                url: '/search',
                templateUrl: 'templates/search.html',
                controller: 'searchCtrl'
            })
            .state('skill', {
                url: '/skill',
                templateUrl: 'templates/skill.html',
                controller: 'skillCtrl'
            })
            .state('list', {
                url: '/list/:occupation',
                templateUrl: 'templates/list.html',
                controller: 'listCtrl'
            })
            .state('profile', {
                url: '/profile/:id',
                templateUrl: 'templates/profile.html',
                controller: 'profileCtrl'
            });
        $urlRouterProvider.otherwise('/app');
    })
    .filter('tel', function() {
        return function(tel) {
            return tel.replace(/\D+/, '');;
        };
    });