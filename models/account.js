var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');
var autoIncrement = require('mongoose-auto-increment');
var timestamps = require('mongoose-timestamp');

var connection = mongoose.createConnection('mongodb://localhost/TGAtracking');

autoIncrement.initialize(connection);


var Account = new Schema({
    username: String,
    password: String,
    firstname: String,
    lastname: String,
    email: String,
    usertype: [{type: String}],
    stateid: String,
  	birthdate: Date,
  	current_grade: String,
  	is_student_IEP: { type: Boolean, default: false },
  	user_is_active:{ type: Boolean, default: true },
  	user_notes: String
});

Account.plugin(timestamps);
Account.plugin(autoIncrement.plugin, {model: 'Account', field: 'userid'});
Account.plugin(passportLocalMongoose);

module.exports = mongoose.model('Account', Account);
