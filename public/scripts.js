
var clientApp = angular.module('clientApp', []);

clientApp.controller('UsernameCtrl', function($scope) {
  $scope.submitUsername = function() {
    window.location.replace("/preview/" + $scope.username);
  }
});

clientApp.controller('ResumeCtrl', function($scope) {
  $scope.fonts = [
    { name: 'Droid Sans', value: 'Droid+Sans' },
    { name: 'Fira Sans', value: 'Fira+Sans' },
    { name: 'Lato', value: 'Lato' },
    { name: 'Lora', value: 'Lora' },
    { name: 'Merriweather', value: 'Merriweather' },
    { name: 'Open Sans', value: 'Open+Sans' },
    { name: 'Raleway', value: 'Raleway' },
    { name: 'Source Serif Pro', value: 'Source+Serif+Pro' },
    { name: 'Work Sans', value: 'Work+Sans' }
  ];

  $scope.urls = [];

  $scope.addUrl = function(url) {
    $scope.urls.push(url);
  }
});
