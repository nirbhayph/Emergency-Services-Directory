// module for displaying the details of an organization
let details = (function() {
    'use strict';

    // mapper for function calls
    let action = {
      "TABS": showDetails,
      "GENERAL": generalData,
      "LOCATIONS": locationData,
      "TREATMENTS": treatmentData,
      "TRAINING": trainingData,
      "EQUIPMENT": equipmentData,
      "PEOPLE": peopleData,
      "PHYSICIANS": physiciansData,
      "FACILITIES": facilitiesData
    }

    // ajax call maker to get data
    // uses constants.js
    function getDetails(path, property, oid, contentId) {
      $.ajax({
        type: "GET",
        url: API_PROXY_URL,
        data: { path: path},
        dataType: "xml",
        success: function(data, status){
            // calls particular function using mapper
            if(property === "TABS"){
                action[property](data, oid);
            }
            else{
                action[property](data, contentId);
            }
        },
        error: function(){
          // to display error messages
          let errorMessage = "Error while trying to get details. <br/> Please try again later.";
          let errorGIF = "https://media.giphy.com/media/13CoXDiaCcCoyk/giphy.gif";
          errors.displayDetailsErrorMessage(errorMessage, errorGIF);
        }
      });
      if(property === "TABS"){
        // displays data fetching message until data received
        $.fn.pagepiling.moveTo(8);
        $('#tabLayout').html(`<h4 class="tab-loading-text"><i class="fa fa-circle-o-notch fa-spin fa-fw"></i> Fetching Data ... </h4>`);
      }
    }

    // returns the path to be called to access the data from the api
    // acts as a helper to do the same
    function makePath(path, target){
        return '/'+target+path;
    }

    // display data in a tab format
    // iterates through the data to create the tabbed format
    // adds the onclick listener for each tab
    // triggers the general data retrieval click
    function showDetails(data, oid){
        if($(data).find("error").length!==0){
          // to display the error messages
          let errorMessage = "Error while trying to get more details. <br/> Please try again later.";
          let errorGIF = "https://media.giphy.com/media/13CoXDiaCcCoyk/giphy.gif";
          errors.displayDetailsErrorMessage(errorMessage, errorGIF);
        }
        else{
            if($(data).find("data").children().length>0){
                $('#tabLayout').html('');
                let counter = 1;
                let classHave = 'first-tab-ele';
                let tabs = '<div id="tabs">';
                let ulItems = '<ul>';
                let contentItems = '';

                //iterates over data to create the tabbed format
                $("row", data).each(function(){
                    if(counter !== 1){
                        classHave = "";
                    }
                    ulItems += '<li><a id="'+(counter)+'" class="tab-ele '+classHave+'" href="#tabs-'+(counter)+'">'+$("Tab", this).text()+'</a></li>';
                    contentItems += '<div id="tabs-'+(counter++)+'"></div>';
                });

                ulItems += '</ul>';
                tabs += ulItems + contentItems +'</div>';

                $("#tabLayout").html(tabs);

                // create tabs
                $( "#tabs" ).tabs();

                // on click listener for each tab created
                $('.tab-ele').click(function(){
                  let attr = $("a[href='#tabs-"+this.id+"']").attr('data-present');
                  if (typeof attr === typeof undefined || attr === false) {
                    let contentId = this.id;
                    let tabText = $(this).text();
                    // display loading message until information fetched
                    $('#tabs-'+contentId).html(`<h4 class="tab-loading-text"><i class="fa fa-circle-o-notch fa-spin fa-fw"></i> Fetching Data ... </h4>`);

                    // uses constants.js
                    // calls getdetails to fetch the data for the tab
                    getDetails(
                      makePath(tabConstantsMapper[tabText][0], oid),
                      tabConstantsMapper[tabText][1],
                      oid,
                      contentId);
                  }
                });

                // once data loaded move to tabbed results section
                $.fn.pagepiling.moveTo(8);

                // triggers first tab's click automatically
                $('.first-tab-ele').trigger('click');
            }
            else{
              // to display the error messages
              let errorMessage = "Unable to fetch any details. Invalid id or nothing was provided!";
              let errorGIF = "https://media.giphy.com/media/13CoXDiaCcCoyk/giphy.gif";
              errors.displayDetailsErrorMessage(errorMessage, errorGIF);
            }
        }
    }

    // for displaying the general tab data
    // sets 'data-present' attribute to 'true'
    // to not allow requesting same data resource again
    function generalData(data, counter){
      if($(data).find('data').children().length>0){
        // creates general data's table to display in the tab
        let content = '<table class="generalTable">';

        //iterates over data items
        $(data).find('data').children().each(function(){
            content += `<tr>
                        <td class="tagName">${this.tagName}</td>
                        <td class="tagValue">${$(this).text()}</td>
                        </tr>`;
        });
        content += `</table>`;
        $('#tabs-'+counter).html(content);
        window.scrollTo(0, document.body.scrollHeight);
      }
      else{
        // handling no data found
        errors.tabErrorMessage("No data found for the General Section!", "General Tab", 'tabs-'+counter);
      }
      // set data-present attribute to true
      $("a[href='#tabs-"+counter+"']").attr("data-present", "true");
    }

    // for displaying the equipment tab data
    // sets 'data-present' attribute to 'true'
    // to not allow requesting same data resource again
    function equipmentData(data, counter){
      if($(data).find('data').find('count').text() > 0){
        // creates equipment data's table to display in the tab
        let content = '<table class="generalTable">';
        let iCounter = 1;

        //iterates over data items
        $(data).find('data').children().each(function(){
            if(this.tagName === "equipment"){
                content += `<tr>
                            <td class="tagName sep">Equipment No</td>
                            <td class="tagValue sep">${iCounter++}</td>
                            </tr>`;
                $(this).children().each(function(){
                    content += `<tr>
                    <td class="tagName">${this.tagName}</td>
                    <td class="tagValue">${$(this).text()}</td>
                    </tr>`;
                });
            }
        });
        content += `</table>`;
        $('#tabs-'+counter).html(content);
        window.scrollTo(0, document.body.scrollHeight);
      }
      else{
        // handling no data found
        errors.tabErrorMessage("No data found for the Equipment Section!", "Equipment Tab", 'tabs-'+counter);
      }
      // set data-present attribute to true
      $("a[href='#tabs-"+counter+"']").attr("data-present", "true");
    }

    // for displaying the location tab's
    // single / multiple data values using a selector
    // sets 'data-present' attribute to 'true'
    // to not allow requesting same data resource again
    // creates leaflet map if location present in the data
    // display error message if not
    function locationData(data, counter){
      if($(data).find('data').find('count').text() > 0){
        // location data selector
        let content = '<select id="locationSelector" class="form-control form-control-lg form-input-app">';
        let firstLocationSelected = '', firstLat='', firstLng='';
        let iCounter = 1;
        // iterates over the data
        $(data).find('data').children().each(function(){
            if(this.tagName === "location"){
                // displays information using a table
                let displayContent = `<table class="generalTable">`;
                content += `<option id="${iCounter}-option" value="">Location - ${$("type", this).text()}</option>`;
                $(this).children().each(function(){
                    displayContent += `<tr>
                    <td class="tagName">${this.tagName}</td>
                    <td class="tagValue">${$(this).text()}</td>
                    </tr>`;
                });
                displayContent += '</table>';
                if(iCounter === 1){
                    firstLocationSelected = displayContent;
                    firstLat = $("latitude", this).text();
                    firstLng = $("longitude", this).text();
                }
                // uses session storage to store the locations for each selector option
                sessionStorage.setItem(`${iCounter}-option-latitude`, $("latitude", this).text());
                sessionStorage.setItem(`${iCounter}-option-longitude`, $("longitude", this).text());
                sessionStorage.setItem(`${iCounter++}-option`, displayContent);
            }
        });
        content += `</select>`;
        // creates a simple bootstrap grid format for the selected item
        content += `<div class="container"> <div class="row" id="locationsDisplay">
                        <div class="col-sm-3" id="locationsContentDisplay">
                            ${firstLocationSelected}
                        </div>
                        <div class="col-sm-1"></div>
                        <div class="col-sm-6" id="locationsMapDisplay">
                        </div>
                    </div> </div>`;
        $('#tabs-'+counter).html(content);

        // uses map.js to make the map
        leafletMapIt.makeMap("locationsMapDisplay", firstLat, firstLng, "The Location!");

        window.scrollTo(0, document.body.scrollHeight);

        // on change listener for viewing another location in the selector
        // uses the session stored location to build the map
        // uses map.js
        $("#locationSelector").on("change", function(){
            let storageKey = $('#locationSelector option:selected').attr("id");
            $('#locationsContentDisplay').html(sessionStorage.getItem(storageKey));
            leafletMapIt.makeMap("locationsMapDisplay",
                sessionStorage.getItem(storageKey+'-latitude'),
                sessionStorage.getItem(storageKey+'-longitude'),
                "The Location!");
            window.scrollTo(0, document.body.scrollHeight);
        });
      }
      else{
        // to display no data found
        errors.tabErrorMessage("No data found for the Location Section!", "Location Tab", 'tabs-'+counter);
      }
      // set data-present attribute to true
      $("a[href='#tabs-"+counter+"']").attr("data-present", "true");
    }

    // for displaying the training tab data
    // sets 'data-present' attribute to 'true'
    // to not allow requesting same data resource again
    // creates a datatable out of the added data to the DOM
    function trainingData(data, counter){
      if($(data).find('data').find('count').text() > 0){
        let dataTable = `<table id="trainingDataTable" class="display" style="width:100%">
                  <thead>
                    <tr>
                      <th>Type Id</th>
                      <th>Type</th>
                      <th>Abbreviation</th>
                    </tr>
                  </thead><tbody>`;
        // iterates over the data
        $("training", data).each(function(){
          dataTable+= `<tr>
                  <td>${$(this).find("typeId").text()}</td>
                  <td>${$(this).find("type").text()}</td>
                  <td>${$("abbreviation", this).text()}</td>
                </tr>`;
          });

          dataTable+=`</tbody></table>`;
          $('#tabs-'+counter).html(dataTable);

          // creates the datatable
          $('#trainingDataTable').DataTable();
      }
      else{
        // to display no data found
        errors.tabErrorMessage("No data found for the Training Section!", "Training Tab", 'tabs-'+counter);
      }
      // set data-present attribute to true
      $("a[href='#tabs-"+counter+"']").attr("data-present", "true");
    }

    // for displaying the facilities tab data
    // sets 'data-present' attribute to 'true'
    // to not allow requesting same data resource again
    // creates a datatable out of the added data to the DOM
    function facilitiesData(data, counter){
      if($(data).find('data').find('count').text() > 0){
          let dataTable = `<table id="facilitiesDataTable" class="display" style="width:100%">
                    <thead>
                      <tr>
                        <th>Type Id</th>
                        <th>Type</th>
                        <th>Quantity</th>
                        <th>Description</th>
                      </tr>
                    </thead><tbody>`;

          // iterates over the data
          $("facility", data).each(function(){
            dataTable+= `<tr>
                    <td>${$(this).find("typeId").text()}</td>
                    <td>${$(this).find("type").text()}</td>
                    <td>${$("quantity", this).text()}</td>
                    <td>${$("description", this).text()}</td>
                  </tr>`;
            });

            dataTable+=`</tbody></table>`;
            $('#tabs-'+counter).html(dataTable);

            // creates data table
            $('#facilitiesDataTable').DataTable();
      }
      else{
        // to display no data found
        errors.tabErrorMessage("No data found for the Facilities Section!", "Facilities Tab", 'tabs-'+counter);
      }
      // set data-present attribute to true
      $("a[href='#tabs-"+counter+"']").attr("data-present", "true");
    }

    // for displaying the treatments tab data
    // sets 'data-present' attribute to 'true'
    // to not allow requesting same data resource again
    // creates a datatable out of the added data to the DOM
    function treatmentData(data, counter){
      if($(data).find('data').find('count').text() > 0){
        let dataTable = `<table id="treatmentDataTable" class="display" style="width:100%">
                  <thead>
                    <tr>
                      <th>Type Id</th>
                      <th>Type</th>
                      <th>Abbreviation</th>
                    </tr>
                  </thead><tbody>`;

        // iterates over the data
        $("treatment", data).each(function(){
          dataTable+= `<tr>
                  <td>${$(this).find("typeId").text()}</td>
                  <td>${$(this).find("type").text()}</td>
                  <td>${$("abbreviation", this).text()}</td>
                </tr>`;
          });

          dataTable+=`</tbody></table>`;
          $('#tabs-'+counter).html(dataTable);

          // creates data table
          $('#treatmentDataTable').DataTable();
      }
      else{
        // to display no data found
        errors.tabErrorMessage("No data found for the Treatment Section!", "Treatment Tab", 'tabs-'+counter);
      }
      // set data-present attribute to true
      $("a[href='#tabs-"+counter+"']").attr("data-present", "true");
    }

    // for displaying the physician tab data
    // sets 'data-present' attribute to 'true'
    // to not allow requesting same data resource again
    // creates a datatable out of the added data to the DOM
    function physiciansData(data, counter){
      if($(data).find('data').find('count').text() > 0){
        let dataTable = `<table id="physicianDataTable" class="display" style="width:100%">
                  <thead>
                    <tr>
                      <th>Person Id</th>
                      <th>First Name</th>
                      <th>Middle Name</th>
                      <th>Last Name</th>
                      <th>Suffix</th>
                      <th>Phone Number</th>
                      <th>License</th>
                    </tr>
                  </thead><tbody>`;

        // iterates over the data
        $("physician", data).each(function(){
          dataTable+= `<tr>
                  <td>${$(this).find("personId").text()}</td>
                  <td>${$(this).find("fName").text()}</td>
                  <td>${$("mName", this).text()}</td>
                  <td>${$("lName", this).text()}</td>
                  <td>${$("suffix", this).text()}</td>
                  <td>${$("phone", this).text()}</td>
                  <td>${$("license", this).text()}</td>
                </tr>`;
          });

          dataTable+=`</tbody></table>`;
          $('#tabs-'+counter).html(dataTable);

          // creates the data table
          $('#physicianDataTable').DataTable();
      }
      else{
        // to display no data found
        errors.tabErrorMessage("No data found for the Physicians Section!", "Physicians Tab", 'tabs-'+counter);
      }
      // set data-present attribute to true
      $("a[href='#tabs-"+counter+"']").attr("data-present", "true");
    }

    // for displaying the people tab data
    // sets 'data-present' attribute to 'true'
    // to not allow requesting same data resource again
    // creates an accordion after iterating over each address site
    function peopleData(data, counter){
      if($(data).find('data').find('siteCount').text() > 0){
        let accordion = `<br/><h6><label for="peopleSearch">Search Filter <i>(Scroll down if all results are not visible)</i></label></h6><input type="text" id="peopleSearch" class="form-control form-control-lg form-input-app" placeholder="Type a site name to filter..."/><br/> <div id="accordionPeople">`;

        //iterates over each site
        $("site", data).each(function(){
          accordion += `<h3>${$(this).attr("address")} - ${$(this).attr("siteType")}</h3>`;
          let accordionContent = '<div>';
          //iterates over each person
          $("person", this).each(function(){
            accordionContent += `<p><b>Person ID</b> - ${$(this).find("personId").text() || "NA"}</p>
                                <p><b>Honorific</b> - ${$(this).find("honorific").text() || "NA"}</p>
                                <p><b>First Name</b> - ${$(this).find("fName").text() || "NA"}</p>
                                <p><b>Middle Name</b> - ${$(this).find("mName").text() || "NA"}</p>
                                <p><b>Last Name</b> - ${$(this).find("lName").text() || "NA"}</p>
                                <p><b>Suffix</b> - ${$(this).find("suffix").text() || "NA"}</p>
                                <p><b>Role</b> - ${$(this).find("role").text() || "NA"}</p><hr/>`;
          });
          accordion += accordionContent + `</div>`;
        });

        accordion += `</div>`;
        $('#tabs-'+counter).html(accordion);

        // creates the accordion
        $( "#accordionPeople" ).accordion();
        $( ".ui-accordion-content-active").css("height", "100%");

        // adds a search filter on the accordion
        filterPeople();
    }
    else{
      // to display no data found
      errors.tabErrorMessage("No data found for the People Section!", "People Tab", 'tabs-'+counter);
    }
    // set data-present attribute to true
    $("a[href='#tabs-"+counter+"']").attr("data-present", "true");
  }

  // custom search filter plugin applied for people tab accordion
  function filterPeople(){
    // on typing anything filter's according to site text
    // toggles the display on the basis of the filter
    // (if search term found or not in the site name)
    // if true show's the accordion item
    // if false hides the accordion item
    $("#peopleSearch").filterElements({
			parentElementWrapper: "#accordionPeople",
			childElementToFilter: 'h3',
			caseInsensitive: true,
			controlNext: true // controls the display of text content after each h3 element in the accordion
    })
    .css("color", "#dc3545")
    .css("font-weight", "bold"); // to show chaining on the custom plugin call
  }

  // public methods
  return {
    getDetails: getDetails
  };
}());
// module for displaying the details of an organization ends
