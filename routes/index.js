var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/lol', function(req, res, next) {
  var value = req._parsedOriginalUrl.query.replace('params=','');
  if (value > Math.floor(Math.random()*100)) {
    res.send(true);
  } else {
    res.send(false);
  }

  //res.send('azaza');
});

module.exports = router;
