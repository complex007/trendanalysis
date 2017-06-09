

var express = require('express');
var app = express();
var path = require('path');
var http = require('http');
var bodyParser = require('body-parser');
var mysql  = require('mysql');
var connection  = require('express-myconnection'); 
var routes=require('./routes/trendAnalysisRoutes');
var cors=require('./routes/cors');

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
 
 app.use(cors);


 routes(app);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});