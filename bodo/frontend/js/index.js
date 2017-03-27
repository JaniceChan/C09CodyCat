(function($) {
  "use strict";
  $(window).on("load", function() { // makes sure the whole site is loaded
    //preloader
    $("#status").fadeOut(); // will first fade out the loading animation
    $("#preloader").delay(450).fadeOut("slow"); // will fade out the white DIV that covers the website.
    
    //masonry
    $('.grid').masonry({
      itemSelector: '.grid-item'
      
    });

  });


  $(document).ready(function(){  

    //active menu
    $(document).on("scroll", onScroll);
 
    $('a[href^="#"]').on('click', function (e) {
      e.preventDefault();
      $(document).off("scroll");
 
      $('a').each(function () {
        $(this).removeClass('active');
      })
      $(this).addClass('active');
 
      if(this.hash == "#0") {
        //ignore scrolling
      }
      else {
        var target = this.hash;
        $target = $(target);
        $('html, body').stop().animate({
          'scrollTop': $target.offset().top+2
        }, 500, 'swing', function () {
          window.location.hash = target;
          $(document).on("scroll", onScroll);
        });
      }

    });

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

    
    //scroll js
    smoothScroll.init({
      selector: '[data-scroll]', // Selector for links (must be a valid CSS selector)
      selectorHeader: '[data-scroll-header]', // Selector for fixed headers (must be a valid CSS selector)
      speed: 500, // Integer. How fast to complete the scroll in milliseconds
      easing: 'easeInOutCubic', // Easing pattern to use
      updateURL: true, // Boolean. Whether or not to update the URL with the anchor hash on scroll
      offset: 0, // Integer. How far to offset the scrolling anchor location in pixels
      callback: function ( toggle, anchor ) {} // Function to run after scrolling
    });

    //menu
    var bodyEl = document.body,
    content = document.querySelector( '.content-wrap' ),
    openbtn = document.getElementById( 'open-button' ),
    closebtn = document.getElementById( 'close-button' ),
    isOpen = false;

    function inits() {
      initEvents();
      //populate top recipes
      topRecipes();
    }

    function initEvents() {
      // close the menu element if the target it´s not the menu element or one of its descendants..
      content.addEventListener( 'click', function(ev) {
        var target = ev.target;
        if( isOpen && target !== openbtn ) {
          toggleMenu();
        }
      } );
    }

    function topRecipes() {
      doAjax("GET", "/recipe/topFav", null, true, function(err, data){
            if (err) console.error(err);
            else {
              var recipes = data;            
              var container = document.getElementById("top-recipes-img");
              var textContainer = document.getElementById("top-recipes");
              container.innerHTML = "";
              if (recipes.length > 0 && recipes[0]._id != "__autoid__" && recipes[0] != 0) {
                // change the text on the side
                $("#top-recipes-txt").prepend("Browse from our delicious top recipes, rated by users just like you!");
                var e;
                var l;
                for (var i=0; i < recipes.length; i++) {
                  if(recipes[i]._id != "__autoid__") {
                    e = document.createElement('li');
                    l = document.createElement("li");
                    l.innerHTML = recipes[i].username + "'s " + recipes[i].title;
                    textContainer.append(l);

                    e.className = "col-md-6";
                    e.innerHTML = `
                          <a href="/api/recipes/${recipes[i]._id}/pic/"><img alt=${recipes[i]._id} src="/api/recipes/${recipes[i]._id}/pic/">
                            <div class="decription-wrap">
                              <div class="image-bg">
                                 <p class="desc">${recipes[i].title}</p>
                              </div>

                            </div>
                          </a>`
                    // add this element to the document
                    container.append(e);
                  }

                }
              } else {
                $("#top-recipes-txt").text("No top recipes yet.");
              }
            }
        });

    }

    function toggleMenu() {
      if( isOpen ) {
        classie.remove( bodyEl, 'show-menu' );
      }
      else {
        classie.add( bodyEl, 'show-menu' );
      }
      isOpen = !isOpen;
    }

    inits();


    //typed js
    $(".typed").typed({
        strings: ["Over 330 000 recipes", "Upload your own within 3 minutes", "Connect with other kitchen kittens", "Have a great day!"],
        typeSpeed: 100,
        backDelay: 900,
        // loop
        loop: true
    });

    //contact
    $('input').blur(function() {

      // check if the input has any value (if we've typed into it)
      if ($(this).val())
        $(this).addClass('used');
      else
        $(this).removeClass('used');
    });

    //pop up porfolio
    $('.portfolio-image li a').magnificPopup({
      type: 'image',
      gallery: {
        enabled: true
      }
      // other options
    });
    
    //Skill
    jQuery('.skillbar').each(function() {
      jQuery(this).appear(function() {
        jQuery(this).find('.count-bar').animate({
          width:jQuery(this).attr('data-percent')
        },3000);
        var percent = jQuery(this).attr('data-percent');
        jQuery(this).find('.count').html('<span>' + percent + '</span>');
      });
    }); 

  
  });
  
    
  //header
  function inits() {
    window.addEventListener('scroll', function(e){
        var distanceY = window.pageYOffset || document.documentElement.scrollTop,
            shrinkOn = 300,
            header = document.querySelector(".for-sticky");
        if (distanceY > shrinkOn) {
            classie.add(header,"opacity-nav");
        } else {
            if (classie.has(header,"opacity-nav")) {
                classie.remove(header,"opacity-nav");
            }
          }
      });
    }

  window.onload = inits();

  //nav-active
  function onScroll(event){
    var scrollPosition = $(document).scrollTop();
    $('.menu-list a').each(function () {
      var currentLink = $(this);
      var refElement = $(currentLink.attr("href"));
      if (refElement.position().top <= scrollPosition && refElement.position().top + refElement.height() > scrollPosition) {
        $('.menu-list a').removeClass("active");
        currentLink.addClass("active");
      }
      else{
        currentLink.removeClass("active");
      }
    });
  }

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