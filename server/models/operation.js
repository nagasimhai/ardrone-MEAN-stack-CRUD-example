var mongoose = require("mongoose");

module.exports = mongoose.model("Operation", {
	type: String,
	name: String,
	speed_min:		Number,
	speed_max:	Number,
	duration_min: Number,
	duration_max: Number,
	distance: Number
});
