
/**
 * Module dependencies.
 */

var express = require('express');
var routes_user = require('./routes/user');
var http = require('http');
var path = require('path');

var app = express();

//CORS middleware
var allowCrossDomain = function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');

    next();
}

// all environments
app.set('port', process.env.PORT || 3000);
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(allowCrossDomain);

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//create uuid for device
app.post('/uuid', routes_user.uuid);

//sign up
app.post('/user', routes_user.new);

app.post('/profile', routes_user.profile);

app.post('/logout', routes_user.logout);

app.post('/login', routes_user.login);

app.post('/autologin', routes_user.autologin);



http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});