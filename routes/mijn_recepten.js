var express = require('express');
var cookbook = require('cookbook');
var bodyParser = require('body-parser');
var router = express.Router();

//get mijn_recepten
router.get('/', function(req, res) {

  //define user
  if (!req.session.level) {
    cookbook.user_not_defined(req, res);
  }

  //check if logged in
  if (req.session.level < 1) {
    res.render('login', {
      error: 'Je moet ingelogd zijn om die pagina te kunnen bekijken.',
      postUrl: '/login',
      level: req.session.level
    })
  } else {
    req.getConnection(function(err, connection) {

      //load user recepten
      connection.query('SELECT * FROM recept WHERE gebruiker_ID = ?', [req.session.userID], function(err, result) {
        //load user ratings
        connection.query('SELECT AVG(rating.rating) AS avg, rating.rating, recept.ID, rating.recept_ID FROM recept JOIN rating ON recept.ID = rating.recept_ID GROUP BY recept.ID', function(err, star) {
          // console.log(result);
          //render function
          render(result,star);
        });
      });
    });
  }
  var render = function(result,star) {
    //render mijn_recepten
    res.render('mijn_recepten/index', {
      gebruiker: req.session.voornaam,
      level: req.session.level,
      recepten: result,
      star: star
    });
  }
});

//post add_recept
router.post('/add_recept', function(req, res) {
  req.getConnection(function(err, connection) {
    //create new recept
    var new_recept = {
      beschrijving_lang: req.body.form_omschrijving_lang,
      beschrijving_kort: req.body.form_omschrijving_kort,
      titel: req.body.form_titel,
      gebruiker_ID: req.session.userID
    };
    // console.log(new_recept);
    //insert new recept
    connection.query("INSERT INTO recept (titel,beschrijving_kort,beschrijving_lang,gebruiker_ID) VALUES (?,?,?,?)", [new_recept.titel, new_recept.beschrijving_kort, new_recept.beschrijving_lang, new_recept.gebruiker_ID], function(err, results) {
      var new_id = results.insertId;
      //set default rating from new recept
      connection.query("INSERT INTO rating (rating,recept_ID,gebruiker_ID) VALUES (?,?,?)", [4,new_id,1], function(err, results) {
        res.redirect('/mijn_recepten');
      });
    });
  });
});

//post update recept + id
router.post('/update_recept/:id', function(req, res) {
  console.log(req.session.userID);
  console.log(req.body.gebruiker_ID);
  //check user = recept_id
  if (req.session.userID == req.body.gebruiker_ID) {
    //get connection
    req.getConnection(function(err, connection) {
      //get vars
      var recept_id = req.params.id;
      var new_recept = {
        beschrijving_lang: req.body.form_omschrijving_lang,
        beschrijving_kort: req.body.form_omschrijving_kort,
        titel: req.body.form_titel
      };
      //update recept for new id
      connection.query("UPDATE recept SET ? WHERE ID = ? ", [new_recept, recept_id], function(err, results) {
          res.redirect('/mijn_recepten');
      });
    });
  } else {
    res.redirect('/login');
  }
});

//post delete recept + id
router.post('/delete/:id', function(req, res) {
  //check user is the same user
  if (req.body.gebruiker_ID == req.session.userID) {
    //connection
    req.getConnection(function(err, connection) {
      //check if same recept
      if (req.params.id === req.body.recept_ID) {
        //delete recept and the ratings from recept
        connection.query("DELETE recept, rating FROM recept, rating WHERE rating.recept_ID = recept.ID AND recept.ID = ?", [req.params.id], function(err, results) {
          if (!err) {
          res.redirect('/mijn_recepten');
          } else {
            console.log('Error while performing Query.');
          }
        });
      }
    });
  } else {
    res.redirect('/login');
  }
});

//get add recept
router.get('/add_recept_enkel', function(req, res) {

  //define user
  if (!req.session.level) {
    cookbook.user_not_defined(req, res);
  }
  //check login
  if (req.session.level < 1) {
    res.render('login', {
      error: 'Je moet ingelogd zijn om die pagina te kunnen bekijken.',
      postUrl: '/login',
      level: req.session.level
    })
  } else {
    //render recepten
    res.render('mijn_recepten/add_recept_enkel', {
      level: req.session.level,
      postUrl: 'add_recept'
    });
  }
});

//get id -> to edit
router.get('/:id', function(req, res) {
  //define user
  if (!req.session.level) {
    cookbook.user_not_defined(req, res);
  }
  //check login
  if (req.session.level < 1) {
    res.render('login', {
      error: 'Je moet ingelogd zijn om die pagina te kunnen bekijken.',
      postUrl: '/login',
      level: req.session.level
    })
  } else {
    var id = req.params.id;
    req.getConnection(function(err, connection, data) {
      //select params.id recept
      connection.query('SELECT * FROM recept WHERE id = ?', [id], function(err, result) {
        if (!err) {
          //select rating from recept, get avg
          connection.query('SELECT AVG(rating.rating) AS avg, rating.rating, recept.ID, rating.recept_ID FROM recept JOIN rating ON recept.ID = rating.recept_ID WHERE recept.ID = ? GROUP BY recept.ID', [id] , function(err, star) {
            var recept = result[0];
            //check if user may edit
            if(recept.gebruiker_ID == req.session.userID){
            //set session recept id
            req.session.recept_id = recept.ID;
            res.render('mijn_recepten/edit_recept_enkel', {
              level: req.session.level,
              recept: recept,
              postUrl: '/mijn_recepten/update_recept/' + recept.ID,
              star: star
            });
          }else{
            res.redirect('/mijn_recepten');
          }
        });
        } else {
          console.log('Error while performing Query.');
        }
      });
    });
  }
});



module.exports = router;
