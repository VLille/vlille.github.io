

<template>

<div id="app">
    <p v-html="now.message"></p>
</div>

</template>

<script>

function api(uri, cb) {
    var url = "https://overseer.casimir-lab.net/" + uri;
    var req = new XMLHttpRequest();
    req.open('GET', url);
    req.onload = function() {
        var data = JSON.parse(req.responseText);
        cb(data);
    };
    req.send();
}

function formatStation(station, distance) {
    var distanceInfo = "";
    if (distance) {
        distanceInfo = " (" + parseInt(distance) + "m)";
    }
    return station.name + distanceInfo + " : 🚲 " + station.bikes + ", 🅿 " + station.slots + (station.sells_tickets ? ", 💳" : "");
}

function formatNow(now) {
    var message = formatStation(now.bike.station, now.bike.distance);
    if (now.bike.station.id != now.ticket.station.id) {
        message += "<br />" + formatStation(now.ticket.station, now.ticket.distance);
    }
    if (now.bike.station.id != now.slot.station.id) {
        message += "<br />" + formatStation(now.slot.station, now.slot.distance);
    }
    return message;
}

export default {
    name: 'app',
    data() {
        return {
            now: {
                message: "Récupération de la position GPS...",
            },
        }
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
                    self.now.message = formatNow(data);
                });
            }, function showError(error) {
                switch (error.code) {
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
            }, {
                enableHighAccuracy: true
            });
        }
    }
}

</script>
