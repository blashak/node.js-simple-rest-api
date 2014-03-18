function send(req) {
	$.ajax({
		type:'POST',
		data:req.data,
		url:req.url,
		success:function(data) {
			req.fn(data)
		},
		error: function(err) {
			alert(err);
		}
	});
}

var req = {
	url: '',
	data: '',
	fn: ''
}


function Device() {

	this.getUuid = function() {
		if (localStorage.getItem("uuid") == 'undefined' || localStorage.getItem("uuid") == '')
			return null;
		else
			return localStorage.getItem("uuid");
	}

	this.setUuid = function() {

		var uuid = this.getUuid();
	
		if (uuid == '' || uuid == null) {

			this.req.url = 'http://localhost:3000/uuid';
			this.req.data = 'uuid='+uuid;
			this.req.fn = function(data) {
				localStorage.setItem("uuid", data.uuid);
			}
			this.send(this.req);
		}
	}

	this.removeUuid = function() {
		localStorage.removeItem("uuid");
	}

	this.getHash = function() {
		if (localStorage.getItem("hash") == 'undefined' || localStorage.getItem("hash") == '')
			return null;
		else
			return localStorage.getItem("hash");
	}

	this.getData = function() {
		
		this.req.url = 'http://localhost:3000/profile';
		this.req.data = 'hash='+this.getHash()+'&uuid='+this.getUuid();
		this.req.fn = function(data) {
			$("#user_id").val(data.user_id);
			$("#uuid").val(data.uuid);
			$("#hash").val(data.hash);
		};

		this.send(this.req);
	}
}




function Session() {

	this.signup = function() {
		var data = $("#signup").serialize();
		
		data += "&uuid="+uuid;

		this.req.url = 'http://localhost:3000/user';
		this.req.data = data;
		this.req.fn = function(data) {
			localStorage.setItem("hash", data.hash);
			window.location.href = 'perfil.html';
		};

		this.send(this.req);
	}

	this.login = function() {
		var data = $("#login").serialize();
		data += '&uuid='+uuid;

		this.req.url = 'http://localhost:3000/login';
		this.req.data = data;
		this.req.fn = function(data) {
			localStorage.setItem("hash", data.hash);
			window.location.href = 'perfil.html';
		};

		this.send(this.req);
	}

	this.autologin = function() {
		var data = 'hash='+hash+'&uuid='+uuid;

		this.req.url = 'http://localhost:3000/autologin';
		this.req.data = data;
		this.req.fn = function(data) {
			localStorage.setItem("hash", data.hash);
			window.location.href = 'perfil.html';
		};

		this.send(this.req);
	}

	this.logout = function() {
		var data = 'hash='+hash+'&uuid='+uuid;

		this.req.url = 'http://localhost:3000/logout';
		this.req.data = data;
		this.req.fn = function(data) {
			localStorage.removeItem("hash");
			window.location.href = 'index.html';
		};

		this.send(this.req);
	}
}


Device.prototype.send = send;
Device.prototype.req = req;
Session.prototype.send = send;
Session.prototype.req = req;
var device = new Device();
//device.removeUuid();
device.setUuid();
var uuid = device.getUuid();
var hash = device.getHash();

var session = new Session();