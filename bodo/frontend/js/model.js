var model = (function(){
    "use strict";

    var doAjax = function (method, url, body, json, callback){
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function(e){
            switch(this.readyState){
                 case (XMLHttpRequest.DONE):
                    if (this.status === 200) {
                        if (json) return callback(null, JSON.parse(this.responseText));
                        return callback(null, this.responseText);
                    }else{
                        return callback(this.responseText, null);
                    }
            }
        };
        xhttp.open(method, url, true);
        if (json) {
            xhttp.setRequestHeader('Content-Type', 'application/json');
            xhttp.send((body) ? JSON.stringify(body) : null);
        } else {
            xhttp.send((body) ? body : null);
        }
    };

    var model = {};

    model.getActiveUsername = function(callback){
        var keyValuePairs = document.cookie.split('; ');
        for(var i in keyValuePairs){
            var keyValue = keyValuePairs[i].split('=');
            if(keyValue[0]=== 'username') return callback(null, keyValue[1]);
        }
        return callback("No active user", null);
    };
    
    // signUp, signIn and signOut
    
    model.signOut = function(callback){
        doAjax('GET', '/signout/', null, false, callback);
    };
    
    model.signIn = function(data, callback){
        doAjax('POST', '/api/signin/', data, true, function(err, user){
            if (err) return callback(err, user);
            callback(null, user);
        });
    };
    
   // create
    
    model.createUser = function(data, callback){
        doAjax('PUT', '/api/users/', data, true, callback);
    };

    model.getGalleries = function(user, callback){
        doAjax('GET', '/api/home/', null, true, callback);
    };

    // get
    model.getRecipes = function(searchQuery){
        doAjax("GET", "/api/home/search?q=" + searchQuery + "/", null, true, function(err, data){
            if (err) console.error(err);
            else {
                document.dispatchEvent(new CustomEvent("buildSearchRecipes", {'detail': data}));
            }
        });

    };

    return model;

}());