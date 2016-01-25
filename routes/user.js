var express = require('express');
var cookbook = require('cookbook');
var router = express.Router();

// get mijn_account
router.get('/', function(req, res){

  //define user
  if(!req.session.level){
    cookbook.user_not_defined(req,res);
  }

  //check login
  if(req.session.level < 1){
    res.render('login',{
      error: 'Je moet ingelogd zijn om die pagina te kunnen bekijken.',
      postUrl: '/login',
      level: req.session.level
    })
  }else{
    req.getConnection(function(err, connection){
      //count coupons made by user
      connection.query('SELECT count(gebruiker_ID) AS aantal_coupons FROM coupon WHERE gebruiker_ID = ? ',[req.session.userID], function(err, coupons_gemaakt) {
        // console.log(coupons_gemaakt);
        //get coupons made by user
        connection.query('SELECT * FROM coupon WHERE gebruiker_ID = ? ',[req.session.userID], function(err, gemaakte_coupons) {
          // console.log(aantal_coupons);
          // console.log(gemaakte_coupons);
          //parameters -> number of created coupons AND results of created coupons
          render(coupons_gemaakt,gemaakte_coupons);
        });
      });

      //render function
      var render = function(coupons_gemaakt,gemaakte_coupons){
        //select user
      connection.query('SELECT * FROM gebruiker WHERE id = ?',[req.session.userID], function(err, result) {
        user_obj = result[0];
        // console.log(user_obj);
        //render user
        res.render('user/index', {
          user_obj: user_obj,
          level: req.session.level,
          coupons_gemaakt: coupons_gemaakt[0].aantal_coupons,
          coupons_over: user_obj.coupons - coupons_gemaakt[0].aantal_coupons,
          gemaakte_coupons: gemaakte_coupons
        });
      });
    }
    });
  }
});

//get generated coupon
router.get('/generate_coupon/:id', function(req, res){
  var user_id = req.params.id;

  //define user
  if(!req.session.level){
    cookbook.user_not_defined(req,res);
  }

  //check login
  if(req.session.level < 1){
    res.render('login',{
      error: 'Je moet ingelogd zijn om die pagina te kunnen bekijken.',
      postUrl: '/login',
      level: req.session.level
    })
  }else{
    //generate new coupon based on time and user_id
    var new_coupon = cookbook.time() + user_id;
    //connection
    req.getConnection(function(err, connection){
      //count coupons made by user
      connection.query('SELECT count(gebruiker_ID) AS aantal_coupons FROM coupon WHERE gebruiker_ID = ? ',[user_id], function(err, aantal_coupons) {
        // console.log(aantal_coupons);
        total_coupons(aantal_coupons);
      });
      //function total_coupons
      var total_coupons = function(aantal_coupons){
      //get all coupons user is allowed to make
      connection.query('SELECT coupons FROM gebruiker WHERE ID = ?',[user_id], function(err, coupons_over) {
        // console.log(coupons_over);
        // console.log(aantal_coupons);
        //check if user may make coupon
        if(aantal_coupons[0].aantal_coupons < coupons_over[0].coupons){
              //insert coupon
              connection.query('INSERT INTO coupon (code,gebruikt,gebruiker_ID) VALUES (?,?,?) ',[new_coupon,false,user_id], function(err, result) {
                    res.render('user/coupon', {
                          coupon: new_coupon,
                          level: req.session.level,
                          title: 'Uw coupon is gemaakt!'
                    });
              });
        }else{
              res.render('user/coupon', {
                    coupon: 'Sorry, u mag geen coupons meer maken!',
                    level: req.session.level,
                    title: 'Uw coupon is niet aangemaakt'
              });
        }
      });
      }
    });
  }
});

module.exports = router;
