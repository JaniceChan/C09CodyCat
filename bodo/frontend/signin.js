(function(model){
    "use strict";
    //sign in from lab7
    var showError = function(message){
        alert(message);
    };
    
    document.getElementById("signin_form").onsubmit = function (e){
        e.preventDefault();
        var data = {};
        data.username = document.getElementById("signin-email").value;
        data.password = document.getElementById("signin-password").value;
        if (data.username.length>0 && data.password.length>0){
            model.signIn(data,function(err,user){
                if (err) return showError(err);
                e.target.reset();
                window.location = '/home.html';
            });
        }
    };
    
}(model));