var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');
var autoIncrement = require('mongoose-auto-increment');


var connection = mongoose.createConnection('mongodb://localhost/TGAtracking');

autoIncrement.initialize(connection);


var Account = new Schema({
    username: String,
    password: String,
    firstname: String,
    lastname: String,
    email: String,
    usertype: [{type: String}]
});


Account.plugin(autoIncrement.plugin, {model: 'Account', field: 'userid'});
Account.plugin(passportLocalMongoose);

module.exports = mongoose.model('Account', Account);
