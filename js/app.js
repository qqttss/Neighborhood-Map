// locations of interest
var locationsOfInterest = [{
    name: "Times Square",
    lat: 40.7577,
    lng: -73.9857,
    streetAddr: "Times Square",
    cityAddr: "Manhattan, NY 10036",
    url: "", // for hosting links to wikipeida introduction. The same for objects below
    link: "http://www.timessquarenyc.org"
}, {
    name: "Statue of Liberty",
    lat: 40.6892,
    lng: -74.0444,
    streetAddr: "Liberty Island",
    cityAddr: "New York City, NY 10004",
    url: "",
    link: "http://www.nps.gov/stli/index.htm"
}, {
    name: "World Trade Center",
    lat: 40.7117,
    lng: -74.0125,
    streetAddr: "Liberty St & Church St",
    cityAddr: "New York, NY 10006",
    url: "",
    link: "https://www.wtc.com/"
}, {
    name: "Metropolitan Museum of Art",
    lat: 40.7789,
    lng: -73.9637,
    streetAddr: "1000 5th Ave",
    cityAddr: "New York City, NY 10028",
    url: "",
    link: "http://www.metmuseum.org/"
}, {
    name: "Central Park",
    lat: 40.7833,
    lng: -73.9667,
    streetAddr: "Central Park",
    cityAddr: " New York City, NY",
    url: "",
    link: "http://www.centralparknyc.org",
}, {
    name: "Wall Street",
    lat: 40.7064,
    lng: -74.0094,
    streetAddr: "Wall Street",
    cityAddr: "Manhattan, New York City, NY",
    url: "",
    link: "http://www.aviewoncities.com/nyc/wallstreet.htm",
}, {
    name: "Brooklyn Bridge",
    lat: 40.7057,
    lng: -73.9964,
    streetAddr: "Brooklyn Bridge",
    cityAddr: "New York, NY",
    url: "",
    link: "http://www.nyc.gov/html/dot/html/infrastructure/brooklyn-bridge.shtml",
}, {
    name: "Intrepid Sea, Air & Space Museum",
    lat: 40.7648,
    lng: -74.0008,
    streetAddr: "Pier 86, W 46th St & 12th Ave",
    cityAddr: "New York, NY 10036",
    url: "",
    link: "http://www.nyc.gov/html/dot/html/infrastructure/brooklyn-bridge.shtml",
}, {
    name: "Citi Field",
    lat: 40.7569,
    lng: -73.8458,
    streetAddr: "123-01 Roosevelt Ave",
    cityAddr: "New York, NY 11368",
    url: "",
    link: "http://newyork.mets.mlb.com/nym/ballpark/",
}];

var mapOptions = {
    zoom: 13,
    center: new google.maps.LatLng(40.7577, -73.9857)
};

window.map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

// Create one InfoBox for map markers
var infoBox = new InfoBox({
    content: "",
    disableAutoPan: false,
    maxWidth: 150,
    pixelOffset: new google.maps.Size(-140, 0),
    zIndex: null,
    boxStyle: {
        background: "url('http://google-maps-utility-library-v3.googlecode.com/svn/trunk/infobox/examples/tipbox.gif') no-repeat",
        opacity: 0.8,
        width: "250px"
    },
    closeBoxMargin: "12px 4px 2px 2px",
    closeBoxURL: "http://www.google.com/intl/en_us/mapfiles/close.gif",
    infoBoxClearance: new google.maps.Size(1, 1)
});

// Data model holding all the info for specific location
var Pin = function Pin(map, name, lat, lng, link, infobox) {
    var self = this;

    self.name = ko.observable(name);
    self.lat = ko.observable(lat);
    self.lng = ko.observable(lng);
    self.url = "";
    self.link = ko.observable(link);
    self.wikipediaContent = ko.observable('<div class="infobox">' +
        "Loading Wikipedia..." +
        '</div>');

    self.marker = new google.maps.Marker({
        position: new google.maps.LatLng(lat, lng),
        title: name,
        map: map
    });

    self.clickForInfoBox = function() {
        infoBox.setContent(self.wikipediaContent() +
            '<br>' + '<br>' + '<p>Please visit   ' +
            '<a href="' + self.link() + '"><em>' + self.name() + '</em></a></p></div>');
        infoBox.open(map, self.marker);
    };

    google.maps.event.addListener(self.marker, 'click', self.clickForInfoBox);
};

// viewModel for all the actions and data
var viewModel = function(attractions) {
    var self = this;
    self.pins = ko.observableArray([]);

    //control if list is hidden or displayed
    self.toggleListBoolean = ko.observable(true);
    //function that hide or display list
    self.toggleList = function() {
        self.toggleListBoolean() ? self.toggleListBoolean(false) : self.toggleListBoolean(true);
    };

    // Display markers for each location and bound the markers on map
    var bounds = new google.maps.LatLngBounds();

    attractions.forEach(function(point) {
        self.pins.push(new Pin(window.map, point.name, point.lat, point.lng, point.link));
        bounds.extend(new google.maps.LatLng(point.lat, point.lng));
    });

    map.fitBounds(bounds);

    /* Binding function for search */
    self.searchStr = ko.observable("");
    self.searchStr.subscribe(function(newVal) {
        if (newVal || newVal === "") {
            self.pins().forEach(function(p) {
                p.marker.setVisible(true);
            });
            return "";
        }
        return searchStr;
    });

    self.searchFun = function() {
        infoBox.close(); // remove the infobox before search
        self.pins().forEach(function(p) {
            if (p.name().toLowerCase().indexOf(self.searchStr().toLowerCase()) >= 0) {
                p.marker.setVisible(true);
            } else {
                p.marker.setVisible(false);
            }
        });
    };

    // Loading wikipedia infomation for attraction
    self.loadWikipedia = (function() {
        self.pins().forEach(function(p) {
            var wikipediaUrl = 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' + p.name() + '&format=json&callback=wikiCallback';
            var wikiRequestTimeout = setTimeout(function() {}, 8000);

            $.ajax({
                url: wikipediaUrl,
                dataType: "jsonp",
                success: function(response) {
                    p.wikipediaContent('<div class="infobox">' + response[2][0]);
                    p.url = response[3][0];
                    clearTimeout(wikiRequestTimeout);
                },
                // Error loading the content, set the error message
                error: function(jqXHR, textStatus, errorThrown) {
                    p.wikipediaContent('<div class="infobox">' +
                        "Error Loading Wikipedia, reload the page when network is available" +
                        '</div>');
                    clearTimeout(wikiRequestTimeout);
                }
            });
        });
    }());
};

ko.applyBindings(new viewModel(locationsOfInterest));