var Flightpath = require('../models/flightpath');
var Operation = require('../models/operation');
var Fly = require('../models/fly');
var FlyOne = require('../models/flyone');
var arDrone = require('ar-drone');

var client = arDrone.createClient();
var opsList=[];
var lastFlightPathName;
var droneVideo=require('dronestream');

droneVideo.listen(3001);

client.disableEmergency();

module.exports.create = function (req, res){
	//console.log(req.body);//If it has _id, it means it's an update
	if (req.body._id){
		var obj = req.body;
		var id = obj._id;
		delete obj._id;
		console.log("In update");
		Flightpath.update({_id: id}, obj, {upsert: true}, function (err, result) {
			if(!err){
				res.json(result);
				console.log("Success update");
			}
			else {	
				console.log("Error in Update " + err);
			}
		});
	}
	else {  // insert
		var flightpath = new Flightpath(req.body);
		flightpath.save(function(err, result){
			if(!err){
				res.json(result);
				//console.log("Success insert");
			}
			else {
				console.log("Error in insert " + err);
			}
		});
	}
}
module.exports.list = function(req, res){
	Flightpath.find({"pathName":req.params.pathName}).sort({stepNumber:1}).exec(function (err, results){
		res.json(results);
		//console.log("Getting all flightpaths for " + req.params.pathName);
		lastFlightPathName = req.params.pathName;
	});
}

module.exports.opslist = function(req, res){
	Operation.find().sort({type:1}).exec(function(err, results){
		res.json(results);
		opsList=results;
		console.log("Got all operations from DB");
	});
}
module.exports.removeOne = function(req, res){
	console.log(req.params.id);
	Flightpath.remove({_id:req.params.id}, function(err,results){
		if(!err){
			res.json(results);
		}
		else {
			console.log(err);
		}
	});
}
module.exports.updateOne = function(req, res){
	console.log(req.params.id);
	console.log("In update");
	Flightpath.update({_id:req.params.id}, function(err,results){
		if(!err){
			res.json(results);
		}
		else {
			console.log(err);
		}
	});
}

module.exports.flyone = function(req, res){
	// execute fly command
	console.log(req.params.pathName+" is one pathname");
	eval(req.params.pathName);
	res.json("");
}

module.exports.fly = function(req, res){
	// execute fly command
	console.log(req.params+" is pathname");
	var flightString = "client.takeoff();client.after(1000, function(){";
	
	Flightpath.find({"pathName":lastFlightPathName}).sort({stepNumber:1}).exec(function (err, results){
		res.json(results);
		var flightpath = results;
		//console.log(opsList.length);
		for(i=0;i<flightpath.length;i++) {
			// specialized logic based on operation - need to make it DB driven in next release
			for(j=0;j<opsList.length;j++){
					if(flightpath[i].operName==opsList[j].name){
						break;
					}
			}
			if(j==opsList.length){
				console.log("Invalid operation");
			}
			else if(opsList[j].type == 'animate'){
				flightString+="this.animate('"+ flightpath[i].operName+"',"+flightpath[i].duration+");}).after(0";
			}
			else if(opsList[j].type == 'animateLeds'){
				flightString+="this.animateLeds('"+ flightpath[i].operName+"',"+flightpath[i].speed+","+flightpath[i].duration+");}).after(0";
			}
			else {
				flightString+="this."+flightpath[i].operName+"("+flightpath[i].speed/100 +");}).after("+
					flightpath[i].duration;
			}
			flightString+=", function(){";
		}
		flightString+= "this.disableEmergency();this.land();});";
		console.log(flightString);
		eval(flightString);
	});
}
