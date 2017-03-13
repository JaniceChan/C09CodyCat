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



  // $(document).ready(function(){  

  //   //active menu
  //   $(document).on("scroll", onScroll);
 
  //   $('a[href^="#"]').on('click', function (e) {
  //     e.preventDefault();
  //     $(document).off("scroll");
 
  //     $('a').each(function () {
  //       $(this).removeClass('active');
  //     })
  //     $(this).addClass('active');

  //     try {
  //       var target = this.hash;
  //       $target = $(target);
  //       $('html, body').stop().animate({
  //         'scrollTop': $target.offset().top+2
  //       }, 500, 'swing', function () {
  //         window.location.hash = target;
  //         $(document).on("scroll", onScroll);
  //       });
  //     }
  //     catch (e) {
  //       //pass
  //     }

  //   });

    
  //   //scroll js
  //   smoothScroll.init({
  //     selector: '[data-scroll]', // Selector for links (must be a valid CSS selector)
  //     selectorHeader: '[data-scroll-header]', // Selector for fixed headers (must be a valid CSS selector)
  //     speed: 500, // Integer. How fast to complete the scroll in milliseconds
  //     easing: 'easeInOutCubic', // Easing pattern to use
  //     updateURL: true, // Boolean. Whether or not to update the URL with the anchor hash on scroll
  //     offset: 0, // Integer. How far to offset the scrolling anchor location in pixels
  //     callback: function ( toggle, anchor ) {} // Function to run after scrolling
  //   });

  //   //menu
  //   var bodyEl = document.body,
  //   content = document.querySelector( '.content-wrap' ),
  //   openbtn = document.getElementById( 'open-button' ),
  //   closebtn = document.getElementById( 'close-button' ),
  //   isOpen = false;

  //   function inits() {
  //     initEvents();
  //   }

  //   function initEvents() {
  //     openbtn.addEventListener( 'click', toggleMenu );
  //     if( closebtn ) {
  //       closebtn.addEventListener( 'click', toggleMenu );
  //     }

  //     // close the menu element if the target it´s not the menu element or one of its descendants..
  //     content.addEventListener( 'click', function(ev) {
  //       var target = ev.target;
  //       if( isOpen && target !== openbtn ) {
  //         toggleMenu();
  //       }
  //     } );
  //   }

  //   function toggleMenu() {
  //     if( isOpen ) {
  //       classie.remove( bodyEl, 'show-menu' );
  //     }
  //     else {
  //       classie.add( bodyEl, 'show-menu' );
  //     }
  //     isOpen = !isOpen;
  //   }

  //   inits();


  //   //typed js
  //   $(".typed").typed({
  //       strings: ["Over 330 000 recipes", "Upload your own within 3 minutes", "Connect with other kitchen kittens", "Have a great day!"],
  //       typeSpeed: 100,
  //       backDelay: 900,
  //       // loop
  //       loop: true
  //   });

  //   //owl carousel

  //   $('.owl-carousel').owlCarousel({
  //     autoPlay: 3000, //Set AutoPlay to 3 seconds
 
  //     items : 1,
  //     itemsDesktop : [1199,1],
  //     itemsDesktopSmall : [979,1],
  //     itemsTablet : [768,1],
  //     itemsMobile : [479,1],

  //     // CSS Styles
  //     baseClass : "owl-carousel",
  //     theme : "owl-theme"
  //   });

  //   $('.owl-carousel2').owlCarousel({
  //     autoPlay: 3000, //Set AutoPlay to 3 seconds
 
  //     items : 1,
  //     itemsDesktop : [1199,1],
  //     itemsDesktopSmall : [979,1],
  //     itemsTablet : [768,1],
  //     itemsMobile : [479,1],
  //     autoPlay : false,

  //     // CSS Styles
  //     baseClass : "owl-carousel",
  //     theme : "owl-theme"
  //   });

  //   //contact
  //   $('input').blur(function() {

  //     // check if the input has any value (if we've typed into it)
  //     if ($(this).val())
  //       $(this).addClass('used');
  //     else
  //       $(this).removeClass('used');
  //   });

  //   //pop up porfolio
  //   $('.portfolio-image li a').magnificPopup({
  //     type: 'image',
  //     gallery: {
  //       enabled: true
  //     }
  //     // other options
  //   });

  //   //Skill
  //   jQuery('.skillbar').each(function() {
  //     jQuery(this).appear(function() {
  //       jQuery(this).find('.count-bar').animate({
  //         width:jQuery(this).attr('data-percent')
  //       },3000);
  //       var percent = jQuery(this).attr('data-percent');
  //       jQuery(this).find('.count').html('<span>' + percent + '</span>');
  //     });
  //   }); 

  //   var from,to,subject,text;
  //   $("#contact-form").submit(function(e){   
  //       e.preventDefault();
  //       to="kitchen.kittens.c09@gmail.com";
  //       subject=$("#contact-name").val() + " " + $("#contact-subject").val();
  //       text=$("#contact-message").val();
  //       $("#form-messages").text("Sending E-mail...Please wait");
  //       $.get("https://localhost:3000/send",{to:to,subject:subject,text:text},function(data){
  //       if(data=="sent")
  //       {
  //           $("#form-messages").empty().html("Email is been sent at "+to+" . Thank you!");
  //           $("#contact-name").val('');
  //           $("#contact-subject").val('');
  //           $("#contact-message").val('');

  //       }
  //   });

  
  // });
  // });
  
    
  // //header
  // function inits() {
  //   window.addEventListener('scroll', function(e){
  //       var distanceY = window.pageYOffset || document.documentElement.scrollTop,
  //           shrinkOn = 300,
  //           header = document.querySelector(".for-sticky");
  //       if (distanceY > shrinkOn) {
  //           classie.add(header,"opacity-nav");
  //       } else {
  //           if (classie.has(header,"opacity-nav")) {
  //               classie.remove(header,"opacity-nav");
  //           }
  //         }
  //     });
  //   }

  // window.onload = inits();

  // //nav-active
  // function onScroll(event){}
  //   var scrollPosition = $(document).scrollTop();
  //   $('.menu-list a').each(function () {
  //     var currentLink = $(this);
  //     var refElement = $(currentLink.attr("href"));
  //     if (refElement.position().top <= scrollPosition && refElement.position().top + refElement.height() > scrollPosition) {
  //       $('.menu-list a').removeClass("active");
  //       currentLink.addClass("active");
  //     }
  //     else{
  //       currentLink.removeClass("active");
  //     }
  //   });
  // }







  // //sign-in page
  // var signIn = document.getElementById('sign-in-button');
  // var signInClose = document.getElementsByClassName("sign-in-close");
  // var signInWindow = document.getElementById('sign-in-window');

  // // When the user clicks the button, open the sign in window
  // signIn.onclick = function() {
  //     signInWindow.style.display = "block";
  // }

  // // When the user clicks on (x), close the sign in window
  // signInClose.onclick = function() {
  //     signInWindow.style.display = "none";
  // }

})(jQuery);