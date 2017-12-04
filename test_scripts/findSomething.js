    var MongoClient = require('mongodb').MongoClient
    var url = "mongodb://csc309f:csc309fall@ds117316.mlab.com:17316/csc309db";
    var ObjectId = require('mongodb').ObjectId;

    MongoClient.connect(url, function(err,res){
				if(err) console.log(err)
				console.log("Database created");
				db = res
				
				// Add functions here
                var userIdIn;
    
            try {
                var userIdIn = ObjectId('5a258a1438824b161f03661e');
            }
            catch (e) {
                console.log(e);

            }
                
                db.collection("restpect-users").find({_id: userIdIn}).toArray(function (err, items) {
                       if (err) {
                           console.log(err);
                       }
                       else {
                           console.log("users", items);
                       }   
                   });
                 
                db.close();
    });
