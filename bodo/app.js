var path = require('path');
var express = require('express');
var crypto = require('crypto');
var bodyParser = require('body-parser');
var multer  = require('multer');
var fs = require('fs');
var https = require('https');
var session = require('express-session');
var expressValidator = require('express-validator');
var privateKey = fs.readFileSync( 'server.key' );
var certificate = fs.readFileSync( 'server.crt' );
var config = {
        key: privateKey,
        cert: certificate
};
var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var upload = multer({ dest: 'uploads/' });



var Datastore = require('nedb'), 
users = new Datastore({ filename: 'db/users.db', autoload: true });

app.use(function (req, res, next){
    console.log("HTTP request", req.method, req.url, req.body);
    return next();
});

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true, sameSite: true }
}));


// sanitization and validation from lab7
app.use(expressValidator({
    customValidators: {
        isAction: function(value) {
            return (['upvote','downvote'].indexOf(value) > -1);
        },
        fail: function(value){
            return false;
        }
    }
})); 

app.use(function(req, res, next){
    Object.keys(req.body).forEach(function(arg){
        switch(arg){
            case 'username':
                req.checkBody(arg, 'invalid username').isAlpha();
                break;
            case 'password':
                break;
            case 'content':
                req.sanitizeBody(arg).escape();
                break;
            case 'action':
                req.checkBody(arg, 'invalid action').isAction();
                break;
        }
    });
    Object.keys(req.params).forEach(function(arg) {
        switch(arg) {
            case 'id':
                req.checkParams(arg, 'invalid id').isInt();
                break;
            case 'pic_id':
                req.checkParams(arg, 'invalid pic_id').isInt();
                break;
            case 'username':
                req.checkParams(arg, 'invalid username').isAlpha();
                break;
        }
    });
    req.getValidationResult().then(function(result) {
        if (!result.isEmpty()) return res.status(400).send('Validation errors');
        else next();
    });
});


var User = function(user){
    var salt = crypto.randomBytes(16).toString('base64');
    var hash = crypto.createHmac('sha512', salt);
    hash.update(user.password);
    this.username = user.username;
    this.salt = salt;
    this.saltedHash = hash.digest('base64');
};

var checkPassword = function(user, password){
        var hash = crypto.createHmac('sha512', user.salt);
        hash.update(password);
        var value = hash.digest('base64');
        return (user.saltedHash === value);
};


//serving the frontend from lab7
app.get('/', function (req, res, next) {
    if (!req.session.user) return res.redirect('/signin.html');
    return next();
});


app.get('/signout/', function (req, res, next) {
    req.session.destroy(function(err) {
        if (err) return res.status(500).end(err);
        return res.redirect('/signin.html');
    });
});

app.use(express.static('frontend'));

app.post('/api/signin/', function (req, res, next) {
    if (!req.body.username || ! req.body.password) return res.status(400).send("Bad Request");
    users.findOne({username: req.body.username}, function(err, user){
        if (err) return res.status(500).end(err);
        if (!user || !checkPassword(user, req.body.password)) return res.status(401).end("Wrong password");
        req.session.user = user;
        res.cookie('username', user.username, {secure: true, sameSite: true});
        return res.json(user);
    });
});

//Get the list of users in db
app.get('/api/home/', function (req, res, next) {
    //Load user home page after signing in
});

//signup
app.put('/api/users/', function (req, res, next) {
    var data = new User(req.body);
    users.findOne({username: req.body.username}, function(err, user){
        if (err) return res.status(500).end(err);
        if (user) return res.status(409).end("Username " + req.body.username + " already exists");
        users.insert(data, function (err, user) {
            if (err) return res.status(500).end(err);
            return res.json(user);
        });
    });
});

app.use(function (req, res, next){
    console.log("HTTP Response", res.statusCode);
});

https.createServer(config, app).listen(3000, function () {
    console.log('HTTPS on port 3000');
});
