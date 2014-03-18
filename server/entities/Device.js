var mongoose = require('../config/db');
var crypto = require('crypto');
var jwt = require('jwt-simple');

var deviceSchema = new mongoose.Schema({
  uuid: { type: String, index: { unique: true } },
  hash: String,
  timestamp: Date,
  user_id: String
});

deviceSchema.method('getUuid', function() {
	return this.uuid;
});

deviceSchema.method('getTimestamp', function() {
	return (new Date(this.timestamp)).getTime();
});

deviceSchema.method('setTimestamp', function() {
	this.timestamp =  new Date().getTime();
});

deviceSchema.method('setSalt', function() {
	return Math.round((new Date().valueOf() * Math.random())) + '';
});

deviceSchema.method('getHash', function() {
	return this.hash;
});

deviceSchema.method('setHash', function() {

	var payload = this.uuid;
  	var secret = this.setSalt();
	
  	var token = jwt.encode(payload, secret);

	this.hash = crypto.createHmac("sha256", this.setSalt().toString()).update(token.toString()).digest("hex");
});

deviceSchema.method('checkHash', function(hash) {
	if(this.getHash() != undefined && this.getHash() == hash)
		return true;
	else
		return false
});

deviceSchema.method('getUserId', function(user_id) {
  return this.user_id;
});

deviceSchema.method('setUserId', function(user_id) {
  return this.user_id = user_id;
});

module.exports = mongoose.model("device", deviceSchema);
