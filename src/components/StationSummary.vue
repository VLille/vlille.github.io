<template>
<div>
    {{ station.name }}<span v-if="distance"> ({{ meters }})</span> : 🚲  {{ station.bikes }}, 🅿  {{ station.slots }}<span v-if="station.sells_tickets">, 💳</span>
</div>
</template>

<script>
export default {
    props: ['station', 'distance'],
    computed: {
        meters() {
            var d = parseFloat(this.distance);
            if (d < 1000) {
                return d.toFixed(0) + " m";
            }
            return (d / 1000).toFixed(1) + " km";
        }
    }
}
</script>
