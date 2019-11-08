const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');
const session = require('express-session');
const jsdom = require('jsdom');

const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = (new JSDOM('')).window;
global.document = document;
var $ = jQuery = require('jquery')(window);

const app = express();
app.use(cors());

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

    //start of booking form control
var companyname = "";
var iddetails = "";
axios.get("http://achatcryptostg.com/stcapp/public/companies")
    .then(function(response){
        companyname = response.data.response
        var ids = [];
        for (var i = 0; i < companyname.length; i++){
           ids.push(companyname[i].id);
        }

        var myurl = "http://achatcryptostg.com/stcapp/public/companydestinationdetails/1"
                axios.get(myurl)
                    .then(function(response){
                    iddetails = response.data.response
                    console.log(iddetails)
                })
                .catch(function(error){
                    console.log(error)
            })
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
    res.render('booking',{prices,companyname,iddetails});
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

app.get('/destination', function (req, res) {
    res.render('destination');
});

app.get('/history', function (req, res) {
    res.render('history');
});

//node post requests
//this is for the login  
app.post('/auth',urlencodedParser, function(req, res) {
	var num = req.body.tel;
    var psw = req.body.password;
    var cpsw = req.body.cpassword;
	if (psw == cpsw) {
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