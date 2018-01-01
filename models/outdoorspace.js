var mongoose   = require("mongoose");

var outdoorspaceSchema = new mongoose.Schema({
	name: String,
	image: String,
	description: String
});

module.exports = mongoose.model("Outdoorspace", outdoorspaceSchema);