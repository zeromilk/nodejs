var express = require('express');
var http    = require('http');
var static  = require('serve-static');
var path    = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');

var app = express();
app.set('port', process.env.PORT || 3000);
//app.use('/public', static(path.join(__dirname, 'public')));
app.use('/public',static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use(cookieParser());
app.use(expressSession({
    secret:'my key',
    resave:true,
    saveUninitialized:true
}));

var router = express.Router();

router.route('/process/product').get(function(req, res){
    console.log('/process/product 라우트 함수에서 받음');

    if(req.session.user) {
        res.redirect('/public/product.html');
    }else{
        res.redirect('/public/login.html');
    }
});

router.route('/process/login').post(function(req, res){
    console.log('/process/login 라우트 함수에서 받음');

    var paramId = req.body.id || req.query.id;
    var paramPassword = req.body.password || req.query.password;

    if(req.session.user){
        console.log('이미 로그인 되어있습니다.');

        res.redirect('/product/product.html');
    }else{
        req.session.user = {
            id:paramId,
            name:'mike',
            authorized:true
        };

        res.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
        res.write('<h1>로그인 성공</h1>');
        res.write('<p>id:' +paramId+'</p>');
        res.write('<br><br/><a href=/process/product>상품 페이지로 이동하기</a>');
        res.end();
    }
});

router.route('/process/logout').get(function(req, res){
    console.log('/process/logout 라우트 함수에서 받음');

    if(req.session.user){
        console.log('로그아웃합니다.');

        req.session.destroy(function(err){
            if(err){
                console.log('세션 삭제 시 에러 발생');
                return;
            }

            console.log('세션 삭제 성공');
            res.redirect('/public/login.html');
        });
    }else{
        console.log('로그인 되어 있지 않습니다.');    
        res.redirect('/public/login.html');
    }
});
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