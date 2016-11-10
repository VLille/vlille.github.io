'use strict';

const baseURL = "http://overseer.casimir-lab.net"

function updateContent() {
    navigator.geolocation.getCurrentPosition(function(position) {
        app.latitude = position.coords.latitude;
        app.longitude = position.coords.longitude;

        var url = baseURL + "/near/" + parseFloat(app.latitude) + "/" + parseFloat(app.longitude);
        axios.get(url, {
            params: {
                n: 1,
                filter: "bike"
            }
        }).then(function(response) {
            var station = response.data[0];
            app.distance = station.Distance
            app.station = station.Station;
        }).catch(function(error) {
              console.log(error);
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
        distance: '',
        station: '',
    },
    ready: updateContent(),
});
