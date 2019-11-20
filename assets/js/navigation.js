// page piling navigation module
let ppNavigation = (function() {
    'use strict';

    // move to next section
    function nextSection(){
      $.fn.pagepiling.moveSectionDown();
    }

    // move to previous section
    function prevSection(){
      $.fn.pagepiling.moveSectionUp();
    }

    // public methods 
    return {
        nextSection: nextSection,
        prevSection: prevSection
    };
}());
// page piling navigation module ends
