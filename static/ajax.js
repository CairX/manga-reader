/* exported Ajax */

"use strict";

/* ------------------------------------------------- *
 * @section Ajax
 * ------------------------------------------------- */
var Ajax = (function() {

	var init = function(options) {
		return (typeof options !== "undefined") ? options : {};
	};

	var self = {};


	/* ------------------------------------------------- *
	 * @param url {String} Request address.
	 * @param options {Object} Accepted options are the
	 *        following:
	 *        data -
	 *        method - HTTP metod ex. "GET" or "POST". Read more at http://www.w3.org/Protocols/rfc2616/rfc2616-sec9.html
	 *        onSuccess - Callback function to be called if the requst succeeds. More specific if the returned status codes is in the 2xx range that is defined as success. Read more at http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html
	 *        onFailure - Callback function to be called if the requst fails. Error status codes are defined in the 4xx and 5xx range.
	 *        contentType - Request header content type ex. "text/html". Read more at http://en.wikipedia.org/wiki/Internet_media_type
	 * ------------------------------------------------- */
	self.request = function(url, options) {
		var request = new XMLHttpRequest();
		request.onreadystatechange = function () {
			if (request.readyState === 4) {
				if (request.status >= 200 && request.status <= 299) {
					if("onSuccess" in options) {
						options.onSuccess(request);
					}
				} else if (request.status >= 400 && request.status <= 599) {
					if("onFailure" in options) {
						options.onFailure(request);
					}
				}
			}
		};

		request.open(options.method, url, true);

		if ("contentType" in options){
			request.setRequestHeader("Content-Type", options.contentType);
		}

		if ("data" in options) {
			request.send(options.data);
		} else {
			request.send();
		}
	};


	/* ------------------------------------------------- *
	 * Send requst with GET as HTTP method.
	 *
	 * See above "request(url, options)" for
	 * detailed information for the parameters.
	 *
	 * @param url {String} Request address.
	 * @param options {Object} Request options.
	 * ------------------------------------------------- */
	self.get = function(url, options) {
		options = init(options);
		options.method = "GET";
		self.request(url, options);
	};


	/* ------------------------------------------------- *
	 * Send requst with POST as HTTP method.
	 *
	 * See above "request(url, options)" for
	 * detailed information for the parameters.
	 *
	 * @param url {String} Request address.
	 * @param options {Object} Request options.
	 * ------------------------------------------------- */
	self.post = function(url, options) {
		options = init(options);
		options.method = "POST";
		self.request(url, options);
	};

	return self;
})();
