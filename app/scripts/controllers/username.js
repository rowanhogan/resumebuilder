
angular.module('clientApp')
  .controller('UsernameCtrl', function($scope, $state, $http) {
    $scope.submitUsername = function() {
      $state.go('preview', { username: $scope.username })
    }
  });
