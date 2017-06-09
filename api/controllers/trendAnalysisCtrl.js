


function getTrend(req, res){
var pg = req.url;

//var paramlist=req.query.id;

  req.getConnection(function(err,connection){
       
      var query = connection.query('SELECT * FROM monthlyrevenue',function(err,rows)
      {
        if(err)
        {
          console.log("Error Selecting : %s ",err );
        }
         else
         {
            
           res.json(rows); 
         } 
         });
      });
  
}
 
 
//need a compare class
 
module.exports={
    getTrend:getTrend
   
 
}