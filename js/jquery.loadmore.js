jQuery(function() {
	jQuery('.load-more-holder').loadMore({
		newContentTarget: '.load-more-content'
	});

	jQuery('.frame').loadMore({
		scroll: true,
		additionBottomOffset: 1,
		busyClass: 'is-busy',
		preAppendClass: 'new-item'
	});
});

/*
 * jQuery Load More plugin
 */
;(function($, $win) {
	'use strict';

	var ScrollLoader = {
		attachEvents: function() {
			var self = this;

			$win.on('load.ScrollLoader resize.ScrollLoader orientationchange.ScrollLoader', function() { self.onResizeHandler(); });
			$win.on('scroll.ScrollLoader', function() { self.onScrollHandler(); });
			this.$holder.on('ContentLoader/loaded.ScrollLoader', function() { self.onResizeHandler(); });

			this.winProps = {};
			this.holderProps = {};
			this.onResizeHandler();
		},

		onResizeHandler: function() {
			this.winProps.height = $win.height();
			this.holderProps.height = this.$holder.outerHeight();
			this.holderProps.offset = this.$holder.offset().top;

			this.onScrollHandler();
		},

		onScrollHandler: function() {
			this.winProps.scroll = $win.scrollTop();

			if (this.winProps.scroll + this.winProps.height + Math.min(1, this.options.additionBottomOffset) > this.holderProps.height + this.holderProps.offset) {
				this.loadInclude();
			}
		},

		destroySubEvents: function() {
			$win.off('.ScrollLoader');
			this.$holder.off('.ScrollLoader');
		}
	};

	var ClickLoader = {
		attachEvents: function() {
			var self = this;

			this.$holder.on('click.ClickLoader', this.options.linkSelector, function(e) { self.onClickHandler(e); });
		},

		onClickHandler: function(e) {
			e.preventDefault();

			this.loadInclude();
		},

		destroySubEvents: function() {
			this.$holder.off('.ClickLoader');
		}
	};

	var ContentLoader = function($holder, options) {
		this.$holder = $holder;
		this.options = options;

		this.init();
	};

	var ContentLoaderProto = {
		init: function() {
			this.$link = this.$holder.find(this.options.linkSelector);
			this.$newContentTarget = this.options.newContentTarget ? this.$holder.find(this.options.newContentTarget) : this.$holder;

			if (!this.$link.length) {
				this.removeInstance();
				return;
			}

			this.attachEvents();
		},

		loadInclude: function() {
			if (this.isBusy) {
				return;
			}

			var self = this;

			this.toggleBusyMode(true);

			$.get(self.$link.attr('href'), function(source) { self.successHandler(source); });
		},

		successHandler: function(include) {
			var $tmpDiv = jQuery('<div>').html(include);
			var $nextIncludeLink = $tmpDiv.find(this.options.linkSelector);

			if ($nextIncludeLink.length) {
				this.refreshLink($nextIncludeLink);
			} else {
				this.destroy();
			}

			this.appendItems($tmpDiv.children());
		},

		appendItems: function($newItems) {
			var self = this;

			this.$newContentTarget.append($newItems.addClass(this.options.preAppendClass));

			setTimeout(function() { // need this timeout coz need some time for css preAppendClass applied to the new items
				$newItems.removeClass(self.options.preAppendClass);

				self.toggleBusyMode(false);
				self.$holder.trigger('ContentLoader/loaded');
			}, 100);

			if (window.picturefill) {
				window.picturefill();
			}
		},

		refreshLink: function($nextIncludeLink) {
			this.$link.attr('href', $nextIncludeLink.attr('href'));
			$nextIncludeLink.remove();
		},

		toggleBusyMode: function(state) {
			this.$holder.toggleClass(this.options.busyClass, state);
			this.isBusy = state;
		},

		removeInstance: function() {
			this.$holder.removeData('ContentLoader');
		},

		destroy: function() {
			this.removeInstance();
			this.destroySubEvents();

			this.$link.remove();
		}
	};

	$.fn.loadMore = function(opt) {
		var args = Array.prototype.slice.call(arguments);
		var method = args[0];

		var options = $.extend({
			scroll: false,
			linkSelector: '.load-more',
			newContentTarget: null,
			busyClass: 'is-busy',
			additionBottomOffset: 50,
			preAppendClass: 'new-item'
		}, opt);

		return this.each(function() {
			var $holder = jQuery(this);
			var instance = $holder.data('ContentLoader');

			if (typeof opt === 'object' || typeof opt === 'undefined') {
				ContentLoader.prototype = $.extend(options.scroll ? ScrollLoader : ClickLoader, ContentLoaderProto);

				$holder.data('ContentLoader', new ContentLoader($holder, options));
			} else if (typeof method === 'string' && instance) {
				if (typeof instance[method] === 'function') {
					args.shift();
					instance[method].apply(instance, args);
				}
			}
		});
	};
}(jQuery, jQuery(window)));
