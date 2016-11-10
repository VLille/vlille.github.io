'use strict';

const baseURL = "http://overseer.casimir-lab.net"

function updateContent() {
    navigator.geolocation.getCurrentPosition(function(position) {
        app.latitude = position.coords.latitude;
        app.longitude = position.coords.longitude;

        var url = baseURL + "/" + near + "/" + parseFloat(app.latitude) + "/" + parseFloat(app.longitude);
        axios.get(url, {
            params: {
                n: 1,
                filter: "bike"
            }
        }).then(function(response) {
              app.content = response.data;
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
        content: 'Récupération des données en cours...',
        latitude: 0.0,
        longitude: 0.0,
    },
    ready: updateContent(),
});
