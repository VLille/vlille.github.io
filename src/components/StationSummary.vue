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
            return parseInt(this.distance) + "m"
        }
    }
}
</script>
