angular.module('TrendAnalysisApp')
    .constant("baseURL", "http://localhost:1338/api/")
    .service('TrendAnalysisService', ['$resource', 'baseURL', function ($resource, baseURL) {
     this.getTrend=function(){
          var url = baseURL + "data";
            var result = $resource(url,null,
                {
                    'Get': {
                        method: 'Get'
                    }
                });

            return result;
     }
       
       
    }])


    ;
