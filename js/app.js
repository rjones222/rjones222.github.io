angular.module('website', ['ngAnimate', 'ngRoute'])
    .controller('MainCtrl', function ($scope) {
//        defining a pages object
        $scope.pagesLOCK = {
            //'home': { label: 'Rick W. Jones | Front End / UI Developer', sublabel: 'Home', content: 'This is page content.' },
            'about': { label: 'Rick W. Jones | Front End / UI Developer', sublabel: 'About', content: 'This is page content.' },
            'contact': {
                label: 'Rick W. Jones | Front End / UI Developer',
                sublabel: 'Contact',
                content: '<a href="mailto:rick@rickwjones.com">rick@rickwjones.com</a><br>(424) 212-1201'
            },
            'portfolio': {
                label: 'Rick W. Jones | Front End / UI Developer',
                sublabel: 'Portfolio',
                content: ''
            }
        };

        /*$scope.templates =
            [ { name: 'portfolio.html', url: 'views/portfolio.html'},
                { name: 'template2.html', url: 'template2.html'} ];
        $scope.template = $scope.templates[0];*/

//        keeping track of the current page, set initiallly to home
        $scope.currentPage = 'about';

//        setting a page property on $scope to hold the actual content of the page we are on
        $scope.page = $scope.pages['about'];

//        toggle content panel visibility binding to be visible initially
        $scope.isInTransit = false;

//        set current page
        $scope.setCurrentPage = function (page) {
            if ($scope.currentPage !== page) {
                $scope.page = $scope.pages[page];
                $scope.currentPage = page;
//                setting isInTransit to true when a new page is set which will cause the content panel to hide itself.
                $scope.isInTransit = true;
            }
        };

//        setting isInTransit to false when the bgTransitionComplete event is triggered
        $scope.$on('bgTransitionComplete', function(){
            $scope.isInTransit = false;
        });

//        defining a convenience function that returns true or false based on the value of the page parameter and the page we're currently on.
        $scope.isCurrentPage = function (page) {
            return $scope.currentPage === page;
        };
    })
//        make the images correctly size to the full width and height of the screen.
    .directive('bg', function ($window) {
        // Adapted from http://bavotasan.com/2011/full-sizebackground-image-jquery-plugin/ Thanks @bavotasan!
        var linker = function (scope, element, attrs) {
            var resizeBG = function () {
                var bgwidth = element.width();
                var bgheight = element.height();

                var winwidth = $window.innerWidth;
                var winheight = $window.innerHeight;

                var widthratio = winwidth / bgwidth;
                var heightratio = winheight / bgheight;

                var widthdiff = heightratio * bgwidth;
                var heightdiff = widthratio * bgheight;

                if (heightdiff > winheight) {
                    element.css({
                        width: winwidth + 'px',
                        height: heightdiff + 'px'
                    });
                } else {
                    element.css({
                        width: widthdiff + 'px',
                        height: winheight + 'px'
                    });
                }
            }

            resizeBG();

            var windowElement = angular.element($window);
            windowElement.resize(resizeBG);
        }

        return {
            restrict: 'A',
            link: linker
        };
    })
    .animation('.bg-animation', function ($window, $rootScope) {
        return {
            enter: function (element, done) {
                TweenMax.fromTo(element, 0.5, {left: $window.innerWidth}, {left: 0, onComplete: function () {
                    $rootScope.$apply(function(){
                        $rootScope.$broadcast('bgTransitionComplete');
                    });
                    done();
                }});
            },
            leave: function (element, done) {
                TweenMax.to(element, 0.5, {left: -$window.innerWidth, onComplete: done});
            }
        }
    })
    .animation('.panel-animation', function () {
        return {
            addClass: function (element, className, done) {
                if (className == 'ng-hide') {
                    TweenMax.to(element, 0.2, { opacity: 0, onComplete: done });
                }
                else {
                    done();
                }
            },
            removeClass: function (element, className, done) {
                if (className == 'ng-hide') {
                    element.removeClass('ng-hide');
                    TweenMax.fromTo(element, 0.5, { opacity: 0, left: -element.width() }, { opacity: 0.8, left: 0, onComplete: done });
                }
                else {
                    done();
                }
            }
        };
    })
    .filter('unsafe', function($sce) {
        return function(val) {
            return $sce.trustAsHtml(val);
        };
    });
