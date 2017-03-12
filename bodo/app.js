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
users = new Datastore({ filename: 'db/users.db', autoload: true, timestampData : true });
recipes = new Datastore({ filename: 'db/recipes.db', autoload: true, timestampData : true });
comments = new Datastore({ filename: 'db/comments.db', autoload: true, timestampData : true}),

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

//method on stackoverflow to get autoid
// images.insert({_id: '__autoid__'});
// images.getAutoincrementId = function (cb) {
//     this.update(
//         { _id: '__autoid__' },
//         { $inc: { seq: 1 } },
//         { upsert: true, returnUpdatedDocs: true },
//         function (err, affected, autoid) { 
//             cb(err, autoid.seq);
//         }
//     );
//     return this;
// };

var User = function(user){
    var salt = crypto.randomBytes(16).toString('base64');
    var hash = crypto.createHmac('sha512', salt);
    hash.update(user.password);
    this.username = user.username;
    this.email = user.email;
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
    if (!req.session.user) return res.redirect('/index.html');
    return next();
});


app.get('/signout/', function (req, res, next) {
    req.session.destroy(function(err) {
        if (err) return res.status(500).end(err);
        return res.redirect('/index.html');
    });
});

app.use(express.static('frontend'));

app.post('/api/signin/', function (req, res, next) {
    if (!req.body.email || ! req.body.password) return res.status(400).send("Bad Request");
    users.findOne({email: req.body.email}, function(err, user){
        if (err) return res.status(500).end(err);
        if (!user || !checkPassword(user, req.body.password)) return res.status(401).end("Wrong password");
        req.session.user = user;
        res.cookie('email', user.email, {secure: true, sameSite: true});
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

var Recipe = function(recipe){
    this.username = recipe.username;
    this.title = recipe.title;
    this.pic = recipe.pic;
    this.ing = recipe.ing;
    this.steps = recipe.steps;
    //tags
}

//upload recipe
app.put('/api/recipe/', function(req, res, next) {
    if (!req.session.user) return res.status(403).send("Forbidden");
    recipes.getAutoincrementId(function(err, id) {
        if (err) {
            res.status(409).json("Conflict when getting id");
            return next();
        }
        recipes.insert({_id: id, username:req.username, title:req.title,pic:req.pic, ing:req.ing, steps:req.steps}, function(err, doc) {
            if (err) {
                res.status(409).json("Error with image db");
                return next();
            }
        });
        comments.insert({_id:id, pic_comments:[]}, function(err, doc){
                if (err) {
                    res.status(409).json("Error with comments db");
                    return next();
                }
                res.json({id: id});
                return next();
            });
    })
})

//get recipe by username and id
//return recipe data
app.get("/api/users/:username/recipes/:id/", function(req, res, next) {
    if (!req.session.user) return res.status(403).send("Forbidden");
    var id = parseInt(req.params.id);
    var u = req.params.username;
    if (id){
        recipes.findOne({_id: id, author: u}, function(err, data){
           if(err){
               res.status(404).end("Image with id: " + id + " does not exists");
               return next();
           }
           if (data){
               res.json({found: true, id: id, message: data});
               return next();
           }
           else{
               res.json({found: false});
               return next();
           } 
        });
    }
    else{
        res.status(400).json("Your input of id is not valid");
        return next();
    }
});
//get recipe pic
app.get("/api/recipes/:id/pic/", function(req, res, next){
    if (!req.session.user) return res.status(403).send("Forbidden");
    var id = parseInt(req.params.id);
    if (id){
        recipes.findOne({_id: id}, function(err, data){
            if (err){
                res.status(409).json("Error in recipes db");
                return next();
            }
            if (data){
                var pic = data.pic;
                res.setHeader("Content-Type", data.pic.mimetype);
                res.sendFile(path.join(__dirname, pic.path));
                return;
            }
            res.status(404).end("pic with id: " + id + " does not exists");
            return next();
        });
    }
});

//get recipe step pic
app.get("/api/recipes/:id/step/:number", function(req, res, next){
    if (!req.session.user) return res.status(403).send("Forbidden");
    var id = parseInt(req.params.id);
    var number = parseInt(req.params.number);
    if (id){
        recipes.findOne({_id: id}, function(err, data){
            if (err){
                res.status(409).json("Error in recipes db");
                return next();
            }
            if (data){
                var pic = data.steps[number-1].file;
                res.setHeader("Content-Type", pic.mimetype);
                res.sendFile(path.join(__dirname, pic.path));
                return;
            }
            res.status(404).end("pic with id: " + id + " does not exists");
            return next();
        });
    }
});

//delete recipe by id
//Delete pic
app.delete("/api/recipes/:id/", function(req, res, next){
    if (!req.session.user) return res.status(403).send("Forbidden");
    var id = parseInt(req.params.id);
    if (id){
        recipes.remove({_id: id}, function(err, num) {
            if (err){
                res.status(409).json("Error in recipes db");
                return next();
            }
            comments.remove({_id:id}, function(err, num){
                if (err){
                    res.status(409).json("Error in comments db");
                    return next();
                }
            });
        });
    }
    else{
        res.status(400).json("Your input of id is invalid");
        return next();
    }
});

// search
app.get("/api/home/search/", function(req, res, next) {
    var searchStr = req.query.q.slice(0, -1).split(" ").join('|');
    var regex = new RegExp(searchStr, 'i');
    //limit to 9
    var n = 9;
    recipes.find({title: {"$regex": regex}}).sort({createdAt:-1}).limit(n).exec(function(err, data){
        if(err){
            res.status(409).json("Error in recipes db");
            return next();
        }
        return res.json(data);
    });



});

app.use(function (req, res, next){
    console.log("HTTP Response", res.statusCode);
});

https.createServer(config, app).listen(3000, function () {
    console.log('HTTPS on port 3000');
});
