var express = require('express');
var cookbook = require('cookbook');
var router = express.Router();

// get settings
router.get('/', function(req, res){

  //define user
  if(!req.session.level){
    cookbook.user_not_defined(req,res);
  }

  //check if admin login
  if(req.session.level < 2){
    //if not logged in at al, user will be redirected from /mijn_recepten to /login
    res.redirect('/mijn_recepten');
  }else{
    //connection
    req.getConnection(function(err, connection){
      //get users
      connection.query('SELECT * FROM gebruiker',[req.session.userID], function(err, result) {
        // console.log(result);
        res.render('settings/index', {
          result: result,
          level: req.session.level
        });
      });
    });
  }
});

//get edit user
router.get('/edit_user/:id', function(req, res){

  //define user
  if(!req.session.level){
    cookbook.user_not_defined(req,res);
  }

  //check if admin login
  if(req.session.level < 2){
    res.redirect('/mijn_recepten');
  }else{
    //get edit user id
    var edit_id = req.params.id;
    //connection
    req.getConnection(function(err, connection){
      //select user
      connection.query('SELECT * FROM gebruiker WHERE ID = ?',[edit_id], function(err, result) {
        var result_obj = result[0];
        if(err) return next(err);
          // console.log(result);
          //render user
          res.render('settings/edit_user', {
            result : result_obj,
            level: req.session.level
          });
      });
    });
  }
});

//post edit user
router.post('/update_user/:id', function(req, res) {
  //check if user is admin
  if (req.session.level >= 2) {
    //connection
    req.getConnection(function(err, connection) {
      //create user
      var temp_user_id = req.params.id;
      var update_user = {
        voornaam: req.body.voornaam,
        achternaam: req.body.achternaam,
        leeftijd: req.body.leeftijd,
        level: req.body.level,
        gebruikersnaam: req.body.gebruikersnaam,
        wachtwoord: req.body.wachtwoord,
        coupons: req.body.coupons
      };
      // console.log(update_user);
      //update user
      connection.query("UPDATE gebruiker SET ? WHERE ID = ? ", [update_user, temp_user_id], function(err, results) {
        //redirect to updated user
        res.redirect('/settings/edit_user/' + temp_user_id);
      });
    });
  } else {
    res.redirect('/login');
  }
});

module.exports = router;
