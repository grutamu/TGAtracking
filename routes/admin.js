var express = require('express');
var AdminRouter = express.Router();
var users = require('../models/users');


var bcrypt = require('bcrypt-nodejs');

var mysql = require('mysql');
var dbconfig = require('../models/db');
var connection = mysql.createConnection(dbconfig.connection);

connection.query('USE ' + dbconfig.database);

AdminRouter.get('/', isLoggedInAndAdmin, function(req, res) {
    res.render('admin/admin', { user : req.user });
});


AdminRouter.get('/users', isLoggedInAndAdmin, function(req, res) {

    users.SelectActiveUsers(function(err, UsersData){
        if(err) console.log(err);

        res.render('admin/users', { user : req.user, userQuery: UsersData });
    });
});

AdminRouter.post('/users', isLoggedInAndAdmin, function(req, res) {
    console.log(req.body)
    var userIDs = Object.keys(req.body);

    userIDs.splice(userIDs.indexOf("SubmitButtonSelector"), 1 );

    for(var i =0; i < userIDs.length; i++){

        switch(req.body.SubmitButtonSelector){
            case "archive":
                users.ToggleActiveUserByID(userIDs[i], function(err){
                    if(err) console.log(err);
                });
                break;
        }
    }
    res.redirect('/admin/users');
});

AdminRouter.get('/users/edit',isLoggedInAndAdmin, function(req, res) {

    users.SelectUserByID(req.query.id, function(err, userData){
        //TODO list all Schools as well.

        res.render('admin/users_edit', {user : req.user, userData : userData, schools : {} });
    });
});

AdminRouter.post('/users/edit', isLoggedInAndAdmin, function(req, res) {
	
    users.UpdateUser(req.body, function(err){
        if(err){
            console.log(err)
        }
        res.redirect('/admin/users');
    });
});

AdminRouter.get('/users/new', isLoggedInAndAdmin, function(req, res) {

    //TODO: Add in School Quering when implemented
    res.render('admin/users_new', { user : req.user, schools : {} });
  
});

AdminRouter.post('/users/new', isLoggedInAndAdmin, function(req, res) {

    users.CreateUser(req.body, function(err){
        if(err){
            console.log(err)
        }
        res.redirect('/admin/users');
    })
    
    
});

AdminRouter.get('/district',isLoggedInAndAdmin, function(req, res){


    connection.query("SELECT * FROM districts WHERE is_active = 1", function(err, rows){
        if(err){
            console.log(err)
        }

        res.render('admin/district', { user : req.user , districts : rows});
    })
});

AdminRouter.post('/district', isLoggedInAndAdmin, function(req, res) {

    var distIDs = Object.keys(req.body);
    distIDs.splice(distIDs.indexOf("SubmitButtonSelector"), 1 );

    for(var i =0; i < distIDs.length; i++){

        switch(req.body.SubmitButtonSelector){

            case "archive":
                //Archive Logic here
                break;
        }
    }
    res.redirect('/admin/district');
});

AdminRouter.get('/district/new', isLoggedInAndAdmin, function(req, res){
    res.render('admin/district_new', { user : req.user });
});

AdminRouter.post('/district/new', isLoggedInAndAdmin, function(req, res) {
    console.log(req.body)

    var is_active;
    if(req.body.is_active == "active")
        is_active = 1
    if(req.body.is_active == "inactive")
        is_active = 0

    var newDistrictInfo = { 
        district_name : req.body.district_name, 
        district_address : req.body.district_address,
        district_city : req.body.district_city,
        district_state : req.body.district_state,
        district_zip : req.body.district_zip,
        is_active : is_active
    }

    //TODO: Make this a function? or even more put this in the db.js and only make DB calls from there.
    connection.query("SELECT * FROM districts WHERE district_name = ?",[newDistrictInfo.district_name], function(err, rows) {
        if (err)
            console.log(err);
        if (rows.length) {
            //TODO: Flash something saying "ERR USERNAME TAKEN"
            console.log("district with that name exists!")
            console.log(err)
        } else {
            var queryString = "INSERT INTO districts ( district_name, district_address, district_city, district_state, district_zip, is_active) values ( ?, ?, ?, ?, ?, ? )"

            connection.query(queryString, [
                    newDistrictInfo.district_name,
                    newDistrictInfo.district_address,
                    newDistrictInfo.district_city,
                    newDistrictInfo.district_state,
                    newDistrictInfo.district_zip,
                    newDistrictInfo.is_active
                ], function(err){
                    if(err){
                        console.log(err)
                    }
            });
        }   
    });
        res.redirect('/admin/district');
});

AdminRouter.get('/district/edit', isLoggedInAndAdmin, function(req, res) {
    connection.query("SELECT * FROM districts WHERE district_id = ?", [req.query.district_id], function(err, rows){
        if(err){
            console.log(err);
        }
        res.render('admin/district_edit', { user : req.user, data : rows[0]});
    });
});

AdminRouter.post('/district/edit', isLoggedInAndAdmin, function(req, res) {

    var is_active;
    if(req.body.is_active == "active")
        is_active = 1
    if(req.body.is_active == "inactive")
        is_active = 0

    var updateDistrictInfo = { 
        district_id : req.body.district_id,
        district_name : req.body.district_name, 
        district_address : req.body.district_address,
        district_city : req.body.district_city,
        district_state : req.body.district_state,
        district_zip : req.body.district_zip,
        is_active : is_active
    }

    var queryString = "UPDATE districts SET district_address = ?, district_city = ?, district_state = ?, district_zip = ?, is_active = ? WHERE district_id = ?"

    connection.query(queryString, [ updateDistrictInfo.district_address, updateDistrictInfo.district_city, updateDistrictInfo.district_state, updateDistrictInfo.district_zip, updateDistrictInfo.is_active, updateDistrictInfo.district_id ], function(err){

        if(err) console.log(err);


        res.redirect('/admin/district');

    });
});


//school
AdminRouter.get('/school', isLoggedInAndAdmin, function(req, res){
    var SchoolData
    connection.query("SELECT * FROM schools JOIN districts ON schools.district_id = districts.district_id WHERE schools.is_active = 1", function(err, rows){
        if(err) console.log(err);
        SchoolData = rows;

        res.render('admin/school', { user : req.user , schools : SchoolData});

    });
});

AdminRouter.post('/school', isLoggedInAndAdmin, function(req, res) {

    var schoolIDs = Object.keys(req.body);

    schoolIDs.splice(schoolIDs.indexOf("SubmitButtonSelector"), 1 );

    for(var i =0; i <= schoolIDs.length -1; i++){

        switch(req.body.SubmitButtonSelector){

            case "archive":
                //archive logic
                break;
        }

    }


    res.redirect('/admin/school');
});

AdminRouter.get('/school/new', isLoggedInAndAdmin, function(req, res){
    connection.query("SELECT * FROM districts WHERE is_active = 1", function(err, rows){
        res.render('admin/school_new', { user : req.user, districts : rows});
    });
});

AdminRouter.post('/school/new', isLoggedInAndAdmin, function(req, res) {

    console.log(req.body);


    var is_active;
    if(req.body.is_active == "active")
        is_active = 1
    if(req.body.is_active == "inactive")
        is_active = 0

    var newSchoolInfo = { 
        district_id : req.body.district_id, 
        school_name : req.body.school_name,
        school_address : req.body.school_address,
        school_city : req.body.school_city,
        school_state : req.body.school_state,
        school_zip : req.body.school_zip,
        current_school_year : req.body.current_school_year,
        is_active : is_active
    }

    //TODO: Make this a function? or even more put this in the db.js and only make DB calls from there.
    connection.query("SELECT * FROM schools WHERE school_name = ?",[newSchoolInfo.school_name], function(err, rows) {
        if (err)
            console.log(err);
        if (rows.length) {
            //TODO: Flash something saying "ERR USERNAME TAKEN"
            console.log("school with that name exists!")
            console.log(err)
        } else {
            var queryString = "INSERT INTO schools ( district_id, school_name, school_address, school_city, school_state, school_zip, current_school_year, is_active) values ( ?, ?, ?, ?, ?, ?, ?,? )"

            connection.query(queryString, [
                    newSchoolInfo.district_id,
                    newSchoolInfo.school_name,
                    newSchoolInfo.school_address,
                    newSchoolInfo.school_city,
                    newSchoolInfo.school_state,
                    newSchoolInfo.school_zip,
                    newSchoolInfo.current_school_year,
                    newSchoolInfo.is_active
                ], function(err){
                    if(err){
                        console.log(err)
                    }
            });
        }   
    });
            res.redirect('/admin/school');
});

AdminRouter.get('/school/edit', isLoggedInAndAdmin, function(req, res) {
    var schoolData;
    var districtData;


    connection.query("SELECT * FROM districts", function(err, rows){

        districtData = rows

        connection.query("SELECT * FROM schools JOIN districts ON schools.district_id = districts.district_id WHERE school_id = ?", [req.query.school_id], function(err, rows){

            schoolData = rows[0];
            console.log(schoolData)

            res.render('admin/school_edit', { user : req.user, data : schoolData, districts: districtData});
        });
    });
});

AdminRouter.post('/school/edit', isLoggedInAndAdmin, function(req, res) {
    console.log(req.body);

    var is_active;
    if(req.body.is_active == "active"){
        is_active = 1;
    }
    else{
        is_active = 0;
    }

    var SchoolInfo = { 
        school_id : req.body.school_id,
        district_id : req.body.district_id, 
        school_name : req.body.school_name,
        school_address : req.body.school_address,
        school_city : req.body.school_city,
        school_state : req.body.school_state,
        school_zip : req.body.school_zip,
        current_school_year : req.body.current_school_year,
        is_active : is_active
    }
    var queryString = "UPDATE schools SET district_id = ? , school_name = ?, school_address = ?, school_city = ?, school_state = ?, school_zip = ?, current_school_year = ?, is_active = ? WHERE school_id = ?"

    connection.query(queryString, [ SchoolInfo.district_id, SchoolInfo.school_name, SchoolInfo.school_address, SchoolInfo.school_city, SchoolInfo.school_state, SchoolInfo.school_zip, SchoolInfo.current_school_year, SchoolInfo.is_active, SchoolInfo.school_id  ], function(err){

        if(err) console.log(err);

        res.redirect('/admin/school');
    });
});


// route middleware to make sure
function isLoggedInAndAdmin(req, res, next) {
    
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated() && req.user.usertype.indexOf('admin') != -1)
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/home');
}



module.exports = AdminRouter;