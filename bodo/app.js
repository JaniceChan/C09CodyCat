var path = require('path');
var express = require('express');
var nodemailer = require("nodemailer");
var crypto = require('crypto');
var bodyParser = require('body-parser');
var multer  = require('multer');
var fs = require('fs');
var unirest = require('unirest');
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
comments = new Datastore({ filename: 'db/comments.db', autoload: true, timestampData : true});
recipesRemote = new Datastore({ filename: 'db/recipesRemote.db', autoload: true, timestampData : true });

var smtpTransport = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    auth: {
        user: "kitchen.kittens.c09@gmail.com",
        pass: "janice&jiaan"
    }
});

var mashapeKey = "1ErItZQOremshqtEGokFUmESwiX3p1cGKfOjsnoQPkupxFIEds";


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
            case 'phoneNum':
                req.checkParams(arg, 'invalid phoneNum').isInt();
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
recipes.insert({_id: '__autoid__'});
recipes.getAutoincrementId = function (cb) {
    this.update(
        { _id: '__autoid__' },
        { $inc: { seq: 1 } },
        { upsert: true, returnUpdatedDocs: true },
        function (err, affected, autoid) { 
            cb(err, autoid.seq);
        }
    );
    return this;
};

var User = function(user){
    var salt = crypto.randomBytes(16).toString('base64');
    var hash = crypto.createHmac('sha512', salt);
    hash.update(user.password);
    this.username = user.username;
    this.email = user.email;
    this.salt = salt;
    this.saltedHash = hash.digest('base64');
    this.phone;
    this.address;
    this.image;
    this.fav;
    this.numComments = 0;
};

var Recipe = function(recipe){
    this.username = recipe.username;
    this.intro = recipe.intro;
    this.title = recipe.title;
    //this.pic = recipe.pic;
    this.ings = recipe.ings;
    this.steps = recipe.steps;
    this.tip = recipe.tip;
    this.ready = recipe.ready;
    this.rating = recipe.rating;
    this.tags = recipe.tags;
    //tags
}

var searchId = 0;

var Comment = function(comment){
        this.content = comment.content;
        this.author = comment.author;
};

var checkPassword = function(user, password){
        var hash = crypto.createHmac('sha512', user.salt);
        hash.update(password);
        var value = hash.digest('base64');
        return (user.saltedHash === value);
};

var contains = function(needle) {
    // Per spec, the way to identify NaN is that it is not equal to itself
    var findNaN = needle !== needle;
    var indexOf;

    if(!findNaN && typeof Array.prototype.indexOf === 'function') {
        indexOf = Array.prototype.indexOf;
    } else {
        indexOf = function(needle) {
            var i = -1, index = -1;

            for(i = 0; i < this.length; i++) {
                var item = this[i];

                if((findNaN && item !== item) || item === needle) {
                    index = i;
                    break;
                }
            }

            return index;
        };
    }

    return indexOf.call(this, needle) > -1;
};


//serving the frontend from lab7
app.get('/', function (req, res, next) {
    if (!req.session.user) return res.redirect('/index.html');
    return next();
});

app.get('/home.html', function (req, res, next) {
    if (!req.session.user) return res.redirect('/index.html');
    return next();
});


app.get('/logout/', function (req, res, next) {
    req.session.destroy(function(err) {
        if (err) return res.status(500).end(err);
        return res.redirect('/index.html');
    });
});

app.use(express.static('frontend'));


app.get('/profile.html', function (req, res, next) {
    if (!req.session.user) return res.redirect('/index.html');
    return next();
});

app.get("/profile/setup", function (req, res, next) {
    users.findOne({email: req.session.user.email}, function(err, user){
        if (err) return res.status(500).end(err);
        return res.json(user);
    });

});

app.get("/recipe/setup/:id", function (req, res, next) {
    if (!req.session.user) return res.status(403).send("Forbidden");
    if(req.params.id == "new") {
        recipes.findOne().sort({createdAt:-1}).exec(function(err, data){
            if (err) return res.status(404).end("Recipe does not exists");
            return res.json(data);
        });
    } else if (req.params.id.charAt(0) == "s"){
        var recipeId = parseInt(req.params.id.split("_")[1]);
        console.log(recipeId);
        recipesRemote.findOne({ id: recipeId }).exec(function(err, data){
            if (err) return res.status(404).end("Recipe:" + recipeId + " does not exists");
            var resData = {};
            resData.username = "Spoonacular";
            resData.title = data.title;
            resData.createdAt = null;
            resData._id = data.id;
            resData.intro = data.summary;
            // resData.steps = data.instructions;
            var steps = "";

            if(data.analyzedInstructions[0] != null) {
                data.analyzedInstructions[0].steps.forEach(function(ai){
                    steps += "<p><span><b>Step " + ai.number + ":</b>" + ai.step + "</span>";
                    steps += "<span><b>Ingredients:</b></span>";
                    ai.ingredients.forEach(function(ing){
                        steps += "<span>" + ing.name + "</span>";
                    });
                    steps += "<span><b>Equipment:</b></span>";
                    ai.equipment.forEach(function(eq){
                        steps += "<span>" + eq.name + "</span>";
                    });
                    steps += "<span></span></p>";

                });

                resData.steps = steps;
            } else {
                resData.steps = data.instructions;
            }


            resData.tip = data.spoonacularSourceUrl;
            resData.imageUrl = data.image;

            var ings = "";
            data.extendedIngredients.forEach(function(ei) {
                ings += ei.name + "," + ei.amount + " " + ei.unit + ",";
            });
            ings = ings.substring(0, ings.length-1);
            resData.ings = ings;

            var tags = "";
            data.cuisines.forEach(function(c) {
                tags += c + ",";
            });
            data.dishTypes.forEach(function(d) {
                tags += d + ",";
            });
            tags = tags.substring(0, tags.length-1);

            resData.tags = tags;

            resData.ready = data.readyInMinutes + " min";
            return res.json(resData);
        });

    } else {
        var recipeId = parseInt(req.params.id);
        recipes.findOne({_id: recipeId}).exec(function(err, data){
            if (err) return res.status(404).end("Recipe:" + recipeId + " does not exists");
            return res.json(data);
        });
    }

});

app.get("/recipe/uploads", function (req, res, next) {
    if (!req.session.user) return res.status(403).send("Forbidden");
    var n = 6;
    //find info on recent 6 uploaded recipes
    recipes.find({username: req.session.user.email}).sort({createdAt:-1}).limit(n).exec(function(err, data){
        if (err) return res.status(404).end("Recipe does not exists");
        return res.json(data);
    });
});

app.get("/recipe/ifFav/:id", function (req, res, next) {
    if (!req.session.user) return res.status(403).send("Forbidden");
    var r_id;
    if (req.params.id.charAt(0) == "s"){
        r_id = parseInt(req.params.id.split("_")[1]);
    } else {
        r_id = parseInt(req.params.id);
    }

    if (contains.call(req.session.user.fav, r_id)) {
        return res.json("Unfavourite");
    }
    return res.json("Favourite this!");
});

app.get("/recipe/fav/", function (req, res, next) {
    if (!req.session.user) return res.status(403).send("Forbidden");
    var n = 6;
    //find info on recent 6 fav recipes
    recipes.find({_id: { $in: req.session.user.fav }}).sort({createdAt:-1}).limit(n).exec(function(err, data){
        if (err) return res.status(404).end("Recipe does not exists");
        else {
            if(data.length < 6) {
                var n2 = n - data.length;

                recipesRemote.find({id: {$in: req.session.user.fav}}).sort({createdAt:-1}).limit(n).exec(function(err, data2){
                    var resData = data;
                    var uniqueIds = [];
                    data2.forEach(function(d) {
                        if(contains.call(uniqueIds, d.id) != true && d.summary != null) {
                            uniqueIds.push(d.id);            
                            var newData = {};
                            newData._id = "s_" + d.id;
                            newData.title = d.title;
                            newData.imageUrl = d.image;
                            newData.intro = d.summary;
                            resData = resData.concat(newData);
                        }
                    });

                    console.log("new data", resData);
                    return res.json(resData);
                });

            }
        }

    });
});

app.get("/recipe/topFav/", function (req, res, next) {
    var n = 6;
    //find info on recent 6 top fav recipes
    recipes.find().sort({rating:-1}).limit(n).exec(function(err, data){
        if (err) return res.status(404).end("Recipe does not exists");
        return res.json(data);
    });
});

app.get("/recipe/stats/:chartId", function (req, res, next) {
    if (!req.session.user) return res.status(403).send("Forbidden");
    //find info on recent 6 top fav recipes
    var stats = {};
    if(req.params.chartId == "0") {
        stats.numFav = 0;
        stats.numUploads = 0;
        stats.numComments = 0;
        var oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate()-7);
        recipes.find({$and: [{username: req.session.user.email}, {createdAt: {$gte: oneWeekAgo}}] }, function(err, data){
            if (err) return res.status(404).end("Recipe does not exists");
            stats.numUploads += data.length;    
            users.findOne({email: req.session.user.email }, function(err, data2){
                if (err) return res.status(404).end("Recipe does not exists");
                stats.numFav += data2.fav.length;
                stats.numComments += data2.numComments;
                return res.json(stats);
            });
        });
    } else if(req.params.chartId == "1") {
        stats.rookie = 0;
        stats.junior = 0;
        stats.apprentice = 0;
        stats.senior = 0;
        stats.master = 0;
        var oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate()-7);
        recipes.find({$and: [{username: req.session.user.email}, {createdAt: {$gte: oneWeekAgo}}] }, function(err, data){
            if (err) return res.status(404).end("Recipe does not exists");
            data.forEach(function(r) {
                if(r.rating < 10) {
                    stats.rookie ++;
                } else if (r.rating >= 10 && r.rating < 20) {
                    stats.junior ++;
                } else if (r.rating >= 20 && r.rating < 50) {
                    stats.apprentice ++;
                } else if (r.rating >= 50 && r.rating < 100) {
                    stats.senior ++;
                } else {
                    stats.master ++;
                }
            });
            return res.json(stats);

        });
    }

});


// send emails to kitchen kitten
app.get('/send',function(req,res){
    var mailOptions={
        to : req.query.to,
        subject : req.query.subject,
        text : req.query.text
    }
    smtpTransport.sendMail(mailOptions, function(error, response){
     if(error){
        res.end("error");
     }else{
        res.end("sent");
         }
    });
});

app.post('/api/signin/', function (req, res, next) {
    if (!req.body.email || ! req.body.password) return res.status(400).send("Bad Request");
    users.findOne({email: req.body.email}, function(err, user){
        if (err) return res.status(500).end(err);
        if (!user || !checkPassword(user, req.body.password)) return res.status(401).end("Wrong password");
        //clear cached search results
        recipesRemote.remove({}, { multi: true }, function (err, numRemoved) {});
        req.session.user = user;
        res.cookie('email', user.email, {secure: true, sameSite: true});
        return res.json(user);
    });
});

app.post('/profile/image', upload.single('image'), function (req, res, next) {
    var imageUrl = '/api/images/' + req.session.user.username;
    users.update({ email: req.session.user.email }, { $set: { "image": req.file } }, {}, function (e2, numReplaced) {});
    users.update({ email: req.session.user.email }, { $set: { "imageUrl": imageUrl } }, {}, function (e2, numReplaced) {});
    return next();
});

app.get('/api/images/:username', function (req, res, next) {
    users.findOne({username: req.params.username }, function(err, data) {
        if (err) return res.status(404).end("Image:" + req.body.username + " does not exists");
        res.setHeader('Content-Type', data.image.mimetype);
        return res.sendFile(path.join(__dirname, data.image.path));
    });

});


//Get the list of users in db
app.get('/api/home/', function (req, res, next) {
    //Load user home page after signing in
});

//signup
app.put('/api/users/', function (req, res, next) {
    var data = new User(req.body);
    data.fav = [];
    users.findOne({username: req.body.username}, function(err, user){
        if (err) return res.status(500).end(err);
        if (user) return res.status(409).end("Username " + req.body.username + " already exists");
        users.insert(data, function (err, user) {
            if (err) return res.status(500).end(err);
            return res.json(user);
        });
    });
});

//upload recipe
app.put('/api/recipe/', upload.single("pic"), function(req, res, next) {
    if (!req.session.user) return res.status(403).send("Forbidden");
    recipes.getAutoincrementId(function(err, id) {
        if (err) {
            res.status(409).json("Conflict when getting id");
            return err;
        }
        var data = req.body;
        var pic = req.file;
        var recipe = new Recipe(data);
        recipe._id = id;
        recipe.pic = pic;
        recipe.imageUrl = "/api/recipes/" + id + "/pic/";
        //recipes.insert({_id: id, username:data.username, title:data.title, pic:pic, ings:data.ings, intro:data.intro, steps:data.steps, tip:data.tip}, function(err, doc) {
        recipes.insert(recipe, function(err, doc) {
            if (err) {
                res.status(409).json("Error with recipe db");
                return next();
            }
            //res.json(id);
        });

        comments.insert({_id:id, recipe_comments:[]}, function(err, doc){
                if (err) {
                    res.status(409).json("Error with comments db");
                    return next();
                }
                res.json(id);
                return next();
            });
    })
})


//add comment
app.put("/api/comments/:r_id/", function(req, res, next) {
    if (!req.session.user) return res.status(403).send("Forbidden");
    //
    var r_id;
    if (req.params.r_id.charAt(0) == "s"){
        r_id = parseInt(req.params.r_id.split("_")[1]);
    } else if (req.params.r_id == "new") {
        recipes.findOne().sort({createdAt:-1}).exec(function(err, data){
            r_id = data._id;
        });
    } else {
        r_id = parseInt(req.params.r_id);
    }
    var comment = new Comment(req.body);
    comment.time = new Date().toUTCString();
    users.findOne({ email: req.session.user.email }, function(err, doc) {
        users.update({ email: req.session.user.email }, { $set: { "numComments": ++doc.numComments } }, {}, function (e2, numReplaced) {});
    });
    var recipe = null;
    comments.findOne({_id: r_id}, function(err, data){
        if (err) {
            res.status(409).json("Error in comments db");
            return next();
        }
        if (!data){
            res.status(404).json("No recipe with id: " + r_id);
            return next();
        }
        recipe = data;
        recipe.recipe_comments.unshift(comment);
        comments.update({_id:r_id}, recipe, {});
        res.json({"r_id": r_id});
        return next();
    });
});

//get comments by recipe id
app.get("/api/comments/:id/", function(req, res, next) {
    if (!req.session.user) return res.status(403).send("Forbidden");
    var id;
    if (req.params.id.charAt(0) == "s"){
        id = parseInt(req.params.id.split("_")[1]);
    } else {
        id = parseInt(req.params.id);
    }

    if (id){
        comments.findOne({_id: id}, function(err, data){
           if(err){
               res.status(404).end("recipe with id: " + id + " does not exists");
               return next();
           }
           if (data){
               res.json({found: true, id: id, message: data});
               return next();
           } 
        });
    }
    else{
        res.status(400).json("Your input of id is not valid");
        return next();
    }
});

//upload recipe steps
app.put('/api/recipe/steps', upload.any(), function(req, res, next) {
    if (!req.session.user) return res.status(403).send("Forbidden");
    recipes.getAutoincrementId(function(err, id) {
        if (err) {
            res.status(409).json("Conflict when getting id");
            return next();
        }
        var data2 = req.files;
        var data = req.body;
        //console.log("files 2 ", data2)
        //console.log("files body", data)
        //console.log(req.body);
        // console.log(req.body.title);
        // recipes.insert({_id: id, username:data.username, title:data.title, pic:data.pic, ings:data.ings, intro:data.intro, steps:data.steps, tip:data.tip}, function(err, doc) {
        //     if (err) {
        //         res.status(409).json("Error with image db");
        //         return next();
        //     }
        //     res.json({id: id});
        // });
        // comments.insert({_id:id, pic_comments:[]}, function(err, doc){
        //         if (err) {
        //             res.status(409).json("Error with comments db");
        //             return next();
        //         }
        //         res.json({id: id});
        //         return next();
        //     });
    })
})

//upload recipe from remote to local db
app.put("/api/home/search/remote", function(req, res, next) {
    var searchStr = req.query.q.slice(0, -1).split(" ").join('+');
    var n = 10;
    unirest.get("https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/autocomplete?number=" + n + "&query="+searchStr)
    .header("X-Mashape-Key", mashapeKey)
    .header("Accept", "application/json")
    .end(function (result) {
        var recipeIds = "";
        
        result.body.forEach(function(recipe) {
            recipeIds += recipe.id + "%2C";
        });

        recipeIds = recipeIds.slice(0, -3);
        
        //populate the recipesRemote db
        unirest.get("https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/informationBulk?ids=" + recipeIds + "&includeNutrition=false")
        .header("X-Mashape-Key", mashapeKey)
        .header("Accept", "application/json")
        .end(function (result) {
            //populate with new results
            result.body.forEach(function(recipe) {
                //populate the recipesRemote db
                unirest.get("https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/" + recipe.id + "/summary")
                .header("X-Mashape-Key", mashapeKey)
                .header("Accept", "application/json")
                .end(function (result2) {
                    recipesRemote.insert(recipe, function (err) {});
                    recipesRemote.update({ id: recipe.id }, { $set: { search_id: searchId, summary: result2.body.summary } }, {}, function () {});
                    comments.insert({_id: recipe.id, recipe_comments:[]}, function(err, doc){});
                });

            });
            searchId ++;
            return res.json("done");
        });

    });

    
});

app.get("/search/remote/:mode", function(req, res, next) {
    if (!req.session.user) return res.status(403).send("Forbidden");
    var mode = req.params.mode;
    if (mode == "summary"){
        console.log("searchid", searchId);
        recipesRemote.find({ search_id: searchId }, function (err, recipes) {
            return res.json(recipes);
        });
    }
});

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
    var id = parseInt(req.params.id);
    if (id){
        recipes.findOne({_id: id}, function(err, data){
            if (err){
                res.status(409).json("Error in recipes db");
                return next();
            }
            if (data){
                if(data.pic) {
                    var pic = data.pic;
                    res.setHeader("Content-Type", data.pic.mimetype);
                    res.sendFile(path.join(__dirname, pic.path));
                    return;
                }
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
app.get("/api/home/search/local", function(req, res, next) {
    var searchStr = req.query.q.slice(0, -1).split(" ").join('|');
    var regex = new RegExp(searchStr, 'i');
    //limit to 9
    var n = 9;
    recipes.find({ $or: [{title: {"$regex": regex}}, {tags: {"$regex": regex}}] }).sort({createdAt:-1}).limit(n).exec(function(err, data){
        if(err){
            res.status(409).json("Error in recipes db");
            return next();
        }
        return res.json(data);
    });

});

//update

app.patch('/profile/setup/phone/:phoneNum', function (req, res, next) {
    var newPhone = req.params.phoneNum;
    users.update({ email: req.session.user.email }, { $set: { "phone": newPhone } }, {}, function (e2, numReplaced) {});
    return next();

});

app.patch('/profile/setup/address/:addr', function (req, res, next) {
    var newAddr = req.params.addr;
    users.update({ email: req.session.user.email }, { $set: { "address": newAddr } }, {}, function (e2, numReplaced) {});
    return next();

});

app.patch("/user/fav/:id", function(req, res, next) {
    if (!req.session.user) return res.status(403).end("Forbidden");
    var recipeId;
    if (req.params.id.charAt(0) == "s"){
        recipeId = parseInt(req.params.id.split("_")[1]);
        recipesRemote.findOne({ id: recipeId }).exec(function(e1, recipe) {
            switch(req.body.action){
                case ("fav"):
                    req.session.user.fav.push(recipeId);
                    break;
                case ("unfav"):
                    var index = req.session.user.fav.indexOf(recipeId);
                    req.session.user.fav.splice(index, 1);
                    break;
            }
            users.update({ email: req.session.user.email }, { $set: { "fav": req.session.user.fav } }, {}, function (e2, numReplaced) {});
            return res.json(req.session.user);
        });
    } else if (req.params.id == "new") {
        return res.status(403).send("Forbidden");
    } else {
        recipeId = parseInt(req.params.id);
        recipes.findOne({ _id: recipeId }).exec(function(e1, recipe) {
            //do not allow users to vote on their own comment
            if((recipe.username === req.session.user.email)) return res.status(403).send("Forbidden");
            switch(req.body.action){
                case ("fav"):
                    req.session.user.fav.push(recipeId);
                    break;
                case ("unfav"):
                    var index = req.session.user.fav.indexOf(recipeId);
                    req.session.user.fav.splice(index, 1);
                    break;
            }
            users.update({ email: req.session.user.email }, { $set: { "fav": req.session.user.fav } }, {}, function (e2, numReplaced) {});
            return res.json(req.session.user);
        });
    }


});

app.patch("/recipe/rating/:id", function(req, res, next) {
    if (!req.session.user) return res.status(403).end("Forbidden");
    if (req.params.id.charAt(0) != "s"){
        if(req.params.id == "new") {
            return res.status(403).send("Forbidden");
        }
        var recipeId = parseInt(req.params.id);
        recipes.findOne({ _id: recipeId }).exec(function(e1, recipe) {
            //do not allow users to vote on their own comment
            if((recipe.username === req.session.user.email)) return res.status(403).send("Forbidden");
            var newRating = 0;
            switch(req.body.action){
                case ("incr"):
                    newRating = parseInt(recipe.rating) + 1;
                    break;
                case ("decr"):
                    if (recipe.rating > 0) {
                        newRating = parseInt(recipe.rating) - 1;
                    }
                    break;
            }
            recipes.update({ _id: recipeId }, { $set: { "rating": newRating } }, {}, function (e2, numReplaced) {});
            return res.json(req.session.user);
        });
    } else {
        return res.json("pass");
    }
});

//Delete comment
app.delete("/api/recipes/:r_id/comments/:id/", function(req, res, next) {
    if (!req.session.user) return res.status(403).send("Forbidden");
    var id = parseInt(req.params.id);

    var r_id;
    if (req.params.r_id.charAt(0) == "s"){
        r_id = parseInt(req.params.r_id.split("_")[1]);
    } else if (req.params.r_id == "new") {
        recipes.findOne().sort({createdAt:-1}).limit(n).exec(function(err, data){
            r_id = data._id;
        });
    } else {
        r_id = parseInt(req.params.r_id);
    }
    var recipe = null;

    users.findOne({ email: req.session.user.email }, function(err, doc) {
        users.update({ email: req.session.user.email }, { $set: { "numComments": --doc.numComments } }, {}, function (e2, numReplaced) {});
    });
    if(r_id){
        comments.findOne({_id: r_id}, function(err, data){
            if (err) {
                res.status(409).json("Error in comments db");
                return next();
            }
            if (!data){
                res.status(404).json("No recipe with id: " + r_id);
                return next();
            }
            recipe = data;
            recipe.recipe_comments.splice(id, 1);
            comments.update({_id:r_id}, recipe, {});
            return next();
        });
    }
    else{
        res.status(400).json("The id must be an integer");
        return next();
    }
});



app.use(function (req, res, next){
    console.log("HTTP Response", res.statusCode);
});

https.createServer(config, app).listen(process.env.PORT || 3000, function () {
    console.log('HTTPS on port 3000');
});
