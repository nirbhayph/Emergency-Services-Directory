// module for the search form and results requested on submitting the form
let searchForm = (function() {
    'use strict';

    // mapper for function calls
    let action = {
      "ORG_TYPES": setOrgTypes,
      "STATES": setStates,
      "CITIES": setCities,
      "ORGANIZATIONS": showResult
    }

    let stateSelected = "", //for custom usa map selector
        lastIdCalled = ""; //for keeping track of last clicked organization

    // ajax call maker to get data
    // uses constants.js
    function getData(path, property) {
      $.ajax({
        type: "GET",
        url: API_PROXY_URL,
        data: { path: path },
        dataType: "xml",
        success: function(data, status){
          // calls particular function using mapper
          action[property](data);
        },
        error: function(error){
          // to display error messages
          let errorMessage = "Error while trying to contact the data api. <br/> Please try again later.";
          let errorGIF = "https://media.giphy.com/media/aaj7b9xgt84eY/giphy.gif";
          errors.displayErrorMessage(errorMessage, errorGIF);
        }
      });
    }

    // sets form data on load for orgTypes, states
    function setFormData(path, property) {
      getData(path, property);
    }

    // validates user input
    // serializes user input data and gets results
    function getResult(path, property){
      let zipValidation = validate.zip($("#zips").val()),
          countyValidation = validate.text($("#countyName").val()),
          orgNameValidation = validate.text($("#organizationName").val());
      if (zipValidation && countyValidation && orgNameValidation){
            path += "?" + $("#searchForm").serialize();
            $.fn.pagepiling.moveTo(7);
            $(".results").html('<h3 class="loading-text"><i class="fa fa-circle-o-notch fa-spin fa-fw"></i> Fetching Data</h3>');
            getData(path, property);
      }
      else{
        // measures taken when there is a problem with validation
        $("#pieDisplayButton").css("display", "none");
        let errorMessage = "There seems to be a problem with your input(s). <br/>Please check and try again :)";
        let errorGIF = "https://media.giphy.com/media/OLpvCvKbnFUm4/giphy.gif";
        errors.displayErrorMessage(errorMessage, errorGIF);
      }
    }

    // uses emoji-translate-bundle.js
    // returns the emoji translation of keywords in text
    function getEmojiTranslation(text){
      let emojiTranslation = EmojiTranslate.translate(text, true);
      if(emojiTranslation === ''){
        emojiTranslation = EmojiTranslate.translate(DEFAULT_EMOJI_KEYWORD, true);
      }
      return emojiTranslation;
    }

    // sets the orgType selector with the data received
    // uses getEmojiTranslation for textual appearances
    function setOrgTypes(data){
      let options = "";
      if($(data).find("error").length!==0){
        // measures taken when there is a problem with data received
        let errorMessage = "Unable to fetch the organization types for you! Please try again later.";
        $("#orgTypes").html('<option value="">'+errorMessage+'</option>');
        errors.fetchErrorMessage(errorMessage);
      }
      else{
        options += "<option value=''>All Organization Types</option>";

        $("row", data).each(function(){

          options += "<option value='"
                      + $("type", this).text()
                      + "'>" + getEmojiTranslation($("type", this).text()) + "&nbsp;&nbsp;" + $("type", this).text()
                      +  "</option>";
        });

        $("#orgTypes").html(options);
      }
    }

    // creates array of state codes
    // passes it to createStateMap and resetStateMap
    // initiates the call to custom usa map state selector
    function setStates(data){
      let stateCodes = [];
      if($(data).find("error").length!==0){
        // measures taken when there is a problem with data received
        let errorMessage = "Unable to fetch the states data for you! Please try again later.";
        $("#states").html('<option value="">'+errorMessage+'</option>');
        errors.fetchErrorMessage(errorMessage);
      }
      else{
        $("row", data).each(function(){
          stateCodes.push($("State", this).text());
        });

        createStateMap(stateCodes);
        resetStatesMap(stateCodes);
      }
    }

    // called when a state is clicked on in the map
    // sets the cities selector with cities from that state
    function setCities(data){
      let cities = "";

      if($(data).find("error").length!==0){
        // measures taken when there is a problem with data received
        let message = "Unable to fetch the cities data for you! Please try again later.";
        $("#cities").html('<option value="">'+message+'</option>');
        errors.fetchErrorMessage(message);
      }
      else{
        cities += "<option value=''>Select a City</option>";

        $("row", data).each(function(){
          cities += "<option value='"
                      + $("city", this).text()
                      + "'>" +  $("city", this).text()
                      +  "</option>";
        });

        $("#cities").html(cities);
      }
    }

    // displays resulting data in a datatable format
    // also uses pie_chart.js
    // makes organization name field clickable to display tabbed detailed data for organization
    function showResult(data){
      if($(data).find("error").length!==0){
        // measures taken when there is a problem with data received
        let errorMessage = "Unable to fetch resulting organizations! Please try again later.";
        let errorGIF = "https://media.giphy.com/media/OLpvCvKbnFUm4/giphy.gif";
        errors.displayErrorMessage(errorMessage, errorGIF);
        errors.fetchErrorMessage(errorMessage);
        $("#pieDisplayButton").css("display", "block");
      }
      else{
        $("#pieDisplayButton").css("display", "block");
        let pieData = pieChart.makeData(data, 5);
        pieChart.createChart("County Wise % Organization Distribution",
                              "Counties With Atleast 5% Organization Share", pieData);
        let dataTable = `<div class="table-responsive">
                  <table id="dataTableContent" class="display dt-responsive">
									<thead>
										<tr>
											<th>Type</th>
											<th>Name</th>
											<th>City</th>
											<th>State</th>
											<th>County</th>
											<th>Zip</th>
										</tr>
									</thead><tbody>`;

				$("row", data).each(function(){
          if(!($("Name", this).text().includes("null"))
          && !($("State", this).text().includes("null"))){
          dataTable+= `<tr>
									<td>${$(this).find("type").text()}</td>
                  <td class="org_clickable" id="${$("OrganizationID", this).text()}">
                            ${$("Name", this).text()}
                  </td>
									<td>${$("city", this).text()}</td>
									<td>${$("State", this).text()}</td>
									<td>${$("CountyName", this).text()}</td>
									<td>${$("zip", this).text()}</td>
                 </tr>`;
          }
					});

          dataTable+=`</tbody></table></div>`;

          // wraps results in a jumbotron
          let jumbotron = document.createElement("div");
          jumbotron.setAttribute("class", "jumbotron");
          jumbotron.setAttribute("id", "tableResults");
          $('.results').html(jumbotron);
          $("#tableResults").html(dataTable);

          // create datatable out of added table
          $('#dataTableContent').DataTable({
            responsive: true
          });

          // on clicking a particular organization
          $('#dataTableContent').on('click', '.org_clickable', function(){
            if(lastIdCalled !== this.id){
              lastIdCalled = this.id;
              let path = TABS + "?"+PARAM_ORG_ID+"=" + this.id;
              details.getDetails(path, "TABS", this.id);
            }
            else{
              $.fn.pagepiling.moveSectionDown();
            }
          });
      }
    }

    // create custom usa state map selector (based on data received from API)
    // uses jqv maps
    function createStateMap(states){
      $('#statesMap').vectorMap({
        map: 'usa_en',
        backgroundColor: '#021D25',
        borderColor: '#818181',
        borderOpacity: 0.25,
        borderWidth: 2,
        color: '#021D25',
        enableZoom: true,
        hoverColor: '#b0c4de',
        hoverOpacity: null,
        normalizeFunction: 'linear',
        scaleColors: ['#b6d6ff', '#005ace'],
        selectedColor: '#dc3545',
        selectedRegions: states, // state data recieved from API is only allowed for selection
        showTooltip: true,
        onRegionOver: function(element, code, region)
        {
            let stateCode = code.toUpperCase();
            // do not show selection option on state codes
            // which are not part of the data received from the api
            if (states.indexOf(stateCode) < 0) {
              element.preventDefault();
            }
            // show full state name of allowed state in the read only input on hover
            else{
              $("#states").val(region);
            }
        },
        onRegionOut: function(element, code, region)
        {
          // sets read only input with nothing on hovering out
          if(stateSelected === ""){
            $("#states").val("")
          }
          // sets read only input with selected text on hovering out
          else{
            $("#states").val(stateSelected);
          }
        },
        onRegionClick: function(element, code, region)
        {
            // on clicking a particular region
            // checks if clicked state code is selected state code
            // prevents from deselecting
            let stateCode = code.toUpperCase();
            if(stateCode===stateSelected){
              element.preventDefault();
            }
            // if different state code then allow selection
            // sets cities data according to new state
            else if (states.indexOf(stateCode) > -1) {
              $("#resetStateMap").css("visibility", "visible");
              setFormData(CITIES+"?state="+stateCode, "CITIES");
              $("#states").val(stateCode);
              stateSelected = stateCode;
            }
            // do not allow selection for state codes not present in data from api
            else {
              element.preventDefault();
            }
        }
      });
    }

    // resets map back to all allowed state code selections according to api data
    // control cities selectors too incase reset called
    function resetStatesMap(states){
      $("#resetStateMap").click(function(){
        $('#statesMap').remove();
        $('.states-container').append('<div id="statesMap"></div>');
        createStateMap(states);
        resetCities();
        $("#states").val("");
        $("#resetStateMap").css("visibility", "hidden");
      });
    }

    // resets cities selector
    function resetCities(){
      $("#cities").html('<option value="">No Single State Selected Yet!</option>');
    }

    // public methods
    return {
      setFormData: setFormData,
      getResult: getResult
    };
}());
// module for the search form and results requested on submitting the form ends
