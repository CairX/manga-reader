/* global Ajax, console */

"use strict";


/* ------------------------------------------------- *
 * Global varibles.
 * ------------------------------------------------- */
var items = {};
var mangas = document.getElementById("mangas");
var chapters = document.getElementById("chapters");
var pages = document.getElementById("pages");
var image = document.getElementById("image");


/* ------------------------------------------------- *
 * Extract value for the given key from a list of
 * objects.
 * ------------------------------------------------- */
var extract = function(list, key) {
	var result = [];

	for (var i = 0; i < list.length; i++) {
		result.push(list[i][key]);
	}

	return result;
};

/* ------------------------------------------------- *
 * Generate option elements in the form of a
 * combined string that can be easly loaded.
 * ------------------------------------------------- */
var createOptions = function(list) {
	var options = "";

	for (var i = 0; i < list.length; i++) {
		options += "<option>" + list[i] + "</options>";
	}

	return options;
};

/* ------------------------------------------------- *
 * Upate the image viewed.
 * ------------------------------------------------- */
var updateImage = function() {
	var src = "images/" + mangas.value + "/" + chapters.value + "/" + pages.value;
	image.src = src;
};
pages.addEventListener("change", updateImage);


/* ------------------------------------------------- *
 * Navigate to the next page.
 * ------------------------------------------------- */
var next  = function() {
	var index = pages.selectedIndex + 1;

	if (index >= pages.length) {
		chapters.value = chapters.options[chapters.selectedIndex + 1].value;
		pages.innerHTML = createOptions(items[mangas.value][chapters.selectedIndex].pages);
	} else {
		pages.value = pages.options[index].value;
	}

	updateImage();
};


/* ------------------------------------------------- *
 * Navigate to the previous page.
 * ------------------------------------------------- */
var previous  = function() {
	pages.value = pages.options[pages.selectedIndex - 1].value;
	updateImage();
};


/* ------------------------------------------------- *
 * On init, load mangas and their belonging chapter
 * and pages.
 * ------------------------------------------------- */
Ajax.get("/mangas", {
	onSuccess: function(response) {
		items = JSON.parse(response.response);
		mangas.innerHTML = createOptions(Object.keys(items));
		updateChapterAndPages();
	}
});


/* ------------------------------------------------- *
 * Update the chapter and page selector based
 * on selected manga.
 * ------------------------------------------------- */
var updateChapterAndPages = function() {
	var manga = items[mangas.value];

	chapters.innerHTML = createOptions(extract(manga, "chapter"));
	pages.innerHTML = createOptions(manga[0].pages);

	updateImage();
};
mangas.addEventListener("change", updateChapterAndPages);


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
