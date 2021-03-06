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
        //var simplemde = new SimpleMDE({ element: document.getElementById("test-area") });
    });

    document.addEventListener("onRecipeUpload", function(e){
        var data = e.detail;
        //console.log(data);
        upload_model.getActiveUsername(function(err, response){
            if(err){
                alert(err);
                window.location = "/index.html";
                return;
            }
            if (response){
                data.username = response;
                //console.log("responese", response);
                upload_model.uploadRecipe(data, function(err, response){
                if(err){
                    alert(err);
                    window.location = "/index.html";
                    return;
                }
                //data._id = JSON.parse(response.id);
                });
            }
        });
        
    });

    


}(upload_model, upload_view));