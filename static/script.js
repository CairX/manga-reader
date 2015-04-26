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
var readMode = false;


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
var getItem = function(list, key, value) {
	var result;

	for (var i = 0; i < list.length; i++) {
		if (list[i][key] == value) {
			result = list[i];
			break;
		}
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
 * Update the chapter and page selector based
 * on selected manga.
 * ------------------------------------------------- */
var updateManga = function() {
	var title = mangas.value;
	var manga = items[title];

	// Populate chapter options.
	chapters.innerHTML = createOptions(extract(manga, "chapter"));

	Ajax.get("reading/" + title, {
		onSuccess: function(response) {
			var reading = JSON.parse(response.response).reading;

			if (reading) {
				var chapter = getItem(manga, "chapter", reading.chapter);
				updateChapter(false, chapter, reading.page);
			} else {
				updateChapter(true);
			}

		},
		onFailure: function() {
			console.log("Failed to get reading.");
		}
	});
};
mangas.addEventListener("change", function() {
	updateManga();
	mangas.blur();
});


/* ------------------------------------------------- *
 * Update pages for given or selected chapter.
 * ------------------------------------------------- */
var updateChapter = function(bookmark, chapter, page) {
	if (chapter) {
		chapters.value = chapter.chapter;
	} else {
		chapter = items[mangas.value][chapters.selectedIndex];
	}

	pages.innerHTML = createOptions(chapter.pages);
	updateImage(bookmark, page);
};
chapters.addEventListener("change", function() {
	updateChapter(true);
	chapters.blur();
});


/* ------------------------------------------------- *
 * Upate the image viewed.
 * ------------------------------------------------- */
var updateImage = function(bookmark, page) {
	var manga = mangas.value;
	var chapter = chapters.value;
	if (page) {
		pages.value = page;
	} else {
		page = pages.value;
	}

	var combined = manga + "/" + chapter + "/" + page;
	var src = "images/" + combined;
	image.src = src;

	document.documentElement.scrollTop = 0;

	if (bookmark) {
		Ajax.request("reading/" + combined, {
			method: "PUT",
			onSuccess: function () {
				console.log("Bookmarked.");
			},
			onFailure: function() {
				console.log("Failed to bookmarked.");
			}
		});
	}
};
pages.addEventListener("change", function() {
	updateImage(true);
	pages.blur();
});


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

	updateImage(true);
};


/* ------------------------------------------------- *
 * Navigate to the previous page.
 * ------------------------------------------------- */
var previous  = function() {
	var index = pages.selectedIndex - 1;

	if (index < 0) {
		chapters.value = chapters.options[chapters.selectedIndex - 1].value;
		pages.innerHTML = createOptions(items[mangas.value][chapters.selectedIndex].pages);
		pages.value = pages.options[pages.length -1].value;
	} else {
		pages.value = pages.options[index].value;
	}

	updateImage();
};


/* ------------------------------------------------- *
 * Read-mode that keeps the view clean from all
 * elements besides the page-image.
 * ------------------------------------------------- */
var toggleReadMode = function() {
	readMode = !readMode;

	var elements = document.getElementsByClassName("toggle");
	for (var i = 0; i < elements.length; i++) {
		elements[i].style.display = readMode ? "none" : "";
	}
};


/* ------------------------------------------------- *
 * On init, load mangas and their belonging chapter
 * and pages.
 * ------------------------------------------------- */
Ajax.get("/mangas", {
	onSuccess: function(response) {
		items = JSON.parse(response.response);
		mangas.innerHTML = createOptions(Object.keys(items));
		updateManga();
	}
});


/* ------------------------------------------------- *
 * Keys
 * ------------------------------------------------- */
document.addEventListener("keypress", function(e) {
	console.log(e);

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
		// R
		case 114:
			toggleReadMode();
			break;
	}
});
