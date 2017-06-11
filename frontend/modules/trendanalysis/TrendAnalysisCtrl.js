﻿angular.module('TrendAnalysisApp')
    .controller('TrendAnalysisCtrl', ['$scope','TrendAnalysisService','PageService',  function ($scope,TrendAnalysisService,PageService) {

$scope.period="All";
$scope.filtercondition="";
$scope.pageno=0;
$scope.pagelimit=5;
$scope.pager = {};
$scope.setPage = setPage;



function initController() {
    // initialize to page 1
    $scope.setPage(1);
}
function setPage(page) {
   
    if (page < 1 || page > $scope.pager.totalPages) {
       return ;
    }   
    else
    {   
        $scope.pager.currentPage=page;
        $scope.pager.page=page;
        $scope.page=page;
        
    }       
}


//set chart format
$scope.options = {
            chart: {
                type: 'linePlusBarChart',
                height: 500,
                margin: {
                    top: 30,
                    right: 75,
                    bottom: 50,
                    left: 75
                },
                bars: {
                    forceY: [0]
                },
                color: ['#2ca02c', 'darkred'],
                x: function(d,i) { 
                    
                    return i },
                y:function(d,i) {return d[1] },
                 focusEnable: false,
                xAxis: {
                    axisLabel: 'Time',
                    tickFormat: function(d) {
                        
                        if (d!=undefined) {
                            if($scope.period=="All")
                            {
                               
                                return d3.time.format('%m/%Y')(new Date($scope.data[0].values[d][0]));
                            }
                            else
                            {
                                return d3.time.format('%x %X')(new Date($scope.data[0].values[d][0]));
                            }
                            
                        }
                        
                        return null;
                    }
                },
                y1Axis: {
                   
                    tickFormat: function(d){
                        return 'S$' + d3.format(',.2f')(d)
                    },
                    axisLabelDistance: 12
                },
                y2Axis: {
                   
                    tickFormat: function(d) {
                        return 'S$' + d3.format(',.2f')(d)
                    }
                }
            }
};

//get chart data from backend
$scope.showTrend = function (period){
    var criterion={
        periodtime:period
    };
    TrendAnalysisService.getTrend(criterion).query(
    function(response){
     $scope.data=[ 
            { 
            "key" : "Amount" , 
            "bar": true,
            "color": "#ccf",
            "values" :response[0].values
        
            },
            

            { 
            "key" : "Cumulative" ,
            "color" : "#333",
            "values" :response[1].sumvalues
            }
        ];

   
       
    
    });
};

//get table data from backend
$scope.showTable = function (filtercondition){
    var criterion={
        pageno:$scope.pageno,
        periodtime:"empty",
        pagelimit:$scope.pagelimit,
        filtercondition:filtercondition
    };
   
    TrendAnalysisService.getTrend(criterion).Get(
    function(response){
        
       $scope.tabledata=response.rows;
       
       $scope.pager = PageService.GetPager(response.count, $scope.page,$scope.pagelimit);

       

    });
};

//change table data by page
$scope.addPageno=function(pageno){
    
   $scope.pageno=(pageno-1)*$scope.pagelimit;
   $scope.showTable($scope.filtercondition);
};


//change table data by filter
$scope.changeFilter=function(filtercondition){
    var removechar=filtercondition.split('/');
    var result=removechar.join('-');
    initController();
    $scope.pageno=0;
    $scope.pagelimit=5;
    $scope.showTable(result);
};

initController();
$scope.showTrend($scope.period);
$scope.showTable($scope.filtercondition);




       






}])