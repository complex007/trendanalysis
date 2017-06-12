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

var invoiceModel=sequelize.model('Invoice',invoice);


module.exports = {
    invoiceModel:invoiceModel
};
