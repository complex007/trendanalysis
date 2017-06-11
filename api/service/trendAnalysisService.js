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

            var today = new Date();
            //find timezone of server
            var timezone=today.getTimezoneOffset()/60;
            for(var i = 0; i < records.length; i++)
            {
                var issuetime = new Date(records[i].IssueDate);

                //UTCtime change to server local time
                issuetime.setHours(
                    issuetime.getHours()+timezone,
                    issuetime.getMinutes(),
                    issuetime.getSeconds(),
                    issuetime.getMilliseconds()
                );

                if(i === 0)
                {
                    values.push([issuetime,records[i].Amount]);
                    sumValues.push([issuetime,records[i].Amount]);
                }
                else
                {

                     var predatetime=new Date(values[values.length-1][0]);

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

            }

            defer.resolve([{'values':values},{'sumvalues':sumValues}]) ;
        })
        .catch(function (err) {
            defer.reject(err);
        })


    return defer.promise;


}


function getNvd3TodayTrend(){
    var defer = q.defer();
    var values = [];
    var sumValues=[];
    var today=new Date();
    var todayStart=new Date();

    todayStart.setHours(0,0,0,0);

    trendAnalysisModel.dailyRevenueModel.findAll({
        where: {
            id: {
                $gte: todayStart,
                $lte:today
            }
        } ,
        order: [
            ['id', 'ASC'],
        ]


    })
        .then(function(records) {

            for(var i = 0; i < records.length; i++)
            {
                var UTCtime = new Date(records[i].id);
                values.push([UTCtime,records[i].dailyamount]);

                if(i === 0)
                {

                    sumValues.push([UTCtime,records[i].dailyamount]);
                }
                else
                {

                    sumValues.push([UTCtime,records[i].dailyamount+sumValues[i-1][1]]);
                }

            }

            defer.resolve([{'values':values},{'sumvalues':sumValues}]) ;
        })
        .catch(function (err) {
            defer.reject(err);
        })


    return defer.promise;


}


function getAllData(filter,page,pageLimit){
    var defer = q.defer();

    page = parseInt(page);
    pageLimit = parseInt(pageLimit);

    if(filter === 'empty'|| filter === '')
    {

        trendAnalysisModel.invoiceModel.findAndCountAll(
            {
                offset: page,
                limit: pageLimit,
                order: [
                    ['IssueDate', 'ASC'],
                ]
            }

        )
            .then(function(records) {


                defer.resolve({'count':records.count,'rows':records.rows}) ;
            })
            .catch(function (err) {
                defer.reject(err);
            })

    }
    else
    {
        // handle datetime LIKE in mysql
        sequelize.query('SELECT * ,(select count(a.id) from invoice a  '
            +'WHERE a.Customer LIKE :search_name or a.IssueDate like :search_day or a.IssueDate like :search_date ) as countnum  '
            +'FROM Invoice WHERE Customer LIKE :search_name or IssueDate like :search_day or IssueDate like :search_date '
            +'  ORDER BY `Invoice`.`IssueDate` ASC   LIMIT :pageno,:pagelimitno',
            { replacements: {
                search_name: '%'+filter+'%' ,
                search_date:'%'+filter+'%',
                search_day:filter+'%',
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


module.exports={
    getMonthlyTrend:getNvd3MonthlyTrend,
    getTodayTrend:getNvd3TodayTrend,
    getTrend:getAllData

}