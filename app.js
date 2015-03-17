var express = require('express')
var bodyParser = require('body-parser')

var app = express()

var users = {};

// parsing request's data
app.use(bodyParser.json());       
app.use(bodyParser.urlencoded({  extended: true })); 

// rest methods
app.get('/users', function (req, res) {
  res.send(JSON.stringify(users));
})

app.post('/users', function (req, res) {
  users[req.body.name] = { 'offset': req.body.offset, 'color': req.body.color }; 
  res.send('Got a POST request');
})

app.delete('/users', function (req, res) {
  users[req.body.name] = null;
  res.send('Got a DELETE request at /user'); 
})
// end of rest methods

// serving static files
app.use('/js', express.static(__dirname + '/js'));
app.use('/css', express.static(__dirname + '/css'));
app.use(express.static(__dirname + '/public'));

var server = app.listen(3000, function () {  
  var host = server.address().address;  
  var port = server.address().port;
  console.log('Example app listening at http://%s:%s', host, port)
})