'use strict';

var express = require('express');
var app = express();
var path = require('path');
var http = require('http');
var bodyParser = require('body-parser');
var mysql  = require('mysql');
var routes = require('./routes/trendAnalysisRoutes');
var cors = require('./middleware/cors');
var sequelize = require('./config/dbconnection');

    app.set('port', process.env.PORT || 1338);

 
// parse application/x-www-form-urlencoded 
app.use(bodyParser.urlencoded({ extended: false }));
  
// parse application/json 
app.use(bodyParser.json());


sequelize
  .authenticate()
  .then(function(){
    console.log('DB Connection has been established successfully.');
  })
  .catch(function(err){
    console.error('Unable to connect to the database:', err);
  });

// enable CORs for all request
 app.use(cors);


 routes(app);







http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});