node.js-simple-rest-api
=======================

How to implement login auth in node.js for RESTful API

1. User enters for the first time

1.1 The server assign an uuid to the device and save's it in the device table

2.1 User logs in

2.2 The server returns a hash (token(uuid + salt) + salt) that saves in the device table linking up the uuid with the user id .

