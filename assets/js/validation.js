// validation module
// supports zip code and letters only validation
let validate = (function() {
    'use strict';

    //zip code validator (returns true for empty!)
    function validateZipCode(zipCode){
        //checks for nothing present
        if(zipCode === ""){
            return true;
        }
        else{
            // checks for valid USA zipcodes 
            if((/\d{5}-\d{4}$|^\d{5}$/).test(zipCode)){
                return true;
            }
            else{
                // display toast message on invalid entry
                $.toast({
                    heading: 'Invalid ZipCode Entry!',
                    text: "Please enter a valid zip code in the United States",
                    icon: 'error',
                    showHideTransition : 'slide',
                    hideAfter : 5000,
                    position: 'top-right',
                    loaderBg: '#ffffff'
                });
                return false;
            }
        }
    }

    // letters only validator (returns true for empty!)
    function validateTextInput(text){
        if(text === ""){
            // checks for nothing present 
            return true
        }
        else{
            // checks for letters only present or not
            if((/^[a-z]+$/i).test(text)){
                return true;
            }
            else{
                // displays toast message on invalid entry
                $.toast({
                    heading: 'Invalid Text Input Entry!',
                    text: "Only letters allowed. Please check the text input fields.",
                    position: 'top-right',
                    icon: 'error',
                    showHideTransition : 'slide',
                    hideAfter : 5000,
                    loaderBg: '#ffffff'
                });
                return false;
            }
        }
    }

    // public methods
    return {
        zip: validateZipCode,
        text: validateTextInput
    };
}());
// validation module ends