var express = require('express');
var Account = require('../models/account');
var DistAdminRouter = express.Router();
var db = require('../models/school');


DistAdminRouter.get('/', function(req, res) {
	if(!req.user){
        res.redirect('/');
    }

    res.render('distadmin', { user : req.user });
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
    	
    	res.render('course', { user : req.user, courses : courses });

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
	    		res.render('course_new', { user : req.user, teachers : TeacherData, students : StudentData, schools : SchoolData });
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
                    res.render('course_edit', { 
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







module.exports = DistAdminRouter;