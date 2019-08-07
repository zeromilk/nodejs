var http = require('http');
var fs = require('fs');

var server = http.createServer();

var port = 3000;
var host = 'localhost';
var backlog = 50000;
/*backlog : 한번에 접속 할 수 있는 요청의 수*/
server.listen(port, host, backlog, function(){
    console.log(
        '웹 서버 실행됨.'
    );
});

server.on('connection', function(socket){
    console.log('client 접속');
});

server.on('request', function(req, res){
    console.log('client 요청');
    //console.dir(req);

    /*
    res.writeHead(200, {'Content-Type':'text/html;charset=utf-8'});
    res.write('<h1>server 응답</h1>');
    res.end();
    */

    var filename = 'ch05/reddit.png';
    fs.readFile(filename, function(err, data){
        res.writeHead(200, {'Content-Type':'image/png'});
        res.write(data);
        res.end();
    });    
});