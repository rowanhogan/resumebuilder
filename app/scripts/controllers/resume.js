
angular.module('clientApp')
  .controller('ResumeCtrl', function($scope, $rootScope, $state, preloaded, $timeout) {
    $rootScope.flash = null;

    if (preloaded.status === 400) {
      $rootScope.flash = preloaded.data.message;
      $state.go('username');
      return false
    }

    $scope.resume = preloaded.data;

    if ($scope.resume.name) {
      $('title').text($scope.resume.name + ' | Resume Builder');
    }

    var resizeDocument = function () {
      if ( $(window).width() > 700 ) {
        $('.preview .wrapper').css( 'transform', 'scale(' + ($(window).width() - $(".form").width()) / 950 + ')' );
      } else {
        $('.preview .wrapper').css( 'transform', 'scale(' + $(window).width() / 862.5 + ')' );
      }

      $('.preview').height( $('.preview .wrapper')[0].getBoundingClientRect().height )
    }

    $timeout(function() {
      resizeDocument();

      $(window).resize(function() {
        resizeDocument();
      });
    });

    $timeout(function() {
      $('.wrapper').append('<link rel="stylesheet" type="text/css" href="http://rowanhogan.github.io/resumebuilder/css/fonts.css">');
    }, 1500);

    $scope.pictureHidden = false;

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

    $scope.resume.websites.unshift({ name: "LinkedIn", link: $scope.resume.linkedin_url });

    if ($scope.resume.current_companies.length) {
      $.map($scope.resume.current_companies, function(job) {
        $.extend(job, { 'is_current': true });
      });
    }

    $scope.resume.work = $scope.resume.current_companies.concat($scope.resume.past_companies);

    // PLEASE NOTE: Metaprogramming ensues!

    var sections = ['websites', 'work', 'education', 'volunteering', 'recommendations', 'publications', 'skills', 'interests', 'languages'];

    var removeItemFromArray = function removeItemFromArray (item, array) {
      var index = array.indexOf(item);
      array.splice(index, 1);
    }

    $.each(sections, function (i, arrayName) {
      var capitalizedName = arrayName[0].toUpperCase() + arrayName.substring(1);

      $scope[arrayName + "Title"] = capitalizedName;

      $scope["addTo" + capitalizedName] = function () {
        $scope.resume[arrayName].push({});
      }

      $scope["removeFrom" + capitalizedName] = function (item) {
        removeItemFromArray(item, $scope.resume[arrayName]);
      };
    });

    // Override add function for non-objects

    $.each(['skills', 'interests'], function (i, arrayName) {
      var capitalizedName = arrayName[0].toUpperCase() + arrayName.substring(1);

      $scope["addTo" + capitalizedName] = function () {
        $scope.resume[arrayName].push('New ' + arrayName.substring(0, arrayName.length - 1));
      }
    });


    angular.extend($scope, {
      toggle: function (key) {
        $scope[key] = !$scope[key];
      },
      booleanLabel: function (key) {
        return ($scope[key] == true ? 'Show' : 'Hide');
      },
      togglePrintCss: function () {
        var $style = $('#theme-css');

        if ($scope.theme == '') {
          $style.html('@page { margin: 20mm 0 20mm 0; }');
        } else {
          $style.html('@page { margin: 0mm; }');
        }

        $timeout(function() {
          resizeDocument();
        });
      },
      prepareAndSubmitForm: function (event) {
        event.preventDefault();

        var $form = $(event.target),
            $wrapper = $('.wrapper').clone();

        $wrapper.find('.editable-empty, .hidden, form, button, input').remove();
        $wrapper.find('.resume').addClass('render');
        $wrapper.find('.resume').append('<link rel="stylesheet" type="text/css" href="http://rowanhogan.github.io/resumebuilder/css/pdf.css">');

        $form.find('input[name="html"]').val( $wrapper.html() );
        $form.submit();
      }
    });

  });
