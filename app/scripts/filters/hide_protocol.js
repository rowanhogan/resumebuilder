
angular.module('clientApp')
  .filter('hideProtocol', function() {
    return function(input) {
      return input.replace('https://', '').replace('http://', '')
    }
  });
