<template>
<div id="app">
    <div v-if="!position">Récupération de la position GPS...</div>
    <div id="now" v-if="now">
        <station-summary v-bind:station="now.bike.station" v-bind:distance="now.bike.distance"></station-summary>
        <station-summary v-if="now.bike.station.id != now.ticket.station.id" v-bind:station="now.ticket.station" v-bind:distance="now.ticket.distance"></station-summary>
        <station-summary v-if="now.bike.station.id != now.slot.station.id && now.ticket.station.id != now.slot.station.id" v-bind:station="now.slot.station" v-bind:distance="now.slot.distance"></station-summary>
    </div>
</div>
</template>

<script>
import StationSummary from './components/StationSummary.vue'

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

export default {
    name: 'app',
    components: {
        'station-summary': StationSummary,
    },
    data() {
        return {
            position: null,
            now: null,
        }
    },
    created: function() {
        this.fetchNowData();
    },
    methods: {
        fetchNowData: function() {
            var self = this;
            navigator.geolocation.getCurrentPosition(function(position) {
                self.position = position;
                var latitude = parseFloat(position.coords.latitude);
                var longitude = parseFloat(position.coords.longitude);
                api("now/@" + latitude + "," + longitude, function(data) {
                    self.now = data;
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
