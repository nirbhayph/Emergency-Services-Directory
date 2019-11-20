# Emergency-Services-Directory (Built with jQuery)

- This repository contains the project work for the ESD project for the Client Design and Development Class @ RIT - ISTE 754

- As this project consumes a RESTful API hosted on the IST department's simon server at RIT, the demo is only available to RIT students 

- The WADL is available at http://simon.ist.rit.edu:8080/Services/resources/application.wadl

- API Documentation is at http://serenity.ist.rit.edu/~dmgics/754/ESD/api_documentation.html

- A proxy is available at http://people.rit.edu/dmgics/754/23/proxy.php

- Serenity Link - http://serenity.ist.rit.edu/~np5318/ESD

## Plugins Used 
- Tabs, Accordion from JQuery UI (@jqueryui) - For showing detailed results
- Data Table from Spry Media (@datatables) - For showing search results and some detailed results
- Select2 (@select2) - For adding search functionality to selectors
- Page Piling (@pagepiling) - For making UI section wise and interactive
- JQV Maps (@jqvmaps) - For creating a custom data based usa state selector
- Textillate (@textillate) - For adding animation to header text
- jQuery Toast Plugin (@toast) - For warning and error messages
- Emoji Translate (@emojiTranslate) - For emoji translation of organization type selector
- Canvas JS (@canvasjs) - For plotting county wise distribution of organizations on results section

## For the Map 
- Leaflet JS (@leafletjs) - For plotting locations map in detailed results section 

## UI Library Used
- Bootstrap (@bootstrap)

## Custom jQuery Plugin 
- Built a plugin to filter elements in a container based on a text input. 
- Accepted options like case sensitivity, mark filtered, mark unfiltered, etc. 
- Used in the people tab section, applied on the accordion elements. 
- A detailed README.md file for the plugin can be found here - https://github.com/nirbhayph/jQuery-Search-Filter-Plugin and in the project directory.
- Sample plugin usage other than this project - https://nirbhay.me/jQuery-Search-Filter-Plugin/

## Additional Details 
- The project uses the module pattern 
- The project contains a module for validation for text and zip code inputs 
- The project contains a errors module to display errors and warnings interactively with toasts and gifs
- There's also a pie chart built using canvas js to find the county wise % distribution for a search result
- The constants js contains all the relevant paths, proxy url and the functions mapper for detailed results section.
- Browser Detection has been done for IE11 and less. 
- The project is launched from the run.js script. 
- search_form_contents.js manages the results section 
- details_content.js manages the detailed tabbed results section 

## License
This project is licensed under the MIT License - see the LICENSE.md file for details

## Developer:
- @nirbhayph - https://github.com/nirbhayph | https://linkedin.com/in/nirbhaypherwani

## Acknowledgements and Mentions:

- @jquery - https://jquery.com/
- @jqueryui - https://jqueryui.com/
- @datatables - https://datatables.net/
- @select2 - https://select2.org/
- @pagepiling - https://alvarotrigo.com/pagePiling/
- @jqvmaps - https://github.com/10bestdesign/jqvmap
- @textillate - https://textillate.js.org/
- @toast - https://kamranahmed.info/toast
- @emojiTranslate - https://github.com/notwaldorf/emoji-translate
- @canvasjs - https://canvasjs.com/
- @letteringjs - http://letteringjs.com/
- @animate CSS - https://daneden.github.io/animate.css/ 
- @cdnjs - https://cdnjs.com/
- @quirksmode - Browser Detection - http://www.quirksmode.org/js/detect.html
- @bootstrap - https://getbootstrap.com
- @leafletjs - https://leafletjs.com/
- @giphy - https://giphy.com/
- @googlefonts - https://fonts.googleapis.com
- @fontawesomeicons - https://fontawesome.com/
