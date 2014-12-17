var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('main');
});

router.get('/merchants', function(req, res) {
  res.render('main');
})

//TODO why doesn't this work?
router.get('/merchants/:id', function( req, res) {
  res.render('main');
})

module.exports = router;
