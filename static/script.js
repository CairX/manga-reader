/* global Ajax */

"use strict";


/* ------------------------------------------------- *
 * Global varibles.
 * ------------------------------------------------- */
var items = {};
var chapters = document.getElementById("chapters");
var pages = document.getElementById("pages");
var page = document.getElementById("page");


/* ------------------------------------------------- *
 * Generate option elements in the form of a
 * combined string that can be easly loaded.
 * ------------------------------------------------- */
var createOptions = function(items) {
	var options = "";

	for (var i = 0; i < items.length; i++) {
		options += "<option>" + items[i] + "</options>";
	}

	return options;
};

/* ------------------------------------------------- *
 * Upate the image viewed.
 * ------------------------------------------------- */
var updatePage = function() {
	var src = "images/" + chapters.value + "/" + pages.value;
	page.src = src;
};
pages.addEventListener("change", updatePage);


/* ------------------------------------------------- *
 * Navigate to the next page.
 * ------------------------------------------------- */
var next  = function() {
	var index = pages.selectedIndex + 1;

	if (index >= pages.length) {
		chapters.value = chapters.options[index].value;
		pages.innerHTML = createOptions(items[index].pages);
	} else {
		pages.value = pages.options[index].value;
	}

	updatePage();
};


/* ------------------------------------------------- *
 * Navigate to the previous page.
 * ------------------------------------------------- */
var previous  = function() {
	pages.value = pages.options[pages.selectedIndex - 1].value;
	updatePage();
};


/* ------------------------------------------------- *
 * On init load chapter and beloning page names
 * for the test manga "Horimiya".
 * ------------------------------------------------- */
Ajax.get("/chapters", {
	onSuccess: function(response) {
		// console.log("success");
		// console.log(response.response);

		items = JSON.parse(response.response).chapters;
		var chapterOptions = "";

		for (var i = 0; i < items.length; i++) {
			chapterOptions += "<option>" + items[i].number + "</options>";
		}

		chapters.innerHTML = chapterOptions;
		pages.innerHTML = createOptions(items[0].pages);

		updatePage();
	}
});


/* ------------------------------------------------- *
 * Keys
 * ------------------------------------------------- */
document.addEventListener("keypress", function(e) {
	//console.log(e);

	switch (e.keyCode) {
		// Left arrow
		case 37:
			previous();
			break;
		// Right arrow
		case 39:
			next();
			break;
	}

	switch(e.charCode) {
		// Space
		case 32:
			next();
			e.preventDefault();
			break;
		// A
		case 97:
			previous();
			break;
		// D
		case 100:
			next();
			break;
	}
});
