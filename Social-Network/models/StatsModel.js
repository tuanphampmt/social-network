const mongoose = require('mongoose');

const StatsSchema = new mongoose.Schema({
    label: String,
    value: String,
    percentage: String,
    increase: Boolean,
    decrease: Boolean,
    chartlabels: [null, null, null, null, null, null, null],
    attrs: Object,
    datasets: Array,
}, {collection: 'stats'});

module.exports = mongoose.model('Stats', StatsSchema);
