

var express = require('express');
var app = express();
var path = require('path');
var http = require('http');
var bodyParser = require('body-parser');
 
var methods = require('./controllers/trendAnalysisCtrl.js'); 
var mysql  = require('mysql');
var connection  = require('express-myconnection'); 

 
app.set('port', process.env.PORT || 1338);

 
// parse application/x-www-form-urlencoded 
app.use(bodyParser.urlencoded({ extended: false }));
  
// parse application/json 
app.use(bodyParser.json());
 

app.use(connection(mysql, {
  host : 'localhost',
  user : 'yuqi',
  password : '123456wyq',
  database : 'trendanalysis',
  port:'3306'
}, 'pool'));
 
//Creating Router() object
var router = express.Router(); 
 

 
router.get("/", function(req, res){
  // send back json data
  console.log("/" + req.method);
  res.json({"message" : "Hello World"});
});

 
router.get('/api/data', methods.getTrend);
 
app.use("/", router);
    
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});