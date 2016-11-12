'use strict';

function api(uri, cb) {
    var url = "https://overseer.casimir-lab.net/" + uri;
    var method = 'GET';
    var req = new XMLHttpRequest();
    req.onerror = function() { console.log("Request failed"); };
    req.onload = function () {
        var data = JSON.parse(req.responseText);
        cb(data);
    };
    req.open('GET', url);
    req.send();
}

function updateContent() {
    navigator.geolocation.getCurrentPosition(function(position) {
        var latitude = parseFloat(position.coords.latitude);
        var longitude = parseFloat(position.coords.longitude);
        api("near/" + latitude + "/" + longitude + "?n=1&filter=bike", function(data) {
            var data = data[0];
            var station = data.Station
            var distance = parseInt(data.Distance) + "m";
            app.now.message = station.Name + " (" + distance + ") : 🚲 " + station.Bikes + ", 🅿 " + station.Slots
        });
    }, function showError(error) {
	switch(error.code) {
		case error.PERMISSION_DENIED:
			alert("User denied the request for Geolocation.");
			break;
		case error.POSITION_UNAVAILABLE:
			alert("Location information is unavailable.");
			break;
		case error.TIMEOUT:
			alert("The request to get user location timed out.");
			break;
		case error.UNKNOWN_ERROR:
			alert("An unknown error occurred.");
			break;
	}
    }, {enableHighAccuracy: true});
};

var app = new Vue({
    el: '#app',
    data: {
        now: {
            message: "Récupération de la position GPS...",
        },
    },
    ready: updateContent(),
});
