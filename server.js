//imports from packages

var express = require('express');

var app = express();

app.disable('x-powered-by'); //blocks header from containing info about our server, for security reasons

var handlebars = require('express-handlebars').create({defaultLayout:'main'});
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

app.use(require('body-parser').urlencoded({extended: true}));



//var fs = require("fs");

var session = require('express-session');

var parseurl = require('parseurl');

var Tokens = require('csrf');
var tokens = new Tokens();

//imports from local

//credentials, for cookies, to help with security
var credentials = require('./credentials.js');
//session secret replaced with automatic token from csrf

//organize endpoints in another file
var endpoints = require('./endpoints.js');

//middleware

//cookie reader
app.use(require('cookie-parser')(credentials.cookieSecret));

//allows for static service???
app.use(express.static(__dirname + '/public'));

//Very basic logging, use morgan instead?
app.use(function(err, req, res, next){
  console.log('Error : ' + err.message);
  next();
});

//session management?
app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: credentials.cookieSecret,
}));

//view counter?? counts for all pages
app.use(function(req, res, next){
  var views = req.session.views;

  if(!views){
    views = req.session.views = {};
  }

  var pathname = parseurl(req).pathname;

  views[pathname] = (views[pathname] || 0) + 1;

  next();

});

//endpoints

//api (part of spec)



//web application components

//localhost3000/
/*
GET
Endpoint for home page/search
*/
app.get('/', function(req, res){
  res.render('home'); //references home handlebar
});

/*
GET
Endpoint for about page/pet spotlight
*/
app.get('/petspotlight', function(req, res){
  res.render('about');
});


/*
GET
Endpoint for profile page/login
*/
//csrf token generated by cookie and form data, verified when posting
app.get('/profile', function(req, res){
  req.session.csrf = tokens.secretSync();  
  var token = tokens.create(req.session.csrf);
    
  res.render('profile', { csrf: token});
});

/*
GET
Endpoint for thank you page
*/
app.get('/thankyou', function(req, res){
  res.render('thankyou');
});

//utilities

//perhaps rename to login?
app.post('/process', function(req,res){
  console.log('Form : ' + req.query.form);
  //console.log('CSRF token : ' + req.body._csrf);
  console.log('Email : ' + req.body.email);
  console.log('Question : ' + req.body.ques);
  
  //check csrf token
  if (!tokens.verify(req.session.csrf, req.body._csrf)) {
      throw new Error('invalid token!')
  }
  else {
      console.log("token looks ok");
  }
  
  res.redirect(303, '/thankyou');
});

/*
GET
Endpoint for starting the file upload process.
*/
app.get('/file-upload', function(req, res){
  var now = new Date();
  res.render('file-upload',{
    year: now.getFullYear(),
    month: now.getMonth() 
    });
 });
 
 
 /*
POST
Endpoint for sending the file.
takes in scary form data...
Not sure how it works
*/
app.post('/file-upload/:year/:month', function(req, res){
    var form = new formidable.IncomingForm(); //parsing file
    form.parse(req, function(err, fields, file){
      if(err)
        return res.redirect(303, '/error');
      console.log('Received File');

      console.log(file);
      res.redirect( 303, '/thankyou');
  });
});

//debugging

/*
GET
Endpoint for listing cookies.
*/
app.get('/listcookies', function(req, res){
  console.log("Cookies : ", req.cookies);
  res.send('Look in the console for cookies');
});


/*
POST
Endpoint for deleting cookies. Don't know if we'll use it?
*/
app.post('/deletecookie', function(req, res){
  res.clearCookie('username');
  res.send('username Cookie Deleted');
});


//???
/* 

app.get('/junk', function(req, res, next){
  console.log('Tried to access /junk');
  throw new Error('/junk doesn\'t exist');
});

app.get('/cookie', function(req, res){
  res.cookie('username', 'Derek Banas', {expire: new Date() + 9999}).send('username has the value of Derek Banas');
});


//might be useful when databases come
app.get('/readfile', function(req, res, next){
  fs.readFile('./public/randomfile.txt', function(err, data){
      if(err){
        return console.error(err);
      }
      res.send("the File : " + data.toString());
  });
});

app.get('/writefile', function(req, res, next){
  fs.writeFile('./public/randomfile2.txt',
    'More random text', function(err){
      if(err){
        return console.error(err);
      }
    });

  fs.readFile('./public/randomfile2.txt', function(err, data){
    if(err){
      return console.error(err);
    }
    res.send("The File " + data.toString());
  });

});
 */
 
 //last endpoints to cover all remaining bases
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
 
 
//set port
app.set('port', process.env.PORT || 3000); //web app runs on port 3000

//app listens on port 3000
app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + ' press Ctrl-C to terminate');
});


//installed body parser
//instaled formidable to parse images