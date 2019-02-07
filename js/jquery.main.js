jQuery(function() {
	initFancybox();
	initImageMaps();
	initStickyScrollBlock();
	GenerateMap();
	GenerateMap2();
	initTouchNav();
	initSlickCarousel();
	initTabs();
	initOpenClose();
	initPopups();
	initMobileNav();
	initAnchors();
	initRetinaCover();
	initCustomForms();
	initAccordion();
	initCustomHover();
});

// add classes on hover/touch
function initCustomHover() {
	jQuery('.activities-list > li').touchHover({});
	jQuery('.offers-list > li').touchHover({});
	jQuery('.special-offers-list .box').touchHover({});
}

// accordion menu init
function initAccordion() {
	jQuery('.accordion').slideAccordion({
		opener: '.opener',
		slider: '.slide',
		animSpeed: 300
	});
}

// lightbox init
function initFancybox() {
	jQuery('a.lightbox, [data-fancybox]').fancybox({
		parentEl: '#wrapper',
		margin: [50, 0]
	});
}

// create imagemaps
function initImageMaps() {
	var imageList = document.getElementsByTagName('img');
	for (var i = 0; i < imageList.length; i++) {
		if (imageList[i].getAttribute('usemap')) {
			new ImageMap({
				image: imageList[i]
			})
		}
	}

	$(".tabset-states a").mouseenter(function(){
		$("ul.image-map-tabs-2 li").removeClass("activestate").removeClass("active-2");

		$(".resort-box.active-2").removeClass("active-2").addClass("js-tab-hidden");

		var key = $('[data-tab="'+$(this).data("tab")+'"]').parent().attr("id");

		$('area[alt="'+key+'"]').trigger("onmouseover");

		$("ul.image-map-tabs-2 li#"+key+" a").trigger("mouseenter");
	});
	$(".tabset-states a").mouseout(function(){
		$("ul.image-map-tabs-2 li").removeClass("activestate");
	});
}


/*
 * jQuery Accordion plugin new
 */
;(function(root, factory) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		define(['jquery'], factory);
	} else if (typeof exports === 'object') {
		module.exports = factory(require('jquery'));
	} else {
		root.SlideAccordion = factory(jQuery);
	}
}(this, function($) {
	'use strict';
	var accHiddenClass = 'js-acc-hidden';

	function SlideAccordion(options) {
		this.options = $.extend(true, {
			allowClickWhenExpanded: false,
			activeClass:'active',
			opener:'.opener',
			slider:'.slide',
			animSpeed: 300,
			collapsible:true,
			event: 'click',
			scrollToActiveItem: {
				enable: false,
				breakpoint: 767, // max-width
				animSpeed: 600,
				extraOffset: null
			}
		}, options);
		this.init();
	}

	SlideAccordion.prototype = {
		init: function() {
			if (this.options.holder) {
				this.findElements();
				this.setStateOnInit();
				this.attachEvents();
				this.makeCallback('onInit');
			}
		},

		findElements: function() {
			this.$holder = $(this.options.holder).data('SlideAccordion', this);
			this.$items = this.$holder.find(':has(' + this.options.slider + ')');
		},

		setStateOnInit: function() {
			var self = this;

			this.$items.each(function() {
				if (!$(this).hasClass(self.options.activeClass)) {
					$(this).find(self.options.slider).addClass(accHiddenClass);
				}
			});
		},

		attachEvents: function() {
			var self = this;

			this.accordionToggle = function(e) {
				var $item = jQuery(this).closest(self.$items);
				var $actiItem = self.getActiveItem($item);

				if (!self.options.allowClickWhenExpanded || !$item.hasClass(self.options.activeClass)) {
					e.preventDefault();
					self.toggle($item, $actiItem);
				}
			};

			this.$items.on(this.options.event, this.options.opener, this.accordionToggle);
		},

		toggle: function($item, $prevItem) {
			if (!$item.hasClass(this.options.activeClass)) {
				this.show($item);
			} else if (this.options.collapsible) {
				this.hide($item);
			}

			if (!$item.is($prevItem) && $prevItem.length) {
				this.hide($prevItem);
			}

			this.makeCallback('beforeToggle');
		},

		show: function($item) {
			var $slider = $item.find(this.options.slider);

			$item.addClass(this.options.activeClass);
			$slider.stop().hide().removeClass(accHiddenClass).slideDown({
				duration: this.options.animSpeed,
				complete: function() {
					$slider.removeAttr('style');
					if (
						this.options.scrollToActiveItem.enable &&
						window.innerWidth <= this.options.scrollToActiveItem.breakpoint
					) {
						this.goToItem($item);
					}
					this.makeCallback('onShow', $item);
				}.bind(this)
			});

			this.makeCallback('beforeShow', $item);
		},

		hide: function($item) {
			var $slider = $item.find(this.options.slider);

			$item.removeClass(this.options.activeClass);
			$slider.stop().show().slideUp({
				duration: this.options.animSpeed,
				complete: function() {
					$slider.addClass(accHiddenClass);
					$slider.removeAttr('style');
					this.makeCallback('onHide', $item);
				}.bind(this)
			});

			this.makeCallback('beforeHide', $item);
		},

		goToItem: function($item) {
			var itemOffset = $item.offset().top;

			if (itemOffset < $(window).scrollTop()) {
				// handle extra offset
				if (typeof this.options.scrollToActiveItem.extraOffset === 'number') {
					itemOffset -= this.options.scrollToActiveItem.extraOffset;
				} else if (typeof this.options.scrollToActiveItem.extraOffset === 'function') {
					itemOffset -= this.options.scrollToActiveItem.extraOffset();
				}

				$('body, html').animate({
					scrollTop: itemOffset
				}, this.options.scrollToActiveItem.animSpeed);
			}
		},

		getActiveItem: function($item) {
			return $item.siblings().filter('.' + this.options.activeClass);
		},

		makeCallback: function(name) {
			if (typeof this.options[name] === 'function') {
				var args = Array.prototype.slice.call(arguments);
				args.shift();
				this.options[name].apply(this, args);
			}
		},

		destroy: function() {
			this.$holder.removeData('SlideAccordion');
			this.$items.off(this.options.event, this.options.opener, this.accordionToggle);
			this.$items.removeClass(this.options.activeClass).each(function(i, item) {
				$(item).find(this.options.slider).removeAttr('style').removeClass(accHiddenClass);
			}.bind(this));
			this.makeCallback('onDestroy');
		}
	};

	$.fn.slideAccordion = function(opt) {
		var args = Array.prototype.slice.call(arguments);
		var method = args[0];

		return this.each(function() {
			var $holder = jQuery(this);
			var instance = $holder.data('SlideAccordion');

			if (typeof opt === 'object' || typeof opt === 'undefined') {
				new SlideAccordion($.extend(true, {
					holder: this
				}, opt));
			} else if (typeof method === 'string' && instance) {
				if(typeof instance[method] === 'function') {
					args.shift();
					instance[method].apply(instance, args);
				}
			}
		});
	};

	(function() {
		var tabStyleSheet = $('<style type="text/css">')[0];
		var tabStyleRule = '.' + accHiddenClass;
		tabStyleRule += '{position:absolute !important;left:-9999px !important;top:-9999px !important;display:block !important; width: 100% !important;}';
		if (tabStyleSheet.styleSheet) {
			tabStyleSheet.styleSheet.cssText = tabStyleRule;
		} else {
			tabStyleSheet.appendChild(document.createTextNode(tabStyleRule));
		}
		$('head').append(tabStyleSheet);
	}());

	return SlideAccordion;
}));

// image map module
function ImageMap(opt) {
	this.options = {
		delay: 50,
		image: null,
		hoverClass:'activestate'
	}
	for(var p in opt) {
		if(opt.hasOwnProperty(p)) {
			this.options[p] = opt[p];
		}
	}
	this.init();
}
ImageMap.prototype = {
	init: function() {
		if(typeof this.options.image === 'object') {
			this.getElements();
			this.addHandlers();
		}
	},
	getElements: function() {
		this.mapId = this.options.image.getAttribute('usemap');
		this.mapId = this.mapId.substring(1);
		this.map = document.getElementById(this.mapId);
		if(this.map) {
			this.areas = this.map.getElementsByTagName('area');
		}
	},
	addHandlers: function() {
		if(this.areas) {
			for(var i = 0; i < this.areas.length; i++) {
				(function(inst){
					var timer;
					var area = inst.areas[i];

					var node = document.getElementById(inst.areas[i].alt);

					if(node) {
						area.onmouseover = function() {
							inst.addClass(node, inst.options.hoverClass);

							//$('area[alt="'+key+'"]').trigger("onmouseover");

							/*clearTimeout(timer);
							timer = setTimeout(function(){
								inst.addClass(node, inst.options.hoverClass);
							},inst.options.delay)*/
						}
						area.onmouseout = function() {
							inst.removeClass(node, inst.options.hoverClass);

							/*clearTimeout(timer);
							timer = setTimeout(function(){
								inst.removeClass(node, inst.options.hoverClass);
							},inst.options.delay)*/
						}

						node.onmouseover = function() {
							clearTimeout(timer);
						}
						node.onmouseout = function() {
							clearTimeout(timer);
							timer = setTimeout(function(){
								inst.removeClass(node, inst.options.hoverClass);
							},inst.options.delay)
						}
					}
				})(this);
			}
		}
	},
	hasClass: function(el,cls) {
		return el.className.match(new RegExp('(\\s|^)'+cls+'(\\s|$)'));
	},
	addClass: function(el,cls) {
		if (!this.hasClass(el,cls)) el.className += " "+cls;
	},
	removeClass: function(el,cls) {
		if (this.hasClass(el,cls)) {el.className=el.className.replace(new RegExp('(\\s|^)'+cls+'(\\s|$)'),' ');}
	}
}


// initialize fixed blocks on scroll
function initStickyScrollBlock() {
	ResponsiveHelper.addRange({
		'1024..': {
			on: function() {
				jQuery('#header').stickyScrollBlock({
					setBoxHeight: false,
					activeClass: 'fixed-position',
					positionType: 'fixed'
				});
			},
			off: function() {
				jQuery('#header').stickyScrollBlock('destroy');
			}
		}
	});

	ResponsiveHelper.addRange({
		'..1023': {
			on: function() {
				jQuery('#header').stickyScrollBlock({
					setBoxHeight: false,
					activeClass: 'fixed-position',
					positionType: 'fixed'
				});
			},
			off: function() {
				jQuery('#header').stickyScrollBlock('destroy');
			}
		}
	});

	ResponsiveHelper.addRange({
		'1024..': {
			on: function() {
				jQuery('.intro-section .add-nav').stickyScrollBlock({
					setBoxHeight: true,
					activeClass: 'fixed-position',
					positionType: 'fixed',
					extraTop: function() {
						var totalHeight = 0;
						jQuery('.nav-holder').each(function() {
							totalHeight += jQuery(this).outerHeight();
						});
						return totalHeight;
					}
				});
			},
			off: function() {
				jQuery('.intro-section .add-nav').stickyScrollBlock('destroy');
			}
		}
	});
}

// Google map init

function GenerateMap() {
	var articleContainer   = $(".resorts-grid"),
		articles           = $(".resorts-grid .article"),
		scroller           = $(".map-selects-holder"),
		container          = $("#google-map"),
		hcolor             = "#E87722",
		markers            = [],
		namesort           = $(".sort-by-name"),
		citysort           = $(".sort-by-city");
	if (articles.length) {
		/**
		 * Accordions
		 */
		var toggles = $(".article-toggler");
		var accordions = new Togglers(toggles, articles, {
			openOn : { toggler : "click" }
		});

		if (!toggles.hasClass("toggle")) {
			accordions.pause();
		}

		$(".resorts-grid .close").on("click", function() {
			accordions.close();
		});

		$(".resorts-grid .name").on("click", function() {
			accordions.close();
		});
	}
	if (container.length) {
		/**
		 * Markers
		 */
		articles.each(function(index, curitem) {
			markers.push({
				position: new google.maps.LatLng(parseFloat($(curitem).attr("data-latitude")), parseFloat($(curitem).attr("data-longitude"))),
				title   : $(curitem).find(".article-header .name").text() + " in " + $(curitem).find(".article-header .city").text()
			});
			$(curitem).attr("data-marker", index);

			$(curitem).on("mouseenter", function() {
				$(map).trigger("onMarker", [index]);
			}).on("mouseleave", function() {
				$(map).trigger("offMarker", [index]);
			});
		});

		/**
		 * Map
		 */
		var map = new google.maps.Map(container.get(0), {
				center: new google.maps.LatLng(parseFloat($(container).attr("data-latitude")), parseFloat($(container).attr("data-longitude"))),
				zoom: parseInt($(container).attr("data-zoom")),
			}
		);
		var iconDefault = {
			url: 'images/marker.png',
			anchor: new google.maps.Point(18, 28)
			// path         : "M 8 10 C 8 8.8165 8.7727 8 10 8 C 11.2273 8 12 8.8165 12 10 C 12 11.1835 11.2273 12 10 12 C 8.7727 12 8 11.1835 8 10 ZM 0 10 C 0 15.3259 8.3243 30 10 30 C 11.8431 30 20 15.3259 20 10 C 20 4.6741 15.5231 0 10 0 C 4.4769 0 0 4.6741 0 10 Z",
			// fillColor    : '#0f3557',
			// strokeColor  : "#ffffff",

			// strokeWeight : 2,
			// fillOpacity  : 1
		}
		var iconHover = {
			url: 'images/marker-hover.png',
			anchor: new google.maps.Point(18, 28)
			// path         : "M 8 10 C 8 8.8165 8.7727 8 10 8 C 11.2273 8 12 8.8165 12 10 C 12 11.1835 11.2273 12 10 12 C 8.7727 12 8 11.1835 8 10 ZM 0 10 C 0 15.3259 8.3243 30 10 30 C 11.8431 30 20 15.3259 20 10 C 20 4.6741 15.5231 0 10 0 C 4.4769 0 0 4.6741 0 10 Z",
			// fillColor    : '#ffcd00',
			// strokeColor  : "#ffffff",
			// strokeWeight : 2,
			// fillOpacity  : 1
		}
		for (i = 0; i < markers.length; i++) {
			marker = new google.maps.Marker({
				position: markers[i].position,
				map: map,
				title: markers[i].title,
				icon: iconDefault,
				label: i.toString()
			});
			google.maps.event.addListener(marker, 'mouseover', function() {
				this.setIcon(iconHover);
			});
			google.maps.event.addListener(marker, 'mouseout', function() {
				this.setIcon(iconDefault);
			});
			google.maps.event.addListener(marker, 'click', function(a,b,c,d,e,f){
				var currentMarkerIndex = parseInt(this.label);
				accordions.open(currentMarkerIndex);
				if (scroller.length) {
					scroller.animate({
						scrollTop: $(accordions.panels[currentMarkerIndex]).position().top
					}, 250);
				}
			});
//
//			if (locations[i].iw.enable === true){
//				bindInfoWindow(marker, map, locations[i]);
//			}
		}
	}
	$(map).on("clickMarker", function(e, index, marker) {
		accordions.open(index);
		if (scroller.length) {
			scroller.animate({
				scrollTop: $(accordions.panels[index]).position().top
			}, 250);
		}
	});
	/**
	 * Sorting
	 */
	citysort.on("click", function() {
		if (citysort.hasClass("open")) {
			return;
		}
		namesort.removeClass("open");
		citysort.addClass("open");
		articles.each(function(index, article) {
			$(article).css("order", $(article).attr("data-city-order"));
		});
		var scrollto = articles.has(".open");
		if (scrollto.length) {
			scrollto = scrollto.position().top;
		}
		else {
			scrollto = 0;
		}
		if (scroller.length) {
			scroller.animate({
				scrollTop: scrollto
			}, 250);
		}
	});
	namesort.on("click", function() {
		if (namesort.hasClass("open")) {
			return;
		}
		citysort.removeClass("open");
		namesort.addClass("open");
		articles.css("order", "");

		var scrollto = articles.has(".open");
		if (scrollto.length) {
			scrollto = scrollto.position().top;
		}
		else {
			scrollto = 0;
		}
		if (scroller.length) {
			scroller.animate({
				scrollTop: scrollto
			}, 250);
		}
	});
	namesort.addClass("open");
	/**
	 * Designation filtering
	 */
	var designationFilter = $(".designation-filter select");
	 if (designationFilter.length) {
		var designationHeading = $(".designation-heading .type");
		var parkCountHeading   = $(".park-count");
		var articleCounts      = {};
		var designationTypes   = {};
		$.each(designationFilter.children("option"), function(index, curitem) {
			var label = $(curitem).text();
			var value = $(curitem).attr("value");
			var count = value === "all" ? articles.length : articles.filter("." + value).length;
			if (!count) {
				$(curitem).remove();
				return;
			}
			articleCounts[value]    = count;
			designationTypes[value] = label;
		});
		function setDesignation(type) {
			articles.each(function(index, curitem) {
				curitem = $(curitem);
				if (curitem.hasClass(type) || type === 'all') {
					curitem.removeClass("hide");
					map.markers[index].setVisible(true);
				}
				else {
					curitem.addClass("hide");
					map.markers[index].setVisible(false);
				}
			});
			designationHeading.text(designationTypes[type]);
			parkCountHeading.text(articleCounts[type] +" "+ designationTypes[type].replace("All ", ""));
		}
		$(map).on("mapReady", function() {
			var remaining = designationFilter.children("option:not([value=all])");
			if (remaining.length <= 1) {
				setDesignation(remaining.attr("value"));
				designationFilter.parents("section.form").remove();
				return;
			}
			var type = designationFilter.val();

			if (articleCounts[type] !== undefined) {
				setDesignation(type);
			}
		});
		designationFilter.on("change", function() {
			var type = designationFilter.val();
			if (articleCounts[type] !== undefined) {
				setDesignation(type);
			}
		});
	 }
}

var filterMarkers, filterMarkerCluster, filetrVewportSides, filterInfowindow, filterMap;
function GenerateMap2() {

	filterInfowindow = new google.maps.InfoWindow();
	if (jQuery('.filter-form').length){
		jQuery('.filter-form').submit(function(e){
			jQuery('.map-block .result-panel').addClass('visible');
			e.preventDefault();
			getFilteredData();
			return false;
		});
	}

	var container = $("#google-map-add");
	if (container.length) {
		var mapOptions = {
			center: new google.maps.LatLng(parseFloat($(container).attr("data-latitude")), parseFloat($(container).attr("data-longitude"))),
			zoom: parseInt($(container).attr("data-zoom")),
			gestureHandling: 'auto',
			fullscreenControl: false,
			zoomControl: true,
			disableDoubleClickZoom: true,
			mapTypeControl: true,
			mapTypeControlOptions: {
				style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
			},
			scaleControl: true,
			scrollwheel: true,
			streetViewControl: false,
			draggable : true,
			clickableIcons: false,
			mapTypeId: google.maps.MapTypeId.ROADMAP,
		}
		filterMap = new google.maps.Map(container.get(0), mapOptions);
		filterMarkers = [];

		var clusterStyles = [
		  {
			textColor: 'white',
			url: 'images/m1.png',
			height: 70,
			width: 70
		  },
		 {
			textColor: 'white',
			url: 'images/m1.png',
			height: 70,
			width: 70
		  },
		 {
			textColor: 'white',
			url: 'images/m1.png',
			height: 70,
			width: 70
		  }
		];

		var mcOptions = {
			gridSize: 50,
			styles: clusterStyles,
			maxZoom: 15
		};

		filterMarkerCluster= new MarkerClusterer(filterMap, filterMarkers, mcOptions);

		// filterMarkerCluster = new MarkerClusterer(filterMap, filterMarkers, {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});

		google.maps.event.addListener(filterMap, 'idle', function() {
			if (!isInfoWindowOpen(filterInfowindow)){
				var boundsInner = filterMap.getBounds();
				filetrVewportSides = {
					north : filterMap.getBounds().getNorthEast().lat(),
					south : filterMap.getBounds().getSouthWest().lat(),
					east : filterMap.getBounds().getNorthEast().lng(),
					west : filterMap.getBounds().getSouthWest().lng()
				}
				deleteMarkers();
				getFilteredData();
			}
		});

	}
}

function getFilteredData() {
	$.ajax({
	   type: "post",
	   dataType: "json",
	   url: 'ajax.php',
	   data: {action: "am_get_filtered_data", vewportsides: JSON.stringify(filetrVewportSides)},
	   beforeSend: function () {
		   deleteMarkers();
	   },
	   success: function (response) {
		   if (response.locations.length){
			   jQuery('.we-found strong').text(response.locations.length);
			   for (var i = 0; i < response.locations.length; i++) {
				   var location = new google.maps.LatLng(response.locations[i].lat, response.locations[i].lng);
				   addMarker(location, response.locations[i].infocontent, response.locations[i].id);
				   jQuery(response.locations[i].html).insertBefore( ".js-append-here #anchor-resort" );
			   }
			   initArticleAccordions();

		   }
	   }
   });
}

function initArticleAccordions(){
	var toggles = $(".js-append-here .article-toggler");
	var accordions = new Togglers(toggles, $(".js-append-here .article"), {
		openOn : { toggler : "click" }
	});

	if (!toggles.hasClass("toggle")) {
		accordions.pause();
	}

	$(".resorts-grid .close").on("click", function() {
		accordions.close();
	});

	$(".resorts-grid .name").on("click", function() {
		accordions.close();
	});
}

function addMarker(location, infocontent, markerid) {
	var iconDefault = {
		url: 'images/marker.png',
		anchor: new google.maps.Point(18, 28)
		// path         : "M 8 10 C 8 8.8165 8.7727 8 10 8 C 11.2273 8 12 8.8165 12 10 C 12 11.1835 11.2273 12 10 12 C 8.7727 12 8 11.1835 8 10 ZM 0 10 C 0 15.3259 8.3243 30 10 30 C 11.8431 30 20 15.3259 20 10 C 20 4.6741 15.5231 0 10 0 C 4.4769 0 0 4.6741 0 10 Z",
		// fillColor    : '#0f3557',
		// strokeColor  : "#ffffff",
		// strokeWeight : 2,
		// fillOpacity  : 1
	}
	var iconHover = {
		url: 'images/marker-hover.png',
		anchor: new google.maps.Point(18, 28)
		// path         : "M 8 10 C 8 8.8165 8.7727 8 10 8 C 11.2273 8 12 8.8165 12 10 C 12 11.1835 11.2273 12 10 12 C 8.7727 12 8 11.1835 8 10 ZM 0 10 C 0 15.3259 8.3243 30 10 30 C 11.8431 30 20 15.3259 20 10 C 20 4.6741 15.5231 0 10 0 C 4.4769 0 0 4.6741 0 10 Z",
		// fillColor    : '#ffcd00',
		// strokeColor  : "#ffffff",
		// strokeWeight : 2,
		// fillOpacity  : 1
	}
	var marker = new google.maps.Marker({
		position: location,
		map: filterMap,
		icon: iconDefault
	});


	google.maps.event.addListener(marker, 'click', function(){
		filterInfowindow.close();
		filterInfowindow.setContent( "<div id='infowindow'>" + infocontent + "</div>");
		filterInfowindow.open(filterMap, marker);

		var iwOuter = $('.gm-style-iw');

		iwOuter.find('img').wrap('<div class="visual"></div>');
		$('#infowindow').closest('.gm-style-iw').parent().addClass('custom-iw');
		if (markerid){
			if (jQuery(".map-selects-holder").length) {
				jQuery("html, body").animate({
					scrollTop: jQuery(".map-selects-holder").offset().top - $('#header').height()
				}, 800);
				jQuery(".map-selects-holder").animate({
					scrollTop: $('#location-article-' + markerid).position().top
				}, 250);
			}
		}
	});

	google.maps.event.addListener(filterInfowindow, 'domready', function() {
		var iwOuter = $('.gm-style-iw');
		var iwBackground = iwOuter.prev();
		var iwCloseBtn = iwOuter.next();

		iwCloseBtn.css({
			opacity: '1',
			right: '-4px', top: '23px',
			width: '15px', height: '15px'
		});
		iwCloseBtn.mouseout(function(){
			$(this).css({opacity: '1'});
		});

		// Remove the background shadow DIV
		iwBackground.children(':nth-child(2)').css({'display' : 'none'});
		// Remove the white background DIV
		iwBackground.children(':nth-child(4)').css({'display' : 'none'});
	});

	filterMarkers.push(marker);
	filterMarkerCluster.addMarker(marker);
	google.maps.event.addListener(marker, 'mouseover', function() {
		this.setIcon(iconHover);
	});
	google.maps.event.addListener(marker, 'mouseout', function() {
		this.setIcon(iconDefault);
	});
}

function isInfoWindowOpen(infoWindow){
    var map = infoWindow.getMap();
    return (map !== null && typeof map !== "undefined");
}

function deleteMarkers(map) {
   jQuery('.js-append-here').find('.article').not('#anchor-resort').remove();
   jQuery('.we-found strong').text('0');
	if (filterMarkers.length){
		for (var i = 0; i < filterMarkers.length; i++) {
		  filterMarkers[i].setMap(null);
		}
		filterMarkers = [];
		filterMarkerCluster.clearMarkers();

	}
}

// slick init
function initSlickCarousel() {
	jQuery('.slick-slider-four').slick({
		slidesToScroll: 4,
		rows: 0,
		slidesToShow: 4,
		prevArrow: '<span class="slick-prev icon-arrow-prev"></span>',
		nextArrow: '<span class="slick-next icon-arrow-next"></span>',
		responsive: [{
			breakpoint: 768,
			settings: {
				slidesToScroll: 2,
				slidesToShow: 2
			}
		}, {
			breakpoint: 480,
			settings: {
				slidesToScroll: 1,
				slidesToShow: 1
			}
		}]
	});

	jQuery('.slick-slider-three').slick({
		slidesToScroll: 3,
		rows: 0,
		slidesToShow: 3,
		prevArrow: '<span class="slick-prev icon-arrow-prev"></span>',
		nextArrow: '<span class="slick-next icon-arrow-next"></span>',
		responsive: [{
			breakpoint: 768,
			settings: {
				slidesToScroll: 2,
				slidesToShow: 2
			}
		}, {
			breakpoint: 480,
			settings: {
				slidesToScroll: 1,
				slidesToShow: 1
			}
		}]
	});

	jQuery('.activities-slider').slick({
		slidesToScroll: 4,
		rows: 0,
		slidesToShow: 4,
		prevArrow: '<span class="slick-prev icon-arrow-prev"></span>',
		nextArrow: '<span class="slick-next icon-arrow-next"></span>',
		responsive: [{
			breakpoint: 768,
			settings: {
				slidesToScroll: 2,
				slidesToShow: 2
			}
		}, {
			breakpoint: 480,
			settings: {
				slidesToScroll: 1,
				slidesToShow: 1
			}
		}]
	});
}

// content tabs init
function initTabs() {



	ResponsiveHelper.addRange({
		'1024..': {
			on: function() {
				jQuery('.tabset').tabset({
					tabLinks: 'a',
					event: 'mouseenter',
					attrib: 'data-tab',
					defaultTab: false
				});
			},
			off: function() {
				jQuery('.tabset').tabset('destroy');
			}
		}
	});

	ResponsiveHelper.addRange({
		'..1023': {
			on: function() {
				jQuery('.tabset').tabset({
					tabLinks: 'a',
					attrib: 'data-tab',
					defaultTab: false
				});
			}
		}
	});

	/*ResponsiveHelper.addRange({
		'1024..': {
			on: function() {
				jQuery('.tabset-states').tabset({
					tabLinks: 'a',
					event: 'mouseenter',
					attrib: 'data-tab',
					defaultTab: false
				});
			},
			off: function() {
				jQuery('.tabset-states').tabset('destroy');
			}
		}
	});

	ResponsiveHelper.addRange({
		'..1023': {
			on: function() {
				jQuery('.tabset-states').tabset({
					tabLinks: 'a',
					addToParent: true,
					attrib: 'data-tab',
					defaultTab: false
				});
			}
		}
	});*/

	ResponsiveHelper.addRange({
		'1024..': {
			on: function() {
				jQuery('.image-map-tabs').tabset({
					activeClass: 'active',
					tabLinks: 'a',
					event: 'mouseenter',
					addToParent: true,
					attrib: 'data-tab'
				});
			},
			off: function() {
				jQuery('.image-map-tabs').tabset('destroy');
			}
		}
	});

	ResponsiveHelper.addRange({
		'..1023': {
			on: function() {
				jQuery('.image-map-tabs').tabset({
					activeClass: 'active',
					tabLinks: 'a',
					event: 'click',
					addToParent: true,
					attrib: 'data-tab'
				});
			}
		}
	});

	ResponsiveHelper.addRange({
		'1024..': {
			on: function() {
				jQuery('.image-map-tabs-2').tabset({
					activeClass: 'active-2',
					tabLinks: 'a',
					event: 'mouseenter',
					addToParent: true,
					attrib: 'data-tab',
					defaultTab: false
				});
			},
			off: function() {
				jQuery('.image-map-tabs-2').tabset('destroy');
			}
		}
	});

	ResponsiveHelper.addRange({
		'..1023': {
			on: function() {
				jQuery('.image-map-tabs-2').tabset({
					activeClass: 'active-2',
					tabLinks: 'a',
					event: 'click',
					addToParent: true,
					attrib: 'data-tab',
					defaultTab: false
				});
			}
		}
	});

	jQuery('.tabset-ways').tabset({
		tabLinks: 'a',
		event: 'mouseenter',
		attrib: 'data-tab'
	});
	jQuery('.tabset-promo').tabset({
		tabLinks: 'a',
		autoHeight: true,
		addToParent: true,
		defaultTab: false,
		animSpeed: '0'
	});
}


// open-close init
function initOpenClose() {
	jQuery('.open-close').openClose({
		activeClass: 'active',
		opener: '.opener',
		slider: '.slide',
		hideOnClickOutside: true,
		effect: 'none'
	});

	jQuery('.open-close-book').openClose({
		activeClass: 'active',
		opener: '.opener-book',
		slider: '.slide-book',
		hideOnClickOutside: false,
		effect: 'slide'
	});

	jQuery('.open-close-select').openClose({
		activeClass: 'active',
		opener: '.opener-select',
		slider: '.slide-select',
		hideOnClickOutside: true,
		effect: 'slide'
	});

	ResponsiveHelper.addRange({
		'..1023': {
			on: function() {
				jQuery('.open-close-menu').openClose({
					activeClass: 'active',
					opener: '.opener',
					slider: '.slide',
					animSpeed: 300,
					hideOnClickOutside: true,
					effect: 'slide'
				});
			},
			off: function() {
				jQuery('.open-close-search').openClose('destroy');
			}
		}
	});

	ResponsiveHelper.addRange({
		'1024..': {
			on: function() {
				jQuery('.open-close-search').openClose({
					activeClass: 'active',
					opener: '.opener-search',
					slider: '.slide-search',
					animSpeed: 300,
					hideOnClickOutside: true,
					effect: 'slide'
				});
			},
			off: function() {
				jQuery('.open-close-search').openClose('destroy');
			}
		}
	});

	jQuery('.open-close-types').openClose({
		activeClass: 'active',
		opener: '.opener-types',
		slider: '.slide-types',
		hideOnClickOutside: true,
		effect: 'slide'
	});
}

// popups init
function initPopups() {
	jQuery('.popup-holder').contentPopup({
		mode: 'click'
	});
	jQuery('body').contentPopup({
		mode: 'click',
		popup: '.blog-search-form',
		btnOpen: '.categories-block .search-opener'
	});
}

// mobile menu init
function initMobileNav() {
	jQuery('body').mobileNav({
		menuActiveClass: 'nav-active',
		menuOpener: '.nav-opener',
		hideOnClickOutside: false,
		menuDrop: '.nav-drop'
	});

	jQuery('body').mobileNav({
		menuActiveClass: 'nav-active-classic',
		menuOpener: '.nav-opener-classic',
		hideOnClickOutside: false,
		menuDrop: '.nav-drop-classic-holder'
	});
}

// initialize smooth anchor links
function initAnchors() {
	new SmoothScroll({
		anchorLinks: 'a[href^="#anchor-resort"]:not([href="#"])',
		extraOffset: 0,
		activeClasses: 'link',
		wheelBehavior: 'none',
		container: '.map-selects-holder'
	});
	new SmoothScroll({
		anchorLinks: 'a[href^="#about-anchor"]:not([href="#"])',
		extraOffset: 0,
		activeClasses: 'link',
		wheelBehavior: 'none',
		extraOffset: function() {
			var totalHeight = 0;
			jQuery('#header').each(function() {
				var $box = jQuery(this);
				var stickyInstance = $box.data('StickyScrollBlock');
				if (stickyInstance) {
					stickyInstance.stickyFlag = false;
					stickyInstance.stickyOn();
					totalHeight += $box.outerHeight();
					stickyInstance.onResize();
				} else {
					totalHeight += $box.css('position') === 'fixed' ? $box.outerHeight() : 0;
				}
			});
			return totalHeight;
		}
	});
	new SmoothScroll({
		anchorLinks: 'a[href^="#resorts-anchor"]:not([href="#"])',
		extraOffset: 0,
		activeClasses: 'link',
		wheelBehavior: 'none',
		extraOffset: function() {
			var totalHeight = 0;
			jQuery('#header').each(function() {
				var $box = jQuery(this);
				var stickyInstance = $box.data('StickyScrollBlock');
				if (stickyInstance) {
					stickyInstance.stickyFlag = false;
					stickyInstance.stickyOn();
					totalHeight += $box.outerHeight();
					stickyInstance.onResize();
				} else {
					totalHeight += $box.css('position') === 'fixed' ? $box.outerHeight() : 0;
				}
			});
			return totalHeight;
		}
	});
	new SmoothScroll({
		anchorLinks: 'a[href^="#ways-anchor"]:not([href="#"])',
		extraOffset: 0,
		activeClasses: 'link',
		wheelBehavior: 'none',
		extraOffset: function() {
			var totalHeight = 0;
			jQuery('#header').each(function() {
				var $box = jQuery(this);
				var stickyInstance = $box.data('StickyScrollBlock');
				if (stickyInstance) {
					stickyInstance.stickyFlag = false;
					stickyInstance.stickyOn();
					totalHeight += $box.outerHeight();
					stickyInstance.onResize();
				} else {
					totalHeight += $box.css('position') === 'fixed' ? $box.outerHeight() : 0;
				}
			});
			return totalHeight;
		}
	});
	new SmoothScroll({
		anchorLinks: 'a[href^="#things-anchor"]:not([href="#"])',
		extraOffset: 0,
		activeClasses: 'link',
		wheelBehavior: 'none',
		extraOffset: function() {
			var totalHeight = 0;
			jQuery('#header').each(function() {
				var $box = jQuery(this);
				var stickyInstance = $box.data('StickyScrollBlock');
				if (stickyInstance) {
					stickyInstance.stickyFlag = false;
					stickyInstance.stickyOn();
					totalHeight += $box.outerHeight();
					stickyInstance.onResize();
				} else {
					totalHeight += $box.css('position') === 'fixed' ? $box.outerHeight() : 0;
				}
			});
			return totalHeight;
		}
	});
	new SmoothScroll({
		anchorLinks: 'a[href^="#amenities-anchor"]:not([href="#"])',
		extraOffset: 0,
		activeClasses: 'link',
		wheelBehavior: 'none',
		extraOffset: function() {
			var totalHeight = 0;
			jQuery('#header').each(function() {
				var $box = jQuery(this);
				var stickyInstance = $box.data('StickyScrollBlock');
				if (stickyInstance) {
					stickyInstance.stickyFlag = false;
					stickyInstance.stickyOn();
					totalHeight += $box.outerHeight();
					stickyInstance.onResize();
				} else {
					totalHeight += $box.css('position') === 'fixed' ? $box.outerHeight() : 0;
				}
			});
			return totalHeight;
		}
	});
	new SmoothScroll({
		anchorLinks: 'a[href^="#for-sale-anchor"]:not([href="#"])',
		extraOffset: 0,
		activeClasses: 'link',
		wheelBehavior: 'none',
		extraOffset: function() {
			var totalHeight = 0;
			jQuery('#header').each(function() {
				var $box = jQuery(this);
				var stickyInstance = $box.data('StickyScrollBlock');
				if (stickyInstance) {
					stickyInstance.stickyFlag = false;
					stickyInstance.stickyOn();
					totalHeight += $box.outerHeight();
					stickyInstance.onResize();
				} else {
					totalHeight += $box.css('position') === 'fixed' ? $box.outerHeight() : 0;
				}
			});
			return totalHeight;
		}
	});
	new SmoothScroll({
		anchorLinks: 'a[href^="#offers-anchor"]:not([href="#"])',
		extraOffset: 0,
		activeClasses: 'link',
		wheelBehavior: 'none',
		extraOffset: function() {
			var totalHeight = 0;
			jQuery('#header').each(function() {
				var $box = jQuery(this);
				var stickyInstance = $box.data('StickyScrollBlock');
				if (stickyInstance) {
					stickyInstance.stickyFlag = false;
					stickyInstance.stickyOn();
					totalHeight += $box.outerHeight();
					stickyInstance.onResize();
				} else {
					totalHeight += $box.css('position') === 'fixed' ? $box.outerHeight() : 0;
				}
			});
			return totalHeight;
		}
	});
	new SmoothScroll({
		anchorLinks: 'a[href^="#attractions-anchor"]:not([href="#"])',
		extraOffset: 0,
		activeClasses: 'link',
		wheelBehavior: 'none',
		extraOffset: function() {
			var totalHeight = 0;
			jQuery('#header').each(function() {
				var $box = jQuery(this);
				var stickyInstance = $box.data('StickyScrollBlock');
				if (stickyInstance) {
					stickyInstance.stickyFlag = false;
					stickyInstance.stickyOn();
					totalHeight += $box.outerHeight();
					stickyInstance.onResize();
				} else {
					totalHeight += $box.css('position') === 'fixed' ? $box.outerHeight() : 0;
				}
			});
			return totalHeight;
		}
	});
	new SmoothScroll({
		anchorLinks: 'a[href^="#states-anchor"]:not([href="#"])',
		extraOffset: 0,
		activeClasses: 'link',
		wheelBehavior: 'none',
		extraOffset: function() {
			var totalHeight = 0;
			jQuery('#header').each(function() {
				var $box = jQuery(this);
				var stickyInstance = $box.data('StickyScrollBlock');
				if (stickyInstance) {
					stickyInstance.stickyFlag = false;
					stickyInstance.stickyOn();
					totalHeight += $box.outerHeight();
					stickyInstance.onResize();
				} else {
					totalHeight += $box.css('position') === 'fixed' ? $box.outerHeight() : 0;
				}
			});
			return totalHeight;
		}
	});
	new SmoothScroll({
		anchorLinks: 'a[href^="#back-to-top"]:not([href="#"])',
		extraOffset: 0,
		activeClasses: 'link',
		wheelBehavior: 'none'
	});
	new SmoothScroll({
		anchorLinks: 'a[href^="#anchor-amenities"]:not([href="#"])',
		extraOffset: 0,
		activeClasses: 'link',
		wheelBehavior: 'none',
		container: '.amenities-holder'
	});
	new SmoothScroll({
		anchorLinks: '.amenities-anchor',
		extraOffset: 0,
		wheelBehavior: 'none'
	});
	new SmoothScroll({
		anchorLinks: 'a[href^="#types-anchor"]:not([href="#"])',
		extraOffset: 0,
		activeClasses: 'link',
		wheelBehavior: 'none',
		extraOffset: function() {
			var totalHeight = 0;
			jQuery('#header, .add-nav-2').each(function() {
				var $box = jQuery(this);
				var stickyInstance = $box.data('StickyScrollBlock');
				if (stickyInstance) {
					stickyInstance.stickyFlag = false;
					stickyInstance.stickyOn();
					totalHeight += $box.outerHeight();
					stickyInstance.onResize();
				} else {
					totalHeight += $box.css('position') === 'fixed' ? $box.outerHeight() : 0;
				}
			});
			return totalHeight;
		}
	});
	new SmoothScroll({
		anchorLinks: 'a[href^="#ages-anchor"]:not([href="#"])',
		extraOffset: 0,
		activeClasses: 'link',
		wheelBehavior: 'none',
		extraOffset: function() {
			var totalHeight = 0;
			jQuery('#header, .add-nav-2').each(function() {
				var $box = jQuery(this);
				var stickyInstance = $box.data('StickyScrollBlock');
				if (stickyInstance) {
					stickyInstance.stickyFlag = false;
					stickyInstance.stickyOn();
					totalHeight += $box.outerHeight();
					stickyInstance.onResize();
				} else {
					totalHeight += $box.css('position') === 'fixed' ? $box.outerHeight() : 0;
				}
			});
			return totalHeight;
		}
	});
	new SmoothScroll({
		anchorLinks: 'a[href^="#active55-anchor"]:not([href="#"])',
		extraOffset: 0,
		activeClasses: 'link',
		wheelBehavior: 'none',
		extraOffset: function() {
			var totalHeight = 0;
			jQuery('#header, .add-nav-2').each(function() {
				var $box = jQuery(this);
				var stickyInstance = $box.data('StickyScrollBlock');
				if (stickyInstance) {
					stickyInstance.stickyFlag = false;
					stickyInstance.stickyOn();
					totalHeight += $box.outerHeight();
					stickyInstance.onResize();
				} else {
					totalHeight += $box.css('position') === 'fixed' ? $box.outerHeight() : 0;
				}
			});
			return totalHeight;
		}
	});
	new SmoothScroll({
		anchorLinks: 'a[href^="#bark-anchor"]:not([href="#"])',
		extraOffset: 0,
		activeClasses: 'link',
		wheelBehavior: 'none',
		extraOffset: function() {
			var totalHeight = 0;
			jQuery('#header, .add-nav-2').each(function() {
				var $box = jQuery(this);
				var stickyInstance = $box.data('StickyScrollBlock');
				if (stickyInstance) {
					stickyInstance.stickyFlag = false;
					stickyInstance.stickyOn();
					totalHeight += $box.outerHeight();
					stickyInstance.onResize();
				} else {
					totalHeight += $box.css('position') === 'fixed' ? $box.outerHeight() : 0;
				}
			});
			return totalHeight;
		}
	});
	new SmoothScroll({
		anchorLinks: 'a[href^="#sunwifi-anchor"]:not([href="#"])',
		extraOffset: 0,
		activeClasses: 'link',
		wheelBehavior: 'none',
		extraOffset: function() {
			var totalHeight = 0;
			jQuery('#header, .add-nav-2').each(function() {
				var $box = jQuery(this);
				var stickyInstance = $box.data('StickyScrollBlock');
				if (stickyInstance) {
					stickyInstance.stickyFlag = false;
					stickyInstance.stickyOn();
					totalHeight += $box.outerHeight();
					stickyInstance.onResize();
				} else {
					totalHeight += $box.css('position') === 'fixed' ? $box.outerHeight() : 0;
				}
			});
			return totalHeight;
		}
	});
}

function initRetinaCover() {
	jQuery('.bg-stretch').retinaCover();
}

// initialize custom form elements
function initCustomForms() {
	jcf.setOptions('Select', {
		maxVisibleItems: 10,
		wrapNative: false,
		wrapNativeOnMobile: false,
	});
	jcf.replaceAll();
}

// ==================================================
// fancyBox v3.0.30
//
// Licensed GPLv3 for open source use
// or fancyBox Commercial License for commercial use
//
// http://fancyapps.com/fancybox/
// Copyright 2017 fancyApps
//
// ==================================================
!function(t,e,n,o){"use strict";function s(t){var e=t.currentTarget,o=t.data?t.data.options:{},s=t.data?t.data.items:[],i="",a=0;t.preventDefault(),t.stopPropagation(),n(e).attr("data-fancybox")&&(i=n(e).data("fancybox")),i?(s=s.length?s.filter('[data-fancybox="'+i+'"]'):n("[data-fancybox="+i+"]"),a=s.index(e)):s=[e],n.fancybox.open(s,o,a)}if(!n)return o;var i={speed:330,loop:!0,opacity:"auto",margin:[44,0],gutter:30,infobar:!0,buttons:!0,slideShow:!0,fullScreen:!0,thumbs:!0,closeBtn:!0,smallBtn:"auto",image:{preload:"auto",protect:!1},ajax:{settings:{data:{fancybox:!0}}},iframe:{tpl:'<iframe id="fancybox-frame{rnd}" name="fancybox-frame{rnd}" class="fancybox-iframe" frameborder="0" vspace="0" hspace="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen allowtransparency="true" src=""></iframe>',preload:!0,scrolling:"no",css:{}},baseClass:"",slideClass:"",baseTpl:'<div class="fancybox-container" role="dialog" tabindex="-1"><div class="fancybox-bg"></div><div class="fancybox-controls"><div class="fancybox-infobar"><button data-fancybox-previous class="fancybox-button fancybox-button--left" title="Previous"></button><div class="fancybox-infobar__body"><span class="js-fancybox-index"></span>&nbsp;/&nbsp;<span class="js-fancybox-count"></span></div><button data-fancybox-next class="fancybox-button fancybox-button--right" title="Next"></button></div><div class="fancybox-buttons"><button data-fancybox-close class="fancybox-button fancybox-button--close" title="Close (Esc)"></button></div></div><div class="fancybox-slider-wrap"><div class="fancybox-slider"></div></div><div class="fancybox-caption-wrap"><div class="fancybox-caption"></div></div></div>',spinnerTpl:'<div class="fancybox-loading"></div>',errorTpl:'<div class="fancybox-error"><p>The requested content cannot be loaded. <br /> Please try again later.<p></div>',closeTpl:'<button data-fancybox-close class="fancybox-close-small">×</button>',parentEl:"body",touch:!0,keyboard:!0,focus:!0,closeClickOutside:!0,beforeLoad:n.noop,afterLoad:n.noop,beforeMove:n.noop,afterMove:n.noop,onComplete:n.noop,onInit:n.noop,beforeClose:n.noop,afterClose:n.noop,onActivate:n.noop,onDeactivate:n.noop},a=n(t),r=n(e),c=0,l=function(t){return t&&t.hasOwnProperty&&t instanceof n},u=function(){return t.requestAnimationFrame||t.webkitRequestAnimationFrame||t.mozRequestAnimationFrame||function(e){t.setTimeout(e,1e3/60)}}(),d=function(o){var s;return"function"==typeof n&&o instanceof n&&(o=o[0]),s=o.getBoundingClientRect(),s.bottom>0&&s.right>0&&s.left<(t.innerWidth||e.documentElement.clientWidth)&&s.top<(t.innerHeight||e.documentElement.clientHeight)},p=function(t,o,s){var a=this;a.opts=n.extend(!0,{index:s},i,o||{}),a.id=a.opts.id||++c,a.group=[],a.currIndex=parseInt(a.opts.index,10)||0,a.prevIndex=null,a.prevPos=null,a.currPos=0,a.firstRun=null,a.createGroup(t),a.group.length&&(a.$lastFocus=n(e.activeElement).blur(),a.elems={},a.slides={},a.init(t))};n.extend(p.prototype,{init:function(){var t,e,o=this;o.scrollTop=a.scrollTop(),o.scrollLeft=a.scrollLeft(),n.fancybox.isTouch||n("html").hasClass("fancybox-enabled")||(t=n("body").width(),n("html").addClass("fancybox-enabled"),t=n("body").width()-t,t>1&&n('<style id="fancybox-noscroll" type="text/css">').html(".compensate-for-scrollbar, .fancybox-enabled body { margin-right: "+t+"px; }").appendTo("head")),e=n(o.opts.baseTpl).attr("id","fancybox-container-"+o.id).data("FancyBox",o).addClass(o.opts.baseClass).hide().prependTo(o.opts.parentEl),o.$refs={container:e,bg:e.find(".fancybox-bg"),controls:e.find(".fancybox-controls"),buttons:e.find(".fancybox-buttons"),slider_wrap:e.find(".fancybox-slider-wrap"),slider:e.find(".fancybox-slider"),caption:e.find(".fancybox-caption")},o.trigger("onInit"),o.activate(),o.current||o.jumpTo(o.currIndex)},createGroup:function(t){var e=this,s=n.makeArray(t);n.each(s,function(t,s){var i,a,r,c,l={},u={},d=[];n.isPlainObject(s)?(l=s,u=s.opts||{}):"object"===n.type(s)&&n(s).length?(i=n(s),d=i.data(),u="options"in d?d.options:{},u="object"===n.type(u)?u:{},l.type="type"in d?d.type:u.type,l.src="src"in d?d.src:u.src||i.attr("href"),u.width="width"in d?d.width:u.width,u.height="height"in d?d.height:u.height,u.thumb="thumb"in d?d.thumb:u.thumb,u.selector="selector"in d?d.selector:u.selector,"srcset"in d&&(u.image={srcset:d.srcset}),u.$orig=i):l={type:"html",content:s+""},l.opts=n.extend(!0,{},e.opts,u),a=l.type,r=l.src||"",a||(l.content?a="html":r.match(/(^data:image\/[a-z0-9+\/=]*,)|(\.(jp(e|g|eg)|gif|png|bmp|webp|svg|ico)((\?|#).*)?$)/i)?a="image":r.match(/\.(pdf)((\?|#).*)?$/i)?a="pdf":"#"===r.charAt(0)&&(a="inline"),l.type=a),l.index=e.group.length,l.opts.$orig&&!l.opts.$orig.length&&delete l.opts.$orig,!l.opts.$thumb&&l.opts.$orig&&(l.opts.$thumb=l.opts.$orig.find("img:first")),l.opts.$thumb&&!l.opts.$thumb.length&&delete l.opts.$thumb,"function"===n.type(l.opts.caption)?l.opts.caption=l.opts.caption.apply(s,[e,l]):"caption"in d?l.opts.caption=d.caption:u.$orig&&(l.opts.caption=i.attr("title")),l.opts.caption=l.opts.caption===o?"":l.opts.caption+"","ajax"===a&&(c=r.split(/\s+/,2),c.length>1&&(l.src=c.shift(),l.opts.selector=c.shift())),"auto"==l.opts.smallBtn&&(n.inArray(a,["html","inline","ajax"])>-1?(l.opts.buttons=!1,l.opts.smallBtn=!0):l.opts.smallBtn=!1),"pdf"===a&&(l.type="iframe",l.opts.closeBtn=!0,l.opts.smallBtn=!1,l.opts.iframe.preload=!1),l.opts.modal&&n.extend(!0,l.opts,{infobar:0,buttons:0,keyboard:0,slideShow:0,fullScreen:0,closeClickOutside:0}),e.group.push(l)})},addEvents:function(){var o=this,s=function(){a.scrollTop(o.scrollTop).scrollLeft(o.scrollLeft),o.$refs.slider_wrap.show(),o.update()};o.removeEvents(),o.$refs.container.on("click.fb-close","[data-fancybox-close]",function(t){t.stopPropagation(),t.preventDefault(),o.close(t)}).on("click.fb-previous","[data-fancybox-previous]",function(t){t.stopPropagation(),t.preventDefault(),o.previous()}).on("click.fb-next","[data-fancybox-next]",function(t){t.stopPropagation(),t.preventDefault(),o.next()}),n(t).on("orientationchange.fb resize.fb",function(t){u(function(){t&&t.originalEvent&&"orientationchange"==t.originalEvent.type?(o.$refs.slider_wrap.hide(),u(s)):s()})}),r.on("focusin.fb",function(t){var e;n.fancybox&&(e=n.fancybox.getInstance(),!e||n(t.target).hasClass("fancybox-container")||n.contains(e.$refs.container[0],t.target)||(t.stopPropagation(),e.focus()))}),n(e).on("keydown.fb",function(t){var e=o.current,s=t.keyCode||t.which;if(e&&e.opts.keyboard&&!n(t.target).is("input")&&!n(t.target).is("textarea")){if(8===s||27===s)return t.preventDefault(),void o.close();switch(s){case 37:case 38:t.preventDefault(),o.previous();break;case 39:case 40:t.preventDefault(),o.next();break;case 80:case 32:t.preventDefault(),o.SlideShow&&(t.preventDefault(),o.SlideShow.toggle());break;case 70:o.FullScreen&&(t.preventDefault(),o.FullScreen.toggle());break;case 71:o.Thumbs&&(t.preventDefault(),o.Thumbs.toggle())}}})},removeEvents:function(){a.off("scroll.fb resize.fb orientationchange.fb"),r.off("keydown.fb focusin.fb click.fb-close"),this.$refs.container.off("click.fb-close click.fb-previous click.fb-next")},previous:function(t){this.jumpTo(this.currIndex-1,t)},next:function(t){this.jumpTo(this.currIndex+1,t)},jumpTo:function(t,e){var n,s,i,a,r=this;if(n=r.firstRun=null===r.firstRun,s=i=t=parseInt(t,10),a=!!r.current&&r.current.opts.loop,!r.isAnimating&&(s!=r.currIndex||n)){if(r.group.length>1&&a)s%=r.group.length,s=s<0?r.group.length+s:s,2==r.group.length?i=t-r.currIndex+r.currPos:(i=s-r.currIndex+r.currPos,Math.abs(r.currPos-(i+r.group.length))<Math.abs(r.currPos-i)?i+=r.group.length:Math.abs(r.currPos-(i-r.group.length))<Math.abs(r.currPos-i)&&(i-=r.group.length));else if(!r.group[s])return void r.update(!1,!1,e);r.current&&(r.current.$slide.removeClass("fancybox-slide--current fancybox-slide--complete"),r.updateSlide(r.current,!0)),r.prevIndex=r.currIndex,r.prevPos=r.currPos,r.currIndex=s,r.currPos=i,r.current=r.createSlide(i),r.group.length>1&&((r.opts.loop||i-1>=0)&&r.createSlide(i-1),(r.opts.loop||i+1<r.group.length)&&r.createSlide(i+1)),r.current.isMoved=!1,r.current.isComplete=!1,e=parseInt(e===o?1.5*r.current.opts.speed:e,10),r.trigger("beforeMove"),r.updateControls(),n&&(r.current.$slide.addClass("fancybox-slide--current"),r.$refs.container.show(),u(function(){r.$refs.bg.css("transition-duration",r.current.opts.speed+"ms"),r.$refs.container.addClass("fancybox-container--ready")})),r.update(!0,!1,n?0:e,function(){r.afterMove()}),r.loadSlide(r.current),n&&r.current.$ghost||r.preload()}},createSlide:function(t){var e,o,s,i=this;if(o=t%i.group.length,o=o<0?i.group.length+o:o,!i.slides[t]&&i.group[o]){if(i.opts.loop&&i.group.length>2)for(var a in i.slides)if(i.slides[a].index===o)return s=i.slides[a],s.pos=t,i.slides[t]=s,delete i.slides[a],i.updateSlide(s),s;e=n('<div class="fancybox-slide"></div>').appendTo(i.$refs.slider),i.slides[t]=n.extend(!0,{},i.group[o],{pos:t,$slide:e,isMoved:!1,isLoaded:!1})}return i.slides[t]},zoomInOut:function(t,e,o){var s,i,a,r=this,c=r.current,l=c.$placeholder,p=c.opts.opacity,h=c.opts.$thumb,f=h?h.offset():0,g=c.$slide.offset();return!!(l&&c.isMoved&&f&&d(h))&&(!("In"===t&&!r.firstRun)&&(n.fancybox.stop(l),r.isAnimating=!0,s={top:f.top-g.top+parseFloat(h.css("border-top-width")||0),left:f.left-g.left+parseFloat(h.css("border-left-width")||0),width:h.width(),height:h.height(),scaleX:1,scaleY:1},"auto"==p&&(p=Math.abs(c.width/c.height-s.width/s.height)>.1),"In"===t?(i=s,a=r.getFitPos(c),a.scaleX=a.width/i.width,a.scaleY=a.height/i.height,p&&(i.opacity=.1,a.opacity=1)):(i=n.fancybox.getTranslate(l),a=s,c.$ghost&&(c.$ghost.show(),c.$image&&c.$image.remove()),i.scaleX=i.width/a.width,i.scaleY=i.height/a.height,i.width=a.width,i.height=a.height,p&&(a.opacity=0)),r.updateCursor(a.width,a.height),delete a.width,delete a.height,n.fancybox.setTranslate(l,i),l.show(),r.trigger("beforeZoom"+t),u(function(){l.css("transition","all "+e+"ms"),n.fancybox.setTranslate(l,a),setTimeout(function(){u(function(){var e;l.css("transition","none"),e=n.fancybox.getTranslate(l),e.scaleX=1,e.scaleY=1,n.fancybox.setTranslate(l,e),r.trigger("afterZoom"+t),o.apply(r),r.isAnimating=!1})},e)}),!0))},canPan:function(){var t=this,e=t.current,n=e.$placeholder,o=!1;return n&&(o=t.getFitPos(e),o=Math.abs(n.width()-o.width)>1||Math.abs(n.height()-o.height)>1),o},isScaledDown:function(){var t=this,e=t.current,o=e.$placeholder,s=!1;return o&&(s=n.fancybox.getTranslate(o),s=s.width<e.width||s.height<e.height),s},scaleToActual:function(t,e,s){var i,a,r,c,l,u=this,d=u.current,p=d.$placeholder,h=parseInt(d.$slide.width(),10),f=parseInt(d.$slide.height(),10),g=d.width,b=d.height;p&&(u.isAnimating=!0,t=t===o?.5*h:t,e=e===o?.5*f:e,i=n.fancybox.getTranslate(p),c=g/i.width,l=b/i.height,a=.5*h-.5*g,r=.5*f-.5*b,g>h&&(a=i.left*c-(t*c-t),a>0&&(a=0),a<h-g&&(a=h-g)),b>f&&(r=i.top*l-(e*l-e),r>0&&(r=0),r<f-b&&(r=f-b)),u.updateCursor(g,b),n.fancybox.animate(p,null,{top:r,left:a,scaleX:c,scaleY:l},s||d.opts.speed,function(){u.isAnimating=!1}))},scaleToFit:function(t){var e,o=this,s=o.current,i=s.$placeholder;i&&(o.isAnimating=!0,e=o.getFitPos(s),o.updateCursor(e.width,e.height),n.fancybox.animate(i,null,{top:e.top,left:e.left,scaleX:e.width/i.width(),scaleY:e.height/i.height()},t||s.opts.speed,function(){o.isAnimating=!1}))},getFitPos:function(t){var e,o,s,i,r,c,l,u=t.$placeholder||t.$content,d=t.width,p=t.height,h=t.opts.margin;return!(!u||!u.length||!d&&!p)&&("number"===n.type(h)&&(h=[h,h]),2==h.length&&(h=[h[0],h[1],h[0],h[1]]),a.width()<800&&(h=[0,0,0,0]),e=parseInt(t.$slide.width(),10)-(h[1]+h[3]),o=parseInt(t.$slide.height(),10)-(h[0]+h[2]),s=Math.min(1,e/d,o/p),c=Math.floor(s*d),l=Math.floor(s*p),i=Math.floor(.5*(o-l))+h[0],r=Math.floor(.5*(e-c))+h[3],{top:i,left:r,width:c,height:l})},update:function(t,e,o,s){var i=this,a=i.current.pos*Math.floor(i.current.$slide.width())*-1-i.current.pos*i.current.opts.gutter;i.isAnimating!==!0&&(o=parseInt(o,10)||0,n.fancybox.stop(i.$refs.slider),t===!1?i.updateSlide(i.current,e):n.each(i.slides,function(t,n){i.updateSlide(n,e)}),o?n.fancybox.animate(i.$refs.slider,null,{top:0,left:a},o,function(){i.current.isMoved=!0,"function"===n.type(s)&&s.apply(i)}):(n.fancybox.setTranslate(i.$refs.slider,{top:0,left:a}),i.current.isMoved=!0,"function"===n.type(s)&&s.apply(i)))},updateSlide:function(t,e){var o,s=this,i=t.$placeholder;t=t||s.current,t&&!s.isClosing&&(o=t.pos*Math.floor(t.$slide.width())+t.pos*t.opts.gutter,o!==t.leftPos&&(n.fancybox.setTranslate(t.$slide,{top:0,left:o}),t.leftPos=o),e!==!1&&i&&(n.fancybox.setTranslate(i,s.getFitPos(t)),t.pos===s.currPos&&s.updateCursor()),t.$slide.trigger("refresh"),s.trigger("onUpdate",t))},updateCursor:function(t,e){var n,s=this,i=s.$refs.container.removeClass("fancybox-controls--canzoomIn fancybox-controls--canzoomOut fancybox-controls--canGrab");!s.isClosing&&s.opts.touch&&(n=t!==o&&e!==o?t<s.current.width&&e<s.current.height:s.isScaledDown(),n?i.addClass("fancybox-controls--canzoomIn"):s.group.length<2?i.addClass("fancybox-controls--canzoomOut"):i.addClass("fancybox-controls--canGrab"))},loadSlide:function(t){var e,o,s,i=this;if(t&&!t.isLoaded&&!t.isLoading){switch(t.isLoading=!0,i.trigger("beforeLoad",t),e=t.type,o=t.$slide,o.off("refresh").trigger("onReset").addClass("fancybox-slide--"+(e||"unknown")).addClass(t.opts.slideClass),e){case"image":i.setImage(t);break;case"iframe":i.setIframe(t);break;case"html":i.setContent(t,t.content);break;case"inline":n(t.src).length?i.setContent(t,n(t.src)):i.setError(t);break;case"ajax":i.showLoading(t),s=n.ajax(n.extend({},t.opts.ajax.settings,{url:t.src,success:function(e,n){"success"===n&&i.setContent(t,e)},error:function(e,n){e&&"abort"!==n&&i.setError(t)}})),o.one("onReset",function(){s.abort()});break;default:i.setError(t)}return!0}},setImage:function(e){var o,s,i,a,r=this,c=e.opts.image.srcset;if(e.isLoaded&&!e.hasError)return void r.afterLoad(e);if(c){i=t.devicePixelRatio||1,a=t.innerWidth*i,s=c.split(",").map(function(t){var e={};return t.trim().split(/\s+/).forEach(function(t,n){var o=parseInt(t.substring(0,t.length-1),10);return 0===n?e.url=t:void(o&&(e.value=o,e.postfix=t[t.length-1]))}),e}),s.sort(function(t,e){return t.value-e.value});for(var l=0;l<s.length;l++){var u=s[l];if("w"===u.postfix&&u.value>=a||"x"===u.postfix&&u.value>=i){o=u;break}}!o&&s.length&&(o=s[s.length-1]),o&&(e.src=o.url,e.width&&e.height&&"w"==o.postfix&&(e.height=e.width/e.height*o.value,e.width=o.value))}e.$placeholder=n('<div class="fancybox-placeholder"></div>').hide().appendTo(e.$slide),e.opts.preload!==!1&&e.opts.width&&e.opts.height&&(e.opts.thumb||e.opts.$thumb)?(e.width=e.opts.width,e.height=e.opts.height,e.$ghost=n("<img />").one("load error",function(){r.isClosing||(n("<img/>")[0].src=e.src,r.revealImage(e,function(){r.setBigImage(e),r.firstRun&&e.index===r.currIndex&&r.preload()}))}).addClass("fancybox-image").appendTo(e.$placeholder).attr("src",e.opts.thumb||e.opts.$thumb.attr("src"))):r.setBigImage(e)},setBigImage:function(t){var e=this,o=n("<img />");t.$image=o.one("error",function(){e.setError(t)}).one("load",function(){clearTimeout(t.timouts),t.timouts=null,e.isClosing||(t.width=this.naturalWidth,t.height=this.naturalHeight,t.opts.image.srcset&&o.attr("sizes","100vw").attr("srcset",t.opts.image.srcset),e.afterLoad(t),t.$ghost&&(t.timouts=setTimeout(function(){t.$ghost.hide()},350)))}).addClass("fancybox-image").attr("src",t.src).appendTo(t.$placeholder),o[0].complete?o.trigger("load"):o[0].error?o.trigger("error"):t.timouts=setTimeout(function(){o[0].complete||t.hasError||e.showLoading(t)},150),t.opts.image.protect&&n('<div class="fancybox-spaceball"></div>').appendTo(t.$placeholder).on("contextmenu.fb",function(t){return 2==t.button&&t.preventDefault(),!0})},revealImage:function(t,e){var o=this;return e=e||n.noop,"image"!==t.type||t.hasError||t.isRevealed===!0?void e.apply(o):(t.isRevealed=!0,void(t.pos===o.currPos&&o.zoomInOut("In",t.opts.speed,e)||(t.$ghost&&!t.isLoaded&&o.updateSlide(t,!0),t.pos===o.currPos?n.fancybox.animate(t.$placeholder,{opacity:0},{opacity:1},300,e):t.$placeholder.show(),e.apply(o))))},setIframe:function(t){var e,s=this,i=t.opts.iframe,a=t.$slide;t.$content=n('<div class="fancybox-content"></div>').css(i.css).appendTo(a),e=n(i.tpl.replace(/\{rnd\}/g,(new Date).getTime())).attr("scrolling",n.fancybox.isTouch?"auto":i.scrolling).appendTo(t.$content),i.preload?(t.$content.addClass("fancybox-tmp"),s.showLoading(t),e.on("load.fb error.fb",function(e){this.isReady=1,t.$slide.trigger("refresh"),s.afterLoad(t)}),a.on("refresh.fb",function(){var n,s,a,r,c,l=t.$content;if(1===e[0].isReady){try{n=e.contents(),s=n.find("body")}catch(t){}s&&s.length&&(i.css.width===o||i.css.height===o)&&(a=e[0].contentWindow.document.documentElement.scrollWidth,r=Math.ceil(s.outerWidth(!0)+(l.width()-a)),c=Math.ceil(s.outerHeight(!0)),l.css({width:i.css.width===o?r+(l.outerWidth()-l.innerWidth()):i.css.width,height:i.css.height===o?c+(l.outerHeight()-l.innerHeight()):i.css.height})),l.removeClass("fancybox-tmp")}})):this.afterLoad(t),e.attr("src",t.src),t.opts.smallBtn&&t.$content.prepend(t.opts.closeTpl),a.one("onReset",function(){try{n(this).find("iframe").hide().attr("src","//about:blank")}catch(t){}n(this).empty(),t.isLoaded=!1})},setContent:function(t,e){var o=this;o.isClosing||(o.hideLoading(t),t.$slide.empty(),l(e)&&e.parent().length?(e.data("placeholder")&&e.parents(".fancybox-slide").trigger("onReset"),e.data({placeholder:n("<div></div>").hide().insertAfter(e)}).css("display","inline-block")):("string"===n.type(e)&&(e=n("<div>").append(e).contents(),3===e[0].nodeType&&(e=n("<div>").html(e))),t.opts.selector&&(e=n("<div>").html(e).find(t.opts.selector))),t.$slide.one("onReset",function(){var o=l(e)?e.data("placeholder"):0;o&&(e.hide().replaceAll(o),e.data("placeholder",null)),t.hasError||(n(this).empty(),t.isLoaded=!1)}),t.$content=n(e).appendTo(t.$slide),t.opts.smallBtn===!0&&t.$content.find(".fancybox-close-small").remove().end().eq(0).append(t.opts.closeTpl),this.afterLoad(t))},setError:function(t){t.hasError=!0,this.setContent(t,t.opts.errorTpl)},showLoading:function(t){var e=this;t=t||e.current,t&&!t.$spinner&&(t.$spinner=n(e.opts.spinnerTpl).appendTo(t.$slide))},hideLoading:function(t){var e=this;t=t||e.current,t&&t.$spinner&&(t.$spinner.remove(),delete t.$spinner)},afterMove:function(){var t=this,e=t.current,o={};e&&(e.$slide.siblings().trigger("onReset"),n.each(t.slides,function(e,n){n.pos>=t.currPos-1&&n.pos<=t.currPos+1?o[n.pos]=n:n&&n.$slide.remove()}),t.slides=o,t.trigger("afterMove"),e.isLoaded&&t.complete())},afterLoad:function(t){var e=this;e.isClosing||(t.isLoading=!1,t.isLoaded=!0,e.trigger("afterLoad",t),e.hideLoading(t),t.$ghost||e.updateSlide(t,!0),t.index===e.currIndex&&t.isMoved?e.complete():t.$ghost||e.revealImage(t))},complete:function(){var t=this,e=t.current;t.revealImage(e,function(){e.isComplete=!0,e.$slide.addClass("fancybox-slide--complete"),t.updateCursor(),t.trigger("onComplete"),!e.opts.focus||"image"!==e.type&&"iframe"!==e.type||t.focus()})},preload:function(){var t,e,n=this;n.group.length<2||(t=n.slides[n.currPos+1],e=n.slides[n.currPos-1],t&&"image"===t.type&&n.loadSlide(t),e&&"image"===e.type&&n.loadSlide(e))},focus:function(){var t,e=this.current;t=e&&e.isComplete?e.$slide.find('button,:input,[tabindex],a:not(".disabled")').filter(":visible:first"):null,t&&t.length||(t=this.$refs.container),t.focus(),this.$refs.slider_wrap.scrollLeft(0),e&&e.$slide.scrollTop(0)},activate:function(){var t=this;n(".fancybox-container").each(function(){var e=n(this).data("FancyBox");e&&e.uid!==t.uid&&!e.isClosing&&e.trigger("onDeactivate")}),t.current&&(t.$refs.container.index()>0&&t.$refs.container.prependTo(e.body),t.updateControls()),t.trigger("onActivate"),t.addEvents()},close:function(t){var e=this,o=e.current,s=o.opts.speed,i=n.proxy(function(){e.cleanUp(t)},this);return!e.isAnimating&&!e.isClosing&&(e.isClosing=!0,o.timouts&&clearTimeout(o.timouts),t!==!0&&n.fancybox.stop(e.$refs.slider),e.$refs.container.removeClass("fancybox-container--active").addClass("fancybox-container--closing"),o.$slide.removeClass("fancybox-slide--complete").siblings().remove(),o.isMoved||o.$slide.css("overflow","visible"),e.removeEvents(),e.hideLoading(o),e.hideControls(),e.updateCursor(),e.trigger("beforeClose",o,t),e.$refs.bg.css("transition-duration",s+"ms"),this.$refs.container.removeClass("fancybox-container--ready"),void(t===!0?setTimeout(i,s):e.zoomInOut("Out",s,i)||n.fancybox.animate(e.$refs.container,null,{opacity:0},s,"easeInSine",i)))},cleanUp:function(t){var e,o=this;o.$refs.slider.children().trigger("onReset"),o.$refs.container.empty().remove(),o.current=null,o.trigger("afterClose",t),e=n.fancybox.getInstance(),e?e.activate():(n("html").removeClass("fancybox-enabled"),n("#fancybox-noscroll").remove()),o.$lastFocus&&o.$lastFocus.focus(),a.scrollTop(o.scrollTop).scrollLeft(o.scrollLeft)},trigger:function(t,e){var o=Array.prototype.slice.call(arguments,1),s=this,i=e&&e.opts?e:s.current;i?o.unshift(i):i=s,o.unshift(s),n.isFunction(i.opts[t])&&i.opts[t].apply(i,o),s.$refs.container.trigger(t+".fb",o)},toggleControls:function(t){this.isHiddenControls?this.updateControls(t):this.hideControls()},hideControls:function(){this.isHiddenControls=!0,this.$refs.container.removeClass("fancybox-show-controls"),this.$refs.container.removeClass("fancybox-show-caption")},updateControls:function(t){var e=this,o=e.$refs.container,s=e.$refs.caption,i=e.current,a=i.index,r=i.opts,c=r.caption;this.isHiddenControls&&t!==!0||(this.isHiddenControls=!1,e.$refs.container.addClass("fancybox-show-controls"),o.toggleClass("fancybox-show-infobar",!!r.infobar&&e.group.length>1).toggleClass("fancybox-show-buttons",!!r.buttons).toggleClass("fancybox-is-modal",!!r.modal),n(".fancybox-button--left",o).toggleClass("fancybox-button--disabled",!r.loop&&a<=0),n(".fancybox-button--right",o).toggleClass("fancybox-button--disabled",!r.loop&&a>=e.group.length-1),n(".fancybox-button--play",o).toggle(!!(r.slideShow&&e.group.length>1)),n(".fancybox-button--close",o).toggle(!!r.closeBtn),n(".js-fancybox-count",o).html(e.group.length),n(".js-fancybox-index",o).html(a+1),i.$slide.trigger("refresh"),s&&s.empty(),c&&c.length?(s.html(c),this.$refs.container.addClass("fancybox-show-caption "),e.$caption=s):this.$refs.container.removeClass("fancybox-show-caption"))}}),n.fancybox={version:"3.0.30",defaults:i,getInstance:function(t){var e=n('.fancybox-container:not(".fancybox-container--closing"):first').data("FancyBox"),o=Array.prototype.slice.call(arguments,1);return e instanceof p&&("string"===n.type(t)?e[t].apply(e,o):"function"===n.type(t)&&t.apply(e,o),e)},open:function(t,e,n){return new p(t,e,n)},close:function(t){var e=this.getInstance();e&&(e.close(),t===!0&&this.close())},isTouch:e.createTouch!==o&&/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent),use3d:function(){var n=e.createElement("div");return t.getComputedStyle(n).getPropertyValue("transform")&&!(e.documentMode&&e.documentMode<=11)}(),getTranslate:function(t){var e,n;return!(!t||!t.length)&&(e=t.get(0).getBoundingClientRect(),n=t.eq(0).css("transform"),n&&n.indexOf("matrix")!==-1?(n=n.split("(")[1],n=n.split(")")[0],n=n.split(",")):n=[],n.length?(n=n.length>10?[n[13],n[12],n[0],n[5]]:[n[5],n[4],n[0],n[3]],n=n.map(parseFloat)):n=[0,0,1,1],{top:n[0],left:n[1],scaleX:n[2],scaleY:n[3],opacity:parseFloat(t.css("opacity")),width:e.width,height:e.height})},setTranslate:function(t,e){var n="",s={};if(t&&e)return e.left===o&&e.top===o||(n=(e.left===o?t.position().top:e.left)+"px, "+(e.top===o?t.position().top:e.top)+"px",n=this.use3d?"translate3d("+n+", 0px)":"translate("+n+")"),e.scaleX!==o&&e.scaleY!==o&&(n=(n.length?n+" ":"")+"scale("+e.scaleX+", "+e.scaleY+")"),n.length&&(s.transform=n),e.opacity!==o&&(s.opacity=e.opacity),e.width!==o&&(s.width=e.width),e.height!==o&&(s.height=e.height),t.css(s)},easing:{easeOutCubic:function(t,e,n,o){return n*((t=t/o-1)*t*t+1)+e},easeInCubic:function(t,e,n,o){return n*(t/=o)*t*t+e},easeOutSine:function(t,e,n,o){return n*Math.sin(t/o*(Math.PI/2))+e},easeInSine:function(t,e,n,o){return-n*Math.cos(t/o*(Math.PI/2))+n+e}},stop:function(t){t.removeData("animateID")},animate:function(t,e,s,i,a,r){var c,l,d,p=this,h=null,f=0,g=function(n){if(c=[],l=0,t.length&&t.data("animateID")===d){if(n=n||Date.now(),h&&(l=n-h),h=n,f+=l,f>=i)return s.scaleX!==o&&s.scaleY!==o&&e.width!==o&&e.height!==o&&(s.width=e.width*s.scaleX,s.height=e.height*s.scaleY,s.scaleX=1,s.scaleY=1),p.setTranslate(t,s),void r();for(var b in s)s.hasOwnProperty(b)&&e[b]!==o&&(e[b]==s[b]?c[b]=s[b]:c[b]=p.easing[a](f,e[b],s[b]-e[b],i));p.setTranslate(t,c),u(g)}};return p.animateID=d=p.animateID===o?1:p.animateID+1,t.data("animateID",d),r===o&&"function"==n.type(a)&&(r=a,a=o),a||(a="easeOutCubic"),r=r||n.noop,i?(e?this.setTranslate(t,e):e=this.getTranslate(t),t.show(),void u(g)):(this.setTranslate(t,s),void r())}},n.fn.fancybox=function(t){return this.off("click.fb-start").on("click.fb-start",{items:this,options:t||{}},s),this},n(e).on("click.fb-start","[data-fancybox]",s)}(window,document,window.jQuery),function(t){"use strict";var e=function(e,n,o){if(e)return o=o||"","object"===t.type(o)&&(o=t.param(o,!0)),t.each(n,function(t,n){e=e.replace("$"+t,n||"")}),o.length&&(e+=(e.indexOf("?")>0?"&":"?")+o),e},n={youtube:{matcher:/(youtube\.com|youtu\.be|youtube\-nocookie\.com)\/(watch\?(.*&)?v=|v\/|u\/|embed\/?)?(videoseries\?list=(.*)|[\w-]{11}|\?listType=(.*)&list=(.*))(.*)/i,params:{autoplay:1,autohide:1,fs:1,rel:0,hd:1,wmode:"transparent",enablejsapi:1,html5:1},paramPlace:8,type:"iframe",url:"//www.youtube.com/embed/$4",thumb:"//img.youtube.com/vi/$4/hqdefault.jpg"},vimeo:{matcher:/((player\.)?vimeo(pro)?\.com)\/(video\/)?([\d]+)?(\?(.*))?/,params:{autoplay:1,hd:1,show_title:1,show_byline:1,show_portrait:0,fullscreen:1,api:1},paramPlace:7,type:"iframe",url:"//player.vimeo.com/video/$5"},metacafe:{matcher:/metacafe.com\/watch\/(\d+)\/(.*)?/,type:"iframe",url:"//www.metacafe.com/embed/$1/?ap=1"},dailymotion:{matcher:/dailymotion.com\/video\/(.*)\/?(.*)/,params:{additionalInfos:0,autoStart:1},type:"iframe",url:"//www.dailymotion.com/embed/video/$1"},vine:{matcher:/vine.co\/v\/([a-zA-Z0-9\?\=\-]+)/,type:"iframe",url:"//vine.co/v/$1/embed/simple"},instagram:{matcher:/(instagr\.am|instagram\.com)\/p\/([a-zA-Z0-9_\-]+)\/?/i,type:"image",url:"//$1/p/$2/media/?size=l"},google_maps:{matcher:/(maps\.)?google\.([a-z]{2,3}(\.[a-z]{2})?)\/(((maps\/(place\/(.*)\/)?\@(.*),(\d+.?\d+?)z))|(\?ll=))(.*)?/i,type:"iframe",url:function(t){return"//maps.google."+t[2]+"/?ll="+(t[9]?t[9]+"&z="+Math.floor(t[10])+(t[12]?t[12].replace(/^\//,"&"):""):t[12])+"&output="+(t[12]&&t[12].indexOf("layer=c")>0?"svembed":"embed")}}};t(document).on("onInit.fb",function(o,s){t.each(s.group,function(o,s){var i,a,r,c,l,u,d,p=s.src||"",h=!1;s.type||(t.each(n,function(n,o){if(a=p.match(o.matcher),l={},d=n,a){if(h=o.type,o.paramPlace&&a[o.paramPlace]){c=a[o.paramPlace],"?"==c[0]&&(c=c.substring(1)),c=c.split("&");for(var f=0;f<c.length;++f){var g=c[f].split("=",2);2==g.length&&(l[g[0]]=decodeURIComponent(g[1].replace(/\+/g," ")))}}return o.idPlace&&(u=a[o.idPlace]),r=t.extend(!0,{},o.params,s.opts[n],l),p="function"===t.type(o.url)?o.url.call(this,a,r,s):e(o.url,a,r),i="function"===t.type(o.thumb)?o.thumb.call(this,a,r,s):e(o.thumb,a),!1}}),h?(s.src=p,s.type=h,s.opts.thumb||s.opts.$thumb&&s.opts.$thumb.length||(s.opts.thumb=i),u&&(s.opts.id=d+"-"+u),"iframe"===h&&(t.extend(!0,s.opts,{iframe:{preload:!1,scrolling:"no"},smallBtn:!1,closeBtn:!0,fullScreen:!1,slideShow:!1}),s.opts.slideClass+=" fancybox-slide--video")):s.type="iframe")})})}(window.jQuery),function(t,e,n){"use strict";var o=function(){return t.requestAnimationFrame||t.webkitRequestAnimationFrame||t.mozRequestAnimationFrame||function(e){t.setTimeout(e,1e3/60)}}(),s=function(e){var n=[];e=e.originalEvent||e||t.e,e=e.touches&&e.touches.length?e.touches:e.changedTouches&&e.changedTouches.length?e.changedTouches:[e];for(var o in e)e[o].pageX?n.push({x:e[o].pageX,y:e[o].pageY}):e[o].clientX&&n.push({x:e[o].clientX,y:e[o].clientY});return n},i=function(t,e,n){return e&&t?"x"===n?t.x-e.x:"y"===n?t.y-e.y:Math.sqrt(Math.pow(t.x-e.x,2)+Math.pow(t.y-e.y,2)):0},a=function(t){return t.is("a")||t.is("button")||t.is("input")||t.is("select")||t.is("textarea")||n.isFunction(t.get(0).onclick)},r=function(e){var n=t.getComputedStyle(e)["overflow-y"],o=t.getComputedStyle(e)["overflow-x"],s=("scroll"===n||"auto"===n)&&e.scrollHeight>e.clientHeight,i=("scroll"===o||"auto"===o)&&e.scrollWidth>e.clientWidth;return s||i},c=function(t){for(var e=!1;;){if(e=r(t.get(0)))break;if(t=t.parent(),!t.length||t.hasClass("fancybox-slider")||t.is("body"))break}return e},l=function(t){var e=this;e.instance=t,e.$wrap=t.$refs.slider_wrap,e.$slider=t.$refs.slider,e.$container=t.$refs.container,e.destroy(),e.$wrap.on("touchstart.fb mousedown.fb",n.proxy(e,"ontouchstart"))};l.prototype.destroy=function(){this.$wrap.off("touchstart.fb mousedown.fb touchmove.fb mousemove.fb touchend.fb touchcancel.fb mouseup.fb mouseleave.fb")},l.prototype.ontouchstart=function(e){var o=this,r=n(e.target),l=o.instance,u=l.current,d=u.$content||u.$placeholder;return o.startPoints=s(e),o.$target=r,o.$content=d,u.opts.touch?void(a(r)||a(r.parent())||c(r)&&!r.hasClass("fancybox-slide")||(e.stopPropagation(),e.preventDefault(),!u||o.instance.isAnimating||o.instance.isClosing||!o.startPoints||o.startPoints.length>1&&!u.isMoved||(o.$wrap.off("touchmove.fb mousemove.fb",n.proxy(o,"ontouchmove")),o.$wrap.off("touchend.fb touchcancel.fb mouseup.fb mouseleave.fb",n.proxy(o,"ontouchend")),o.$wrap.on("touchend.fb touchcancel.fb mouseup.fb mouseleave.fb",n.proxy(o,"ontouchend")),o.$wrap.on("touchmove.fb mousemove.fb",n.proxy(o,"ontouchmove")),o.startTime=(new Date).getTime(),o.distanceX=o.distanceY=o.distance=0,o.canvasWidth=Math.round(u.$slide.width()),o.canvasHeight=Math.round(u.$slide.height()),o.canTap=!1,o.isPanning=!1,o.isSwiping=!1,o.isZooming=!1,o.sliderStartPos=n.fancybox.getTranslate(o.$slider),o.contentStartPos=n.fancybox.getTranslate(o.$content),o.contentLastPos=null,1!==o.startPoints.length||o.isZooming||(o.canTap=u.isMoved,"image"===u.type&&(o.contentStartPos.width>o.canvasWidth+1||o.contentStartPos.height>o.canvasHeight+1)?(n.fancybox.stop(o.$content),o.isPanning=!0):(n.fancybox.stop(o.$slider),o.isSwiping=!0),o.$container.addClass("fancybox-controls--isGrabbing")),2===o.startPoints.length&&u.isMoved&&!u.hasError&&"image"===u.type&&(u.isLoaded||u.$ghost)&&(o.isZooming=!0,o.isSwiping=!1,o.isPanning=!1,n.fancybox.stop(o.$content),o.centerPointStartX=.5*(o.startPoints[0].x+o.startPoints[1].x)-n(t).scrollLeft(),o.centerPointStartY=.5*(o.startPoints[0].y+o.startPoints[1].y)-n(t).scrollTop(),o.percentageOfImageAtPinchPointX=(o.centerPointStartX-o.contentStartPos.left)/o.contentStartPos.width,o.percentageOfImageAtPinchPointY=(o.centerPointStartY-o.contentStartPos.top)/o.contentStartPos.height,o.startDistanceBetweenFingers=i(o.startPoints[0],o.startPoints[1]))))):(o.endPoints=o.startPoints,o.ontap())},l.prototype.ontouchmove=function(t){var e=this;t.preventDefault(),e.newPoints=s(t),e.newPoints&&e.newPoints.length&&(e.distanceX=i(e.newPoints[0],e.startPoints[0],"x"),e.distanceY=i(e.newPoints[0],e.startPoints[0],"y"),e.distance=i(e.newPoints[0],e.startPoints[0]),e.distance>0&&(e.isSwiping?e.onSwipe():e.isPanning?e.onPan():e.isZooming&&e.onZoom()))},l.prototype.onSwipe=function(){var e,s=this,i=s.isSwiping,a=s.sliderStartPos.left;i===!0?Math.abs(s.distance)>10&&(s.instance.group.length<2?s.isSwiping="y":!s.instance.current.isMoved||s.instance.opts.touch.vertical===!1||"auto"===s.instance.opts.touch.vertical&&n(t).width()>800?s.isSwiping="x":(e=Math.abs(180*Math.atan2(s.distanceY,s.distanceX)/Math.PI),s.isSwiping=e>45&&e<135?"y":"x"),s.canTap=!1,s.instance.current.isMoved=!1,s.startPoints=s.newPoints):("x"==i&&(!s.instance.current.opts.loop&&0===s.instance.current.index&&s.distanceX>0?a+=Math.pow(s.distanceX,.8):!s.instance.current.opts.loop&&s.instance.current.index===s.instance.group.length-1&&s.distanceX<0?a-=Math.pow(-s.distanceX,.8):a+=s.distanceX),
s.sliderLastPos={top:"x"==i?0:s.sliderStartPos.top+s.distanceY,left:a},o(function(){n.fancybox.setTranslate(s.$slider,s.sliderLastPos)}))},l.prototype.onPan=function(){var t,e,s,i=this;i.canTap=!1,t=i.contentStartPos.width>i.canvasWidth?i.contentStartPos.left+i.distanceX:i.contentStartPos.left,e=i.contentStartPos.top+i.distanceY,s=i.limitMovement(t,e,i.contentStartPos.width,i.contentStartPos.height),s.scaleX=i.contentStartPos.scaleX,s.scaleY=i.contentStartPos.scaleY,i.contentLastPos=s,o(function(){n.fancybox.setTranslate(i.$content,i.contentLastPos)})},l.prototype.limitMovement=function(t,e,n,o){var s,i,a,r,c=this,l=c.canvasWidth,u=c.canvasHeight,d=c.contentStartPos.left,p=c.contentStartPos.top,h=c.distanceX,f=c.distanceY;return s=Math.max(0,.5*l-.5*n),i=Math.max(0,.5*u-.5*o),a=Math.min(l-n,.5*l-.5*n),r=Math.min(u-o,.5*u-.5*o),n>l&&(h>0&&t>s&&(t=s-1+Math.pow(-s+d+h,.8)||0),h<0&&t<a&&(t=a+1-Math.pow(a-d-h,.8)||0)),o>u&&(f>0&&e>i&&(e=i-1+Math.pow(-i+p+f,.8)||0),f<0&&e<r&&(e=r+1-Math.pow(r-p-f,.8)||0)),{top:e,left:t}},l.prototype.limitPosition=function(t,e,n,o){var s=this,i=s.canvasWidth,a=s.canvasHeight;return n>i?(t=t>0?0:t,t=t<i-n?i-n:t):t=Math.max(0,i/2-n/2),o>a?(e=e>0?0:e,e=e<a-o?a-o:e):e=Math.max(0,a/2-o/2),{top:e,left:t}},l.prototype.onZoom=function(){var e=this,s=e.contentStartPos.width,a=e.contentStartPos.height,r=e.contentStartPos.left,c=e.contentStartPos.top,l=i(e.newPoints[0],e.newPoints[1]),u=l/e.startDistanceBetweenFingers,d=Math.floor(s*u),p=Math.floor(a*u),h=(s-d)*e.percentageOfImageAtPinchPointX,f=(a-p)*e.percentageOfImageAtPinchPointY,g=(e.newPoints[0].x+e.newPoints[1].x)/2-n(t).scrollLeft(),b=(e.newPoints[0].y+e.newPoints[1].y)/2-n(t).scrollTop(),m=g-e.centerPointStartX,y=b-e.centerPointStartY,v=r+(h+m),x=c+(f+y),w={top:x,left:v,scaleX:e.contentStartPos.scaleX*u,scaleY:e.contentStartPos.scaleY*u};e.canTap=!1,e.newWidth=d,e.newHeight=p,e.contentLastPos=w,o(function(){n.fancybox.setTranslate(e.$content,e.contentLastPos)})},l.prototype.ontouchend=function(t){var e=this,o=e.instance.current,i=Math.max((new Date).getTime()-e.startTime,1),a=e.isSwiping,r=e.isPanning,c=e.isZooming;return e.endPoints=s(t),e.$container.removeClass("fancybox-controls--isGrabbing"),e.$wrap.off("touchmove.fb mousemove.fb",n.proxy(this,"ontouchmove")),e.$wrap.off("touchend.fb touchcancel.fb mouseup.fb mouseleave.fb",n.proxy(this,"ontouchend")),e.isSwiping=!1,e.isPanning=!1,e.isZooming=!1,e.canTap?e.ontap():(e.velocityX=e.distanceX/i*.5,e.velocityY=e.distanceY/i*.5,e.speed=o.opts.speed,e.speedX=Math.max(.75*e.speed,Math.min(1.5*e.speed,1/Math.abs(e.velocityX)*e.speed)),e.speedY=Math.max(.75*e.speed,Math.min(1.5*e.speed,1/Math.abs(e.velocityY)*e.speed)),void(r?e.endPanning():c?e.endZooming():e.endSwiping(a)))},l.prototype.endSwiping=function(t){var e=this;"y"==t&&Math.abs(e.distanceY)>50?(n.fancybox.animate(e.$slider,null,{top:e.sliderStartPos.top+e.distanceY+150*e.velocityY,left:e.sliderStartPos.left,opacity:0},e.speedY),e.instance.close(!0)):"x"==t&&e.distanceX>50?e.instance.previous(e.speedX):"x"==t&&e.distanceX<-50?e.instance.next(e.speedX):e.instance.update(!1,!0,Math.abs(e.distance)*e.speed/50)},l.prototype.endPanning=function(){var t,e,o,s=this;s.contentLastPos&&(t=s.contentLastPos.left+s.velocityX*s.speed*2,e=s.contentLastPos.top+s.velocityY*s.speed*2,o=s.limitPosition(t,e,s.contentStartPos.width,s.contentStartPos.height),o.width=s.contentStartPos.width,o.height=s.contentStartPos.height,n.fancybox.animate(s.$content,null,o,s.speed,"easeOutSine"))},l.prototype.endZooming=function(){var t,e,o,s,i=this,a=i.instance.current,r=i.newWidth,c=i.newHeight;i.contentLastPos&&(t=i.contentLastPos.left,e=i.contentLastPos.top,s={top:e,left:t,width:r,height:c,scaleX:1,scaleY:1},n.fancybox.setTranslate(i.$content,s),r<i.canvasWidth&&c<i.canvasHeight?i.instance.scaleToFit(150):r>a.width||c>a.height?i.instance.scaleToActual(i.centerPointStartX,i.centerPointStartY,150):(o=i.limitPosition(t,e,r,c),n.fancybox.animate(i.$content,null,o,i.speed,"easeOutSine")))},l.prototype.ontap=function(){var t=this,e=t.instance,o=e.current,s=t.endPoints[0].x,i=t.endPoints[0].y;if(s-=t.$wrap.offset().left,i-=t.$wrap.offset().top,!n.fancybox.isTouch)return o.opts.closeClickOutside&&t.$target.is(".fancybox-slide")?void e.close():void("image"==o.type&&o.isMoved&&(e.canPan()?e.scaleToFit():e.isScaledDown()?e.scaleToActual(s,i):e.group.length<2&&e.close()));if(t.tapped){if(clearTimeout(t.tapped),t.tapped=null,Math.abs(s-t.x)>50||Math.abs(i-t.y)>50||!o.isMoved)return this;"image"==o.type&&(o.isLoaded||o.$ghost)&&(e.canPan()?e.scaleToFit():e.isScaledDown()&&e.scaleToActual(s,i))}else t.x=s,t.y=i,t.tapped=setTimeout(function(){t.tapped=null,e.toggleControls(!0)},300);return this},n(e).on("onActivate.fb",function(t,e){e.Guestures||(e.Guestures=new l(e))}),n(e).on("beforeClose.fb",function(t,e){e.Guestures&&e.Guestures.destroy()})}(window,document,window.jQuery),function(t,e){"use strict";var n=function(t){this.instance=t,this.init()};e.extend(n.prototype,{timer:null,isActive:!1,$button:null,speed:3e3,init:function(){var t=this;t.$button=e('<button data-fancybox-play class="fancybox-button fancybox-button--play" title="Slideshow (P)"></button>').appendTo(t.instance.$refs.buttons),t.instance.$refs.container.on("click","[data-fancybox-play]",function(){t.toggle()})},set:function(){var t=this;t.instance&&t.instance.current&&(t.instance.current.opts.loop||t.instance.currIndex<t.instance.group.length-1)?t.timer=setTimeout(function(){t.instance.next()},t.instance.current.opts.slideShow.speed||t.speed):t.stop()},clear:function(){var t=this;clearTimeout(t.timer),t.timer=null},start:function(){var t=this;t.stop(),t.instance&&t.instance.current&&(t.instance.current.opts.loop||t.instance.currIndex<t.instance.group.length-1)&&(t.instance.$refs.container.on({"beforeLoad.fb.player":e.proxy(t,"clear"),"onComplete.fb.player":e.proxy(t,"set")}),t.isActive=!0,t.instance.current.isComplete&&t.set(),t.instance.$refs.container.trigger("onPlayStart"),t.$button.addClass("fancybox-button--pause"))},stop:function(){var t=this;t.clear(),t.instance.$refs.container.trigger("onPlayEnd").off(".player"),t.$button.removeClass("fancybox-button--pause"),t.isActive=!1},toggle:function(){var t=this;t.isActive?t.stop():t.start()}}),e(t).on("onInit.fb",function(t,e){e.opts.slideShow&&!e.SlideShow&&e.group.length>1&&(e.SlideShow=new n(e))}),e(t).on("beforeClose.fb onDeactivate.fb",function(t,e){e.SlideShow&&e.SlideShow.stop()})}(document,window.jQuery),function(t,e){"use strict";var n=function(t){this.instance=t,this.init()};e.extend(n.prototype,{$button:null,init:function(){var n=this;n.isAvailable()&&(n.$button=e('<button data-fancybox-fullscreen class="fancybox-button fancybox-button--fullscreen" title="Full screen (F)"></button>').appendTo(n.instance.$refs.buttons),n.instance.$refs.container.on("click.fb-fullscreen","[data-fancybox-fullscreen]",function(t){t.stopPropagation(),t.preventDefault(),n.toggle()}),e(t).on("onUpdate.fb",function(t,e){n.$button.toggle(!!e.current.opts.fullScreen),n.$button.toggleClass("fancybox-button-shrink",n.isActivated())}),e(t).on("afterClose.fb",function(){n.exit()}))},isAvailable:function(){var t=this.instance.$refs.container.get(0);return!!(t.requestFullscreen||t.msRequestFullscreen||t.mozRequestFullScreen||t.webkitRequestFullscreen)},isActivated:function(){return!!(t.fullscreenElement||t.mozFullScreenElement||t.webkitFullscreenElement||t.msFullscreenElement)},launch:function(){var t=this.instance.$refs.container.get(0);t&&!this.instance.isClosing&&(t.requestFullscreen?t.requestFullscreen():t.msRequestFullscreen?t.msRequestFullscreen():t.mozRequestFullScreen?t.mozRequestFullScreen():t.webkitRequestFullscreen&&t.webkitRequestFullscreen(t.ALLOW_KEYBOARD_INPUT))},exit:function(){t.exitFullscreen?t.exitFullscreen():t.msExitFullscreen?t.msExitFullscreen():t.mozCancelFullScreen?t.mozCancelFullScreen():t.webkitExitFullscreen&&t.webkitExitFullscreen()},toggle:function(){this.isActivated()?this.exit():this.isAvailable()&&this.launch()}}),e(t).on("onInit.fb",function(t,e){e.opts.fullScreen&&!e.FullScreen&&(e.FullScreen=new n(e))})}(document,window.jQuery),function(t,e){"use strict";var n=function(t){this.instance=t,this.init()};e.extend(n.prototype,{$button:null,$grid:null,$list:null,isVisible:!1,init:function(){var t=this;t.$button=e('<button data-fancybox-thumbs class="fancybox-button fancybox-button--thumbs" title="Thumbnails (G)"></button>').appendTo(this.instance.$refs.buttons).on("touchend click",function(e){e.stopPropagation(),e.preventDefault(),t.toggle()})},create:function(){var t,n,o=this.instance;this.$grid=e('<div class="fancybox-thumbs"></div>').appendTo(o.$refs.container),t="<ul>",e.each(o.group,function(e,o){n=o.opts.thumb||(o.opts.$thumb?o.opts.$thumb.attr("src"):null),n||"image"!==o.type||(n=o.src),n&&n.length&&(t+='<li data-index="'+e+'"  tabindex="0" class="fancybox-thumbs-loading"><img data-src="'+n+'" /></li>')}),t+="</ul>",this.$list=e(t).appendTo(this.$grid).on("click touchstart","li",function(){o.jumpTo(e(this).data("index"))}),this.$list.find("img").hide().one("load",function(){var t,n,o,s,i=e(this).parent().removeClass("fancybox-thumbs-loading"),a=i.outerWidth(),r=i.outerHeight();t=this.naturalWidth||this.width,n=this.naturalHeight||this.height,o=t/a,s=n/r,o>=1&&s>=1&&(o>s?(t/=s,n=r):(t=a,n/=o)),e(this).css({width:Math.floor(t),height:Math.floor(n),"margin-top":Math.min(0,Math.floor(.3*r-.3*n)),"margin-left":Math.min(0,Math.floor(.5*a-.5*t))}).show()}).each(function(){this.src=e(this).data("src")})},focus:function(){this.instance.current&&this.$list.children().removeClass("fancybox-thumbs-active").filter('[data-index="'+this.instance.current.index+'"]').addClass("fancybox-thumbs-active").focus()},close:function(){this.$grid.hide()},update:function(){this.instance.$refs.container.toggleClass("fancybox-container--thumbs",this.isVisible),this.isVisible?(this.$grid||this.create(),this.$grid.show(),this.focus()):this.$grid&&this.$grid.hide(),this.instance.update()},hide:function(){this.isVisible=!1,this.update()},show:function(){this.isVisible=!0,this.update()},toggle:function(){this.isVisible?this.hide():this.show()}}),e(t).on("onInit.fb",function(t,e){var o=e.group[0],s=e.group[1];e.opts.thumbs&&!e.Thumbs&&e.group.length>1&&("image"==o.type||o.opts.thumb||o.opts.$thumb)&&("image"==s.type||s.opts.thumb||s.opts.$thumb)&&(e.Thumbs=new n(e))}),e(t).on("beforeMove.fb",function(t,e,n){var o=e.Thumbs;o&&(n.modal?(o.$button.hide(),o.hide()):(e.opts.thumbs.showOnStart===!0&&e.firstRun&&o.show(),o.$button.show(),o.isVisible&&o.focus()))}),e(t).on("beforeClose.fb",function(t,e){e.Thumbs&&e.Thumbs.isVisible&&e.opts.thumbs.hideOnClosing!==!1&&e.Thumbs.close(),e.Thumbs=null})}(document,window.jQuery);

/*
 * jQuery sticky box plugin
 */
;(function($, $win) {

	'use strict';

	function StickyScrollBlock($stickyBox, options) {
		this.options = options;
		this.$stickyBox = $stickyBox;
		this.init();
	}

	var StickyScrollBlockPrototype = {
		init: function() {
			this.findElements();
			this.attachEvents();
			this.makeCallback('onInit');
		},

		findElements: function() {
			// find parent container in which will be box move
			this.$container = this.$stickyBox.closest(this.options.container);
			// define box wrap flag
			this.isWrap = this.options.positionType === 'fixed' && this.options.setBoxHeight;
			// define box move flag
			this.moveInContainer = !!this.$container.length;
			// wrapping box to set place in content
			if (this.isWrap) {
				this.$stickyBoxWrap = this.$stickyBox.wrap('<div class="' + this.getWrapClass() + '"/>').parent();
			}
			//define block to add active class
			this.parentForActive = this.getParentForActive();
			this.isInit = true;
		},

		attachEvents: function() {
			var self = this;

			// bind events
			this.onResize = function() {
				if (!self.isInit) return;
				self.resetState();
				self.recalculateOffsets();
				self.checkStickyPermission();
				self.scrollHandler();
			};

			this.onScroll = function() {
				self.scrollHandler();
			};

			// initial handler call
			this.onResize();

			// handle events
			$win.on('load resize orientationchange', this.onResize)
				.on('scroll', this.onScroll);
		},

		defineExtraTop: function() {
			// define box's extra top dimension
			var extraTop;

			if (typeof this.options.extraTop === 'number') {
				extraTop = this.options.extraTop;
			} else if (typeof this.options.extraTop === 'function') {
				extraTop = this.options.extraTop();
			}

			this.extraTop = this.options.positionType === 'absolute' ?
				extraTop :
				Math.min(this.winParams.height - this.data.boxFullHeight, extraTop);
		},

		checkStickyPermission: function() {
			// check the permission to set sticky
			this.isStickyEnabled = this.moveInContainer ?
				this.data.containerOffsetTop + this.data.containerHeight > this.data.boxFullHeight + this.data.boxOffsetTop + this.options.extraBottom :
				true;
		},

		getParentForActive: function() {
			if (this.isWrap) {
				return this.$stickyBoxWrap;
			}

			if (this.$container.length) {
				return this.$container;
			}

			return this.$stickyBox;
		},

		getWrapClass: function() {
			// get set of container classes
			try {
				return this.$stickyBox.attr('class').split(' ').map(function(name) {
					return 'sticky-wrap-' + name;
				}).join(' ');
			} catch (err) {
				return 'sticky-wrap';
			}
		},

		resetState: function() {
			// reset dimensions and state
			this.stickyFlag = false;
			this.$stickyBox.css({
				'-webkit-transition': '',
				'-webkit-transform': '',
				transition: '',
				transform: '',
				position: '',
				width: '',
				left: '',
				top: ''
			}).removeClass(this.options.activeClass);

			if (this.isWrap) {
				this.$stickyBoxWrap.removeClass(this.options.activeClass).removeAttr('style');
			}

			if (this.moveInContainer) {
				this.$container.removeClass(this.options.activeClass);
			}
		},

		recalculateOffsets: function() {
			// define box and container dimensions
			this.winParams = this.getWindowParams();

			this.data = $.extend(
				this.getBoxOffsets(),
				this.getContainerOffsets()
			);

			this.defineExtraTop();
		},

		getBoxOffsets: function() {
			var boxOffset = this.$stickyBox.offset();
			var boxPosition = this.$stickyBox.position();

			return {
				// sticky box offsets
				boxOffsetLeft: boxOffset.left,
				boxOffsetTop: boxOffset.top,
				// sticky box positions
				boxTopPosition: boxPosition.top,
				boxLeftPosition: boxPosition.left,
				// sticky box width/height
				boxFullHeight: this.$stickyBox.outerHeight(true),
				boxHeight: this.$stickyBox.outerHeight(),
				boxWidth: this.$stickyBox.outerWidth()
			};
		},

		getContainerOffsets: function() {
			var containerOffset = this.moveInContainer ? this.$container.offset() : null;

			return containerOffset ? {
				// container offsets
				containerOffsetLeft: containerOffset.left,
				containerOffsetTop: containerOffset.top,
				// container height
				containerHeight: this.$container.outerHeight()
			} : {};
		},

		getWindowParams: function() {
			return {
				height: window.innerHeight || document.documentElement.clientHeight
			};
		},

		makeCallback: function(name) {
			if (typeof this.options[name] === 'function') {
				var args = Array.prototype.slice.call(arguments);
				args.shift();
				this.options[name].apply(this, args);
			}
		},

		destroy: function() {
			this.isInit = false;
			// remove event handlers and styles
			$win.off('load resize orientationchange', this.onResize)
				.off('scroll', this.onScroll);
			this.resetState();
			this.$stickyBox.removeData('StickyScrollBlock');
			if (this.isWrap) {
				this.$stickyBox.unwrap();
			}
			this.makeCallback('onDestroy');
		}
	};

	var stickyMethods = {
		fixed: {
			scrollHandler: function() {
				this.winScrollTop = $win.scrollTop();
				var isActiveSticky = this.winScrollTop -
					(this.options.showAfterScrolled ? this.extraTop : 0) -
					(this.options.showAfterScrolled ? this.data.boxHeight + this.extraTop : 0) >
					this.data.boxOffsetTop - this.extraTop;

				if (isActiveSticky) {
					this.isStickyEnabled && this.stickyOn();
				} else {
					this.stickyOff();
				}
			},

			stickyOn: function() {
				if (!this.stickyFlag) {
					this.stickyFlag = true;
					this.parentForActive.addClass(this.options.activeClass);
					this.$stickyBox.css({
						width: this.data.boxWidth,
						position: this.options.positionType
					});
					if (this.isWrap) {
						this.$stickyBoxWrap.css({
							height: this.data.boxFullHeight
						});
					}
					this.makeCallback('fixedOn');
				}
				this.setDynamicPosition();
			},

			stickyOff: function() {
				if (this.stickyFlag) {
					this.stickyFlag = false;
					this.resetState();
					this.makeCallback('fixedOff');
				}
			},

			setDynamicPosition: function() {
				this.$stickyBox.css({
					top: this.getTopPosition(),
					left: this.data.boxOffsetLeft - $win.scrollLeft()
				});
			},

			getTopPosition: function() {
				if (this.moveInContainer) {
					var currScrollTop = this.winScrollTop + this.data.boxHeight + this.options.extraBottom;

					return Math.min(this.extraTop, (this.data.containerHeight + this.data.containerOffsetTop) - currScrollTop);
				} else {
					return this.extraTop;
				}
			}
		},
		absolute: {
			scrollHandler: function() {
				this.winScrollTop = $win.scrollTop();
				var isActiveSticky = this.winScrollTop > this.data.boxOffsetTop - this.extraTop;

				if (isActiveSticky) {
					this.isStickyEnabled && this.stickyOn();
				} else {
					this.stickyOff();
				}
			},

			stickyOn: function() {
				if (!this.stickyFlag) {
					this.stickyFlag = true;
					this.parentForActive.addClass(this.options.activeClass);
					this.$stickyBox.css({
						width: this.data.boxWidth,
						transition: 'transform ' + this.options.animSpeed + 's ease',
						'-webkit-transition': 'transform ' + this.options.animSpeed + 's ease',
					});

					if (this.isWrap) {
						this.$stickyBoxWrap.css({
							height: this.data.boxFullHeight
						});
					}

					this.makeCallback('fixedOn');
				}

				this.clearTimer();
				this.timer = setTimeout(function() {
					this.setDynamicPosition();
				}.bind(this), this.options.animDelay * 1000);
			},

			stickyOff: function() {
				if (this.stickyFlag) {
					this.clearTimer();
					this.stickyFlag = false;

					this.timer = setTimeout(function() {
						this.setDynamicPosition();
						setTimeout(function() {
							this.resetState();
						}.bind(this), this.options.animSpeed * 1000);
					}.bind(this), this.options.animDelay * 1000);
					this.makeCallback('fixedOff');
				}
			},

			clearTimer: function() {
				clearTimeout(this.timer);
			},

			setDynamicPosition: function() {
				var topPosition = Math.max(0, this.getTopPosition());

				this.$stickyBox.css({
					transform: 'translateY(' + topPosition + 'px)',
					'-webkit-transform': 'translateY(' + topPosition + 'px)'
				});
			},

			getTopPosition: function() {
				var currTopPosition = this.winScrollTop - this.data.boxOffsetTop + this.extraTop;

				if (this.moveInContainer) {
					var currScrollTop = this.winScrollTop + this.data.boxHeight + this.options.extraBottom;
					var diffOffset = Math.abs(Math.min(0, (this.data.containerHeight + this.data.containerOffsetTop) - currScrollTop - this.extraTop));

					return currTopPosition - diffOffset;
				} else {
					return currTopPosition;
				}
			}
		}
	};

	// jQuery plugin interface
	$.fn.stickyScrollBlock = function(opt) {
		var args = Array.prototype.slice.call(arguments);
		var method = args[0];

		var options = $.extend({
			container: null,
			positionType: 'fixed', // 'fixed' or 'absolute'
			activeClass: 'fixed-position',
			setBoxHeight: true,
			showAfterScrolled: false,
			extraTop: 0,
			extraBottom: 0,
			animDelay: 0.1,
			animSpeed: 0.2
		}, opt);

		return this.each(function() {
			var $stickyBox = jQuery(this);
			var instance = $stickyBox.data('StickyScrollBlock');

			if (typeof opt === 'object' || typeof opt === 'undefined') {
				StickyScrollBlock.prototype = $.extend(stickyMethods[options.positionType], StickyScrollBlockPrototype);
				$stickyBox.data('StickyScrollBlock', new StickyScrollBlock($stickyBox, options));
			} else if (typeof method === 'string' && instance) {
				if (typeof instance[method] === 'function') {
					args.shift();
					instance[method].apply(instance, args);
				}
			}
		});
	};

	// module exports
	window.StickyScrollBlock = StickyScrollBlock;
}(jQuery, jQuery(window)));

/*
 * Responsive Layout helper
 */
window.ResponsiveHelper = (function($){
	// init variables
	var handlers = [],
		prevWinWidth,
		win = $(window),
		nativeMatchMedia = false;

	// detect match media support
	if(window.matchMedia) {
		if(window.Window && window.matchMedia === Window.prototype.matchMedia) {
			nativeMatchMedia = true;
		} else if(window.matchMedia.toString().indexOf('native') > -1) {
			nativeMatchMedia = true;
		}
	}

	// prepare resize handler
	function resizeHandler() {
		var winWidth = win.width();
		if(winWidth !== prevWinWidth) {
			prevWinWidth = winWidth;

			// loop through range groups
			$.each(handlers, function(index, rangeObject){
				// disable current active area if needed
				$.each(rangeObject.data, function(property, item) {
					if(item.currentActive && !matchRange(item.range[0], item.range[1])) {
						item.currentActive = false;
						if(typeof item.disableCallback === 'function') {
							item.disableCallback();
						}
					}
				});

				// enable areas that match current width
				$.each(rangeObject.data, function(property, item) {
					if(!item.currentActive && matchRange(item.range[0], item.range[1])) {
						// make callback
						item.currentActive = true;
						if(typeof item.enableCallback === 'function') {
							item.enableCallback();
						}
					}
				});
			});
		}
	}
	win.bind('load resize orientationchange', resizeHandler);

	// test range
	function matchRange(r1, r2) {
		var mediaQueryString = '';
		if(r1 > 0) {
			mediaQueryString += '(min-width: ' + r1 + 'px)';
		}
		if(r2 < Infinity) {
			mediaQueryString += (mediaQueryString ? ' and ' : '') + '(max-width: ' + r2 + 'px)';
		}
		return matchQuery(mediaQueryString, r1, r2);
	}

	// media query function
	function matchQuery(query, r1, r2) {
		if(window.matchMedia && nativeMatchMedia) {
			return matchMedia(query).matches;
		} else if(window.styleMedia) {
			return styleMedia.matchMedium(query);
		} else if(window.media) {
			return media.matchMedium(query);
		} else {
			return prevWinWidth >= r1 && prevWinWidth <= r2;
		}
	}

	// range parser
	function parseRange(rangeStr) {
		var rangeData = rangeStr.split('..');
		var x1 = parseInt(rangeData[0], 10) || -Infinity;
		var x2 = parseInt(rangeData[1], 10) || Infinity;
		return [x1, x2].sort(function(a, b){
			return a - b;
		});
	}

	// export public functions
	return {
		addRange: function(ranges) {
			// parse data and add items to collection
			var result = {data:{}};
			$.each(ranges, function(property, data){
				result.data[property] = {
					range: parseRange(property),
					enableCallback: data.on,
					disableCallback: data.off
				};
			});
			handlers.push(result);

			// call resizeHandler to recalculate all events
			prevWinWidth = null;
			resizeHandler();
		}
	};
}(jQuery));

// /*
//  * Google map plugin
//  */
// function GoogleMap(element, markers, settings) {
// 	this.script  = "https://maps.googleapis.com/maps/api/js?key=AIzaSyAT0sLXF3gdv-XUswd7brh4FfrhHwFIAeA&callback=mapInitialized";
// 	this.zoom    = null;
// 	this.element = null;
// 	this.map     = null;
// 	this.bounds  = [];
// 	this.markers = [];
// 	this.mapSettings = {
// 		mapTypeId         : "TERRAIN",
// 		panControl        : false,
// 		mapTypeControl    : false,
// 		streetViewControl : false,
// 		zoomControl       : true,
// 		center            : [0, 0],
// 		zoom              : 7
// 	};
// 	this.markerSettings = {
// 		title     : "",
// 		animation : "DROP",
// 		map       : null,
// 		icon      : null,
// 		position  : null
// 	};
// 	if ($.isPlainObject(settings)) {
// 		if (settings.script) {
// 			this.script = settings.script;
// 		}
// 		if ($.isPlainObject(settings.mapSettings)) {
// 			if (settings.mapSettings.zoom) {
// 				this.zoom = settings.mapSettings.zoom;
// 				delete settings.mapSettings.zoom;
// 			}
// 			this.mapSettings = $.extend(this.mapSettings, settings.mapSettings);
// 		}
// 		if ($.isPlainObject(settings.markerSettings)) {
// 			this.markerSettings = $.extend(this.markerSettings, settings.markerSettings);
// 		}
// 	}
// 	if ($.isArray(markers)) {
// 		this.markers = markers;
// 	}
// 	if ((element = $(element)).length) {
// 		this.element = element.get()[0];
// 		this.initialize(this.script);
// 	}
// 	return this;
// }
// GoogleMap.prototype = {
// 	constructor : GoogleMap,
// 	initialize: function(script) {
// 		window.mapInitialized = function() {
// 			this.create();
// 		}.bind(this);
// 		$.getScript(script);
// 	},
// 	create: function() {
// 		if (!this.element) {
// 			return;
// 		}
// 		this.map = this.getMap(this.element, this.mapSettings);
// 		this.bounds = this.getBounds();
// 		var markers = [];
// 		$.each(this.markers, function(index, marker) {
// 			marker = this.getMarker($.extend(this.markerSettings, marker));
// 			markers.push(this.setHover(marker));
// 			if (this.zoom === "m") {
// 				this.bounds.extend(marker.position);
// 			}
// 			google.maps.event.addListener(marker, "click", function() {
// 				$(this).trigger("clickMarker", [index, marker]);
// 			}.bind(this));
// 			google.maps.event.addListener(marker, "mouseover", function() {
// 				$(this).trigger("onMarker", [index, marker]);
// 			}.bind(this));
// 			google.maps.event.addListener(marker, "mouseout", function() {
// 				$(this).trigger("offMarker", [index, marker]);
// 			}.bind(this));
// 		}.bind(this));
// 		this.markers = markers;
// 		if ($.isNumeric(this.zoom)) {
// 			this.map.setZoom(parseInt(this.zoom));
// 		}
// 		else if (this.zoom === "m") {
// 			this.map.fitBounds(this.bounds);
// 		}
// 		else if (this.zoom !== "") {
// 			this.geocode(this.zoom, function(results) {
// 				var sw = results[0].geometry.viewport.getSouthWest();
// 				var ne = results[0].geometry.viewport.getNorthEast();
// 				this.bounds = this.getBounds(sw, ne);
// 				this.map.fitBounds(this.bounds);
// 			}.bind(this));
// 		}
// 		$(this).trigger("mapReady");
// 	},
// 	geocode: function(address, callback) {
// 		new google.maps.Geocoder().geocode({
// 			address : address.toString()
// 		}, callback.bind(this));
// 	},
// 	getMapType: function(type) {
// 		return google.maps.MapTypeId[type.toString()];
// 	},
// 	getAnimation: function(animation) {
// 		return google.maps.Animation[animation.toString()];
// 	},
// 	getBounds: function(southwest, northeast) {
// 		return new google.maps.LatLngBounds(southwest, northeast);
// 	},
// 	getSize: function(x, y) {
// 		if ($.isArray(x)) {
// 			y = x[1] !== undefined ? x[1] : x[0];
// 			x = x[0];
// 		}
// 		return new google.maps.Size(parseInt(x), parseInt(y));
// 	},
// 	getPoint: function(x, y) {
// 		if ($.isArray(x)) {
// 			y = x[1] !== undefined ? x[1] : x[0];
// 			x = x[0];
// 		}
// 		return new google.maps.Point(parseInt(x), parseInt(y));
// 	},
// 	getPosition: function(x, y) {
// 		if ($.isArray(x)) {
// 			y = (x[1] !== undefined ? x[1] : x[0]);
// 			x = x[0];
// 		}
// 		return new google.maps.LatLng(parseFloat(x), parseFloat(y));
// 	},
// 	setHover: function(marker) {
// 		if (marker.hoverIcon) {
// 			marker.offIcon   = $.extend({}, marker.icon);
// 			marker.hoverIcon = $.extend({}, marker.icon, marker.hoverIcon);
// 			$(this).on("onMarker", function(e, index) {
// 				this.markers[index].setIcon(this.markers[index].hoverIcon);
// 				this.markers[index].setZIndex(100);
// 			}.bind(this)).on("offMarker", function(e, index) {
// 				this.markers[index].setIcon(this.markers[index].offIcon);
// 				this.markers[index].setZIndex(1);
// 			}.bind(this));
// 		}
// 		marker.setZIndex(1);
// 		return marker;
// 	},
// 	getMarker: function(settings) {
// 		settings.map = this.map;
// 		if (settings.animation) {
// 			settings.animation = this.getAnimation(settings.animation);
// 		}
// 		if (settings.position) {
// 			settings.position = this.getPosition(settings.position);
// 		}
// 		if (settings.icon && settings.icon.anchor) {
// 			settings.icon.anchor = this.getPoint(settings.icon.anchor);
// 		}
// 		if (settings.hoverIcon) {
// 			if (settings.hoverIcon.anchor) {
// 				settings.hoverIcon.anchor = this.getPoint(settings.hoverIcon.anchor);
// 			}
// 		}
// 		return new google.maps.Marker(settings);
// 	},
// 	getMap: function(element, settings) {
// 		if (settings.center) {
// 			settings.center = this.getPosition(settings.center);
// 		}
// 		if (settings.mapTypeId) {
// 			settings.mapTypeId = this.getMapType(settings.mapTypeId);
// 		}
// 		return new google.maps.Map(element, settings);
// 	}
// };

jQuery(function() {
	initTouchNav();
});


// handle dropdowns on mobile devices
function initTouchNav() {
	jQuery('.filter-nav').each(function() {
		new TouchNav({
			navBlock: this
		});
	});
}


// navigation accesibility module
function TouchNav(opt) {
	this.options = {
		hoverClass: 'hover',
		menuItems: 'li',
		menuOpener: 'a',
		menuDrop: 'ul',
		navBlock: null
	};
	for (var p in opt) {
		if (opt.hasOwnProperty(p)) {
			this.options[p] = opt[p];
		}
	}
	this.init();
}
TouchNav.isActiveOn = function(elem) {
	return elem && elem.touchNavActive;
};
TouchNav.prototype = {
	init: function() {
		if (typeof this.options.navBlock === 'string') {
			this.menu = document.getElementById(this.options.navBlock);
		} else if (typeof this.options.navBlock === 'object') {
			this.menu = this.options.navBlock;
		}
		if (this.menu) {
			this.addEvents();
		}
	},
	addEvents: function() {
		// attach event handlers
		var self = this;
		var touchEvent = (navigator.pointerEnabled && 'pointerdown') || (navigator.msPointerEnabled && 'MSPointerDown') || (this.isTouchDevice && 'touchstart');
		this.menuItems = lib.queryElementsBySelector(this.options.menuItems, this.menu);

		var initMenuItem = function(item) {
			var currentDrop = lib.queryElementsBySelector(self.options.menuDrop, item)[0],
				currentOpener = lib.queryElementsBySelector(self.options.menuOpener, item)[0];

			// only for touch input devices
			if (currentDrop && currentOpener && (self.isTouchDevice || self.isPointerDevice)) {
				lib.event.add(currentOpener, 'click', lib.bind(self.clickHandler, self));
				lib.event.add(currentOpener, 'mousedown', lib.bind(self.mousedownHandler, self));
				lib.event.add(currentOpener, touchEvent, function(e) {
					if (!self.isTouchPointerEvent(e)) {
						self.preventCurrentClick = false;
						return;
					}
					self.touchFlag = true;
					self.currentItem = item;
					self.currentLink = currentOpener;
					self.pressHandler.apply(self, arguments);
				});
			}
			// for desktop computers and touch devices
			jQuery(item)
				.bind('mouseenter', function() {
					if (!self.touchFlag) {
						self.currentItem = item;
						self.mouseoverHandler();
					}
				});
			jQuery(item)
				.bind('mouseleave', function() {
					if (!self.touchFlag) {
						self.currentItem = item;
						self.mouseoutHandler();
					}
				});
			item.touchNavActive = true;
		};

		// addd handlers for all menu items
		for (var i = 0; i < this.menuItems.length; i++) {
			initMenuItem(self.menuItems[i]);
		}

		// hide dropdowns when clicking outside navigation
		if (this.isTouchDevice || this.isPointerDevice) {
			lib.event.add(document.documentElement, 'mousedown', lib.bind(this.clickOutsideHandler, this));
			lib.event.add(document.documentElement, touchEvent, lib.bind(this.clickOutsideHandler, this));
		}
	},
	mousedownHandler: function(e) {
		if (this.touchFlag) {
			e.preventDefault();
			this.touchFlag = false;
			this.preventCurrentClick = false;
		}
	},
	mouseoverHandler: function() {
		lib.addClass(this.currentItem, this.options.hoverClass);
		jQuery(this.currentItem)
			.trigger('itemhover');
	},
	mouseoutHandler: function() {
		lib.removeClass(this.currentItem, this.options.hoverClass);
		jQuery(this.currentItem)
			.trigger('itemleave');
	},
	hideActiveDropdown: function() {
		for (var i = 0; i < this.menuItems.length; i++) {
			if (lib.hasClass(this.menuItems[i], this.options.hoverClass)) {
				lib.removeClass(this.menuItems[i], this.options.hoverClass);
				jQuery(this.menuItems[i])
					.trigger('itemleave');
			}
		}
		this.activeParent = null;
	},
	pressHandler: function(e) {
		// hide previous drop (if active)
		if (this.currentItem !== this.activeParent) {
			if (this.activeParent && this.currentItem.parentNode === this.activeParent.parentNode) {
				lib.removeClass(this.activeParent, this.options.hoverClass);
			} else if (!this.isParent(this.activeParent, this.currentLink)) {
				this.hideActiveDropdown();
			}
		}
		// handle current drop
		this.activeParent = this.currentItem;
		if (lib.hasClass(this.currentItem, this.options.hoverClass)) {
			this.preventCurrentClick = false;
		} else {
			e.preventDefault();
			this.preventCurrentClick = true;
			lib.addClass(this.currentItem, this.options.hoverClass);
			jQuery(this.currentItem)
				.trigger('itemhover');
		}
	},
	clickHandler: function(e) {
		// prevent first click on link
		if (this.preventCurrentClick) {
			e.preventDefault();
		}
	},
	clickOutsideHandler: function(event) {
		var e = event.changedTouches ? event.changedTouches[0] : event;
		if (this.activeParent && !this.isParent(this.menu, e.target)) {
			this.hideActiveDropdown();
			this.touchFlag = false;
		}
	},
	isParent: function(parent, child) {
		while (child.parentNode) {
			if (child.parentNode == parent) {
				return true;
			}
			child = child.parentNode;
		}
		return false;
	},
	isTouchPointerEvent: function(e) {
		return (e.type.indexOf('touch') > -1) ||
			(navigator.pointerEnabled && e.pointerType === 'touch') ||
			(navigator.msPointerEnabled && e.pointerType == e.MSPOINTER_TYPE_TOUCH);
	},
	isPointerDevice: (function() {
		return !!(navigator.pointerEnabled || navigator.msPointerEnabled);
	}()),
	isTouchDevice: (function() {
		return !!(('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch);
	}())
};

/*
 * Utility module
 */
lib = {
	hasClass: function(el,cls) {
		return el && el.className ? el.className.match(new RegExp('(\\s|^)'+cls+'(\\s|$)')) : false;
	},
	addClass: function(el,cls) {
		if (el && !this.hasClass(el,cls)) el.className += " "+cls;
	},
	removeClass: function(el,cls) {
		if (el && this.hasClass(el,cls)) {el.className=el.className.replace(new RegExp('(\\s|^)'+cls+'(\\s|$)'),' ');}
	},
	extend: function(obj) {
		for(var i = 1; i < arguments.length; i++) {
			for(var p in arguments[i]) {
				if(arguments[i].hasOwnProperty(p)) {
					obj[p] = arguments[i][p];
				}
			}
		}
		return obj;
	},
	each: function(obj, callback) {
		var property, len;
		if(typeof obj.length === 'number') {
			for(property = 0, len = obj.length; property < len; property++) {
				if(callback.call(obj[property], property, obj[property]) === false) {
					break;
				}
			}
		} else {
			for(property in obj) {
				if(obj.hasOwnProperty(property)) {
					if(callback.call(obj[property], property, obj[property]) === false) {
						break;
					}
				}
			}
		}
	},
	event: (function() {
		var fixEvent = function(e) {
			e = e || window.event;
			if(e.isFixed) return e; else e.isFixed = true;
			if(!e.target) e.target = e.srcElement;
			e.preventDefault = e.preventDefault || function() {this.returnValue = false;};
			e.stopPropagation = e.stopPropagation || function() {this.cancelBubble = true;};
			return e;
		};
		return {
			add: function(elem, event, handler) {
				if(!elem.events) {
					elem.events = {};
					elem.handle = function(e) {
						var ret, handlers = elem.events[e.type];
						e = fixEvent(e);
						for(var i = 0, len = handlers.length; i < len; i++) {
							if(handlers[i]) {
								ret = handlers[i].call(elem, e);
								if(ret === false) {
									e.preventDefault();
									e.stopPropagation();
								}
							}
						}
					};
				}
				if(!elem.events[event]) {
					elem.events[event] = [];
					if(elem.addEventListener) elem.addEventListener(event, elem.handle, false);
					else if(elem.attachEvent) elem.attachEvent('on'+event, elem.handle);
				}
				elem.events[event].push(handler);
			},
			remove: function(elem, event, handler) {
				var handlers = elem.events[event];
				for(var i = handlers.length - 1; i >= 0; i--) {
					if(handlers[i] === handler) {
						handlers.splice(i,1);
					}
				}
				if(!handlers.length) {
					delete elem.events[event];
					if(elem.removeEventListener) elem.removeEventListener(event, elem.handle, false);
					else if(elem.detachEvent) elem.detachEvent('on'+event, elem.handle);
				}
			}
		};
	}()),
	queryElementsBySelector: function(selector, scope) {
		scope = scope || document;
		if(!selector) return [];
		if(selector === '>*') return scope.children;
		if(typeof document.querySelectorAll === 'function') {
			return scope.querySelectorAll(selector);
		}
		var selectors = selector.split(',');
		var resultList = [];
		for(var s = 0; s < selectors.length; s++) {
			var currentContext = [scope || document];
			var tokens = selectors[s].replace(/^\s+/,'').replace(/\s+$/,'').split(' ');
			for (var i = 0; i < tokens.length; i++) {
				token = tokens[i].replace(/^\s+/,'').replace(/\s+$/,'');
				if (token.indexOf('#') > -1) {
					var bits = token.split('#'), tagName = bits[0], id = bits[1];
					var element = document.getElementById(id);
					if (element && tagName && element.nodeName.toLowerCase() != tagName) {
						return [];
					}
					currentContext = element ? [element] : [];
					continue;
				}
				if (token.indexOf('.') > -1) {
					var bits = token.split('.'), tagName = bits[0] || '*', className = bits[1], found = [], foundCount = 0;
					for (var h = 0; h < currentContext.length; h++) {
						var elements;
						if (tagName == '*') {
							elements = currentContext[h].getElementsByTagName('*');
						} else {
							elements = currentContext[h].getElementsByTagName(tagName);
						}
						for (var j = 0; j < elements.length; j++) {
							found[foundCount++] = elements[j];
						}
					}
					currentContext = [];
					var currentContextIndex = 0;
					for (var k = 0; k < found.length; k++) {
						if (found[k].className && found[k].className.match(new RegExp('(\\s|^)'+className+'(\\s|$)'))) {
							currentContext[currentContextIndex++] = found[k];
						}
					}
					continue;
				}
				if (token.match(/^(\w*)\[(\w+)([=~\|\^\$\*]?)=?"?([^\]"]*)"?\]$/)) {
					var tagName = RegExp.$1 || '*', attrName = RegExp.$2, attrOperator = RegExp.$3, attrValue = RegExp.$4;
					if(attrName.toLowerCase() == 'for' && this.browser.msie && this.browser.version < 8) {
						attrName = 'htmlFor';
					}
					var found = [], foundCount = 0;
					for (var h = 0; h < currentContext.length; h++) {
						var elements;
						if (tagName == '*') {
							elements = currentContext[h].getElementsByTagName('*');
						} else {
							elements = currentContext[h].getElementsByTagName(tagName);
						}
						for (var j = 0; elements[j]; j++) {
							found[foundCount++] = elements[j];
						}
					}
					currentContext = [];
					var currentContextIndex = 0, checkFunction;
					switch (attrOperator) {
						case '=': checkFunction = function(e) { return (e.getAttribute(attrName) == attrValue) }; break;
						case '~': checkFunction = function(e) { return (e.getAttribute(attrName).match(new RegExp('(\\s|^)'+attrValue+'(\\s|$)'))) }; break;
						case '|': checkFunction = function(e) { return (e.getAttribute(attrName).match(new RegExp('^'+attrValue+'-?'))) }; break;
						case '^': checkFunction = function(e) { return (e.getAttribute(attrName).indexOf(attrValue) == 0) }; break;
						case '$': checkFunction = function(e) { return (e.getAttribute(attrName).lastIndexOf(attrValue) == e.getAttribute(attrName).length - attrValue.length) }; break;
						case '*': checkFunction = function(e) { return (e.getAttribute(attrName).indexOf(attrValue) > -1) }; break;
						default : checkFunction = function(e) { return e.getAttribute(attrName) };
					}
					currentContext = [];
					var currentContextIndex = 0;
					for (var k = 0; k < found.length; k++) {
						if (checkFunction(found[k])) {
							currentContext[currentContextIndex++] = found[k];
						}
					}
					continue;
				}
				tagName = token;
				var found = [], foundCount = 0;
				for (var h = 0; h < currentContext.length; h++) {
					var elements = currentContext[h].getElementsByTagName(tagName);
					for (var j = 0; j < elements.length; j++) {
						found[foundCount++] = elements[j];
					}
				}
				currentContext = found;
			}
			resultList = [].concat(resultList,currentContext);
		}
		return resultList;
	},
	trim: function (str) {
		return str.replace(/^\s+/, '').replace(/\s+$/, '');
	},
	bind: function(f, scope, forceArgs){
		return function() {return f.apply(scope, typeof forceArgs !== 'undefined' ? [forceArgs] : arguments);};
	}
};

/*
 _ _      _       _
 ___| (_) ___| | __  (_)___
 / __| | |/ __| |/ /  | / __|
 \__ \ | | (__|   < _ | \__ \
 |___/_|_|\___|_|\_(_)/ |___/
 |__/

 Version: 1.8.1
 Author: Ken Wheeler
 Website: http://kenwheeler.github.io
 Docs: http://kenwheeler.github.io/slick
 Repo: http://github.com/kenwheeler/slick
 Issues: http://github.com/kenwheeler/slick/issues

 */
!function(i){"use strict";"function"==typeof define&&define.amd?define(["jquery"],i):"undefined"!=typeof exports?module.exports=i(require("jquery")):i(jQuery)}(function(i){"use strict";var e=window.Slick||{};(e=function(){var e=0;return function(t,o){var s,n=this;n.defaults={accessibility:!0,adaptiveHeight:!1,appendArrows:i(t),appendDots:i(t),arrows:!0,asNavFor:null,prevArrow:'<button class="slick-prev" aria-label="Previous" type="button">Previous</button>',nextArrow:'<button class="slick-next" aria-label="Next" type="button">Next</button>',autoplay:!1,autoplaySpeed:3e3,centerMode:!1,centerPadding:"50px",cssEase:"ease",customPaging:function(e,t){return i('<button type="button" />').text(t+1)},dots:!1,dotsClass:"slick-dots",draggable:!0,easing:"linear",edgeFriction:.35,fade:!1,focusOnSelect:!1,focusOnChange:!1,infinite:!0,initialSlide:0,lazyLoad:"ondemand",mobileFirst:!1,pauseOnHover:!0,pauseOnFocus:!0,pauseOnDotsHover:!1,respondTo:"window",responsive:null,rows:1,rtl:!1,slide:"",slidesPerRow:1,slidesToShow:1,slidesToScroll:1,speed:500,swipe:!0,swipeToSlide:!1,touchMove:!0,touchThreshold:5,useCSS:!0,useTransform:!0,variableWidth:!1,vertical:!1,verticalSwiping:!1,waitForAnimate:!0,zIndex:1e3},n.initials={animating:!1,dragging:!1,autoPlayTimer:null,currentDirection:0,currentLeft:null,currentSlide:0,direction:1,$dots:null,listWidth:null,listHeight:null,loadIndex:0,$nextArrow:null,$prevArrow:null,scrolling:!1,slideCount:null,slideWidth:null,$slideTrack:null,$slides:null,sliding:!1,slideOffset:0,swipeLeft:null,swiping:!1,$list:null,touchObject:{},transformsEnabled:!1,unslicked:!1},i.extend(n,n.initials),n.activeBreakpoint=null,n.animType=null,n.animProp=null,n.breakpoints=[],n.breakpointSettings=[],n.cssTransitions=!1,n.focussed=!1,n.interrupted=!1,n.hidden="hidden",n.paused=!0,n.positionProp=null,n.respondTo=null,n.rowCount=1,n.shouldClick=!0,n.$slider=i(t),n.$slidesCache=null,n.transformType=null,n.transitionType=null,n.visibilityChange="visibilitychange",n.windowWidth=0,n.windowTimer=null,s=i(t).data("slick")||{},n.options=i.extend({},n.defaults,o,s),n.currentSlide=n.options.initialSlide,n.originalSettings=n.options,void 0!==document.mozHidden?(n.hidden="mozHidden",n.visibilityChange="mozvisibilitychange"):void 0!==document.webkitHidden&&(n.hidden="webkitHidden",n.visibilityChange="webkitvisibilitychange"),n.autoPlay=i.proxy(n.autoPlay,n),n.autoPlayClear=i.proxy(n.autoPlayClear,n),n.autoPlayIterator=i.proxy(n.autoPlayIterator,n),n.changeSlide=i.proxy(n.changeSlide,n),n.clickHandler=i.proxy(n.clickHandler,n),n.selectHandler=i.proxy(n.selectHandler,n),n.setPosition=i.proxy(n.setPosition,n),n.swipeHandler=i.proxy(n.swipeHandler,n),n.dragHandler=i.proxy(n.dragHandler,n),n.keyHandler=i.proxy(n.keyHandler,n),n.instanceUid=e++,n.htmlExpr=/^(?:\s*(<[\w\W]+>)[^>]*)$/,n.registerBreakpoints(),n.init(!0)}}()).prototype.activateADA=function(){this.$slideTrack.find(".slick-active").attr({"aria-hidden":"false"}).find("a, input, button, select").attr({tabindex:"0"})},e.prototype.addSlide=e.prototype.slickAdd=function(e,t,o){var s=this;if("boolean"==typeof t)o=t,t=null;else if(t<0||t>=s.slideCount)return!1;s.unload(),"number"==typeof t?0===t&&0===s.$slides.length?i(e).appendTo(s.$slideTrack):o?i(e).insertBefore(s.$slides.eq(t)):i(e).insertAfter(s.$slides.eq(t)):!0===o?i(e).prependTo(s.$slideTrack):i(e).appendTo(s.$slideTrack),s.$slides=s.$slideTrack.children(this.options.slide),s.$slideTrack.children(this.options.slide).detach(),s.$slideTrack.append(s.$slides),s.$slides.each(function(e,t){i(t).attr("data-slick-index",e)}),s.$slidesCache=s.$slides,s.reinit()},e.prototype.animateHeight=function(){var i=this;if(1===i.options.slidesToShow&&!0===i.options.adaptiveHeight&&!1===i.options.vertical){var e=i.$slides.eq(i.currentSlide).outerHeight(!0);i.$list.animate({height:e},i.options.speed)}},e.prototype.animateSlide=function(e,t){var o={},s=this;s.animateHeight(),!0===s.options.rtl&&!1===s.options.vertical&&(e=-e),!1===s.transformsEnabled?!1===s.options.vertical?s.$slideTrack.animate({left:e},s.options.speed,s.options.easing,t):s.$slideTrack.animate({top:e},s.options.speed,s.options.easing,t):!1===s.cssTransitions?(!0===s.options.rtl&&(s.currentLeft=-s.currentLeft),i({animStart:s.currentLeft}).animate({animStart:e},{duration:s.options.speed,easing:s.options.easing,step:function(i){i=Math.ceil(i),!1===s.options.vertical?(o[s.animType]="translate("+i+"px, 0px)",s.$slideTrack.css(o)):(o[s.animType]="translate(0px,"+i+"px)",s.$slideTrack.css(o))},complete:function(){t&&t.call()}})):(s.applyTransition(),e=Math.ceil(e),!1===s.options.vertical?o[s.animType]="translate3d("+e+"px, 0px, 0px)":o[s.animType]="translate3d(0px,"+e+"px, 0px)",s.$slideTrack.css(o),t&&setTimeout(function(){s.disableTransition(),t.call()},s.options.speed))},e.prototype.getNavTarget=function(){var e=this,t=e.options.asNavFor;return t&&null!==t&&(t=i(t).not(e.$slider)),t},e.prototype.asNavFor=function(e){var t=this.getNavTarget();null!==t&&"object"==typeof t&&t.each(function(){var t=i(this).slick("getSlick");t.unslicked||t.slideHandler(e,!0)})},e.prototype.applyTransition=function(i){var e=this,t={};!1===e.options.fade?t[e.transitionType]=e.transformType+" "+e.options.speed+"ms "+e.options.cssEase:t[e.transitionType]="opacity "+e.options.speed+"ms "+e.options.cssEase,!1===e.options.fade?e.$slideTrack.css(t):e.$slides.eq(i).css(t)},e.prototype.autoPlay=function(){var i=this;i.autoPlayClear(),i.slideCount>i.options.slidesToShow&&(i.autoPlayTimer=setInterval(i.autoPlayIterator,i.options.autoplaySpeed))},e.prototype.autoPlayClear=function(){var i=this;i.autoPlayTimer&&clearInterval(i.autoPlayTimer)},e.prototype.autoPlayIterator=function(){var i=this,e=i.currentSlide+i.options.slidesToScroll;i.paused||i.interrupted||i.focussed||(!1===i.options.infinite&&(1===i.direction&&i.currentSlide+1===i.slideCount-1?i.direction=0:0===i.direction&&(e=i.currentSlide-i.options.slidesToScroll,i.currentSlide-1==0&&(i.direction=1))),i.slideHandler(e))},e.prototype.buildArrows=function(){var e=this;!0===e.options.arrows&&(e.$prevArrow=i(e.options.prevArrow).addClass("slick-arrow"),e.$nextArrow=i(e.options.nextArrow).addClass("slick-arrow"),e.slideCount>e.options.slidesToShow?(e.$prevArrow.removeClass("slick-hidden").removeAttr("aria-hidden tabindex"),e.$nextArrow.removeClass("slick-hidden").removeAttr("aria-hidden tabindex"),e.htmlExpr.test(e.options.prevArrow)&&e.$prevArrow.prependTo(e.options.appendArrows),e.htmlExpr.test(e.options.nextArrow)&&e.$nextArrow.appendTo(e.options.appendArrows),!0!==e.options.infinite&&e.$prevArrow.addClass("slick-disabled").attr("aria-disabled","true")):e.$prevArrow.add(e.$nextArrow).addClass("slick-hidden").attr({"aria-disabled":"true",tabindex:"-1"}))},e.prototype.buildDots=function(){var e,t,o=this;if(!0===o.options.dots&&o.slideCount>o.options.slidesToShow){for(o.$slider.addClass("slick-dotted"),t=i("<ul />").addClass(o.options.dotsClass),e=0;e<=o.getDotCount();e+=1)t.append(i("<li />").append(o.options.customPaging.call(this,o,e)));o.$dots=t.appendTo(o.options.appendDots),o.$dots.find("li").first().addClass("slick-active")}},e.prototype.buildOut=function(){var e=this;e.$slides=e.$slider.children(e.options.slide+":not(.slick-cloned)").addClass("slick-slide"),e.slideCount=e.$slides.length,e.$slides.each(function(e,t){i(t).attr("data-slick-index",e).data("originalStyling",i(t).attr("style")||"")}),e.$slider.addClass("slick-slider"),e.$slideTrack=0===e.slideCount?i('<div class="slick-track"/>').appendTo(e.$slider):e.$slides.wrapAll('<div class="slick-track"/>').parent(),e.$list=e.$slideTrack.wrap('<div class="slick-list"/>').parent(),e.$slideTrack.css("opacity",0),!0!==e.options.centerMode&&!0!==e.options.swipeToSlide||(e.options.slidesToScroll=1),i("img[data-lazy]",e.$slider).not("[src]").addClass("slick-loading"),e.setupInfinite(),e.buildArrows(),e.buildDots(),e.updateDots(),e.setSlideClasses("number"==typeof e.currentSlide?e.currentSlide:0),!0===e.options.draggable&&e.$list.addClass("draggable")},e.prototype.buildRows=function(){var i,e,t,o,s,n,r,l=this;if(o=document.createDocumentFragment(),n=l.$slider.children(),l.options.rows>0){for(r=l.options.slidesPerRow*l.options.rows,s=Math.ceil(n.length/r),i=0;i<s;i++){var d=document.createElement("div");for(e=0;e<l.options.rows;e++){var a=document.createElement("div");for(t=0;t<l.options.slidesPerRow;t++){var c=i*r+(e*l.options.slidesPerRow+t);n.get(c)&&a.appendChild(n.get(c))}d.appendChild(a)}o.appendChild(d)}l.$slider.empty().append(o),l.$slider.children().children().children().css({width:100/l.options.slidesPerRow+"%",display:"inline-block"})}},e.prototype.checkResponsive=function(e,t){var o,s,n,r=this,l=!1,d=r.$slider.width(),a=window.innerWidth||i(window).width();if("window"===r.respondTo?n=a:"slider"===r.respondTo?n=d:"min"===r.respondTo&&(n=Math.min(a,d)),r.options.responsive&&r.options.responsive.length&&null!==r.options.responsive){s=null;for(o in r.breakpoints)r.breakpoints.hasOwnProperty(o)&&(!1===r.originalSettings.mobileFirst?n<r.breakpoints[o]&&(s=r.breakpoints[o]):n>r.breakpoints[o]&&(s=r.breakpoints[o]));null!==s?null!==r.activeBreakpoint?(s!==r.activeBreakpoint||t)&&(r.activeBreakpoint=s,"unslick"===r.breakpointSettings[s]?r.unslick(s):(r.options=i.extend({},r.originalSettings,r.breakpointSettings[s]),!0===e&&(r.currentSlide=r.options.initialSlide),r.refresh(e)),l=s):(r.activeBreakpoint=s,"unslick"===r.breakpointSettings[s]?r.unslick(s):(r.options=i.extend({},r.originalSettings,r.breakpointSettings[s]),!0===e&&(r.currentSlide=r.options.initialSlide),r.refresh(e)),l=s):null!==r.activeBreakpoint&&(r.activeBreakpoint=null,r.options=r.originalSettings,!0===e&&(r.currentSlide=r.options.initialSlide),r.refresh(e),l=s),e||!1===l||r.$slider.trigger("breakpoint",[r,l])}},e.prototype.changeSlide=function(e,t){var o,s,n,r=this,l=i(e.currentTarget);switch(l.is("a")&&e.preventDefault(),l.is("li")||(l=l.closest("li")),n=r.slideCount%r.options.slidesToScroll!=0,o=n?0:(r.slideCount-r.currentSlide)%r.options.slidesToScroll,e.data.message){case"previous":s=0===o?r.options.slidesToScroll:r.options.slidesToShow-o,r.slideCount>r.options.slidesToShow&&r.slideHandler(r.currentSlide-s,!1,t);break;case"next":s=0===o?r.options.slidesToScroll:o,r.slideCount>r.options.slidesToShow&&r.slideHandler(r.currentSlide+s,!1,t);break;case"index":var d=0===e.data.index?0:e.data.index||l.index()*r.options.slidesToScroll;r.slideHandler(r.checkNavigable(d),!1,t),l.children().trigger("focus");break;default:return}},e.prototype.checkNavigable=function(i){var e,t;if(e=this.getNavigableIndexes(),t=0,i>e[e.length-1])i=e[e.length-1];else for(var o in e){if(i<e[o]){i=t;break}t=e[o]}return i},e.prototype.cleanUpEvents=function(){var e=this;e.options.dots&&null!==e.$dots&&(i("li",e.$dots).off("click.slick",e.changeSlide).off("mouseenter.slick",i.proxy(e.interrupt,e,!0)).off("mouseleave.slick",i.proxy(e.interrupt,e,!1)),!0===e.options.accessibility&&e.$dots.off("keydown.slick",e.keyHandler)),e.$slider.off("focus.slick blur.slick"),!0===e.options.arrows&&e.slideCount>e.options.slidesToShow&&(e.$prevArrow&&e.$prevArrow.off("click.slick",e.changeSlide),e.$nextArrow&&e.$nextArrow.off("click.slick",e.changeSlide),!0===e.options.accessibility&&(e.$prevArrow&&e.$prevArrow.off("keydown.slick",e.keyHandler),e.$nextArrow&&e.$nextArrow.off("keydown.slick",e.keyHandler))),e.$list.off("touchstart.slick mousedown.slick",e.swipeHandler),e.$list.off("touchmove.slick mousemove.slick",e.swipeHandler),e.$list.off("touchend.slick mouseup.slick",e.swipeHandler),e.$list.off("touchcancel.slick mouseleave.slick",e.swipeHandler),e.$list.off("click.slick",e.clickHandler),i(document).off(e.visibilityChange,e.visibility),e.cleanUpSlideEvents(),!0===e.options.accessibility&&e.$list.off("keydown.slick",e.keyHandler),!0===e.options.focusOnSelect&&i(e.$slideTrack).children().off("click.slick",e.selectHandler),i(window).off("orientationchange.slick.slick-"+e.instanceUid,e.orientationChange),i(window).off("resize.slick.slick-"+e.instanceUid,e.resize),i("[draggable!=true]",e.$slideTrack).off("dragstart",e.preventDefault),i(window).off("load.slick.slick-"+e.instanceUid,e.setPosition)},e.prototype.cleanUpSlideEvents=function(){var e=this;e.$list.off("mouseenter.slick",i.proxy(e.interrupt,e,!0)),e.$list.off("mouseleave.slick",i.proxy(e.interrupt,e,!1))},e.prototype.cleanUpRows=function(){var i,e=this;e.options.rows>0&&((i=e.$slides.children().children()).removeAttr("style"),e.$slider.empty().append(i))},e.prototype.clickHandler=function(i){!1===this.shouldClick&&(i.stopImmediatePropagation(),i.stopPropagation(),i.preventDefault())},e.prototype.destroy=function(e){var t=this;t.autoPlayClear(),t.touchObject={},t.cleanUpEvents(),i(".slick-cloned",t.$slider).detach(),t.$dots&&t.$dots.remove(),t.$prevArrow&&t.$prevArrow.length&&(t.$prevArrow.removeClass("slick-disabled slick-arrow slick-hidden").removeAttr("aria-hidden aria-disabled tabindex").css("display",""),t.htmlExpr.test(t.options.prevArrow)&&t.$prevArrow.remove()),t.$nextArrow&&t.$nextArrow.length&&(t.$nextArrow.removeClass("slick-disabled slick-arrow slick-hidden").removeAttr("aria-hidden aria-disabled tabindex").css("display",""),t.htmlExpr.test(t.options.nextArrow)&&t.$nextArrow.remove()),t.$slides&&(t.$slides.removeClass("slick-slide slick-active slick-center slick-visible slick-current").removeAttr("aria-hidden").removeAttr("data-slick-index").each(function(){i(this).attr("style",i(this).data("originalStyling"))}),t.$slideTrack.children(this.options.slide).detach(),t.$slideTrack.detach(),t.$list.detach(),t.$slider.append(t.$slides)),t.cleanUpRows(),t.$slider.removeClass("slick-slider"),t.$slider.removeClass("slick-initialized"),t.$slider.removeClass("slick-dotted"),t.unslicked=!0,e||t.$slider.trigger("destroy",[t])},e.prototype.disableTransition=function(i){var e=this,t={};t[e.transitionType]="",!1===e.options.fade?e.$slideTrack.css(t):e.$slides.eq(i).css(t)},e.prototype.fadeSlide=function(i,e){var t=this;!1===t.cssTransitions?(t.$slides.eq(i).css({zIndex:t.options.zIndex}),t.$slides.eq(i).animate({opacity:1},t.options.speed,t.options.easing,e)):(t.applyTransition(i),t.$slides.eq(i).css({opacity:1,zIndex:t.options.zIndex}),e&&setTimeout(function(){t.disableTransition(i),e.call()},t.options.speed))},e.prototype.fadeSlideOut=function(i){var e=this;!1===e.cssTransitions?e.$slides.eq(i).animate({opacity:0,zIndex:e.options.zIndex-2},e.options.speed,e.options.easing):(e.applyTransition(i),e.$slides.eq(i).css({opacity:0,zIndex:e.options.zIndex-2}))},e.prototype.filterSlides=e.prototype.slickFilter=function(i){var e=this;null!==i&&(e.$slidesCache=e.$slides,e.unload(),e.$slideTrack.children(this.options.slide).detach(),e.$slidesCache.filter(i).appendTo(e.$slideTrack),e.reinit())},e.prototype.focusHandler=function(){var e=this;e.$slider.off("focus.slick blur.slick").on("focus.slick blur.slick","*",function(t){t.stopImmediatePropagation();var o=i(this);setTimeout(function(){e.options.pauseOnFocus&&(e.focussed=o.is(":focus"),e.autoPlay())},0)})},e.prototype.getCurrent=e.prototype.slickCurrentSlide=function(){return this.currentSlide},e.prototype.getDotCount=function(){var i=this,e=0,t=0,o=0;if(!0===i.options.infinite)if(i.slideCount<=i.options.slidesToShow)++o;else for(;e<i.slideCount;)++o,e=t+i.options.slidesToScroll,t+=i.options.slidesToScroll<=i.options.slidesToShow?i.options.slidesToScroll:i.options.slidesToShow;else if(!0===i.options.centerMode)o=i.slideCount;else if(i.options.asNavFor)for(;e<i.slideCount;)++o,e=t+i.options.slidesToScroll,t+=i.options.slidesToScroll<=i.options.slidesToShow?i.options.slidesToScroll:i.options.slidesToShow;else o=1+Math.ceil((i.slideCount-i.options.slidesToShow)/i.options.slidesToScroll);return o-1},e.prototype.getLeft=function(i){var e,t,o,s,n=this,r=0;return n.slideOffset=0,t=n.$slides.first().outerHeight(!0),!0===n.options.infinite?(n.slideCount>n.options.slidesToShow&&(n.slideOffset=n.slideWidth*n.options.slidesToShow*-1,s=-1,!0===n.options.vertical&&!0===n.options.centerMode&&(2===n.options.slidesToShow?s=-1.5:1===n.options.slidesToShow&&(s=-2)),r=t*n.options.slidesToShow*s),n.slideCount%n.options.slidesToScroll!=0&&i+n.options.slidesToScroll>n.slideCount&&n.slideCount>n.options.slidesToShow&&(i>n.slideCount?(n.slideOffset=(n.options.slidesToShow-(i-n.slideCount))*n.slideWidth*-1,r=(n.options.slidesToShow-(i-n.slideCount))*t*-1):(n.slideOffset=n.slideCount%n.options.slidesToScroll*n.slideWidth*-1,r=n.slideCount%n.options.slidesToScroll*t*-1))):i+n.options.slidesToShow>n.slideCount&&(n.slideOffset=(i+n.options.slidesToShow-n.slideCount)*n.slideWidth,r=(i+n.options.slidesToShow-n.slideCount)*t),n.slideCount<=n.options.slidesToShow&&(n.slideOffset=0,r=0),!0===n.options.centerMode&&n.slideCount<=n.options.slidesToShow?n.slideOffset=n.slideWidth*Math.floor(n.options.slidesToShow)/2-n.slideWidth*n.slideCount/2:!0===n.options.centerMode&&!0===n.options.infinite?n.slideOffset+=n.slideWidth*Math.floor(n.options.slidesToShow/2)-n.slideWidth:!0===n.options.centerMode&&(n.slideOffset=0,n.slideOffset+=n.slideWidth*Math.floor(n.options.slidesToShow/2)),e=!1===n.options.vertical?i*n.slideWidth*-1+n.slideOffset:i*t*-1+r,!0===n.options.variableWidth&&(o=n.slideCount<=n.options.slidesToShow||!1===n.options.infinite?n.$slideTrack.children(".slick-slide").eq(i):n.$slideTrack.children(".slick-slide").eq(i+n.options.slidesToShow),e=!0===n.options.rtl?o[0]?-1*(n.$slideTrack.width()-o[0].offsetLeft-o.width()):0:o[0]?-1*o[0].offsetLeft:0,!0===n.options.centerMode&&(o=n.slideCount<=n.options.slidesToShow||!1===n.options.infinite?n.$slideTrack.children(".slick-slide").eq(i):n.$slideTrack.children(".slick-slide").eq(i+n.options.slidesToShow+1),e=!0===n.options.rtl?o[0]?-1*(n.$slideTrack.width()-o[0].offsetLeft-o.width()):0:o[0]?-1*o[0].offsetLeft:0,e+=(n.$list.width()-o.outerWidth())/2)),e},e.prototype.getOption=e.prototype.slickGetOption=function(i){return this.options[i]},e.prototype.getNavigableIndexes=function(){var i,e=this,t=0,o=0,s=[];for(!1===e.options.infinite?i=e.slideCount:(t=-1*e.options.slidesToScroll,o=-1*e.options.slidesToScroll,i=2*e.slideCount);t<i;)s.push(t),t=o+e.options.slidesToScroll,o+=e.options.slidesToScroll<=e.options.slidesToShow?e.options.slidesToScroll:e.options.slidesToShow;return s},e.prototype.getSlick=function(){return this},e.prototype.getSlideCount=function(){var e,t,o=this;return t=!0===o.options.centerMode?o.slideWidth*Math.floor(o.options.slidesToShow/2):0,!0===o.options.swipeToSlide?(o.$slideTrack.find(".slick-slide").each(function(s,n){if(n.offsetLeft-t+i(n).outerWidth()/2>-1*o.swipeLeft)return e=n,!1}),Math.abs(i(e).attr("data-slick-index")-o.currentSlide)||1):o.options.slidesToScroll},e.prototype.goTo=e.prototype.slickGoTo=function(i,e){this.changeSlide({data:{message:"index",index:parseInt(i)}},e)},e.prototype.init=function(e){var t=this;i(t.$slider).hasClass("slick-initialized")||(i(t.$slider).addClass("slick-initialized"),t.buildRows(),t.buildOut(),t.setProps(),t.startLoad(),t.loadSlider(),t.initializeEvents(),t.updateArrows(),t.updateDots(),t.checkResponsive(!0),t.focusHandler()),e&&t.$slider.trigger("init",[t]),!0===t.options.accessibility&&t.initADA(),t.options.autoplay&&(t.paused=!1,t.autoPlay())},e.prototype.initADA=function(){var e=this,t=Math.ceil(e.slideCount/e.options.slidesToShow),o=e.getNavigableIndexes().filter(function(i){return i>=0&&i<e.slideCount});e.$slides.add(e.$slideTrack.find(".slick-cloned")).attr({"aria-hidden":"true",tabindex:"-1"}).find("a, input, button, select").attr({tabindex:"-1"}),null!==e.$dots&&(e.$slides.not(e.$slideTrack.find(".slick-cloned")).each(function(t){var s=o.indexOf(t);if(i(this).attr({role:"tabpanel",id:"slick-slide"+e.instanceUid+t,tabindex:-1}),-1!==s){var n="slick-slide-control"+e.instanceUid+s;i("#"+n).length&&i(this).attr({"aria-describedby":n})}}),e.$dots.attr("role","tablist").find("li").each(function(s){var n=o[s];i(this).attr({role:"presentation"}),i(this).find("button").first().attr({role:"tab",id:"slick-slide-control"+e.instanceUid+s,"aria-controls":"slick-slide"+e.instanceUid+n,"aria-label":s+1+" of "+t,"aria-selected":null,tabindex:"-1"})}).eq(e.currentSlide).find("button").attr({"aria-selected":"true",tabindex:"0"}).end());for(var s=e.currentSlide,n=s+e.options.slidesToShow;s<n;s++)e.options.focusOnChange?e.$slides.eq(s).attr({tabindex:"0"}):e.$slides.eq(s).removeAttr("tabindex");e.activateADA()},e.prototype.initArrowEvents=function(){var i=this;!0===i.options.arrows&&i.slideCount>i.options.slidesToShow&&(i.$prevArrow.off("click.slick").on("click.slick",{message:"previous"},i.changeSlide),i.$nextArrow.off("click.slick").on("click.slick",{message:"next"},i.changeSlide),!0===i.options.accessibility&&(i.$prevArrow.on("keydown.slick",i.keyHandler),i.$nextArrow.on("keydown.slick",i.keyHandler)))},e.prototype.initDotEvents=function(){var e=this;!0===e.options.dots&&e.slideCount>e.options.slidesToShow&&(i("li",e.$dots).on("click.slick",{message:"index"},e.changeSlide),!0===e.options.accessibility&&e.$dots.on("keydown.slick",e.keyHandler)),!0===e.options.dots&&!0===e.options.pauseOnDotsHover&&e.slideCount>e.options.slidesToShow&&i("li",e.$dots).on("mouseenter.slick",i.proxy(e.interrupt,e,!0)).on("mouseleave.slick",i.proxy(e.interrupt,e,!1))},e.prototype.initSlideEvents=function(){var e=this;e.options.pauseOnHover&&(e.$list.on("mouseenter.slick",i.proxy(e.interrupt,e,!0)),e.$list.on("mouseleave.slick",i.proxy(e.interrupt,e,!1)))},e.prototype.initializeEvents=function(){var e=this;e.initArrowEvents(),e.initDotEvents(),e.initSlideEvents(),e.$list.on("touchstart.slick mousedown.slick",{action:"start"},e.swipeHandler),e.$list.on("touchmove.slick mousemove.slick",{action:"move"},e.swipeHandler),e.$list.on("touchend.slick mouseup.slick",{action:"end"},e.swipeHandler),e.$list.on("touchcancel.slick mouseleave.slick",{action:"end"},e.swipeHandler),e.$list.on("click.slick",e.clickHandler),i(document).on(e.visibilityChange,i.proxy(e.visibility,e)),!0===e.options.accessibility&&e.$list.on("keydown.slick",e.keyHandler),!0===e.options.focusOnSelect&&i(e.$slideTrack).children().on("click.slick",e.selectHandler),i(window).on("orientationchange.slick.slick-"+e.instanceUid,i.proxy(e.orientationChange,e)),i(window).on("resize.slick.slick-"+e.instanceUid,i.proxy(e.resize,e)),i("[draggable!=true]",e.$slideTrack).on("dragstart",e.preventDefault),i(window).on("load.slick.slick-"+e.instanceUid,e.setPosition),i(e.setPosition)},e.prototype.initUI=function(){var i=this;!0===i.options.arrows&&i.slideCount>i.options.slidesToShow&&(i.$prevArrow.show(),i.$nextArrow.show()),!0===i.options.dots&&i.slideCount>i.options.slidesToShow&&i.$dots.show()},e.prototype.keyHandler=function(i){var e=this;i.target.tagName.match("TEXTAREA|INPUT|SELECT")||(37===i.keyCode&&!0===e.options.accessibility?e.changeSlide({data:{message:!0===e.options.rtl?"next":"previous"}}):39===i.keyCode&&!0===e.options.accessibility&&e.changeSlide({data:{message:!0===e.options.rtl?"previous":"next"}}))},e.prototype.lazyLoad=function(){function e(e){i("img[data-lazy]",e).each(function(){var e=i(this),t=i(this).attr("data-lazy"),o=i(this).attr("data-srcset"),s=i(this).attr("data-sizes")||n.$slider.attr("data-sizes"),r=document.createElement("img");r.onload=function(){e.animate({opacity:0},100,function(){o&&(e.attr("srcset",o),s&&e.attr("sizes",s)),e.attr("src",t).animate({opacity:1},200,function(){e.removeAttr("data-lazy data-srcset data-sizes").removeClass("slick-loading")}),n.$slider.trigger("lazyLoaded",[n,e,t])})},r.onerror=function(){e.removeAttr("data-lazy").removeClass("slick-loading").addClass("slick-lazyload-error"),n.$slider.trigger("lazyLoadError",[n,e,t])},r.src=t})}var t,o,s,n=this;if(!0===n.options.centerMode?!0===n.options.infinite?s=(o=n.currentSlide+(n.options.slidesToShow/2+1))+n.options.slidesToShow+2:(o=Math.max(0,n.currentSlide-(n.options.slidesToShow/2+1)),s=n.options.slidesToShow/2+1+2+n.currentSlide):(o=n.options.infinite?n.options.slidesToShow+n.currentSlide:n.currentSlide,s=Math.ceil(o+n.options.slidesToShow),!0===n.options.fade&&(o>0&&o--,s<=n.slideCount&&s++)),t=n.$slider.find(".slick-slide").slice(o,s),"anticipated"===n.options.lazyLoad)for(var r=o-1,l=s,d=n.$slider.find(".slick-slide"),a=0;a<n.options.slidesToScroll;a++)r<0&&(r=n.slideCount-1),t=(t=t.add(d.eq(r))).add(d.eq(l)),r--,l++;e(t),n.slideCount<=n.options.slidesToShow?e(n.$slider.find(".slick-slide")):n.currentSlide>=n.slideCount-n.options.slidesToShow?e(n.$slider.find(".slick-cloned").slice(0,n.options.slidesToShow)):0===n.currentSlide&&e(n.$slider.find(".slick-cloned").slice(-1*n.options.slidesToShow))},e.prototype.loadSlider=function(){var i=this;i.setPosition(),i.$slideTrack.css({opacity:1}),i.$slider.removeClass("slick-loading"),i.initUI(),"progressive"===i.options.lazyLoad&&i.progressiveLazyLoad()},e.prototype.next=e.prototype.slickNext=function(){this.changeSlide({data:{message:"next"}})},e.prototype.orientationChange=function(){var i=this;i.checkResponsive(),i.setPosition()},e.prototype.pause=e.prototype.slickPause=function(){var i=this;i.autoPlayClear(),i.paused=!0},e.prototype.play=e.prototype.slickPlay=function(){var i=this;i.autoPlay(),i.options.autoplay=!0,i.paused=!1,i.focussed=!1,i.interrupted=!1},e.prototype.postSlide=function(e){var t=this;t.unslicked||(t.$slider.trigger("afterChange",[t,e]),t.animating=!1,t.slideCount>t.options.slidesToShow&&t.setPosition(),t.swipeLeft=null,t.options.autoplay&&t.autoPlay(),!0===t.options.accessibility&&(t.initADA(),t.options.focusOnChange&&i(t.$slides.get(t.currentSlide)).attr("tabindex",0).focus()))},e.prototype.prev=e.prototype.slickPrev=function(){this.changeSlide({data:{message:"previous"}})},e.prototype.preventDefault=function(i){i.preventDefault()},e.prototype.progressiveLazyLoad=function(e){e=e||1;var t,o,s,n,r,l=this,d=i("img[data-lazy]",l.$slider);d.length?(t=d.first(),o=t.attr("data-lazy"),s=t.attr("data-srcset"),n=t.attr("data-sizes")||l.$slider.attr("data-sizes"),(r=document.createElement("img")).onload=function(){s&&(t.attr("srcset",s),n&&t.attr("sizes",n)),t.attr("src",o).removeAttr("data-lazy data-srcset data-sizes").removeClass("slick-loading"),!0===l.options.adaptiveHeight&&l.setPosition(),l.$slider.trigger("lazyLoaded",[l,t,o]),l.progressiveLazyLoad()},r.onerror=function(){e<3?setTimeout(function(){l.progressiveLazyLoad(e+1)},500):(t.removeAttr("data-lazy").removeClass("slick-loading").addClass("slick-lazyload-error"),l.$slider.trigger("lazyLoadError",[l,t,o]),l.progressiveLazyLoad())},r.src=o):l.$slider.trigger("allImagesLoaded",[l])},e.prototype.refresh=function(e){var t,o,s=this;o=s.slideCount-s.options.slidesToShow,!s.options.infinite&&s.currentSlide>o&&(s.currentSlide=o),s.slideCount<=s.options.slidesToShow&&(s.currentSlide=0),t=s.currentSlide,s.destroy(!0),i.extend(s,s.initials,{currentSlide:t}),s.init(),e||s.changeSlide({data:{message:"index",index:t}},!1)},e.prototype.registerBreakpoints=function(){var e,t,o,s=this,n=s.options.responsive||null;if("array"===i.type(n)&&n.length){s.respondTo=s.options.respondTo||"window";for(e in n)if(o=s.breakpoints.length-1,n.hasOwnProperty(e)){for(t=n[e].breakpoint;o>=0;)s.breakpoints[o]&&s.breakpoints[o]===t&&s.breakpoints.splice(o,1),o--;s.breakpoints.push(t),s.breakpointSettings[t]=n[e].settings}s.breakpoints.sort(function(i,e){return s.options.mobileFirst?i-e:e-i})}},e.prototype.reinit=function(){var e=this;e.$slides=e.$slideTrack.children(e.options.slide).addClass("slick-slide"),e.slideCount=e.$slides.length,e.currentSlide>=e.slideCount&&0!==e.currentSlide&&(e.currentSlide=e.currentSlide-e.options.slidesToScroll),e.slideCount<=e.options.slidesToShow&&(e.currentSlide=0),e.registerBreakpoints(),e.setProps(),e.setupInfinite(),e.buildArrows(),e.updateArrows(),e.initArrowEvents(),e.buildDots(),e.updateDots(),e.initDotEvents(),e.cleanUpSlideEvents(),e.initSlideEvents(),e.checkResponsive(!1,!0),!0===e.options.focusOnSelect&&i(e.$slideTrack).children().on("click.slick",e.selectHandler),e.setSlideClasses("number"==typeof e.currentSlide?e.currentSlide:0),e.setPosition(),e.focusHandler(),e.paused=!e.options.autoplay,e.autoPlay(),e.$slider.trigger("reInit",[e])},e.prototype.resize=function(){var e=this;i(window).width()!==e.windowWidth&&(clearTimeout(e.windowDelay),e.windowDelay=window.setTimeout(function(){e.windowWidth=i(window).width(),e.checkResponsive(),e.unslicked||e.setPosition()},50))},e.prototype.removeSlide=e.prototype.slickRemove=function(i,e,t){var o=this;if(i="boolean"==typeof i?!0===(e=i)?0:o.slideCount-1:!0===e?--i:i,o.slideCount<1||i<0||i>o.slideCount-1)return!1;o.unload(),!0===t?o.$slideTrack.children().remove():o.$slideTrack.children(this.options.slide).eq(i).remove(),o.$slides=o.$slideTrack.children(this.options.slide),o.$slideTrack.children(this.options.slide).detach(),o.$slideTrack.append(o.$slides),o.$slidesCache=o.$slides,o.reinit()},e.prototype.setCSS=function(i){var e,t,o=this,s={};!0===o.options.rtl&&(i=-i),e="left"==o.positionProp?Math.ceil(i)+"px":"0px",t="top"==o.positionProp?Math.ceil(i)+"px":"0px",s[o.positionProp]=i,!1===o.transformsEnabled?o.$slideTrack.css(s):(s={},!1===o.cssTransitions?(s[o.animType]="translate("+e+", "+t+")",o.$slideTrack.css(s)):(s[o.animType]="translate3d("+e+", "+t+", 0px)",o.$slideTrack.css(s)))},e.prototype.setDimensions=function(){var i=this;!1===i.options.vertical?!0===i.options.centerMode&&i.$list.css({padding:"0px "+i.options.centerPadding}):(i.$list.height(i.$slides.first().outerHeight(!0)*i.options.slidesToShow),!0===i.options.centerMode&&i.$list.css({padding:i.options.centerPadding+" 0px"})),i.listWidth=i.$list.width(),i.listHeight=i.$list.height(),!1===i.options.vertical&&!1===i.options.variableWidth?(i.slideWidth=Math.ceil(i.listWidth/i.options.slidesToShow),i.$slideTrack.width(Math.ceil(i.slideWidth*i.$slideTrack.children(".slick-slide").length))):!0===i.options.variableWidth?i.$slideTrack.width(5e3*i.slideCount):(i.slideWidth=Math.ceil(i.listWidth),i.$slideTrack.height(Math.ceil(i.$slides.first().outerHeight(!0)*i.$slideTrack.children(".slick-slide").length)));var e=i.$slides.first().outerWidth(!0)-i.$slides.first().width();!1===i.options.variableWidth&&i.$slideTrack.children(".slick-slide").width(i.slideWidth-e)},e.prototype.setFade=function(){var e,t=this;t.$slides.each(function(o,s){e=t.slideWidth*o*-1,!0===t.options.rtl?i(s).css({position:"relative",right:e,top:0,zIndex:t.options.zIndex-2,opacity:0}):i(s).css({position:"relative",left:e,top:0,zIndex:t.options.zIndex-2,opacity:0})}),t.$slides.eq(t.currentSlide).css({zIndex:t.options.zIndex-1,opacity:1})},e.prototype.setHeight=function(){var i=this;if(1===i.options.slidesToShow&&!0===i.options.adaptiveHeight&&!1===i.options.vertical){var e=i.$slides.eq(i.currentSlide).outerHeight(!0);i.$list.css("height",e)}},e.prototype.setOption=e.prototype.slickSetOption=function(){var e,t,o,s,n,r=this,l=!1;if("object"===i.type(arguments[0])?(o=arguments[0],l=arguments[1],n="multiple"):"string"===i.type(arguments[0])&&(o=arguments[0],s=arguments[1],l=arguments[2],"responsive"===arguments[0]&&"array"===i.type(arguments[1])?n="responsive":void 0!==arguments[1]&&(n="single")),"single"===n)r.options[o]=s;else if("multiple"===n)i.each(o,function(i,e){r.options[i]=e});else if("responsive"===n)for(t in s)if("array"!==i.type(r.options.responsive))r.options.responsive=[s[t]];else{for(e=r.options.responsive.length-1;e>=0;)r.options.responsive[e].breakpoint===s[t].breakpoint&&r.options.responsive.splice(e,1),e--;r.options.responsive.push(s[t])}l&&(r.unload(),r.reinit())},e.prototype.setPosition=function(){var i=this;i.setDimensions(),i.setHeight(),!1===i.options.fade?i.setCSS(i.getLeft(i.currentSlide)):i.setFade(),i.$slider.trigger("setPosition",[i])},e.prototype.setProps=function(){var i=this,e=document.body.style;i.positionProp=!0===i.options.vertical?"top":"left","top"===i.positionProp?i.$slider.addClass("slick-vertical"):i.$slider.removeClass("slick-vertical"),void 0===e.WebkitTransition&&void 0===e.MozTransition&&void 0===e.msTransition||!0===i.options.useCSS&&(i.cssTransitions=!0),i.options.fade&&("number"==typeof i.options.zIndex?i.options.zIndex<3&&(i.options.zIndex=3):i.options.zIndex=i.defaults.zIndex),void 0!==e.OTransform&&(i.animType="OTransform",i.transformType="-o-transform",i.transitionType="OTransition",void 0===e.perspectiveProperty&&void 0===e.webkitPerspective&&(i.animType=!1)),void 0!==e.MozTransform&&(i.animType="MozTransform",i.transformType="-moz-transform",i.transitionType="MozTransition",void 0===e.perspectiveProperty&&void 0===e.MozPerspective&&(i.animType=!1)),void 0!==e.webkitTransform&&(i.animType="webkitTransform",i.transformType="-webkit-transform",i.transitionType="webkitTransition",void 0===e.perspectiveProperty&&void 0===e.webkitPerspective&&(i.animType=!1)),void 0!==e.msTransform&&(i.animType="msTransform",i.transformType="-ms-transform",i.transitionType="msTransition",void 0===e.msTransform&&(i.animType=!1)),void 0!==e.transform&&!1!==i.animType&&(i.animType="transform",i.transformType="transform",i.transitionType="transition"),i.transformsEnabled=i.options.useTransform&&null!==i.animType&&!1!==i.animType},e.prototype.setSlideClasses=function(i){var e,t,o,s,n=this;if(t=n.$slider.find(".slick-slide").removeClass("slick-active slick-center slick-current").attr("aria-hidden","true"),n.$slides.eq(i).addClass("slick-current"),!0===n.options.centerMode){var r=n.options.slidesToShow%2==0?1:0;e=Math.floor(n.options.slidesToShow/2),!0===n.options.infinite&&(i>=e&&i<=n.slideCount-1-e?n.$slides.slice(i-e+r,i+e+1).addClass("slick-active").attr("aria-hidden","false"):(o=n.options.slidesToShow+i,t.slice(o-e+1+r,o+e+2).addClass("slick-active").attr("aria-hidden","false")),0===i?t.eq(t.length-1-n.options.slidesToShow).addClass("slick-center"):i===n.slideCount-1&&t.eq(n.options.slidesToShow).addClass("slick-center")),n.$slides.eq(i).addClass("slick-center")}else i>=0&&i<=n.slideCount-n.options.slidesToShow?n.$slides.slice(i,i+n.options.slidesToShow).addClass("slick-active").attr("aria-hidden","false"):t.length<=n.options.slidesToShow?t.addClass("slick-active").attr("aria-hidden","false"):(s=n.slideCount%n.options.slidesToShow,o=!0===n.options.infinite?n.options.slidesToShow+i:i,n.options.slidesToShow==n.options.slidesToScroll&&n.slideCount-i<n.options.slidesToShow?t.slice(o-(n.options.slidesToShow-s),o+s).addClass("slick-active").attr("aria-hidden","false"):t.slice(o,o+n.options.slidesToShow).addClass("slick-active").attr("aria-hidden","false"));"ondemand"!==n.options.lazyLoad&&"anticipated"!==n.options.lazyLoad||n.lazyLoad()},e.prototype.setupInfinite=function(){var e,t,o,s=this;if(!0===s.options.fade&&(s.options.centerMode=!1),!0===s.options.infinite&&!1===s.options.fade&&(t=null,s.slideCount>s.options.slidesToShow)){for(o=!0===s.options.centerMode?s.options.slidesToShow+1:s.options.slidesToShow,e=s.slideCount;e>s.slideCount-o;e-=1)t=e-1,i(s.$slides[t]).clone(!0).attr("id","").attr("data-slick-index",t-s.slideCount).prependTo(s.$slideTrack).addClass("slick-cloned");for(e=0;e<o+s.slideCount;e+=1)t=e,i(s.$slides[t]).clone(!0).attr("id","").attr("data-slick-index",t+s.slideCount).appendTo(s.$slideTrack).addClass("slick-cloned");s.$slideTrack.find(".slick-cloned").find("[id]").each(function(){i(this).attr("id","")})}},e.prototype.interrupt=function(i){var e=this;i||e.autoPlay(),e.interrupted=i},e.prototype.selectHandler=function(e){var t=this,o=i(e.target).is(".slick-slide")?i(e.target):i(e.target).parents(".slick-slide"),s=parseInt(o.attr("data-slick-index"));s||(s=0),t.slideCount<=t.options.slidesToShow?t.slideHandler(s,!1,!0):t.slideHandler(s)},e.prototype.slideHandler=function(i,e,t){var o,s,n,r,l,d=null,a=this;if(e=e||!1,!(!0===a.animating&&!0===a.options.waitForAnimate||!0===a.options.fade&&a.currentSlide===i))if(!1===e&&a.asNavFor(i),o=i,d=a.getLeft(o),r=a.getLeft(a.currentSlide),a.currentLeft=null===a.swipeLeft?r:a.swipeLeft,!1===a.options.infinite&&!1===a.options.centerMode&&(i<0||i>a.getDotCount()*a.options.slidesToScroll))!1===a.options.fade&&(o=a.currentSlide,!0!==t&&a.slideCount>a.options.slidesToShow?a.animateSlide(r,function(){a.postSlide(o)}):a.postSlide(o));else if(!1===a.options.infinite&&!0===a.options.centerMode&&(i<0||i>a.slideCount-a.options.slidesToScroll))!1===a.options.fade&&(o=a.currentSlide,!0!==t&&a.slideCount>a.options.slidesToShow?a.animateSlide(r,function(){a.postSlide(o)}):a.postSlide(o));else{if(a.options.autoplay&&clearInterval(a.autoPlayTimer),s=o<0?a.slideCount%a.options.slidesToScroll!=0?a.slideCount-a.slideCount%a.options.slidesToScroll:a.slideCount+o:o>=a.slideCount?a.slideCount%a.options.slidesToScroll!=0?0:o-a.slideCount:o,a.animating=!0,a.$slider.trigger("beforeChange",[a,a.currentSlide,s]),n=a.currentSlide,a.currentSlide=s,a.setSlideClasses(a.currentSlide),a.options.asNavFor&&(l=(l=a.getNavTarget()).slick("getSlick")).slideCount<=l.options.slidesToShow&&l.setSlideClasses(a.currentSlide),a.updateDots(),a.updateArrows(),!0===a.options.fade)return!0!==t?(a.fadeSlideOut(n),a.fadeSlide(s,function(){a.postSlide(s)})):a.postSlide(s),void a.animateHeight();!0!==t&&a.slideCount>a.options.slidesToShow?a.animateSlide(d,function(){a.postSlide(s)}):a.postSlide(s)}},e.prototype.startLoad=function(){var i=this;!0===i.options.arrows&&i.slideCount>i.options.slidesToShow&&(i.$prevArrow.hide(),i.$nextArrow.hide()),!0===i.options.dots&&i.slideCount>i.options.slidesToShow&&i.$dots.hide(),i.$slider.addClass("slick-loading")},e.prototype.swipeDirection=function(){var i,e,t,o,s=this;return i=s.touchObject.startX-s.touchObject.curX,e=s.touchObject.startY-s.touchObject.curY,t=Math.atan2(e,i),(o=Math.round(180*t/Math.PI))<0&&(o=360-Math.abs(o)),o<=45&&o>=0?!1===s.options.rtl?"left":"right":o<=360&&o>=315?!1===s.options.rtl?"left":"right":o>=135&&o<=225?!1===s.options.rtl?"right":"left":!0===s.options.verticalSwiping?o>=35&&o<=135?"down":"up":"vertical"},e.prototype.swipeEnd=function(i){var e,t,o=this;if(o.dragging=!1,o.swiping=!1,o.scrolling)return o.scrolling=!1,!1;if(o.interrupted=!1,o.shouldClick=!(o.touchObject.swipeLength>10),void 0===o.touchObject.curX)return!1;if(!0===o.touchObject.edgeHit&&o.$slider.trigger("edge",[o,o.swipeDirection()]),o.touchObject.swipeLength>=o.touchObject.minSwipe){switch(t=o.swipeDirection()){case"left":case"down":e=o.options.swipeToSlide?o.checkNavigable(o.currentSlide+o.getSlideCount()):o.currentSlide+o.getSlideCount(),o.currentDirection=0;break;case"right":case"up":e=o.options.swipeToSlide?o.checkNavigable(o.currentSlide-o.getSlideCount()):o.currentSlide-o.getSlideCount(),o.currentDirection=1}"vertical"!=t&&(o.slideHandler(e),o.touchObject={},o.$slider.trigger("swipe",[o,t]))}else o.touchObject.startX!==o.touchObject.curX&&(o.slideHandler(o.currentSlide),o.touchObject={})},e.prototype.swipeHandler=function(i){var e=this;if(!(!1===e.options.swipe||"ontouchend"in document&&!1===e.options.swipe||!1===e.options.draggable&&-1!==i.type.indexOf("mouse")))switch(e.touchObject.fingerCount=i.originalEvent&&void 0!==i.originalEvent.touches?i.originalEvent.touches.length:1,e.touchObject.minSwipe=e.listWidth/e.options.touchThreshold,!0===e.options.verticalSwiping&&(e.touchObject.minSwipe=e.listHeight/e.options.touchThreshold),i.data.action){case"start":e.swipeStart(i);break;case"move":e.swipeMove(i);break;case"end":e.swipeEnd(i)}},e.prototype.swipeMove=function(i){var e,t,o,s,n,r,l=this;return n=void 0!==i.originalEvent?i.originalEvent.touches:null,!(!l.dragging||l.scrolling||n&&1!==n.length)&&(e=l.getLeft(l.currentSlide),l.touchObject.curX=void 0!==n?n[0].pageX:i.clientX,l.touchObject.curY=void 0!==n?n[0].pageY:i.clientY,l.touchObject.swipeLength=Math.round(Math.sqrt(Math.pow(l.touchObject.curX-l.touchObject.startX,2))),r=Math.round(Math.sqrt(Math.pow(l.touchObject.curY-l.touchObject.startY,2))),!l.options.verticalSwiping&&!l.swiping&&r>4?(l.scrolling=!0,!1):(!0===l.options.verticalSwiping&&(l.touchObject.swipeLength=r),t=l.swipeDirection(),void 0!==i.originalEvent&&l.touchObject.swipeLength>4&&(l.swiping=!0,i.preventDefault()),s=(!1===l.options.rtl?1:-1)*(l.touchObject.curX>l.touchObject.startX?1:-1),!0===l.options.verticalSwiping&&(s=l.touchObject.curY>l.touchObject.startY?1:-1),o=l.touchObject.swipeLength,l.touchObject.edgeHit=!1,!1===l.options.infinite&&(0===l.currentSlide&&"right"===t||l.currentSlide>=l.getDotCount()&&"left"===t)&&(o=l.touchObject.swipeLength*l.options.edgeFriction,l.touchObject.edgeHit=!0),!1===l.options.vertical?l.swipeLeft=e+o*s:l.swipeLeft=e+o*(l.$list.height()/l.listWidth)*s,!0===l.options.verticalSwiping&&(l.swipeLeft=e+o*s),!0!==l.options.fade&&!1!==l.options.touchMove&&(!0===l.animating?(l.swipeLeft=null,!1):void l.setCSS(l.swipeLeft))))},e.prototype.swipeStart=function(i){var e,t=this;if(t.interrupted=!0,1!==t.touchObject.fingerCount||t.slideCount<=t.options.slidesToShow)return t.touchObject={},!1;void 0!==i.originalEvent&&void 0!==i.originalEvent.touches&&(e=i.originalEvent.touches[0]),t.touchObject.startX=t.touchObject.curX=void 0!==e?e.pageX:i.clientX,t.touchObject.startY=t.touchObject.curY=void 0!==e?e.pageY:i.clientY,t.dragging=!0},e.prototype.unfilterSlides=e.prototype.slickUnfilter=function(){var i=this;null!==i.$slidesCache&&(i.unload(),i.$slideTrack.children(this.options.slide).detach(),i.$slidesCache.appendTo(i.$slideTrack),i.reinit())},e.prototype.unload=function(){var e=this;i(".slick-cloned",e.$slider).remove(),e.$dots&&e.$dots.remove(),e.$prevArrow&&e.htmlExpr.test(e.options.prevArrow)&&e.$prevArrow.remove(),e.$nextArrow&&e.htmlExpr.test(e.options.nextArrow)&&e.$nextArrow.remove(),e.$slides.removeClass("slick-slide slick-active slick-visible slick-current").attr("aria-hidden","true").css("width","")},e.prototype.unslick=function(i){var e=this;e.$slider.trigger("unslick",[e,i]),e.destroy()},e.prototype.updateArrows=function(){var i=this;Math.floor(i.options.slidesToShow/2),!0===i.options.arrows&&i.slideCount>i.options.slidesToShow&&!i.options.infinite&&(i.$prevArrow.removeClass("slick-disabled").attr("aria-disabled","false"),i.$nextArrow.removeClass("slick-disabled").attr("aria-disabled","false"),0===i.currentSlide?(i.$prevArrow.addClass("slick-disabled").attr("aria-disabled","true"),i.$nextArrow.removeClass("slick-disabled").attr("aria-disabled","false")):i.currentSlide>=i.slideCount-i.options.slidesToShow&&!1===i.options.centerMode?(i.$nextArrow.addClass("slick-disabled").attr("aria-disabled","true"),i.$prevArrow.removeClass("slick-disabled").attr("aria-disabled","false")):i.currentSlide>=i.slideCount-1&&!0===i.options.centerMode&&(i.$nextArrow.addClass("slick-disabled").attr("aria-disabled","true"),i.$prevArrow.removeClass("slick-disabled").attr("aria-disabled","false")))},e.prototype.updateDots=function(){var i=this;null!==i.$dots&&(i.$dots.find("li").removeClass("slick-active").end(),i.$dots.find("li").eq(Math.floor(i.currentSlide/i.options.slidesToScroll)).addClass("slick-active"))},e.prototype.visibility=function(){var i=this;i.options.autoplay&&(document[i.hidden]?i.interrupted=!0:i.interrupted=!1)},i.fn.slick=function(){var i,t,o=this,s=arguments[0],n=Array.prototype.slice.call(arguments,1),r=o.length;for(i=0;i<r;i++)if("object"==typeof s||void 0===s?o[i].slick=new e(o[i],s):t=o[i].slick[s].apply(o[i].slick,n),void 0!==t)return t;return o}});

/*
 * jQuery Tabs plugin
 */

;(function($, $win) {
	'use strict';

	function Tabset($holder, options) {
		this.$holder = $holder;
		this.options = options;

		this.init();
	}

	Tabset.prototype = {
		init: function() {
			this.$tabLinks = this.$holder.find(this.options.tabLinks);

			this.setStartActiveIndex();
			this.setActiveTab();

			if (this.options.autoHeight) {
				this.$tabHolder = $(this.$tabLinks.eq(0).attr(this.options.attrib)).parent();
			}

			this.makeCallback('onInit', this);
		},

		setStartActiveIndex: function() {
			var $classTargets = this.getClassTarget(this.$tabLinks);
			var $activeLink = $classTargets.filter('.' + this.options.activeClass);
			var $hashLink = this.$tabLinks.filter('[' + this.options.attrib + '="' + location.hash + '"]');
			var activeIndex;

			if (this.options.checkHash && $hashLink.length) {
				$activeLink = $hashLink;
			}

			activeIndex = $classTargets.index($activeLink);

			this.activeTabIndex = this.prevTabIndex = (activeIndex === -1 ? (this.options.defaultTab ? 0 : null) : activeIndex);
		},

		setActiveTab: function() {
			var self = this;

			this.$tabLinks.each(function(i, link) {
				var $link = $(link);
				var $classTarget = self.getClassTarget($link);
				var $tab = $($link.attr(self.options.attrib));

				if (i !== self.activeTabIndex) {
					$classTarget.removeClass(self.options.activeClass);
					$tab.addClass(self.options.tabHiddenClass).removeClass(self.options.activeClass);
				} else {
					$classTarget.addClass(self.options.activeClass);
					$tab.removeClass(self.options.tabHiddenClass).addClass(self.options.activeClass);
				}

				self.attachTabLink($link, i);
			});
		},

		attachTabLink: function($link, i) {
			var self = this;

			$link.on(this.options.event + '.tabset', function(e) {
				e.preventDefault();

				if (self.activeTabIndex === self.prevTabIndex && self.activeTabIndex !== i) {
					self.activeTabIndex = i;
					self.switchTabs();
				}
			});
		},

		resizeHolder: function(height) {
			var self = this;

			if (height) {
				this.$tabHolder.height(height);
				setTimeout(function() {
					self.$tabHolder.addClass('transition');
				}, 10);
			} else {
				self.$tabHolder.removeClass('transition').height('');
			}
		},

		switchTabs: function() {
			var self = this;

			var $prevLink = this.$tabLinks.eq(this.prevTabIndex);
			var $nextLink = this.$tabLinks.eq(this.activeTabIndex);

			var $prevTab = this.getTab($prevLink);
			var $nextTab = this.getTab($nextLink);

			$prevTab.removeClass(this.options.activeClass);

			if (self.haveTabHolder()) {
				this.resizeHolder($prevTab.outerHeight());
			}

			setTimeout(function() {
				self.getClassTarget($prevLink).removeClass(self.options.activeClass);

				$prevTab.addClass(self.options.tabHiddenClass);
				$nextTab.removeClass(self.options.tabHiddenClass).addClass(self.options.activeClass);

				self.getClassTarget($nextLink).addClass(self.options.activeClass);

				if (self.haveTabHolder()) {
					self.resizeHolder($nextTab.outerHeight());

					setTimeout(function() {
						self.resizeHolder();
						self.prevTabIndex = self.activeTabIndex;
						self.makeCallback('onChange', self);
					}, self.options.animSpeed);
				} else {
					self.prevTabIndex = self.activeTabIndex;
				}
			}, this.options.autoHeight ? this.options.animSpeed : 1);
		},

		getClassTarget: function($link) {
			return this.options.addToParent ? $link.parent() : $link;
		},

		getActiveTab: function() {
			return this.getTab(this.$tabLinks.eq(this.activeTabIndex));
		},

		getTab: function($link) {
			return $($link.attr(this.options.attrib));
		},

		haveTabHolder: function() {
			return this.$tabHolder && this.$tabHolder.length;
		},

		destroy: function() {
			var self = this;

			this.$tabLinks.off('.tabset').each(function() {
				var $link = $(this);

				self.getClassTarget($link).removeClass(self.options.activeClass);
				$($link.attr(self.options.attrib)).removeClass(self.options.activeClass + ' ' + self.options.tabHiddenClass);
			});

			this.$holder.removeData('Tabset');
		},

		makeCallback: function(name) {
			if (typeof this.options[name] === 'function') {
				var args = Array.prototype.slice.call(arguments);
				args.shift();
				this.options[name].apply(this, args);
			}
		}
	};

	$.fn.tabset = function(opt) {
		var args = Array.prototype.slice.call(arguments);
		var method = args[0];

		var options = $.extend({
			activeClass: 'active',
			addToParent: false,
			autoHeight: false,
			checkHash: false,
			defaultTab: true,
			animSpeed: 500,
			tabLinks: 'a',
			attrib: 'href',
			event: 'click',
			tabHiddenClass: 'js-tab-hidden'
		}, opt);
		options.autoHeight = options.autoHeight && $.support.opacity;

		return this.each(function() {
			var $holder = jQuery(this);
			var instance = $holder.data('Tabset');

			if (typeof opt === 'object' || typeof opt === 'undefined') {
				$holder.data('Tabset', new Tabset($holder, options));
			} else if (typeof method === 'string' && instance) {
				if (typeof instance[method] === 'function') {
					args.shift();
					instance[method].apply(instance, args);
				}
			}
		});
	};
}(jQuery, jQuery(window)));

/*
 * Responsive Layout helper
 */
window.ResponsiveHelper = (function($){
	// init variables
	var handlers = [],
		prevWinWidth,
		win = $(window),
		nativeMatchMedia = false;

	// detect match media support
	if(window.matchMedia) {
		if(window.Window && window.matchMedia === Window.prototype.matchMedia) {
			nativeMatchMedia = true;
		} else if(window.matchMedia.toString().indexOf('native') > -1) {
			nativeMatchMedia = true;
		}
	}

	// prepare resize handler
	function resizeHandler() {
		var winWidth = win.width();
		if(winWidth !== prevWinWidth) {
			prevWinWidth = winWidth;

			// loop through range groups
			$.each(handlers, function(index, rangeObject){
				// disable current active area if needed
				$.each(rangeObject.data, function(property, item) {
					if(item.currentActive && !matchRange(item.range[0], item.range[1])) {
						item.currentActive = false;
						if(typeof item.disableCallback === 'function') {
							item.disableCallback();
						}
					}
				});

				// enable areas that match current width
				$.each(rangeObject.data, function(property, item) {
					if(!item.currentActive && matchRange(item.range[0], item.range[1])) {
						// make callback
						item.currentActive = true;
						if(typeof item.enableCallback === 'function') {
							item.enableCallback();
						}
					}
				});
			});
		}
	}
	win.bind('load resize orientationchange', resizeHandler);

	// test range
	function matchRange(r1, r2) {
		var mediaQueryString = '';
		if(r1 > 0) {
			mediaQueryString += '(min-width: ' + r1 + 'px)';
		}
		if(r2 < Infinity) {
			mediaQueryString += (mediaQueryString ? ' and ' : '') + '(max-width: ' + r2 + 'px)';
		}
		return matchQuery(mediaQueryString, r1, r2);
	}

	// media query function
	function matchQuery(query, r1, r2) {
		if(window.matchMedia && nativeMatchMedia) {
			return matchMedia(query).matches;
		} else if(window.styleMedia) {
			return styleMedia.matchMedium(query);
		} else if(window.media) {
			return media.matchMedium(query);
		} else {
			return prevWinWidth >= r1 && prevWinWidth <= r2;
		}
	}

	// range parser
	function parseRange(rangeStr) {
		var rangeData = rangeStr.split('..');
		var x1 = parseInt(rangeData[0], 10) || -Infinity;
		var x2 = parseInt(rangeData[1], 10) || Infinity;
		return [x1, x2].sort(function(a, b){
			return a - b;
		});
	}

	// export public functions
	return {
		addRange: function(ranges) {
			// parse data and add items to collection
			var result = {data:{}};
			$.each(ranges, function(property, data){
				result.data[property] = {
					range: parseRange(property),
					enableCallback: data.on,
					disableCallback: data.off
				};
			});
			handlers.push(result);

			// call resizeHandler to recalculate all events
			prevWinWidth = null;
			resizeHandler();
		}
	};
}(jQuery));

/*
 * jQuery Open/Close plugin
 */
;(function($) {
	function OpenClose(options) {
		this.options = $.extend({
			addClassBeforeAnimation: true,
			hideOnClickOutside: false,
			activeClass: 'active',
			opener: '.opener',
			slider: '.slide',
			animSpeed: 400,
			effect: 'fade',
			event: 'click'
		}, options);
		this.init();
	}
	OpenClose.prototype = {
		init: function() {
			if (this.options.holder) {
				this.findElements();
				this.attachEvents();
				this.makeCallback('onInit', this);
			}
		},
		findElements: function() {
			this.holder = $(this.options.holder);
			this.opener = this.holder.find(this.options.opener);
			this.slider = this.holder.find(this.options.slider);
		},
		attachEvents: function() {
			// add handler
			var self = this;
			this.eventHandler = function(e) {
				e.preventDefault();
				if (self.slider.hasClass(slideHiddenClass)) {
					self.showSlide();
				} else {
					self.hideSlide();
				}
			};
			self.opener.on(self.options.event, this.eventHandler);

			// hover mode handler
			if (self.options.event === 'hover') {
				self.opener.on('mouseenter', function() {
					if (!self.holder.hasClass(self.options.activeClass)) {
						self.showSlide();
					}
				});
				self.holder.on('mouseleave', function() {
					self.hideSlide();
				});
			}

			// outside click handler
			self.outsideClickHandler = function(e) {
				if (self.options.hideOnClickOutside) {
					var target = $(e.target);
					if (!target.is(self.holder) && !target.closest(self.holder).length) {
						self.hideSlide();
					}
				}
			};

			// set initial styles
			if (this.holder.hasClass(this.options.activeClass)) {
				$(document).on('click touchstart', self.outsideClickHandler);
			} else {
				this.slider.addClass(slideHiddenClass);
			}
		},
		showSlide: function() {
			var self = this;
			if (self.options.addClassBeforeAnimation) {
				self.holder.addClass(self.options.activeClass);
			}
			self.slider.removeClass(slideHiddenClass);
			$(document).on('click touchstart', self.outsideClickHandler);

			self.makeCallback('animStart', true);
			toggleEffects[self.options.effect].show({
				box: self.slider,
				speed: self.options.animSpeed,
				complete: function() {
					if (!self.options.addClassBeforeAnimation) {
						self.holder.addClass(self.options.activeClass);
					}
					self.makeCallback('animEnd', true);
				}
			});
		},
		hideSlide: function() {
			var self = this;
			if (self.options.addClassBeforeAnimation) {
				self.holder.removeClass(self.options.activeClass);
			}
			$(document).off('click touchstart', self.outsideClickHandler);

			self.makeCallback('animStart', false);
			toggleEffects[self.options.effect].hide({
				box: self.slider,
				speed: self.options.animSpeed,
				complete: function() {
					if (!self.options.addClassBeforeAnimation) {
						self.holder.removeClass(self.options.activeClass);
					}
					self.slider.addClass(slideHiddenClass);
					self.makeCallback('animEnd', false);
				}
			});
		},
		destroy: function() {
			this.slider.removeClass(slideHiddenClass).css({
				display: ''
			});
			this.opener.off(this.options.event, this.eventHandler);
			this.holder.removeClass(this.options.activeClass).removeData('OpenClose');
			$(document).off('click touchstart', this.outsideClickHandler);
		},
		makeCallback: function(name) {
			if (typeof this.options[name] === 'function') {
				var args = Array.prototype.slice.call(arguments);
				args.shift();
				this.options[name].apply(this, args);
			}
		}
	};

	// add stylesheet for slide on DOMReady
	var slideHiddenClass = 'js-slide-hidden';
	(function() {
		var tabStyleSheet = $('<style type="text/css">')[0];
		var tabStyleRule = '.' + slideHiddenClass;
		tabStyleRule += '{position:absolute !important;left:-9999px !important;top:-9999px !important;display:block !important}';
		if (tabStyleSheet.styleSheet) {
			tabStyleSheet.styleSheet.cssText = tabStyleRule;
		} else {
			tabStyleSheet.appendChild(document.createTextNode(tabStyleRule));
		}
		$('head').append(tabStyleSheet);
	}());

	// animation effects
	var toggleEffects = {
		slide: {
			show: function(o) {
				o.box.stop(true).hide().slideDown(o.speed, o.complete);
			},
			hide: function(o) {
				o.box.stop(true).slideUp(o.speed, o.complete);
			}
		},
		fade: {
			show: function(o) {
				o.box.stop(true).hide().fadeIn(o.speed, o.complete);
			},
			hide: function(o) {
				o.box.stop(true).fadeOut(o.speed, o.complete);
			}
		},
		none: {
			show: function(o) {
				o.box.hide().show(0, o.complete);
			},
			hide: function(o) {
				o.box.hide(0, o.complete);
			}
		}
	};

	// jQuery plugin interface
	$.fn.openClose = function(opt) {
		var args = Array.prototype.slice.call(arguments);
		var method = args[0];

		return this.each(function() {
			var $holder = jQuery(this);
			var instance = $holder.data('OpenClose');

			if (typeof opt === 'object' || typeof opt === 'undefined') {
				$holder.data('OpenClose', new OpenClose($.extend({
					holder: this
				}, opt)));
			} else if (typeof method === 'string' && instance) {
				if (typeof instance[method] === 'function') {
					args.shift();
					instance[method].apply(instance, args);
				}
			}
		});
	};
}(jQuery));

/*
 * Responsive Layout helper
 */
window.ResponsiveHelper = (function($){
	// init variables
	var handlers = [],
		prevWinWidth,
		win = $(window),
		nativeMatchMedia = false;

	// detect match media support
	if(window.matchMedia) {
		if(window.Window && window.matchMedia === Window.prototype.matchMedia) {
			nativeMatchMedia = true;
		} else if(window.matchMedia.toString().indexOf('native') > -1) {
			nativeMatchMedia = true;
		}
	}

	// prepare resize handler
	function resizeHandler() {
		var winWidth = win.width();
		if(winWidth !== prevWinWidth) {
			prevWinWidth = winWidth;

			// loop through range groups
			$.each(handlers, function(index, rangeObject){
				// disable current active area if needed
				$.each(rangeObject.data, function(property, item) {
					if(item.currentActive && !matchRange(item.range[0], item.range[1])) {
						item.currentActive = false;
						if(typeof item.disableCallback === 'function') {
							item.disableCallback();
						}
					}
				});

				// enable areas that match current width
				$.each(rangeObject.data, function(property, item) {
					if(!item.currentActive && matchRange(item.range[0], item.range[1])) {
						// make callback
						item.currentActive = true;
						if(typeof item.enableCallback === 'function') {
							item.enableCallback();
						}
					}
				});
			});
		}
	}
	win.bind('load resize orientationchange', resizeHandler);

	// test range
	function matchRange(r1, r2) {
		var mediaQueryString = '';
		if(r1 > 0) {
			mediaQueryString += '(min-width: ' + r1 + 'px)';
		}
		if(r2 < Infinity) {
			mediaQueryString += (mediaQueryString ? ' and ' : '') + '(max-width: ' + r2 + 'px)';
		}
		return matchQuery(mediaQueryString, r1, r2);
	}

	// media query function
	function matchQuery(query, r1, r2) {
		if(window.matchMedia && nativeMatchMedia) {
			return matchMedia(query).matches;
		} else if(window.styleMedia) {
			return styleMedia.matchMedium(query);
		} else if(window.media) {
			return media.matchMedium(query);
		} else {
			return prevWinWidth >= r1 && prevWinWidth <= r2;
		}
	}

	// range parser
	function parseRange(rangeStr) {
		var rangeData = rangeStr.split('..');
		var x1 = parseInt(rangeData[0], 10) || -Infinity;
		var x2 = parseInt(rangeData[1], 10) || Infinity;
		return [x1, x2].sort(function(a, b){
			return a - b;
		});
	}

	// export public functions
	return {
		addRange: function(ranges) {
			// parse data and add items to collection
			var result = {data:{}};
			$.each(ranges, function(property, data){
				result.data[property] = {
					range: parseRange(property),
					enableCallback: data.on,
					disableCallback: data.off
				};
			});
			handlers.push(result);

			// call resizeHandler to recalculate all events
			prevWinWidth = null;
			resizeHandler();
		}
	};
}(jQuery));

/*
 * Popups plugin
 */
;(function($) {
	function ContentPopup(opt) {
		this.options = $.extend({
			holder: null,
			popup: '.popup',
			btnOpen: '.open',
			btnClose: '.close',
			openClass: 'popup-active',
			clickEvent: 'click',
			mode: 'click',
			hideOnClickLink: true,
			hideOnClickOutside: true,
			delay: 50
		}, opt);
		if (this.options.holder) {
			this.holder = $(this.options.holder);
			this.init();
		}
	}
	ContentPopup.prototype = {
		init: function() {
			this.findElements();
			this.attachEvents();
		},
		findElements: function() {
			this.popup = this.holder.find(this.options.popup);
			this.btnOpen = this.holder.find(this.options.btnOpen);
			this.btnClose = this.holder.find(this.options.btnClose);
		},
		attachEvents: function() {
			// handle popup openers
			var self = this;
			this.clickMode = isTouchDevice || (self.options.mode === self.options.clickEvent);

			if (this.clickMode) {
				// handle click mode
				this.btnOpen.bind(self.options.clickEvent + '.popup', function(e) {
					if (self.holder.hasClass(self.options.openClass)) {
						if (self.options.hideOnClickLink) {
							self.hidePopup();
						}
					} else {
						self.showPopup();
					}
					e.preventDefault();
				});

				// prepare outside click handler
				this.outsideClickHandler = this.bind(this.outsideClickHandler, this);
			} else {
				// handle hover mode
				var timer, delayedFunc = function(func) {
					clearTimeout(timer);
					timer = setTimeout(function() {
						func.call(self);
					}, self.options.delay);
				};
				this.btnOpen.on('mouseover.popup', function() {
					delayedFunc(self.showPopup);
				}).on('mouseout.popup', function() {
					delayedFunc(self.hidePopup);
				});
				this.popup.on('mouseover.popup', function() {
					delayedFunc(self.showPopup);
				}).on('mouseout.popup', function() {
					delayedFunc(self.hidePopup);
				});
			}

			// handle close buttons
			this.btnClose.on(self.options.clickEvent + '.popup', function(e) {
				self.hidePopup();
				e.preventDefault();
			});
		},
		outsideClickHandler: function(e) {
			// hide popup if clicked outside
			var targetNode = $((e.changedTouches ? e.changedTouches[0] : e).target);
			if (!targetNode.closest(this.popup).length && !targetNode.closest(this.btnOpen).length) {
				this.hidePopup();
			}
		},
		showPopup: function() {
			// reveal popup
			this.holder.addClass(this.options.openClass);
			this.popup.css({
				display: 'block'
			});

			// outside click handler
			if (this.clickMode && this.options.hideOnClickOutside && !this.outsideHandlerActive) {
				this.outsideHandlerActive = true;
				$(document).on('click touchstart', this.outsideClickHandler);
			}
		},
		hidePopup: function() {
			// hide popup
			this.holder.removeClass(this.options.openClass);
			this.popup.css({
				display: 'none'
			});

			// outside click handler
			if (this.clickMode && this.options.hideOnClickOutside && this.outsideHandlerActive) {
				this.outsideHandlerActive = false;
				$(document).off('click touchstart', this.outsideClickHandler);
			}
		},
		bind: function(f, scope, forceArgs) {
			return function() {
				return f.apply(scope, forceArgs ? [forceArgs] : arguments);
			};
		},
		destroy: function() {
			this.popup.removeAttr('style');
			this.holder.removeClass(this.options.openClass);
			this.btnOpen.add(this.btnClose).add(this.popup).off('.popup');
			$(document).off('click touchstart', this.outsideClickHandler);
		}
	};

	// detect touch devices
	var isTouchDevice = /Windows Phone/.test(navigator.userAgent) || ('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch;

	// jQuery plugin interface
	$.fn.contentPopup = function(opt) {
		var args = Array.prototype.slice.call(arguments);
		var method = args[0];

		return this.each(function() {
			var $holder = jQuery(this);
			var instance = $holder.data('ContentPopup');

			if (typeof opt === 'object' || typeof opt === 'undefined') {
				$holder.data('ContentPopup', new ContentPopup($.extend({
					holder: this
				}, opt)));
			} else if (typeof method === 'string' && instance) {
				if (typeof instance[method] === 'function') {
					args.shift();
					instance[method].apply(instance, args);
				}
			}
		});
	};
}(jQuery));

/*
 * Simple Mobile Navigation
 */
;(function($) {
	function MobileNav(options) {
		this.options = $.extend({
			container: null,
			hideOnClickOutside: false,
			menuActiveClass: 'nav-active',
			menuOpener: '.nav-opener',
			menuDrop: '.nav-drop',
			toggleEvent: 'click',
			outsideClickEvent: 'click touchstart pointerdown MSPointerDown'
		}, options);
		this.initStructure();
		this.attachEvents();
	}
	MobileNav.prototype = {
		initStructure: function() {
			this.page = $('html');
			this.container = $(this.options.container);
			this.opener = this.container.find(this.options.menuOpener);
			this.drop = this.container.find(this.options.menuDrop);
		},
		attachEvents: function() {
			var self = this;

			if(activateResizeHandler) {
				activateResizeHandler();
				activateResizeHandler = null;
			}

			this.outsideClickHandler = function(e) {
				if(self.isOpened()) {
					var target = $(e.target);
					if(!target.closest(self.opener).length && !target.closest(self.drop).length) {
						self.hide();
					}
				}
			};

			this.openerClickHandler = function(e) {
				e.preventDefault();
				self.toggle();
			};

			this.opener.on(this.options.toggleEvent, this.openerClickHandler);
		},
		isOpened: function() {
			return this.container.hasClass(this.options.menuActiveClass);
		},
		show: function() {
			this.container.addClass(this.options.menuActiveClass);
			if(this.options.hideOnClickOutside) {
				this.page.on(this.options.outsideClickEvent, this.outsideClickHandler);
			}
		},
		hide: function() {
			this.container.removeClass(this.options.menuActiveClass);
			if(this.options.hideOnClickOutside) {
				this.page.off(this.options.outsideClickEvent, this.outsideClickHandler);
			}
		},
		toggle: function() {
			if(this.isOpened()) {
				this.hide();
			} else {
				this.show();
			}
		},
		destroy: function() {
			this.container.removeClass(this.options.menuActiveClass);
			this.opener.off(this.options.toggleEvent, this.clickHandler);
			this.page.off(this.options.outsideClickEvent, this.outsideClickHandler);
		}
	};

	var activateResizeHandler = function() {
		var win = $(window),
			doc = $('html'),
			resizeClass = 'resize-active',
			flag, timer;
		var removeClassHandler = function() {
			flag = false;
			doc.removeClass(resizeClass);
		};
		var resizeHandler = function() {
			if(!flag) {
				flag = true;
				doc.addClass(resizeClass);
			}
			clearTimeout(timer);
			timer = setTimeout(removeClassHandler, 500);
		};
		win.on('resize orientationchange', resizeHandler);
	};

	$.fn.mobileNav = function(opt) {
		var args = Array.prototype.slice.call(arguments);
		var method = args[0];

		return this.each(function() {
			var $container = jQuery(this);
			var instance = $container.data('MobileNav');

			if (typeof opt === 'object' || typeof opt === 'undefined') {
				$container.data('MobileNav', new MobileNav($.extend({
					container: this
				}, opt)));
			} else if (typeof method === 'string' && instance) {
				if (typeof instance[method] === 'function') {
					args.shift();
					instance[method].apply(instance, args);
				}
			}
		});
	};
}(jQuery));

/*!
 * SmoothScroll module
 */
;(function($, exports) {
	// private variables
	var page,
		win = $(window),
		activeBlock, activeWheelHandler,
		wheelEvents = ('onwheel' in document || document.documentMode >= 9 ? 'wheel' : 'mousewheel DOMMouseScroll');

	// animation handlers
	function scrollTo(offset, options, callback) {
		// initialize variables
		var scrollBlock;
		if (document.body) {
			if (typeof options === 'number') {
				options = {
					duration: options
				};
			} else {
				options = options || {};
			}
			page = page || $('html, body');
			scrollBlock = options.container || page;
		} else {
			return;
		}

		// treat single number as scrollTop
		if (typeof offset === 'number') {
			offset = {
				top: offset
			};
		}

		// handle mousewheel/trackpad while animation is active
		if (activeBlock && activeWheelHandler) {
			activeBlock.off(wheelEvents, activeWheelHandler);
		}
		if (options.wheelBehavior && options.wheelBehavior !== 'none') {
			activeWheelHandler = function(e) {
				if (options.wheelBehavior === 'stop') {
					scrollBlock.off(wheelEvents, activeWheelHandler);
					scrollBlock.stop();
				} else if (options.wheelBehavior === 'ignore') {
					e.preventDefault();
				}
			};
			activeBlock = scrollBlock.on(wheelEvents, activeWheelHandler);
		}

		// start scrolling animation
		scrollBlock.stop().animate({
			scrollLeft: offset.left,
			scrollTop: offset.top
		}, options.duration, function() {
			if (activeWheelHandler) {
				scrollBlock.off(wheelEvents, activeWheelHandler);
			}
			if ($.isFunction(callback)) {
				callback();
			}
		});
	}

	// smooth scroll contstructor
	function SmoothScroll(options) {
		this.options = $.extend({
			anchorLinks: 'a[href^="#"]', // selector or jQuery object
			container: null, // specify container for scrolling (default - whole page)
			extraOffset: null, // function or fixed number
			activeClasses: null, // null, "link", "parent"
			easing: 'swing', // easing of scrolling
			animMode: 'duration', // or "speed" mode
			animDuration: 800, // total duration for scroll (any distance)
			animSpeed: 1500, // pixels per second
			anchorActiveClass: 'anchor-active',
			sectionActiveClass: 'section-active',
			wheelBehavior: 'stop', // "stop", "ignore" or "none"
			useNativeAnchorScrolling: false // do not handle click in devices with native smooth scrolling
		}, options);
		this.init();
	}
	SmoothScroll.prototype = {
		init: function() {
			this.initStructure();
			this.attachEvents();
			this.isInit = true;
		},
		initStructure: function() {
			var self = this;

			this.container = this.options.container ? $(this.options.container) : $('html,body');
			this.scrollContainer = this.options.container ? this.container : win;
			this.anchorLinks = jQuery(this.options.anchorLinks).filter(function() {
				return jQuery(self.getAnchorTarget(jQuery(this))).length;
			});
		},
		getId: function(str) {
			try {
				return '#' + str.replace(/^.*?(#|$)/, '');
			} catch (err) {
				return null;
			}
		},
		getAnchorTarget: function(link) {
			// get target block from link href
			var targetId = this.getId($(link).attr('href'));
			return $(targetId.length > 1 ? targetId : 'html');
		},
		getTargetOffset: function(block) {
			// get target offset
			var blockOffset = block.offset().top;
			if (this.options.container) {
				blockOffset -= this.container.offset().top - this.container.prop('scrollTop');
			}

			// handle extra offset
			if (typeof this.options.extraOffset === 'number') {
				blockOffset -= this.options.extraOffset;
			} else if (typeof this.options.extraOffset === 'function') {
				blockOffset -= this.options.extraOffset(block);
			}
			return {
				top: blockOffset
			};
		},
		attachEvents: function() {
			var self = this;

			// handle active classes
			if (this.options.activeClasses && this.anchorLinks.length) {
				// cache structure
				this.anchorData = [];

				for (var i = 0; i < this.anchorLinks.length; i++) {
					var link = jQuery(this.anchorLinks[i]),
						targetBlock = self.getAnchorTarget(link),
						anchorDataItem = null;

					$.each(self.anchorData, function(index, item) {
						if (item.block[0] === targetBlock[0]) {
							anchorDataItem = item;
						}
					});

					if (anchorDataItem) {
						anchorDataItem.link = anchorDataItem.link.add(link);
					} else {
						self.anchorData.push({
							link: link,
							block: targetBlock
						});
					}
				};

				// add additional event handlers
				this.resizeHandler = function() {
					if (!self.isInit) return;
					self.recalculateOffsets();
				};
				this.scrollHandler = function() {
					self.refreshActiveClass();
				};

				this.recalculateOffsets();
				this.scrollContainer.on('scroll', this.scrollHandler);
				win.on('resize load orientationchange refreshAnchor', this.resizeHandler);
			}

			// handle click event
			this.clickHandler = function(e) {
				self.onClick(e);
			};
			if (!this.options.useNativeAnchorScrolling) {
				this.anchorLinks.on('click', this.clickHandler);
			}
		},
		recalculateOffsets: function() {
			var self = this;
			$.each(this.anchorData, function(index, data) {
				data.offset = self.getTargetOffset(data.block);
				data.height = data.block.outerHeight();
			});
			this.refreshActiveClass();
		},
		toggleActiveClass: function(anchor, block, state) {
			anchor.toggleClass(this.options.anchorActiveClass, state);
			block.toggleClass(this.options.sectionActiveClass, state);
		},
		refreshActiveClass: function() {
			var self = this,
				foundFlag = false,
				containerHeight = this.container.prop('scrollHeight'),
				viewPortHeight = this.scrollContainer.height(),
				scrollTop = this.options.container ? this.container.prop('scrollTop') : win.scrollTop();

			// user function instead of default handler
			if (this.options.customScrollHandler) {
				this.options.customScrollHandler.call(this, scrollTop, this.anchorData);
				return;
			}

			// sort anchor data by offsets
			this.anchorData.sort(function(a, b) {
				return a.offset.top - b.offset.top;
			});

			// default active class handler
			$.each(this.anchorData, function(index) {
				var reverseIndex = self.anchorData.length - index - 1,
					data = self.anchorData[reverseIndex],
					anchorElement = (self.options.activeClasses === 'parent' ? data.link.parent() : data.link);

				if (scrollTop >= containerHeight - viewPortHeight) {
					// handle last section
					if (reverseIndex === self.anchorData.length - 1) {
						self.toggleActiveClass(anchorElement, data.block, true);
					} else {
						self.toggleActiveClass(anchorElement, data.block, false);
					}
				} else {
					// handle other sections
					if (!foundFlag && (scrollTop >= data.offset.top - 1 || reverseIndex === 0)) {
						foundFlag = true;
						self.toggleActiveClass(anchorElement, data.block, true);
					} else {
						self.toggleActiveClass(anchorElement, data.block, false);
					}
				}
			});
		},
		calculateScrollDuration: function(offset) {
			var distance;
			if (this.options.animMode === 'speed') {
				distance = Math.abs(this.scrollContainer.scrollTop() - offset.top);
				return (distance / this.options.animSpeed) * 1000;
			} else {
				return this.options.animDuration;
			}
		},
		onClick: function(e) {
			var targetBlock = this.getAnchorTarget(e.currentTarget),
				targetOffset = this.getTargetOffset(targetBlock);

			e.preventDefault();
			scrollTo(targetOffset, {
				container: this.container,
				wheelBehavior: this.options.wheelBehavior,
				duration: this.calculateScrollDuration(targetOffset)
			});
			this.makeCallback('onBeforeScroll', e.currentTarget);
		},
		makeCallback: function(name) {
			if (typeof this.options[name] === 'function') {
				var args = Array.prototype.slice.call(arguments);
				args.shift();
				this.options[name].apply(this, args);
			}
		},
		destroy: function() {
			var self = this;

			this.isInit = false;
			if (this.options.activeClasses) {
				win.off('resize load orientationchange refreshAnchor', this.resizeHandler);
				this.scrollContainer.off('scroll', this.scrollHandler);
				$.each(this.anchorData, function(index) {
					var reverseIndex = self.anchorData.length - index - 1,
						data = self.anchorData[reverseIndex],
						anchorElement = (self.options.activeClasses === 'parent' ? data.link.parent() : data.link);

					self.toggleActiveClass(anchorElement, data.block, false);
				});
			}
			this.anchorLinks.off('click', this.clickHandler);
		}
	};

	// public API
	$.extend(SmoothScroll, {
		scrollTo: function(blockOrOffset, durationOrOptions, callback) {
			scrollTo(blockOrOffset, durationOrOptions, callback);
		}
	});

	// export module
	exports.SmoothScroll = SmoothScroll;
}(jQuery, this));

/*
 * jQuery retina cover plugin
 */
;(function($) {
	'use strict';

	var styleRules = {};
	var templates = {
		'2x': [
			'(-webkit-min-device-pixel-ratio: 1.5)',
			'(min-resolution: 192dpi)',
			'(min-device-pixel-ratio: 1.5)',
			'(min-resolution: 1.5dppx)'
		],
		'3x': [
			'(-webkit-min-device-pixel-ratio: 3)',
			'(min-resolution: 384dpi)',
			'(min-device-pixel-ratio: 3)',
			'(min-resolution: 3dppx)'
		]
	};

	function addSimple(imageSrc, media, id) {
		var style = buildRule(id, imageSrc);

		addRule(media, style);
	}

	function addRetina(imageData, media, id) {
		var currentRules = templates[imageData[1]].slice();
		var patchedRules = currentRules;
		var style = buildRule(id, imageData[0]);

		if (media !== 'default') {
			patchedRules = $.map(currentRules, function(ele, i) {
				return ele + ' and ' + media;
			});
		}

		media = patchedRules.join(',');

		addRule(media, style);
	}

	function buildRule(id, src) {
		return '#' + id + '{background-image: url("' + src + '");}';
	}

	function addRule(media, rule) {
		var $styleTag = styleRules[media];
		var styleTagData;
		var rules = '';

		if (media === 'default') {
			rules = rule + ' ';
		} else {
			rules = '@media ' + media + '{' + rule + '}';
		}

		if (!$styleTag) {
			styleRules[media] = $('<style>').text(rules).appendTo('head');
		} else {
			styleTagData = $styleTag.text();
			styleTagData = styleTagData.substring(0, styleTagData.length - 2) + ' }' + rule + '}';
			$styleTag.text(styleTagData);
		}
	}

	$.fn.retinaCover = function() {
		return this.each(function() {
			var $block = $(this);
			var $items = $block.children('[data-srcset]');
			var id = 'bg-stretch' + Date.now() + (Math.random() * 1000).toFixed(0);

			if ($items.length) {
				$block.attr('id', id);

				$items.each(function() {
					var $item = $(this);
					var data = $item.data('srcset').split(', ');
					var media = $item.data('media') || 'default';
					var dataLength = data.length;
					var itemData;
					var i;

					for (i = 0; i < dataLength; i++) {
						itemData = data[i].split(' ');

						if (itemData.length === 1) {
							addSimple(itemData[0], media, id);
						} else {
							addRetina(itemData, media, id);
						}
					}
				});
			}

			$items.detach();
		});
	};
}(jQuery));

/*! Picturefill - v3.0.1 - 2015-09-30
 * http://scottjehl.github.io/picturefill
 * Copyright (c) 2015 https://github.com/scottjehl/picturefill/blob/master/Authors.txt; Licensed MIT
 */
!function(a){var b=navigator.userAgent;a.HTMLPictureElement&&/ecko/.test(b)&&b.match(/rv\:(\d+)/)&&RegExp.$1<41&&addEventListener("resize",function(){var b,c=document.createElement("source"),d=function(a){var b,d,e=a.parentNode;"PICTURE"===e.nodeName.toUpperCase()?(b=c.cloneNode(),e.insertBefore(b,e.firstElementChild),setTimeout(function(){e.removeChild(b)})):(!a._pfLastSize||a.offsetWidth>a._pfLastSize)&&(a._pfLastSize=a.offsetWidth,d=a.sizes,a.sizes+=",100vw",setTimeout(function(){a.sizes=d}))},e=function(){var a,b=document.querySelectorAll("picture > img, img[srcset][sizes]");for(a=0;a<b.length;a++)d(b[a])},f=function(){clearTimeout(b),b=setTimeout(e,99)},g=a.matchMedia&&matchMedia("(orientation: landscape)"),h=function(){f(),g&&g.addListener&&g.addListener(f)};return c.srcset="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==",/^[c|i]|d$/.test(document.readyState||"")?h():document.addEventListener("DOMContentLoaded",h),f}())}(window),function(a,b,c){"use strict";function d(a){return" "===a||"	"===a||"\n"===a||"\f"===a||"\r"===a}function e(b,c){var d=new a.Image;return d.onerror=function(){z[b]=!1,aa()},d.onload=function(){z[b]=1===d.width,aa()},d.src=c,"pending"}function f(){L=!1,O=a.devicePixelRatio,M={},N={},s.DPR=O||1,P.width=Math.max(a.innerWidth||0,y.clientWidth),P.height=Math.max(a.innerHeight||0,y.clientHeight),P.vw=P.width/100,P.vh=P.height/100,r=[P.height,P.width,O].join("-"),P.em=s.getEmValue(),P.rem=P.em}function g(a,b,c,d){var e,f,g,h;return"saveData"===A.algorithm?a>2.7?h=c+1:(f=b-c,e=Math.pow(a-.6,1.5),g=f*e,d&&(g+=.1*e),h=a+g):h=c>1?Math.sqrt(a*b):a,h>c}function h(a){var b,c=s.getSet(a),d=!1;"pending"!==c&&(d=r,c&&(b=s.setRes(c),s.applySetCandidate(b,a))),a[s.ns].evaled=d}function i(a,b){return a.res-b.res}function j(a,b,c){var d;return!c&&b&&(c=a[s.ns].sets,c=c&&c[c.length-1]),d=k(b,c),d&&(b=s.makeUrl(b),a[s.ns].curSrc=b,a[s.ns].curCan=d,d.res||_(d,d.set.sizes)),d}function k(a,b){var c,d,e;if(a&&b)for(e=s.parseSet(b),a=s.makeUrl(a),c=0;c<e.length;c++)if(a===s.makeUrl(e[c].url)){d=e[c];break}return d}function l(a,b){var c,d,e,f,g=a.getElementsByTagName("source");for(c=0,d=g.length;d>c;c++)e=g[c],e[s.ns]=!0,f=e.getAttribute("srcset"),f&&b.push({srcset:f,media:e.getAttribute("media"),type:e.getAttribute("type"),sizes:e.getAttribute("sizes")})}function m(a,b){function c(b){var c,d=b.exec(a.substring(m));return d?(c=d[0],m+=c.length,c):void 0}function e(){var a,c,d,e,f,i,j,k,l,m=!1,o={};for(e=0;e<h.length;e++)f=h[e],i=f[f.length-1],j=f.substring(0,f.length-1),k=parseInt(j,10),l=parseFloat(j),W.test(j)&&"w"===i?((a||c)&&(m=!0),0===k?m=!0:a=k):X.test(j)&&"x"===i?((a||c||d)&&(m=!0),0>l?m=!0:c=l):W.test(j)&&"h"===i?((d||c)&&(m=!0),0===k?m=!0:d=k):m=!0;m||(o.url=g,a&&(o.w=a),c&&(o.d=c),d&&(o.h=d),d||c||a||(o.d=1),1===o.d&&(b.has1x=!0),o.set=b,n.push(o))}function f(){for(c(S),i="",j="in descriptor";;){if(k=a.charAt(m),"in descriptor"===j)if(d(k))i&&(h.push(i),i="",j="after descriptor");else{if(","===k)return m+=1,i&&h.push(i),void e();if("("===k)i+=k,j="in parens";else{if(""===k)return i&&h.push(i),void e();i+=k}}else if("in parens"===j)if(")"===k)i+=k,j="in descriptor";else{if(""===k)return h.push(i),void e();i+=k}else if("after descriptor"===j)if(d(k));else{if(""===k)return void e();j="in descriptor",m-=1}m+=1}}for(var g,h,i,j,k,l=a.length,m=0,n=[];;){if(c(T),m>=l)return n;g=c(U),h=[],","===g.slice(-1)?(g=g.replace(V,""),e()):f()}}function n(a){function b(a){function b(){f&&(g.push(f),f="")}function c(){g[0]&&(h.push(g),g=[])}for(var e,f="",g=[],h=[],i=0,j=0,k=!1;;){if(e=a.charAt(j),""===e)return b(),c(),h;if(k){if("*"===e&&"/"===a[j+1]){k=!1,j+=2,b();continue}j+=1}else{if(d(e)){if(a.charAt(j-1)&&d(a.charAt(j-1))||!f){j+=1;continue}if(0===i){b(),j+=1;continue}e=" "}else if("("===e)i+=1;else if(")"===e)i-=1;else{if(","===e){b(),c(),j+=1;continue}if("/"===e&&"*"===a.charAt(j+1)){k=!0,j+=2;continue}}f+=e,j+=1}}}function c(a){return k.test(a)&&parseFloat(a)>=0?!0:l.test(a)?!0:"0"===a||"-0"===a||"+0"===a?!0:!1}var e,f,g,h,i,j,k=/^(?:[+-]?[0-9]+|[0-9]*\.[0-9]+)(?:[eE][+-]?[0-9]+)?(?:ch|cm|em|ex|in|mm|pc|pt|px|rem|vh|vmin|vmax|vw)$/i,l=/^calc\((?:[0-9a-z \.\+\-\*\/\(\)]+)\)$/i;for(f=b(a),g=f.length,e=0;g>e;e++)if(h=f[e],i=h[h.length-1],c(i)){if(j=i,h.pop(),0===h.length)return j;if(h=h.join(" "),s.matchesMedia(h))return j}return"100vw"}b.createElement("picture");var o,p,q,r,s={},t=function(){},u=b.createElement("img"),v=u.getAttribute,w=u.setAttribute,x=u.removeAttribute,y=b.documentElement,z={},A={algorithm:""},B="data-pfsrc",C=B+"set",D=navigator.userAgent,E=/rident/.test(D)||/ecko/.test(D)&&D.match(/rv\:(\d+)/)&&RegExp.$1>35,F="currentSrc",G=/\s+\+?\d+(e\d+)?w/,H=/(\([^)]+\))?\s*(.+)/,I=a.picturefillCFG,J="position:absolute;left:0;visibility:hidden;display:block;padding:0;border:none;font-size:1em;width:1em;overflow:hidden;clip:rect(0px, 0px, 0px, 0px)",K="font-size:100%!important;",L=!0,M={},N={},O=a.devicePixelRatio,P={px:1,"in":96},Q=b.createElement("a"),R=!1,S=/^[ \t\n\r\u000c]+/,T=/^[, \t\n\r\u000c]+/,U=/^[^ \t\n\r\u000c]+/,V=/[,]+$/,W=/^\d+$/,X=/^-?(?:[0-9]+|[0-9]*\.[0-9]+)(?:[eE][+-]?[0-9]+)?$/,Y=function(a,b,c,d){a.addEventListener?a.addEventListener(b,c,d||!1):a.attachEvent&&a.attachEvent("on"+b,c)},Z=function(a){var b={};return function(c){return c in b||(b[c]=a(c)),b[c]}},$=function(){var a=/^([\d\.]+)(em|vw|px)$/,b=function(){for(var a=arguments,b=0,c=a[0];++b in a;)c=c.replace(a[b],a[++b]);return c},c=Z(function(a){return"return "+b((a||"").toLowerCase(),/\band\b/g,"&&",/,/g,"||",/min-([a-z-\s]+):/g,"e.$1>=",/max-([a-z-\s]+):/g,"e.$1<=",/calc([^)]+)/g,"($1)",/(\d+[\.]*[\d]*)([a-z]+)/g,"($1 * e.$2)",/^(?!(e.[a-z]|[0-9\.&=|><\+\-\*\(\)\/])).*/gi,"")+";"});return function(b,d){var e;if(!(b in M))if(M[b]=!1,d&&(e=b.match(a)))M[b]=e[1]*P[e[2]];else try{M[b]=new Function("e",c(b))(P)}catch(f){}return M[b]}}(),_=function(a,b){return a.w?(a.cWidth=s.calcListLength(b||"100vw"),a.res=a.w/a.cWidth):a.res=a.d,a},aa=function(a){var c,d,e,f=a||{};if(f.elements&&1===f.elements.nodeType&&("IMG"===f.elements.nodeName.toUpperCase()?f.elements=[f.elements]:(f.context=f.elements,f.elements=null)),c=f.elements||s.qsa(f.context||b,f.reevaluate||f.reselect?s.sel:s.selShort),e=c.length){for(s.setupRun(f),R=!0,d=0;e>d;d++)s.fillImg(c[d],f);s.teardownRun(f)}};o=a.console&&console.warn?function(a){console.warn(a)}:t,F in u||(F="src"),z["image/jpeg"]=!0,z["image/gif"]=!0,z["image/png"]=!0,z["image/svg+xml"]=b.implementation.hasFeature("http://wwwindow.w3.org/TR/SVG11/feature#Image","1.1"),s.ns=("pf"+(new Date).getTime()).substr(0,9),s.supSrcset="srcset"in u,s.supSizes="sizes"in u,s.supPicture=!!a.HTMLPictureElement,s.supSrcset&&s.supPicture&&!s.supSizes&&!function(a){u.srcset="data:,a",a.src="data:,a",s.supSrcset=u.complete===a.complete,s.supPicture=s.supSrcset&&s.supPicture}(b.createElement("img")),s.selShort="picture>img,img[srcset]",s.sel=s.selShort,s.cfg=A,s.supSrcset&&(s.sel+=",img["+C+"]"),s.DPR=O||1,s.u=P,s.types=z,q=s.supSrcset&&!s.supSizes,s.setSize=t,s.makeUrl=Z(function(a){return Q.href=a,Q.href}),s.qsa=function(a,b){return a.querySelectorAll(b)},s.matchesMedia=function(){return a.matchMedia&&(matchMedia("(min-width: 0.1em)")||{}).matches?s.matchesMedia=function(a){return!a||matchMedia(a).matches}:s.matchesMedia=s.mMQ,s.matchesMedia.apply(this,arguments)},s.mMQ=function(a){return a?$(a):!0},s.calcLength=function(a){var b=$(a,!0)||!1;return 0>b&&(b=!1),b},s.supportsType=function(a){return a?z[a]:!0},s.parseSize=Z(function(a){var b=(a||"").match(H);return{media:b&&b[1],length:b&&b[2]}}),s.parseSet=function(a){return a.cands||(a.cands=m(a.srcset,a)),a.cands},s.getEmValue=function(){var a;if(!p&&(a=b.body)){var c=b.createElement("div"),d=y.style.cssText,e=a.style.cssText;c.style.cssText=J,y.style.cssText=K,a.style.cssText=K,a.appendChild(c),p=c.offsetWidth,a.removeChild(c),p=parseFloat(p,10),y.style.cssText=d,a.style.cssText=e}return p||16},s.calcListLength=function(a){if(!(a in N)||A.uT){var b=s.calcLength(n(a));N[a]=b?b:P.width}return N[a]},s.setRes=function(a){var b;if(a){b=s.parseSet(a);for(var c=0,d=b.length;d>c;c++)_(b[c],a.sizes)}return b},s.setRes.res=_,s.applySetCandidate=function(a,b){if(a.length){var c,d,e,f,h,k,l,m,n,o=b[s.ns],p=s.DPR;if(k=o.curSrc||b[F],l=o.curCan||j(b,k,a[0].set),l&&l.set===a[0].set&&(n=E&&!b.complete&&l.res-.1>p,n||(l.cached=!0,l.res>=p&&(h=l))),!h)for(a.sort(i),f=a.length,h=a[f-1],d=0;f>d;d++)if(c=a[d],c.res>=p){e=d-1,h=a[e]&&(n||k!==s.makeUrl(c.url))&&g(a[e].res,c.res,p,a[e].cached)?a[e]:c;break}h&&(m=s.makeUrl(h.url),o.curSrc=m,o.curCan=h,m!==k&&s.setSrc(b,h),s.setSize(b))}},s.setSrc=function(a,b){var c;a.src=b.url,"image/svg+xml"===b.set.type&&(c=a.style.width,a.style.width=a.offsetWidth+1+"px",a.offsetWidth+1&&(a.style.width=c))},s.getSet=function(a){var b,c,d,e=!1,f=a[s.ns].sets;for(b=0;b<f.length&&!e;b++)if(c=f[b],c.srcset&&s.matchesMedia(c.media)&&(d=s.supportsType(c.type))){"pending"===d&&(c=d),e=c;break}return e},s.parseSets=function(a,b,d){var e,f,g,h,i=b&&"PICTURE"===b.nodeName.toUpperCase(),j=a[s.ns];(j.src===c||d.src)&&(j.src=v.call(a,"src"),j.src?w.call(a,B,j.src):x.call(a,B)),(j.srcset===c||d.srcset||!s.supSrcset||a.srcset)&&(e=v.call(a,"srcset"),j.srcset=e,h=!0),j.sets=[],i&&(j.pic=!0,l(b,j.sets)),j.srcset?(f={srcset:j.srcset,sizes:v.call(a,"sizes")},j.sets.push(f),g=(q||j.src)&&G.test(j.srcset||""),g||!j.src||k(j.src,f)||f.has1x||(f.srcset+=", "+j.src,f.cands.push({url:j.src,d:1,set:f}))):j.src&&j.sets.push({srcset:j.src,sizes:null}),j.curCan=null,j.curSrc=c,j.supported=!(i||f&&!s.supSrcset||g),h&&s.supSrcset&&!j.supported&&(e?(w.call(a,C,e),a.srcset=""):x.call(a,C)),j.supported&&!j.srcset&&(!j.src&&a.src||a.src!==s.makeUrl(j.src))&&(null===j.src?a.removeAttribute("src"):a.src=j.src),j.parsed=!0},s.fillImg=function(a,b){var c,d=b.reselect||b.reevaluate;a[s.ns]||(a[s.ns]={}),c=a[s.ns],(d||c.evaled!==r)&&((!c.parsed||b.reevaluate)&&s.parseSets(a,a.parentNode,b),c.supported?c.evaled=r:h(a))},s.setupRun=function(){(!R||L||O!==a.devicePixelRatio)&&f()},s.supPicture?(aa=t,s.fillImg=t):!function(){var c,d=a.attachEvent?/d$|^c/:/d$|^c|^i/,e=function(){var a=b.readyState||"";f=setTimeout(e,"loading"===a?200:999),b.body&&(s.fillImgs(),c=c||d.test(a),c&&clearTimeout(f))},f=setTimeout(e,b.body?9:99),g=function(a,b){var c,d,e=function(){var f=new Date-d;b>f?c=setTimeout(e,b-f):(c=null,a())};return function(){d=new Date,c||(c=setTimeout(e,b))}},h=y.clientHeight,i=function(){L=Math.max(a.innerWidth||0,y.clientWidth)!==P.width||y.clientHeight!==h,h=y.clientHeight,L&&s.fillImgs()};Y(a,"resize",g(i,99)),Y(b,"readystatechange",e)}(),s.picturefill=aa,s.fillImgs=aa,s.teardownRun=t,aa._=s,a.picturefillCFG={pf:s,push:function(a){var b=a.shift();"function"==typeof s[b]?s[b].apply(s,a):(A[b]=a[0],R&&s.fillImgs({reselect:!0}))}};for(;I&&I.length;)a.picturefillCFG.push(I.shift());a.picturefill=aa,"object"==typeof module&&"object"==typeof module.exports?module.exports=aa:"function"==typeof define&&define.amd&&define("picturefill",function(){return aa}),s.supPicture||(z["image/webp"]=e("image/webp","data:image/webp;base64,UklGRkoAAABXRUJQVlA4WAoAAAAQAAAAAAAAAAAAQUxQSAwAAAABBxAR/Q9ERP8DAABWUDggGAAAADABAJ0BKgEAAQADADQlpAADcAD++/1QAA=="))}(window,document);

/*!
 * JavaScript Custom Forms
 *
 * Copyright 2014-2015 PSD2HTML - http://psd2html.com/jcf
 * Released under the MIT license (LICENSE.txt)
 *
 * Version: 1.1.3
 */
;(function(root, factory) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		define(['jquery'], factory);
	} else if (typeof exports === 'object') {
		module.exports = factory(require('jquery'));
	} else {
		root.jcf = factory(jQuery);
	}
}(this, function($) {
	'use strict';

	// define version
	var version = '1.1.3';

	// private variables
	var customInstances = [];

	// default global options
	var commonOptions = {
		optionsKey: 'jcf',
		dataKey: 'jcf-instance',
		rtlClass: 'jcf-rtl',
		focusClass: 'jcf-focus',
		pressedClass: 'jcf-pressed',
		disabledClass: 'jcf-disabled',
		hiddenClass: 'jcf-hidden',
		resetAppearanceClass: 'jcf-reset-appearance',
		unselectableClass: 'jcf-unselectable'
	};

	// detect device type
	var isTouchDevice = ('ontouchstart' in window) || window.DocumentTouch && document instanceof window.DocumentTouch,
		isWinPhoneDevice = /Windows Phone/.test(navigator.userAgent);
	commonOptions.isMobileDevice = !!(isTouchDevice || isWinPhoneDevice);

	var isIOS = /(iPad|iPhone).*OS ([0-9_]*) .*/.exec(navigator.userAgent);
	if(isIOS) isIOS = parseFloat(isIOS[2].replace(/_/g, '.'));
	commonOptions.ios = isIOS;

	// create global stylesheet if custom forms are used
	var createStyleSheet = function() {
		var styleTag = $('<style>').appendTo('head'),
			styleSheet = styleTag.prop('sheet') || styleTag.prop('styleSheet');

		// crossbrowser style handling
		var addCSSRule = function(selector, rules, index) {
			if (styleSheet.insertRule) {
				styleSheet.insertRule(selector + '{' + rules + '}', index);
			} else {
				styleSheet.addRule(selector, rules, index);
			}
		};

		// add special rules
		addCSSRule('.' + commonOptions.hiddenClass, 'position:absolute !important;left:-9999px !important;height:1px !important;width:1px !important;margin:0 !important;border-width:0 !important;-webkit-appearance:none;-moz-appearance:none;appearance:none');
		addCSSRule('.' + commonOptions.rtlClass + ' .' + commonOptions.hiddenClass, 'right:-9999px !important; left: auto !important');
		addCSSRule('.' + commonOptions.unselectableClass, '-webkit-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none; -webkit-tap-highlight-color: rgba(0,0,0,0);');
		addCSSRule('.' + commonOptions.resetAppearanceClass, 'background: none; border: none; -webkit-appearance: none; appearance: none; opacity: 0; filter: alpha(opacity=0);');

		// detect rtl pages
		var html = $('html'), body = $('body');
		if (html.css('direction') === 'rtl' || body.css('direction') === 'rtl') {
			html.addClass(commonOptions.rtlClass);
		}

		// handle form reset event
		html.on('reset', function() {
			setTimeout(function() {
				api.refreshAll();
			}, 0);
		});

		// mark stylesheet as created
		commonOptions.styleSheetCreated = true;
	};

	// simplified pointer events handler
	(function() {
		var pointerEventsSupported = navigator.pointerEnabled || navigator.msPointerEnabled,
			touchEventsSupported = ('ontouchstart' in window) || window.DocumentTouch && document instanceof window.DocumentTouch,
			eventList, eventMap = {}, eventPrefix = 'jcf-';

		// detect events to attach
		if (pointerEventsSupported) {
			eventList = {
				pointerover: navigator.pointerEnabled ? 'pointerover' : 'MSPointerOver',
				pointerdown: navigator.pointerEnabled ? 'pointerdown' : 'MSPointerDown',
				pointermove: navigator.pointerEnabled ? 'pointermove' : 'MSPointerMove',
				pointerup: navigator.pointerEnabled ? 'pointerup' : 'MSPointerUp'
			};
		} else {
			eventList = {
				pointerover: 'mouseover',
				pointerdown: 'mousedown' + (touchEventsSupported ? ' touchstart' : ''),
				pointermove: 'mousemove' + (touchEventsSupported ? ' touchmove' : ''),
				pointerup: 'mouseup' + (touchEventsSupported ? ' touchend' : '')
			};
		}

		// create event map
		$.each(eventList, function(targetEventName, fakeEventList) {
			$.each(fakeEventList.split(' '), function(index, fakeEventName) {
				eventMap[fakeEventName] = targetEventName;
			});
		});

		// jQuery event hooks
		$.each(eventList, function(eventName, eventHandlers) {
			eventHandlers = eventHandlers.split(' ');
			$.event.special[eventPrefix + eventName] = {
				setup: function() {
					var self = this;
					$.each(eventHandlers, function(index, fallbackEvent) {
						if (self.addEventListener) self.addEventListener(fallbackEvent, fixEvent, commonOptions.isMobileDevice ? {passive: false} : false);
						else self['on' + fallbackEvent] = fixEvent;
					});
				},
				teardown: function() {
					var self = this;
					$.each(eventHandlers, function(index, fallbackEvent) {
						if (self.addEventListener) self.removeEventListener(fallbackEvent, fixEvent, commonOptions.isMobileDevice ? {passive: false} : false);
						else self['on' + fallbackEvent] = null;
					});
				}
			};
		});

		// check that mouse event are not simulated by mobile browsers
		var lastTouch = null;
		var mouseEventSimulated = function(e) {
			var dx = Math.abs(e.pageX - lastTouch.x),
				dy = Math.abs(e.pageY - lastTouch.y),
				rangeDistance = 25;

			if (dx <= rangeDistance && dy <= rangeDistance) {
				return true;
			}
		};

		// normalize event
		var fixEvent = function(e) {
			var origEvent = e || window.event,
				touchEventData = null,
				targetEventName = eventMap[origEvent.type];

			e = $.event.fix(origEvent);
			e.type = eventPrefix + targetEventName;

			if (origEvent.pointerType) {
				switch (origEvent.pointerType) {
					case 2: e.pointerType = 'touch'; break;
					case 3: e.pointerType = 'pen'; break;
					case 4: e.pointerType = 'mouse'; break;
					default: e.pointerType = origEvent.pointerType;
				}
			} else {
				e.pointerType = origEvent.type.substr(0, 5); // "mouse" or "touch" word length
			}

			if (!e.pageX && !e.pageY) {
				touchEventData = origEvent.changedTouches ? origEvent.changedTouches[0] : origEvent;
				e.pageX = touchEventData.pageX;
				e.pageY = touchEventData.pageY;
			}

			if (origEvent.type === 'touchend') {
				lastTouch = { x: e.pageX, y: e.pageY };
			}
			if (e.pointerType === 'mouse' && lastTouch && mouseEventSimulated(e)) {
				return;
			} else {
				return ($.event.dispatch || $.event.handle).call(this, e);
			}
		};
	}());

	// custom mousewheel/trackpad handler
	(function() {
		var wheelEvents = ('onwheel' in document || document.documentMode >= 9 ? 'wheel' : 'mousewheel DOMMouseScroll').split(' '),
			shimEventName = 'jcf-mousewheel';

		$.event.special[shimEventName] = {
			setup: function() {
				var self = this;
				$.each(wheelEvents, function(index, fallbackEvent) {
					if (self.addEventListener) self.addEventListener(fallbackEvent, fixEvent, false);
					else self['on' + fallbackEvent] = fixEvent;
				});
			},
			teardown: function() {
				var self = this;
				$.each(wheelEvents, function(index, fallbackEvent) {
					if (self.addEventListener) self.removeEventListener(fallbackEvent, fixEvent, false);
					else self['on' + fallbackEvent] = null;
				});
			}
		};

		var fixEvent = function(e) {
			var origEvent = e || window.event;
			e = $.event.fix(origEvent);
			e.type = shimEventName;

			// old wheel events handler
			if ('detail'      in origEvent) { e.deltaY = -origEvent.detail;      }
			if ('wheelDelta'  in origEvent) { e.deltaY = -origEvent.wheelDelta;  }
			if ('wheelDeltaY' in origEvent) { e.deltaY = -origEvent.wheelDeltaY; }
			if ('wheelDeltaX' in origEvent) { e.deltaX = -origEvent.wheelDeltaX; }

			// modern wheel event handler
			if ('deltaY' in origEvent) {
				e.deltaY = origEvent.deltaY;
			}
			if ('deltaX' in origEvent) {
				e.deltaX = origEvent.deltaX;
			}

			// handle deltaMode for mouse wheel
			e.delta = e.deltaY || e.deltaX;
			if (origEvent.deltaMode === 1) {
				var lineHeight = 16;
				e.delta *= lineHeight;
				e.deltaY *= lineHeight;
				e.deltaX *= lineHeight;
			}

			return ($.event.dispatch || $.event.handle).call(this, e);
		};
	}());

	// extra module methods
	var moduleMixin = {
		// provide function for firing native events
		fireNativeEvent: function(elements, eventName) {
			$(elements).each(function() {
				var element = this, eventObject;
				if (element.dispatchEvent) {
					eventObject = document.createEvent('HTMLEvents');
					eventObject.initEvent(eventName, true, true);
					element.dispatchEvent(eventObject);
				} else if (document.createEventObject) {
					eventObject = document.createEventObject();
					eventObject.target = element;
					element.fireEvent('on' + eventName, eventObject);
				}
			});
		},
		// bind event handlers for module instance (functions beggining with "on")
		bindHandlers: function() {
			var self = this;
			$.each(self, function(propName, propValue) {
				if (propName.indexOf('on') === 0 && $.isFunction(propValue)) {
					// dont use $.proxy here because it doesn't create unique handler
					self[propName] = function() {
						return propValue.apply(self, arguments);
					};
				}
			});
		}
	};

	// public API
	var api = {
		version: version,
		modules: {},
		getOptions: function() {
			return $.extend({}, commonOptions);
		},
		setOptions: function(moduleName, moduleOptions) {
			if (arguments.length > 1) {
				// set module options
				if (this.modules[moduleName]) {
					$.extend(this.modules[moduleName].prototype.options, moduleOptions);
				}
			} else {
				// set common options
				$.extend(commonOptions, moduleName);
			}
		},
		addModule: function(proto) {
			// add module to list
			var Module = function(options) {
				// save instance to collection
				if (!options.element.data(commonOptions.dataKey)) {
					options.element.data(commonOptions.dataKey, this);
				}
				customInstances.push(this);

				// save options
				this.options = $.extend({}, commonOptions, this.options, getInlineOptions(options.element), options);

				// bind event handlers to instance
				this.bindHandlers();

				// call constructor
				this.init.apply(this, arguments);
			};

			// parse options from HTML attribute
			var getInlineOptions = function(element) {
				var dataOptions = element.data(commonOptions.optionsKey),
					attrOptions = element.attr(commonOptions.optionsKey);

				if (dataOptions) {
					return dataOptions;
				} else if (attrOptions) {
					try {
						return $.parseJSON(attrOptions);
					} catch (e) {
						// ignore invalid attributes
					}
				}
			};

			// set proto as prototype for new module
			Module.prototype = proto;

			// add mixin methods to module proto
			$.extend(proto, moduleMixin);
			if (proto.plugins) {
				$.each(proto.plugins, function(pluginName, plugin) {
					$.extend(plugin.prototype, moduleMixin);
				});
			}

			// override destroy method
			var originalDestroy = Module.prototype.destroy;
			Module.prototype.destroy = function() {
				this.options.element.removeData(this.options.dataKey);

				for (var i = customInstances.length - 1; i >= 0; i--) {
					if (customInstances[i] === this) {
						customInstances.splice(i, 1);
						break;
					}
				}

				if (originalDestroy) {
					originalDestroy.apply(this, arguments);
				}
			};

			// save module to list
			this.modules[proto.name] = Module;
		},
		getInstance: function(element) {
			return $(element).data(commonOptions.dataKey);
		},
		replace: function(elements, moduleName, customOptions) {
			var self = this,
				instance;

			if (!commonOptions.styleSheetCreated) {
				createStyleSheet();
			}

			$(elements).each(function() {
				var moduleOptions,
					element = $(this);

				instance = element.data(commonOptions.dataKey);
				if (instance) {
					instance.refresh();
				} else {
					if (!moduleName) {
						$.each(self.modules, function(currentModuleName, module) {
							if (module.prototype.matchElement.call(module.prototype, element)) {
								moduleName = currentModuleName;
								return false;
							}
						});
					}
					if (moduleName) {
						moduleOptions = $.extend({ element: element }, customOptions);
						instance = new self.modules[moduleName](moduleOptions);
					}
				}
			});
			return instance;
		},
		refresh: function(elements) {
			$(elements).each(function() {
				var instance = $(this).data(commonOptions.dataKey);
				if (instance) {
					instance.refresh();
				}
			});
		},
		destroy: function(elements) {
			$(elements).each(function() {
				var instance = $(this).data(commonOptions.dataKey);
				if (instance) {
					instance.destroy();
				}
			});
		},
		replaceAll: function(context) {
			var self = this;
			$.each(this.modules, function(moduleName, module) {
				$(module.prototype.selector, context).each(function() {
					if (this.className.indexOf('jcf-ignore') < 0) {
						self.replace(this, moduleName);
					}
				});
			});
		},
		refreshAll: function(context) {
			if (context) {
				$.each(this.modules, function(moduleName, module) {
					$(module.prototype.selector, context).each(function() {
						var instance = $(this).data(commonOptions.dataKey);
						if (instance) {
							instance.refresh();
						}
					});
				});
			} else {
				for (var i = customInstances.length - 1; i >= 0; i--) {
					customInstances[i].refresh();
				}
			}
		},
		destroyAll: function(context) {
			if (context) {
				$.each(this.modules, function(moduleName, module) {
					$(module.prototype.selector, context).each(function(index, element) {
						var instance = $(element).data(commonOptions.dataKey);
						if (instance) {
							instance.destroy();
						}
					});
				});
			} else {
				while (customInstances.length) {
					customInstances[0].destroy();
				}
			}
		}
	};

	// always export API to the global window object
	window.jcf = api;

	return api;
}));

 /*!
 * JavaScript Custom Forms : Select Module
 *
 * Copyright 2014-2015 PSD2HTML - http://psd2html.com/jcf
 * Released under the MIT license (LICENSE.txt)
 *
 * Version: 1.1.3
 */
;(function($, window) {
	'use strict';

	jcf.addModule({
		name: 'Select',
		selector: 'select',
		options: {
			element: null,
			multipleCompactStyle: false
		},
		plugins: {
			ListBox: ListBox,
			ComboBox: ComboBox,
			SelectList: SelectList
		},
		matchElement: function(element) {
			return element.is('select');
		},
		init: function() {
			this.element = $(this.options.element);
			this.createInstance();
		},
		isListBox: function() {
			return this.element.is('[size]:not([jcf-size]), [multiple]');
		},
		createInstance: function() {
			if (this.instance) {
				this.instance.destroy();
			}
			if (this.isListBox() && !this.options.multipleCompactStyle) {
				this.instance = new ListBox(this.options);
			} else {
				this.instance = new ComboBox(this.options);
			}
		},
		refresh: function() {
			var typeMismatch = (this.isListBox() && this.instance instanceof ComboBox) ||
								(!this.isListBox() && this.instance instanceof ListBox);

			if (typeMismatch) {
				this.createInstance();
			} else {
				this.instance.refresh();
			}
		},
		destroy: function() {
			this.instance.destroy();
		}
	});

	// combobox module
	function ComboBox(options) {
		this.options = $.extend({
			wrapNative: true,
			wrapNativeOnMobile: true,
			fakeDropInBody: true,
			useCustomScroll: true,
			flipDropToFit: true,
			maxVisibleItems: 10,
			fakeAreaStructure: '<span class="jcf-select"><span class="jcf-select-text"></span><span class="jcf-select-opener"></span></span>',
			fakeDropStructure: '<div class="jcf-select-drop"><div class="jcf-select-drop-content"></div></div>',
			optionClassPrefix: 'jcf-option-',
			selectClassPrefix: 'jcf-select-',
			dropContentSelector: '.jcf-select-drop-content',
			selectTextSelector: '.jcf-select-text',
			dropActiveClass: 'jcf-drop-active',
			flipDropClass: 'jcf-drop-flipped'
		}, options);
		this.init();
	}
	$.extend(ComboBox.prototype, {
		init: function() {
			this.initStructure();
			this.bindHandlers();
			this.attachEvents();
			this.refresh();
		},
		initStructure: function() {
			// prepare structure
			this.win = $(window);
			this.doc = $(document);
			this.realElement = $(this.options.element);
			this.fakeElement = $(this.options.fakeAreaStructure).insertAfter(this.realElement);
			this.selectTextContainer = this.fakeElement.find(this.options.selectTextSelector);
			this.selectText = $('<span></span>').appendTo(this.selectTextContainer);
			makeUnselectable(this.fakeElement);

			// copy classes from original select
			this.fakeElement.addClass(getPrefixedClasses(this.realElement.prop('className'), this.options.selectClassPrefix));

			// handle compact multiple style
			if (this.realElement.prop('multiple')) {
				this.fakeElement.addClass('jcf-compact-multiple');
			}

			// detect device type and dropdown behavior
			if (this.options.isMobileDevice && this.options.wrapNativeOnMobile && !this.options.wrapNative) {
				this.options.wrapNative = true;
			}

			if (this.options.wrapNative) {
				// wrap native select inside fake block
				this.realElement.prependTo(this.fakeElement).css({
					position: 'absolute',
					height: '100%',
					width: '100%'
				}).addClass(this.options.resetAppearanceClass);
			} else {
				// just hide native select
				this.realElement.addClass(this.options.hiddenClass);
				this.fakeElement.attr('title', this.realElement.attr('title'));
				this.fakeDropTarget = this.options.fakeDropInBody ? $('body') : this.fakeElement;
			}
		},
		attachEvents: function() {
			// delayed refresh handler
			var self = this;
			this.delayedRefresh = function() {
				setTimeout(function() {
					self.refresh();
					if (self.list) {
						self.list.refresh();
						self.list.scrollToActiveOption();
					}
				}, 1);
			};

			// native dropdown event handlers
			if (this.options.wrapNative) {
				this.realElement.on({
					focus: this.onFocus,
					change: this.onChange,
					click: this.onChange,
					keydown: this.onChange
				});
			} else {
				// custom dropdown event handlers
				this.realElement.on({
					focus: this.onFocus,
					change: this.onChange,
					keydown: this.onKeyDown
				});
				this.fakeElement.on({
					'jcf-pointerdown': this.onSelectAreaPress
				});
			}
		},
		onKeyDown: function(e) {
			if (e.which === 13) {
				this.toggleDropdown();
			} else if (this.dropActive) {
				this.delayedRefresh();
			}
		},
		onChange: function() {
			this.refresh();
		},
		onFocus: function() {
			if (!this.pressedFlag || !this.focusedFlag) {
				this.fakeElement.addClass(this.options.focusClass);
				this.realElement.on('blur', this.onBlur);
				this.toggleListMode(true);
				this.focusedFlag = true;
			}
		},
		onBlur: function() {
			if (!this.pressedFlag) {
				this.fakeElement.removeClass(this.options.focusClass);
				this.realElement.off('blur', this.onBlur);
				this.toggleListMode(false);
				this.focusedFlag = false;
			}
		},
		onResize: function() {
			if (this.dropActive) {
				this.hideDropdown();
			}
		},
		onSelectDropPress: function() {
			this.pressedFlag = true;
		},
		onSelectDropRelease: function(e, pointerEvent) {
			this.pressedFlag = false;
			if (pointerEvent.pointerType === 'mouse') {
				this.realElement.focus();
			}
		},
		onSelectAreaPress: function(e) {
			// skip click if drop inside fake element or real select is disabled
			var dropClickedInsideFakeElement = !this.options.fakeDropInBody && $(e.target).closest(this.dropdown).length;
			if (dropClickedInsideFakeElement || e.button > 1 || this.realElement.is(':disabled')) {
				return;
			}

			// toggle dropdown visibility
			this.selectOpenedByEvent = e.pointerType;
			this.toggleDropdown();

			// misc handlers
			if (!this.focusedFlag) {
				if (e.pointerType === 'mouse') {
					this.realElement.focus();
				} else {
					this.onFocus(e);
				}
			}
			this.pressedFlag = true;
			this.fakeElement.addClass(this.options.pressedClass);
			this.doc.on('jcf-pointerup', this.onSelectAreaRelease);
		},
		onSelectAreaRelease: function(e) {
			if (this.focusedFlag && e.pointerType === 'mouse') {
				this.realElement.focus();
			}
			this.pressedFlag = false;
			this.fakeElement.removeClass(this.options.pressedClass);
			this.doc.off('jcf-pointerup', this.onSelectAreaRelease);
		},
		onOutsideClick: function(e) {
			var target = $(e.target),
				clickedInsideSelect = target.closest(this.fakeElement).length || target.closest(this.dropdown).length;

			if (!clickedInsideSelect) {
				this.hideDropdown();
			}
		},
		onSelect: function() {
			this.refresh();

			if (this.realElement.prop('multiple')) {
				this.repositionDropdown();
			} else {
				this.hideDropdown();
			}

			this.fireNativeEvent(this.realElement, 'change');
		},
		toggleListMode: function(state) {
			if (!this.options.wrapNative) {
				if (state) {
					// temporary change select to list to avoid appearing of native dropdown
					this.realElement.attr({
						size: 4,
						'jcf-size': ''
					});
				} else {
					// restore select from list mode to dropdown select
					if (!this.options.wrapNative) {
						this.realElement.removeAttr('size jcf-size');
					}
				}
			}
		},
		createDropdown: function() {
			// destroy previous dropdown if needed
			if (this.dropdown) {
				this.list.destroy();
				this.dropdown.remove();
			}

			// create new drop container
			this.dropdown = $(this.options.fakeDropStructure).appendTo(this.fakeDropTarget);
			this.dropdown.addClass(getPrefixedClasses(this.realElement.prop('className'), this.options.selectClassPrefix));
			makeUnselectable(this.dropdown);

			// handle compact multiple style
			if (this.realElement.prop('multiple')) {
				this.dropdown.addClass('jcf-compact-multiple');
			}

			// set initial styles for dropdown in body
			if (this.options.fakeDropInBody) {
				this.dropdown.css({
					position: 'absolute',
					top: -9999
				});
			}

			// create new select list instance
			this.list = new SelectList({
				useHoverClass: true,
				handleResize: false,
				alwaysPreventMouseWheel: true,
				maxVisibleItems: this.options.maxVisibleItems,
				useCustomScroll: this.options.useCustomScroll,
				holder: this.dropdown.find(this.options.dropContentSelector),
				multipleSelectWithoutKey: this.realElement.prop('multiple'),
				element: this.realElement
			});
			$(this.list).on({
				select: this.onSelect,
				press: this.onSelectDropPress,
				release: this.onSelectDropRelease
			});
		},
		repositionDropdown: function() {
			var selectOffset = this.fakeElement.offset(),
				selectWidth = this.fakeElement.outerWidth(),
				selectHeight = this.fakeElement.outerHeight(),
				dropHeight = this.dropdown.css('width', selectWidth).outerHeight(),
				winScrollTop = this.win.scrollTop(),
				winHeight = this.win.height(),
				calcTop, calcLeft, bodyOffset, needFlipDrop = false;

			// check flip drop position
			if (selectOffset.top + selectHeight + dropHeight > winScrollTop + winHeight && selectOffset.top - dropHeight > winScrollTop) {
				needFlipDrop = true;
			}

			if (this.options.fakeDropInBody) {
				bodyOffset = this.fakeDropTarget.css('position') !== 'static' ? this.fakeDropTarget.offset().top : 0;
				if (this.options.flipDropToFit && needFlipDrop) {
					// calculate flipped dropdown position
					calcLeft = selectOffset.left;
					calcTop = selectOffset.top - dropHeight - bodyOffset;
				} else {
					// calculate default drop position
					calcLeft = selectOffset.left;
					calcTop = selectOffset.top + selectHeight - bodyOffset;
				}

				// update drop styles
				this.dropdown.css({
					width: selectWidth,
					left: calcLeft,
					top: calcTop
				});
			}

			// refresh flipped class
			this.dropdown.add(this.fakeElement).toggleClass(this.options.flipDropClass, this.options.flipDropToFit && needFlipDrop);
		},
		showDropdown: function() {
			// do not show empty custom dropdown
			if (!this.realElement.prop('options').length) {
				return;
			}

			// create options list if not created
			if (!this.dropdown) {
				this.createDropdown();
			}

			// show dropdown
			this.dropActive = true;
			this.dropdown.appendTo(this.fakeDropTarget);
			this.fakeElement.addClass(this.options.dropActiveClass);
			this.refreshSelectedText();
			this.repositionDropdown();
			this.list.setScrollTop(this.savedScrollTop);
			this.list.refresh();

			// add temporary event handlers
			this.win.on('resize', this.onResize);
			this.doc.on('jcf-pointerdown', this.onOutsideClick);
		},
		hideDropdown: function() {
			if (this.dropdown) {
				this.savedScrollTop = this.list.getScrollTop();
				this.fakeElement.removeClass(this.options.dropActiveClass + ' ' + this.options.flipDropClass);
				this.dropdown.removeClass(this.options.flipDropClass).detach();
				this.doc.off('jcf-pointerdown', this.onOutsideClick);
				this.win.off('resize', this.onResize);
				this.dropActive = false;
				if (this.selectOpenedByEvent === 'touch') {
					this.onBlur();
				}
			}
		},
		toggleDropdown: function() {
			if (this.dropActive) {
				this.hideDropdown();
			} else {
				this.showDropdown();
			}
		},
		refreshSelectedText: function() {
			// redraw selected area
			var selectedIndex = this.realElement.prop('selectedIndex'),
				selectedOption = this.realElement.prop('options')[selectedIndex],
				selectedOptionImage = selectedOption ? selectedOption.getAttribute('data-image') : null,
				selectedOptionText = '',
				selectedOptionClasses,
				self = this;

			if (this.realElement.prop('multiple')) {
				$.each(this.realElement.prop('options'), function(index, option) {
					if (option.selected) {
						selectedOptionText += (selectedOptionText ? ', ' : '') + option.innerHTML;
					}
				});
				if (!selectedOptionText) {
					selectedOptionText = self.realElement.attr('placeholder') || '';
				}
				this.selectText.removeAttr('class').html(selectedOptionText);
			} else if (!selectedOption) {
				if (this.selectImage) {
					this.selectImage.hide();
				}
				this.selectText.removeAttr('class').empty();
			} else if (this.currentSelectedText !== selectedOption.innerHTML || this.currentSelectedImage !== selectedOptionImage) {
				selectedOptionClasses = getPrefixedClasses(selectedOption.className, this.options.optionClassPrefix);
				this.selectText.attr('class', selectedOptionClasses).html(selectedOption.innerHTML);

				if (selectedOptionImage) {
					if (!this.selectImage) {
						this.selectImage = $('<img>').prependTo(this.selectTextContainer).hide();
					}
					this.selectImage.attr('src', selectedOptionImage).show();
				} else if (this.selectImage) {
					this.selectImage.hide();
				}

				this.currentSelectedText = selectedOption.innerHTML;
				this.currentSelectedImage = selectedOptionImage;
			}
		},
		refresh: function() {
			// refresh fake select visibility
			if (this.realElement.prop('style').display === 'none') {
				this.fakeElement.hide();
			} else {
				this.fakeElement.show();
			}

			// refresh selected text
			this.refreshSelectedText();

			// handle disabled state
			this.fakeElement.toggleClass(this.options.disabledClass, this.realElement.is(':disabled'));
		},
		destroy: function() {
			// restore structure
			if (this.options.wrapNative) {
				this.realElement.insertBefore(this.fakeElement).css({
					position: '',
					height: '',
					width: ''
				}).removeClass(this.options.resetAppearanceClass);
			} else {
				this.realElement.removeClass(this.options.hiddenClass);
				if (this.realElement.is('[jcf-size]')) {
					this.realElement.removeAttr('size jcf-size');
				}
			}

			// removing element will also remove its event handlers
			this.fakeElement.remove();

			// remove other event handlers
			this.doc.off('jcf-pointerup', this.onSelectAreaRelease);
			this.realElement.off({
				focus: this.onFocus
			});
		}
	});

	// listbox module
	function ListBox(options) {
		this.options = $.extend({
			wrapNative: true,
			useCustomScroll: true,
			fakeStructure: '<span class="jcf-list-box"><span class="jcf-list-wrapper"></span></span>',
			selectClassPrefix: 'jcf-select-',
			listHolder: '.jcf-list-wrapper'
		}, options);
		this.init();
	}
	$.extend(ListBox.prototype, {
		init: function() {
			this.bindHandlers();
			this.initStructure();
			this.attachEvents();
		},
		initStructure: function() {
			this.realElement = $(this.options.element);
			this.fakeElement = $(this.options.fakeStructure).insertAfter(this.realElement);
			this.listHolder = this.fakeElement.find(this.options.listHolder);
			makeUnselectable(this.fakeElement);

			// copy classes from original select
			this.fakeElement.addClass(getPrefixedClasses(this.realElement.prop('className'), this.options.selectClassPrefix));
			this.realElement.addClass(this.options.hiddenClass);

			this.list = new SelectList({
				useCustomScroll: this.options.useCustomScroll,
				holder: this.listHolder,
				selectOnClick: false,
				element: this.realElement
			});
		},
		attachEvents: function() {
			// delayed refresh handler
			var self = this;
			this.delayedRefresh = function(e) {
				if (e && e.which === 16) {
					// ignore SHIFT key
					return;
				} else {
					clearTimeout(self.refreshTimer);
					self.refreshTimer = setTimeout(function() {
						self.refresh();
						self.list.scrollToActiveOption();
					}, 1);
				}
			};

			// other event handlers
			this.realElement.on({
				focus: this.onFocus,
				click: this.delayedRefresh,
				keydown: this.delayedRefresh
			});

			// select list event handlers
			$(this.list).on({
				select: this.onSelect,
				press: this.onFakeOptionsPress,
				release: this.onFakeOptionsRelease
			});
		},
		onFakeOptionsPress: function(e, pointerEvent) {
			this.pressedFlag = true;
			if (pointerEvent.pointerType === 'mouse') {
				this.realElement.focus();
			}
		},
		onFakeOptionsRelease: function(e, pointerEvent) {
			this.pressedFlag = false;
			if (pointerEvent.pointerType === 'mouse') {
				this.realElement.focus();
			}
		},
		onSelect: function() {
			this.fireNativeEvent(this.realElement, 'change');
			this.fireNativeEvent(this.realElement, 'click');
		},
		onFocus: function() {
			if (!this.pressedFlag || !this.focusedFlag) {
				this.fakeElement.addClass(this.options.focusClass);
				this.realElement.on('blur', this.onBlur);
				this.focusedFlag = true;
			}
		},
		onBlur: function() {
			if (!this.pressedFlag) {
				this.fakeElement.removeClass(this.options.focusClass);
				this.realElement.off('blur', this.onBlur);
				this.focusedFlag = false;
			}
		},
		refresh: function() {
			this.fakeElement.toggleClass(this.options.disabledClass, this.realElement.is(':disabled'));
			this.list.refresh();
		},
		destroy: function() {
			this.list.destroy();
			this.realElement.insertBefore(this.fakeElement).removeClass(this.options.hiddenClass);
			this.fakeElement.remove();
		}
	});

	// options list module
	function SelectList(options) {
		this.options = $.extend({
			holder: null,
			maxVisibleItems: 10,
			selectOnClick: true,
			useHoverClass: false,
			useCustomScroll: false,
			handleResize: true,
			multipleSelectWithoutKey: false,
			alwaysPreventMouseWheel: false,
			indexAttribute: 'data-index',
			cloneClassPrefix: 'jcf-option-',
			containerStructure: '<span class="jcf-list"><span class="jcf-list-content"></span></span>',
			containerSelector: '.jcf-list-content',
			captionClass: 'jcf-optgroup-caption',
			disabledClass: 'jcf-disabled',
			optionClass: 'jcf-option',
			groupClass: 'jcf-optgroup',
			hoverClass: 'jcf-hover',
			selectedClass: 'jcf-selected',
			scrollClass: 'jcf-scroll-active'
		}, options);
		this.init();
	}
	$.extend(SelectList.prototype, {
		init: function() {
			this.initStructure();
			this.refreshSelectedClass();
			this.attachEvents();
		},
		initStructure: function() {
			this.element = $(this.options.element);
			this.indexSelector = '[' + this.options.indexAttribute + ']';
			this.container = $(this.options.containerStructure).appendTo(this.options.holder);
			this.listHolder = this.container.find(this.options.containerSelector);
			this.lastClickedIndex = this.element.prop('selectedIndex');
			this.rebuildList();
		},
		attachEvents: function() {
			this.bindHandlers();
			this.listHolder.on('jcf-pointerdown', this.indexSelector, this.onItemPress);
			this.listHolder.on('jcf-pointerdown', this.onPress);

			if (this.options.useHoverClass) {
				this.listHolder.on('jcf-pointerover', this.indexSelector, this.onHoverItem);
			}
		},
		onPress: function(e) {
			$(this).trigger('press', e);
			this.listHolder.on('jcf-pointerup', this.onRelease);
		},
		onRelease: function(e) {
			$(this).trigger('release', e);
			this.listHolder.off('jcf-pointerup', this.onRelease);
		},
		onHoverItem: function(e) {
			var hoverIndex = parseFloat(e.currentTarget.getAttribute(this.options.indexAttribute));
			this.fakeOptions.removeClass(this.options.hoverClass).eq(hoverIndex).addClass(this.options.hoverClass);
		},
		onItemPress: function(e) {
			if (e.pointerType === 'touch' || this.options.selectOnClick) {
				// select option after "click"
				this.tmpListOffsetTop = this.list.offset().top;
				this.listHolder.on('jcf-pointerup', this.indexSelector, this.onItemRelease);
			} else {
				// select option immediately
				this.onSelectItem(e);
			}
		},
		onItemRelease: function(e) {
			// remove event handlers and temporary data
			this.listHolder.off('jcf-pointerup', this.indexSelector, this.onItemRelease);

			// simulate item selection
			if (this.tmpListOffsetTop === this.list.offset().top) {
				this.listHolder.on('click', this.indexSelector, { savedPointerType: e.pointerType }, this.onSelectItem);
			}
			delete this.tmpListOffsetTop;
		},
		onSelectItem: function(e) {
			var clickedIndex = parseFloat(e.currentTarget.getAttribute(this.options.indexAttribute)),
				pointerType = e.data && e.data.savedPointerType || e.pointerType || 'mouse',
				range;

			// remove click event handler
			this.listHolder.off('click', this.indexSelector, this.onSelectItem);

			// ignore clicks on disabled options
			if (e.button > 1 || this.realOptions[clickedIndex].disabled) {
				return;
			}

			if (this.element.prop('multiple')) {
				if (e.metaKey || e.ctrlKey || pointerType === 'touch' || this.options.multipleSelectWithoutKey) {
					// if CTRL/CMD pressed or touch devices - toggle selected option
					this.realOptions[clickedIndex].selected = !this.realOptions[clickedIndex].selected;
				} else if (e.shiftKey) {
					// if SHIFT pressed - update selection
					range = [this.lastClickedIndex, clickedIndex].sort(function(a, b) {
						return a - b;
					});
					this.realOptions.each(function(index, option) {
						option.selected = (index >= range[0] && index <= range[1]);
					});
				} else {
					// set single selected index
					this.element.prop('selectedIndex', clickedIndex);
				}
			} else {
				this.element.prop('selectedIndex', clickedIndex);
			}

			// save last clicked option
			if (!e.shiftKey) {
				this.lastClickedIndex = clickedIndex;
			}

			// refresh classes
			this.refreshSelectedClass();

			// scroll to active item in desktop browsers
			if (pointerType === 'mouse') {
				this.scrollToActiveOption();
			}

			// make callback when item selected
			$(this).trigger('select');
		},
		rebuildList: function() {
			// rebuild options
			var self = this,
				rootElement = this.element[0];

			// recursively create fake options
			this.storedSelectHTML = rootElement.innerHTML;
			this.optionIndex = 0;
			this.list = $(this.createOptionsList(rootElement));
			this.listHolder.empty().append(this.list);
			this.realOptions = this.element.find('option');
			this.fakeOptions = this.list.find(this.indexSelector);
			this.fakeListItems = this.list.find('.' + this.options.captionClass + ',' + this.indexSelector);
			delete this.optionIndex;

			// detect max visible items
			var maxCount = this.options.maxVisibleItems,
				sizeValue = this.element.prop('size');
			if (sizeValue > 1 && !this.element.is('[jcf-size]')) {
				maxCount = sizeValue;
			}

			// handle scrollbar
			var needScrollBar = this.fakeOptions.length > maxCount;
			this.container.toggleClass(this.options.scrollClass, needScrollBar);
			if (needScrollBar) {
				// change max-height
				this.listHolder.css({
					maxHeight: this.getOverflowHeight(maxCount),
					overflow: 'auto'
				});

				if (this.options.useCustomScroll && jcf.modules.Scrollable) {
					// add custom scrollbar if specified in options
					jcf.replace(this.listHolder, 'Scrollable', {
						handleResize: this.options.handleResize,
						alwaysPreventMouseWheel: this.options.alwaysPreventMouseWheel
					});
					return;
				}
			}

			// disable edge wheel scrolling
			if (this.options.alwaysPreventMouseWheel) {
				this.preventWheelHandler = function(e) {
					var currentScrollTop = self.listHolder.scrollTop(),
						maxScrollTop = self.listHolder.prop('scrollHeight') - self.listHolder.innerHeight();

					// check edge cases
					if ((currentScrollTop <= 0 && e.deltaY < 0) || (currentScrollTop >= maxScrollTop && e.deltaY > 0)) {
						e.preventDefault();
					}
				};
				this.listHolder.on('jcf-mousewheel', this.preventWheelHandler);
			}
		},
		refreshSelectedClass: function() {
			var self = this,
				selectedItem,
				isMultiple = this.element.prop('multiple'),
				selectedIndex = this.element.prop('selectedIndex');

			if (isMultiple) {
				this.realOptions.each(function(index, option) {
					self.fakeOptions.eq(index).toggleClass(self.options.selectedClass, !!option.selected);
				});
			} else {
				this.fakeOptions.removeClass(this.options.selectedClass + ' ' + this.options.hoverClass);
				selectedItem = this.fakeOptions.eq(selectedIndex).addClass(this.options.selectedClass);
				if (this.options.useHoverClass) {
					selectedItem.addClass(this.options.hoverClass);
				}
			}
		},
		scrollToActiveOption: function() {
			// scroll to target option
			var targetOffset = this.getActiveOptionOffset();
			if (typeof targetOffset === 'number') {
				this.listHolder.prop('scrollTop', targetOffset);
			}
		},
		getSelectedIndexRange: function() {
			var firstSelected = -1, lastSelected = -1;
			this.realOptions.each(function(index, option) {
				if (option.selected) {
					if (firstSelected < 0) {
						firstSelected = index;
					}
					lastSelected = index;
				}
			});
			return [firstSelected, lastSelected];
		},
		getChangedSelectedIndex: function() {
			var selectedIndex = this.element.prop('selectedIndex'),
				targetIndex;

			if (this.element.prop('multiple')) {
				// multiple selects handling
				if (!this.previousRange) {
					this.previousRange = [selectedIndex, selectedIndex];
				}
				this.currentRange = this.getSelectedIndexRange();
				targetIndex = this.currentRange[this.currentRange[0] !== this.previousRange[0] ? 0 : 1];
				this.previousRange = this.currentRange;
				return targetIndex;
			} else {
				// single choice selects handling
				return selectedIndex;
			}
		},
		getActiveOptionOffset: function() {
			// calc values
			var dropHeight = this.listHolder.height(),
				dropScrollTop = this.listHolder.prop('scrollTop'),
				currentIndex = this.getChangedSelectedIndex(),
				fakeOption = this.fakeOptions.eq(currentIndex),
				fakeOptionOffset = fakeOption.offset().top - this.list.offset().top,
				fakeOptionHeight = fakeOption.innerHeight();

			// scroll list
			if (fakeOptionOffset + fakeOptionHeight >= dropScrollTop + dropHeight) {
				// scroll down (always scroll to option)
				return fakeOptionOffset - dropHeight + fakeOptionHeight;
			} else if (fakeOptionOffset < dropScrollTop) {
				// scroll up to option
				return fakeOptionOffset;
			}
		},
		getOverflowHeight: function(sizeValue) {
			var item = this.fakeListItems.eq(sizeValue - 1),
				listOffset = this.list.offset().top,
				itemOffset = item.offset().top,
				itemHeight = item.innerHeight();

			return itemOffset + itemHeight - listOffset;
		},
		getScrollTop: function() {
			return this.listHolder.scrollTop();
		},
		setScrollTop: function(value) {
			this.listHolder.scrollTop(value);
		},
		createOption: function(option) {
			var newOption = document.createElement('span');
			newOption.className = this.options.optionClass;
			newOption.innerHTML = option.innerHTML;
			newOption.setAttribute(this.options.indexAttribute, this.optionIndex++);

			var optionImage, optionImageSrc = option.getAttribute('data-image');
			if (optionImageSrc) {
				optionImage = document.createElement('img');
				optionImage.src = optionImageSrc;
				newOption.insertBefore(optionImage, newOption.childNodes[0]);
			}
			if (option.disabled) {
				newOption.className += ' ' + this.options.disabledClass;
			}
			if (option.className) {
				newOption.className += ' ' + getPrefixedClasses(option.className, this.options.cloneClassPrefix);
			}
			return newOption;
		},
		createOptGroup: function(optgroup) {
			var optGroupContainer = document.createElement('span'),
				optGroupName = optgroup.getAttribute('label'),
				optGroupCaption, optGroupList;

			// create caption
			optGroupCaption = document.createElement('span');
			optGroupCaption.className = this.options.captionClass;
			optGroupCaption.innerHTML = optGroupName;
			optGroupContainer.appendChild(optGroupCaption);

			// create list of options
			if (optgroup.children.length) {
				optGroupList = this.createOptionsList(optgroup);
				optGroupContainer.appendChild(optGroupList);
			}

			optGroupContainer.className = this.options.groupClass;
			return optGroupContainer;
		},
		createOptionContainer: function() {
			var optionContainer = document.createElement('li');
			return optionContainer;
		},
		createOptionsList: function(container) {
			var self = this,
				list = document.createElement('ul');

			$.each(container.children, function(index, currentNode) {
				var item = self.createOptionContainer(currentNode),
					newNode;

				switch (currentNode.tagName.toLowerCase()) {
					case 'option': newNode = self.createOption(currentNode); break;
					case 'optgroup': newNode = self.createOptGroup(currentNode); break;
				}
				list.appendChild(item).appendChild(newNode);
			});
			return list;
		},
		refresh: function() {
			// check for select innerHTML changes
			if (this.storedSelectHTML !== this.element.prop('innerHTML')) {
				this.rebuildList();
			}

			// refresh custom scrollbar
			var scrollInstance = jcf.getInstance(this.listHolder);
			if (scrollInstance) {
				scrollInstance.refresh();
			}

			// refresh selectes classes
			this.refreshSelectedClass();
		},
		destroy: function() {
			this.listHolder.off('jcf-mousewheel', this.preventWheelHandler);
			this.listHolder.off('jcf-pointerdown', this.indexSelector, this.onSelectItem);
			this.listHolder.off('jcf-pointerover', this.indexSelector, this.onHoverItem);
			this.listHolder.off('jcf-pointerdown', this.onPress);
		}
	});

	// helper functions
	var getPrefixedClasses = function(className, prefixToAdd) {
		return className ? className.replace(/[\s]*([\S]+)+[\s]*/gi, prefixToAdd + '$1 ') : '';
	};
	var makeUnselectable = (function() {
		var unselectableClass = jcf.getOptions().unselectableClass;
		function preventHandler(e) {
			e.preventDefault();
		}
		return function(node) {
			node.addClass(unselectableClass).on('selectstart', preventHandler);
		};
	}());

}(jQuery, this));


 /*!
 * JavaScript Custom Forms : Scrollbar Module
 *
 * Copyright 2014-2015 PSD2HTML - http://psd2html.com/jcf
 * Released under the MIT license (LICENSE.txt)
 *
 * Version: 1.1.3
 */
;(function($, window) {
	'use strict';

	jcf.addModule({
		name: 'Scrollable',
		selector: '.jcf-scrollable',
		plugins: {
			ScrollBar: ScrollBar
		},
		options: {
			mouseWheelStep: 150,
			handleResize: true,
			alwaysShowScrollbars: false,
			alwaysPreventMouseWheel: false,
			scrollAreaStructure: '<div class="jcf-scrollable-wrapper"></div>'
		},
		matchElement: function(element) {
			return element.is('.jcf-scrollable');
		},
		init: function() {
			this.initStructure();
			this.attachEvents();
			this.rebuildScrollbars();
		},
		initStructure: function() {
			// prepare structure
			this.doc = $(document);
			this.win = $(window);
			this.realElement = $(this.options.element);
			this.scrollWrapper = $(this.options.scrollAreaStructure).insertAfter(this.realElement);

			// set initial styles
			this.scrollWrapper.css('position', 'relative');
			this.realElement.css('overflow', 'hidden');
			this.vBarEdge = 0;
		},
		attachEvents: function() {
			// create scrollbars
			var self = this;
			this.vBar = new ScrollBar({
				holder: this.scrollWrapper,
				vertical: true,
				onScroll: function(scrollTop) {
					self.realElement.scrollTop(scrollTop);
				}
			});
			this.hBar = new ScrollBar({
				holder: this.scrollWrapper,
				vertical: false,
				onScroll: function(scrollLeft) {
					self.realElement.scrollLeft(scrollLeft);
				}
			});

			// add event handlers
			this.realElement.on('scroll', this.onScroll);
			if (this.options.handleResize) {
				this.win.on('resize orientationchange load', this.onResize);
			}

			// add pointer/wheel event handlers
			this.realElement.on('jcf-mousewheel', this.onMouseWheel);
			this.realElement.on('jcf-pointerdown', this.onTouchBody);
		},
		onScroll: function() {
			this.redrawScrollbars();
		},
		onResize: function() {
			// do not rebuild scrollbars if form field is in focus
			if (!$(document.activeElement).is(':input')) {
				this.rebuildScrollbars();
			}
		},
		onTouchBody: function(e) {
			if (e.pointerType === 'touch') {
				this.touchData = {
					scrollTop: this.realElement.scrollTop(),
					scrollLeft: this.realElement.scrollLeft(),
					left: e.pageX,
					top: e.pageY
				};
				this.doc.on({
					'jcf-pointermove': this.onMoveBody,
					'jcf-pointerup': this.onReleaseBody
				});
			}
		},
		onMoveBody: function(e) {
			var targetScrollTop,
				targetScrollLeft,
				verticalScrollAllowed = this.verticalScrollActive,
				horizontalScrollAllowed = this.horizontalScrollActive;

			if (e.pointerType === 'touch') {
				targetScrollTop = this.touchData.scrollTop - e.pageY + this.touchData.top;
				targetScrollLeft = this.touchData.scrollLeft - e.pageX + this.touchData.left;

				// check that scrolling is ended and release outer scrolling
				if (this.verticalScrollActive && (targetScrollTop < 0 || targetScrollTop > this.vBar.maxValue)) {
					verticalScrollAllowed = false;
				}
				if (this.horizontalScrollActive && (targetScrollLeft < 0 || targetScrollLeft > this.hBar.maxValue)) {
					horizontalScrollAllowed = false;
				}

				this.realElement.scrollTop(targetScrollTop);
				this.realElement.scrollLeft(targetScrollLeft);

				if (verticalScrollAllowed || horizontalScrollAllowed) {
					e.preventDefault();
				} else {
					this.onReleaseBody(e);
				}
			}
		},
		onReleaseBody: function(e) {
			if (e.pointerType === 'touch') {
				delete this.touchData;
				this.doc.off({
					'jcf-pointermove': this.onMoveBody,
					'jcf-pointerup': this.onReleaseBody
				});
			}
		},
		onMouseWheel: function(e) {
			var currentScrollTop = this.realElement.scrollTop(),
				currentScrollLeft = this.realElement.scrollLeft(),
				maxScrollTop = this.realElement.prop('scrollHeight') - this.embeddedDimensions.innerHeight,
				maxScrollLeft = this.realElement.prop('scrollWidth') - this.embeddedDimensions.innerWidth,
				extraLeft, extraTop, preventFlag;

			// check edge cases
			if (!this.options.alwaysPreventMouseWheel) {
				if (this.verticalScrollActive && e.deltaY) {
					if (!(currentScrollTop <= 0 && e.deltaY < 0) && !(currentScrollTop >= maxScrollTop && e.deltaY > 0)) {
						preventFlag = true;
					}
				}
				if (this.horizontalScrollActive && e.deltaX) {
					if (!(currentScrollLeft <= 0 && e.deltaX < 0) && !(currentScrollLeft >= maxScrollLeft && e.deltaX > 0)) {
						preventFlag = true;
					}
				}
				if (!this.verticalScrollActive && !this.horizontalScrollActive) {
					return;
				}
			}

			// prevent default action and scroll item
			if (preventFlag || this.options.alwaysPreventMouseWheel) {
				e.preventDefault();
			} else {
				return;
			}

			extraLeft = e.deltaX / 100 * this.options.mouseWheelStep;
			extraTop = e.deltaY / 100 * this.options.mouseWheelStep;

			this.realElement.scrollTop(currentScrollTop + extraTop);
			this.realElement.scrollLeft(currentScrollLeft + extraLeft);
		},
		setScrollBarEdge: function(edgeSize) {
			this.vBarEdge = edgeSize || 0;
			this.redrawScrollbars();
		},
		saveElementDimensions: function() {
			this.savedDimensions = {
				top: this.realElement.width(),
				left: this.realElement.height()
			};
			return this;
		},
		restoreElementDimensions: function() {
			if (this.savedDimensions) {
				this.realElement.css({
					width: this.savedDimensions.width,
					height: this.savedDimensions.height
				});
			}
			return this;
		},
		saveScrollOffsets: function() {
			this.savedOffsets = {
				top: this.realElement.scrollTop(),
				left: this.realElement.scrollLeft()
			};
			return this;
		},
		restoreScrollOffsets: function() {
			if (this.savedOffsets) {
				this.realElement.scrollTop(this.savedOffsets.top);
				this.realElement.scrollLeft(this.savedOffsets.left);
			}
			return this;
		},
		getContainerDimensions: function() {
			// save current styles
			var desiredDimensions,
				currentStyles,
				currentHeight,
				currentWidth;

			if (this.isModifiedStyles) {
				desiredDimensions = {
					width: this.realElement.innerWidth() + this.vBar.getThickness(),
					height: this.realElement.innerHeight() + this.hBar.getThickness()
				};
			} else {
				// unwrap real element and measure it according to CSS
				this.saveElementDimensions().saveScrollOffsets();
				this.realElement.insertAfter(this.scrollWrapper);
				this.scrollWrapper.detach();

				// measure element
				currentStyles = this.realElement.prop('style');
				currentWidth = parseFloat(currentStyles.width);
				currentHeight = parseFloat(currentStyles.height);

				// reset styles if needed
				if (this.embeddedDimensions && currentWidth && currentHeight) {
					this.isModifiedStyles |= (currentWidth !== this.embeddedDimensions.width || currentHeight !== this.embeddedDimensions.height);
					this.realElement.css({
						overflow: '',
						width: '',
						height: ''
					});
				}

				// calculate desired dimensions for real element
				desiredDimensions = {
					width: this.realElement.outerWidth(),
					height: this.realElement.outerHeight()
				};

				// restore structure and original scroll offsets
				this.scrollWrapper.insertAfter(this.realElement);
				this.realElement.css('overflow', 'hidden').prependTo(this.scrollWrapper);
				this.restoreElementDimensions().restoreScrollOffsets();
			}

			return desiredDimensions;
		},
		getEmbeddedDimensions: function(dimensions) {
			// handle scrollbars cropping
			var fakeBarWidth = this.vBar.getThickness(),
				fakeBarHeight = this.hBar.getThickness(),
				paddingWidth = this.realElement.outerWidth() - this.realElement.width(),
				paddingHeight = this.realElement.outerHeight() - this.realElement.height(),
				resultDimensions;

			if (this.options.alwaysShowScrollbars) {
				// simply return dimensions without custom scrollbars
				this.verticalScrollActive = true;
				this.horizontalScrollActive = true;
				resultDimensions = {
					innerWidth: dimensions.width - fakeBarWidth,
					innerHeight: dimensions.height - fakeBarHeight
				};
			} else {
				// detect when to display each scrollbar
				this.saveElementDimensions();
				this.verticalScrollActive = false;
				this.horizontalScrollActive = false;

				// fill container with full size
				this.realElement.css({
					width: dimensions.width - paddingWidth,
					height: dimensions.height - paddingHeight
				});

				this.horizontalScrollActive = this.realElement.prop('scrollWidth') > this.containerDimensions.width;
				this.verticalScrollActive = this.realElement.prop('scrollHeight') > this.containerDimensions.height;

				this.restoreElementDimensions();
				resultDimensions = {
					innerWidth: dimensions.width - (this.verticalScrollActive ? fakeBarWidth : 0),
					innerHeight: dimensions.height - (this.horizontalScrollActive ? fakeBarHeight : 0)
				};
			}
			$.extend(resultDimensions, {
				width: resultDimensions.innerWidth - paddingWidth,
				height: resultDimensions.innerHeight - paddingHeight
			});
			return resultDimensions;
		},
		rebuildScrollbars: function() {
			// resize wrapper according to real element styles
			this.containerDimensions = this.getContainerDimensions();
			this.embeddedDimensions = this.getEmbeddedDimensions(this.containerDimensions);

			// resize wrapper to desired dimensions
			this.scrollWrapper.css({
				width: this.containerDimensions.width,
				height: this.containerDimensions.height
			});

			// resize element inside wrapper excluding scrollbar size
			this.realElement.css({
				overflow: 'hidden',
				width: this.embeddedDimensions.width,
				height: this.embeddedDimensions.height
			});

			// redraw scrollbar offset
			this.redrawScrollbars();
		},
		redrawScrollbars: function() {
			var viewSize, maxScrollValue;

			// redraw vertical scrollbar
			if (this.verticalScrollActive) {
				viewSize = this.vBarEdge ? this.containerDimensions.height - this.vBarEdge : this.embeddedDimensions.innerHeight;
				maxScrollValue = Math.max(this.realElement.prop('offsetHeight'), this.realElement.prop('scrollHeight')) - this.vBarEdge;

				this.vBar.show().setMaxValue(maxScrollValue - viewSize).setRatio(viewSize / maxScrollValue).setSize(viewSize);
				this.vBar.setValue(this.realElement.scrollTop());
			} else {
				this.vBar.hide();
			}

			// redraw horizontal scrollbar
			if (this.horizontalScrollActive) {
				viewSize = this.embeddedDimensions.innerWidth;
				maxScrollValue = this.realElement.prop('scrollWidth');

				if (maxScrollValue === viewSize) {
					this.horizontalScrollActive = false;
				}
				this.hBar.show().setMaxValue(maxScrollValue - viewSize).setRatio(viewSize / maxScrollValue).setSize(viewSize);
				this.hBar.setValue(this.realElement.scrollLeft());
			} else {
				this.hBar.hide();
			}

			// set "touch-action" style rule
			var touchAction = '';
			if (this.verticalScrollActive && this.horizontalScrollActive) {
				touchAction = 'none';
			} else if (this.verticalScrollActive) {
				touchAction = 'pan-x';
			} else if (this.horizontalScrollActive) {
				touchAction = 'pan-y';
			}
			// this.realElement.css('touchAction', touchAction);
		},
		refresh: function() {
			this.rebuildScrollbars();
		},
		destroy: function() {
			// remove event listeners
			this.win.off('resize orientationchange load', this.onResize);
			this.realElement.off({
				'jcf-mousewheel': this.onMouseWheel,
				'jcf-pointerdown': this.onTouchBody
			});
			this.doc.off({
				'jcf-pointermove': this.onMoveBody,
				'jcf-pointerup': this.onReleaseBody
			});

			// restore structure
			this.saveScrollOffsets();
			this.vBar.destroy();
			this.hBar.destroy();
			this.realElement.insertAfter(this.scrollWrapper).css({
				touchAction: '',
				overflow: '',
				width: '',
				height: ''
			});
			this.scrollWrapper.remove();
			this.restoreScrollOffsets();
		}
	});

	// custom scrollbar
	function ScrollBar(options) {
		this.options = $.extend({
			holder: null,
			vertical: true,
			inactiveClass: 'jcf-inactive',
			verticalClass: 'jcf-scrollbar-vertical',
			horizontalClass: 'jcf-scrollbar-horizontal',
			scrollbarStructure: '<div class="jcf-scrollbar"><div class="jcf-scrollbar-dec"></div><div class="jcf-scrollbar-slider"><div class="jcf-scrollbar-handle"></div></div><div class="jcf-scrollbar-inc"></div></div>',
			btnDecSelector: '.jcf-scrollbar-dec',
			btnIncSelector: '.jcf-scrollbar-inc',
			sliderSelector: '.jcf-scrollbar-slider',
			handleSelector: '.jcf-scrollbar-handle',
			scrollInterval: 300,
			scrollStep: 400 // px/sec
		}, options);
		this.init();
	}
	$.extend(ScrollBar.prototype, {
		init: function() {
			this.initStructure();
			this.attachEvents();
		},
		initStructure: function() {
			// define proporties
			this.doc = $(document);
			this.isVertical = !!this.options.vertical;
			this.sizeProperty = this.isVertical ? 'height' : 'width';
			this.fullSizeProperty = this.isVertical ? 'outerHeight' : 'outerWidth';
			this.invertedSizeProperty = this.isVertical ? 'width' : 'height';
			this.thicknessMeasureMethod = 'outer' + this.invertedSizeProperty.charAt(0).toUpperCase() + this.invertedSizeProperty.substr(1);
			this.offsetProperty = this.isVertical ? 'top' : 'left';
			this.offsetEventProperty = this.isVertical ? 'pageY' : 'pageX';

			// initialize variables
			this.value = this.options.value || 0;
			this.maxValue = this.options.maxValue || 0;
			this.currentSliderSize = 0;
			this.handleSize = 0;

			// find elements
			this.holder = $(this.options.holder);
			this.scrollbar = $(this.options.scrollbarStructure).appendTo(this.holder);
			this.btnDec = this.scrollbar.find(this.options.btnDecSelector);
			this.btnInc = this.scrollbar.find(this.options.btnIncSelector);
			this.slider = this.scrollbar.find(this.options.sliderSelector);
			this.handle = this.slider.find(this.options.handleSelector);

			// set initial styles
			this.scrollbar.addClass(this.isVertical ? this.options.verticalClass : this.options.horizontalClass).css({
				touchAction: this.isVertical ? 'pan-x' : 'pan-y',
				position: 'absolute'
			});
			this.slider.css({
				position: 'relative'
			});
			this.handle.css({
				touchAction: 'none',
				position: 'absolute'
			});
		},
		attachEvents: function() {
			this.bindHandlers();
			this.handle.on('jcf-pointerdown', this.onHandlePress);
			this.slider.add(this.btnDec).add(this.btnInc).on('jcf-pointerdown', this.onButtonPress);
		},
		onHandlePress: function(e) {
			if (e.pointerType === 'mouse' && e.button > 1) {
				return;
			} else {
				e.preventDefault();
				this.handleDragActive = true;
				this.sliderOffset = this.slider.offset()[this.offsetProperty];
				this.innerHandleOffset = e[this.offsetEventProperty] - this.handle.offset()[this.offsetProperty];

				this.doc.on('jcf-pointermove', this.onHandleDrag);
				this.doc.on('jcf-pointerup', this.onHandleRelease);
			}
		},
		onHandleDrag: function(e) {
			e.preventDefault();
			this.calcOffset = e[this.offsetEventProperty] - this.sliderOffset - this.innerHandleOffset;
			this.setValue(this.calcOffset / (this.currentSliderSize - this.handleSize) * this.maxValue);
			this.triggerScrollEvent(this.value);
		},
		onHandleRelease: function() {
			this.handleDragActive = false;
			this.doc.off('jcf-pointermove', this.onHandleDrag);
			this.doc.off('jcf-pointerup', this.onHandleRelease);
		},
		onButtonPress: function(e) {
			var direction, clickOffset;
			if (e.pointerType === 'mouse' && e.button > 1) {
				return;
			} else {
				e.preventDefault();
				if (!this.handleDragActive) {
					if (this.slider.is(e.currentTarget)) {
						// slider pressed
						direction = this.handle.offset()[this.offsetProperty] > e[this.offsetEventProperty] ? -1 : 1;
						clickOffset = e[this.offsetEventProperty] - this.slider.offset()[this.offsetProperty];
						this.startPageScrolling(direction, clickOffset);
					} else {
						// scrollbar buttons pressed
						direction = this.btnDec.is(e.currentTarget) ? -1 : 1;
						this.startSmoothScrolling(direction);
					}
					this.doc.on('jcf-pointerup', this.onButtonRelease);
				}
			}
		},
		onButtonRelease: function() {
			this.stopPageScrolling();
			this.stopSmoothScrolling();
			this.doc.off('jcf-pointerup', this.onButtonRelease);
		},
		startPageScrolling: function(direction, clickOffset) {
			var self = this,
				stepValue = direction * self.currentSize;

			// limit checker
			var isFinishedScrolling = function() {
				var handleTop = (self.value / self.maxValue) * (self.currentSliderSize - self.handleSize);

				if (direction > 0) {
					return handleTop + self.handleSize >= clickOffset;
				} else {
					return handleTop <= clickOffset;
				}
			};

			// scroll by page when track is pressed
			var doPageScroll = function() {
				self.value += stepValue;
				self.setValue(self.value);
				self.triggerScrollEvent(self.value);

				if (isFinishedScrolling()) {
					clearInterval(self.pageScrollTimer);
				}
			};

			// start scrolling
			this.pageScrollTimer = setInterval(doPageScroll, this.options.scrollInterval);
			doPageScroll();
		},
		stopPageScrolling: function() {
			clearInterval(this.pageScrollTimer);
		},
		startSmoothScrolling: function(direction) {
			var self = this, dt;
			this.stopSmoothScrolling();

			// simple animation functions
			var raf = window.requestAnimationFrame || function(func) {
				setTimeout(func, 16);
			};
			var getTimestamp = function() {
				return Date.now ? Date.now() : new Date().getTime();
			};

			// set animation limit
			var isFinishedScrolling = function() {
				if (direction > 0) {
					return self.value >= self.maxValue;
				} else {
					return self.value <= 0;
				}
			};

			// animation step
			var doScrollAnimation = function() {
				var stepValue = (getTimestamp() - dt) / 1000 * self.options.scrollStep;

				if (self.smoothScrollActive) {
					self.value += stepValue * direction;
					self.setValue(self.value);
					self.triggerScrollEvent(self.value);

					if (!isFinishedScrolling()) {
						dt = getTimestamp();
						raf(doScrollAnimation);
					}
				}
			};

			// start animation
			self.smoothScrollActive = true;
			dt = getTimestamp();
			raf(doScrollAnimation);
		},
		stopSmoothScrolling: function() {
			this.smoothScrollActive = false;
		},
		triggerScrollEvent: function(scrollValue) {
			if (this.options.onScroll) {
				this.options.onScroll(scrollValue);
			}
		},
		getThickness: function() {
			return this.scrollbar[this.thicknessMeasureMethod]();
		},
		setSize: function(size) {
			// resize scrollbar
			var btnDecSize = this.btnDec[this.fullSizeProperty](),
				btnIncSize = this.btnInc[this.fullSizeProperty]();

			// resize slider
			this.currentSize = size;
			this.currentSliderSize = size - btnDecSize - btnIncSize;
			this.scrollbar.css(this.sizeProperty, size);
			this.slider.css(this.sizeProperty, this.currentSliderSize);
			this.currentSliderSize = this.slider[this.sizeProperty]();

			// resize handle
			this.handleSize = Math.round(this.currentSliderSize * this.ratio);
			this.handle.css(this.sizeProperty, this.handleSize);
			this.handleSize = this.handle[this.fullSizeProperty]();

			return this;
		},
		setRatio: function(ratio) {
			this.ratio = ratio;
			return this;
		},
		setMaxValue: function(maxValue) {
			this.maxValue = maxValue;
			this.setValue(Math.min(this.value, this.maxValue));
			return this;
		},
		setValue: function(value) {
			this.value = value;
			if (this.value < 0) {
				this.value = 0;
			} else if (this.value > this.maxValue) {
				this.value = this.maxValue;
			}
			this.refresh();
		},
		setPosition: function(styles) {
			this.scrollbar.css(styles);
			return this;
		},
		hide: function() {
			this.scrollbar.detach();
			return this;
		},
		show: function() {
			this.scrollbar.appendTo(this.holder);
			return this;
		},
		refresh: function() {
			// recalculate handle position
			if (this.value === 0 || this.maxValue === 0) {
				this.calcOffset = 0;
			} else {
				this.calcOffset = (this.value / this.maxValue) * (this.currentSliderSize - this.handleSize);
			}
			this.handle.css(this.offsetProperty, this.calcOffset);

			// toggle inactive classes
			this.btnDec.toggleClass(this.options.inactiveClass, this.value === 0);
			this.btnInc.toggleClass(this.options.inactiveClass, this.value === this.maxValue);
			this.scrollbar.toggleClass(this.options.inactiveClass, this.maxValue === 0);
		},
		destroy: function() {
			// remove event handlers and scrollbar block itself
			this.btnDec.add(this.btnInc).off('jcf-pointerdown', this.onButtonPress);
			this.handle.off('jcf-pointerdown', this.onHandlePress);
			this.doc.off('jcf-pointermove', this.onHandleDrag);
			this.doc.off('jcf-pointerup', this.onHandleRelease);
			this.doc.off('jcf-pointerup', this.onButtonRelease);
			this.stopSmoothScrolling();
			this.stopPageScrolling();
			this.scrollbar.remove();
		}
	});

}(jQuery, this));


/*!
 * JavaScript Custom Forms : Radio Module
 *
 * Copyright 2014-2015 PSD2HTML - http://psd2html.com/jcf
 * Released under the MIT license (LICENSE.txt)
 *
 * Version: 1.1.3
 */
;(function($) {
	'use strict';

	jcf.addModule({
		name: 'Radio',
		selector: 'input[type="radio"]',
		options: {
			wrapNative: true,
			checkedClass: 'jcf-checked',
			uncheckedClass: 'jcf-unchecked',
			labelActiveClass: 'jcf-label-active',
			fakeStructure: '<span class="jcf-radio"><span></span></span>'
		},
		matchElement: function(element) {
			return element.is(':radio');
		},
		init: function() {
			this.initStructure();
			this.attachEvents();
			this.refresh();
		},
		initStructure: function() {
			// prepare structure
			this.doc = $(document);
			this.realElement = $(this.options.element);
			this.fakeElement = $(this.options.fakeStructure).insertAfter(this.realElement);
			this.labelElement = this.getLabelFor();

			if (this.options.wrapNative) {
				// wrap native radio inside fake block
				this.realElement.prependTo(this.fakeElement).css({
					position: 'absolute',
					opacity: 0
				});
			} else {
				// just hide native radio
				this.realElement.addClass(this.options.hiddenClass);
			}
		},
		attachEvents: function() {
			// add event handlers
			this.realElement.on({
				focus: this.onFocus,
				click: this.onRealClick
			});
			this.fakeElement.on('click', this.onFakeClick);
			this.fakeElement.on('jcf-pointerdown', this.onPress);
		},
		onRealClick: function(e) {
			// redraw current radio and its group (setTimeout handles click that might be prevented)
			var self = this;
			this.savedEventObject = e;
			setTimeout(function() {
				self.refreshRadioGroup();
			}, 0);
		},
		onFakeClick: function(e) {
			// skip event if clicked on real element inside wrapper
			if (this.options.wrapNative && this.realElement.is(e.target)) {
				return;
			}

			// toggle checked class
			if (!this.realElement.is(':disabled')) {
				delete this.savedEventObject;
				this.currentActiveRadio = this.getCurrentActiveRadio();
				this.stateChecked = this.realElement.prop('checked');
				this.realElement.prop('checked', true);
				this.fireNativeEvent(this.realElement, 'click');
				if (this.savedEventObject && this.savedEventObject.isDefaultPrevented()) {
					this.realElement.prop('checked', this.stateChecked);
					this.currentActiveRadio.prop('checked', true);
				} else {
					this.fireNativeEvent(this.realElement, 'change');
				}
				delete this.savedEventObject;
			}
		},
		onFocus: function() {
			if (!this.pressedFlag || !this.focusedFlag) {
				this.focusedFlag = true;
				this.fakeElement.addClass(this.options.focusClass);
				this.realElement.on('blur', this.onBlur);
			}
		},
		onBlur: function() {
			if (!this.pressedFlag) {
				this.focusedFlag = false;
				this.fakeElement.removeClass(this.options.focusClass);
				this.realElement.off('blur', this.onBlur);
			}
		},
		onPress: function(e) {
			if (!this.focusedFlag && e.pointerType === 'mouse') {
				this.realElement.focus();
			}
			this.pressedFlag = true;
			this.fakeElement.addClass(this.options.pressedClass);
			this.doc.on('jcf-pointerup', this.onRelease);
		},
		onRelease: function(e) {
			if (this.focusedFlag && e.pointerType === 'mouse') {
				this.realElement.focus();
			}
			this.pressedFlag = false;
			this.fakeElement.removeClass(this.options.pressedClass);
			this.doc.off('jcf-pointerup', this.onRelease);
		},
		getCurrentActiveRadio: function() {
			return this.getRadioGroup(this.realElement).filter(':checked');
		},
		getRadioGroup: function(radio) {
			// find radio group for specified radio button
			var name = radio.attr('name'),
				parentForm = radio.parents('form');

			if (name) {
				if (parentForm.length) {
					return parentForm.find('input[name="' + name + '"]');
				} else {
					return $('input[name="' + name + '"]:not(form input)');
				}
			} else {
				return radio;
			}
		},
		getLabelFor: function() {
			var parentLabel = this.realElement.closest('label'),
				elementId = this.realElement.prop('id');

			if (!parentLabel.length && elementId) {
				parentLabel = $('label[for="' + elementId + '"]');
			}
			return parentLabel.length ? parentLabel : null;
		},
		refreshRadioGroup: function() {
			// redraw current radio and its group
			this.getRadioGroup(this.realElement).each(function() {
				jcf.refresh(this);
			});
		},
		refresh: function() {
			// redraw current radio button
			var isChecked = this.realElement.is(':checked'),
				isDisabled = this.realElement.is(':disabled');

			this.fakeElement.toggleClass(this.options.checkedClass, isChecked)
							.toggleClass(this.options.uncheckedClass, !isChecked)
							.toggleClass(this.options.disabledClass, isDisabled);

			if (this.labelElement) {
				this.labelElement.toggleClass(this.options.labelActiveClass, isChecked);
			}
		},
		destroy: function() {
			// restore structure
			if (this.options.wrapNative) {
				this.realElement.insertBefore(this.fakeElement).css({
					position: '',
					width: '',
					height: '',
					opacity: '',
					margin: ''
				});
			} else {
				this.realElement.removeClass(this.options.hiddenClass);
			}

			// removing element will also remove its event handlers
			this.fakeElement.off('jcf-pointerdown', this.onPress);
			this.fakeElement.remove();

			// remove other event handlers
			this.doc.off('jcf-pointerup', this.onRelease);
			this.realElement.off({
				blur: this.onBlur,
				focus: this.onFocus,
				click: this.onRealClick
			});
		}
	});

}(jQuery));


 /*!
 * JavaScript Custom Forms : Checkbox Module
 *
 * Copyright 2014-2015 PSD2HTML - http://psd2html.com/jcf
 * Released under the MIT license (LICENSE.txt)
 *
 * Version: 1.1.3
 */
;(function($) {
	'use strict';

	jcf.addModule({
		name: 'Checkbox',
		selector: 'input[type="checkbox"]',
		options: {
			wrapNative: true,
			checkedClass: 'jcf-checked',
			uncheckedClass: 'jcf-unchecked',
			labelActiveClass: 'jcf-label-active',
			fakeStructure: '<span class="jcf-checkbox"><span></span></span>'
		},
		matchElement: function(element) {
			return element.is(':checkbox');
		},
		init: function() {
			this.initStructure();
			this.attachEvents();
			this.refresh();
		},
		initStructure: function() {
			// prepare structure
			this.doc = $(document);
			this.realElement = $(this.options.element);
			this.fakeElement = $(this.options.fakeStructure).insertAfter(this.realElement);
			this.labelElement = this.getLabelFor();

			if (this.options.wrapNative) {
				// wrap native checkbox inside fake block
				this.realElement.appendTo(this.fakeElement).css({
					position: 'absolute',
					height: '100%',
					width: '100%',
					opacity: 0,
					margin: 0
				});
			} else {
				// just hide native checkbox
				this.realElement.addClass(this.options.hiddenClass);
			}
		},
		attachEvents: function() {
			// add event handlers
			this.realElement.on({
				focus: this.onFocus,
				click: this.onRealClick
			});
			this.fakeElement.on('click', this.onFakeClick);
			this.fakeElement.on('jcf-pointerdown', this.onPress);
		},
		onRealClick: function(e) {
			// just redraw fake element (setTimeout handles click that might be prevented)
			var self = this;
			this.savedEventObject = e;
			setTimeout(function() {
				self.refresh();
			}, 0);
		},
		onFakeClick: function(e) {
			// skip event if clicked on real element inside wrapper
			if (this.options.wrapNative && this.realElement.is(e.target)) {
				return;
			}

			// toggle checked class
			if (!this.realElement.is(':disabled')) {
				delete this.savedEventObject;
				this.stateChecked = this.realElement.prop('checked');
				this.realElement.prop('checked', !this.stateChecked);
				this.fireNativeEvent(this.realElement, 'click');
				if (this.savedEventObject && this.savedEventObject.isDefaultPrevented()) {
					this.realElement.prop('checked', this.stateChecked);
				} else {
					this.fireNativeEvent(this.realElement, 'change');
				}
				delete this.savedEventObject;
			}
		},
		onFocus: function() {
			if (!this.pressedFlag || !this.focusedFlag) {
				this.focusedFlag = true;
				this.fakeElement.addClass(this.options.focusClass);
				this.realElement.on('blur', this.onBlur);
			}
		},
		onBlur: function() {
			if (!this.pressedFlag) {
				this.focusedFlag = false;
				this.fakeElement.removeClass(this.options.focusClass);
				this.realElement.off('blur', this.onBlur);
			}
		},
		onPress: function(e) {
			if (!this.focusedFlag && e.pointerType === 'mouse') {
				this.realElement.focus();
			}
			this.pressedFlag = true;
			this.fakeElement.addClass(this.options.pressedClass);
			this.doc.on('jcf-pointerup', this.onRelease);
		},
		onRelease: function(e) {
			if (this.focusedFlag && e.pointerType === 'mouse') {
				this.realElement.focus();
			}
			this.pressedFlag = false;
			this.fakeElement.removeClass(this.options.pressedClass);
			this.doc.off('jcf-pointerup', this.onRelease);
		},
		getLabelFor: function() {
			var parentLabel = this.realElement.closest('label'),
				elementId = this.realElement.prop('id');

			if (!parentLabel.length && elementId) {
				parentLabel = $('label[for="' + elementId + '"]');
			}
			return parentLabel.length ? parentLabel : null;
		},
		refresh: function() {
			// redraw custom checkbox
			var isChecked = this.realElement.is(':checked'),
				isDisabled = this.realElement.is(':disabled');

			this.fakeElement.toggleClass(this.options.checkedClass, isChecked)
							.toggleClass(this.options.uncheckedClass, !isChecked)
							.toggleClass(this.options.disabledClass, isDisabled);

			if (this.labelElement) {
				this.labelElement.toggleClass(this.options.labelActiveClass, isChecked);
			}
		},
		destroy: function() {
			// restore structure
			if (this.options.wrapNative) {
				this.realElement.insertBefore(this.fakeElement).css({
					position: '',
					width: '',
					height: '',
					opacity: '',
					margin: ''
				});
			} else {
				this.realElement.removeClass(this.options.hiddenClass);
			}

			// removing element will also remove its event handlers
			this.fakeElement.off('jcf-pointerdown', this.onPress);
			this.fakeElement.remove();

			// remove other event handlers
			this.doc.off('jcf-pointerup', this.onRelease);
			this.realElement.off({
				focus: this.onFocus,
				click: this.onRealClick
			});
		}
	});

}(jQuery));


/*
 * Mobile hover plugin
 */
;(function($){

	// detect device type
	var isTouchDevice = ('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch,
		isWinPhoneDevice = /Windows Phone/.test(navigator.userAgent);

	// define events
	var eventOn = (isTouchDevice && 'touchstart') || (isWinPhoneDevice && navigator.pointerEnabled && 'pointerdown') || (isWinPhoneDevice && navigator.msPointerEnabled && 'MSPointerDown') || 'mouseenter',
		eventOff = (isTouchDevice && 'touchend') || (isWinPhoneDevice && navigator.pointerEnabled && 'pointerup') || (isWinPhoneDevice && navigator.msPointerEnabled && 'MSPointerUp') || 'mouseleave';

	// event handlers
	var toggleOn, toggleOff, preventHandler;
	if(isTouchDevice || isWinPhoneDevice) {
		// prevent click handler
		preventHandler = function(e) {
			e.preventDefault();
		};

		// touch device handlers
		toggleOn = function(e) {
			var options = e.data, element = $(this);

			var toggleOff = function(e) {
				var target = $(e.target);
				if (!target.is(element) && !target.closest(element).length) {
					element.removeClass(options.hoverClass);
					element.off('click', preventHandler);
					if(options.onLeave) options.onLeave(element);
					$(document).off(eventOn, toggleOff);
				}
			};

			if(!element.hasClass(options.hoverClass)) {
				element.addClass(options.hoverClass);
				element.one('click', preventHandler);
				$(document).on(eventOn, toggleOff);
				if(options.onHover) options.onHover(element);
			}
		};
	} else {
		// desktop browser handlers
		toggleOn = function(e) {
			var options = e.data, element = $(this);
			element.addClass(options.hoverClass);
			$(options.context).on(eventOff, options.selector, options, toggleOff);
			if(options.onHover) options.onHover(element);
		};
		toggleOff = function(e) {
			var options = e.data, element = $(this);
			element.removeClass(options.hoverClass);
			$(options.context).off(eventOff, options.selector, toggleOff);
			if(options.onLeave) options.onLeave(element);
		};
	}

	// jQuery plugin
	$.fn.touchHover = function(opt) {
		var options = $.extend({
			context: this.context,
			selector: this.selector,
			hoverClass: 'hover'
		}, opt);

		$(this.context).on(eventOn, this.selector, options, toggleOn);
		return this;
	};
}(jQuery));
