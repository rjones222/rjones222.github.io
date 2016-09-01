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
      var sPageURL = decodeURIComponent(window.location.search.substring(1)),
          sURLVariables = sPageURL.split('&'),
          sParameterName,
          i;
      for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');
      }
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
      $('.user_btn').removeClass('active');
      // set loggedIn
      localStorage.setItem('userLoggedIn', 1);
      SpoonflowerNavigation.loggedInState($hBar);
    });
    $('.link-logout').click(function () {
      // set logged out
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
      localStorage.setItem('userLoggedIn', 1);
      SpoonflowerNavigation.loggedInState($nav);
    });
    $('.link-logout').click(function () {
      // set logged out
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
    // if not set...
    if (userLoggedIn === null) {
      // set loggedIn state to false
      localStorage.setItem('userLoggedIn', 0);
      userLoggedIn = 0;
    } else if (userLoggedIn == 1) {
      $nav.toggleClass('is-loggedin');
    }
    // if false
    if (userLoggedIn == 0) {
      if ($nav.hasClass('is-loggedin')) {
        // hide the submenu
        $nav.toggleClass('is-loggedin');
      }
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
      // set hidePromos preference
      localStorage.setItem('hidePromos', 0);
      promoHidden = 0;
      $promoText.removeClass('visuallyhidden');
      $promosList.delay(3000).slideToggle(800);
      window.setTimeout(delayActiveBtn, 3000);
    } else if (promoHidden == 0) {
      $promoText.removeClass('visuallyhidden');
      $promosList.delay(1000).slideToggle(800);
      window.setTimeout(delayActiveBtn, 1000);
    } else {
      $iconIndicator.toggleClass('icon_close icon_chevron_down');
      $promoText.addClass('visuallyhidden');
    }
    // when user clicks btn toggle promo list visibility
    $('.promos-link-btn').click(function () {
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
        });
      } else {
        // set to false and show the submenu
        localStorage.setItem('hidePromos', 0);
        promoHidden = 0;
        $promosList.slideToggle(400);
        delayActiveBtn();
        $iconIndicator.toggleClass('icon_close icon_chevron_down');
        $promoText.removeClass('visuallyhidden');
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
    $('.nav-link-footer').mouseover(function () {
      SpoonflowerNavigation.showSubnav($(this));
    });

    $('.nav-link-footer').mouseout(function () {
      SpoonflowerNavigation.closeSubnav($(this));
    });
    // Touch behaviors
    $('.nav-link-footer').on('touchstart', function (e) {
      e.stopPropagation();
      e.preventDefault();
      var $el = $(this);
      var link = $el.attr('href');
      if ($el.hasClass('activateLink')) {
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
    $('.nav-link-primary').mouseover(function () {
      SpoonflowerNavigation.showSubnav($(this));
    });

    $('.nav-link-primary').mouseout(function () {
      SpoonflowerNavigation.closeSubnav($(this));
    });

    $('.subnav').mouseover(function () {
      SpoonflowerNavigation.stayOpen($(this));
    });

    $('.subnav').mouseleave(function () {
      // if in a subnav
      if ($('.subnav:hover').length == 0) {
        SpoonflowerNavigation.subnavState = false;
        SpoonflowerNavigation.closeAllSubnav();
      }
    });

    $('nav, .nav').mouseleave(function () {
      SpoonflowerNavigation.subnavState = false;
      SpoonflowerNavigation.closeAllSubnav();
    });
  },

  /**
   * hover subnav links to show more menus
   */
  desktopFlyout: function desktopFlyout() {
    var timer, $this;
    $('.nl-lvl2, .nl-lvl3, .nl-lvl4').mouseenter(function () {
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
    $('.btn-open-subnav').on('touchstart', function (e) {
      e.stopPropagation();
      var $li = $(this).parent();
      if ($li.hasClass('is-active')) {
        SpoonflowerNavigation.collapseMenu($li);
      } else {
        SpoonflowerNavigation.openMenu($li);
      }
    });
    $('.has_subnav > .nav-link-primary').on('touchstart', function (e) {
      e.stopPropagation();
      e.preventDefault();
      var $el = $(this);
      var link = $el.attr('href');
      if ($el.hasClass('activateLink')) {
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
        window.location = link;
      } else {
        $('.nav-link').removeClass('activateLink');
        // delay adding the activateLink class to prevent triggering on initial touch
        window.setTimeout(function () {
          $el.addClass('activateLink');
        }, 300);
        var $navlinkParent = $($el).parent();
        // open submenu as accordion
        SpoonflowerNavigation.openMenu($navlinkParent);
      }
    });
    $('.subnav li').not('.has_subnav').on('touchstart', function (e) {
      e.stopPropagation();
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
      var $this = $(this);
      if ($this.hasClass('is-active')) {
        SpoonflowerNavigation.collapseMenu($this);
      }
    });
    $('.has_subnav > .nav-link-primary').on('touchstart', function (e) {
      e.stopPropagation();
      e.preventDefault();
      var $el = $(this);
      var link = $el.attr('href');
      if ($el.hasClass('activateLink')) {
        window.location = link;
        $el.removeClass('activateLink').siblings().removeClass('current');
        $('.btn-touch_close').remove();
      } else {
        $('.nav-link').removeClass('active activateLink').css('background-color', 'transparent');
        // delay adding the activateLink class to prevent triggering on initial touch
        window.setTimeout(function () {
          $el.addClass('activateLink').removeAttr('style');
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
        // append closeButton to
        $(closeButton).appendTo($el.next());
        // initialize close
        SpoonflowerNavigation.touchCloseSubnav();
      }
    });
    $('.subnav li').not('.has_subnav').on('touchstart', function (e) {
      $('.nav-link').removeClass('active activateLink').css('background-color', 'transparent');
    });
  },

  /**
   * close the subnav using generated close button
   */
  touchCloseSubnav: function touchCloseSubnav() {
    $('.btn-touch_close').on('touchstart', function (e) {
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
      if ($el.hasClass('activateLink')) {
        window.location = link;
      } else {
        $('.nav-link').removeClass('activateLink');
        // delay adding the activateLink class to prevent triggering on initial touch
        window.setTimeout(function () {
          $el.addClass('activateLink').removeAttr('style');
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
    $currentSubnav.addClass('current');
  },

  /**
   * open the flyout menus
   * @param  {jQuery} $target - $('.has_subnav a') a link with a subnav
   */
  flyoutOpen: function flyoutOpen($target) {
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
    $target.parent().find('ul').removeClass('current');
    $target.parent().find('a').removeClass('active activateLink');
  },

  /**
   * open the mobile subnav menu
   * @param  {jQuery} $li - the subnav <li>
   */
  openMenu: function openMenu($li) {
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
    $('.has_subnav').removeClass('is-active').removeAttr('style');
    $('.nav-link').removeClass('activateLink');
    $('ul').removeClass('menu-visible');
  },

  /**
   * collapse child subnavs
   * @param  {jQuery} $target - the subnav <li>
   */
  collapseChildSubnavs: function collapseChildSubnavs($target) {
    var $li = $target;
    $li.attr('class', 'has_subnav');
    $li.find('ul').removeClass('menu-visible');
  },

  /**
   * Close the mobile-only utility menu
   */
  closeUtilityMenu: function closeUtilityMenu() {
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
          if (e.which == 13) {
            window.location = href;
          }
        });
      } else {
        $navLinks.removeClass('activateLink');
        $this.addClass('activateLink');
        SpoonflowerNavigation.showSubnav($this);
      }
    });
    $('.nl-lvl2, .nl-lvl3, .nl-lvl4, .nl-lvl5').focus(function (e) {
      // Make sure to stop event bubbling
      e.preventDefault();
      e.stopPropagation();
      var $this = $(this);
      SpoonflowerNavigation.flyoutClose($this);
      var href = $this.attr('href');
      if ($this.hasClass('activateLink')) {
        // follow link if enter key is pressed
        $this.on('keydown', function (e) {
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
            window.location = link;
          } else {
            $navLink.addClass('activateLink');
            SpoonflowerNavigation.showSubnav($navLink);
          }
          break;
        case 27:
          // esc
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
            if ($el.hasClass('activateLink')) {
              $el.on('keydown', function (e) {
                if (e.which == 13) {
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
          SpoonflowerNavigation.subnavState = false;
          SpoonflowerNavigation.closeAllSubnav();
          // skip to utility bar
          $('.u_bar-container').focus();
          break;
        case 38:
          // up arrow
          e.preventDefault();
          e.stopPropagation();
          // store subnavLink href
          var snLink = $subnavLink.attr('href');
          // follow the link on keydown enter
          if ($subnavLink.hasClass('activateLink')) {
            $subnavLink.on('keydown', function (e) {
              if (e.which == 13) {
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
 * Refactored inline desktop search
 * @type {Object}
 */
var SpoonflowerSearch = {

  init: function init() {
    SpoonflowerSearch.triggerSelectDropdown();
    SpoonflowerSearch.searchFilter();
  },

  /**
   * Toggle the dropdown
   */
  triggerSelectDropdown: function triggerSelectDropdown() {
    // toggle when chevron button or the search select filter  is clicked
    $('.btn-select, .search_select-wrapper').on('click', function (e) {
      e.preventDefault();
      if (!$('.search_select-dropdown').hasClass('active')) {
        $('.search_select-dropdown').slideToggle('medium').addClass('active');
      } else {
        $('.search_select-dropdown').slideToggle('medium').removeClass('active');
      }
    });
    // if keyboard 'enter'
    $('.search_select-wrapper').on('keydown', function (e) {
      if (e.which == 13) {
        $('.search_select-dropdown').slideToggle('medium').addClass('active');
        $('.search_select-item').focus();
      }
    });
  },

  /**
   * select the search filter
   */
  searchFilter: function searchFilter() {
    var searchSelected = $('.search_filter').val();
    var searchSelectedText = searchSelected == 'gift_wrap' ? 'Gift Wrap' : searchSelected;
    // set search selected to whatever is in the hidden search_filter input
    $('.search_selected').text(searchSelectedText);
    $(".search_select-item").click(function () {
      var searchType = $(this).attr('data-filter');
      SpoonflowerSearch.selectedName(searchType);
      SpoonflowerSearch.selectedForm(searchType);
      if ($('.search_select-dropdown').hasClass('active')) {
        $('.search_select-dropdown').hide('fast').removeClass('active');
      }
      $('.search_input').focus();
    });
    // if keyboard 'enter'
    $('.search_select-item').on('keydown', function (e) {
      if (e.which == 13) {
        var searchType = $(this).attr('data-filter');
        SpoonflowerSearch.selectedName(searchType);
        SpoonflowerSearch.selectedForm(searchType);
        if ($('.search_select-dropdown').hasClass('active')) {
          $('.search_select-dropdown').hide('fast').removeClass('active');
        }
        $('.search_input').focus();
      }
    });
    // if keyboard 'enter' inside search_input go forth and search
    $('.search_input').on('keydown', function (e) {
      if (e.which == 13) {
        $('.btn-search').focus().trigger('click');
      }
    });
  },

  selectedName: function selectedName(search) {
    $('.search_filter').val(search);
    if (search == 'gift_wrap') {
      $('.search_shop').val('gift_wrap');
      $('.search_selected').html('Gift Wrap');
    } else {
      $('.search_shop').val(search);
      var str = search.toLowerCase().replace(/\b[a-z]/g, function (letter) {
        return letter.toUpperCase();
      });
      $('.search_selected').html(str);
    }
    if ($('.search_select-dropdown').hasClass('active')) {
      $('.search_select-dropdown').hide('fast').removeClass('active');
    }
  },

  selectedForm: function selectedForm(search) {
    if (search == "collections") {
      document.search_form.action = "http://www.spoonflower.com/spelunks";
    } else if (search == "designers") {
      document.search_form.action = "http://www.spoonflower.com/spelunks";
    } else {
      document.search_form.action = "http://www.spoonflower.com/shop";
    }
  }

};

SpoonflowerSearch.init();
//# sourceMappingURL=main.js.map
