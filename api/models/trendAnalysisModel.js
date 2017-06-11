'use strict';


var Sequelize=require('sequelize');
var sequelize = require('../config/dbconnection');

var invoice = sequelize.define('Invoice', {
  id: {
    type: Sequelize.INTEGER,
      primaryKey: true
  },
  IssueDate: {
    type: Sequelize.DATE
  },
  
  Customer: {
    type: Sequelize.STRING
  },
  
  Amount: {
    type: Sequelize.DOUBLE
  }

},

    {
        timestamps: false,
        freezeTableName: true,
        // define the table's name
        tableName: 'Invoice',
    });


var dailyRevenue = sequelize.define('dailyrevenue', {
        id: {
            type: Sequelize.DATE,
            primaryKey: true
        },
        dailyamount: {
            type: Sequelize.DOUBLE
        }

    },

    {
        timestamps: false,
        freezeTableName: true,
        // define the table's name
        tableName: 'dailyrevenue',
    });

var monthlyRevenue = sequelize.define('monthlyrevenue', {

  id: {
    type: Sequelize.STRING,
      primaryKey: true
  },
  
  monthlyamount:  {
    type: Sequelize.DOUBLE
  }

},

    {
        timestamps: false,
        freezeTableName: true,
        // define the table's name
        tableName: 'monthlyrevenue',
    }
);
var monthlyRevenueModel = sequelize.model('monthlyrevenue', monthlyRevenue);
var dailyRevenueModel=sequelize.model('dailyrevenue',dailyRevenue);
var invoiceModel=sequelize.model('Invoice',invoice);


module.exports = {
  monthlyRevenueModel:monthlyRevenueModel,
  dailyRevenueModel:dailyRevenueModel,
    invoiceModel:invoiceModel
};
