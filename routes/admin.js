var express = require('express');
var Account = require('../models/account');
var AdminRouter = express.Router();
var School = require('../models/school');


//TODO: Makesure only admins can access these pages!

AdminRouter.get('/', function(req, res) {
	if(!req.user){
        res.redirect('/');
    }

    res.render('admin', { user : req.user });
});


AdminRouter.get('/users', function(req, res) {
	if(!req.user){
        res.redirect('/');
    }

    Account.find({}, 'username', function(err, response){
        if (err) return handleError(err);

        console.log("userQuery: "+ response);

        userQuery = response;

        res.render('users', { user : req.user, userQuery: userQuery });
    });
});

AdminRouter.get('/users/edit', function(req, res) {
	if(!req.user){
        res.redirect('/');
    }

    var userData = {
    	username : req.query.username,
    	info : {}
    }

    Account.find(req.query, function (err, response) {
        console.log(response);
  		userData.info = response[0]; 

    	res.render('users_edit', { user : req.user, data : userData});
	})
});

AdminRouter.post('/users/edit', function(req, res) {
	var updateInfo = {
		firstname : req.body.firstname,
		lastname : req.body.lastname,
		email : req.body.email,
		usertype : req.body.usertype
	}

    console.log(req.body);

	Account
    .findOneAndUpdate({username : req.body.username}, updateInfo)
    .exec(function(err, numberAffected, raw){
        console.log("Updated :" + numberAffected, raw);
		res.redirect('/admin/users');
	});
});

AdminRouter.get('/users/new', function(req, res) {
    if(!req.user){
        res.redirect('/');
    }
    res.render('users_new', { user : req.user });
});

AdminRouter.post('/users/new', function(req, res) {
    Account.register(new Account({ 
        username : req.body.username, 
        firstname : req.body.firstname,
        lastname : req.body.lastname,
        email : req.body.email,
        usertype : req.body.usertype
        }), req.body.password, function(err, account) {
        if (err) {
            return res.render('users_new', { account : account });
        }

        res.render('users_new', { user : req.user });
    });
});

AdminRouter.get('/district', function(req, res){
    if(!req.user){
        res.redirect('/');
    }

    School.districts
    .find({}) 
    .exec( function (err, response) {
        if (err) return handleError(err);
    
        //console.log(response);        

        res.render('district', { user : req.user , districts : response});
    })

    
});

AdminRouter.post('/district', function(req, res) {

    var distIDs = Object.keys(req.body);



    distIDs.splice(distIDs.indexOf("SubmitButtonSelector"), 1 );

    for(var i =0; i <= distIDs.length -1; i++){

        switch(req.body.SubmitButtonSelector){

            case "delete":
                School.districts.remove({district_id: distIDs[i]}, function(err, success){ 
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
    res.render('district_new', { user : req.user });
});

AdminRouter.post('/district/new', function(req, res) {
    

    var isactive;

    if(req.body.active == "active")
        isactive = true
    if(req.body.active == "inactive")
        isactive = false

    School.districts.create({
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



    School.districts.find(req.query, function (err, response) {
        if (err) return handleError(err);
        districtData = response[0]; 
        console.log(districtData);
        res.render('district_edit', { user : req.user, data : districtData});
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

    School.districts.findOneAndUpdate({district_id : req.body.id}, updateInfo,function(err, numberAffected, raw){
        if (err) return handleError(err);
        console.log("Updated :" + numberAffected, raw);
        res.redirect('/admin/district');
    });
});


//school
AdminRouter.get('/school', function(req, res){
    if(!req.user){
        res.redirect('/');
    }

    var SchoolResponse;

    School.schools
    .find({}) 
    .populate("district")
    .exec(function (err, response) {
        if (err) return handleError(err);
        
        SchoolResponse = response;

        console.log(SchoolResponse); 
        res.render('school', { user : req.user , schools : SchoolResponse});
               
        
    });
});

AdminRouter.post('/school', function(req, res) {

    var schoolIDs = Object.keys(req.body);


    schoolIDs.splice(schoolIDs.indexOf("SubmitButtonSelector"), 1 );

    for(var i =0; i <= schoolIDs.length -1; i++){

        switch(req.body.SubmitButtonSelector){

            case "delete":
                School.schools.remove({school_id: schoolIDs[i]}, function(err, success){ 
                    console.log(err, success)
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

    School.districts.find({}, function(err, response){

        res.render('school_new', { user : req.user, districts : response});

    });


});

AdminRouter.post('/school/new', function(req, res) {
    console.log(req.body);

    var isactive;

    if(req.body.active == "active")
        isactive = true
    if(req.body.active == "inactive")
        isactive = false

    School.districts
    .findOne({district_id: req.body.districtid})
    .exec(function(err, District){
        console.log(District);
        

        var NewSchool = new School.schools({
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

    School.districts
    .find({})
    .exec(function (err, response) {

        districtData = response;

        School.schools
        .findOne(req.query)
        .populate("district")
        .exec(function (err, response) {
            if (err) return handleError(err);
            schoolData = response; 
            console.log(schoolData);
            res.render('school_edit', { user : req.user, data : schoolData, districts: districtData});
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

    School.schools.findOneAndUpdate({school_id : req.body.schooid}, updateInfo,function(err, numberAffected, raw){
        if (err) console.log(err);
        console.log("Updated :" + numberAffected, raw);
        res.redirect('/admin/school');
    });
});



















module.exports = AdminRouter;