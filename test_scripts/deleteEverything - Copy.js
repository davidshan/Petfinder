    var MongoClient = require('mongodb').MongoClient
    var url = "mongodb://csc309f:csc309fall@ds117316.mlab.com:17316/csc309db";


    MongoClient.connect(url, function(err,res){
				if(err) console.log(err)
				console.log("Database created");
				db = res
				
				// Add functions here
				
                db.collection("restpect-users").remove({});
                console.log("respect-users cleared");
                db.collection("restpect-pets").remove({});
                console.log("respect-pets cleared");
                db.collection("restpect-messages").remove({});
                console.log("respect-messages cleared");
                db.close();
    });
