"use strict";
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');
const axios = require('axios');
const session = require('express-session');
var redis = require('redis');
const RedisStore = require('connect-redis')(session);
const Redis = require('ioredis');
var url = require('url')
const qrcode = require('qrcode');
//const qr = require('qr-image');
//const jsdom = require('jsdom');
const nodemailer = require("nodemailer");
const TeleSignSDK = require('telesignsdk');

// const { JSDOM } = jsdom;
// const { window } = new JSDOM();
// const { document } = (new JSDOM('')).window;
// global.document = document;
// var $ = jQuery = require('jquery')(window);

const TWO_HOURS = 1000 * 60 * 60 * 2; //2 HOURS

const {
    PORT = 3000,
    NODE_ENV = "development",

    SESS_NAME = 'sid',
    SESS_SECRET = 'appkeysecret',
    SESS_LIFETIME = TWO_HOURS 
} = process.env

const IN_PROD = NODE_ENV === 'production'

// invoke an instance of express application.
const app = express();
app.use(cors());

// initialize body-parser to parse incoming parameters requests to req.body
app.use(bodyParser.urlencoded({
    extended: true
}));

//using redis with heroku
// var client;
// var store;
//     if (process.env.REDISTOGO_URL) {
//         var redisURL = url.parse(process.env.REDISTOGO_URL);
//         client = redis.createClient(redisURL.port, redisURL.hostname);
//         client.auth(redisURL.auth.split(":")[1]);
//         store = new RedisStore({ client: client });
//     } else {
//         client = redis.createClient();
//     }

// var store;
// if (process.env.REDISTOGO_URL) {
//     // TODO: redistogo connection
//     var rtg   = require("url").parse(process.env.REDISTOGO_URL);
//     var redis = require("redis").createClient(rtg.port, rtg.hostname);
//     console.log(rtg.port)

//     redis.auth(rtg.auth.split(":")[1]);
//     store = new RedisStore({ client: redis })
// } else {
//     var redis = require("redis").createClient();
// }

const client = new Redis(process.env.REDIS_URL)
  
const store = new RedisStore({ client })

// initialize express-session to allow us track the logged-in user across sessions.
app.use(session({
    store,
    name : SESS_NAME,
    secret: SESS_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: SESS_LIFETIME,
        sameSite : true,
        secure : IN_PROD
    }
}));

const redirectlogin = (req, res, next) =>{
    if (!req.session.userId){
        res.redirect('/login')
    }else{
        next()
    }
}

const redirectregister = (req, res, next) =>{
    if (!req.session.userId){
        res.redirect('/sign')
    }else{
        next()
    }
}

const redirectpassreset = (req, res, next) =>{
    if (!req.session.userId){
        res.redirect('/passreset')
    }else{
        next()
    }
}



const redirectDashboard = (req, res, next) =>{
    if (req.session.userId){
        res.redirect('/dashboard')
    }else{
        next()
    }
}

app.use((req,res,next)=>{
    const {userId} = req.session
    if (userId){
        res.locals.user = user
    }
    next();
})

app.set('view engine', 'ejs');
app.use('/public', express.static('public'));

// const port = process.env.PORT || 3000;
// app.set('port',port);



            //routes start here
//node get requests
    //this is to get pricing data
var prices1="";
axios.get("https://transspo.com/companyalldetails/1")
	.then(function(response){
        prices1 = response.data.response
    })
    .catch(function(error){
        console.log(error)
    })
var prices2 = "";
axios.get("https://transspo.com/companyalldetails/2")
	.then(function(response){
        prices2 = response.data.response
    })
    .catch(function(error){
        console.log(error)
    })
var prices3 = "";
axios.get("https://transspo.com/companyalldetails/3")
	.then(function(response){
        prices3 = response.data.response
    })
    .catch(function(error){
        console.log(error)
    })
    //end of prices 

    //start of booking data control
var companyname = "";
axios.get("https://transspo.com/companies")
    .then(function(response){
        companyname = response.data.response
    })
    .catch(function(error){
        console.log(error)
    }) 
    //end of booking form control

var user = "";
var thetoken = "";
var message = "";
var message1 = "";
var sometoken = "";
var resetnnum = "";
var msg = "";
var details = "";
var buses = "";
var detailscompany = "";
var success = "";
var chosendata = "";
var amounterror = "";
var amount = "";
var name = "";
var mobile = "";
var email = "";
var totalamount = "";
var description = "";
var payment = "";
var t_history = "";
var counter = [];

var iddetails = "";
var idname = "";
var idurls = "";
var from = "";
var to = "";

//for booked ticket//
var t_company_id = "";
var t_company_name = "";
var t_bus_no = "";
var t_seat = "";
var t_location = "";
var t_t_from = "";
var t_t_to = "";
var t_the_date = "";
var t_the_time = "";

var departtime = ""
app.get('/', function (req, res) {
    res.render('index',{prices1,prices2,prices3,companyname});
});
app.get('/index', function (req, res) {
    res.render('index',{prices1,prices2,prices3,companyname});
});

app.get('/contact', function (req, res) {
    res.render('contact');
});

app.get('/contact1', function (req, res) {
    res.render('contact1');
});

app.get('/about', function (req, res) {
    res.render('about');
});

app.get('/about1', function (req, res) {
    res.render('about1');
});
    
app.get('/dashboard',redirectlogin, function (req, res) {
    const {user} = res.locals
    axios.get("https://transspo.com/history/" + req.session.userId)
                .then(function(response){
                    t_history = response.data.response

                    counter = [];
                    for (var i = 0; i < t_history.length; i++){
                        var count = t_history[i].status;
                        if (count == 0 ){
                            counter.push(count)
                        }
                    }
                })
                .catch(function(error){
                    console.log(error)
                })
    res.render('dashboard',{prices1,prices2,prices3,user,t_history,counter})
    // if (req.session.loggedin){
    //     res.render('dashboard',{prices1,prices2,prices3,user})
    // } else{
    //     res.render('login',{prices1,prices2,prices3,message,message1});
    // }
});

app.get('/booking',redirectlogin, function(req, res){
    res.render('booking',{prices1,prices2,prices3,companyname,user,amounterror});
});

app.get('/busdestination',redirectlogin,function(req,res){
    axios.get("https://transspo.com/companydestinationdetails/" + idurls)
    .then(function(response){
        iddetails = response.data.response
        res.render('busdestination',{prices1,prices2,prices3,idname,iddetails,user});
    })
    .catch(function(error){
        console.log(error);
    })
});

app.get('/destinationdetails',redirectlogin, function (req, res) {
    axios.get("https://transspo.com/companydestination/"+ from +"/" + to + "/" + idurls)
    .then(function(response){
        details = response.data.response
        buses = details.buses
        detailscompany = details.company
        res.render('destinationdetails',{prices1,prices2,prices3,user,details,buses,chosendata,detailscompany});
    })
    .catch(function(error){
        console.log(error);
    })
});

app.get('/payment',redirectlogin, function (req, res) {
    res.render('payment',{prices1,prices2,prices3,details,buses});
});

app.get('/profile',redirectlogin, function (req, res) {
    const {user} = res.locals
    res.render('profile',{user})
});

app.get('/editprofile',redirectlogin, function (req, res) {
    const {user} = res.locals
    res.render('editprofile',{success,user});
});

app.get('/sign',redirectDashboard, function (req, res) {
    res.render('sign',{message});
});

app.get('/login',redirectDashboard, function (req, res) {
    //req.session.userId = 
    res.render('login',{message,message1});
});

app.get('/logout',redirectlogin, function(req,res){
    req.session.destroy(err => {
        if (err){
            res.redirect('/dashboard')
        }else{
            res.clearCookie(SESS_NAME)
            res.redirect('/login')
        }
    })
})

app.get('/token',function (req, res) {
    res.render('token',{message,thetoken});
});

app.get('/passreset', function (req, res) {
    res.render('passreset',{message});
});

app.get('/passtoken', function (req, res) {
    res.render('passtoken',{sometoken,msg});
});

app.get('/resend', function (req, res) {
    if (sometoken){
        resetnnum = req.session.userId

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
});

app.get('/newpass', function (req, res) {
    res.render('newpass',{message,resetnnum});
});


app.get('/history', redirectlogin,function (req, res) {
    axios.get("https://transspo.com/history/" + req.session.userId)
                .then(function(response){
                    t_history = response.data.response

                    var transact_id = "that text"
                    run().catch(error => console.error(error.stack));
                    async function run() {
                        var imgsrc = await qrcode.toDataURL(transact_id);
                        var new_imgsrc = imgsrc.substr(22);
                    }
                })
                .catch(function(error){
                    console.log(error)
                })
    res.render('history',{buses,details,user,t_history,success});
});

app.get('/ticket',redirectlogin,async function(req,res){
    res.render('ticket',{buses,details,chosendata})
})

app.get('/ticketmain',async function(req,res){
    // mytext = "some text"
    // var qr_png = qr.imageSync(mytext,{ type: 'png'})
    // let qr_code_file_name = new Date().getTime() + '.png';
    // fs.writeFileSync('./public/qr/' + qr_code_file_name, qr_png, (err) => {
    //     if(err){
    //         console.log(err);
    //     }  
    // })
    // // Send the link of generated QR code
    // var qrurl = "";
    // // var qrurl = "public/qr/" + qr_code_file_name
    res.render('ticketmain',{buses,details,chosendata})
})

app.get('/pay',redirectlogin,function(req,res){
    res.render('pay',{amount})
});

app.get('/payconfirm',redirectlogin,function(req,res){
    res.render('payconfirm',{payment})
});

app.get('/ticket-success',redirectlogin,function(req,res){
    var fullname = req.query["customer.fullName"];
    var phone = req.query["customer.phone"];
    var amount = req.query.amount;
    var payment_method = req.query.paymentType;
    var transaction_id = "transpo."+ req.query.id;
    var flwRef = req.query.flwRef;
    var status = req.query.status;
    // current timestamp in milliseconds
    // let ts = Date.now();

    // console.log()
    // var date_ob = new Date(ts);

    // var hour = date_ob.getHours();
    // hour = (hour < 10 ? "0" : "") + hour;

    // var min  = date_ob.getMinutes();
    // min = (min < 10 ? "0" : "") + min;

    // var sec  = date_ob.getSeconds();
    // sec = (sec < 10 ? "0" : "") + sec;

    // t_the_time = hour + ":" + min + ":" + sec;

    // var date = date_ob.getDate();
    // var month = date_ob.getMonth() + 1;
    // var year = date_ob.getFullYear();
    
    // t_the_date = year + "-" + month + "-" + date;
    
    // var imgsrc = "";
    // var transact_id = transaction_id;
    //     run().catch(error => console.error(error.stack));
    //     async function run() {
    //         imgsrc = await qrcode.toDataURL(transact_id);
    //     }

    // var transact_id = transaction_id;
    // var new_imgsrc = "";
    //     run().catch(error => console.error(error.stack));
    //     async function run() {
    //         var imgsrc = await qrcode.toDataURL(transact_id);
    //         new_imgsrc = imgsrc.substr(22);
    //         console.log(new_imgsrc)
    //     }

    axios.post('https://transspo.com/savebookdetails',{
        fullname : fullname,
        phone : phone,
        company_id : t_company_id,
        company_name : t_company_name,
        bus_no : t_bus_no,
        seat : t_seat,
        qrcode : new_imgsrc,
        flwref: flwRef, 
        location : t_location,
        t_from : t_t_from,
        t_to : t_t_to,
        amount : amount,
        payment_method : payment_method,
        transaction_id : transaction_id,
        status : status
    })
    .then(function(response){
        console.log(response);
    })
    .catch(function(error){
        console.log(error)
    })

    //telesign sms 
    const customerId = "75DA083A-6A1A-48CC-B3A4-EB0BED75E8CD";
    const apiKey = "xxlW8qHbqwdIJQhKfDoE/+RCDFvZ5F9B28UuuNKd+Zafv3qTaj+zwgDkiT7AXEgFhG5qLf1pJYAGM3RdiyeA9g==";
    const rest_endpoint = "https://rest-api.telesign.com";
    const themsg = "Dear customer, your ticket purchase was successful. Your transaction id is " + transaction_id;

    const client = new TeleSignSDK( customerId,
        apiKey,
        rest_endpoint
        // userAgent
    );

    const phoneNumber = "2330548777676";
    const message = themsg;
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
    
    res.render('ticket-success')
});

app.get('/ticket-failure',function(req,res){
    res.render('ticket-failure')
});

//for ticket cancellation
app.get('/cancelticket',function(req,res){
    var cancellationid = req.query.transactionid
    axios.get('http://transspo.com/cancelticket/' + cancellationid)
    .then(function(response){
        if (response.data.status == "success"){
            //telesign sms 
            const customerId = "75DA083A-6A1A-48CC-B3A4-EB0BED75E8CD";
            const apiKey = "xxlW8qHbqwdIJQhKfDoE/+RCDFvZ5F9B28UuuNKd+Zafv3qTaj+zwgDkiT7AXEgFhG5qLf1pJYAGM3RdiyeA9g==";
            const rest_endpoint = "https://rest-api.telesign.com";
            const themsg = "Dear customer, your ticket with transaction id: " +cancellationid+" was successfully cancelled";

            const client = new TeleSignSDK( customerId,
                apiKey,
                rest_endpoint
                // userAgent
            );

            const phoneNumber = "2330548777676";
            const message = themsg;
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
            success = '<div class="alert alert-success alert-dismissible fade in"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a><strong>Success! </strong> Ticket cancelled successfully.</div>'
            res.render('history',{buses,details,user,t_history,success})
            success = "";
        }else{
            success = '<div class="alert alert-danger alert-dismissible fade in"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a><strong>Failed! </strong> Ticket failed to cancel.</div>'
            res.render('history',{buses,details,user,t_history,success})
            success = "";
        }
    })
    .catch(function(error){
        console.log(error)
    }) 
})



//node post requests
//this is for the login  
app.post('/auth',redirectDashboard, function(req, res) {
	var num = req.body.tel;
    var psw = req.body.password;
    var rem = req.body.checkbox;
	if (psw && rem) {
        axios.post("https://transspo.com/login",{
            phone : num,
            password : psw
        })
        .then(function(response){
            var thestatus = response.data.status;
            if (thestatus == "success") {
                req.session.userId = num;
                req.session.cookie.maxAge = 1000 * 60 * 60 * 24 * 365 //1 year;
                //to get user profile
                axios.get('https://transspo.com/profile/' + req.session.userId)
                .then(function(response){
                    user = response.data.user
                })
                .catch(function(error){
                    console.log(error)
                })
                axios.get("https://transspo.com/history/" + req.session.userId)
                .then(function(response){
                    t_history = response.data.response

                    counter = [];
                    for (var i = 0; i < t_history.length; i++){
                        var count = t_history[i].status;
                        if (count == 0 ){
                            counter.push(count)
                        }
                    }
                })
                .catch(function(error){
                    console.log(error)
                })
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
	}else if(psw){
        axios.post("https://transspo.com/login",{
        phone : num,
        password : psw
    })
    .then(function(response){
        var thestatus = response.data.status;
        if (thestatus == "success") {
            req.session.userId = num;
            //to get user profile
            axios.get('https://transspo.com/profile/' + req.session.userId)
            .then(function(response){
                user = response.data.user
            })
            .catch(function(error){
                console.log(error)
            })
            axios.get("https://transspo.com/history/" + req.session.userId)
                .then(function(response){
                    t_history = response.data.response

                    counter = [];
                    for (var i = 0; i < t_history.length; i++){
                        var count = t_history[i].status;
                        if (count == 0 ){
                            counter.push(count)
                        }
                    }
                })
                .catch(function(error){
                    console.log(error)
                })
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
app.post('/token',redirectDashboard, function (req, res) {
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var email = req.body.email;
    var num = req.body.tel;
    var psw = req.body.psw;
    var cpsw = req.body.cpsw;
    if (psw == cpsw){
        axios.post("https://transspo.com/signup",{
            phone : num,
            password : psw
        })
        .then(function(response){
            req.session.userId = num
            var thestatus = response.data.status;
            var thetoken = response.data.token;
            var tokenmsg = "Dear Customer, use this token " + thetoken + " to verify your new TransPo account";
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
                message = "User already exist. Go to login in page to sign in to your account"
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

app.post('/logout',redirectlogin, function(req,res){
    req.session.destroy(err => {
        if (err){
            return res.redirect('/dashboard')
        }

        res.clearCookie(SESS_NAME)
        res.redirect('/login')
    })
})

//for token verification
app.post('/target',  function (req, res) {
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
app.post('/passtoken',function(req,res){
    var num = req.body.tel;
    req.session.userId = num
    axios.post("https://transspo.com/sendtoken",{
        phone : req.session.userId
    })
    .then(function(response){
        sometoken = response.data.token;
        tokenmsg = "Dear Customer, use this token " + sometoken + " to create your new TransPo password";
        if (response.data.status == 'success'){
            resetnnum = req.session.userId;

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

app.post('/newpass',function(req,res){
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

app.post('/tologin',function(req,res){
    var pass = req.body.newpassword;
    var cpass = req.body.password;
    if (pass == cpass){
        axios.post('https://transspo.com/resetpassword',{
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

//To update user profile
app.post('/editprofile',function(req,res){
    var firstname = req.body.first_name;
    var lastname = req.body.last_name;
    var email = req.body.email;
    var gender = req.body.gender;
    axios.post('https://transspo.com/savebasicprofile',{
        phone: req.session.userId,
        firstname : firstname,
        lastname : lastname,
        email : email,
        gender : gender
    })
    .then(function(response){
        success = '<div class="alert alert-success alert-dismissible fade in"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a><strong>Success! </strong> Go to <a href="/profile" class="alert-link">profile</a> to view updated profile.</div>'
        res.render('editprofile',{success})
        success = "";
    })
    .catch(function(error){
        console.log(error);
    })
})

//to submit customer details to payconfirm
app.post('/pay',function(req,res){
    totalamount = amount;
    var firstname = req.body.firstname; 
    var lastname = req.body.lastname;
    var mobile = req.body.extra_mobile;
    var email = req.body.extra_email;
    var description = req.body.description;

    payment = {
        totalamount : totalamount,
        firstname : firstname,
        lastname : lastname,
        mobile: mobile,
        email : email,
        description: description
    }
    res.render('payconfirm',{payment})
})

//For homepage search
// app.get('/search',function(req,res){
//     var from = req.params.searchfrom;
//     var to = req.params.searchto;
//     var searchid = req.params.searchid;
//     console.log(searchid)
//     axios.get('https://transspo.com/companyalldetails/1')
//     .then(function(response){
//         console.log(response)
//         res.render('index',{prices1,prices2,prices3,companyname})
//     })
//     .catch(function(error){
//         console.log(error)
//     })
// })




/*To post subscription emails 
app.post('/subcribe',function(req,res){
    var email = req.body.email;
    axios.post('https://transspo.com/')
    .then(function(response){
        success = '<div class="alert alert-success alert-dismissible fade in"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a><strong>Success! </strong> You have successfully subscribed to our newsletter</div>'
        console.log(response)
    })
    .catch(function(error){
        console.log(error);
    })
})
*/


app.post('/booking', function(req,res){
    idurls = req.body.id;
    idname = req.body.name;
});


app.post('/busdestination',function(req,res){
    from = req.body.from;
    to = req.body.to;
});

app.post('/destinationdetails',function(req,res){
    amount = req.body.amount;
    var duration = req.body.duration;
    var seatleft = req.body.seatleft;
    var departdate = req.body.departdate;
    departtime = req.body.departtime;

    t_company_id = req.body.detailscompanyid;
    t_company_name = req.body.detailscompanyname;
    t_bus_no = req.body.busno;
    t_seat;
    t_location = req.body.detailscompanylocation;
    t_t_from = req.body.detailsfrom;
    t_t_to = req.body.detailsto;
    t_the_date;
    t_the_time;

    chosendata = {
        amount: amount, 
        duration:duration,
        seatleft:seatleft,
        departdate:departdate,
        departtime:departtime,
        companyname : t_company_name,
        location: t_location,
        busno : t_bus_no
    }
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
app.listen(PORT, () => {
    console.log(`Listening to requests on https://localhost:${PORT}`);
  });
// app.listen(app.get('port'), function (err) {
//     if (err) throw err;
//     console.log("App is running on http://localhost:3000");
// }); 