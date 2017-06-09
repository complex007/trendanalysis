function config($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/trendanalysis");
    $stateProvider
        .state('Trendanalysis', {
            url: "/trendanalysis",
            views: {
                'header':
                {
                    templateUrl: "public/html/header.html",
                   
                },
                
                

                'content': {
                    templateUrl: "modules/trendanalysis/trendanalysis.html",
                    
                    controller: 'TrendAnalysisCtrl'
                },
                'footer':
                {
                     templateUrl:"public/html/footer.html",
                    
                 
                }
                
            }
            
        })
}

angular
    .module('TrendAnalysisApp')
    .config(config) 
    ;