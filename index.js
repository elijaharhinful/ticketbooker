const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');
const session = require('express-session');
const jsdom = require('jsdom');
"use strict";
const nodemailer = require("nodemailer");
const TeleSignSDK = require('telesignsdk');
//const messagebird = require('messagebird')('zxQxefh9UCbIMZGsBorCWxUlk');
//const Ravepay = require('ravepay');

const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = (new JSDOM('')).window;
global.document = document;
var $ = jQuery = require('jquery')(window);

const app = express();
app.use(cors());

//creating app session
app.use(session({
    secret: 'secretforapp',
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
var prices1="";
axios.get("http://achatcryptostg.com/stcapp/public/companyalldetails/1")
	.then(function(response){
        prices1 = response.data.response
    })
    .catch(function(error){
        console.log(error)
    })
var prices2 = "";
axios.get("http://achatcryptostg.com/stcapp/public/companyalldetails/2")
	.then(function(response){
        prices2 = response.data.response
    })
    .catch(function(error){
        console.log(error)
    })
var prices3 = "";
axios.get("http://achatcryptostg.com/stcapp/public/companyalldetails/3")
	.then(function(response){
        prices3 = response.data.response
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

var thetoken = "";
var message = "";
var message1 = "";
var sometoken = "";
var resetnnum = "";
var msg = "";

app.get('/', function (req, res) {
    res.render('index',{prices1,prices2,prices3});
});
app.get('/index', function (req, res) {
    res.render('index',{prices1,prices2,prices3});
});

app.get('/contact', function (req, res) {
    res.render('contact');
});

app.get('/about', function (req, res) {
    res.render('about');
});
    
app.get('/dashboard', function (req, res) {
    if (req.session.loggedin){
        res.render('dashboard',{prices1,prices2,prices3})
    } else{
        res.render('login',{prices1,prices2,prices3,message,message1});
    }
});

app.get('/booking', function(req, res){
    res.render('booking',{prices1,prices2,prices3,companyname});
});

app.get('/busdestination',function(req,res){
    res.render('busdestination',{prices1,prices2,prices3,idname,iddetails});
});

app.get('/destinationdetails', function (req, res) {
    res.render('destinationdetails',{prices1,prices2,prices3,details,buses});
});

app.get('/payment', function (req, res) {
    res.render('payment',{prices1,prices2,prices3,details,buses});
});

app.get('/profile', function (req, res) {
    res.render('profile');
});

app.get('/editprofile', function (req, res) {
    res.render('editprofile');
});

app.get('/sign', function (req, res) {
    res.render('sign',{message});
});

app.get('/login', function (req, res) {
    res.render('login',{message,message1});
});
app.get('/token', function (req, res) {
    res.render('token',{message,thetoken});
});

app.get('/passreset', function (req, res) {
    res.render('passreset',{message});
});

app.get('/passtoken', function (req, res) {
    res.render('passtoken',{sometoken,msg});
});

app.get('/newpass', function (req, res) {
    res.render('newpass',{message,resetnnum});
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
            thestatus = response.data.status;
            if (thestatus == "success") {
                req.session.loggedin = true;
				res.redirect('/dashboard');
            }else if (response.data.message == "Invalid Password"){
                message = "Invalid Password"
                res.render('login',{message : message,message1:message1})
                message = "";
            } 
            else if (thestatus == "error"){
                message = 'Sorry you do not have any account with the details you logged in with. Go to signup page to create an account';
                res.render('login',{message : message,message1:message1})
                message = "";
			}
			res.end();
        })
        .catch(function(error){
            console.log(error)
        })	
	} else {
        message = "Invalid login details"
        res.render('login',{message : message,message1:message1})
    }
});

//this is for user signup
app.post('/token', urlencodedParser, function (req, res) {
    firstname = req.body.firstname;
    lastname = req.body.lastname;
    email = req.body.email;
    num = req.body.tel;
    psw = req.body.psw;
    cpsw = req.body.cpsw;
    if (psw == cpsw){
        axios.post("http://achatcryptostg.com/stcapp/public/signup",{
            phone : num,
            password : psw
        })
        .then(function(response){
            thestatus = response.data.status;
            thetoken = response.data.token;
            tokenmsg = "Dear Customer, use this token " + thetoken + " to verify your new TransPo account";
            if (thestatus == "success"){
                // async..await is not allowed in global scope, must use a wrapper
                async function main() {
                // Generate test SMTP service account from ethereal.email
                // Only needed if you don't have a real mail account for testing
                let testAccount = await nodemailer.createTestAccount();

                // create reusable transporter object using the default SMTP transport
                let transporter = nodemailer.createTransport({
                    host: "smtp.ethereal.email",
                    port: 587,
                    secure: false, // true for 465, false for other ports
                    auth: {
                    user: testAccount.user, // generated ethereal user
                    pass: testAccount.pass // generated ethereal password
                    }
                });

                // send mail with defined transport object
                let info = await transporter.sendMail({
                    from: '"Fred Foo 👻" <foo@example.com>', // sender address
                    to: email, // list of receivers
                    subject: "TransPo Registration Token", // Subject line
                    text: tokenmsg, // plain text body
                    html: "<b>Hello world?</b>" // html body
                });

                console.log("Message sent: %s", info.messageId);
                // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

                // Preview only available when sending through an Ethereal account
                console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
                // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
                }
                main().catch(console.error);

                //telesign sms 
                const customerId = "75DA083A-6A1A-48CC-B3A4-EB0BED75E8CD";
                const apiKey = "xxlW8qHbqwdIJQhKfDoE/+RCDFvZ5F9B28UuuNKd+Zafv3qTaj+zwgDkiT7AXEgFhG5qLf1pJYAGM3RdiyeA9g==";
                const rest_endpoint = "https://rest-api.telesign.com";
                const timeout = 300*1000; // 5 min
            
                const client = new TeleSignSDK( customerId,
                    apiKey,
                    rest_endpoint,
                    timeout // optional
                    // userAgent
                );
            
                const phoneNumber = "2330548777676";
                const message = tokenmsg;
                const messageType = "ARN";
            
                console.log("## MessagingClient.message ##");
            
                function messageCallback(error, responseBody) {
                    if (error === null) {
                        console.log(`Messaging response for messaging phone number: ${phoneNumber}` +
                            ` => code: ${responseBody['status']['code']}` +
                            `, description: ${responseBody['status']['description']}`);
                    } else {
                        console.error("Unable to send message. " + error);
                    }
                }
                client.sms.message(messageCallback, phoneNumber, message, messageType);
                //end of telesign sms
                
                res.render('token',{thetoken});
            }else{
                message = "User already exist. Go to login in page to login in to your account"
                res.render('sign',{message : message})
                message = "";
            }
            res.end();
        })
        .catch(function(error){
            console.log(error)
        })
    }else {
        message = "Passwords do not match"
        res.render('sign',{message : message})
        res.end();
    }
});


//for token verification
app.post('/target', urlencodedParser, function (req, res) {
    var token = req.body.token;
    if (token == thetoken){
        message1 = "Account created. You may login"
        res.render('login', {message:message, message1 : message1})
        message1 = "";
        res.end();
    }
    else{
        message = "Invalid token"
        res.render('token',{thetoken:thetoken,message : message})
        res.end();
    }
});

//this is for password reset
app.post('/passtoken',urlencodedParser,function(req,res){
    var num = req.body.tel;
    axios.post("http://achatcryptostg.com/stcapp/public/sendtoken",{
        phone : num
    })
    .then(function(response){
        sometoken = response.data.token;
        tokenmsg = "Dear Customer, use this token " + sometoken + " to create your new TransPo password";
        if (response.data.status == 'success'){
            resetnnum = num

            //telesign sms 
            const customerId = "75DA083A-6A1A-48CC-B3A4-EB0BED75E8CD";
            const apiKey = "xxlW8qHbqwdIJQhKfDoE/+RCDFvZ5F9B28UuuNKd+Zafv3qTaj+zwgDkiT7AXEgFhG5qLf1pJYAGM3RdiyeA9g==";
            const rest_endpoint = "https://rest-api.telesign.com";
            const timeout = 300*1000; // 5 min
          
            const client = new TeleSignSDK( customerId,
                apiKey,
                rest_endpoint,
                timeout // optional
                // userAgent
            );
          
            const phoneNumber = "2330548777676";
            const message = tokenmsg;
            const messageType = "ARN";
          
            console.log("## MessagingClient.message ##");
          
            function messageCallback(error, responseBody) {
                if (error === null) {
                    console.log(`Messaging response for messaging phone number: ${phoneNumber}` +
                        ` => code: ${responseBody['status']['code']}` +
                        `, description: ${responseBody['status']['description']}`);
                } else {
                    console.error("Unable to send message. " + error);
                }
            }
            client.sms.message(messageCallback, phoneNumber, message, messageType);
            //end of telesign sms

            res.render('passtoken',{sometoken : sometoken,msg : msg})
        }
        else{
            message = 'Enter valid phone number'
            res.render('passreset',{message : message})
        }
        res.end();
    })
    .catch(function(error){
        console.log(error)
    })
});


app.post('/newpass',urlencodedParser,function(req,res){
    var tok = req.body.token;
    if (tok == sometoken){
        message = "";
        res.render('newpass',{message:message});
    }
    else{
        msg = 'Invalid token'
        res.render('passtoken',{msg:msg})
    }
    res.end();
});

app.post('/tologin',urlencodedParser,function(req,res){
    var pass = req.body.newpassword;
    var cpass = req.body.password;
    if (pass == cpass){
        axios.post('http://achatcryptostg.com/stcapp/public/resetpassword',{
            phone : resetnnum,
            password : pass
        })
        .then(function(response){
            res.render('success')
        })
        .catch(function(error){
            console.log(error);
        })
    }
    else{
        message = "Passwords do not match"
        res.render('newpass',{message:message})
    }
});

/*To update user profile
app.post('/editprofile',urlencodedParser,function(req,res){
    var firstname = req.body.first_name;
    var lastname = req.body.last_name;
    var email = req.body.email;
    var num = req.body.num;
    axios.post('http://achatcryptostg.com/stcapp/public/updateUserProfile',{
        phone : num,
        email : email,
        name : firstname + lastname
    })
    .then(function(response){
        console.log(response)
    })
    .catch(function(error){
        console.log(error);
    })
})
*/

/*To post ticket details
app.post()

*/

/*To post subscription emails 
app.post('/subcribe',urlencodedParser,function(req,res){
    var email = req.bosy.email;
    axios.post('http://achatcryptostg.com/stcapp/public/')
    .then(function(response){
        console.log(response)
    })
    .catch(function(error){
        console.log(error);
    })
})
*/

var iddetails = "";
var idname = "";
app.post('/booking',urlencodedParser, function(req,res){
    var idurls = req.body.id;
    idname = req.body.name;
    axios.get("http://achatcryptostg.com/stcapp/public/companydestinationdetails/" + idurls)
    .then(function(response){
        iddetails = response.data.response
    })
    .catch(function(error){
        console.log(error);
    })
    res.end();
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
//routes end here

//error codes
app.use(function (req, res) {
    res.status(404);
    res.render('404');
});

app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500);
    res.render('500');
});

//listening server
app.listen(app.get('port'), function (err) {
    if (err) throw err;
    console.log("App is running on http://localhost:3000");
});