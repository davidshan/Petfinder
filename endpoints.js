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
                    var cursor = db.collection("restpect-pets").find({userId: userIdIn}).sort({dateAdded: 1}).toArray(function (err, items) {
                       if (err) {
                           console.log(err);
                           db.close();
                           res.status(400).json({error: err});
                       }
                       else if (!items) {
                           console.log(items, "no records");
                           db.close();
                           res.json({
                               userId: userIdIn,
                               pets: []
                           });
                       }
                       else {
                           console.log('pets: ', items);
                           db.close();
                           res.json({
                               userId: userIdIn,
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
    
    var userIdIn = req.params.userId;
    
    var petIdIn = req.body.petId;
    
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
                        userId: userIdIn,
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
                        db.collection("restpect-pets").remove({userId: userIdIn, petId: petIdIn}, {w:1}, function(err, numberOfRemovedDocs) {
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
