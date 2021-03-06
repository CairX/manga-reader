/* global Ajax, console, ElementUtils, List */

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
var updateManga = function(title) {
	if (title) {
		mangas.value = title;
	} else {
		title = mangas.value;
	}

	var manga = items[title];

	// Populate chapter options.
	chapters.innerHTML = createOptions(List.extractValues(manga, "chapter"));

	Ajax.get("reading/" + title, {
		onSuccess: function(response) {
			var reading = JSON.parse(response.response).reading;

			if (reading) {
				var chapter = List.extractItem(manga, "chapter", reading.chapter);
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

	document.body.scrollTop = document.documentElement.scrollTop = 0;

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

	updateImage(true);
};


/* ------------------------------------------------- *
 * Read-mode that keeps the view clean from all
 * elements besides the page-image.
 * ------------------------------------------------- */
var toggleReadMode = function() {
	readMode = !readMode;

	var elements = document.getElementsByClassName("toggle");
	for (var i = 0; i < elements.length; i++) {
		ElementUtils.display(elements[i], !readMode);
	}
};


/* ------------------------------------------------- *
 * Toggle between light(default) and dark theme.
 * ------------------------------------------------- */
var toggleThemes = function() {
	ElementUtils.toggleClass(document.body, "dark");
};


/* ------------------------------------------------- *
 * On init, load mangas and their belonging chapter
 * and pages.
 * ------------------------------------------------- */
Ajax.get("/mangas", {
	onSuccess: function(response) {
		items = JSON.parse(response.response);
		mangas.innerHTML = createOptions(Object.keys(items));

		Ajax.get("/last", {
			onSuccess: function(response) {
				var reading = JSON.parse(response.response).reading;

				if (reading) {
					updateManga(reading.title);
				} else {
					updateManga();
				}
			}
		});
	}
});


/* ------------------------------------------------- *
 * Keys
 * ------------------------------------------------- */
document.addEventListener("keydown", function(e) {
	switch (e.keyCode) {
		case 37: // Left arrow
		case 65: // A
			previous();
			break;

		case 39: // Right arrow
		case 68: // D
			next();
			break;

		case 32: // Space
			next();
			e.preventDefault();
			break;

		case 82: // R
			toggleReadMode();
			break;

		case 84: // T
			toggleThemes();
			break;
	}
});
