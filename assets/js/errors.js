// error messages module
let errors = (function() {
     'use strict';

      // for results section error messages
      function displayErrorMessage(message, gif){
        $.fn.pagepiling.moveTo(7);
          $(".results").html(`<h3 class="loading-text"><i class="fa fa-cog fa-spin fa-fw"></i>
                    ${message}</h3>
                    <br/><img class="ritchie" src="${gif}">`);
      }

      // for detailed results section error messages
      function displayDetailsErrorMessage(message, gif){
        $.fn.pagepiling.moveTo(8);
          $(".detailed-results").html(`<h3 class="loading-text"><i class="fa fa-cog fa-spin fa-fw"></i>
                                      ${message}</h3>
                                      <br/><img class="ritchie" src="${gif}">`);
      }
  
      // data fetch error messages
      function fetchErrorMessage(message){
        $.toast({
          heading: 'Data Fetch Error',
          text: message,
          icon: 'error',
          showHideTransition : 'slide',
          hideAfter : 5000,
          position: 'top-right',
          loaderBg: '#ffffff'
        });
      }

      // detailed tab error messages along with toasts
      function tabErrorMessage(message, headingMessage, tabId){
          let gif = 'https://media.giphy.com/media/Zxzr2pp6qU64g/giphy.gif';
          $.fn.pagepiling.moveTo(8);
          $('#'+tabId).html(`<h3 class="tab-error-text"><i class="fa fa-cog fa-spin fa-fw"></i>
                      ${message}</h3>
                      <br/><img class="ritchie" src="${gif}">`);
          $.toast({
            heading: headingMessage,
            text: message,
            icon: 'warning',
            showHideTransition : 'slide',
            hideAfter : 2000,
            position: 'top-right',
            loaderBg: '#ffffff'
        });
      }

    // public methods
    return {
        displayErrorMessage: displayErrorMessage,
        fetchErrorMessage: fetchErrorMessage,
        displayDetailsErrorMessage: displayDetailsErrorMessage,
        tabErrorMessage: tabErrorMessage
    };
}());
// error messages module ends