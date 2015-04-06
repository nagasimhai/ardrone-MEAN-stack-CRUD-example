var Pathname = require('../models/pathname');

module.exports.list = function(req, res){
	Pathname.find(function (err, results){
		res.json(results);
		console.log("Getting all pathnames");
	});
}

module.exports.create = function (req, res){
	var pathname = new Pathname(req.body);
	pathname.save(function(err, result){
		if(!err){
			res.json(result);
			//console.log("Success insert");
		}
		else {
			console.log(err);
		}
	});
}