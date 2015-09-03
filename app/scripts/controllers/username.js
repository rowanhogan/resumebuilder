
angular.module('clientApp')
  .controller('UsernameCtrl', function($scope, $state, $http) {
    $('title').text('Resume Builder');

    $scope.submitUsername = function() {
      $state.go('preview', { username: $scope.username })
    }
  });
