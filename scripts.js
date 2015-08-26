'use strict';

var scraper_url = "//scraper-rowanhogan.rhcloud.com";

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
            // return Profile.getProfile($stateParams.username);
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


clientApp.service('Profile', ['$http', '$q', function Profile($http, $q) {
  var getProfile = function getProfile(username) {
    var defer = $q.defer();

    $http.post(scraper_url + '/linkedin/' + username).then(function(response) {
      defer.resolve(response.data);
    });

    return defer.promise;
  };

  return { getProfile: getProfile }
}]);


clientApp.controller('ApplicationCtrl', function($scope) {
  // Global app config
});


clientApp.controller('UsernameCtrl', function($scope, $state, $http) {
  $scope.submitUsername = function() {
    $state.go('preview', { username: $scope.username })
  }
});

clientApp.controller('ResumeCtrl', function($scope, preloaded, $timeout) {
  // $scope.resume = preloaded;
  $scope.resume = {"name":"Madeleine (Hogan) Johns","first_name":"Madeleine","last_name":"(Hogan) Johns","title":"Museum Professional","location":"Brisbane Area","country":"Australia","industry":"Museums and Institutions","summary":null,"picture":"https://media.licdn.com/mpr/mpr/shrinknp_400_400/AAEAAQAAAAAAAAXmAAAAJGY0NTRhODA3LTJlNDgtNDI5ZC05YTRkLWJmMmFjMzlhNGFjOA.jpg","linkedin_url":"http://www.linkedin.com/in/madeleinejohns","education":[{"name":"The University of Queensland","description":"Masters of Museum Studies","degree":"Masters of Museum Studies","major":null,"period":"2012 – 2012","start_date":"2012","end_date":"2012"},{"name":"The University of Queensland","description":"Graduate Diploma of Museum Studies","degree":"Graduate Diploma of Museum Studies","major":null,"period":"2011 – 2011","start_date":"2011","end_date":"2011"},{"name":"Queensland University of Technology","description":"Bachelor of Music, Production, minor in Creative Industries Management","degree":"Bachelor of Music","major":"Production, minor in Creative Industries Management","period":"2006 – 2008","start_date":"2006","end_date":"2008"}],"volunteering":[],"recommendations":["Over the three year period that I worked with Madeleine I found her to be nothing short of outstanding in conduct, quality of work and overall professionalism.\nAs a supplier to Museum of Brisbane, it would have been easy for her to view me as somewhat 'expendable', to downplay my project input or to disregard my experience. On the contrary, she viewed me as integral to the team, took seriously any project feedback I had, and modified her approach (which was never necessary) to enable me to do my best work possible.\nMadeleine was someone whom I always looked forward to working with as I knew there would be attention to detail, clear communication and most importantly, no ego.\nHaving worked in and with galleries and museums for more than 15 years, I have no apprehension in highly recommending Madeleine for any curatorial role. She would be an asset to any organisation and I sincerely hope that I get to work with her again in the future."],"websites":[],"groups":[],"languages":[],"skills":[],"certifications":[],"organizations":[],"past_companies":[{"title":"Exhibition Curator - 'William Bustard: painting with light'","company":"Museum of Brisbane","description":"As Madeleine Hogan I am currently curating an exhibition \"William Bustard: painting with light\" due to open at Museum of Brisbane in June 2015. The exhibition will include an accompanying catalogue. Summary: As an artist, illustrator, stained-glass window designer and teacher in the early-mid 20th Century, William Bustard (1894-1973) was instrumental in encouraging the production and admiration of Brisbane-based fine art. By encompassing his works in a variety of mediums, this exhibition will demonstrate his wide range of skills and reinforce why, as a foundation member of the Queensland Art Gallery board of trustees and president of the Royal Queensland Art Society, his works are held in high regard.","description_html":"As Madeleine Hogan<br><br>I am currently curating an exhibition \"William Bustard: painting with light\" due to open at Museum of Brisbane in June 2015. The exhibition will include an accompanying catalogue.<br><br>Summary:<br>As an artist, illustrator, stained-glass window designer and teacher in the early-mid 20th Century, William Bustard (1894-1973) was instrumental in encouraging the production and admiration of Brisbane-based fine art. By encompassing his works in a variety of mediums, this exhibition will demonstrate his wide range of skills and reinforce why, as a foundation member of the Queensland Art Gallery board of trustees and president of the Royal Queensland Art Society, his works are held in high regard.","duration":"1 year","start_date":"2014-01-01","end_date":"2015-07-01","linkedin_company_url":"http://www.linkedin.com/company/2891459?trk=ppro_cprof","url":"http://www.museumofbrisbane.com.au","website":"http://www.museumofbrisbane.com.au","industry":"Museums and Institutions","type":"Nonprofit","headquarters":"Level 3, Brisbane City Hall\nKing George Square\nBrisbane,\nQLD\n4000\nAustralia","company_size":"11-50 employees","founded":"2003","address":"Level 3, Brisbane City Hall King George Square Brisbane, QLD 4000 Australia"},{"title":"Assistant Curator","company":"Museum of Brisbane","description":"As Assistant Curator, I work with the Curatorial and Collections team in the following ways: - Exhibition research and framework development - Image, object and multimedia list management - Publication development (including ISBN registration, content, layout, proofing) - Copyright and licensing negotiation - Multimedia content development - Proofing of text - Object handling and assistance with exhibition install/demount - Liaising with external artist and curators","description_html":"As Assistant Curator, I work with the Curatorial and Collections team in the following ways:<br>- Exhibition research and framework development<br>- Image, object and multimedia list management<br>- Publication development (including ISBN registration, content, layout, proofing)<br>- Copyright and licensing negotiation<br>- Multimedia content development<br>- Proofing of text<br>- Object handling and assistance with exhibition install/demount<br>- Liaising with external artist and curators","duration":"1 year 9 months","start_date":"2013-11-01","end_date":"2015-07-01","linkedin_company_url":"http://www.linkedin.com/company/2891459?trk=ppro_cprof","url":"http://www.museumofbrisbane.com.au","website":"http://www.museumofbrisbane.com.au","industry":"Museums and Institutions","type":"Nonprofit","headquarters":"Level 3, Brisbane City Hall\nKing George Square\nBrisbane,\nQLD\n4000\nAustralia","company_size":"11-50 employees","founded":"2003","address":"Level 3, Brisbane City Hall King George Square Brisbane, QLD 4000 Australia"},{"title":"Delegate","company":"Museums Australia National Conference 2014","duration":"1 month","start_date":"2014-05-01","end_date":"2014-05-01","linkedin_company_url":"http://www.linkedin.com/"},{"title":"Curatorial and Collections Assistant","company":"Museum of Brisbane","duration":"1 year 8 months","start_date":"2012-04-01","end_date":"2013-11-01","linkedin_company_url":"http://www.linkedin.com/company/2891459?trk=ppro_cprof","url":"http://www.museumofbrisbane.com.au","website":"http://www.museumofbrisbane.com.au","industry":"Museums and Institutions","type":"Nonprofit","headquarters":"Level 3, Brisbane City Hall\nKing George Square\nBrisbane,\nQLD\n4000\nAustralia","company_size":"11-50 employees","founded":"2003","address":"Level 3, Brisbane City Hall King George Square Brisbane, QLD 4000 Australia"},{"title":"Receptionist","company":"Kenmore Clinics","duration":"3 years 1 month","start_date":"2009-04-01","end_date":"2012-04-03","linkedin_company_url":"http://www.linkedin.com/"},{"title":"Visitor Services Officer","company":"The Edge","duration":"3 months","start_date":"2012-01-01","end_date":"2012-03-03","linkedin_company_url":"http://www.linkedin.com/"},{"title":"Composer and Founding Member","company":"Untitled | Collective","duration":"4 years","start_date":"2008-01-01","end_date":null,"linkedin_company_url":"http://www.linkedin.com/"},{"title":"Intern in Cultures and Histories Department","company":"Queensland Museum","description":"Internship with Cultures and Histories working on the new Discovery Centre. I curated cases titled 'Making Do' and 'When I Grow Up'","description_html":"Internship with Cultures and Histories working on the new Discovery Centre. <br>I curated cases titled 'Making Do' and 'When I Grow Up'","duration":"3 months","start_date":"2011-07-01","end_date":"2011-09-03","linkedin_company_url":"http://www.linkedin.com/company/3210493?trk=ppro_cprof","url":"http://www.qm.qld.gov.au","website":"http://www.qm.qld.gov.au","industry":"Museums and Institutions","type":"Government Agency","headquarters":"Corner Grey St & Melbourne St\n\nSouth Brisbane,\nQueensland\n4101\nAustralia","company_size":"201-500 employees","address":"Corner Grey St & Melbourne St  South Brisbane, Queensland 4101 Australia"},{"title":"Heart Art Show 2011 Curator (volunteer)","company":"Variety Queensland","duration":"2 months","start_date":"2011-05-01","end_date":"2011-06-02","linkedin_company_url":"http://www.linkedin.com/company/1353381?trk=ppro_cprof","url":"http://www.variety.org.au/qld","website":"http://www.variety.org.au/qld","industry":"Nonprofit Organization Management","type":"Nonprofit","company_size":"51-200 employees"}],"current_companies":[],"recommended_visitors":[{"link":"https://www.linkedin.com/pub/sarah-dunn/98/755/343?trk=pub-pbmap","name":"Sarah Dunn","title":"Visitor Experience Coordinator","company":"Museum of Brisbane"},{"link":"https://www.linkedin.com/pub/peter-denham/64/25/825?trk=pub-pbmap","name":"Peter Denham","title":"Director","company":"Museum of Brisbane"},{"link":"https://www.linkedin.com/pub/carmen-burton/90/896/616?trk=pub-pbmap","name":"Carmen Burton","title":"Assistant Curator, Queensland Stories","company":"Queensland Museum Network"},{"link":"https://www.linkedin.com/pub/brooke-white/92/718/719?trk=pub-pbmap","name":"Brooke White","title":"Public Programs Assistant","company":"Queensland University of Technology"},{"link":"https://www.linkedin.com/pub/andrew-tynan/39/132/75a?trk=pub-pbmap","name":"Andrew Tynan","title":"Development Manager","company":"Museum of Brisbane"},{"link":"https://www.linkedin.com/pub/leigh-zeman/7a/a70/568?trk=pub-pbmap","name":"Leigh Zeman","title":"Currently seeking employment in Melbourne","company":null},{"link":"https://www.linkedin.com/pub/tracy-ryan/58/ab5/799?trk=pub-pbmap","name":"Tracy Ryan","title":"Curator","company":"Qld Museum"},{"link":"https://www.linkedin.com/pub/megan-williams/13/747/78a?trk=pub-pbmap","name":"Megan Williams","title":"Curator (Public Programs)","company":"QUT Art Museum"},{"link":"https://www.linkedin.com/pub/hoda-alzubaidi/62/700/a30?trk=pub-pbmap","name":"Hoda Alzubaidi","title":"Nil","company":"Flight Centre"},{"link":"https://www.linkedin.com/pub/simon-wright/1/694/2?trk=pub-pbmap","name":"Simon Wright","title":null,"company":null}]};

  var resizeDocument = function () {
    if ( $(window).width() > 700 ) {
      $('.preview .wrapper').css( 'transform', 'scale(' + ($(window).width() - $(".form").width()) / 950 + ')' );
    } else {
      $('.preview .wrapper').css( 'transform', 'scale(' + $(window).width() / 865 + ')' );
    }

    $('.resume.preview').height( $('.preview .wrapper').height() );
  }

  $timeout(function() {
    resizeDocument();

    $(window).resize(function() {
      resizeDocument();
    });
  });

  $scope.resume.websites.unshift({ name: "LinkedIn", link: $scope.resume.linkedin_url });

  $scope.pictureHidden = true;

  $scope.workTitle = "Work";
  $scope.educationTitle = "Education";
  $scope.volunteeringTitle = "Volunteering";
  $scope.skillsTitle = "Skills";

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

  $scope.addWebsite = function() {
    $scope.resume.websites.push({ name: '', link: '' });
  }

  $scope.removeWebsite = function(item) {
    var index = $scope.resume.websites.indexOf(item);
    $scope.resume.websites.splice(index, 1);
  }

  $scope.prepareAndSubmitForm = function (e) {
    e.preventDefault();

    var $form = $(e.target),
        $wrapper = $('.wrapper').clone();

    $wrapper.find('.editable-empty').remove();
    $wrapper.find('.hidden').remove();
    $wrapper.find('form, button, input').remove();

    $wrapper.addClass('render');

    $form.find('input[name="html"]').val( $wrapper.html() );
    $form.submit();
  }

});

