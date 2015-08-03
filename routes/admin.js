var express = require('express');
var Account = require('../models/account');
var AdminRouter = express.Router();
var db = require('../models/db');

//TODO: Makesure only admins can access these pages!

AdminRouter.get('/', function(req, res) {
	if(!req.user){
        res.redirect('/');
    }
    
    res.render('admin/admin', { user : req.user });
});


AdminRouter.get('/users', function(req, res) {
	if(!req.user){
        res.redirect('/');
    }

    Account
    .find({})
    .exec(function(err, response){

        userQuery = response;

        res.render('admin/users', { user : req.user, userQuery: userQuery });
    });
});

AdminRouter.post('/users', function(req, res) {

    var userIDs = Object.keys(req.body);

    userIDs.splice(userIDs.indexOf("SubmitButtonSelector"), 1 );

    for(var i =0; i < userIDs.length; i++){

        switch(req.body.SubmitButtonSelector){
            case "delete":
                Account.remove({userid: userIDs[i]}, function(err, success){ 
                    console.log(err)
                });
                break;
            case "edit":
                res.redirect('/admin/users/edit?userid=' + userIDs[i]);
                break;
        }
    }
    res.redirect('/admin/users');
});

AdminRouter.get('/users/edit', function(req, res) {
	if(!req.user){
        res.redirect('/');
    }

    var userData;
    var schoolData;

    Account
    .findOne({userid : req.query.userid})
    .populate("school")
    .exec(function(err, response) {

        userData = response; 

        db.schools
        .find({})
        .exec( function(err, Schools){
            schoolData = Schools;


            res.render('admin/users_edit', {user : req.user, userData : userData, schools : schoolData });
        });
    });
});

AdminRouter.post('/users/edit', function(req, res) {
	var updateInfo = {
		firstname : req.body.firstname,
		lastname : req.body.lastname,
		email : req.body.email,
		usertype : req.body.usertype,
        stateid : req.body.stateid,
        school : req.body.school
	};


    console.log(req.body);
	Account
    .findOneAndUpdate({userid : req.body.userid}, updateInfo)
    .exec(function(err, numberAffected, raw){
        if(err) console.log(err);
		res.redirect('/admin/users');
	});
});

AdminRouter.get('/users/new', function(req, res) {
    if(!req.user){
        res.redirect('/');
    }

    var schoolData;

    db.schools
    .find({})
    .exec( function(err, Schools){
        schoolData = Schools;
        
        res.render('admin/users_new', { user : req.user, schools : schoolData });
    });
    
});

AdminRouter.post('/users/new', function(req, res) {

    console.log(req.body);

    Account.register(new Account({ 
        username : req.body.username, 
        firstname : req.body.firstname,
        lastname : req.body.lastname,
        email : req.body.email,
        usertype : req.body.usertype,
        stateid : req.body.stateid,
        school : req.body.school
        }), req.body.password, function(err, account) {

        res.redirect('/admin/users');
    });
});

AdminRouter.get('/district', function(req, res){
    if(!req.user){
        res.redirect('/');
    }

    db.districts
    .find({}) 
    .exec( function (err, response) {
        
        res.render('admin/district', { user : req.user , districts : response});
    })

    
});

AdminRouter.post('/district', function(req, res) {

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

AdminRouter.get('/district/new', function(req, res){
    if(!req.user){
        res.redirect('/');
    }
    res.render('admin/district_new', { user : req.user });
});

AdminRouter.post('/district/new', function(req, res) {
    

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

AdminRouter.get('/district/edit', function(req, res) {
    if(!req.user){
        res.redirect('/');
    }

    var districtData;



    db.districts.find(req.query, function (err, response) {
        if (err) return handleError(err);
        districtData = response[0]; 
        console.log(districtData);
        res.render('admin/district_edit', { user : req.user, data : districtData});
    })
});

AdminRouter.post('/district/edit', function(req, res) {

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
AdminRouter.get('/school', function(req, res){
    if(!req.user){
        res.redirect('/');
    }
    var SchoolResponse;

    db.schools
    .find({}) 
    .populate("district")
    .exec(function (err, response) {
        SchoolResponse = response;
        res.render('admin/school', { user : req.user , schools : SchoolResponse});
    });
});

AdminRouter.post('/school', function(req, res) {

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

AdminRouter.get('/school/new', function(req, res){
    if(!req.user){
        res.redirect('/');
    }

    db.districts
    .find({}) 
    .exec(function(err, response){

        res.render('admin/school_new', { user : req.user, districts : response});

    });


});

AdminRouter.post('/school/new', function(req, res) {
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

AdminRouter.get('/school/edit', function(req, res) {
    if(!req.user){
        res.redirect('/');
    }

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

AdminRouter.post('/school/edit', function(req, res) {
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


module.exports = AdminRouter;