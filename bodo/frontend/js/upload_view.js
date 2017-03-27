/*jshint esversion: 6 */
var upload_view = jQuery(document).ready(function(){
    "use strict";

    window.onload = function(e) {
        document.dispatchEvent(new CustomEvent("loadPage"), {detail: {}});
    };

    var del_ing = $('#ing-table').on('click', 'input[type="button"]', function () {
    $(this).closest('tr').remove();
    });

    var add_ing = $('#add-ing').click(function () {
    $('#ing-table').append('<tr><td><input type="text" class="ing" placeholder="Ingredient" required/></td><td><input type="text" class="quantity" placeholder="quantity" required/></td><td><input type="button" value="Delete" /></td></tr>')
    });

    var del_step = $('#step-table').on('click', 'input[type="button"]', function () {
        $(this).closest('tr').remove();
    });

    var add_step = $('#add-step').click(function () {
        $('#step-table').append('<tr><td><input type="textarea" class="step" placeholder="Step" required/></td><td><input type="button" value="Delete" /></td></tr>')
    });

//     document.getElementById("step-pics").onchange = function(evt) {
//         var files = evt.target.files; // FileList object

//         // Loop through the FileList and render image files as thumbnails.
//         for (var i = 0, f; f = files[i]; i++) {

//         // Only process image files.
//         if (!f.type.match('image.*')) {
//             continue;
//         }

//         var reader = new FileReader();

//         // Closure to capture the file information.
//         reader.onload = (function(theFile) {
//             return function(e) {
//             // Render thumbnail.
//             var span = document.createElement('span');
//             span.innerHTML = ['<img class="thumb" src="', e.target.result,
//                                 '" title="', escape(theFile.name), '"/>'].join('');
//             document.getElementById('preview-steps').insertBefore(span, null);
//             };
//         })(f);

//         // Read in the image file as a data URL.
//         reader.readAsDataURL(f);
//         }
//   }

  document.getElementById("submit-recipe").onclick = function(e){
      e.preventDefault();
      var data = {};
      var title = document.getElementById("recipe-title-input").value;
      var pic = document.getElementById("recipe-pic-input").files[0];
      var intro = document.getElementById("recipe-intro-input").value;
      // var rating = document.getElementById("recipe-rating-input").value;
      var rating = 0;
      var ready = document.getElementById("recipe-ready-input").value;
      var tags = document.getElementById("recipe-tags-input").value;
      var ings = [];
      //var steps = [];
      var tip = document.getElementById("add-tip-input").value;
      //get ingredients and append to ings array
      var ing_table = document.getElementById("ing-table");
      var obj = [];
      for (var i = 0, row; row = ing_table.rows[i]; i++) {
            var ing = row.cells[0].children[0].value;
            var quan = row.cells[1].children[0].value;
            // obj.ing = ing;
            // obj.quan = quan;
            console.log(obj);
            obj = [ing, quan];
            ings.push(obj);
      }
      //get steps and append to steps array
      //var pics = document.getElementById("step-pics").files;
      //console.log(pics);
      var step_table = document.getElementById("step-table");
    //   for (var i = 0, row; row = step_table.rows[i]; i++) {
    //         var s = row.cells[0].children[0].value;
    //         // if (i < pics.length) {
    //         //     steps.push({text:s, pics:pics[i]});
    //         // }
    //         // else {
    //         //     steps.push({text:s, pics: null});
    //         // }
    //         steps.push(s);
    //   }
    console.log(ings);
      var steps = document.getElementById("steps-input").innerHTML;
      data.title = title;
      data.pic = pic;
      data.intro = intro;
      data.ings = ings;
      data.steps = steps;
      data.tip = tip;
      data.rating = parseInt(rating);
      data.ready = ready;
      data.tags = tags;

      if (!title || !pic || !intro || !ings || !ready || !tags || !tip) {
          alert("Please fill all info");
          return;
      }
      
      document.dispatchEvent(new CustomEvent("onRecipeUpload",{detail: data}));


      // redirect to recipe page and populate recipe page
      //window.location.replace("recipe.html");

  }


    return upload_view;
}());