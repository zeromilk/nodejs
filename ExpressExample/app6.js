var express = require('express');
var http = require('http');

var app = express();
app.set('port', process.env.PORT || 3000);

app.use(function(req, res, next){
    console.log('첫번째 미들웨어 호출됨.');

    var userAgent = req.header('User-Agent');
    var paramName = req.query.name;

    res.send(userAgent+'<br/>'+paramName);
});



var server = http.createServer(app);
server.listen(app.get('port'), function(){
    console.log('express로 web server 실행' + app.get('port'));
});