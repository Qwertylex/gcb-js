var gcb = new function () {
	var self = this;

	this.loadJQuery = function (document, callback) {
		// Load jQuery from Google CDN
		var jqLoad = document.createElement("script");
		jqLoad.setAttribute("type", "text/javascript");
		jqLoad.setAttribute("src", "http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js");
		if(document.head != null) {
			document.head.appendChild(jqLoad);
		} else if(document.body != null) {
			document.body.appendChild(jqLoad);
		} else {
			document.appendChild(jqLoad);
		}

		// Wait until jQuery is loaded. Check it every 200 ms.
		var timer = null;
		var wait = function () {
			var silence = true;
			try {
				if (jQuery != undefined) {
					silence = false;
					callback.apply(this, []);
					return;
				}
			}
			catch (e) {
				if (!silence) {
					throw e;
				}
			}
			timer = setTimeout(wait, 200);
		};

		timer = setTimeout(wait, 200);
	};

	this.go = function (url) {
		var query = "http://webcache.googleusercontent.com/search?q=" + encodeURIComponent("cache:" + url);
		if(url == "") {
			query = "about:blank";
		}
		$(".overlay.load").fadeIn('fast');
		$(".viewport").attr('src', query);
		$(".url input").val(url);
	};

	this.goHash = function() {
		var hash = document.location.hash;
		if(hash.indexOf("#go=") == 0) {
			var url = hash.replace(/#go=/i, '');
			self.go(url);
		}
	}

	this.init = function () {
		$("div").hide();
		var toolbar = $("<div class='toolbar'></div>");
		
		var logo = $("<div class='logo'><p class='darkblue'><a href='http://cache.nevkontakte.com/'><span class='google'>" +
				"<span class='blue'>G</span>" +
				"<span class='red'>o</span>" +
				"<span class='yellow'>o</span>" +
				"<span class='blue'>g</span>" +
				"<span class='green'>l</span>" +
				"<span class='red'>e</span>" +
				"</span>&#153; cache browser" +
				"</a></p></div>");
		logo.appendTo(toolbar);

		var urlBar = $("<div class='url'><form action='#'><input type='text' id='url'></form><div class='go'>&rarr;</div></div>");
		var go = $(".go", urlBar);
		var url = $("input", urlBar);
		urlBar.appendTo(toolbar);

		go.click(function () {
			self.go(url.val());
		});
		$("form", urlBar).submit(function () {
			self.go(url.val());
			return false;
		});

		toolbar.appendTo(document.body);

		var view = $("<div class='view'><iframe class='viewport' src='about:blank'></iframe></div> ");
		view.css('margin-top', toolbar.height() + 2 + "px");
		var viewport = $("iframe", view);
		var loadOverlay = $("<div class='overlay load'><img src='images/ajax-loader.gif' alt='Loading...'></div>");
		loadOverlay.hide();
		loadOverlay.appendTo(view);

		viewport.load(function(){
			var frame = this;
			loadOverlay.fadeOut('fast');

			try {
				$("a", frame.contentDocument).each(function(){
					$(this).click(function(){
						self.go(this.href);
						return false;
					});
				});
			}
			catch (e) {

			}
		});

		var resizer = function () {
			// Resize iframe
			view.css('margin-top', toolbar.height() + 1 + "px");
			view.height($(window).height() - toolbar.outerHeight() - 1);

			// Resize url bar
			var width = toolbar.width();
			width -= logo.outerWidth(true);
			width -= urlBar.outerWidth(true) - urlBar.width()+20;
			urlBar.width(width);

			// Resize url input
			width = urlBar.width();
			width -= go.outerWidth(true);
			width -= url.outerWidth(true) - url.width()+20;
			url.width(width);
		};

		resizer();
		$(window).resize(resizer);
		$(document).load(function(){
			resizer();
		});

		view.appendTo(document.body);

		url.focus();

		self.goHash();
	};

	// Preload images
	var preload = function (){
		var loading = new Image();
		loading.src = "images/ajax-loader.gif";
		var bg = new Image();
		bg.src = "images/overlay.png";
	}();

	this.loadJQuery(document, function(){
		self.init();
	});
};