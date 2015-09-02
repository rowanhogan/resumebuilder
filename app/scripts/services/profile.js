
angular.module('clientApp')
  .service('Profile', ['$http', '$q', function Profile($http, $q) {
    var getProfile = function getProfile(username) {
      var defer = $q.defer(),
          scraper_url = "//scraper-rowanhogan.rhcloud.com";

      $http.post(scraper_url + '/linkedin/' + username).then(function(response) {
        defer.resolve(response);
      }, function(response) {
        defer.resolve(response);
      });

      return defer.promise;
    };

    return { getProfile: getProfile }
  }]);
