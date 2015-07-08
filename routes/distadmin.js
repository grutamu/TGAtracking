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
    	console.log(courses);
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
	    		console.log(Schools);
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
    console.log(req.body);


    res.redirect('/distadmin/course');
});










module.exports = DistAdminRouter;