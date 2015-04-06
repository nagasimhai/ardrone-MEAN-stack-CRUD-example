var express 		= require('express'),
	app				= express(),
	bodyParser		= require('body-parser'),
	mongoose		= require('mongoose'),
	flightpathsCtrl		= require('./server/controllers/flightpaths-ctrl'),
	pathnamesCtrl		= require('./server/controllers/pathnames-ctrl');

mongoose.connect('mongodb://localhost:27017/dronedb');

app.use(bodyParser());

app.get('/', function(req, res){
	res.sendFile(__dirname + '/client/views/index.html');
});

app.use('/js', express.static(__dirname + '/client/js'));
app.use('/images', express.static(__dirname + '/client/images'));
app.use('/css', express.static(__dirname + '/client/css'));
app.use('/public', express.static(__dirname + '/public'));

//REST API
app.get('/api/Flightpaths/:pathName', flightpathsCtrl.list);
app.get('/api/Flys', flightpathsCtrl.fly);
app.get('/api/Flyones/:pathName', flightpathsCtrl.flyone);
app.get('/api/Pathnames', pathnamesCtrl.list);
app.get('/api/Operations', flightpathsCtrl.opslist);
app.post('/api/Pathnames', pathnamesCtrl.create);
app.post('/api/Flightpaths', flightpathsCtrl.create);

app.delete('/api/Flightpaths/:id', flightpathsCtrl.removeOne);

app.listen(3013, function(){
	console.log('flightpaths listening on 3013')
})
