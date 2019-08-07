var express = require('express');
var http = require('http');

var app = express();
app.set('port', process.env.PORT || 3000);

app.use(function(req, res, next){
    console.log('첫번째 미들웨어 호출됨.');

    req.user = 'mike';

    next();
});

app.use(function(req, res, next){
    console.log('두번째 미들웨어 호출됨.');

    //res.send('<h1>server에서 응답한 결과 : '+req.user+'</h1>');

    var person = {name:'소녀시대', age:20};
    //res.send(person);

    /*
        JSON.stringify : 객체 -> 문자열
        JSON.person    : 문자열 -> 객체
    */
    var personStr = JSON.stringify(person); 
    //res.send(personStr);

    res.writeHead(200, {'Content-Type':'application/json;charset=utf-8'});
    res.write(personStr);
    res.end();
});

var server = http.createServer(app);
server.listen(app.get('port'), function(){
    console.log('express로 web server 실행' + app.get('port'));
});