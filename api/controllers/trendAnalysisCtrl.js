'use strict';


var trendAnalysisService = require('../service/trendAnalysisService');

function getTrend(req, res){
        var pg = req.url;
        var period = req.query.period;
        var filter = req.query.filter;
        var page = req.query.page;
        var pagelimit = req.query.pagelimit;
       
       // when get data for chart , no page is set in the query of request.
        if(period === "All" && page === undefined)
        {
            
            trendAnalysisService.getMonthlyTrend()
                .then(function(data){
                    res.json(data);
                }).catch(function (err) {
                    res.json(400, err);
                })
            ;
        }
        else if(period === "Today" && page === undefined )
        {
             
            trendAnalysisService. getTodayTrend()
                .then(function(data){
                    res.json(data);
                }).catch(function (err) {
                    res.json(400, err);
                })
            ;
        }
        else
        {
            
            trendAnalysisService.getTrend(period,filter,page,pagelimit)
                .then(function(data){
                    res.json(data);
                }).catch(function (err) {
                    res.json(400, err);
                })
            ;


        }


}

 
module.exports={
    getTrend:getTrend
   
 
}