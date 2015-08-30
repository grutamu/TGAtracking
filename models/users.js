var bcrypt = require('bcrypt-nodejs');
var mysql = require('mysql');
var dbconfig = require('../models/db');
var connection = mysql.createConnection(dbconfig.connection);
var squel = require("squel");

connection.query('USE ' + dbconfig.database);

user = {}

user.CreateUser = function(UserInfo, done){

	//TODO input valadation
	var newUserInfo = [ 
        UserInfo.username, 
        bcrypt.hashSync(UserInfo.password, null, null),
        UserInfo.firstname || '',
        UserInfo.lastname || '',
        UserInfo.email || '',
        UserInfo.stateid || '',
        UserInfo.schoolid || '',
		UserInfo.middlename || '',
		UserInfo.districtid || '',
		UserInfo.teacher_uic || '',
		UserInfo.student_pic || '',
		UserInfo.birthdate || '',
		UserInfo.current_grade || '',
		UserInfo.is_student_IEP || 0,
		UserInfo.user_notes || ''
    ];

    var newUserUsertype = UserInfo.usertype || '';

    //ToDo Add in All Table Fields
    connection.query("SELECT * FROM users WHERE username = ?",[newUserInfo.username], function(err, rows) {
        if (err)
            done(err);
        if (rows.length) {
            done("Error: Username Taken!")
        } else {
            var queryString = "INSERT INTO users ( username, password, firstname, lastname, email, stateid, schoolid, middlename, districtid, teacher_uic, student_pic,birthdate,current_grade,is_student_IEP,user_notes ) values ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? )"

            connection.query(queryString, newUserInfo, function(err){
                    if(err){
                        done(err)
                    } else{
                    	done(null)
                    }
            });
        }   
    });
}

user.UpdateUser = function(UserInfo, done){
	//ToDo: Input Valadation
	//TODO: clean all input.
	//ToDo: Add in all table fields.
    var updateInfo = {
        username : UserInfo.username || '', 
        firstname : UserInfo.firstname || '',
        lastname : UserInfo.lastname || '',
        email : UserInfo.email || '',
        usertype : UserInfo.usertype || '',
        stateid : UserInfo.stateid || '',
        schoolid : UserInfo.schoolid || ''
	};

    //TODO: Add in school and districtID when implemented
    var queryString = "UPDATE users SET firstname = ?, lastname = ?, email = ?, stateid = ? WHERE username = ?"

    connection.query(queryString, [updateInfo.firstname, updateInfo.lastname, updateInfo.email, updateInfo.stateid, updateInfo.username], function(err){
		done(err);
    });
}


user.SelectUserByID = function(UserID, done){

	connection.query("SELECT * FROM users WHERE id=?", UserID, function(err, rows){
        done(err, rows[0]);
    })
}

user.SelectActiveUsers = function(school, district, done){
	var school = school || null
	var district = district || null
	var cb = done;

	if (typeof school === 'function') {
    	cb = school;
    	school = null
  	}

  	if (typeof district === 'function') {
    	cb = district;
    	district = null
  	}

	//Search all Active Users
	if(school == null && district == null){
	    connection.query("SELECT * FROM users WHERE user_is_active=1", cb);
	}

	//Search Active Users In A School
	if((school != null && district == null) || (school != null && district != null) ){
		cb(null)
	}

	//Search Active Users In A District
	if(school == null && district != null ){
		cb(null)
	}



}

user.ToggleActiveUserByID = function(UserID, done){
	var isActive;

	connection.query("SELECT id user_is_active FROM users WHERE id = ?", [UserID], function(err, rows){
		if(err){
			done(err);
		}
		if(!rows[0].id){
			done("Invalid UserID")
		}
		if(rows[0].user_is_active = 0){
			isActive = 1;
		} else{
			isActive = 0;
		}

		connection.query("UPDATE users SET user_is_active = ? WHERE id =?", [isActive, UserID], done);
	});
}



user.UpdateUserRole = function(UserID, RoleID, done){
	connection.query("SELECT * FROM user_role WHERE user_id = ?", UserID, function(err, rows){
		if(rows.length){


		} else{


		}


	})
}

user.UpdateUserPremissions = function(UserID, done){

}
















module.exports = user;
