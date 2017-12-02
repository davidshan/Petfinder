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
                    console.log("db find one user");
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
                            res.json(
                            {
                            userId: item._id
                            });
                        }   
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

            console.log("db find ", userIdIn, "'s pets");
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
        img: url
        name: string
        description: description given on firstScript.js
    } //Note that this is not the complete schema we have time as well as userID.
    //more attributes can be added as necessary.
    */
    
    var userIdIn = req.params.userId;
    
    var petIdIn = req.body.petId;
    var imgIn = req.body.img;
    var nameIn = req.body.name;
    var descriptionIn = req.body.description;
    
    MongoClient.connect(url, function(err,out){
        if(err) console.log(err)
            console.log("Database connected");
            db = out;

            console.log("db add ", userIdIn, " pet");
            db.collection("restpect-pets").findOneAndReplace({petId: petIdIn}, {   
                userId: userIdIn,
                petId: petIdIn,
                img: imgIn,
                name: nameIn,
                description: descriptionIn,
                dateAdded: new Date()
            }, {upsert: true}, function (err, item) {
                if (err) {
                    console.log(err);
                    db.close();
                    res.status(400).json({error: err});
                }
                else if (!item) {
                    console.log(item, "nothing here");
                    db.close();
                    res.status(400).json({error: 'should not be here'});
                } else {
                    res.json(item);
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

            console.log("db find ", userIdIn, "'s pet ", petIdIn);
           var cursor = db.collection("restpect-pets").findOne({userId: userIdIn, petId: petIdIn}, function (err, item) {
               if (err) {
                   console.log(err);
                   db.close();
                   res.status(400).json({error: err});
               }
               else if (!item) {
                   console.log(item, "no records");
                   db.close();
                   res.json({
                       userId: userIdIn,
                       pet: null
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
           
    });    
}