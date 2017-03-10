(function(model, view){
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
    document.addEventListener("onFormSubmit", function(e){
        var data = e.detail;
        model.uploadPic(data, function(err, response){
            if(err){
                console.log(err);
            }
            data._id = JSON.parse(response).id;
            loadImageId(data._id);
        });
        
    });

    


}(model, view));