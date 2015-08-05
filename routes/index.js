var express = require('express');
var passport = require('passport');
var router = express.Router();
var mysql = require('mysql');
var dbconfig = require('./db');
var connection = mysql.createConnection(dbconfig.connection);

connection.query('USE ' + dbconfig.database);


router.get('/', function (req, res) {
    res.redirect('/login');
});

router.get('/register', function(req, res) {
    res.render('register');
});

router.post('/register', passport.authenticate('local-signup',  { failureRedirect: '/login' }), 
    function(req, res){
        if(!req.user){
            console.log("auth failed?")
        }
        else{
            var queryString = "UPDATE users SET fName = ?, lName = ?, email = ? WHERE username = ?"
            
            connection.query(queryString,[req.body.firstname, req.body.lastname, req.body.email, req.body.username], function(err){
                if(err){
                    console.log(err)
                }
                else{
                    res.redirect('/home');
                }
            });
        }
});


router.get('/login', function(req, res) {
    res.render('login', { user : req.user });
});

router.post('/login', passport.authenticate('local-login',  {
    successRedirect : '/home', // redirect to the secure profile section
    failureRedirect : '/login', // redirect back to the signup page if there is an error
    failureFlash : false // allow flash messages
}));

router.get('/home', function(req, res) {
    if(!req.user){
        res.redirect('/');
    }
    res.render('home', { user : req.user });
});

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

module.exports = router;