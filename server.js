
/*

var http = require("http");

http.createServer(function(request, response) {
  response.writeHead(200, {"Content-Type": "text/plain"});
  response.write("Hello World");
  response.end();
}).listen(31955);

*/

var LOG_LEVEL = 'DEBUG';
var SERVER_PORT = 31955;


var serve_index    = require('serve-index');
var serve_static   = require('serve-static');
var google_news    = require('./modules/google_news/google_news');

var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);



app.engine('ejs', require('ejs').__express);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs'); // what to use by default if no extension is passed to render()

// log requests
LOG_LEVEL == 'DEBUG' && app.use(function (req, res, next) {
    console.log('%s %s', req.method, req.url);
    next();
});

app.get('/', function(req, res) {
  res.render('google_news',  { message: 'welcome to google news' });
});

app.use('/', serve_index(__dirname+'/public', {'icons': true}));
app.use('/', serve_static(__dirname+'/public', {'index': ['index.html']}));

// handle 404 (everything else is 404)
app.use(function (req, res, next) {
    console.log('!Not found! %s %s', req.method, req.url);
    res.status(404).send('not found');
});

// handle 500 (default catch for any next('error'))
app.use(function (err, req, res, next) {
    console.log('!Server Error! %s %s', req.method, req.url);
    res.status(500).send(err);
});


io.on('connection', function (socket) { 
    console.log('ws connected');
    socket.on('get_news', function (criteria) {
        google_news.get_news(criteria, function on_news_retrieved (error, response, body) {
            var msg = JSON.parse(body);
            socket.emit('news_list', msg);
            console.log('news_list sent');
        });
    });
    socket.on('disconnect', function () {
        console.log('ws disconnected');
    });
});

server.listen(SERVER_PORT, function(){
    console.log('Listening on port %d', server.address().port);
});




