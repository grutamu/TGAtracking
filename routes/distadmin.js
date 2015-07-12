var express = require('express');
var Account = require('../models/account');
var DistAdminRouter = express.Router();
var db = require('../models/school');


DistAdminRouter.get('/', function(req, res) {
	if(!req.user){
        res.redirect('/');
    }

    res.render('distadmin/distadmin', { user : req.user });
});

DistAdminRouter.get('/course', function(req, res) {
	if(!req.user){
        res.redirect('/');
    }

    db.courses
    .find({})
    .populate("school")
    .populate("teacher")
    .populate("students")
    .exec( function(err, courses) {
    	
    	res.render('distadmin/course', { user : req.user, courses : courses });

    });
});

DistAdminRouter.get('/course/new', function(req, res) {
	if(!req.user){
        res.redirect('/');
    }

    var TeacherData;
    var SchoolData;
    var StudentData;

    Account
    .find({})
    .where('usertype').equals('teacher')
    .exec(function(err, Teachers){
    	TeacherData = Teachers;

    	Account
	    .find({})
	    .where('usertype').equals('student')
	    .exec(function(err, Students){
	    	StudentData = Students;

	    	db.schools
	    	.find({})
	    	.exec( function(err, Schools){
	    		
	    		SchoolData = Schools;
	    		res.render('distadmin/course_new', { user : req.user, teachers : TeacherData, students : StudentData, schools : SchoolData });
	    	});
	    });
    });
});

DistAdminRouter.post('/course/new', function(req, res) {
	if(!req.user){
        res.redirect('/');
    }
    db.courses.create(req.body)


    res.redirect('/distadmin/course');
});


DistAdminRouter.get('/course/edit', function(req, res) {
    if(!req.user){
        res.redirect('/');
    }

    var schoolData;
    var courseData;

    db.courses
    .findOne(req.query)
    .populate("school")
    .populate("teacher")
    .populate("students")
    .exec(function(err, Courses){

        courseData = Courses;

        Account
        .find({})
        .where('usertype').equals('teacher')
        .exec(function(err, Teachers){

            TeacherData = Teachers;

            Account
            .find({})
            .where('usertype').equals('student')
            .exec(function(err, Students){

                StudentData = Students;

                db.schools
                .find({})
                .exec( function(err, Schools){
                    SchoolData = Schools;
                    res.render('distadmin/course_edit', { 
                        user : req.user, 
                        students: StudentData, 
                        teachers: TeacherData,
                        schools : SchoolData, 
                        courses: courseData
                    });
                });
            });
        }); 
    });      
});

DistAdminRouter.post('/course/edit', function(req, res) {
    if(!req.user){
        res.redirect('/');
    }



    var updateInfo = {
        course_name: req.body.course_name,
        course_number: req.body.course_number,
        school: req.body.school,
        school_year: req.body.school_year,
        teacher: req.body.teacher,
        students: req.body.students
    }



    db.courses
    .findOneAndUpdate({course_id: req.body.course_id}, updateInfo)
    .exec(function(err){
        res.redirect('/distadmin/course');
    });
});



DistAdminRouter.get('/users', function(req, res) {
    if(!req.user){
        res.redirect('/');
    }

    Account.find({}, 'username', function(err, response){
        userQuery = response;
        res.render('distadmin/users', { user : req.user, userQuery: userQuery });
    });
});

DistAdminRouter.get('/users/edit', function(req, res) {
    if(!req.user){
        res.redirect('/');
    }

    var userData = {
        username : req.query.username,
        info : {}
    }

    Account.find(req.query, function (err, response) {
        userData.info = response[0]; 
        res.render('distadmin/users_edit', { user : req.user, data : userData});
    })
});

DistAdminRouter.post('/users/edit', function(req, res) {
    var updateInfo = {
        firstname : req.body.firstname,
        lastname : req.body.lastname,
        email : req.body.email,
        usertype : req.body.usertype
    }

    Account
    .findOneAndUpdate({username : req.body.username}, updateInfo)
    .exec(function(err, numberAffected, raw){
        res.redirect('/distadmin/users');
    });
});

DistAdminRouter.get('/users/new', function(req, res) {
    if(!req.user){
        res.redirect('/');
    }
    res.render('distadmin/users_new', { user : req.user });
});

DistAdminRouter.post('/users/new', function(req, res) {
    Account.register(new Account({ 
        username : req.body.username, 
        firstname : req.body.firstname,
        lastname : req.body.lastname,
        email : req.body.email,
        usertype : req.body.usertype
        }), req.body.password, function(err, account) {
        if (err) {
            return res.render('distadmin/users_new', { account : account });
        }

        res.render('distadmin/users_new', { user : req.user });
    });
});

//school
DistAdminRouter.get('/school', function(req, res){
    if(!req.user){
        res.redirect('/');
    }

    var SchoolResponse;

    db.schools
    .find({}) 
    .populate("district")
    .exec(function (err, response) {
        if (err) return handleError(err);
        
        SchoolResponse = response;

        console.log(SchoolResponse); 
        res.render('distadmin/school', { user : req.user , schools : SchoolResponse});
               
        
    });
});

DistAdminRouter.post('/school', function(req, res) {

    var schoolIDs = Object.keys(req.body);


    schoolIDs.splice(schoolIDs.indexOf("SubmitButtonSelector"), 1 );

    for(var i =0; i <= schoolIDs.length -1; i++){

        switch(req.body.SubmitButtonSelector){

            case "delete":
                db.schools.remove({school_id: schoolIDs[i]}, function(err, success){ 
                    console.log(err, success)
                });
                break;
            case "edit":
                res.redirect('/distadmin/school/edit?school_id=' + schoolIDs[i]);
                break;
        }

    }


    res.redirect('/distadmin/school');
});

DistAdminRouter.get('/school/new', function(req, res){
    if(!req.user){
        res.redirect('/');
    }

    db.districts.find({}, function(err, response){

        res.render('distadmin/school_new', { user : req.user, districts : response});

    });


});

DistAdminRouter.post('/school/new', function(req, res) {
    var isactive;

    if(req.body.active == "active")
        isactive = true
    if(req.body.active == "inactive")
        isactive = false

    db.districts
    .findOne({district_id: req.body.districtid})
    .exec(function(err, District){
        console.log(District);
        

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
            res.redirect('/distadmin/school');
        });

        

    });
        
});

DistAdminRouter.get('/school/edit', function(req, res) {
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
            res.render('distadmin/school_edit', { user : req.user, data : schoolData, districts: districtData});
        });

    });
        
});

DistAdminRouter.post('/school/edit', function(req, res) {
    var isactive;

    if(req.body.active == "active")
        isactive = true;
    if(req.body.active == "inactive")
        isactive = false;


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

    db.schools.findOneAndUpdate({school_id : req.body.schooid}, updateInfo,function(err, numberAffected, raw){
        res.redirect('/distadmin/school');
    });
});






module.exports = DistAdminRouter;