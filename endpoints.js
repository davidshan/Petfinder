var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://csc309f:csc309fall@ds117316.mlab.com:17316/csc309db";

/*
expected:

{
    email: string
    ques: string
}
*/

exports.login = function (req, res) {
    var data = req.body;
    var emailIn = data['email'];
    var passIn = data['password'];
    
    MongoClient.connect(url, function(err,out){
        if(err) console.log(err)
            console.log("Database connected");
            db = out;

            console.log("db find")
           var cursor = db.collection("restpect-users").findOne({email: emailIn, password: passIn}, {_id: true}, function (err, item) {
               if (err) {
                   console.log(err);
                   db.close();
                   res.status(400).json({error: err});
               }
               else if (!item) {
                   console.log(item, "nothing here");
                   db.close();
                   res.status(400).json({error: 'incorrect credentials'});
               }
               else {
                   console.log(item);
                   db.close();
                   res.json(item);
               }   
           });
           
    });
    
}

exports.signup = function (req, res) {
    var data = req.body;
    var emailIn = data['email'];
    var passIn = data['password'];
    
    MongoClient.connect(url, function(err,out){
        if(err) console.log(err)
            console.log("Database connected");
            db = out;

            console.log("db find")
            var cursor = db.collection("restpect-users").findOneAndReplace({email: emailIn}, {email: emailIn, password: passIn}, {upsert: true, projection: {_id: true}}, function (err, item) {
                if (err) {
                    console.log(err);
                    db.close();
                    res.status(400).json({error: err});
                }
                else if (!item) {
                    console.log(item, "nothing here");
                    db.close();
                    res.status(400).json({error: 'incorrect credentials'});
                } else {
                    console.log(item, "signed up");
                   
                    db.collection("restpect-users").findOne({email: emailIn, password: passIn}, {_id: true}, function (err, item) {
                        if (err) {
                            console.log(err);
                            db.close();
                            res.status(400).json({error: err});
                        }
                        else if (!item) {
                            console.log(item, "nothing here");
                            db.close();
                            res.status(400).json({error: 400});
                        }
                        else {
                            console.log(item);
                            db.close();
                            res.json(item);
                        }   
                    });
                }   
            });   
    });
}