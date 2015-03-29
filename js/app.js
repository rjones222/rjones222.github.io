// hide the site until password protected
// document.getElementById('main').innerHTML = "";

angular.module('website', ['ngAnimate', 'ngRoute'])
    .controller('MainCtrl', function ($scope) {
//        defining a pages object
        $scope.pages = {
            //'home': { label: 'Rick W. Jones', sublabel: 'Home', content: 'This is page content.' },
            'about': {
                label: 'Rick W. Jones',
                sublabel: 'About',
                content: 'I’m a front end / UI developer and software engineer with more than a decade of experience crafting high volume pixel-perfect advertising and marketing sites, elegant and user friendly responsive user interfaces and rapid prototype sites. My skill set includes expert level CSS and HTML, along with Adobe CC, Javascript, jQuery, and PHP. Additional tools include MySQL, Git, Sass, Foundation 5, Bootstrap, Bower and Grunt. When I am not busy coding, some of the things I like to do best are playing guitar and my stand up bass, enjoying some time on the beach with my family, or watching my son play baseball. I also love going out to see live music and comedy.<br><br>For more details about my experience, please see <a href="/assets/rickwjones_res_2015.pdf" target="_blank" title="PDF resume for Rick W. Jones">my resume</a> or visit <a href="http://www.linkedin.com/pub/rick-jones/2/893/563/en">my LinkedIn page</a>.'
            },
            'contact': {
                label: 'Rick W. Jones',
                sublabel: 'Contact',
                content: '<a href="mailto:rick@rickwjones.com">rick@rickwjones.com</a><br>(424) 212-1201'
            },
            'portfolio': {
                label: 'Rick W. Jones',
                sublabel: 'Portfolio',
                content: 'Since November of 2013, I\'ve had the honor of working as a Software Engineer at <a href="http://www.saatchiart.com" target="_blank">Saatchi Art</a>. Saatchi Art is one of the world’s leading online art galleries, and works to help connect artists and collectors around the globe. My role is Front End / UI Development including HTML, CSS, PHP, jQuery and responsive design for mobile and tablet.<br><br>To view a selection of my work please <a href="http://rickwjones.com">click here</a>.'
            }
        };
        /*$scope.templates =
         [ { name: 'portfolio.html', url: 'views/portfolio.html'},
         { name: 'template2.html', url: 'template2.html'} ];
         $scope.template = $scope.templates[0];*/

//        keeping track of the current page, set initially to about
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
        $scope.$on('bgTransitionComplete', function () {
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
                TweenMax.fromTo(element, 0.5, {
                    left: $window.
                        innerWidth
                }, {
                    left: 0, onComplete: function () {
                        $rootScope.$apply(function () {
                            $rootScope.$broadcast('bgTransitionComplete');
                        });
                        done();
                    }
                });
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
                    TweenMax.to(element, 0.2, {opacity: 0, onComplete: done});
                }
                else {
                    done();
                }
            },
            removeClass: function (element, className, done) {
                if (className == 'ng-hide') {
                    element.removeClass('ng-hide');
                    TweenMax.fromTo(element, 0.5, {
                        opacity: 0, left: -element.
                            width()
                    }, {
                        opacity: 0.8, left: 0,
                        onComplete: done
                    });
                }
                else {
                    done();
                }
            }
        };
    })
    .filter('unsafe', function ($sce) {
        return function (val) {
            return $sce.trustAsHtml(val);
        };
    });

/*
website.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
            when('/portfolio', {
                templateUrl: 'partials/portfolio.html',
                controller: 'MainCtrl'
            }).
            when('/portfolio/:portfolioId', {
                templateUrl: 'partials/portfolio-detail.html',
                controller: 'MainCtrl'
            }).
            otherwise({
                redirectTo: '/portfolio'
            });
    }]);*/

function goToSubpage(page) {

    var ahc = {
            label: 'American Heritage Chocolate',
            sublabel: 'Portfolio',
            content: '<div class="row-fluid"><div class="span4"><img src="http://rickwjones.com/wp/wp-content/uploads/2013/05/AHC-timeline-screencap1.jpg" alt="Parallax scrolling timeline" class="single-thumbnail featured"></div><div class="span6 post-aside"><h3>MARS: American Heritage Chocolate</h3><div class="about-project"><p>Front end HTML and CSS for <a href="http://americanheritagechocolate.com" target="_blank" title="Go to MARS American Heritage Chocolate site">American Heritage Chocolate</a> using Foundation 4 CSS framework for a responsive web experience.</p><p>I also helped create the parallax scrolling <a href="http://americanheritagechocolate.com/home/history" title="AHC: History of Chocolate" target="_blank">History of Chocolate</a>, an adaptive interactive timeline using HTML5, CSS3 and jQuery Animation.</p></div></div></div><div class="row-fluid"><div class="span12 entry-content"><img src="http://rickwjones.com/wp/wp-content/uploads/2013/09/American-Heritage-Chocolate.jpg" alt="Homepage American Heritage Chocolate"><img src="http://rickwjones.com/wp/wp-content/uploads/2013/05/mars2.jpg" alt="mars2"><img src="http://rickwjones.com/wp/wp-content/uploads/2013/05/mars-ahc.digital.promocampaigns.comPHASE2.png" alt="Phase 2 lo-fi wireframes using Foundation4."><div class="loop-nav"><div class="previous"><a id="alz" onclick="goToSubpage(\'alz\')" rel="prev">Alzheimer’s Association: The Longest Day →</a></div></div></div></div>'
        },
        alz = {
            label: 'American Heritage Chocolate',
            sublabel: 'Portfolio',
            content: '<div class="row-fluid"><div class="span4"><img src="http://rickwjones.com/wp/wp-content/uploads/2013/05/alz.jpg" alt="Alzheimer’s Association: The Longest Day" class="single-thumbnail featured"></div><div class="span6 post-aside"><h3>Alzheimer’s Association: The Longest Day</h3><div class="about-project"><p>I coded the HTML and CSS on this Responsive site for the <a href="http://act.alz.org/site/TR?fr_id=6650&pg=entry" target="_blank" title="Go to Alzheimer’s Association: The Longest Day site">Alzheimer’s Association “The Longest Day” campaign</a>. <p>Our site helped The Alzheimer’s Association exceed this year’s fundraising goal of $1M by over 30% ($1,302,817 total).</p></div></div></div><div class="row-fluid"><div class="span12 entry-content"><img src="http://rickwjones.com/wp/wp-content/uploads/2013/06/alz-tablet.jpg" alt="Tablet view"><img src="http://rickwjones.com/wp/wp-content/uploads/2013/06/alz-phone.jpg" alt="iPhone"><img src="http://rickwjones.com/wp/wp-content/uploads/2013/05/Alzheimers-Association-The-Longest-Day8.png" alt="Thank you"><div class="loop-nav"><div class="previous"><a href="javascript:void(0)" onclick="goToSubpage(\'mss\')" rel="prev">Be The Match: My Social Stand →</a></div></div></div></div>'
        }

    $('#page').hide();
    if (page === 'ahc') {
        $('#subpage').show('slow').html(ahc.content);
    } else if (page === 'alz') {
        $('#subpage').hide().show('slow').html(alz.content);
    }


    /*$('#' + page).on('click', function() {
        $('#page').hide();
        if (page === 'ahc') {
            $('#subpage').show('fast').html(ahc.content);
        } else if (page === 'alz') {
            $('#subpage').hide().show('fast').html(alz.content);
        }

    });*/

};

$('.nav a').on('click', function() {
    $('#page').show('slow');
    $('#subpage').hide();
});

var url = window.location.href;

if (url.search("#Contact") >= 0) {
    $('#link-contact').click();
    setCurrentPage('contact');
}









