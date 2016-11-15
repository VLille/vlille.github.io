'use strict';

function api(uri, cb) {
    var url = "https://overseer.casimir-lab.net/" + uri;
    var req = new XMLHttpRequest();
    req.open('GET', url);
    req.onload = function () {
        var data = JSON.parse(req.responseText);
        cb(data);
    };
    req.send();
}

new Vue({
    el: '#app',
    data: {
        now: {
            message: "Récupération de la position GPS...",
        },
    },
    created: function() {
        this.fetchNowData();
    },
    methods: {
        fetchNowData: function() {
            var self = this;
            navigator.geolocation.getCurrentPosition(function(position) {
                var latitude = parseFloat(position.coords.latitude);
                var longitude = parseFloat(position.coords.longitude);
                api("now/@" + latitude + "," + longitude, function(data) {
                    var station = data.bike.station;
                    var distance = parseInt(data.bike.distance) + "m";
                    self.now = data;
                    self.now.message = station.name + " (" + distance + ") : 🚲 " + station.bikes + ", 🅿 " + station.slots;
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
        }
    }
});
