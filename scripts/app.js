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

  // if (preloaded.status === 400) {
  //   $rootScope.flash = preloaded.data.message;
  //   $state.go('username');
  //   return false
  // }

  // $scope.resume = preloaded.data;

  $scope.resume = {"name":"Rowan Hogan","first_name":"Rowan","last_name":"Hogan","title":"Web Designer / Developer","location":"Canada","country":"Canada","industry":"Design","summary":"Hi, I'm Rowan.I'm a web designer & developer from Brisbane, Australia, currently living in Canada.","picture":"https://media.licdn.com/mpr/mpr/shrinknp_400_400/AAEAAQAAAAAAAANKAAAAJGFmNGNkNjg4LWJlNmUtNDBiOC1iZGU4LTcyMWNiMTU0MGU4Mw.jpg","linkedin_url":"http://www.linkedin.com/in/rowanhogan","education":[{"name":"QUT","description":"Bachelor of Creative Industries, Communication/Interaction Design","degree":"Bachelor of Creative Industries","major":"Communication/Interaction Design","period":"2008 – 2010","start_date":"2008","end_date":"2010"}],"volunteering":[{"title":"Web design & development, project management","name":"Random Hacks of Kindness","description":"As a part of RHoK Brisbane (http://rhokbrisbane.org/) since it's first hack in 2013, I have attended and help coordinate all of the (3 as of writing) events. I have worked directly with QLD Kids, Karuna & Resonate amongst others on humanitarian projects.","period":"September 2013 - Present (2 years)","start_date":"September 2013","end_date":"Present (2 years)"}],"recommendations":["Rowan leaving to Canada is the worst loss we've had in 8 years of building software. A solid design talent, frontend dev (all the js frameworks), and now backend too - he's quite simply the greatest asset we've ever had .\nIt is a shame he's such a natural designer and developer because he's as valuable as a client and project manager. Rowan ended up running all of our largest and most valuable client projects, and leading and gaining the respect of the rest of team for his consistent and professional approach to just getting it done, and getting it done really well.\nIf I were Mapbox or Mozilla (or anyone else who cares about design, quality code and great people) ... i'd try to hire Rowan today.","I can't recommend Rowan highly enough. He is one of the most talented designers/front-end developers I've worked with. He's also a customer-focused individual who can talk to a non-technical (and not particularly creative) person like me to bring the ideas in my head to life! I have always found him to be professional, diligent (great follow-through) and friendly."],"websites":[{"name":"Personal Website","link":"http://rowanhogan.com"},{"name":"Github","link":"https://github.com/rowanhogan"},{"name":"Dribbble","link":"http://dribbble.com/rowanhogan"}],"groups":[{"name":"Front-End Engineers","link":"http://www.linkedin.comhttp://www.linkedin.com/groups?gid=943367&goback=%2Enppvan_rowanhogan&trk=fulpro_grplogo"},{"name":"Ruby on Rails","link":"http://www.linkedin.comhttp://www.linkedin.com/groups?gid=22413&goback=%2Enppvan_rowanhogan&trk=fulpro_grplogo"},{"name":"Interface Design GUI UI UX IA","link":"http://www.linkedin.comhttp://www.linkedin.com/groups?gid=75834&goback=%2Enppvan_rowanhogan&trk=fulpro_grplogo"},{"name":"Front End Developers","link":"http://www.linkedin.comhttp://www.linkedin.com/groups?gid=3124573&goback=%2Enppvan_rowanhogan&trk=fulpro_grplogo"}],"languages":[{"language":"English","proficiency":"Native or bilingual proficiency"},{"language":"Japanese","proficiency":"Elementary proficiency"}],"skills":["Front-end","User Interface Design","SASS","JavaScript","Ruby on Rails","HTML 5","HAML","CoffeeScript","Web Development","Web Applications","jQuery","Git","User Experience Design","Web Design","Ruby","CSS3","Cross-browser...","AngularJS","Mobile Design","Web Standards","Scrum","Agile Methodologies","Project Management","Typography","Web Typography","Mac OS X","Logo Design","Graphic Design","Animation","User Experience","HTML5","CSS"],"certifications":[],"organizations":[{"name":"RHoK Brisbane","start_date":"2013-09-01","end_date":null}],"past_companies":[{"title":"Lead Designer","company":"NetEngine","description":"Key Responsibilities - User Experience & User Interface Design - Front-end web development - Project & client management - Project planning & estimation - Ruby on Rails development Technologies: - Scalable and organised CSS with Sass / Stylus - AngularJS, Gulp / Grunt, Node, Meteor - Ruby on Rails, Middleman - HAML, Handlebars / Mustache, Coffeescript - Git, Bash, Adobe Creative Suite","description_html":"Key Responsibilities<br>- User Experience & User Interface Design<br>- Front-end web development<br>- Project & client management<br>- Project planning & estimation<br>- Ruby on Rails development<br><br>Technologies:<br>- Scalable and organised CSS with Sass / Stylus<br>- AngularJS, Gulp / Grunt, Node, Meteor<br>- Ruby on Rails, Middleman<br>- HAML, Handlebars / Mustache, Coffeescript<br>- Git, Bash, Adobe Creative Suite","duration":"4 years 2 months","start_date":"2011-06-01","end_date":"2015-07-04","linkedin_company_url":"http://www.linkedin.com/company/1518358?trk=ppro_cprof","url":"http://www.netengine.com.au","website":"http://www.netengine.com.au","industry":"Internet","type":"Privately Held","headquarters":"7 Prospect Street\n\nFortitude Valley,\nQueensland\n4006\nAustralia","company_size":"11-50 employees","founded":"2007","address":"7 Prospect Street  Fortitude Valley, Queensland 4006 Australia"},{"title":"Web Designer & Developer","company":"biscuit Magazine","description":"- Web & magazine layout design - Identity design - Web development and system administration","description_html":"- Web & magazine layout design<br>- Identity design<br>- Web development and system administration","duration":"2 years 1 month","start_date":"2010-10-01","end_date":"2012-10-02","linkedin_company_url":"http://www.linkedin.com/company/2891524?trk=ppro_cprof","url":"http://www.biscuitmagazine.com.au","website":"http://www.biscuitmagazine.com.au","industry":"Online Media","type":"Public Company","company_size":"1-10 employees","founded":"2010"},{"title":"Web Designer","company":"Tetrametric Creative","description":"Freelance work (Traded as Rowan Hogan). Clients included: - Solar Party Shop: Identity redesign, business cards, website improvements and photography - Skin Cancer College of Australia and New Zealand (SCCANZ): Website design & development. Document formatting. - All Podiatry & The Shoe Co: HTML EDM template design and development.","description_html":"Freelance work (Traded as Rowan Hogan).<br><br>Clients included:<br><br>- Solar Party Shop: Identity redesign, business cards, website improvements and photography<br>- Skin Cancer College of Australia and New Zealand (SCCANZ): Website design & development. Document formatting.<br>- All Podiatry & The Shoe Co: HTML EDM template design and development.","duration":"1 year 6 months","start_date":"2010-01-01","end_date":"2011-06-01","linkedin_company_url":"http://www.linkedin.com/"}],"current_companies":[],"recommended_visitors":[{"link":"https://www.linkedin.com/pub/ricardo-bernardeli/9/4b6/304?trk=pub-pbmap","name":"Ricardo Bernardeli","title":"Senior Software Engineer","company":"everydayhero"},{"link":"https://www.linkedin.com/pub/brad-parker/56/884/404?trk=pub-pbmap","name":"Brad Parker","title":"Designer / Front-end Developer","company":"NetEngine"},{"link":"https://www.linkedin.com/pub/bruce-stronge/3/438/16b?trk=pub-pbmap","name":"Bruce Stronge","title":"Founder and CEO - NetEngine","company":null},{"link":"https://www.linkedin.com/pub/olivier-pichon/11/867/665?trk=pub-pbmap","name":"Olivier Pichon","title":"Software Engineer","company":"NetEngine"},{"link":"https://www.linkedin.com/pub/elyssa-joi-villanda-palasi/53/472/149?trk=pub-pbmap","name":"Elyssa Joi Villanda Palasi","title":"Designer / Frontend Developer","company":"NetEngine"},{"link":"https://www.linkedin.com/pub/lucas-caton/14/337/147?trk=pub-pbmap","name":"Lucas Caton","title":"Software Engineer","company":"NetEngine"},{"link":"https://www.linkedin.com/pub/erik-t-ecoologic/22/470/5a?trk=pub-pbmap","name":"Erik T. Ecoologic","title":"Ruby on Rails WebApp Developer","company":"NetEngine"},{"link":"https://www.linkedin.com/pub/felix-lee/a1/393/484?trk=pub-pbmap","name":"Felix Lee","title":"Front-End Developer","company":"NetEngine"},{"link":"https://www.linkedin.com/pub/matthew-barram/8/b35/141?trk=pub-pbmap","name":"Matthew Barram","title":"Project Manager & Developer","company":"NetEngine"},{"link":"https://www.linkedin.com/pub/zhifan-cheng/93/b03/139?trk=pub-pbmap","name":"Zhifan Cheng","title":"Web Designer/Developer","company":"Innovare Group"}]};

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
    $('.wrapper').append('<link rel="stylesheet" type="text/css" href="http://rowanhogan.github.io/resumebuilder/fonts.css">');

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

  $scope.prepareAndSubmitForm = function (e) {
    e.preventDefault();

    var $form = $(e.target),
        $wrapper = $('.wrapper').clone();

    $wrapper.find('.editable-empty').remove();
    $wrapper.find('.hidden').remove();
    $wrapper.find('form, button, input').remove();
    $wrapper.find('#pdf-css').attr('href', pdf_css_url)
    $wrapper.addClass('render');

    $form.find('input[name="html"]').val( $wrapper.html() );
    $form.submit();
  }
});
