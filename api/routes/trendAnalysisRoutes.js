'use strict';
module.exports = function(app) {
  var analysis = require('../controllers/trendAnalysisCtrl.js');

//enable cross-origin resource sharing
app.all('/', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
 });

  // todoList Routes
  app.route('/api/data')
    .get(analysis.getTrend)
  
};
