var express = require('express');

var app = express();

app.disable('x-powered-by'); //blocks header from containing info about our server, for security reasons

var handlebars = require('express-handlebars').create({defaultLayout:'main'});
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

app.set('port', process.env.PORT || 3000); //web app runs on port 3000

app.use(express.static(__dirname + '/public'));
//localhost3000/
app.get('/', function(req, res){
  res.render('home'); //references home handlebar
});

//app listens on port 3000
app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + ' press Ctrl-C to terminate');
});
