var express = require('express');
var cookbook = require('cookbook');
var bodyParser = require('body-parser');
var fs = require('fs');
var router = express.Router();

//post files
router.post('/upload_photo/:id', function(req, res, next) {
  //log vars
  console.log(req.body.gebruiker_ID);
  console.log(req.session.userID);
  console.log(req.params.id);
  if(req.file !== undefined) {
    //make random name
    var uniImg = getDateTime();
    //upload img
    fs.rename(req.file.path, req.file.destination + uniImg + '-' + req.file.originalname, function(err){
      if(err) return next(err);
      var imgName = (uniImg + '-' + req.file.originalname);
      var fileName = {
          // IMAGE : req.file.originalname,
          // foto_time : imgName.trim().replace(/ /g,''),
          foto_time : imgName,
          foto_naam : req.file.originalname,
          // size : req.file.size
        };
        var recept_id_temp = req.params.id;
        console.log(recept_id_temp);
        console.log(fileName);
        //check user
        if(req.body.gebruiker_ID == req.session.userID){
          //save new img name
          req.getConnection(function(err, connection) {
            connection.query("UPDATE recept SET ? WHERE ID = ? ", [fileName, recept_id_temp], function(err, results) {
              res.redirect('/mijn_recepten/' + req.params.id);
            });
          });
        }else{
          res.redirect('/login');
        }
    });
  }
});

//time function
function getDateTime() {
    var date = new Date();
    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;
    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;
    var sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;
    var day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;
    return year + month + day + hour + min + sec;
}

module.exports = router;
