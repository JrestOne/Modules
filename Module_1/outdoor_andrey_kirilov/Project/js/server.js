var express = require('express');
var app = express();
var port = process.env.PORT || 4900;
var bodyParser = require('body-parser');
var bcrypt = require('bcrypt');
var salt = bcrypt.genSaltSync(10);
var cookieParser = require('cookie-parser');
var session = require('express-session');

const passport = require('passport');

const RedisStore = require('connect-redis')(session);
const path = require('path');
const pg = require('pg');

var knex = require('knex')({
  client: 'pg',
  connection: process.env.DATABASE_URL || 'postgres://postgres:123@localhost:5432/postgres',
  searchPath: 'knex,public'
});

const connectStr = process.env.DATABASE_URL || 'postgres://postgres:123@localhost:5432/postgres';
const LocalStrategy = require('passport-local').Strategy;

app.use(express.static(path.join(__dirname + '/../' + 'public')));
app.use(bodyParser());
app.use(cookieParser());
app.use(session({ secret: 'SECRET' }));
app.use(passport.initialize());
app.use(passport.session());

console.log("server  is running");

passport.serializeUser(function(user, done) {
     done(null, user.username);
 });

 passport.deserializeUser(function(username, err, done) {
//     knex('users').where({ username }).first();
     done(err);
 });



passport.use(new LocalStrategy( function(username, password, done) {
  // check to see if the username exists
    knex('users').where({ username }).first()
    .then(function(user) {
        if (!user){
            return done(null, false);
        }
        if (!comparePass(password, user.password)) {
            console.log('Passwords don`t compare');
            return done(null, false);
        } else {
            console.log('Nice, passwords are compare');
            return done(null, user);
        }
    })
    .catch((err) => {

        return done(err);
    });
}));



function comparePass(userPassword, databasePassword) {
  return bcrypt.compareSync(userPassword, databasePassword);
}

module.exports = {
  comparePass
};


app.post('/register', function(req, res){
    console.log('update user init');
    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;
    var roles = 'user';
    var hash = bcrypt.hashSync(password, salt);

    console.log('server update user data'+' - ' + username, email, password);
    bcrypt.hash(password, 10, function(err, hash) {
        console.log('Password hashed')
    });
    bcrypt.compare(password, hash, function(err, res) {
        console.log('Passwords are compared')
    });

    console.log('hash here')
    console.log(hash);


    pg.connect(connectStr, function(err, client, done){
        if (err){
            return console.error('connect error', err);
        }

        client.query('INSERT into users (username, email, password, roles) values ($1, $2, $3, $4)',[username, email, hash, roles], function(err, result){
        if (err){
            return console.error('query error', err);
        }
        console.log('successful');

        res.redirect('/index.html');
        });
    done();
    });
});


app.post('/login',passport.authenticate('local'),function(req,res){
    console.log('Started to login');
    res.send(req.user);

});


app.get('/loggedin', function(req, res) {
    res.send(req.isAuthenticated() ? req.user : '0');
});



app.listen(port);