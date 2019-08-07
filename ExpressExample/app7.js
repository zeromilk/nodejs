var express = require('express');
var http = require('http');
var static = require('serve-static');
var path = require('path');
var bodyParser = require('body-parser');

var app = express();
app.set('port', process.env.PORT || 3000);
app.use(static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(function(req, res, next){
    console.log('첫번째 미들웨어 호출됨.');

    var paramName = req.body.name || req.query.name;

    res.send(paramName);
});

var server = http.createServer(app);
server.listen(app.get('port'), function(){
    console.log('express로 web server 실행' + app.get('port'));
});