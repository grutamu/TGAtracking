var express = require('express');
var Account = require('../models/account');
var TeacherRouter = express.Router();
var db = require('../models/db');

TeacherRouter.get('/', function(req, res) {
	if(!req.user){
        res.redirect('/');
    }

    res.render('teacher/teacher', { user : req.user });
});

TeacherRouter.get('/courses', function(req, res) {
	if(!req.user){
        res.redirect('/');
    }
    
    db.courses
    .find({teacher: req.user._id})
    .exec(function(err, courses){
    	courseData = courses;

    	Account
    	.findOne({userid: req.user.userid})
    	.populate("school")
    	.exec(function(err, teacher){
    		teacherData = teacher;
    		console.log(teacherData);
    		res.render('teacher/courses', {user: req.user, teacher: teacherData, courses: courseData});
    	});
    });    
});

module.exports = TeacherRouter;