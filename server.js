

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://csc309f:csc309fall@ds117316.mlab.com:17316/csc309db";
var express = require('express');
var request = require('request');

var app = express();

app.disable('x-powered-by'); //blocks header from containing info about our server, for security reasons

var handlebars = require('express-handlebars').create({defaultLayout:'main'});
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

app.use(require('body-parser').urlencoded({extended: true}));
app.use(require('body-parser').json());

var morgan = require('morgan');

app.use(morgan("combined"));


var formidable = require('formidable');

//credentials, for cookies and sessions, to help with security
var credentials = require('./credentials.js');
app.use(require('cookie-parser')(credentials.cookieSecret));

app.set('port', process.env.PORT || 3000); //web app runs on port 3000

app.use(express.static(__dirname + '/public'));
//localhost3000/
app.get('/', function(req, res){
  res.render('home'); //references home handlebar
});

app.get('/junk', function(req, res, next){
  console.log('Tried to access /junk');
  throw new Error('/junk doesn\'t exist');
});

app.use(function(err, req, res, next){
  console.log('Error : ' + err.message);
  next();
});

app.get('/petspotlight', function(req, res){
  res.render('about');
});

//csrf token generated by cookie and form data, verified when posting
app.get('/profile', function(req, res){
  res.render('profile', { csrf: 'CSRF token here'});
});

app.get('/thankyou', function(req, res){
  res.render('thankyou');
});

app.get('/file-upload', function(req, res){
  var now = new Date();
  res.render('file-upload',{
    year: now.getFullYear(),
    month: now.getMonth() });
  });

app.post('/file-upload/:year/:month',
  function(req, res){
    var form = new formidable.IncomingForm(); //parsing file
    form.parse(req, function(err, fields, file){
      if(err)
        return res.redirect(303, '/error');
      console.log('Received File');

      console.log(file);
      res.redirect( 303, '/thankyou');
  });
});

app.get('/cookie', function(req, res){
  res.cookie('username', 'Derek Banas', {expire: new Date() + 9999}).send('username has the value of Derek Banas');
});

app.get('/listcookies', function(req, res){
  console.log("Cookies : ", req.cookies);
  res.send('Look in the console for cookies');
});

app.get('/deletecookie', function(req, res){
  res.clearCookie('username');
  res.send('username Cookie Deleted');
});

// var session = require('express-session');

// var parseurl = require('parseurl');

// app.use(session({
//   resave: false,
//   saveUninitialized: true,
//   secret: credentials.cookieSecret,
// }));

// app.use(function(req, res, next){
//   var views = req.session.views;

//   if(!views){
//     views = req.session.views = {};
//   }

//   var pathname = parseurl(req).pathname;

//   views[pathname] = (views[pathname] || 0) + 1;

//   next();

// });

// app.get('/viewcount', function(req, res, next){
//   res.send('You viewed this page ' + req.session.views['/viewcount'] + ' times');
// });

// var fs = require("fs");

// app.get('/readfile', function(req, res, next){
//   fs.readFile('./public/randomfile.txt', function(err, data){
//       if(err){
//         return console.error(err);
//       }
//       res.send("the File : " + data.toString());
//   });
// });

// app.get('/writefile', function(req, res, next){
//   fs.writeFile('./public/randomfile2.txt',
//     'More random text', function(err){
//       if(err){
//         return console.error(err);
//       }
//     });

//   fs.readFile('./public/randomfile2.txt', function(err, data){
//     if(err){
//       return console.error(err);
//     }
//     res.send("The File " + data.toString());
//   });

// });

var endpoints = require("./endpoints.js");

app.post('/api/login', endpoints.login);
app.post('/api/signup', endpoints.signup);

app.get('/api/:userId', endpoints.getUserPets);
app.post('/api/:userId', endpoints.addPet);

app.get('/api/:userId/:petId', endpoints.getSpecificPet);
app.put('/api/:userId/:petId', endpoints.editPet);
app.delete('/api/:userId/:petId', endpoints.deletePet);

/**
      START OF MESSAGING ENDPOINT SECTION
*/

// Format of data to be sent:
// {"id"(optional): "1234", "message": "dinosaurus rex"}
// -value of id doesn't have to be a string

// Example CURL call (works for this one):
// curl -H "Content-Type: application/json" --request POST --data '{"message": "bam"} http://localhost:3000/api/messages 
app.post('/api/messages', endpoints.addMessage);

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
app.get('/api/messages', endpoints.getMessages);

app.delete('/api/messages/:messageId', endpoints.deleteMessage);


// Need specific endpoint of 1234 (/api/messages/1234) ?
// (according to assignment specs)

/**     
      END MESSAGING ENDPOINT SECTION
*/




app.use(function(req, res){
  res.type('text/html');
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500);
  res.render('500');
});

//app listens on port 3000
app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + ' press Ctrl-C to terminate');
});


//installed body parser
//instaled formidable to parse images