


function getTrend(req, res){
var pg = req.url;

  req.getConnection(function(err,connection){
       
      var query = connection.query('SELECT * FROM Invoice',function(err,rows)
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