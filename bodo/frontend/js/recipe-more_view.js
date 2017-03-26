/*jshint esversion: 6 */
var view = (function(){
    "use strict";

    $(function() {
        document.dispatchEvent(new CustomEvent("loadPage"), {'detail': {}});
        $("#search-recipe-more").css('display','block');
        //preloader
        $("#status").fadeOut(); // will first fade out the loading animation
        $("#preloader").delay(450).fadeOut("slow"); // will fade out the white DIV that covers the website.
        
        // //masonry
        $('.grid').masonry({
          itemSelector: '.grid-item'
          
        }); 
    });

    // $("#search-recipe-more").onsubmit = function(e) {
    //     e.preventDefault();
    //     document.dispatchEvent(new CustomEvent("loadPage"), {'detail': {}});
    //     $("#search-recipe-more").css('display','none');
    // };

    document.getElementById("search-recipe-more").onsubmit = function(e) {
        e.preventDefault();
        document.dispatchEvent(new CustomEvent("loadPage"), {'detail': {}});
        document.getElementById("search-recipe-more").style.display="none"
    };


    // window.onload = function(e) {

        
    // };


  //   document.getElementById("search-recipe-form").onsubmit = function(e) {
		// e.preventDefault();
  //   	var searchQuery = document.getElementById('search-recipe-input').value.split(" ");
  //   	var form_valid = (searchQuery != "");
	 //    if(!form_valid){
	 //        alert('Please fill out the Search bar!');
	 //        return false;
	 //    }
	 //    var queries = searchQuery.join("+");
	 //    //split query by spaces
  //   	document.dispatchEvent(new CustomEvent("searchRecipe", {'detail': queries}));
  //   };

  //   document.getElementById("search-recipe-more").onsubmit = function(e) {
  //       e.preventDefault();
  //       var searchQuery = document.getElementById('search-recipe-input').value.split(" ");
  //       var form_valid = (searchQuery != "");
  //       if(!form_valid){
  //           alert('Please fill out the Search bar!');
  //           return false;
  //       }
  //       var queries = searchQuery.join("+");
  //       //split query by spaces
  //       document.dispatchEvent(new CustomEvent("searchMoreRecipe", {'detail': queries}));

  //   };

    var view = {};

    view.buildMoreRecipes = function (recipes){      
      var container = document.getElementById("recipe-more-container");
      container.innerHTML = "";
      if (recipes.length > 0 && recipes[0]._id != "__autoid__") {
        var e;
        for (var i=0; i < recipes.length; i++) {
          e = document.createElement('div');
          e.className = "grid-item";
          e.innerHTML = `
                  <div class="wrap-article">
                    <img alt=${recipes[i].id} class="img-circle text-center" src=${recipes[i].image}>
                    <p class="subtitle fancy">
                      <span>Spoonacular Score: ${recipes[i].spoonacularScore}</span>
                    </p>
                    <a href="recipe.html?id=s_${recipes[i].id}"">
                      <h3 class="title">
                        ${recipes[i].title}
                      </h3>
                    </a>
                    <p class="content-blog">
                      <span>Ready in: ${recipes[i].readyInMinutes} min</span>
                      <span>${recipes[i].summary}</span>
                    </p>
                  </div>`;
          // add this element to the document
          container.append(e);
        }
      } else {

      }

    };

    return view;
}());