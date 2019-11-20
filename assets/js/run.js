// app initialization module
let app = (function() {
  'use strict';

  // for loading indicators, header and supporting text at the beginning
  function display(){
    //loading indicator
    $(".loading").css("display", "none");
    $(".page-content").css("display", "block");

    // textillate effect for header text 
    $('#badge-header-text').textillate({
        in: {
            effect: 'fadeInRightBig'
        }
    }).attr("class", "badge badge-danger");

    // textillate effect for supporting header text
    $('#header-supporting-text').textillate({
        in: {
            effect: 'fadeInRight'
        }
    });
  }

  // for page piling content
  function pagePileContent(){
    // init page piling
    $('#pagepiling').pagepiling({
      direction: 'vertical'
    });

    // init next button on sticky navigation
    $("#nextS").click(function(){
      ppNavigation.nextSection();
    });

    // init previous button on sticky navigation
    $("#prevS").click(function(){
      ppNavigation.prevSection();
    });
  }

  // form data, theme
  function form(){
    // setup organization type selector
    searchForm.setFormData(ORG_TYPES, "ORG_TYPES");
    
    //setup states selector 
    searchForm.setFormData(STATES, "STATES");

    // call select2 on orgTypes selector
    $('#orgTypes').select2({
      theme: 'bootstrap'
    });

    // call select2 on cities selector
    $('#cities').select2({
      theme: 'bootstrap'
    });
  }

  // search now init
  function displayResults(){
    // on clicking search now button
    $(".lets-search").click(function(){
        $(".results").html('');
        $("#tabLayout").html('<h1>Get to know more about a particular result!</h1>');
        searchForm.getResult(ORGANIZATIONS, "ORGANIZATIONS");
    });
  }

  function init(){
    form();
    pagePileContent();
    display();
    displayResults();
  }

  // public methods
  return {
      init: init
  };
}());
// app initialization module ends

// initialize app 
$(function(){
  app.init();
});
