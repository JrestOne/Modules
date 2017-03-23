var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
 /*Register */
router.get('/register', function(req, res){
    res.render('registration');
});
/* Login*/
router.get('/login', function(req, res){
    res.render('login');
});
/*Register User*/
router.post('/register', function(req, res){
    var user_account = req.body.user_account;
    var email = req.body.email;
    var password = req.body.password;

    console.log(name)
});

module.exports = router;
