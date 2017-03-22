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
    //set profile info
    getInfo();

    //preloader
    $("#status").fadeOut(); // will first fade out the loading animation
    $("#preloader").delay(450).fadeOut("slow"); // will fade out the white DIV that covers the website.
    
    //masonry
    $('.grid').masonry({
      itemSelector: '.grid-item'
      
    });    
  });

  function getInfo() {
      $.get("https://localhost:3000/profile/setup",function(data){
        $("#name").html(data.username);
        $("#email").html(data.email);

        if(data.phone != null) {
          $("#phone").empty();
          $("#phone").html(data.phone);
        }
        if(data.address != null) {
          $("#address").empty();
          $("#address").html(data.address);
        }
        if(data.image != null) {
          $("#user-image").attr("src", data.imageUrl);
        }
        //get user's favourites and uploads
      });
  }

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