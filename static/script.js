var path = "/home/cairns/workspace/manga-downloader/library/horimiya";
var items = {};
var chapters = document.getElementById("chapters");
var pages = document.getElementById("pages");
var page = document.getElementById("page");

var updatePage = function() {
	var src = "images/" + chapters.value + "/" + pages.value;
	page.src = src;
};

//console.log(Ajax);
Ajax.get("/chapters", {
	onSuccess: function(response) {
		// console.log("success");
		// console.log(response.response);

		items = JSON.parse(response.response).chapters;
		var all = "";
		var chapterOptions = "";
		var pageOptions = "";

		for (var i = 0; i < items.length; i++) {
			all += "Chapter: " + items[i].number + "<br />";

			chapterOptions += "<option>" + items[i].number + "</options>";

			for (var p = 0; p < items[i].pages.length; p++) {
				all += "Page: " + items[i].pages[p] + "<br />";
			}
		}

		for (var p = 0; p < items[0].pages.length; p++) {
			pageOptions += "<option>" + items[0].pages[p] + "</options>";
		}

		//document.getElementById("result").innerHTML = all;
		chapters.innerHTML = chapterOptions;
		pages.innerHTML = pageOptions;

		updatePage();
	}
});

pages.addEventListener("change", updatePage);

var next  = function() {
	var n = pages.selectedIndex + 1;

	if (n >= pages.length) {
		chapters.value = chapters.options[chapters.selectedIndex + 1].value;

		var ops = "";
		for (var p = 0; p < items[chapters.selectedIndex].pages.length; p++) {
			ops += "<option>" + items[chapters.selectedIndex].pages[p] + "</options>";
		}
		pages.innerHTML = ops;
	} else {
		pages.value = pages.options[pages.selectedIndex + 1].value;
	}

	updatePage();
};

var previous  = function() {
	pages.value = pages.options[pages.selectedIndex - 1].value;
	updatePage();
};

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
