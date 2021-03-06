var upload_model = (function(){
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

    var upload_model = {};

    upload_model.getActiveUsername = function(callback){
        var keyValuePairs = document.cookie.split('; ');
        for(var i in keyValuePairs){
            var keyValue = keyValuePairs[i].split('=');
            if(keyValue[0]=== 'email') return callback(null, decodeURIComponent(keyValue[1]));
        }
        return callback("No active user", null);
    };
    
    // signUp, signIn and signOut
    
    upload_model.signOut = function(callback){
        doAjax('GET', '/signout/', null, false, callback);
    };
    
    upload_model.signIn = function(data, callback){
        doAjax('POST', '/api/signin/', data, true, function(err, user){
            if (err) return callback(err, user);
            callback(null, user);
        });
    };
    
   // create
    
    upload_model.createUser = function(data, callback){
        doAjax('PUT', '/api/users/', data, true, callback);
    };

    upload_model.getGalleries = function(user, callback){
        doAjax('GET', '/api/home/', null, true, callback);
    };

    //store msg locally and notifies the controller with msg attached
    upload_model.uploadRecipe = function(data, callback){
        var formdata = new FormData();
        formdata.append("username", data.username);
        formdata.append("intro", data.intro);
        formdata.append("title", data.title);
        formdata.append("pic", data.pic);
        formdata.append("ings", data.ings);
        formdata.append("steps", data.steps);
        formdata.append("tip", data.tip);
        formdata.append("ready", data.ready);
        formdata.append("rating", parseInt(data.rating));
        formdata.append("tags", data.tags);
        doAjax('PUT', '/api/recipe/', formdata, false, function(err, data2){
            if (err) console.error(err);
            else {
                var detail = {};
                detail.id = data2;
                detail.username = data.username;
                window.location.replace("recipe.html?id=new");
            }
        });
    };

    return upload_model;

}());