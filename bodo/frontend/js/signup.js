(function(model){
    "use strict";
    //sign up from lab7
    var showError = function(message){
        alert(message);
    };
    
    document.getElementById("signup_form").onsubmit = function (e){
        e.preventDefault();
        var data = {};
        data.username = document.getElementById("signup-username").value;
        data.email = document.getElementById("signup-email").value;
        data.password = document.getElementById("signup-password").value;
        if (data.username.length>0 && data.password.length>0){
            model.createUser(data,function(err,user){
                if (err) return showError(err);
                e.target.reset();
            });
        }
    };
    
}(model));

