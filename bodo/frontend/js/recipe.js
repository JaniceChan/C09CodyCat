(function($) {
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


  $(window).on("load", function() { // makes sure the whole site is loaded
    //set recipe info
    // var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    var hash = hashes[0].split('=');
    var id = hash[1];
    // for(var i = 0; i < hashes.length; i++)
    // {
    //     hash = hashes[i].split('=');
    //     vars.push(hash[0]);
    //     vars[hash[0]] = hash[1];
    // }

    getRecipeInfo(id);

    //need another function in case id is provided

    //preloader
    $("#status").fadeOut(); // will first fade out the loading animation
    $("#preloader").delay(450).fadeOut("slow"); // will fade out the white DIV that covers the website.
    
    //masonry
    $('.grid').masonry({
      itemSelector: '.grid-item'
      
    });    
  });

  function getRecipeInfo(id) {
     $.get("https://localhost:3000/recipe/setup/"+id,function(data){
        $("#recipe-user").html("By: " + data.username);
        $("#recipe-title").html(data.title);
        var dateCreated = data.createdAt;
        dateCreated = dateCreated.substring(0, 10);
        $("#recipe-date").html(dateCreated);
        $("#recipe-pic-placeholder").css("background-image", "url(/api/recipes/" + data._id + "/pic/)");

        $("#recipe-intro-div").text(data.intro);
        //$("#ing-div").text(data.ings);
        var q = data.ings.split(",");
        console.log(q);
        var table = document.createElement('TABLE')
        var tableBody = document.createElement('TBODY')
        table.border = '1'
        table.appendChild(tableBody);
        for (var i = 0; i < q.length; i+=2) {
          var tr = document.createElement('TR');
          var td1 = document.createElement('TD')
          var td2 = document.createElement('TD')          
          td1.appendChild(document.createTextNode(q[i]));
          td2.appendChild(document.createTextNode(q[i+1]));
          tr.appendChild(td1);
          tr.appendChild(td2);
          tableBody.appendChild(tr);
        }
        var ing_div = document.getElementById("ing-div");
        ing_div.appendChild(table);
        $("#recipe-steps").html(data.steps);
        $("#tip-div").text(data.tip);
        $("#recipe-tags-sp").text(data.tags);
        doAjax("GET", "/recipe/ifFav/"+id, null, true, function(err, data2){
          if (err) console.error(err);
          else {
            $("#recipe-rating-sp").text(data2);
          }
        });
        $("#recipe-ready-sp").text(data.ready);


        // if(data.phone != null) {
        //   $("#phone").empty();
        //   $("#phone").html(data.phone);
        // }
        // if(data.address != null) {
        //   $("#address").empty();
        //   $("#address").html(data.address);
        // }
        // if(data.image != null) {
        //   $("#user-image").attr("src", data.imageUrl);
        // }
        //get user's favourites and uploads
      });
  }

  $("#recipe-rating").click(function(){
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    var hash = hashes[0].split('=');
    var id = hash[1];

    if ($("#recipe-rating-sp").text() == "Favourite this!") {
      //add to user's fav
      doAjax("PATCH", "/user/fav/" + id, {action: "fav"}, true, function(err, data){
          if (err) {
            console.error(err);
          } else {
            $("#recipe-rating-sp").text("Unfavourite");
          }
      });
      //increase recipe rating
      doAjax("PATCH", "/recipe/rating/" + id, {action: "incr"}, true, function(err, data){
          if (err) console.error(err);
          else ;
      });
    } else {

      //remove from user's fav
      doAjax("PATCH", "/user/fav/" + id, {action: "unfav"}, true, function(err, data){
          if (err) console.error(err);
          else {
            $("#recipe-rating-sp").text("Favourite this!");
          }
      });
      //decrease recipe rating
      doAjax("PATCH", "/recipe/rating/" + id, {action: "decr"}, true, function(err, data){
          if (err) console.error(err);
          else ;
      });
      
    }
       

  });

  $("#phone-form").submit(function(e){
    e.preventDefault();
    var phoneNum = $("#phone-info").val() 
    $("#phone").html(phoneNum);
    //update user db
    doAjax("PATCH", "/profile/setup/phone/" + phoneNum, null, true, function(err, data){
        if (err) console.error(err);
        else ;
    });

    
  });
  $("#address-form").submit(function(e){
    e.preventDefault();
    var addr = $("#address-info").val() 
    $("#address").html(addr);
    //update user db
    doAjax("PATCH", "/profile/setup/address/" + addr, null, true, function(err, data){
        if (err) console.error(err);
        else ;
    });

  });

  $("#profile-pic").submit(function(e){
    e.preventDefault();
    var imageForm = new FormData();
    var img = $("#upload_form_img_file")[0].files[0];
    imageForm.append("image", img);
    doAjax('POST', '/profile/image', imageForm, false, function(err, data){
      if (err) console.error(err);
      else  {
        $.get("https://localhost:3000/profile/setup",function(data){
          if(data.image != null) {
            $("#user-image").attr("src", data.imageUrl);
          }
        });
      }   
    });

    e.target.reset();


  });

  function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $('#user-image').attr('src', e.target.result);
        }

        reader.readAsDataURL(input.files[0]);
    }
  }

  $("#upload_form_img_file").change(function(){
      readURL(this);
  });

 


})(jQuery);