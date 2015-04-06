var Flightpath = require('../models/flightpath');
var Operation = require('../models/operation');
var arDrone = require('ar-drone');
var client = arDrone.createClient();

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
	Flightpath.find({"pathName":req.params.pathName}).sort({flightpathId:1}).exec(function (err, results){
		res.json(results);
		console.log("Getting all flightpaths for " + req.params.pathName);
	});
}

module.exports.opslist = function(req, res){
	Operation.find(function( err,results){
		res.json(results);
		console.log("Got all operations from DB");
	});
}
module.exports.removeOne = function(req, res){
	console.log(req.params.id);
	Flightpath.remove({_id:req.params.id}, function(err,results){
		if(!err){
			res.json(results);flightpath.length
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
module.exports.fly = function(req, res){
	Flightpath.find({"pathName":req.params.pathName}).sort({flightpathId:1}).exec(function (err, results){
		var flightpath = results;
		client.takeoff();
		for(i=0;i<flightpath.length;i++) {
			console.log(flightpath[i].operName, flightpath[i].speed);
			if(flightpath[i].operName == "Forward"){
				
					console.log("Forward");
					client.front(flightpath[i].speed/10);

			}
			else if(flightpath[i].operName == "Backward"){
				client.back(flightpath[i].speed/10);
					console.log("back");
			}
			else if(flightpath[i].operName == "Left"){
					client.left(flightpath[i].speed/10);
			}
			else if(flightpath[i].operName == "Right"){

					client.right(flightpath[i].speed/10);
			}
			else if(flightpath[i].operName == "Top"){
					client.up(flightpath[i].speed/10);
			}
			else if(flightpath[i].operName == "Down"){
					client.down(flightpath[i].speed/10);
			}
			else if(flightpath[i].operName == "Hover"){
					console.log("hover");
					client.stop(flightpath[i].speed/10);
			}
			else if(flightpath[i].operName == "clockwise"){
					client.clockwise(flightpath[i].speed/10);
			}
			else if(flightpath[i].operName == "flipForward"){
					client.flipAhead(flightpath[i].speed/10);
			}

		}
		console.log("Flying all flightpaths for " + req.params.pathName);
	});
	client
  .after(0, function() {
  		console.log("Landing now");
    this.stop();
    this.land();
  });

}

