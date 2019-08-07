var express = require('express');
var http = require('http');

var app = express();
app.set('port', process.env.PORT || 3000);

app.use(function(req, res, next){
    console.log('첫번째 미들웨어 호출됨.');

    res.writeHead(200, {'Content-Type':'text/html;charset=utf-8'});
    res.end('<h1>server에서 응답한 결과</h1>');
});


var server = http.createServer(app);

server.listen(app.get('port'), function(){
    console.log('express로 web server 실행' + app.get('port'));
});