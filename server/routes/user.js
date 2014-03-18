var User = require('../entities/User');
var Device = require('../entities/Device');
var g_uuid = require('node-uuid');


exports.uuid = function(req, res){

	var uuid = req.body.uuid ? req.body.uuid : null;
	
	device = Device();

	if (uuid == 'null') {
		var uuid = g_uuid.v4();
		device.uuid = uuid;
		device.save(function(err) {
			if (err) {
				console.log(err);
			} else {
				console.log("save");
			}
		});
	}

	res.json({ uuid: uuid });
}


exports.new = function(req, res){

    var uuid = req.body.uuid ? req.body.uuid : null;
	var email = req.body.email ? req.body.email : null;
    var password = req.body.password ? req.body.password : null;
	
    User.findOne({
	  email: email
	}, function(err, user){
	  if (!err && user != null) {
	  	res.json(400, { message: "User exist" });
	  	res.end();
	  }
	});


    var user = User();

    user.email = email;
    user.setSalt();
    user.hashed_password = user.encryptPassword(password);

    user.save(function(err){
    	if (!err) {
    		joinUserDevice(user, uuid, res);
    	} else {
			res.json(400, { message: "Bad Authentication data1" });
    	}
    });
}

function joinUserDevice (user, uuid, res){
	Device.findOne({
		uuid: uuid,	
	}, function(err, device){

		if (!err && device != null) {

			device.setTimestamp();
			device.setHash();
			device.setUserId(user.getId());

			device.save(function(err) {

				if (err) {
					res.json(400, { message: "Bad Authentication data2" });
				} else {
					res.json({ hash: device.getHash() });
					res.end();
				}
			});
		}
	});
}

exports.profile = function(req, res){

	var uuid = req.body.uuid ? req.body.uuid : null;
	var hash = req.body.hash ? req.body.hash : null;

	Device.findOne({
		uuid: uuid
	}, function(err, device){
		if (!err && device != null) {
			if (device.getHash() == hash) {
				//res.json({ 'device': device });
				res.json(device);
				res.end();
			}
		}
	})
}

function timeExpired(t) {
	var tm = ( ( (new Date()).getTime() - t ) / 1000 ) / 60;
	console.log(tm);
	if (tm > 10) {
		return true;
	} else {
		return false;
	}
}


exports.logout = function(req, res){

	var uuid = req.body.uuid ? req.body.uuid : null;
	var hash = req.body.hash ? req.body.hash : null;

	Device.findOne({
		uuid: uuid
	}, function(err, device){
		if (!err && device != null) {
			if (device.getHash() == hash) {

				device.remove(function(err) {
					if (err) {
						console.log(err);
					} else {
						device = Device();
						device.uuid = uuid;
						device.save(function(err) {
							if (err) {
								console.log(err);
							} else {
								res.json({ 'success': true });
							}
						});
					}
				})

			}
		}
	})
}

exports.login = function(req, res){
    
    var timestamp = new Date().getTime();
    var uuid = req.body.uuid ? req.body.uuid : null;
    var email = req.body.email ? req.body.email : null;
    var password = req.body.password ? req.body.password : null;


    User.findOne({
	  email: email
	}, function(err, user){
	  if (!err && user != null) {
	  	
	    if (user.checkPass(password)) {
	    	joinUserDevice(user, uuid, res);
	    } else {
	    	res.json({ message: "Bad Authentication data" });
	    }

	  } else {
	  	res.json(400, { message: "Bad Authentication data" });
	  }
	});
}

exports.autologin = function(req, res){

	var uuid = req.body.uuid ? req.body.uuid : null;
	var hash = req.body.hash ? req.body.hash : null;

	Device.findOne({
		uuid: uuid
	}, function(err, device){
		if (!err && device != null) {
			if (device.getHash() == hash) {

				if (timeExpired(device.getTimestamp())){
					device.setTimestamp();
					device.setHash();
					device.save(function(err){
						if(!err) {
							console.log("entro a cambiar el hast");
							hash = device.getHash();
							res.json({ 'success': true, hash: hash });
							res.end();
						}
					})
				};

				res.json({ 'success': true, hash: device.getHash()  });
				res.end();
				
			}
		}
	})
}