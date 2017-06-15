'use strict';


var trendAnalysisModel = require('../models/trendAnalysisModel');
var q = require('q');
var sequelize = require('../config/dbconnection');
function getNvd3MonthlyTrend(){
    var defer = q.defer();
    var values = [];
    var sumValues=[];
    trendAnalysisModel.invoiceModel.findAll(
        {
                order: [
                ['IssueDate', 'ASC'],
             ]
        }
    )
        .then(function(records) {
           
            var serverLocal = serverLocalTime(records,'month');

            defer.resolve([{'values':serverLocal.values},{'sumvalues':serverLocal.sumValues}]) ;
        })
        .catch(function (err) {
            defer.reject(err);
        })


    return defer.promise;


}


function getNvd3TodayTrend(){
    var defer = q.defer();
   
    var today=new Date();
    var todayStart=new Date();

   var timezone=today.getTimezoneOffset()/60;
    
     todayStart.setHours(0+timezone,0,0,0);
    trendAnalysisModel.invoiceModel.findAll(
        { 
            where: {
            IssueDate: {
                    $gte: todayStart,
                    $lte:today
                }
             }
            ,
            order: [
                ['IssueDate', 'ASC'],
             ]
        }
    )
        .then(function(records) {
          
            var serverLocal=serverLocalTime(records);

            defer.resolve([{'values':serverLocal.values},{'sumvalues':serverLocal.sumValues}]) ;
        })
        .catch(function (err) {
            defer.reject(err);
        })
    return defer.promise;
}


function getAllData(period,filter,page,pageLimit){
    var defer = q.defer();

    page = parseInt(page);
    pageLimit = parseInt(pageLimit);

    var today=new Date();
    var todayStart=new Date();
    var timezone=today.getTimezoneOffset()/60;
    todayStart.setHours(0+timezone,0,0,0);
    
    if( filter === 'empty'|| filter === '')
    {
        if(period === 'All')
        {
              trendAnalysisModel.invoiceModel.findAndCountAll(
            {
                offset: page,
                limit: pageLimit,
                order: [
                    ['IssueDate', 'ASC'],
                ]
            })
            .then(function(records) {
                defer.resolve(records) ;
            })
            .catch(function (err) {
                defer.reject(err);
            })
        }
        else 
        {
           
              trendAnalysisModel.invoiceModel.findAndCountAll(
            {
                where: {
                IssueDate: {
                        $gte: todayStart,
                        $lte:today
                    }
                }
                ,
                offset: page,
                limit: pageLimit,
                order: [
                    ['IssueDate', 'ASC'],
                ]
            })
            .then(function(records) {
                defer.resolve(records) ;
            })
            .catch(function (err) {
                defer.reject(err);
            })
        
        }

      

    }
    else
    {
        // handle datetime and customer LIKE in mysql
        var querystring='';
        var localTimeFilter = null;
        // the hour of the datetime need to be adjusted to UTCtime
        if(parseInt(filter))
        {
            var result = parseInt(filter) + timezone;
            if (result >= 10)
            {
                localTimeFilter = result;
            }
            else if(result >= 0)
            {
                localTimeFilter = '0' + result;
            }
            else
            {
                localTimeFilter =24 + result;
            }

        }
        else
        {
            localTimeFilter = filter;

        }
        if(period === 'All')
        {
            querystring = 'SELECT * ,(select count(a.id) from Invoice a  '
                +'WHERE a.Customer LIKE :search_name or a.IssueDate like :search_date  '
                +' or a.IssueDate like :search_localtime '
                +' ) as countnum  '
                +'FROM Invoice WHERE Customer LIKE :search_name or IssueDate like :search_date '
                +' or IssueDate like :search_localtime '
                +'  ORDER BY `Invoice`.`IssueDate` ASC   LIMIT :pageno,:pagelimitno'
        }
        else
        {
                querystring = 'SELECT * ,(select count(a.id) from Invoice a  '
                +' WHERE ( a.Customer LIKE :search_name or  a.IssueDate like :search_date '
                +' or a.IssueDate like :search_localtime) '
                + " and (a.IssueDate >=  '" +todayStart.toISOString() 
                + " ' and a.IssueDate <=  '"  + today.toISOString() +"') "           
                +") as countnum  "         
                +' FROM Invoice WHERE (Customer LIKE :search_name or  IssueDate like :search_date'
                +' or IssueDate like :search_localtime) '
                + " and  (IssueDate >=  '" +todayStart.toISOString()
                + " ' and  IssueDate <=  '"  + today.toISOString() +"') "
                +'  ORDER BY `Invoice`.`IssueDate` ASC   LIMIT :pageno,:pagelimitno'
        }
        sequelize.query(querystring,
            { replacements: {
                search_name: '%'+filter+'%' ,
                search_date:'%'+filter+'%',
                search_localtime: '%'+localTimeFilter+':%',
                pageno:page,
                pagelimitno:pageLimit

            }, type: sequelize.QueryTypes.SELECT }
        ).then(function (records) {
            var countNum=0;
            if(records.length > 0)
            {
                countNum = records[0].countnum;
            }
            defer.resolve({'count' : countNum, 'rows' : records}) ;
        })
        .catch(function (err) {
            defer.reject(err);
        })
    }

    return defer.promise;


}


function serverLocalTime(records,type){

            var today = new Date();
            var values = [];
            var sumValues=[];
            //find timezone of server
            var timezone=today.getTimezoneOffset()/60;
            for(var i = 0; i < records.length; i++)
            {
               //UTCtime stored in db is changed to server local GMT time 
                var issuetime = records[i].IssueDate;
              
                if(i === 0)
                {
                    values.push([issuetime,records[i].Amount]);
                    sumValues.push([issuetime,records[i].Amount]);
                }
                else
                {

                     var predatetime=new Date(values[values.length-1][0]);

                     if(type === 'month')
                     {
                        //if the previous record in  values and sumvalues and the current date are in the same month ,
                        //the amount will be added to the previous record
                        // or add a new record in values and sumvalues
                        if(predatetime.getYear()==issuetime.getYear()&&predatetime.getMonth()==issuetime.getMonth())
                        {
                            values[values.length-1][1] += records[i].Amount;
                            sumValues[sumValues.length-1][1] = sumValues[sumValues.length-1][1]+ records[i].Amount;
                        }
                        else
                        {
                            values.push([issuetime,records[i].Amount]);
                            sumValues.push([issuetime,records[i].Amount+sumValues[sumValues.length-1][1]]);
                        }
                     }
                     else
                     {
                        //if the previous record in  values and sumvalues and the current date are the same,
                        //the amount will be added to the previous record
                        // or add a new record in values and sumvalues                        
                        if(predatetime.toString() === issuetime.toString())
                        {
                            values[values.length-1][1] += records[i].Amount;
                            sumValues[sumValues.length-1][1] = sumValues[sumValues.length-1][1]+ records[i].Amount;
                        }
                        else
                        {
                            values.push([issuetime,records[i].Amount]);
                            sumValues.push([issuetime,records[i].Amount+sumValues[sumValues.length-1][1]]);
                        }
                     }
                   
                }
            }

            var localTime={
                'values':values,
                'sumValues':sumValues
            };
          
        return localTime;
}


module.exports={
    getMonthlyTrend:getNvd3MonthlyTrend,
    getTodayTrend:getNvd3TodayTrend,
    getTrend:getAllData

}