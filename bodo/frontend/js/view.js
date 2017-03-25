/*jshint esversion: 6 */
var view = (function(){
    "use strict";

    window.onload = function(e) {
        document.dispatchEvent(new CustomEvent("loadPage"), {'detail': {}});
        
    };

    //search

    document.getElementById("search-recipe-form").onsubmit = function(e) {
		e.preventDefault();
    	var searchQuery = document.getElementById('search-recipe-input').value.split(" ");
    	var form_valid = (searchQuery != "");
	    if(!form_valid){
	        alert('Please fill out the Search bar!');
	        return false;
	    }
	    var queries = searchQuery.join("+");
	    //split query by spaces
    	document.dispatchEvent(new CustomEvent("searchRecipe", {'detail': queries}));
    };

    var view = {};

    view.buildRecipes = function (recipes){
    	var container = document.getElementById("search-recipe-results");
        container.innerHTML = "";
        var r = recipes;
        recipes.reverse();
        recipes.forEach(function (recipe){
            // create the message element
            //TODO: change to recipe pic
            var elem = document.createElement('li');
            var imageSrc = "/api/recipes/" + recipe._id + "/pic/"
            elem.innerHTML = `
			            <div class="col-md-4 col-sm-4 recipe-details wrap-card card">
	                        <img width="120" height="120" src=${imageSrc}></img>
	                        <p class="head-sm">
	                          ${recipe.title}
	                        </p>
	                        <p class="text-grey">
	                          <span>Brought to you by: ${recipe.username}</span>
                              <span>Ratings: ${recipe.rating}</span>
                              <span>Time to complete: ${recipe.ready}</span>
                              <span>Tags: ${recipe.tags}</span>
	                        </p>
                      	</div>
                        </li>`;
            // add this element to the document
            container.prepend(elem);

            elem.onclick = function(e){
                window.location.replace("recipe.html?id="+recipe._id);
            };
        });
    	// console.log(recipes);
        // var container = document.getElementsByClassName("comment");
        // var top = container[0];
        // var data = {};
        // data.topId = top.id;
        // data.delId = delComment;
        // document.dispatchEvent(new CustomEvent("delCommentUpdated", {'detail': data}));
    };

    return view;
}());