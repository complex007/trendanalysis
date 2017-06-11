'use strict';
module.exports = function(app) {
  var analysis = require('../controllers/trendAnalysisCtrl.js');



  // todoList Routes
  app.route('/api/data')
    .get(analysis.getTrend)
  
};
