(function(upload_model, upload_view){
    "use strict";
    
    //Get the current id from url
    var getCurId = function(){
        if(window.location.search){
            var query = window.location.search.substring(1).split("=");
            var id = parseInt(query[1]);
            if (query[0] === "id" && id){
                return id;
            }
            else{
                return;
            }
        }
    };

    
    document.addEventListener("loadPage",function(e){
    });
    //reads data from event and call uploadPic
    document.addEventListener("onRecipeUpload", function(e){
        var data = e.detail;
        upload_model.getActiveUsername(function(err, response){
            if(err){
                alert(err);
                window.location = "/index.html";
                return;
            }
            if (response){
                data.username = response;
                upload_model.uploadRecipe(data, function(err, response){
                if(err){
                    alert(err);
                    window.location = "/index.html";
                    return;
                }
                data._id = JSON.parse(response).id;
                console.log(data._id);
                });
            }
        });
        
    });

    


}(upload_model, upload_view));