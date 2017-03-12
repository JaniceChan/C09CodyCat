/*jshint esversion: 6 */
var view = jQuery(document).ready(function(){
    "use strict";

    window.onload = function(e) {
        document.dispatchEvent(new CustomEvent("loadPage"), {detail: {}});
    };

    var del = $('#ing-table').on('click', 'input[type="button"]', function () {
    $(this).closest('tr').remove();
})

    var add = $('p input[type="button"]').click(function () {
    $('#ing-table').append('<tr><td><input type="text" class="ing" placeholder="Ingredient"/></td><td><input type="text" class="quantity" placeholder="quantity"/></td><td><input type="button" value="Delete" /></td></tr>')
});

    return view;
}());