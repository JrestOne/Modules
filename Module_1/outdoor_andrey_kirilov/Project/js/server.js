var express = require('express');
var app = express();
var port = process.env.PORT || 4300;
var bodyParser = require('body-parser');
var bcrypt = require('bcrypt');
var salt = bcrypt.genSaltSync(10);

const path = require('path');
const pg = require('pg');
const connectStr = process.env.DATABASE_URL || 'postgres://postgres:vdhnn_4623@localhost:5432/postgres';
app.use(express.static(path.join(__dirname + '/../' + 'public')));
app.use(bodyParser());



console.log("server  is running on port 3000");



app.post('/register', function(req, res){
    console.log('update user init');
//         var id = req.body.id;
         var user_account = req.body.username;
         var email = req.body.email;
         var password = req.body.password;
         var roles = 'user';
         var hash = bcrypt.hashSync(password, salt);

         console.log('server update user data'+' - ' + user_account, email, password);
         bcrypt.hash(password, 10, function(err, hash) {
            console.log('Incorrect')
         });
         bcrypt.compare(password, hash, function(err, res) {
            console.log('Correct')
         });

         console.log('hash here')
         console.log(hash);

         pg.connect(connectStr, function(err, client, done){
            if (err){
                return console.error('connect error', err);
            }
//            console.log(user_account, email, password)
            client.query('INSERT into users (user_account, email, password, roles) values ($1, $2, $3, $4)',[user_account, email, hash, roles], function(err, result){
             if (err){
                return console.error('query error', err);
             }
             console.log('successful');

             res.redirect('/index.html');
             });
         done();
         });

});


app.get('/login', function (req, res) {

    var check= false;
    var login= req.query.login;
    var pass= req.query.pass;
    var hash = bcrypt.hashSync(pass, salt);
    var a = {};
    console.log('server takes this data '+ login + ' and ' + pass);


    pg.connect(connectStr, function(err, client, done){
        if (err){
            return console.error('connect error', err);
        }
        const query = client.query("SELECT * FROM users WHERE user_account = $1", [login], function(err, result){
            if (err){
                return console.error('query error', err);
            }
            query.on("row", function (row, result) {
                console.log('123321');
                result.addRow(row);
            });

            query.on("end", function (result, pass) {
                console.log('users get server' + JSON.stringify(result.rows, null, "    "));

                console.log('password of user is '+ result.rows[0].password);
                bcrypt.hash(pass, salt, function(err, res) {
                    if(err){
                        console.log('Error in hashing entered password');
                    }
                });


                console.log('Entered password is '+hash);

                bcrypt.compare(pass, hash, function(err, res, result) {
                    if(err) {
                        console.log('passwords don`t compare');
                        return 0;

                    }
                    console.log('I will return login '+ result);
                    console.log('I will return password '+ result.rows[0].password);
                    check = true;
                });
                if (check == true){
                    return res.json(result);
                }
                else {
                    console.log('Passwords don`t compare')
                    return 0;
                }

                client.end();
            });
        });

    });


 });


app.listen(port);