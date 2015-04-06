var mongoose = require("mongoose");

module.exports = mongoose.model("Flightpath", {
	pathName: String,
	stepNumber: Number,
	operName: String,
	speed:		Number,
	duration:	Number,
	durString: String,
	distance: Number,
	pause: Number,
	back: Number, 
	teststr: String
});
