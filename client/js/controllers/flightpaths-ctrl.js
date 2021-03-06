app.controller('flightpathsCtrl', function($scope, $resource,sharedDataService){
	var Flightpath = $resource('/api/Flightpaths'),
	Fly = $resource('/api/Flys/:pathName'),
	Flyone = $resource('/api/Flyones/:pathName'),
		FlightpathOne = $resource('/api/Flightpaths/:id'),
		FlightpathOneGet = $resource('api/Flightpaths/:pathName'),
		Operation = $resource('/api/Operations');
	//console.log("In client flightpaths-ctrl");
	var thisname;
	var operTypes=[];
	var getOps = 0;
	var j=0;
	var prevOperType="";
	$scope.selectedSpeed=1;//default speed

    $scope.$on('pathnameChanged', function(event, data) {
    	thisname = data;
    	FlightpathOneGet.query({pathName:data}, function(results){
    		$scope.Flightpaths=results;
    	});
    	if(getOps == 0){
    		Operation.query(function(results){
    			$scope.Operations = results;
    			getOps = 1; // So we don't have to get this again
    			for (var i=0; i<results.length;i++){
    				//console.log(results[i].type);
    				if(prevOperType != results[i].type){
    					operTypes[j++] = results[i].type;
    					prevOperType = results[i].type;
    				}
    			}
    			$scope.OperationTypes = operTypes;
    			//console.log(operTypes, operTypes[0], operTypes[3]);
    		})
    	}
    });

    $scope.$on('speedChanged', function(event, data) {
    	console.log("Speed is:"+data);
 		$scope.selectedSpeed=data;
    });
    $scope.$on('pathnameCreated', function(event, data){
    	console.log("Creating new data for " + data);
    	var flightpath = new Flightpath;

    	flightpath.pathName = data;
		flightpath.stepNumber =  1;
		flightpath.operName = "stop";//Hover 
		flightpath.speed = 0;
		flightpath.duration = 1;
		flightpath.durString="MlScnds";
		//flightpath.distance = 0;
		//flightpath.pause = 0;
		//flightpath.back = 0;

		flightpath.$save(function(result){
			//$scope.Flightpaths.push(result);
		});
    });
    $scope.changeInputSettings = function(flightpath, operation, idx){
    	flightpath.teststr = "yes";
    	//console.log(operation.name, flightpath, idx);
		flightpath.speed=operation.speed_min;
		flightpath.duration=1;//set to min
		flightpath.operName = operation.name;
		for(i=0;i<$scope.Operations.length;i++){
    		if(flightpath.operName==$scope.Operations[i].name){
    			if($scope.Operations[i].duration_max<10){
    				flightpath.durString = "Seconds";
     			}
     			else {
     				flightpath.durString = "MlScnds";
     			}
    		}
    	}
    }
    $scope.changeSavecolor= function(flightpath, idx){
    	flightpath.teststr = "yes";
		// find if the duration exceeds permitted level (milliseconds vs seconds)
    	for(i=0;i<$scope.Operations.length;i++){
    		if(flightpath.operName==$scope.Operations[i].name){
    			if(flightpath.duration>$scope.Operations[i].duration_max){
    				flightpath.duration = $scope.Operations[i].duration_max;
     			}
    		}
    	}
    }

    $scope.createOperation = function(){
    	console.log("Getting all operations");
    	Operation.query(function(results){
    		$scope.Operations = results;
    	})
    }

	$scope.removeFlightpath = function(id, idx){
		console.log(id,idx);
		if ($scope.Flightpaths.length==1 && idx==0){
			//Do nothing since we need at least one
		}
		else {
			FlightpathOne.delete({id:id}, function (success) {
				//flightpaths is the data in index.html. Flightpaths is the representation of that data
				$scope.Flightpaths.splice(idx,1);
			});

		}
	}

	$scope.saveFlightpath = function(flightpath, operName){
		console.log(flightpath);
		console.log(operName);
		if(operName){ // only if operation has changed.
			flightpath.operName = operName.name;
		}
		flightpath.teststr = "no";
		flightpath.$save(function(result){
			//set scope here?
		});
		// Overkill - need to find out later how to avoid the below and instead re-sort the Flightpaths instead
		console.log("In saveflightpath " + thisname);
		FlightpathOneGet.query({pathName:thisname}, function(results){
    		$scope.Flightpaths=results;
    	});
	}
	$scope.basicCmd = function (singleCommand) {
		Flyone.query({pathName:singleCommand},function(results){
    		//console.log(singleCommand);
    	});
	}
	$scope.moveCmd = function (singleCommand) {
		singleCommand = singleCommand+($scope.selectedSpeed/10)+')';
		//console.log("In move:"+singleCommand);
		Flyone.query({pathName:singleCommand},function(results){
    		//console.log(singleCommand);
    	});
	}
	$scope.flyFlightpath = function(flightpath){
		var flightString="";
		for(var j=0;j<$scope.Operations.length;j++){
				if(flightpath.operName==$scope.Operations[j].name){
					break;
				}
		}
		if(j==$scope.Operations.length){
			console.log("Invalid operation");
		}
		else if($scope.Operations[j].type == 'animate'){
			flightString+="client.animate('"+ flightpath.operName+"',"+flightpath.duration+");";
		}
		else if($scope.Operations[j].type == 'animateLeds'){
			flightString+="client.animateLeds('"+ flightpath.operName+"',"+flightpath.speed+","+
				flightpath.duration+");";
		}
		else {
			flightString+="client."+flightpath.operName+"("+flightpath.speed/100 +");";
		}
		Flyone.query({pathName:flightString},function(results){
    		//console.log($scope.Operations[3]);
    	});
	}
	
	$scope.flyDrone = function(){
		console.log(thisname);
		Fly.query(function(results){
		});
		//console.log($scope.Flightpaths);
		//console.log($scope.Operations);
		//console.log(thisname);
	}

	$scope.addFlightpath = function(thisId, idx){
		console.log(thisId, idx, $scope.Flightpaths.length, $scope.Flightpaths[idx].stepNumber);
		var flightpath = new Flightpath;
		
		flightpath.pathName = thisname;
		flightpath.stepNumber =  thisId+1;
		flightpath.operName = "stop"; 
		flightpath.speed = 0;
		flightpath.duration = 1;
		flightpath.durString="MlScnds";
		//flightpath.distance = 0;
		//flightpath.back = 0;

		if (idx == ($scope.Flightpaths.length-1) || flightpath.stepNumber < $scope.Flightpaths[idx+1].stepNumber){
			//Last item or item where there is a gap in the next ID
			flightpath.$save(function(result){
				$scope.Flightpaths.push(result); // try to re-sort it here later with $apply or track by
			})
		}
		else {
			console.log("Need to push up the numbers below me");
			for(var i = idx+1; i < $scope.Flightpaths.length; i++) {
				console.log($scope.Flightpaths[i].pathname, $scope.Flightpaths[i].stepNumber);
				$scope.Flightpaths[i].stepNumber+=1;
				$scope.Flightpaths[i].$save(function(result){
					console.log("Incremented and saved");
				})
			}
			flightpath.$save(function(result){
				// Must push here
			})
		}
		// Overkill - need to find out later how to avoid the below and instead re-sort the Flightpaths instead
		FlightpathOneGet.query({pathName:thisname}, function(results){
    		$scope.Flightpaths=results;
    	});
	}

	//not needed$scope.flightpaths = [];

})
