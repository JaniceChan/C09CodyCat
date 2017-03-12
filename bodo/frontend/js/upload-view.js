/*jshint esversion: 6 */
var view = jQuery(document).ready(function(){
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

    document.getElementById("step-pics").onchange = function(evt) {
        var files = evt.target.files; // FileList object

        // Loop through the FileList and render image files as thumbnails.
        for (var i = 0, f; f = files[i]; i++) {

        // Only process image files.
        if (!f.type.match('image.*')) {
            continue;
        }

        var reader = new FileReader();

        // Closure to capture the file information.
        reader.onload = (function(theFile) {
            return function(e) {
            // Render thumbnail.
            var span = document.createElement('span');
            span.innerHTML = ['<img class="thumb" src="', e.target.result,
                                '" title="', escape(theFile.name), '"/>'].join('');
            document.getElementById('preview-steps').insertBefore(span, null);
            };
        })(f);

        // Read in the image file as a data URL.
        reader.readAsDataURL(f);
        }
  }

  document.getElementById("submit-recipe").onclick = function(e){
      e.preventDefault();
      var title = document.getElementById("recipe-title-input").value;
      var pic = document.getElementById("recipe-pic-input").value;
      var intro = document.getElementById("recipe-intro-input").value;
      var ings = [];
      var steps = [];
      var table = document.getElementById("ing-table");
      for (var i = 0, row; row = table.rows[i]; i++) {
            var ing = row.cells[0].children[0].value;
            var quan = row.cells[1].children[0].value;
            ings.push({ing:ing, quan: quan});
      }
      console.log(title);
      console.log(pic);
      console.log(intro);
      console.log(ings);
  }

    return view;
}());