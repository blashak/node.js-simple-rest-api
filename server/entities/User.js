var mongoose = require('../config/db');
var crypto = require('crypto');

var userSchema = new mongoose.Schema({
    email: { type: String, index: { unique: true } },
    hashed_password: String,
    salt: String
});

userSchema.method('getId', function() {
  return this.id;
});

userSchema.method('getEmail', function() {
  return this.email;
});

userSchema.method('getHashedPassword', function() {
  return this.hashed_password;
});

userSchema.method('checkPass', function(plainText) {
	return this.encryptPassword(plainText) === this.hashed_password;
});

userSchema.method('setSalt', function() {
	this.salt = Math.round((new Date().valueOf() * Math.random())) + '';
});

userSchema.method('encryptPassword', function(password) {
	return crypto.createHmac("sha256", this.salt.toString()).update(password.toString()).digest("hex");
});

module.exports = mongoose.model("user", userSchema);