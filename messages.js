/**
      START OF MESSAGING ENDPOINT SECTION
*/

app.use(express.json()); // For JSON POSTing (curling)
ObjectId = require('mongodb').ObjectID; // Necessary for querying the database for specific messages


// Format of data to be sent:
// {"id"(optional): "1234", "message": "dinosaurus rex"}
// -value of id doesn't have to be a string

// Example CURL call (works for this one):
// curl -H "Content-Type: application/json" --request POST http://localhost:3000/api/messages --data '{"message": "bam"}
app.post('/api/messages', function (req, res) { 
  MongoClient.connect(url, function(err, out){
    if(err) console.log(err);
    console.log("Database connected");
    db = out;

    console.log("Message: " + req.body.message);
    var key;
    if (req.body.id == null) {
      key = ObjectId().valueOf().toString();
      console.log("No ID provided, string generated: " + key);
    }
    else {
      key = req.body.id.toString();
    }

    //console.log(typeof key == 'string');
    var data = {_id: key, message: req.body.message};
    
    db.collection("restpect-messages").insertOne(data, function(err, res){
      if (err) {
        console.log(err);
      }
      else {
        db.close();
        console.log("Message saved");
      }
    });
  });
});

/**
// Using our own defined IDs to POST:
app.post('/api/messages/:messageId', function (req, res) { 
  MongoClient.connect(url, function(err, res){
    if(err) console.log(err)
    console.log("Database connected");
    db = res

    var data = {_id: req.params.messageId, message: req.body.message};
    db.collection("restpect-messages").insert(data, function(err, res){
      if (err) {
        console.log("Error");
      }
      else {
        db.close();
        console.log("Message saved");
      }
    });
  });
});
*/

// Using command: curl --request GET http://localhost:3000/api/messages
// Gets a list of all messages, and their associated IDs
app.get('/api/messages', function (req, res) { 
  MongoClient.connect(url, function(err, out){
    if(err) console.log(err);
    console.log("Database connected");
    db = out;

    db.collection("restpect-messages").find( {} ).toArray(function(err, docs) {
      if (err) {
        console.log("Error");
      }
      else {
        db.close();
        console.log(docs);
        // Todo: send to users logged in on website
      }
    });

  });
});

app.delete('/api/messages/:messageId', function (req, res) {
  console.log(req.params.messageId);

  MongoClient.connect(url, function(err, out){
    if(err) console.log(err);
    console.log("Database connected");
    db = out;

    try {
      db.collection("restpect-messages").deleteOne( {"_id": req.params.messageId} )
      console.log("Message either doesn't exist or successfully deleted");
    }
    catch (e) {
      console.log(e);
    }
    db.close();
  });
});


// Need specific endpoint of 1234 (/api/messages/1234) ?
// (according to assignment specs)

/**     
      END MESSAGING ENDPOINT SECTION
*/