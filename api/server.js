

var express = require('express');
var app = express();
var path = require('path');
var http = require('http');
var bodyParser = require('body-parser');
var mysql  = require('mysql');
var connection  = require('express-myconnection'); 
var routes = require('./routes/trendAnalysisRoutes');
var cors = require('./routes/cors');
var sequelize = require('./config/dbconnection');

    app.set('port', process.env.PORT || 1338);

 
// parse application/x-www-form-urlencoded 
app.use(bodyParser.urlencoded({ extended: false }));
  
// parse application/json 
app.use(bodyParser.json());
 



sequelize
  .authenticate()
  .then(function(){
    console.log('Connection has been established successfully.');
  })
  .catch(function(err){
    console.error('Unable to connect to the database:', err);
  });
  



// app.use(connection(mysql, {
//   host : 'localhost',
//   user : 'root',
//   password : 'root',
//   database : 'trendanalysis',
//   port:'8889'
// }, 'pool'));
 




 app.use(cors);


 routes(app);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});