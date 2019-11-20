// api url and data access paths
const API_PROXY_URL = 'https://people.rit.edu/dmgics/754/23/proxy.php';
const ORG_TYPES = '/OrgTypes';
const STATES = '/States';
const CITIES = '/Cities';
const ORGANIZATIONS = '/Organizations';
const TABS = '/Application/Tabs';
const GENERAL = '/General';
const PHYSICIANS = '/Physicians';
const FACILITIES = '/Facilities';
const TREATMENTS = '/Treatments';
const LOCATIONS = '/Locations';
const TRAINING = '/Training';
const EQUIPMENT = '/Equipment';
const PEOPLE = '/People';
const PARAM_ORG_ID = 'orgId';

// a mapper for tabbed detailed results
const tabConstantsMapper = {
  "General": [GENERAL, "GENERAL"],
  "Physicians": [PHYSICIANS, "PHYSICIANS"],
  "Facilities": [FACILITIES, "FACILITIES"],
  "Treatment": [TREATMENTS, "TREATMENTS"],
  "Locations": [LOCATIONS, "LOCATIONS"],
  "Training": [TRAINING, "TRAINING"],
  "Equipment": [EQUIPMENT, "EQUIPMENT"],
  "People": [PEOPLE, "PEOPLE"]
}

// leaflet open street map layer
const osmStreetLayer = "https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token={accessToken}";

// open street map attribution
const osmAttribution = 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>';

// leaflet access token
const leafletAccessToken = "pk.eyJ1IjoibmlyYmhheXBoaCIsImEiOiJjanVzajFnd3k0NnE4M3lucWdsbm1jam9sIn0.4U06eoSypRZF7TB0czQdHA";

// emojis default 
DEFAULT_EMOJI_KEYWORD = "hi";