
var clientApp = angular.module('clientApp', [
  'ui.router',
  'xeditable'
]);

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
    $state.go('username');
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
