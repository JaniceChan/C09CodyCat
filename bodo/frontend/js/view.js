/*jshint esversion: 6 */
var view = (function(){
    "use strict";

    window.onload = function(e) {
        document.dispatchEvent(new CustomEvent("loadPage"), {detail: {}});
    };

    return view;
}());