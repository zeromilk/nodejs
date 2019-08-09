var express = require('express');
var http    = require('http');
var static  = require('serve-static');
var path    = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

var app = express();
app.set('port', process.env.PORT || 3000);
//app.use('/public', static(path.join(__dirname, 'public')));
app.use(static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use(cookieParser());

var router = express.Router();

router.route('/process/setUserCookie').get(function(req, res){
    console.log('/process/setUserCookie 라우트 함수에서 받음');

    res.cookie('User', {
        id:'test',
        name:'mike',
        authorized:true
    });

    res.redirect('/process/showCookie');
});

router.route('/process/showCookie').get(function(req, res){
    console.log('/process/showCookie 라우트 함수에서 받음');

    res.send(req.cookies);
});

app.use('/', router);

app.all('*', function(req, res){
    res.status(404).send('<h1>요청하신 페이지를 찾을 수가 없습니다.</h1>');
});

var server = http.createServer(app);
server.listen(app.get('port'), function(){
    console.log('express로 web server 실행' + app.get('port'));
});