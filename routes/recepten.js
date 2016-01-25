var express = require('express');
var cookbook = require('cookbook');
var router = express.Router();

// get user
router.get('/', function(req, res) {

  //define user
  if (!req.session.level) {
    cookbook.user_not_defined(req, res);
  }

  //connection
  req.getConnection(function(err, connection) {
    //get recepten
    connection.query('SELECT * FROM recept', function(err, result) {
      //get ratings
      connection.query('SELECT AVG(rating.rating) AS avg, rating.rating, recept.ID, rating.recept_ID FROM recept JOIN rating ON recept.ID = rating.recept_ID GROUP BY recept.ID', function(err, star) {
        console.log(star);
        //render function
        render(result,star);
      });
    });
  });

  //render recept
  var render = function(result, star) {
    res.render('recepten/index', {
      level: req.session.level,
      recepten: result,
      star: star
    });
  }
});

//get recept_enkel + id
router.get('/:id', function(req, res) {

  //define user
  if (!req.session.level) {
    cookbook.user_not_defined(req, res);
  }

  var id = req.params.id;

  //connect
  req.getConnection(function(err, connection) {
    //view
    //get all recepts + users
    connection.query('SELECT recept.ID, recept.gebruiker_ID, recept.titel, recept.beschrijving_kort, recept.beschrijving_lang, recept.foto_time, recept.beoordeling, gebruiker.voornaam, gebruiker.achternaam, gebruiker.leeftijd FROM recept JOIN  gebruiker ON recept.gebruiker_ID = gebruiker.ID WHERE recept.ID = ?', [id], function(err, result) {
      if (!err) {
        //get ratings of recepts
        connection.query('SELECT AVG(rating.rating) AS avg, rating.rating, recept.ID, rating.recept_ID FROM recept JOIN rating ON recept.ID = rating.recept_ID WHERE recept.ID = ? GROUP BY recept.ID', [id] , function(err, star) {
        var recept = result[0];

        //check if user is owner of recept
        if(recept.gebruiker_ID == req.session.userID){
          res.render('recepten/recept_enkel', {
            level: req.session.level,
            recept: recept,
            link : '/mijn_recepten/'+recept.ID,
            star_rating : false,
            user_ID : req.session.userID,
            star: star,
            disable_star : false
          });
        }else{
          //user is guest
          if(req.session.level < 1){
            res.render('recepten/recept_enkel', {
              level: req.session.level,
              recept: recept,
              link : false,
              star_rating : false,
              user_ID : req.session.userID,
              star: star,
              disable_star : false
            });
          }else{
            //user is logged in and may rate recept
            //get times user had rated recept
            connection.query("SELECT count(rating) AS count, rating.ID FROM rating WHERE rating.recept_ID = ? AND gebruiker_ID = ?", [id,req.session.userID], function(err, results_star) {
                console.log(id);
                console.log(req.session.userID);
                console.log(results_star);
                var allowed_to_rate = false;
                console.log(results_star[0].count);

                //check if user may rate (user is 1 time allowed to rate)
                if(results_star[0].count >= 1){
                  //not allowed to rate
                  allowed_to_rate = true;
                }else{
                  //allowed to rate
                  allowed_to_rate = false;
                }
                res.render('recepten/recept_enkel', {
                  level: req.session.level,
                  recept: recept,
                  link : false,
                  star_rating : true,
                  user_ID : req.session.user_ID,
                  star: star,
                  disable_star : allowed_to_rate
                });
            });
          }
        }
      })
      } else {
        console.log('Error while performing Query.');
      }
    });
  });
});

//post rate of recept
router.post('/rate_recept/:id', function(req, res) {
  var recept_id = req.params.id;
  var rating = req.body.rate_id;
  var user_id = req.session.userID;

  //connection
  req.getConnection(function(err, connection) {
    console.log(rating);
    //get times user had rated recept
    connection.query("SELECT count(rating) AS count FROM rating WHERE recept_ID = ? AND gebruiker_ID = ?", [recept_id,user_id], function(err, results) {
      if (!err) {
        //check if user may rate
        // console.log(results);
        if(results[0].count > 0){
          res.redirect('/recepten/' + recept_id);
        }else{
          //insert rate
          connection.query("INSERT INTO rating (rating,gebruiker_ID,recept_ID) VALUES (?,?,?)", [rating,user_id,recept_id], function(err, results) {
            if (!err) {
              res.redirect('/recepten/' + recept_id);
            } else {
              console.log('Error while performing Query.');
            }
          });
        }
      } else {
         console.log('Error while performing Query.');
      }
  });
  });
});

module.exports = router;
