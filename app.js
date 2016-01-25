var express = require('express');
var path = require('path');
var fs = require('fs');
var session = require('express-session');
var mysql = require('mysql');
var myConnection = require('express-myconnection');
var bodyParser = require('body-parser');
var multer = require('multer');
var cookbook = require('cookbook');

var app = express();

// MYSQL connection
app.use(myConnection(mysql, {
	host: '127.0.0.1',
	user: 'root',
	password: 'Krokodil3',
	database: 'mydb',
	port: 3306
}, 'single'));

// Routes
var userRoutes = require('./routes/user');
var receptenRoutes = require('./routes/recepten');
var loginRoutes = require('./routes/login');
var mijn_receptenRoutes = require('./routes/mijn_recepten');
var filesRoutes = require('./routes/files');
var settingsRoutes = require('./routes/settings');

// Puplic
app.use(express.static('public')); // to add CSS
app.use(bodyParser.urlencoded({extended: true}));

// Uploaden
var upload = multer({dest: 'public/uploads/'});

// Ejs
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Sessions
app.use(session({
  secret: 'very-secure',
  saveUninitialized: true,
  resave: false
}));

// Routes
app.use('/user', userRoutes);
app.use('/recepten', receptenRoutes);
app.use('/login', loginRoutes);
app.use('/mijn_recepten', mijn_receptenRoutes);
app.use('/settings', settingsRoutes);
app.use('/files', upload.single('bs-file'), filesRoutes);

// get
app.get('/', function(req, res,next) {

	//define user
	if(!req.session.level){
		cookbook.user_not_defined(req,res);
	}

	//get connection
	req.getConnection(function(err, connection) {
		//get recepten
		connection.query('SELECT * FROM recept', function(err, result) {
			var new_array = [];

			//function 3 random recepten
			var randomPicker = function(){
				return Math.floor(Math.random() * result.length);
			}

			var three_random = true;
			while(three_random){
				new_array = [];
				for(var i = 0;i<3;i++){
					new_array.push(randomPicker());
				}
				if(new_array[0] != new_array[1] && new_array[0] != new_array[2] && new_array[1] != new_array[2]){
					three_random = false;
					console.log(new_array);
				}
			}

			//render function
			render(result,new_array);
		});
	});

	//render home
	var render = function(result, new_array) {
		res.render('index', {
			page: 'home/index',
			title: 'Cookbook',
			title_capation: 'A cookbook that wil change your perspective in cooking..',
	    level: req.session.level,
			recepten: result,
			numbers: new_array
		});
	}
});

// start
app.listen(3000, function(){
  console.log('Started!');
});
