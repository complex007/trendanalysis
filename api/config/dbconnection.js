var Sequelize=require('sequelize');

var sequelize = new Sequelize('trendanalysis', 'yuqi', '123456wyq', {
  host: 'localhost',
  dialect: 'mysql',
  port:'3306',
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  }

});

module.exports = sequelize;