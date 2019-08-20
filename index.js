var express = require('express');
var bodyParser = require('body-parser');

var app = express();

app.set('view engine', 'ejs');
urlencodedParser = bodyParser.urlencoded({ extended: false });
app.use('/public', express.static('public'));


app.set('port', process.env.PORT || 3000);

app.get('/', function (req, res) {
    res.render('index');
});
app.get('/index', function (req, res) {
    res.render('index');
});

app.get('/dashboard', function (req, res) {
    res.render('dashboard');
});

app.get('/booking', function(req, res){
    res.render('booking', {qs:req.query});
});

app.get('/profile', function (req, res) {
    res.render('profile');
});

app.get('/editprofile', function (req, res) {
    res.render('editprofile');
});

app.get('/sign', function (req, res) {
    res.render('sign');
});

app.get('/token', function (req, res) {
    res.render('token');
});

app.get('/passreset', function (req, res) {
    res.render('passreset');
});

app.get('/passtoken', function (req, res) {
    res.render('passtoken');
});

app.get('/newpass', function (req, res) {
    res.render('newpass');
});

app.get('/destination', function (req, res) {
    res.render('destination');
});

app.get('/history', function (req, res) {
    res.render('history');
});

app.post('/target', urlencodedParser, function (req, res) {
    res.redirect(303, '/dashboard');
});

app.post('/token', urlencodedParser, function (req, res) {
    res.redirect(303, '/token');
});


app.use(function (req, res) {
    res.status(404);
    res.render('404');
});

app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500);
    res.render('500');
});

app.listen(app.get('port'), function (err) {
    if (err) throw err;
    console.log("App is running on http://localhost:3000");
});