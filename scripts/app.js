'use strict';

var scraper_url = "//scraper-rowanhogan.rhcloud.com",
    pdf_css_url = "http://resumebuilder.rowanhogan.com/styles/pdf.css";

var clientApp = angular.module('clientApp', [
  'ui.router',
  'xeditable'
]);


// Config

clientApp.config(function($stateProvider, $locationProvider, $urlRouterProvider, $sceProvider) {
  $sceProvider.enabled(false);
  $locationProvider.hashPrefix('!');

  // Make the trailing slash optional for all routes

  $urlRouterProvider.rule(function($injector, $location) {
    var path = $location.path(),
        search = $location.search(), // Note: misnomer. This returns a query object, not a search string
        params;

    // remove '/' if the path ends in '/'
    if (path[path.length - 1] === '/') { return path.substring(0, path.length - 1); }

    // If there was no search string / query params, does not change anything
    if (Object.keys(search).length === 0) { return; }
  });

  // Routes

  $stateProvider.state('username', {
    title: 'Home',
    url: '/',
    views: {
      'content@':   {
        templateUrl: 'views/username.html',
        controller: 'UsernameCtrl'
      }
    }
  });

  $stateProvider.state('preview', {
    title: 'Preview',
    url: '/preview/:username',
    views: {
      'content@':   {
        templateUrl: 'views/preview.html',
        controller: 'ResumeCtrl',
        resolve: {
          preloaded: function(Profile, $stateParams) {
            return Profile.getProfile($stateParams.username);
          }
        }
      }
    }
  });

  $urlRouterProvider.otherwise('/');
});


clientApp.run(['$rootScope', '$state', '$window', function($rootScope, $state, $window) {
  $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
    $state.go('app');
  });

  $rootScope.$on('$stateChangeStart', function(event, toState) {
    $rootScope.loading = true;

    if (toState.title) {
      $rootScope.pageTitle = toState.title;
    }
  });

  $rootScope.$on('$stateChangeSuccess', function(event){
    $rootScope.loading = false;
  });
}]);



// Services

clientApp.service('Profile', ['$http', '$q', function Profile($http, $q) {
  var getProfile = function getProfile(username) {
    var defer = $q.defer();

    $http.post(scraper_url + '/linkedin/' + username).then(function(response) {
      defer.resolve(response);
    }, function(response) {
      defer.resolve(response);
    });

    return defer.promise;
  };

  return { getProfile: getProfile }
}]);



// Controllers

clientApp.controller('ApplicationCtrl', function($scope) {
  // Global app config
});


clientApp.controller('UsernameCtrl', function($scope, $state, $http) {
  $scope.submitUsername = function() {
    $state.go('preview', { username: $scope.username })
  }
});


clientApp.controller('ResumeCtrl', function($scope, $rootScope, $state, preloaded, $timeout) {
  $rootScope.flash = null;

  if (preloaded.status === 400) {
    $rootScope.flash = preloaded.data.message;
    $state.go('username');
    return false
  }

  $scope.resume = preloaded.data;

  var resizeDocument = function () {
    if ( $(window).width() > 700 ) {
      $('.preview .wrapper').css( 'transform', 'scale(' + ($(window).width() - $(".form").width()) / 950 + ')' );
    } else {
      $('.preview .wrapper').css( 'transform', 'scale(' + $(window).width() / 865 + ')' );
    }

    $('.resume.preview').height( $('.preview .wrapper').height() );
  }

  var removeItemFromArray = function removeItemFromArray (item, array) {
    var index = array.indexOf(item);
    array.splice(index, 1);
  }

  $timeout(function() {
    resizeDocument();
    $('.wrapper').append('<link rel="stylesheet" type="text/css" href="http://rowanhogan.github.io/resumebuilder/styles/fonts.css">');

    $(window).resize(function() {
      resizeDocument();
    });
  });

  $scope.resume.websites.unshift({ name: "LinkedIn", link: $scope.resume.linkedin_url });

  $scope.positions = $scope.resume.current_companies.concat($scope.resume.past_companies);

  $scope.pictureHidden = true;

  $scope.workTitle = "Work";
  $scope.educationTitle = "Education";
  $scope.volunteeringTitle = "Volunteering";
  $scope.skillsTitle = "Skills";
  $scope.languagesTitle = "Languages";

  $scope.fonts = [
    { name: "Bitter", value: "Bitter" },
    { name: "Cabin", value: "Cabin" },
    { name: "Droid Sans", value: "Droid+Sans" },
    { name: "Droid Serif", value: "Droid+Serif" },
    { name: "EB Garamond", value: "EB+Garamond" },
    { name: "Fira Sans", value: "Fira+Sans" },
    { name: "Hind", value: "Hind" },
    { name: "Inconsolata", value: "Inconsolata" },
    { name: "Lato", value: "Lato" },
    { name: "Lora", value: "Lora" },
    { name: "Merriweather", value: "Merriweather" },
    { name: "Merriweather Sans", value: "Merriweather+Sans" },
    { name: "Montserrat", value: "Montserrat" },
    { name: "Open Sans", value: "Open+Sans" },
    { name: "Oswald", value: "Oswald" },
    { name: "Raleway", value: "Raleway" },
    { name: "Roboto", value: "Roboto" },
    { name: "Roboto Slab", value: "Roboto+Slab" },
    { name: "Source Sans Pro", value: "Source+Sans+Pro" },
    { name: "Source Serif Pro", value: "Source+Serif+Pro" }
  ];

  $scope.toggle = function (key) {
    $scope[key] = !$scope[key];
  }

  $scope.booleanLabel = function (key) {
    return ($scope[key] == true ? 'Show' : 'Hide');
  }

  $scope.addWebsite = function () {
    $scope.resume.websites.push({ name: '', link: '' });
  }

  $scope.removeWebsite = function (item) {
    removeItemFromArray(item, $scope.resume.websites);
  }

  $scope.removeJob = function (item) {
    removeItemFromArray(item, $scope.resume.past_companies);
  }

  $scope.togglePrintCss = function () {
    if ($scope.theme == 'condensed') {
      $('#theme-css').html('@page { margin: 0mm; }');
    } else {
      $('#theme-css').html('@page { margin: 20mm 0 20mm 0; }');
    }
  }

  $scope.prepareAndSubmitForm = function (e) {
    e.preventDefault();

    var $form = $(e.target),
        $wrapper = $('.wrapper').clone();

    $wrapper.find('.editable-empty').remove();
    $wrapper.find('.hidden').remove();
    $wrapper.find('form, button, input').remove();
    $wrapper.find('#pdf-css').attr('href', pdf_css_url)
    $wrapper.find('.resume').addClass('render');

    $form.find('input[name="html"]').val( $wrapper.html() );
    $form.submit();
  }
});
