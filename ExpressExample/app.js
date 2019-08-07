var express = require('express');
var http = require('http');

var app = express();
app.set('port', process.env.PORT || 3000);

var server = http.createServer(app);

server.listen(app.get('port'), function(){
    console.log('express로 web server 실행' + app.get('port'));
});