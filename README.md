# trendanalysis


## Steps to Run 

###### 1 Download Repository:

    (1) create a folder named TrendAnalysis;
    (2) clone or download this repository to TrendAnalysis.
  
###### 2 Create MySQL Connection:

    user: yuqi
    password: 123456wyq
    host: localhost
    port: 3306 
    
**Note: MySQL Connection is written in dbconnection.js under api/config. 
So if another connection is used, dbconnection.js need to be modified before run the project.**
    
    
###### 3 Find MySQL Script:

    (1) find trendanalysis20170612.sql under mysqlscript folder ;
    (2) execute  trendanalysis20170612.sql in MySQLWorkbench;
    
###### 4 Run the Project:

    (1) go to the path of TrendAnalysis using command prompt;
    (2) ensure npm is installed and run: 
    
        cd trendanalysis/api
        npm install
        npm start run
