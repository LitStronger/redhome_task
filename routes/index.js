var express = require('express');
var path = require('path');
var config = require('../config');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile(config.path+"/index.html");
});
router.get('/get_msg', function(req, res, next) {
  res.sendFile(config.path+"/la.html");
});

module.exports = router;
