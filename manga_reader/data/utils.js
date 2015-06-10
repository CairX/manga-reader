/* exported ElementUtils, List */

"use strict";

var ElementUtils = (function() {
	var self = {};

	self.display = function(element, show) {
		if (show) {
			self.show(element);
		} else {
			self.hide(element);
		}
	};

	self.show = function(element) {
		element.style.display = "";
	};

	self.hide = function(element) {
		element.style.display = "none";
	};

	self.hasClass = function(element, className) {
		return (element.className.split(" ").indexOf(className) >= 0);
	};

	self.appendClass = function(element, className) {
		var classNames = element.className.split(" ");
		classNames.push(className);
		element.className = classNames.join(" ");
	};

	self.removeClass = function(element, className) {
		var classNames = element.className.split(" ");
		if (classNames.indexOf(className) >= 0) {
			classNames.splice(classNames.indexOf(className), 1);
		}
		element.className = classNames.join(" ");
	};

	self.toggleClass = function(element, className) {
		if (self.hasClass(element, className)) {
			self.removeClass(element, className);
		} else {
			self.appendClass(element, className);
		}
	};

	return self;
})();


var List = (function() {
	var self = {};

	/* ------------------------------------------------- *
	 * Extract values for the given key from a list of
	 * objects.
	 * ------------------------------------------------- */
	self.extractValues = function(list, key) {
		var result = [];

		for (var i = 0; i < list.length; i++) {
			result.push(list[i][key]);
		}

		return result;
	};


	/* ------------------------------------------------- *
	 * Extract object from list based on value for given
	 * property.
	 * ------------------------------------------------- */
	self.extractItem = function(list, key, value) {
		var result;

		for (var i = 0; i < list.length; i++) {
			if (list[i][key] == value) {
				result = list[i];
				break;
			}
		}

		return result;
	};

	return self;
})();
