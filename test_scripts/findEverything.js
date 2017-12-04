    var MongoClient = require('mongodb').MongoClient
    var url = "mongodb://csc309f:csc309fall@ds117316.mlab.com:17316/csc309db";


    MongoClient.connect(url, function(err,res){
				if(err) console.log(err)
				console.log("Database created");
				db = res
				
				// Add functions here
				
                db.collection("restpect-users").find({}).toArray(function (err, items) {
                       if (err) {
                           console.log(err);
                       }
                       else {
                           console.log("users", items);
                       }   
                   });
                 db.collection("restpect-pets").find({}).toArray(function (err, items) {
                       if (err) {
                           console.log(err);
                       }
                       else {
                           console.log("pets", items);
                       }   
                   });
                    db.collection("restpect-messages").find({}).toArray(function (err, items) {
                       if (err) {
                           console.log(err);
                       }
                       else {
                           console.log("messages", items);
                       }   
                   });
                db.close();
    });
