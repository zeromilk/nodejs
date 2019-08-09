var express = require('express');
var http    = require('http');
var static  = require('serve-static');
var path    = require('path');
var bodyParser = require('body-parser');

var app = express();
app.set('port', process.env.PORT || 3000);
//app.use('/public', static(path.join(__dirname, 'public')));
app.use(static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

var router = express.Router();
router.route('/process/login/:name').post(function(req, res){
    console.log('/process/login/:name 라우트 함수에서 받음');

    var paramName = req.params.name;    
    var paramId = req.body.id || req.query.id;
    var paramPassword = req.body.password || req.query.password;

    res.writeHead(200, {'Content-Type':'text/html;charset=utf-8'});
    res.write('<h1>서버에서 로그인 응답</h1>');
    res.write("<div><p>" +paramName + "</div></p>");
    res.write("<div><p>" +paramId + "</div></p>");
    res.write("<div><p>" +paramPassword + "</div></p>");
    res.end();
});

app.use('/', router);

var server = http.createServer(app);
server.listen(app.get('port'), function(){
    console.log('express로 web server 실행' + app.get('port'));
});