'use strict';

/**
 *  Navigation
 */

/**
 * Encapsulates Navigation functions
 * @type {Object}
 */
var SpoonflowerNavigation = {

  /**
   * flag for subnav visibility
   * @type {Boolean}
   */
  subnavState: false,

  /**
   * variable to store windowWidth once SpoonflowerNavigation initializes
   */
  windowWidth: 0,

  /**
   * Initializes functions below
   */
  init: function init() {
    /**
     * Using window width to determine whether on mobile or not
     * @param  {jQuery} SpoonflowerNavigation.windowWidth - get viewport width
     * @return {Number}        return a number
     */
    SpoonflowerNavigation.windowWidth = $(window).width();

    SpoonflowerNavigation.userTesting();

    // SpoonflowerNavigation.loggedInState();
    SpoonflowerNavigation.showDefinition();
    SpoonflowerNavigation.hidePromos();
    SpoonflowerNavigation.footerSubnav();
    SpoonflowerNavigation.keyboardAccessibility();
    // mobile only
    if (SpoonflowerNavigation.windowWidth < '768') {
      SpoonflowerNavigation.loggedInState($('#hBar'));
      SpoonflowerNavigation.loggedInMobile();
      SpoonflowerNavigation.mobileUtilityMenus();
      SpoonflowerNavigation.mobileTouchSubnavOpen();
      $('#navToggle button').click(function (e) {
        e.preventDefault();
        SpoonflowerNavigation.navToggle();
      });
    }
    // desktop and tablet only
    if (SpoonflowerNavigation.windowWidth > '767') {
      SpoonflowerNavigation.loggedInState($('.u_nav'));
      SpoonflowerNavigation.loggedIn();
      SpoonflowerNavigation.desktopSubnav();
      SpoonflowerNavigation.desktopFlyout();
      SpoonflowerNavigation.touchSubnavOpen();
    }

    /**
     * for debugging, prevent default link following
     */

    //  $('.nav-link').on('click', function(e){
    //    // console.log('link blocked!');
    //    e.preventDefault();
    //  });
  },

  /**
   * Some functionality to help with mocking up for user testing
   */
  userTesting: function userTesting() {
    /**
     * Show a mocked up pages by switching the image in the <main> section. We're
     * avoiding having to code a fully functional website with multiple pages,
     * includes, etc.
     */
    showMockPage('page');

    /**
     * takes the url string, gets the value of the 'page' url parameter and
     * shows or hides images in the main section of the single page html app.
     * @param  {string} sParam - string parameter
     * code help: http://stackoverflow.com/a/21903119
     */
    function showMockPage(sParam) {
      // console.log('in showMockPage');
      var sPageURL = decodeURIComponent(window.location.search.substring(1)),
          sURLVariables = sPageURL.split('&'),
          sParameterName,
          i;
      // console.log('sURLVariables: ', sURLVariables);
      for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');
        // console.log('sParameterName: ', sParameterName[1]);
        // this stopped working, why !?
        // if (sParameterName[0] === sParam) {
        //   return sParameterName[1] === undefined ? true : sParameterName[1];
        // }
      }
      // console.log('sParameterName[1]: ', sParameterName[1]);
      // using switch here in case we want to add more mock pages
      switch (sParameterName[1]) {
        case 'dachshund':
          $('.mock_page_image').hide();
          $('#fabricDachshund, #fabricDachshund-header').show();
          break;
        case 'mobile':
          $('.mock_page_image').hide();
          $('#mobileMock, #mobile-header').show();
          break;
        case 'welcome':
          $('.mock_page_image').hide();
          $('#welcomeMock, #welcomeMock-header').show();
          break;
        default:
          $('.mock_page_image').hide();
          $('#welcomeMock, #welcomeMock-header').show();
          break;
      }
    }
  },

  /**
   * In mobile view this toggles navigation visibility and if already visible triggers collapseAllSubnavs()
   */
  navToggle: function navToggle() {
    $('.h_bar > nav').slideToggle('medium');
    $('#hBar').toggleClass('is-collapsed is-expanded');
    $('#navToggle i').toggleClass('icon_close icon_menu');
    if ($('#hBar').hasClass('is-expanded')) {
      SpoonflowerNavigation.collapseAllSubnavs();
      // remove any open mobile utility menus
      SpoonflowerNavigation.closeUtilityMenu();
    }
  },

  /**
   * toggles visibility of dropdown with details on what we do
   */
  showDefinition: function showDefinition() {
    /**
     * the element that triggers the events
     * @type {jQuery}
     */
    var $definitionToggle = $('.spoonflower_definition dt');
    /**
     * the hidden drawer that slides open
     * @type {jQuery}
     */
    var $definitionDrawer = $('.spoonflower_definition dd');
    /**
     * toggles down and up icons, toggles visibility of definition
     */
    function showDef() {
      $definitionToggle.find('i:first-child').toggleClass('icon_chevron_down icon_close');
      $definitionDrawer.slideToggle('medium').toggleClass('display_none active');
      if ($definitionDrawer.hasClass('active')) {
        // initialize closeDef()
        closeDef();
      }
    }

    /**
     * click handler
     */
    $definitionToggle.on('click', function () {
      showDef();
      SpoonflowerNavigation.closePromos();
    }).on('mouseleave', function () {
      this.blur();
    });

    function closeDef() {
      if ($definitionDrawer.hasClass('active')) {
        $('html').click(function (e) {
          if (e.target.id == 'hBar') {
            closeIt();
          }
        });
        $definitionDrawer.on('mouseleave', function () {
          closeIt();
          $definitionToggle.blur();
        });
      }
      function closeIt() {
        $definitionToggle.find('i:first-child').attr('class', 'icon icon_chevron_down');
        $definitionDrawer.hide().attr('class', 'display_none');
      }
    }

    /**
     * keydown handler
     * 13 = 'enter', 27 = 'esc' or 32 = 'spacebar'
     *
     * NOTE: spacebar scrolls the page so how can spacebar key presses be used
     * for buttons as the web accessibility recommendations say???
     * see: http://webaim.org/techniques/keyboard/tabindex#zero-negative-one
     */

    $definitionToggle.on('keydown', function (e) {
      if ([13, 27].indexOf(e.which) + 1) {
        e.preventDefault();
        showDef();
      }
    });

    /**
     * Escape the box if keyboard focused on links - overkill?
     * @param  {jQuery} '.spoonflower_definition .btn-primary:focus' - buttons within Definition block
     */
    $('.spoonflower_definition .btn-primary').on('keydown', function (e) {
      if (e.which == 27) {
        showDef();
      }
    });
  },

  /**
   * In mobile devices (under 767px viewport width), toggles topmost header nav
   * icon visibility, changes login button text
   */
  loggedInMobile: function loggedInMobile() {
    var $hBar = $('#hBar');
    $('.btn-login').click(function (e) {
      e.preventDefault();
      // console.log('in loggedInMobile');
      $('.user_btn').removeClass('active');
      // $hBar.toggleClass('is-loggedin');
      // set loggedIn
      localStorage.setItem('userLoggedIn', 1);
      SpoonflowerNavigation.loggedInState($hBar);
    });
    $('.link-logout').click(function () {
      // set logged out
      // console.log('.link-logout clicked');
      localStorage.setItem('userLoggedIn', 0);
      SpoonflowerNavigation.loggedInState($hBar);
    });
  },

  /**
   * toggles visibility of Log In, Join, My Studio, in utility nav bar, changes
   * Log In button text
   */
  loggedIn: function loggedIn() {
    var $nav = $('.u_nav');

    $('.link-login').click(function (e) {
      e.preventDefault();
      // console.log('desktop .link-login clicked');
      localStorage.setItem('userLoggedIn', 1);
      SpoonflowerNavigation.loggedInState($nav);
    });
    $('.link-logout').click(function () {
      // set logged out
      // console.log('.link-logout clicked');
      localStorage.setItem('userLoggedIn', 0);
      SpoonflowerNavigation.loggedInState($nav);
    });
  },

  /**
   * Reads from and sets localStorage, toggles .is-loggedin accordingly
   * @param  {jQuery Object} $nav - either the mobile #hBar or the .u_bar utility nav containers
   */
  loggedInState: function loggedInState($nav) {
    // store loggedIn state in localStorage
    var userLoggedIn = localStorage.getItem('userLoggedIn');
    // console.log('original userLoggedIn: ', userLoggedIn);
    // if not set...
    if (userLoggedIn === null) {
      // console.log('userLoggedIn is not set');
      // set loggedIn state to false
      localStorage.setItem('userLoggedIn', 0);
      userLoggedIn = 0;
    } else if (userLoggedIn == 1) {
      // console.log('userLoggedIn is true!');
      // console.log('$nav: ', $nav);
      $nav.toggleClass('is-loggedin');
    }
    // console.log('userLoggedIn1: ' + userLoggedIn);
    // if false
    if (userLoggedIn == 0) {
      // console.log('userLoggedIn is false!');
      if ($nav.hasClass('is-loggedin')) {
        // hide the submenu
        $nav.toggleClass('is-loggedin');
      }
      // console.log('userLoggedIn2: ' + userLoggedIn);
    }
  },

  /**
   * promo subnav is shown by default, user must close it. Storing preference in localStorage
   */
  hidePromos: function hidePromos() {

    var promoHidden = localStorage.getItem('hidePromos');
    var $promosList = $('.promos-link ul');
    var $iconIndicator = $('#iconIndicator');
    var $promoText = $('.promo_text');
    var $promoButton = $('.promos-link-btn');

    /**
     * add .active to the promoButton
     */
    function delayActiveBtn() {
      $promoButton.addClass('active');
    }
    // if not set...
    if (promoHidden === null) {
      // console.log('promoHidden is not set');
      // set hidePromos preference
      localStorage.setItem('hidePromos', 0);
      promoHidden = 0;
      $promoText.removeClass('visuallyhidden');
      $promosList.delay(3000).slideToggle(800);
      window.setTimeout(delayActiveBtn, 3000);
    } else if (promoHidden == 0) {
      // console.log('promoHidden is false!');
      $promoText.removeClass('visuallyhidden');
      $promosList.delay(1000).slideToggle(800);
      window.setTimeout(delayActiveBtn, 1000);
    } else {
      // console.log('promoHidden is true!');
      $iconIndicator.toggleClass('icon_close icon_chevron_down');
      $promoText.addClass('visuallyhidden');
    }
    // when user clicks btn toggle promo list visibility
    $('.promos-link-btn').click(function () {
      // console.log('promoHidden1: ' + promoHidden);
      // if false
      if (promoHidden == 0) {
        // hide the submenu
        $promosList.slideToggle(400, function () {
          $iconIndicator.toggleClass('icon_close icon_chevron_down');
          // set to true
          localStorage.setItem('hidePromos', 1);
          promoHidden = 1;
          $promoButton.removeClass('active');
          // $burst.removeClass('visuallyhidden');
          $promoText.addClass('visuallyhidden');
          // console.log('promoHidden2: ' + promoHidden);
        });
      } else {
        // set to false and show the submenu
        localStorage.setItem('hidePromos', 0);
        promoHidden = 0;
        $promosList.slideToggle(400);
        delayActiveBtn();
        $iconIndicator.toggleClass('icon_close icon_chevron_down');
        $promoText.removeClass('visuallyhidden');
        // console.log('promoHidden3: ' + promoHidden);
      }
    }).on('mouseenter', function () {
      var $openSubnav = $('.subnav-dropdown.current');
      // close open subnav
      SpoonflowerNavigation.subnavState = false;
      SpoonflowerNavigation.closeSubnav($openSubnav);
    });

    $promosList.on('mouseleave', function () {
      SpoonflowerNavigation.closePromos();
    });
  },

  /**
   * if promo menu is open, close it.
   */
  closePromos: function closePromos() {
    if ($('.promos-link-btn').hasClass('active')) {
      $('.promos-link-btn').trigger('click');
    }
  },

  /**
   * Handles cloning utility menus, and their visibility
   */
  mobileUtilityMenus: function mobileUtilityMenus() {
    $('.user_btn, .studio_btn, .promos_btn, .cart_btn').on('touchstart', function () {
      var $this = $(this);
      var className = $this.attr('class');
      var menuArray = ['.user_menu_mobile', '.studio_menu_mobile', '.promos_menu_mobile', '.cart_menu_mobile'];
      var menu;
      // set menu based on class name
      switch (className) {
        case 'font_icon_btn user_btn':
          menu = menuArray[0];
          break;
        case 'font_icon_btn studio_btn':
          menu = menuArray[1];
          break;
        case 'font_icon_btn promos_btn':
          menu = menuArray[2];
          break;
        case 'font_icon_btn cart_btn':
          menu = menuArray[3];
          break;
        case 'font_icon_btn user_btn active':
          menu = menuArray[0];
          break;
        case 'font_icon_btn studio_btn active':
          menu = menuArray[1];
          break;
        case 'font_icon_btn promos_btn active':
          menu = menuArray[2];
          break;
        case 'font_icon_btn cart_btn active':
          menu = menuArray[3];
          break;
      }
      // console.log('clicked ', $this);
      if ($this.hasClass('active')) {
        $('.main').find(menu).remove();
        $this.removeClass('active');
      } else {
        // remove any open mobile utility menus
        SpoonflowerNavigation.closeUtilityMenu();
        // close open nav
        if ($('#hBar').hasClass('is-expanded')) {
          SpoonflowerNavigation.navToggle();
        }
        // if promos menu is hidden remove inline style added by jQuery
        if (menu == menuArray[2]) {
          $('.promos_menu_mobile').removeAttr('style');
        }
        $(menu).removeClass('subnav').clone().prependTo('.main');
        $this.addClass('active');
      }
      // access the logout link in the cloned menu, toggle the hBar and then remove the menu
      $('.link-logout').click(function (e) {
        // console.log('.link-logout clicked');
        e.preventDefault();
        $('#hBar').toggleClass('is-loggedin');
        localStorage.setItem('userLoggedIn', 0);
        $('.main').find(menu).remove();
      });
    });
  },
  /**
   * [footerSubnav description]
   */
  footerSubnav: function footerSubnav() {
    // Desktop hover
    // console.log('in desktopSubnav()');
    $('.nav-link-footer').mouseover(function () {
      // console.log('mouseover .nav-link-primary');
      SpoonflowerNavigation.showSubnav($(this));
    });

    $('.nav-link-footer').mouseout(function () {
      // console.log('mouseout .nav-link-primary');
      SpoonflowerNavigation.closeSubnav($(this));
    });
    // Touch behaviors
    $('.nav-link-footer').on('touchstart', function (e) {
      e.stopPropagation();
      e.preventDefault();
      var $el = $(this);
      var link = $el.attr('href');
      // console.log('.nav-link-primary on touchstart');
      if ($el.hasClass('activateLink')) {
        // console.log('link blocked!');
        window.location = link;
      } else {
        $('.nav-link-footer').removeClass('activateLink');
        // delay adding the activateLink class to prevent triggering on initial touch
        window.setTimeout(function () {
          $el.addClass('activateLink');
        }, 300);
        // open the menu item if touched
        var $navlinkParent = $($el).parent();
        SpoonflowerNavigation.showSubnav($el);
        // initialize touchOpenFlyout
        // SpoonflowerNavigation.touchOpenFlyout();
        // remove any touch close button
        $('.btn-touch_close').remove();
        // add close button
        var closeButton = '<button class="btn btn-touch_close"><i class="icon icon_close" aria-hidden="true"></i> <span class="visuallyhidden">Close Menu</span></button>';
        // if opened from footer append to ul.subnav-flyup else append to <nav>
        if ($el.next().hasClass('subnav-flyup')) {
          $(closeButton).appendTo($el.next());
        } else {
          $(closeButton).appendTo($('nav'));
        }
        // initialize close
        SpoonflowerNavigation.touchCloseSubnav();
      }
    });
  },

  /**
   * begin desktop navigation functionality
   * hover top level navigation to show subnav
   */
  desktopSubnav: function desktopSubnav() {
    // console.log('in desktopSubnav()');
    $('.nav-link-primary').mouseover(function () {
      // console.log('mouseover .nav-link-primary');
      SpoonflowerNavigation.showSubnav($(this));
    });

    $('.nav-link-primary').mouseout(function () {
      // console.log('mouseout .nav-link-primary');
      SpoonflowerNavigation.closeSubnav($(this));
    });

    $('.subnav').mouseover(function () {
      // console.log('mouseover .subnav');
      SpoonflowerNavigation.stayOpen($(this));
    });

    $('.subnav').mouseleave(function () {
      // console.log('mouseleave .subnav');
      // if in a subnav
      if ($('.subnav:hover').length == 0) {
        SpoonflowerNavigation.subnavState = false;
        // console.log('in mouseleave');
        SpoonflowerNavigation.closeAllSubnav();
      }
    });

    $('nav, .nav').mouseleave(function () {
      // console.log('mouseleave nav');
      SpoonflowerNavigation.subnavState = false;
      SpoonflowerNavigation.closeAllSubnav();
    });
  },

  /**
   * hover subnav links to show more menus
   */
  desktopFlyout: function desktopFlyout() {
    var timer, $this;
    // console.log('in desktopFlyout()');
    $('.nl-lvl2, .nl-lvl3, .nl-lvl4').mouseenter(function () {
      // console.log('FLYOUT: mouseenter .has_subnav a');
      $this = $(this);
      timer = setTimeout(function () {
        SpoonflowerNavigation.flyoutOpen($this);
      }, 300);
    }).mouseleave(function () {
      clearTimeout(timer);
    });
  },

  /**
   * Opens the subnav items in an accordion menu for mobile
   *
   * $this - li.has_subnav
   */
  mobileTouchSubnavOpen: function mobileTouchSubnavOpen() {
    $('.has_subnav').not('.promos-link').on('touchstart', function (e) {
      e.stopPropagation();
      // console.log('in touchSubnavOpen .has_subnav.not(\'.promos-link\')');
      var $this = $(this);
      if ($this.hasClass('is-active')) {
        // SpoonflowerNavigation.collapseChildSubnavs($this);
        SpoonflowerNavigation.collapseMenu($this);
      } else {
        SpoonflowerNavigation.openMenu($this);
      }
    });
    $('.has_subnav > .nav-link-primary').on('touchstart', function (e) {
      e.stopPropagation();
      e.preventDefault();
      var $el = $(this);
      var link = $el.attr('href');
      // console.log('in touchSubnavOpen .nav-link-primary on touchstart');
      if ($el.hasClass('activateLink')) {
        // console.log('link blocked!');
        window.location = link;
        $el.removeClass('activateLink').siblings().removeClass('current');
      } else {
        $('.nav-link').removeClass('activateLink');
        // delay adding the activateLink class to prevent triggering on initial touch
        window.setTimeout(function () {
          $el.addClass('activateLink');
        }, 300);
        // open the menu item if touched
        var $navlinkParent = $($el).parent();
        // show Subnav on iPad portrait and larger touch screens,
        if (SpoonflowerNavigation.windowWidth > '767') {
          SpoonflowerNavigation.showSubnav($el);
          // initialize touchOpenFlyout
          SpoonflowerNavigation.touchOpenFlyout();
          // remove any touch close button
          $('.btn-touch_close').remove();
          // add close button
          var closeButton = '<button class="btn btn-touch_close"><i class="icon icon_close" aria-hidden="true"></i> Close Menu</button>';
          // if opened from footer append to ul.subnav-flyup else append to <nav>
          if ($el.next().hasClass('subnav-flyup')) {
            $(closeButton).appendTo($el.next());
          } else {
            $(closeButton).appendTo($('nav'));
          }
          // initialize close
          SpoonflowerNavigation.touchCloseSubnav();
        } else {
          // else open submenu as accordion
          // console.log("opening accordion");
          SpoonflowerNavigation.openMenu($navlinkParent);
        }
      }
    });
    // mobile link behaviors
    $('.has_subnav > .nl-lvl2, .has_subnav > .nl-lvl3, .has_subnav > .nl-lvl4').on('touchstart', function (e) {
      e.stopPropagation();
      e.preventDefault();
      var $el = $(this);
      var link = $el.attr('href');
      if ($el.hasClass('activateLink')) {
        // console.log('link blocked!');
        window.location = link;
      } else {
        // console.log('touched mobile subnav link');
        $('.nav-link').removeClass('activateLink');
        // delay adding the activateLink class to prevent triggering on initial touch
        window.setTimeout(function () {
          $el.addClass('activateLink');
        }, 300);
        var $navlinkParent = $($el).parent();
        // open submenu as accordion
        // console.log("opening accordion");
        SpoonflowerNavigation.openMenu($navlinkParent);
      }
    });
    $('.subnav li').not('.has_subnav').on('touchstart', function (e) {
      e.stopPropagation();
      // console.log('stopPropagation');
    });
  },

  /**
   * Opens the subnav items as a megamenu for tablet
   *
   * $this - li.has_subnav
   */
  touchSubnavOpen: function touchSubnavOpen() {
    $('.has_subnav').not('.promos-link').on('touchstart', function (e) {
      e.stopPropagation();
      // console.log('in touchSubnavOpen .has_subnav.not(\'.promos-link\')');
      var $this = $(this);
      if ($this.hasClass('is-active')) {
        // SpoonflowerNavigation.collapseChildSubnavs($this);
        SpoonflowerNavigation.collapseMenu($this);
      } else {
        SpoonflowerNavigation.openMenu($this);
      }
    });
    $('.has_subnav > .nav-link-primary').on('touchstart', function (e) {
      e.stopPropagation();
      e.preventDefault();
      var $el = $(this);
      var link = $el.attr('href');
      // console.log('in touchSubnavOpen .nav-link-primary on touchstart');
      if ($el.hasClass('activateLink')) {
        // console.log('link blocked!');
        window.location = link;
        $el.removeClass('activateLink').siblings().removeClass('current');
        $('.btn-touch_close').remove();
      } else {
        $('.nav-link').removeClass('activateLink');
        // delay adding the activateLink class to prevent triggering on initial touch
        window.setTimeout(function () {
          $el.addClass('activateLink');
        }, 300);
        // open the menu item if touched
        var $navlinkParent = $($el).parent();
        // show Subnav
        SpoonflowerNavigation.showSubnav($el);
        // initialize touchOpenFlyout
        SpoonflowerNavigation.touchOpenFlyout();
        // remove any touch close button
        $('.btn-touch_close').remove();
        // add close button
        var closeButton = '<button class="btn btn-touch_close"><i class="icon icon_close" aria-hidden="true"></i><span class="visuallyhidden">Close Menu</span></button>';
        // if opened from footer append to ul.subnav-flyup else append to <nav>
        // if($el.next().hasClass('subnav-flyup')) {
        //   $(closeButton).appendTo($el.next());
        // } else {
        //   $(closeButton).appendTo($('nav'));
        // }
        // append closeButton to
        $(closeButton).appendTo($el.next());
        // initialize close
        SpoonflowerNavigation.touchCloseSubnav();
      }
    });
    $('.subnav li').not('.has_subnav').on('touchstart', function (e) {
      e.stopPropagation();
      // console.log('stopPropagation');
    });
  },

  /**
   * close the subnav using generated close button
   */
  touchCloseSubnav: function touchCloseSubnav() {
    $('.btn-touch_close').on('touchstart', function (e) {
      // console.log('in touchCloseSubnav()');
      e.stopPropagation();
      e.preventDefault();
      var $target = $(this).parent().siblings('.nav-link');
      $target.removeClass('activateLink active');
      SpoonflowerNavigation.subnavState = false;
      SpoonflowerNavigation.closeAllSubnav();
    });
  },
  /**
   * open the flyout menu if on touch device larger than 767px
   */
  touchOpenFlyout: function touchOpenFlyout() {
    $('.has_subnav > .nl-lvl2, .has_subnav > .nl-lvl3, .has_subnav > .nl-lvl4').on('touchstart', function (e) {
      e.stopPropagation();
      e.preventDefault();
      var $el = $(this);
      var link = $el.attr('href');
      // console.log('in touchOpenFlyout()');
      if ($el.hasClass('activateLink')) {
        // console.log('link blocked!');
        window.location = link;
      } else {
        $('.nav-link').removeClass('activateLink');
        // delay adding the activateLink class to prevent triggering on initial touch
        window.setTimeout(function () {
          $el.addClass('activateLink');
        }, 300);
        SpoonflowerNavigation.flyoutOpen($el);
      }
    });
  },

  /**
   * Desktop, Touch and Keyboard flyout behaviors
   */

  /**
   * Desktop, Touch and Keyboard subnav behaviors
   *
   * Show subnav of a primary navigation link (1st level) when mousing over or upon
   * first touch of .nav-link-primary
   * @param  {jQuery} $target - .nav-link-primary
   */
  showSubnav: function showSubnav($target) {
    SpoonflowerNavigation.subnavState = true;
    // console.log('in showSubnav()', + SpoonflowerNavigation.subnavState);
    var getthis = $target.parent().children('ul');
    $('.subnav').removeClass('current');
    $(getthis).addClass('current');
    SpoonflowerNavigation.closePromos();
  },

  /**
   * Close subnav of a primary navigation link (1st level) when mousing over
   * .nav-link-primary or upon first touch of .btn-touch_close
   * @param  {jQuery} $target - .nav-link-primary
   */
  closeSubnav: function closeSubnav($target) {
    console.log('in closeSubnav()', +SpoonflowerNavigation.subnavState);
    var getthis = $target.parent().children('ul');
    if (SpoonflowerNavigation.subnavState == false) {
      $(getthis).removeClass('current');
      $('.nav-link').removeClass('active activateLink');
    }
  },

  /**
   * If mouse leaves .subnav close all subnavs and remove arrow indicators
   */
  closeAllSubnav: function closeAllSubnav() {
    if (SpoonflowerNavigation.subnavState == false) {
      // console.log('in closeAllSubnav()', + SpoonflowerNavigation.subnavState);
      $('.subnav').removeClass('current');
      $('.has_subnav a').removeClass('active activateLink');
      // remove any touch close button
      $('.btn-touch_close').remove();
    }
  },

  /**
   * keep the subnav open if hovered
   * @param  {jQuery} $currentSubnav - the hovered .subnav
   */
  stayOpen: function stayOpen($currentSubnav) {
    SpoonflowerNavigation.subnavState = true;
    // console.log('in stayOpen()', + SpoonflowerNavigation.subnavState);
    $currentSubnav.addClass('current');
  },

  /**
   * open the flyout menus
   * @param  {jQuery} $target - $('.has_subnav a') a link with a subnav
   */
  flyoutOpen: function flyoutOpen($target) {
    // console.log('in flyoutOpen()');
    // remove previously set classes
    $target.parent().parent().find('ul').removeClass('current');
    $target.parent().parent().find('a').removeClass('active');
    // set classes
    $target.parent().children('ul').addClass('current');
    // delay adding the active class to coincide with adding .activateLink
    window.setTimeout(function () {
      $target.parent().children('a').addClass('active');
    }, 300);
    // get position and set top position of the menu
    var $position = $target.parent().position();
    $target.parent().children('ul').css('top', -$position.top);
  },

  /**
   * close the flyout menus
   * @param {jQuery} $target - either .nl-lvl2, .nl-lvl3, .nl-lvl4, .nl-lvl5
   */
  flyoutClose: function flyoutClose($target) {
    // console.log('in flyoutClose()');
    // if(SpoonflowerNavigation.flyoutState == false) {
    $target.parent().find('ul').removeClass('current');
    $target.parent().find('a').removeClass('active activateLink');
    // $('.subnav').removeClass('current');
    // $('.has_subnav a').removeClass('active');
    // }
  },

  /**
   * open the mobile subnav menu
   * @param  {jQuery} $li - the subnav <li>
   */
  openMenu: function openMenu($li) {
    console.log("in openMenu");
    // close all other open menus
    $li.siblings('.is-active').attr('class', 'has_subnav').find('ul').removeClass('menu-visible');
    // and then hide siblings
    $li.siblings().not('.mobile_search').fadeOut(300);
    // set the class, make menu visible
    $li.children('ul').addClass('menu-visible');
    $li.addClass('is-active');
    // delay adding the activateLink class to prevent triggering on initial touch
    window.setTimeout(function () {
      $li.children('.nav-link').addClass('activateLink');
    }, 300);
    // remove active link from ancestor active link
    $li.parent().parent().children('.nav-link').removeClass('activateLink');
  },

  /**
   * collapse menu
   * @param  {jQuery} $li - the subnav <li>
   */
  collapseMenu: function collapseMenu($li) {
    // console.log('in collapseMenu');
    // reset the class on the target
    $li.removeClass('is-active');
    $li.find('.nav-link').removeClass('activateLink');
    $li.find('ul').removeClass('menu-visible');
    // delay adding the activateLink class to prevent triggering on initial touch
    window.setTimeout(function () {
      $li.parent().parent().children('.nav-link').addClass('activateLink');
    }, 300);
    // and then show siblings by zapping the style attribute added by .hide()
    $li.siblings().removeAttr('style');
    // if a submenu is active or hidden reset it
    $li.find('li').removeAttr('style').removeClass('is-active');
  },

  /**
   * collapse all the subnavs
   */
  collapseAllSubnavs: function collapseAllSubnavs() {
    // console.log('in collapseAllSubnavs');
    $('.has_subnav').removeClass('is-active').removeAttr('style');
    $('.nav-link').removeClass('activateLink');
    // $('.btn-mobile_nav button i').attr('class', 'icon icon_chevron_down');
    $('ul').removeClass('menu-visible');
  },

  /**
   * collapse child subnavs
   * @param  {jQuery} $target - the subnav <li>
   */
  collapseChildSubnavs: function collapseChildSubnavs($target) {
    // console.log('in collapseChildSubnavs');
    var $li = $target;
    $li.attr('class', 'has_subnav');
    $li.find('ul').removeClass('menu-visible');
  },

  /**
   * Close the mobile-only utility menu
   */
  closeUtilityMenu: function closeUtilityMenu() {
    // console.log('in closeUtilityMenu');
    $('.main > .subnav-dropdown').remove();
    // remove active class from utility menu button
    $('.font_icon_btn').removeClass('active');
  },

  /**
   * kitchen sink accessibility functions
   */
  keyboardAccessibility: function keyboardAccessibility() {

    // store reference to all .nav-link
    var $navLinks = $('.nav-link');

    /**
     * Back to Top
     *
     * Keydown on enter key (13) takes you back to top of page, specifically to 'skip to content' link
     * @param  {jQuery} '.btn-back_to_top' - button before footer after content
     */
    $('.btn-back_to_top').on('keydown', function (e) {
      if (e.which == 13) {
        $('.screen-reader-top').focus();
      }
    }).on('click', function () {
      // tacking this on here
      window.scrollTo(0, 0);
    });

    /**
     * Tab functionality
     * @param  {jQuery} li.nav-link-primary - when focused then show subnav
     */
    // $('.nav-link-primary').focus(function(){
    //   // $(this).parent().parent().find('ul').hide();
    //   var $this = $(this);
    //   SpoonflowerNavigation.closeSubnav($this);
    //   SpoonflowerNavigation.showSubnav($this);
    // });
    $('.nav-link-primary').focus(function (e) {
      // Make sure to stop event bubbling
      e.preventDefault();
      e.stopPropagation();
      var $this = $(this);
      // // get reference to all .nav-link
      // var $navLinks = $('.nav-link');
      SpoonflowerNavigation.closeSubnav($this);
      var href = $this.attr('href');
      if ($this.hasClass('activateLink')) {
        // follow link if enter key is pressed
        $this.on('keydown', function (e) {
          // e.preventDefault();
          // e.stopPropagation();
          if (e.which == 13) {
            // console.log('link blocked!');
            window.location = href;
          }
        });
      } else {
        $navLinks.removeClass('activateLink');
        $this.addClass('activateLink');
        SpoonflowerNavigation.showSubnav($this);
      }
    });
    // $('.nl-lvl2, .nl-lvl3, .nl-lvl4, .nl-lvl5').focus(function(){
    //   var $this = $(this);
    //   SpoonflowerNavigation.flyoutClose($this);
    //   if($this.parent().hasClass('has_subnav')) {
    //     SpoonflowerNavigation.flyoutOpen($this);
    //   }
    // });
    $('.nl-lvl2, .nl-lvl3, .nl-lvl4, .nl-lvl5').focus(function (e) {
      // Make sure to stop event bubbling
      e.preventDefault();
      e.stopPropagation();
      var $this = $(this);
      // // get reference to all .nav-link
      // var $navLinks = $('.nav-link');
      SpoonflowerNavigation.flyoutClose($this);
      var href = $this.attr('href');
      if ($this.hasClass('activateLink')) {
        // follow link if enter key is pressed
        $this.on('keydown', function (e) {
          // e.preventDefault();
          // e.stopPropagation();
          if (e.which == 13) {
            window.location = href;
          }
        });
      } else {
        $navLinks.removeClass('activateLink');
        $this.addClass('activateLink');
        SpoonflowerNavigation.flyoutOpen($this);
      }
    });

    /**
     * Optionally use arrow controls to navigate primary nav
     * inspiration: http://simplyaccessible.com/article/arrow-key-navigation/
     */
    $('.nav-link-primary').keydown(function (e) {
      // Listen for the enter, esc, up, down, left and right arrow keys, otherwise, end here
      if ([13, 27, 37, 38, 39, 40].indexOf(e.which) == -1) {
        return;
      }

      // Store the reference to our top level link
      var $navLink = $(this);
      // ... the previous top level link
      var $prevLink = $navLink.parent('li').prev('.has_subnav').find('.nav-link-primary');
      // ... the next top level link
      var $nextLink = $navLink.parent('li').next('.has_subnav').find('.nav-link-primary');

      switch (e.which) {
        case 13:
          // enter
          // Make sure to stop event bubbling
          e.preventDefault();
          e.stopPropagation();
          SpoonflowerNavigation.closeSubnav($navLink);
          var link = $navLink.attr('href');
          if ($navLink.hasClass('activateLink')) {
            // console.log('link blocked!');
            window.location = link;
          } else {
            $navLink.addClass('activateLink');
            SpoonflowerNavigation.showSubnav($navLink);
          }
          break;
        case 27:
          // esc
          // console.log('esc pressed');
          SpoonflowerNavigation.subnavState = false;
          SpoonflowerNavigation.closeAllSubnav();
          // skip to utility bar
          $('.u_bar-container').focus();
          break;
        case 37:
          // left arrow
          // Make sure to stop event bubbling
          e.preventDefault();
          e.stopPropagation();
          SpoonflowerNavigation.subnavState = false;
          SpoonflowerNavigation.closeAllSubnav();
          SpoonflowerNavigation.showSubnav($prevLink);
          // This is the first item in the top level mega menu list
          if ($navLink.parent('li').prevAll('li').filter(':visible').first().length == 0) {
            // Focus on the last item in the top level
            $navLink.parent('li').nextAll('li').filter(':visible').last().find('a').first().focus();
          } else {
            // Focus on the previous item in the top level
            $navLink.parent('li').prevAll('li').filter(':visible').first().find('a').first().focus();
          }
          break;
        case 38:
          /// up arrow
          // Find the nested element that acts as the menu
          var $dropdown = $navLink.parent('li').find('.subnav');
          // SpoonflowerNavigation.closeAllSubnav();

          // If there is a UL available, place focus on the first focusable element within
          if ($dropdown.length > 0) {
            e.preventDefault();
            e.stopPropagation();

            $dropdown.find('.nav-link').filter(':visible').first().focus();
          }

          break;
        case 39:
          // right arrow
          // Make sure to stop event bubbling
          e.preventDefault();
          e.stopPropagation();
          SpoonflowerNavigation.subnavState = false;
          SpoonflowerNavigation.closeAllSubnav();
          SpoonflowerNavigation.showSubnav($nextLink);

          // This is the last item
          if ($navLink.parent('li').nextAll('li').filter(':visible').first().length == 0) {
            // SpoonflowerNavigation.closeAllSubnav();
            // Focus on the first item in the top level
            $navLink.parent('li').prevAll('li').filter(':visible').last().find('a').first().focus();
            // SpoonflowerNavigation.showSubnav(link);
          } else {
            // Focus on the next item in the top level
            $navLink.parent('li').nextAll('li').filter(':visible').first().find('a').first().focus();
          }
          break;
        case 40:
          // down arrow
          // Find the nested element that acts as the menu
          var $dropdown = $navLink.parent('li').find('.subnav');
          // SpoonflowerNavigation.showSubnav($navLink);

          // If there is a UL available, place focus on the first focusable element within
          if ($dropdown.length > 0) {
            e.stopPropagation();
            e.preventDefault();
            var $el = $dropdown.find('.nav-link').filter(':visible').first().focus();
            var link = $el.attr('href');
            // console.log('in touchOpenFlyout()');
            if ($el.hasClass('activateLink')) {
              $el.on('keydown', function (e) {
                if (e.which == 13) {
                  // console.log('link blocked!');
                  window.location = link;
                }
              });
            } else {
              $('.nav-link').removeClass('activateLink');
              $el.addClass('activateLink');
              SpoonflowerNavigation.flyoutOpen($el);
              // user able to tab into submenu
            }
          }
          break;
      }
    });

    /**
     * Use arrow controls to navigate subnav menus
     */
    $('.nl-lvl2, .nl-lvl3, .nl-lvl4, .nl-lvl5').keydown(function (e) {
      // Listen for the esc, up and down arrow keys, otherwise, end here
      if ([27, 38, 40].indexOf(e.which) == -1) {
        return;
      }

      // Store the reference to our 2nd level link
      var $subnavLink = $(this);
      // ... the previous 2nd level link
      var $prevSnLink = $subnavLink.parent('li').prev('.has_subnav').children('.nav-link');
      // ... the next 2nd level link
      var $nextSnLink = $subnavLink.parent('li').next('.has_subnav').children('.nav-link');
      // // ... the first 3rd level link
      // var $nlv3 = $subnavLink.parent('li').find('.current').children('.nav-link');

      switch (e.which) {
        case 27:
          // esc
          // console.log('esc pressed');
          SpoonflowerNavigation.subnavState = false;
          SpoonflowerNavigation.closeAllSubnav();
          // skip to utility bar
          $('.u_bar-container').focus();
          break;
        case 38:
          /// up arrow
          e.preventDefault();
          e.stopPropagation();
          // store subnavLink href
          var snLink = $subnavLink.attr('href');
          // follow the link on keydown enter
          if ($subnavLink.hasClass('activateLink')) {
            $subnavLink.on('keydown', function (e) {
              if (e.which == 13) {
                // console.log('link blocked!');
                window.location = snLink;
              }
            });
          } else {
            $subnavLink.addClass('activateLink');
          }
          // This is the first item
          if ($subnavLink.parent('li').prevAll('li').filter(':visible').first().length == 0) {
            // SpoonflowerNavigation.closeAllSubnav();
            // Focus on the last item in the subnav level
            $subnavLink.parent('li').nextAll('li').filter(':visible').last().find('a').first().focus().addClass('activateLink');
            SpoonflowerNavigation.subnavState = false;
            SpoonflowerNavigation.flyoutClose($subnavLink);
            if ($prevSnLink.parent().hasClass('has_subnav')) {
              SpoonflowerNavigation.flyoutOpen($prevSnLink);
            }
          } else {
            // Focus on the previous item in the subnav level
            $subnavLink.parent('li').prevAll('li').filter(':visible').first().find('a').first().focus().addClass('activateLink');
            SpoonflowerNavigation.subnavState = false;
            SpoonflowerNavigation.flyoutClose($subnavLink);
            if ($prevSnLink.parent().hasClass('has_subnav')) {
              SpoonflowerNavigation.flyoutOpen($prevSnLink);
            }
          }
          break;
        case 40:
          // down arrow
          e.preventDefault();
          e.stopPropagation();
          // store subnavLink href
          var snLink = $subnavLink.attr('href');
          // follow the link on keydown enter
          if ($subnavLink.hasClass('activateLink')) {
            $subnavLink.on('keydown', function (e) {
              if (e.which == 13) {
                // console.log('link blocked!');
                window.location = snLink;
              }
            });
          } else {
            $subnavLink.addClass('activateLink');
          }
          // This is the last item
          if ($subnavLink.parent('li').nextAll('li').filter(':visible').first().length == 0) {
            // SpoonflowerNavigation.closeAllSubnav();
            // Focus on the first item in the subnav level
            $subnavLink.parent('li').prevAll('li').filter(':visible').last().find('a').first().focus().addClass('activateLink');
            SpoonflowerNavigation.subnavState = false;
            SpoonflowerNavigation.flyoutClose($subnavLink);
            if ($nextSnLink.parent().hasClass('has_subnav')) {
              SpoonflowerNavigation.flyoutOpen($nextSnLink);
            }
          } else {
            // Focus on the next item in the subnav level
            $subnavLink.parent('li').nextAll('li').filter(':visible').first().find('a').first().focus().addClass('activateLink');
            SpoonflowerNavigation.subnavState = false;
            SpoonflowerNavigation.flyoutClose($subnavLink);
            if ($nextSnLink.parent().hasClass('has_subnav')) {
              SpoonflowerNavigation.flyoutOpen($nextSnLink);
            }
          }
          break;
      }
    });

    /**
     * Close subnav when focus changes to next element in the tab index with the
     * added class... this is a hack but I don't see another option.
     * @param {jQuery} .screen-reader-focus an element with this class will
     * close any open subnavs.
     */
    $('.screen-reader-focus').focus(function () {
      SpoonflowerNavigation.subnavState = false;
      SpoonflowerNavigation.closeAllSubnav();
    });
  }

};

/**
 * Initialize SpoonflowerNavigation
 */
SpoonflowerNavigation.init();

/**
 * [SpoonflowerSearch description] not much to see or say here, used to help style
 * the select used in the search mockup.
 * @type {Object}
 */
var SpoonflowerSearch = {

  init: function init() {
    SpoonflowerSearch.triggerSelect();
  },

  // This does not work in Firefox, may need to consider using Select2 for cross-browser styling of select element
  triggerSelect: function triggerSelect() {
    $('.btn-select').on('click', function (e) {
      e.preventDefault();
      // console.log('in triggerSelect()');
      $('.search_select').simulate('mousedown'); // http://stackoverflow.com/a/16056763
    });
  }

};

SpoonflowerSearch.init();

/*
 * jquery.simulate - simulate browser mouse and keyboard events
 *
 * Copyright (c) 2009 Eduardo Lundgren (eduardolundgren@gmail.com)
 * and Richard D. Worth (rdworth@gmail.com)
 *
 * Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
 * and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
 *
 */

;(function ($) {

  $.fn.extend({
    simulate: function simulate(type, options) {
      return this.each(function () {
        var opt = $.extend({}, $.simulate.defaults, options || {});
        new $.simulate(this, type, opt);
      });
    }
  });

  $.simulate = function (el, type, options) {
    this.target = el;
    this.options = options;

    if (/^drag$/.test(type)) {
      this[type].apply(this, [this.target, options]);
    } else {
      this.simulateEvent(el, type, options);
    }
  };

  $.extend($.simulate.prototype, {
    simulateEvent: function simulateEvent(el, type, options) {
      var evt = this.createEvent(type, options);
      this.dispatchEvent(el, type, evt, options);
      return evt;
    },
    createEvent: function createEvent(type, options) {
      if (/^mouse(over|out|down|up|move)|(dbl)?click$/.test(type)) {
        return this.mouseEvent(type, options);
      } else if (/^key(up|down|press)$/.test(type)) {
        return this.keyboardEvent(type, options);
      }
    },
    mouseEvent: function mouseEvent(type, options) {
      var evt;
      var e = $.extend({
        bubbles: true, cancelable: type != "mousemove", view: window, detail: 0,
        screenX: 0, screenY: 0, clientX: 0, clientY: 0,
        ctrlKey: false, altKey: false, shiftKey: false, metaKey: false,
        button: 0, relatedTarget: undefined
      }, options);

      var relatedTarget = $(e.relatedTarget)[0];

      if ($.isFunction(document.createEvent)) {
        evt = document.createEvent("MouseEvents");
        evt.initMouseEvent(type, e.bubbles, e.cancelable, e.view, e.detail, e.screenX, e.screenY, e.clientX, e.clientY, e.ctrlKey, e.altKey, e.shiftKey, e.metaKey, e.button, e.relatedTarget || document.body.parentNode);
      } else if (document.createEventObject) {
        evt = document.createEventObject();
        $.extend(evt, e);
        evt.button = { 0: 1, 1: 4, 2: 2 }[evt.button] || evt.button;
      }
      return evt;
    },
    keyboardEvent: function keyboardEvent(type, options) {
      var evt;

      var e = $.extend({ bubbles: true, cancelable: true, view: window,
        ctrlKey: false, altKey: false, shiftKey: false, metaKey: false,
        keyCode: 0, charCode: 0
      }, options);

      if ($.isFunction(document.createEvent)) {
        try {
          evt = document.createEvent("KeyEvents");
          evt.initKeyEvent(type, e.bubbles, e.cancelable, e.view, e.ctrlKey, e.altKey, e.shiftKey, e.metaKey, e.keyCode, e.charCode);
        } catch (err) {
          evt = document.createEvent("Events");
          evt.initEvent(type, e.bubbles, e.cancelable);
          $.extend(evt, { view: e.view,
            ctrlKey: e.ctrlKey, altKey: e.altKey, shiftKey: e.shiftKey, metaKey: e.metaKey,
            keyCode: e.keyCode, charCode: e.charCode
          });
        }
      } else if (document.createEventObject) {
        evt = document.createEventObject();
        $.extend(evt, e);
      }
      if ($.browser !== undefined && ($.browser.msie || $.browser.opera)) {
        evt.keyCode = e.charCode > 0 ? e.charCode : e.keyCode;
        evt.charCode = undefined;
      }
      return evt;
    },

    dispatchEvent: function dispatchEvent(el, type, evt) {
      if (el.dispatchEvent) {
        el.dispatchEvent(evt);
      } else if (el.fireEvent) {
        el.fireEvent('on' + type, evt);
      }
      return evt;
    },

    drag: function drag(el) {
      var self = this,
          center = this.findCenter(this.target),
          options = this.options,
          x = Math.floor(center.x),
          y = Math.floor(center.y),
          dx = options.dx || 0,
          dy = options.dy || 0,
          target = this.target;
      var coord = { clientX: x, clientY: y };
      this.simulateEvent(target, "mousedown", coord);
      coord = { clientX: x + 1, clientY: y + 1 };
      this.simulateEvent(document, "mousemove", coord);
      coord = { clientX: x + dx, clientY: y + dy };
      this.simulateEvent(document, "mousemove", coord);
      this.simulateEvent(document, "mousemove", coord);
      this.simulateEvent(target, "mouseup", coord);
    },
    findCenter: function findCenter(el) {
      var el = $(this.target),
          o = el.offset();
      return {
        x: o.left + el.outerWidth() / 2,
        y: o.top + el.outerHeight() / 2
      };
    }
  });

  $.extend($.simulate, {
    defaults: {
      speed: 'sync'
    },
    VK_TAB: 9,
    VK_ENTER: 13,
    VK_ESC: 27,
    VK_PGUP: 33,
    VK_PGDN: 34,
    VK_END: 35,
    VK_HOME: 36,
    VK_LEFT: 37,
    VK_UP: 38,
    VK_RIGHT: 39,
    VK_DOWN: 40
  });
})(jQuery);
//# sourceMappingURL=main.js.map
