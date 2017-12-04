var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId; 
var url = "mongodb://csc309f:csc309fall@ds117316.mlab.com:17316/csc309db";

/*
expected:

{
    email: string
    password: string
}
*/

exports.login = function (req, res) {
    var data = req.body;
    var emailIn = data['email'];
    var passIn = data['password'];
    console.log("emailIn");
    console.log(emailIn);
    console.log(passIn);
    MongoClient.connect(url, function(err,out){
        if(err) console.log(err)
            console.log("Database connected");
            db = out;

            console.log("db find one user");
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
                   res.json({
                            userId: item._id
                            });
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

            console.log("db find one user and replace");
            var cursor = db.collection("restpect-users").findOneAndReplace({email: emailIn}, {email: emailIn, password: passIn},
            {upsert: true, projection: {_id: true}, returnOriginal: false}, function (err, item) {
                if (err) {
                    console.log(err);
                    db.close();
                    res.status(400).json({error: err});
                }
                else if (!item.value) {
                    console.log(item, "should not get here");
                    db.close();
                    res.status(400).json({error: 'should not get here'});
                } else {
                    console.log(item, "signed up");
                    console.log("db find one user");
                    res.json(
                            {
                            userId: item.value._id
                            });
                    
                }   
            });   
    });
}

exports.getUserPets = function (req, res) {
    /*
    req.params = {
        userId: _id from database
    }
    */
    var userIdIn = req.params.userId;
    console.log("userIDIn: " + userIdIn);
    MongoClient.connect(url, function(err,out){
        if(err) console.log(err)
            console.log("Database connected");
            db = out;
            
            db.collection("restpect-users").findOne({email: userIdIn}, function (err, item) {
               if (err) {
                   console.log(err);
                   db.close();
                   res.status(400).json({error: err});
               }
               else if (!item) {
                   console.log(item, "nothing here");
                   db.close();
                   res.status(400).json({error: 'user does not exist'});
               }
               else {
                    var cursor = db.collection("restpect-pets").find({email: userIdIn}).sort({dateAdded: 1}).toArray(function (err, items) {
                       if (err) {
                           console.log(err);
                           db.close();
                           res.status(400).json({error: err});
                       }
                       else if (!items) {
                           console.log(items, "no records");
                           db.close();
                           res.json({
                               email: userIdIn,
                               pets: []
                           });
                       }
                       else {
                           console.log('pets: ', items);
                           db.close();
                           res.json({
                               email: userIdIn,
                               pets: items
                           });
                       }   
                   });
               }   
            });
    });    
}

exports.addPet = function (req, res) {
    /*
    req.params = {
        userId: _id from database
    }
    
    req.body = 
    {
        petId: petfinder's ID
    } //Note that this is not the complete schema we have time as well as userID, as well as a comment field.
    //more attributes can be added as necessary.
    */
    
    var userIdIn = req.body.userId;
    
    var petIdIn = req.body.petId;
    
    MongoClient.connect(url, function(err,out){
        if(err) console.log(err)
            console.log("Database connected");
            db = out;

            db.collection("restpect-users").findOne({email: userIdIn}, function (err, item) {
               if (err) {
                   console.log(err);
                   db.close();
                   res.status(400).json({error: err});
               }
               else if (!item) {
                   console.log(item, "nothing here");
                   db.close();
                   res.status(400).json({error: 'user does not exist'});
               }
               else {
                        db.collection("restpect-pets").findOneAndUpdate({email: userIdIn, petId: petIdIn}, {$set: {   
                        email: userIdIn,
                        petId: petIdIn,
                        dateAdded: new Date()
                    }}, {upsert: true, returnOriginal: false}, function (err, item) {
                        if (err) {
                            console.log(err);
                            db.close();
                            res.status(400).json({error: err});
                        }
                        else if (!item.value) {
                            console.log(item, "nothing here");
                            db.close();
                            res.status(400).json({error: 'should not be here'});
                        } else {
                            res.json(item);
                        }
                    });
                }   
            });
        });
}

exports.getSpecificPet = function (req, res) {
    /*
    req.params = {
        userId: _id from database
        petId: petfinder id
    }
    */
    
    var userIdIn = req.params.userId;
    var petIdIn = req.params.petId;
    
    MongoClient.connect(url, function(err,out){
        if(err) console.log(err)
            console.log("Database connected");
            db = out;
            
            db.collection("restpect-users").findOne({_id: new ObjectId(userIdIn)}, function (err, item) {
               if (err) {
                   console.log(err);
                   db.close();
                   res.status(400).json({error: err});
               }
               else if (!item) {
                   console.log(item, "nothing here");
                   db.close();
                   res.status(400).json({error: 'user does not exist'});
               }
               else {
                       var cursor = db.collection("restpect-pets").findOne({userId: userIdIn, petId: petIdIn}, function (err, item) {
                       if (err) {
                           console.log(err);
                           db.close();
                           res.status(400).json({error: err});
                       }
                       else if (!item) {
                           console.log(item, "no records");
                           db.close();
                           res.status(400).json({
                               error: "no pet found"
                           });
                       }
                       else {
                           console.log('pet: ', item);
                           db.close();
                           res.json({
                               userId: userIdIn,
                               pet: item
                           });
                       }   
                   });
               }   
            });
            
            
            
           
    });    
}

exports.editPet = function (req, res) {
    /*
    req.params = {
        userId: _id from database
        petId: petfinder id
    }
    
    req.body = 
    {
      comment: a string
    } //Note that this is not the complete schema we have time as well as userID, as well as a comment field.
    //more attributes can be added as necessary.
    */
    
    var userIdIn = req.params.userId;
    
    var petIdIn = req.params.petId;
    
    var commentIn = req.body.comment;
    
    
    MongoClient.connect(url, function(err,out){
        if(err) console.log(err)
            console.log("Database connected");
            db = out;
            
               db.collection("restpect-users").findOne({_id: new ObjectId(userIdIn)}, function (err, item) {
               if (err) {
                   console.log(err);
                   db.close();
                   res.status(400).json({error: err});
               }
               else if (!item) {
                   console.log(item, "nothing here");
                   db.close();
                   res.status(400).json({error: 'user does not exist'});
               }
               else {
                    db.collection("restpect-pets").findOneAndUpdate({userId: userIdIn, petId: petIdIn}, {$set: {   
                        comment: commentIn
                    }}, {returnOriginal: false}, function (err, item) {
                        if (err) {
                            console.log(err);
                            db.close();
                            res.status(400).json({error: err});
                        }
                        else if (!item.value) {
                            console.log(item, "nothing here");
                            db.close();
                            res.status(400).json({error: 'no pet found'});
                        } else {
                            res.json(item);
                        }
                    });
               }   
            });
            
            
            

        });
}

exports.deletePet = function (req, res) {
    /*
    req.params = {
        userId: _id from database
        petId: petfinder id
    }
    
    */
    var userIdIn = req.params.userId;
    
    var petIdIn = req.params.petId;
    
    MongoClient.connect(url, function(err,out){
        if(err) console.log(err)
            console.log("Database connected");
            db = out;
            db.collection("restpect-users").findOne({email: userIdIn}, function (err, item) {
               if (err) {
                   console.log(err);
                   db.close();
                   res.status(400).json({error: err});
               }
               else if (!item) {
                   console.log(item, "nothing here");
                   db.close();
                   res.status(400).json({error: 'user does not exist'});
               }        
               else {
                        db.collection("restpect-pets").remove({email: userIdIn, petId: petIdIn}, {w:1}, function(err, numberOfRemovedDocs) {
                            if (err) {
                                console.log(err);
                            }
                            db.close();
                            res.json({deleted: numberOfRemovedDocs});

                        });   
                   }
        });
    });
}


//messages

exports.addMessage = function (req, res) { 
  MongoClient.connect(url, function(err, out){
    if(err) console.log(err);
    console.log("Database connected");
    db = out;

    console.log("Message: " + req.body.data);
    var key;
    if (req.body.id == null) {
      key = ObjectId().valueOf().toString();
      console.log("No ID provided, string generated: " + key);
    }
    else {
      key = req.body.id.toString();
    }

    //console.log(typeof key == 'string');
    var data = {_id: key, data: req.body.data, timestamp: ObjectId()};
    
    db.collection("restpect-messages").insertOne(data, function(err, out){
      if (err) {
        console.log(err);
      }
      else {
        db.close();
        console.log("Message saved");
        res.json({messageId: key});
      }
    });
  });
}

exports.getMessages = function (req, res) { 
  MongoClient.connect(url, function(err, out){
    if(err) console.log(err);
    console.log("Database connected");
    db = out;

    db.collection("restpect-messages").find( {} ).sort({timestamp: -1}).toArray(function(err, docs) {
      if (err) {
        console.log("Error");
      }
      else {
        db.close();
        //console.log(docs);
        res.json({messages: docs});
        // Todo: send to users logged in on website
      }
    });

  });
}

exports.deleteMessage = function (req, res) {
  console.log(req.params.messageId);

  MongoClient.connect(url, function(err, out){
    if(err) console.log(err);
    console.log("Database connected");
    db = out;

    try {
      db.collection("restpect-messages").deleteOne( {"_id": req.params.messageId} )
      console.log("Message either doesn't exist or successfully deleted");
      res.json({status: "ok"});
    }
    catch (e) {
      console.log(e);
      res.status(400).json({error: e});
    }
    db.close();
  });
}

