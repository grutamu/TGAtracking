var express = require('express');
var AdminRouter = express.Router();
var bcrypt = require('bcrypt-nodejs');

var mysql = require('mysql');
var dbconfig = require('../models/db');
var connection = mysql.createConnection(dbconfig.connection);

connection.query('USE ' + dbconfig.database);

AdminRouter.get('/', isLoggedInAndAdmin, function(req, res) {
    res.render('admin/admin', { user : req.user });
});


AdminRouter.get('/users', isLoggedInAndAdmin, function(req, res) {
    //TODO: only list Active Users

    connection.query("SELECT username, firstname, lastname, usertype FROM users WHERE user_is_active=1", function(err, rows){

        if(err)
            console.log("error" + err);

        console.log(rows)

        res.render('admin/users', { user : req.user, userQuery: rows });
    })

});

AdminRouter.post('/users', isLoggedInAndAdmin, function(req, res) {

    var userIDs = Object.keys(req.body);

    userIDs.splice(userIDs.indexOf("SubmitButtonSelector"), 1 );

    for(var i =0; i < userIDs.length; i++){

        switch(req.body.SubmitButtonSelector){
            case "archive":
                //TODO: Add archiving abailities
                break;
        }
    }
    res.redirect('/admin/users');
});

AdminRouter.get('/users/edit',isLoggedInAndAdmin, function(req, res) {

    var userData;
    console.log(req.query.username);


    connection.query("SELECT * FROM users WHERE username=?", [req.query.username], function(err, rows){
        
        if(err){
            console.log(err);
        }
        
        userData = rows[0];

        console.log(userData);

        //TODO: Add in a query to list all schools on the page

        res.render('admin/users_edit', {user : req.user, userData : userData, schools : {} });
    })

});

AdminRouter.post('/users/edit', isLoggedInAndAdmin, function(req, res) {
	
    //TODO: clean all input.
    var updateInfo = {
        username : req.body.username,
		firstname : req.body.firstname,
		lastname : req.body.lastname,
		email : req.body.email,
		usertype : req.body.usertype,
        stateid : req.body.stateid,
        school : req.body.school
	};

    //TODO: Add in school and districtID when implemented
    var queryString = "UPDATE users SET firstname = ?, lastname = ?, email = ?, stateid = ? WHERE username = ?"

    connection.query(queryString, [updateInfo.firstname, updateInfo.lastname, updateInfo.email, updateInfo.stateid, updateInfo.username], function(err){
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

    console.log(req.body)


    var newUserInfo = { 
        username : req.body.username, 
        password : bcrypt.hashSync(req.body.password, null, null),
        firstname : req.body.firstname,
        lastname : req.body.lastname,
        email : req.body.email,
        usertype : req.body.usertype || '',
        stateid : req.body.stateid,
        schoolid : ''
    }

    //TODO: Make this a function? or even more put this in the db.js and only make DB calls from there.
    connection.query("SELECT * FROM users WHERE username = ?",[newUserInfo.username], function(err, rows) {
        if (err)
            console.log(err);
        if (rows.length) {
            //TODO: Flash something saying "ERR USERNAME TAKEN"
            console.log("username Taken!")
            console.log(err)
        } else {
            console.log("is in else")
            var queryString = "INSERT INTO users ( username, password, firstname, lastname, email, usertype, stateid, schoolid ) values ( ?, ?, ?, ?, ?, ?, ?, ? )"

            connection.query(queryString, [
                    newUserInfo.username,
                    newUserInfo.password,
                    newUserInfo.firstname,
                    newUserInfo.lastname,
                    newUserInfo.email,
                    newUserInfo.usertype,
                    newUserInfo.stateid,
                    newUserInfo.schoolid
                ], function(err){
                    console.log("is in last query")
                    if(err){
                        console.log(err)
                    }
            });
        }   
    });
    
    res.redirect('/admin/users');
});

AdminRouter.get('/district',isLoggedInAndAdmin, function(req, res){

    db.districts
    .find({}) 
    .exec( function (err, response) {
        
        res.render('admin/district', { user : req.user , districts : response});
    })

    
});

AdminRouter.post('/district', isLoggedInAndAdmin, function(req, res) {

    var distIDs = Object.keys(req.body);



    distIDs.splice(distIDs.indexOf("SubmitButtonSelector"), 1 );

    for(var i =0; i < distIDs.length; i++){

        switch(req.body.SubmitButtonSelector){

            case "delete":
                db.districts.remove({district_id: distIDs[i]}, function(err, success){ 
                    console.log(err, success)
                });
                break;
            case "edit":
                res.redirect('/admin/district/edit?district_id=' + distIDs[i]);
                break;
        }
    }
    res.redirect('/admin/district');
});

AdminRouter.get('/district/new',isLoggedInAndAdmin, function(req, res){

    res.render('admin/district_new', { user : req.user });
});

AdminRouter.post('/district/new', isLoggedInAndAdmin, function(req, res) {
    

    var isactive;

    if(req.body.active == "active")
        isactive = true
    if(req.body.active == "inactive")
        isactive = false

    db.districts.create({
        district_name: req.body.name,
        district_address: req.body.address,
        district_city: req.body.city,
        district_state: req.body.state,
        district_zip: req.body.zip,
        is_active: isactive,
    }, function(err) {
        if (err) {
            //return res.render('users_new', { account : account });
        }
        res.redirect('/admin/district');
    });
});

AdminRouter.get('/district/edit',isLoggedInAndAdmin, function(req, res) {

    var districtData;



    db.districts.find(req.query, function (err, response) {
        if (err) return handleError(err);
        districtData = response[0]; 
        console.log(districtData);
        res.render('admin/district_edit', { user : req.user, data : districtData});
    })
});

AdminRouter.post('/district/edit', isLoggedInAndAdmin, function(req, res) {

    var isactive;
    if(req.body.active == "active")
        isactive = true
    if(req.body.active == "inactive")
        isactive = false


    var updateInfo = {
        district_name: req.body.name,
        district_address: req.body.address,
        district_city: req.body.city,
        district_state: req.body.state,
        district_zip: req.body.zip,
        is_active: isactive,
    }

    db.districts
    .findOneAndUpdate({district_id : req.body.id}, updateInfo)
    .exec(function(err, numberAffected, raw){
        res.redirect('/admin/district');
    });
});


//school
AdminRouter.get('/school', isLoggedInAndAdmin, function(req, res){

    var SchoolResponse;

    db.schools
    .find({}) 
    .populate("district")
    .exec(function (err, response) {
        SchoolResponse = response;
        res.render('admin/school', { user : req.user , schools : SchoolResponse});
    });
});

AdminRouter.post('/school', isLoggedInAndAdmin, function(req, res) {

    var schoolIDs = Object.keys(req.body);

    schoolIDs.splice(schoolIDs.indexOf("SubmitButtonSelector"), 1 );

    for(var i =0; i <= schoolIDs.length -1; i++){

        switch(req.body.SubmitButtonSelector){

            case "delete":
                db.schools
                .remove({school_id: schoolIDs[i]}) 
                .exec(function(err, success){
                    if (!err){
                        console.log("Delete Successful!")
                    }
                });
                break;
            case "edit":
                res.redirect('/admin/school/edit?school_id=' + schoolIDs[i]);
                break;
        }

    }


    res.redirect('/admin/school');
});

AdminRouter.get('/school/new', isLoggedInAndAdmin, function(req, res){

    db.districts
    .find({}) 
    .exec(function(err, response){

        res.render('admin/school_new', { user : req.user, districts : response});

    });


});

AdminRouter.post('/school/new', isLoggedInAndAdmin, function(req, res) {
    console.log(req.body);

    var isactive;

    if(req.body.active == "active")
        isactive = true
    if(req.body.active == "inactive")
        isactive = false

    db.districts
    .findOne({district_id: req.body.districtid})
    .exec(function(err, District){

        var NewSchool = new db.schools({
            district: District._id,
            school_name: req.body.name,
            school_address: req.body.address,
            school_city: req.body.city,
            school_state: req.body.state,
            school_zip: req.body.zip,
            current_school_year: req.body.schoolyear,
            school_is_active: isactive
        });


        NewSchool
        .save(function(err){
            if (err) {
                console.log("Error: " + err )
            }

            

            res.redirect('/admin/school');
        });

        

    })
        
});

AdminRouter.get('/school/edit', isLoggedInAndAdmin, function(req, res) {
    var schoolData;
    var districtData;

    db.districts
    .find({})
    .exec(function (err, response) {

        districtData = response;

        db.schools
        .findOne(req.query)
        .populate("district")
        .exec(function (err, response) {
            if (err) return handleError(err);
            schoolData = response; 
            console.log(schoolData);
            res.render('admin/school_edit', { user : req.user, data : schoolData, districts: districtData});
        })

    })
        
});

AdminRouter.post('/school/edit', isLoggedInAndAdmin, function(req, res) {
    //console.log(req.body);

    var isactive;

    if(req.body.active == "active")
        isactive = true
    if(req.body.active == "inactive")
        isactive = false


    var updateInfo = {
        district: req.body.districtid,
        school_name: req.body.name,
        school_address: req.body.address,
        school_city: req.body.city,
        school_state: req.body.state,
        school_zip: req.body.zip,
        current_school_year: req.body.schoolyear,
        school_is_active: isactive,
    }

    db.schools
    .findOneAndUpdate({school_id : req.body.schooid}, updateInfo)
    .exec(function(err, numberAffected, raw){
        if (err) console.log(err);
        console.log("Updated :" + numberAffected, raw);
        res.redirect('/admin/school');
    });
});


// route middleware to make sure
function isLoggedInAndAdmin(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated() && req.user.usertype == "admin")
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/home');
}



module.exports = AdminRouter;