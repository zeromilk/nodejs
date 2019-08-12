var express = require('express');
var http    = require('http');
var static  = require('serve-static');

var path = require('path');
var bodyParser = require('body-parser');

var cookieParser = require('cookie-parser');
var expressSession = require('express-session');

//에러 핸들러 모듈 사용
var expressErrorHandler = require('express-error-handler');

//mongoose 모듈 사용
var mongoose = require('mongoose');

var database;
var UserSchema;
var UserModel;

//mongo db 커넥션 함수
function connectDB(){
    var databaseUrl = 'mongodb://localhost:27017/local';

    mongoose.Promise = global.Promise;
    mongoose.connect(databaseUrl, {useNewUrlParser:true});
    database = mongoose.connection;

    database.on('open', function(){
        console.log('데이터베이스에 연결됨 : ' + databaseUrl);

        UserSchema = mongoose.Schema({
            id: String,
            name: String,
            password: String
        });
        console.log('UserSchema 정의함.');

        UserModel = mongoose.model('Users', UserSchema);
        console.log('UserModel 정의함.');
    });

    database.on('disconnected', function(){
        console.log('데이터베이스 연결 끊어짐.');
    });

    database.on('error', console.error.bind(console, 'mongoose 연결 에러'));
};

var app = express();
app.set('port', process.env.PORT || 3000);
//app.use(static(path.join(__dirname, 'public')));
app.use('/public', static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use(cookieParser());
app.use(expressSession({
    secret:'my key',
    resave:true,
    saveUninitialized:true
}));

var router = express.Router();

//mongodb를 db조회
router.route('/process/login').post(function(req, res){
    console.log('/process/login 라우팅 함수 호출됨.');
    
    var paramId = req.body.id || req.query.id;
    var paramPassword = req.body.password || req.query.password;

    console.log('요청 파라미터 : ' + paramId + ', ' + paramPassword);

    if(database){
        authUser(database, paramId, paramPassword, function(err, docs){
            if(err){
                console.log('에러 발생');
                
                res.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
                res.write('<h1>에러 발생</h1>');
                res.end();
            }
            
            if(docs){
                console.dir(docs);

                res.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
                res.write('<h1>사용자 로그인 성공</h1>');
                res.write('<div><p>사용자 : ' + docs[0].name + '</p></div>');
                res.write('<br/><br/><a href="/public/login.html">다시 로그인 하기</a>');
                res.end();
            }else{
                console.log('에러 발생');
                res.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
                res.write('<h1>사용자 데이터 조회 안됨</h1>');
                res.end();
            }
        })
    }else{
        console.log('에러 발생');
        res.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
        res.write('<h1>데이터 베이스 연결 안됨</h1>');
        res.end();
    }
});

//mongodb를 db삽입
router.route('/process/adduser').post(function(req, res){
    console.log('/process/adduser 라우팅 함수 호출됨.');

    var paramId = req.body.id || req.query.id;
    var paramPassword = req.body.password || req.query.password;
    var paramName = req.body.name || req.query.name;

    console.log('요청 파라미터 : ' + paramId + ', ' + paramPassword + ', ' + paramName );

    if(database){
        addUser(database, paramId, paramPassword, paramName, function(err, result){
            if(err){
                console.log('에러 발생');
                
                res.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
                res.write('<h1>에러 발생</h1>');
                res.end();
            }

            if(result){
                console.dir(result);

                res.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
                res.write('<h1>사용자 추가 성공</h1>');
                res.write('<div><p>사용자 : ' + paramName + '</p></div>');
                res.end();
            }else{
                console.log('에러 발생');
                res.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
                res.write('<h1>사용자 추가 안됨</h1>');
                res.end();
            }
        });
    }else{
        console.log('에러 발생');
        res.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
        res.write('<h1>데이터 베이스 연결 안됨</h1>');
        res.end();
    }
});

app.use('/', router);

var authUser = function(db, id, password, callback){
    console.log('authUser 호출됨 : ' + id + ', ' + password);

    UserModel.find({'id':id, 'password':password}, function(err, docs){
        if(err) {
            callback(err, null);
            return;
        }

        if(docs.length > 0) {
            console.log('일치하는 사용자를 찾음');
            callback(null, docs);
        }else{
            console.log('일치하는 사용자를 찾지 못함.');
            callback(null, null);
        }
    });
};

var addUser = function(db, id, password, name, callback){
    console.log('addUser 호출됨 : ' + id + ', ' + password + ', ' + name);

    var user = new UserModel({id:id, password:password, name:name});
    user.save(function(err){
        if(err){
            callback(err, null);
        }

        console.log('사용자 데이터 추가함');
        callback(null, user);
    });
};

//등록되지 않은 패스에 대해 페이지 오류 응답
app.all('*', function(req, res){
    res.status(404).send('<h1>ERROR - 요청하신 페이지를 찾을 수가 없습니다.</h1>');
});

//404에러 페이지 처리
var errorHandler = expressErrorHandler({
    static:{
        '404':'./public/404.html'
    }
});

app.use(expressErrorHandler.httpError(404));
app.use(errorHandler);

var server = http.createServer(app);
server.listen(app.get('port'), function(){
    console.log('app3.js >> express로 web server 실행' + app.get('port'));

    connectDB();
});