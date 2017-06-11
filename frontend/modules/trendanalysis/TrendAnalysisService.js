angular.module('TrendAnalysisApp')
    .constant("baseURL", "http://localhost:1338/api/")
    .service('TrendAnalysisService', ['$resource', 'baseURL', function ($resource, baseURL) {
     this.getTrend=function(criterion){
          var url = baseURL + "data";

            var result = $resource(url,
            
            {
                period:criterion.periodtime,
                filter:criterion.filtercondition,
                page:criterion.pageno,
                pagelimit:criterion.pagelimit
            }
            
            ,
                {
                    'Get': {
                        method: 'Get'
                    }
                });

            return result;
     };

     
       
       
    }])


    ;
