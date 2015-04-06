var app = angular.module ('flightpathApp', ['ngResource']);

// below could also be done via $rootscope - but not recommended
app.service('sharedDataService', function() {
  var myList = [];

  var addList = function(newObj) {
      myList.push(newObj);
  }

  var getList = function(){
  		// only one value possible at a time
  		var tempList = [];
  		tempList = myList;
  		myList=[];
      return tempList;
  }

  return {
    addList: addList,
    getList: getList
  };

});