const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');
const session = require('express-session');
const jsdom = require('jsdom');
const Ravepay = require('ravepay');

const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = (new JSDOM('')).window;
global.document = document;
var $ = jQuery = require('jquery')(window);

const app = express();
app.use(cors());

//creating app session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

app.set('view engine', 'ejs');
urlencodedParser = bodyParser.urlencoded({ extended: false });
app.use('/public', express.static('public'));

app.set('port', process.env.PORT || 3000);

            //routes start here
//node get requests
    //this is to get pricing data
var prices="";
axios.get("http://achatcryptostg.com/stcapp/public/companyalldetails/1")
	.then(function(response){
        prices = response.data.response
    })
    .catch(function(error){
        console.log(error)
    })
    //end of prices 

    //start of booking data control
var companyname = "";
axios.get("http://achatcryptostg.com/stcapp/public/companies")
    .then(function(response){
        companyname = response.data.response
    })
    .catch(function(error){
        console.log(error)
    }) 
    //end of booking form control



app.get('/', function (req, res) {
    res.render('index',{prices});
});
app.get('/index', function (req, res) {
    res.render('index',{prices});
});
    
app.get('/dashboard', function (req, res) {
    if (req.session.loggedin){
        res.render('dashboard',{prices})
    } else{
        res.render('index',{prices});
    }
});

app.get('/booking', function(req, res){
    res.render('booking',{prices,companyname});
});

app.get('/busdestination',function(req,res){
    res.render('busdestination',{prices,iddetails});
});

app.get('/destinationdetails', function (req, res) {
    res.render('destinationdetails',{prices,details,buses});
});

app.get('/profile', function (req, res) {
    res.render('profile');
});

app.get('/editprofile', function (req, res) {
    res.render('editprofile');
});

app.get('/sign', function (req, res) {
    res.render('sign',);
});

app.get('/login', function (req, res) {
    res.render('login');
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

app.get('/history', function (req, res) {
    res.render('history',{buses,details});
});

//node post requests
//this is for the login  
app.post('/auth',urlencodedParser, function(req, res) {
	var num = req.body.tel;
    var psw = req.body.password;
	if (psw) {
       axios.post("http://achatcryptostg.com/stcapp/public/login",{
            phone : num,
            password : psw
        })
        .then(function(response){
            if (response.data.status = "success") {
				req.session.loggedin = true;
				//req.session.num = phone;
				res.redirect('/dashboard');
			} else {
                console.log(error)
			}			
			res.end();
        })
        .catch(function(error){
            console.log(error)
        })	
	} else {
        $('.msg').text('Incorrect Username and/or Password!');
    }
});

var iddetails = "";
app.post('/booking',urlencodedParser, function(req,res){
    var idurls = req.body.id;
    axios.get("http://achatcryptostg.com/stcapp/public/companydestinationdetails/" + idurls)
    .then(function(response){
        iddetails = response.data.response
    })
    .catch(function(error){
        console.log(error);
    })
});

var details = "";
var buses = "";
app.post('/busdestination',urlencodedParser,function(req,res){
    var from = req.body.from;
    var to = req.body.to;
    axios.get("http://achatcryptostg.com/stcapp/public/companydestination/"+ from +"/" + to + "/1")
    .then(function(response){
        details = response.data.response
        buses = details.buses
    })
    .catch(function(error){
        console.log(error);
    })
});

app.post('/target', urlencodedParser, function (req, res) {
    res.redirect(303, '/dashboard');
});

app.post('/token', urlencodedParser, function (req, res) {
    res.redirect(303, '/token');
});
//routes end here

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