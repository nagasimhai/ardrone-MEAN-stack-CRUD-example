app.controller('pathnamesCtrl', function($scope,$resource, $rootScope, sharedDataService){
	var Pathname = $resource('/api/Pathnames');
	var Flightpath = $resource('/api/Flightpaths');
	//console.log("In client regions-ctrl");
	Pathname.query(function(results){
		$scope.Pathnames = results;
	});

	$scope.populateFlightpath = function(){
		console.log("Emitting" + $scope.selectedPathname);
		sharedDataService.addList($scope.selectedPathname);
		$rootScope.$broadcast('pathnameChanged', $scope.selectedPathname);
	};
	$scope.createPathname = function(){
		var newName = prompt("Please enter name for new flightpath", "Eg: PointAtoPointB");
		if (newName != null) {
			//console.log(pathnameName);
			//look for this in the existing pathnames later
			var pathname = new Pathname;
			pathname.name = newName;
			pathname.$save(function(result){
				$scope.Pathnames.push(result);
			});
			$rootScope.$broadcast('pathnameCreated', newName);
			console.log("Broadcasting pathname "+newName);
		}
	};
	$scope.setManualSpeed = function () {
		var x =  prompt("Enter a Value between 1 and 99","0");
		var num1 = parseInt(x);	
		if (num1<1 || num1>99){
			alert("Invalid entry - setting to default 10");
			num1=10;
		}
		$scope.selectedSpeed=num1;
		$rootScope.$broadcast('speedChanged', $scope.selectedSpeed);
	}
});