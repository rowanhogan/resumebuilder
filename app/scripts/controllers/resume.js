
angular.module('clientApp')
  .controller('ResumeCtrl', function($scope, $rootScope, $state, preloaded, $timeout) {
    $rootScope.flash = null;

    if (preloaded.status === 400) {
      $rootScope.flash = preloaded.data.message;
      $state.go('username');
      return false
    }

    $scope.resume = preloaded.data;

    var removeItemFromArray = function removeItemFromArray (item, array) {
      var index = array.indexOf(item);
      array.splice(index, 1);
    }

    var resizeDocument = function () {
      if ( $(window).width() > 700 ) {
        $('.preview .wrapper').css( 'transform', 'scale(' + ($(window).width() - $(".form").width()) / 950 + ')' );
      } else {
        $('.preview .wrapper').css( 'transform', 'scale(' + $(window).width() / 865 + ')' );
      }

      $('.preview').height( $('.preview .wrapper')[0].getBoundingClientRect().height )
    }

    $timeout(function() {
      resizeDocument();
      $('.wrapper').append('<link rel="stylesheet" type="text/css" href="http://rowanhogan.github.io/resumebuilder/css/fonts.css">');

      $(window).resize(function() {
        resizeDocument();
      });
    });

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
    $scope.positions = $scope.resume.current_companies.concat($scope.resume.past_companies);

    angular.extend($scope, {
      pictureHidden: false,
      workTitle: "Work",
      educationTitle: "Education",
      volunteeringTitle: "Volunteering",
      skillsTitle: "Skills",
      recommendationsTitle: "Recommendations",
      publicationsTitle: "Publications",
      interestsTitle: "Interests",
      languagesTitle: "Languages"
    });

    angular.extend($scope, {
      toggle: function (key) {
        $scope[key] = !$scope[key];
      },
      booleanLabel: function (key) {
        return ($scope[key] == true ? 'Show' : 'Hide');
      },
      addWebsite: function () {
        $scope.resume.websites.push({ name: '', link: '' });
      },
      removeWebsite: function (item) {
        removeItemFromArray(item, $scope.resume.websites);
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
            $wrapper = $('.wrapper').clone(),
            pdf_css_url = "http://resumebuilder.rowanhogan.com/css/pdf.css";

        $wrapper.find('.editable-empty, .hidden, form, button, input').remove();
        $wrapper.find('.resume').addClass('render');
        $wrapper.find('#pdf-css').attr('href', pdf_css_url)

        $form.find('input[name="html"]').val( $wrapper.html() );
        $form.submit();
      }
    });

  });
