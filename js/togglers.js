function Togglers(togglers, panels, settings, autocreate) {

	this.togglers     = null;
	this.panels       = null;
	this.settings     = null;
	this.single       = true;
	this.hashes       = true;
	this.closeOutside = false;
	this.initial      = false;

	this.openOn   = {};
	this.closeOn  = {};
	this.toggleOn = {};

	this.items    = [];
	this.opened   = [];
	this.paused   = false;
	this.cssclass = "open";

	if (togglers && (togglers = $(togglers)).length) {
		this.togglers = togglers;

		if (panels && (panels = $(panels)).length) {
			this.panels  = panels;
		}

		if (typeof settings === "object") {
			this.settings = settings;

			if (typeof settings.openOn === "object") {
				this.openOn = settings.openOn;
			}

			if (typeof settings.closeOn === "object") {
				this.closeOn = settings.closeOn;
			}

			if (typeof settings.toggleOn === "object") {
				this.toggleOn = settings.toggleOn;
			}

			if (typeof settings.single === "boolean") {
				this.single = settings.single;
			}

			if (typeof settings.cssclass === "string") {
				this.cssclass = settings.cssclass;
			}

			if (settings.hashes === false) {
				this.hashes = false;
			}

			if (settings.closeOutside === true) {
				this.closeOutside = true;
			}

			if (typeof settings.initial === "number") {
				this.initial = parseInt(settings.initial);
			}
		}

		if (autocreate !== false) {
			this.create();
		}
	}
};


Togglers.prototype = {
	constructor : Togglers,

	create : function() {
		this.togglers.each(function(index, toggler) {
			curitem = this.items[index] = {
				subject : this.panels[index] ? $(this.panels[index]) : null,
				toggler : $(toggler),
				oncount : 0
			};

			$.each(this.openOn, function(element, actions) {
				if (curitem[element]) {
					curitem[element].on(actions, this.check.bind(this, index, true));
				}
			}.bind(this));

			$.each(this.closeOn, function(element, actions) {
				if (curitem[element]) {
					curitem[element].on(actions, this.check.bind(this, index, false));
				}
			}.bind(this));

			$.each(this.toggleOn, function(element, actions) {
				if (curitem[element]) {
					curitem[element].on(actions, this.toggle.bind(this, index));
				}
			}.bind(this));
		}.bind(this));

		if (this.hashes) {
			$(window).on("hashchange", function() {
				var hashed = this.getHashed();
				if (hashed !== false) {
					return this.open(hashed);
				}
			}.bind(this));

			var hashed = this.getHashed();
			if (hashed !== false) {
				return this.open(hashed);
			}
		}

		if (this.initial !== false) {
			return this.open(this.initial);
		}

		if (this.closeOutside) {
			var self = this;
			$(document).on("click", function(e) {
				if (!$(e.target).closest(self.togglers).length && !$(e.target).closest(self.panels).length) {
					self.close();
				}
			});
		}

		return this;
	},


	destroy : function() {
		this.constructor(this.togglers, this.panels, this.settings, false);
		return this;
	},


	check : function(index, activate) {
		if (this.togglers === null) {
			return this;
		}

		if (!this.paused) {
			if (activate) {
				this.items[index].oncount++;
				this.open(index);
			}
			else {
				this.items[index].oncount--;


				if (!this.items[index].oncount) {
					this.close(index);
				}
			}
		}
		return this;
	},


	open : function(index) {
		if (this.togglers === null) {
			return this;
		}

		if (index === undefined) {
			if (this.single) {
				this.open(0);
			}
			else {
				$.each(this.togglers, function(togglerindex, toggler) {
					this.open(togglerindex);
				}.bind(this));
			}
			return this;
		}

		$.each(this.opened, function(openindex, opened) {
			if (this.single && opened !== index) {
				this.close(opened);
			}
		}.bind(this));

		if (this.opened.indexOf(index) === -1) {
			this.items[index].toggler.addClass(this.cssclass);

			if (this.items[index].subject) {
				this.items[index].subject.addClass(this.cssclass);
			}

			$(this).trigger("openItem", index);

			this.opened.push(index);
		}

		return this;
	},


	close : function(index) {
		if (this.togglers === null) {
			return this;
		}

		if (index === undefined) {
			$.each(this.opened, function(openindex, opened) {
				this.close(opened);
			}.bind(this));

			return this;
		}

		var opened = this.opened.indexOf(index);

		if (opened !== -1) {
			this.opened.splice(opened, 1);

			this.items[index].toggler.removeClass(this.cssclass);

			if (this.items[index].subject) {
				this.items[index].subject.removeClass(this.cssclass);
			}

			$(this).trigger("closeItem", index);
		}

		return this;
	},


	toggle : function(index) {
		if (this.togglers === null) {
			return this;
		}

		if (index === undefined) {
			$.each(this.togglers, function(togglerindex, toggler) {
				this.toggle(togglerindex);
			}.bind(this));

			return this;
		}

		var opened = this.opened.indexOf(index) !== -1;

		if (opened) {
			this.close(index);
		}
		else {
			this.open(index);
		}

		$(this).trigger("toggleItem", index);

		return this;
	},


	getHashed : function() {
		var hash    = false,
			hashed  = false;

		if (document.URL.lastIndexOf("#") !== -1) {
			hash = document.URL.slice(document.URL.lastIndexOf("#"));
		}

		if (hash) {
			$.each(this.items, function(index, curitem) {
				if (curitem.subject.is(hash)) {
					hashed = index;
				}
			});
		}

		return hashed;
	},


	pause : function() {
		this.paused = true;
		return this;
	},


	resume : function() {
		this.paused = false;
		return this;
	}
};


/**
 * Dropdown menu preset
 */
Togglers.DropdownMenu = function(togglers, panels, autocreate) {
	return new Togglers(togglers, panels, {
		openOn: {
			toggler : "mouseenter",
			subject : "mouseenter"
		},
		closeOn: {
			toggler : "mouseleave",
			subject : "mouseleave"
		},
		hashes: false
	}, autocreate);
};


/**
 * Toggler that also closes on click outside
*/
Togglers.ClickDropdownMenu = function(togglers, panels, autocreate) {
	return new Togglers(togglers, panels, {
		toggleOn: {
			toggler : "click"
		},
		hashes       : false,
		//closeOutside : true
	}, autocreate);
};


/**
 * Hover tab menu preset
 */
Togglers.HoverTabMenu = function(togglers, panels, autocreate) {
	return new Togglers(togglers, panels, {
		openOn: {
			toggler : "mouseenter"
		},
		hashes: false,
		initial: 0
	}, autocreate);
};


/**
 * Click tab menu preset
 */
Togglers.ClickTabMenu = function(togglers, panels, autocreate) {
	return new Togglers(togglers, panels, {
		openOn: {
			toggler : "click"
		},
		initial: 0
	}, autocreate);
};


/**
 * Accordion menu preset
 */
Togglers.AccordionMenu = function(togglers, panels, autocreate) {
	return new Togglers(togglers, panels, {
		toggleOn: {
			toggler : "click"
		},
		single : false
	}, autocreate);
};


/**
 * Changes behavior based on width
*/
Togglers.HybridMenu = function(togglers, panels, autocreate) {
	var accordion = new Togglers(togglers, panels, {
		toggleOn: {
			toggler : "click"
		},
		cssclass: "accordion-open"
	}, autocreate);

	var tabs = new Togglers(togglers, panels, {
		openOn: {
			toggler : "click"
		},
		cssclass: "tab-open",
		initial: 0
	}, autocreate);

	return {
		accordion : accordion,
		tabs      : tabs
	};
};


/**
 * Closed toggler menu preset
*/
Togglers.Collapser = function(togglers, panels, autocreate) {
	return new Togglers(togglers, panels, {
		toggleOn: {
			toggler : "click"
		}
	}, autocreate);
};