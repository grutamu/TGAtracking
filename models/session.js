var Account = require('../models/account');


var session = {};


var callback = function (err, data) {
  if (err) return console.error(err);
  else console.log(data);
}

session.find = function(jsonObj) {
	Account.find(jsonObj, callback);
}







module.exports = session;