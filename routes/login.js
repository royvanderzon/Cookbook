var express = require('express');
var cookbook = require('cookbook');
var router = express.Router();

// get login
router.get('/', function(req, res){

  //define user
  if(!req.session.level){
    cookbook.user_not_defined(req,res);
  }

  //render login
  res.render('login', {
    postUrl: '/login',
    error: false,
    level: req.session.level
  });
});

//get register
router.get('/registreer', function(req, res){

  //define user
  if(!req.session.level){
    cookbook.user_not_defined(req,res);
  }

  //check coupon session
  if(!req.session.registeer){
    res.render('login', {
        postUrl: '/login',
        error: 'Voor uw aanmelding moet u eerst een geldige coupon code opgeven.',
        level: req.session.level
      });
  }else{
    // console.log(req.session.registeer);
    // console.log(req.session.coupon_code);
    res.render('login/registreer', {
        error: false,
        postUrl: '/login/complete_user',
        level: req.session.level
      });
  }
});

//register user
router.post('/complete_user', function(req, res){

  //check session
  if(!req.session.registeer){
    res.render('login', {
        postUrl: '/login',
        error: 'Voor uw aanmelding moet u eerst een geldige coupon code opgeven.',
        level: req.session.level
      });
  }else{
    // console.log(req.session.registeer);
    // console.log(req.session.coupon_code);
    //create new obj for new user
      var obj = {
        gebruikersnaam : req.body.gebruikersnaam,
        wachtwoord : req.body.wachtwoord,
        voornaam : req.body.voornaam,
        achternaam : req.body.achternaam,
        leeftijd : req.body.leeftijd
      }
      // console.log(obj);
      req.getConnection(function(err, connection) {
        if (err) return next(err);
        //query for check if username exists
        connection.query('SELECT gebruikersnaam FROM gebruiker WHERE gebruikersnaam = ?',[obj.gebruikersnaam], function(err, user_check) {
          console.log(user_check);
          if(user_check.length>0){
            //gebruiker bestaat
            console.log('gebruiker bestaat');
            res.render('login/registreer', {
                error: 'De gebruikersnaam die u heeft gekozen bestaal al.',
                postUrl: '/login/complete_user',
                level: req.session.level
              });
          }else{
            console.log('gebruiker bestaat niet');
            //gebruiker bestaat niet
            //query insert user
            connection.query('INSERT INTO gebruiker (voornaam,achternaam,wachtwoord,leeftijd,level,gebruikersnaam,coupons) VALUES (?,?,?,?,?,?,?)',[obj.voornaam,obj.achternaam,obj.wachtwoord,obj.leeftijd,'1',obj.gebruikersnaam,'2'], function(err, results) {
              //disable user register
              req.session.registeer = false;
              //query for uncheck coupon
              connection.query('UPDATE coupon SET gebruikt = 1 WHERE code = ?',[req.session.coupon_code], function(err, results) {
              res.render('login', {
                  postUrl: '/login',
                  error: 'Bedankt voor uw aanmelding, u kunt nu inloggen met uw account!',
                  level: req.session.level
                });
              });
            });
          }
        });
      });
    }
});

//post - check coupon
router.post('/register', function(req, res){

  var coupon_input = req.body.coupon_code;

  //make connection with workbench
  req.getConnection(function(err, connection) {
    if (err) return next(err);
    //get coupon
    connection.query('SELECT * FROM coupon WHERE code = ?',[coupon_input], function(err, results) {
      // console.log(results);
      if (!err) {
        //check if coupon exist
        if(results.length>0){
          // console.log(results);
          //check if coupon is used
          if(results[0].gebruikt == 1){
            res.render('login', {
                postUrl: '/login',
                error: 'Uw couponcode is al gebruikt.',
                level: req.session.level
              });
          }else{
            //coupon code is not used AND exist
            // console.log(results);
            req.session.registeer = true;
            req.session.coupon_code = coupon_input;
            res.redirect('/login/registreer');
          }
        //coupon don't exist
        }else{
          res.render('login', {
              postUrl: '/login',
              error: 'Uw opgegeven coupon code was onjuist.',
              level: req.session.level
            });
        }
      } else {
        console.log('Error while performing Query.');
      }
    });

  });
});


// post login
router.post('/', function(req, res){
  //get variables from login
  var username = req.body.username;
  var password = req.body.password;

  //make connection with workbench
  req.getConnection(function(err, connection) {
    if (err) return next(err);
    //check user
    connection.query('SELECT * FROM gebruiker WHERE gebruikersnaam = ? AND wachtwoord = ?',[username,password], function(err, results) {
      // console.log(results);
      if (!err) {
        //if > 0, user exist
        if(results.length>0){
          //login user
          cookbook.user_login(req,res,results,0);
          res.redirect('mijn_recepten');
        }else if(!req.session.username){
          res.render('login', {
              postUrl: '/login',
              error: 'Gebruikersnaam en/of wachtwoord onjuist.',
              level: req.session.level
            });
        }
      } else {
        console.log('Error while performing Query.');
      }
    });

  });
});

// get logout user
router.get('/logout', function(req, res){
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;
