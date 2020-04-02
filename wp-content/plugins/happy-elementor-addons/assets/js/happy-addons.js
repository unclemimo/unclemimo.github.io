'use strict';

(function ($, w) {
    var $window = $(w);

    $.fn.getHappySettings = function() {
        return this.data('happy-settings');
    };

    function debounce(func, wait, immediate) {
        var timeout;
        return function() {
            var context = this, args = arguments;
            var later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    }

    function initFilterable($scope, filterFn) {
        var $filterable = $scope.find('.hajs-gallery-filter');
        if ($filterable.length) {
            $filterable.on('click', 'button', function(event) {
                event.stopPropagation();

                var $current = $(this);
                $current
                    .parent()
                    .addClass('ha-filter-active')
                    .siblings()
                    .removeClass('ha-filter-active');
                filterFn($current.data('filter'));
            });
        }
    }

    function initPopupGallery($scope, selector, hasPopup, key) {
        if ( ! $.fn.magnificPopup ) {
            return;
        }

        if ( ! hasPopup ) {
            $.magnificPopup.close();
            return;
        }

        $scope.on('click', selector, function(event) {
            event.stopPropagation();
        });

        $scope.find(selector).magnificPopup({
            key: key,
            type: 'image',
            image: {
                titleSrc: function(item) {
                    return item.el.attr('title') ? item.el.attr('title') : item.el.find('img').attr('alt');
                }
            },
            gallery: {
                enabled: true,
                preload: [1,2]
            },
            zoom: {
                enabled: true,
                duration: 300,
                easing: 'ease-in-out',
                opener: function(openerElement) {
                    return openerElement.is('img') ? openerElement : openerElement.find('img');
                }
            }
        });
    }

    var HandleImageCompare = function($scope) {
        var $item = $scope.find('.hajs-image-comparison'),
            settings = $item.getHappySettings(),
            fieldMap = {
                on_hover: 'move_slider_on_hover',
                on_swipe: 'move_with_handle_only',
                on_click: 'click_to_move'
            };

        settings[fieldMap[settings.move_handle || 'on_swipe']] = true;
        delete settings.move_handle;

        $item.imagesLoaded().done(function() {
            $item.twentytwenty(settings);

            var t = setTimeout(function() {
                $window.trigger('resize.twentytwenty');
                clearTimeout(t);
            }, 400);
        });
    };

    var HandleJustifiedGallery = function($scope) {
        var $item = $scope.find('.hajs-justified-gallery'),
            settings = $item.getHappySettings(),
            hasPopup = settings.enable_popup;

        $item.justifiedGallery($.extend({}, {
            rowHeight: 150,
            lastRow: 'justify',
            margins: 10,
        }, settings));

        initPopupGallery($scope, '.ha-js-popup', hasPopup, 'justifiedgallery');

        initFilterable($scope, function(filter) {
            $item.justifiedGallery({
                lastRow: (filter === '*' ? settings.lastRow : 'nojustify'),
                filter: filter
            });
            var selector = filter !== '*' ? filter : '.ha-js-popup';
            initPopupGallery($scope, selector, hasPopup, 'justifiedgallery');
        });
    };

    $window.on('elementor/frontend/init', function() {
        var EF = elementorFrontend,
            EM = elementorModules;

        var ExtensionHandler = EM.frontend.handlers.Base.extend({
            onInit: function() {
                EM.frontend.handlers.Base.prototype.onInit.apply(this, arguments);
                this.widgetContainer = this.$element.find('.elementor-widget-container')[0];

                this.initFloatingEffects();

                this.initBackgroundOverlay();
            },

            initBackgroundOverlay: function() {
                if (this.isEdit) {
                    this.$element.addClass('ha-has-background-overlay')
                }
            },

            getDefaultSettings: function() {
                return {
                    targets: this.widgetContainer,
                    loop: true,
                    direction: 'alternate',
                    easing: 'easeInOutSine',
                };
            },

            onElementChange: function(changedProp) {
                if (changedProp.indexOf('ha_floating') !== -1) {
                    this.runOnElementChange();
                }
            },

            runOnElementChange: debounce(function() {
                this.animation && this.animation.restart();
                this.initFloatingEffects();
            }, 200),

            getConfig: function(key) {
                return this.getElementSettings('ha_floating_fx_' + key);
            },

            initFloatingEffects: function() {
                var config = this.getDefaultSettings();

                if (this.getConfig('translate_toggle')) {
                    if (this.getConfig('translate_x.size') || this.getConfig('translate_x.sizes.to')) {
                        config.translateX = {
                            value: [this.getConfig('translate_x.sizes.from') || 0, this.getConfig('translate_x.size') || this.getConfig('translate_x.sizes.to')],
                            duration: this.getConfig('translate_duration.size'),
                            delay: this.getConfig('translate_delay.size') || 0
                        }
                    }
                    if (this.getConfig('translate_y.size') || this.getConfig('translate_y.sizes.to')) {
                        config.translateY = {
                            value: [this.getConfig('translate_y.sizes.from') || 0, this.getConfig('translate_y.size') || this.getConfig('translate_y.sizes.to')],
                            duration: this.getConfig('translate_duration.size'),
                            delay: this.getConfig('translate_delay.size') || 0
                        }
                    }
                }

                if (this.getConfig('rotate_toggle')) {
                    if (this.getConfig('rotate_x.size') || this.getConfig('rotate_x.sizes.to')) {
                        config.rotateX = {
                            value: [this.getConfig('rotate_x.sizes.from') || 0, this.getConfig('rotate_x.size') || this.getConfig('rotate_x.sizes.to')],
                            duration: this.getConfig('rotate_duration.size'),
                            delay: this.getConfig('rotate_delay.size') || 0
                        }
                    }
                    if (this.getConfig('rotate_y.size') || this.getConfig('rotate_y.sizes.to')) {
                        config.rotateY = {
                            value: [this.getConfig('rotate_y.sizes.from') || 0, this.getConfig('rotate_y.size') || this.getConfig('rotate_y.sizes.to')],
                            duration: this.getConfig('rotate_duration.size'),
                            delay: this.getConfig('rotate_delay.size') || 0
                        }
                    }
                    if (this.getConfig('rotate_z.size') || this.getConfig('rotate_z.sizes.to')) {
                        config.rotateZ = {
                            value: [this.getConfig('rotate_z.sizes.from') || 0, this.getConfig('rotate_z.size') || this.getConfig('rotate_z.sizes.to')],
                            duration: this.getConfig('rotate_duration.size'),
                            delay: this.getConfig('rotate_delay.size') || 0
                        }
                    }
                }

                if (this.getConfig('scale_toggle')) {
                    if (this.getConfig('scale_x.size') || this.getConfig('scale_x.sizes.to')) {
                        config.scaleX = {
                            value: [this.getConfig('scale_x.sizes.from') || 0, this.getConfig('scale_x.size') || this.getConfig('scale_x.sizes.to')],
                            duration: this.getConfig('scale_duration.size'),
                            delay: this.getConfig('scale_delay.size') || 0
                        }
                    }
                    if (this.getConfig('scale_y.size') || this.getConfig('scale_y.sizes.to')) {
                        config.scaleY = {
                            value: [this.getConfig('scale_y.sizes.from') || 0, this.getConfig('scale_y.size') || this.getConfig('scale_y.sizes.to')],
                            duration: this.getConfig('scale_duration.size'),
                            delay: this.getConfig('scale_delay.size') || 0
                        }
                    }
                }

                if (this.getConfig('translate_toggle') || this.getConfig('rotate_toggle') || this.getConfig('scale_toggle')) {
                    this.widgetContainer.style.setProperty('will-change', 'transform');
                    this.animation = anime(config);
                }
            }
        });

        var Slick = EM.frontend.handlers.Base.extend({
            onInit: function () {
                EM.frontend.handlers.Base.prototype.onInit.apply(this, arguments);
                this.$container = this.$element.find('.hajs-slick');
                this.run();
            },

            isCarousel: function() {
                return this.$element.hasClass('ha-carousel');
            },

            getDefaultSettings: function() {
                return {
                    arrows: false,
                    dots: false,
                    checkVisible: false,
                    infinite: true,
                    slidesToShow: this.isCarousel() ? 3 : 1,
                    rows: 0,
                    prevArrow: '<button type="button" class="slick-prev"><i class="fa fa-chevron-left"></i></button>',
                    nextArrow: '<button type="button" class="slick-next"><i class="fa fa-chevron-right"></i></button>',
                }
            },

            onElementChange: function() {
                this.$container.slick('unslick');
                this.run();
            },

            getReadySettings: function() {
                var settings = {
                    infinite: !! this.getElementSettings('loop'),
                    autoplay: !! this.getElementSettings('autoplay'),
                    autoplaySpeed: this.getElementSettings('autoplay_speed'),
                    speed: this.getElementSettings('animation_speed'),
                    centerMode: !! this.getElementSettings('center'),
                    vertical: !! this.getElementSettings('vertical'),
                    slidesToScroll: 1,
                };

                switch (this.getElementSettings('navigation')) {
                    case 'arrow':
                        settings.arrows = true;
                        break;
                    case 'dots':
                        settings.dots = true;
                        break;
                    case 'both':
                        settings.arrows = true;
                        settings.dots = true;
                        break;
                }

                if (this.isCarousel()) {
                    settings.slidesToShow = this.getElementSettings('slides_to_show') || 3;
                    settings.responsive = [
                        {
                            breakpoint: EF.config.breakpoints.lg,
                            settings: {
                                slidesToShow: (this.getElementSettings('slides_to_show_tablet') || settings.slidesToShow),
                            }
                        },
                        {
                            breakpoint: EF.config.breakpoints.md,
                            settings: {
                                slidesToShow: (this.getElementSettings('slides_to_show_mobile') || this.getElementSettings('slides_to_show_tablet')) || settings.slidesToShow,
                            }
                        }
                    ];
                }

                return $.extend({}, this.getDefaultSettings(), settings);
            },

            run: function() {
                this.$container.slick(this.getReadySettings());
            }
        });

        var NumberHandler = function($scope) {
            EF.waypoint($scope, function () {
                var $number = $scope.find('.ha-number-text');
                $number.numerator($number.data('animation'));
            });
        };

        var SkillHandler = function($scope) {
            EF.waypoint($scope, function () {
                $scope.find('.ha-skill-level').each(function() {
                    var $current = $(this),
                        $lt = $current.find('.ha-skill-level-text'),
                        lv = $current.data('level');

                    $current.animate({
                        width: lv+'%'
                    }, 500);
                    $lt.numerator({
                        toValue: lv + '%',
                        duration: 1300,
                        onStep: function() {
                            $lt.append('%');
                        }
                    });
                });
            });
        };

        var Isotope = EM.frontend.handlers.Base.extend({
            onInit: function () {
                EM.frontend.handlers.Base.prototype.onInit.apply(this, arguments);
                this.$container = this.$element.find('.hajs-isotope');
                this.run();
                this.runFilter();
            },

            getLayoutMode: function() {
                var layout = this.getElementSettings('layout');
                return ( layout === 'even' ? 'masonry' : layout );
            },

            getDefaultSettings: function() {
                return {
                    itemSelector: '.ha-image-grid-item',
                    percentPosition: true,
                    layoutMode: this.getLayoutMode()
                };
            },

            runFilter: function() {
                var self = this;
                initFilterable(this.$element, function(filter) {
                    self.$container.isotope({
                        filter: filter
                    });

                    var selector = filter !== '*' ? filter : '.ha-js-popup';
                    initPopupGallery(self.$element, selector, self.getElementSettings('enable_popup'), 'imagegrid');
                });
            },

            onElementChange: function(changedProp) {
                if (['layout', 'image_height', 'columns', 'image_margin', 'enable_popup'].indexOf(changedProp) !== -1) {
                    this.run();
                }
            },

            run: function() {
                var self = this;

                this.$container.isotope(self.getDefaultSettings());
                this.$container.imagesLoaded().progress(function() {
                    self.$container.isotope('layout');
                });

                initPopupGallery(this.$element, '.ha-js-popup', this.getElementSettings('enable_popup'), 'imagegrid');
            }
        });

	    //NewsTicker
	    var NewsTicker = EM.frontend.handlers.Base.extend({

		    onInit: function () {
			    EM.frontend.handlers.Base.prototype.onInit.apply(this, arguments);
			    this.wrapper = this.$element.find('.ha-news-ticker-wrapper');
			    this.run();
		    },
		    onElementChange: function (changed_prop) {
		    	if( changed_prop === 'item_space' || changed_prop === 'title_typography_font_size' ){
				    this.run();
			    }
		    },
		    run: function () {
			    var wrapper_height = this.wrapper.innerHeight(),
				    wrapper_width = this.wrapper.innerWidth(),
				    container = this.wrapper.find('.ha-news-ticker-container'),
				    single_item = container.find('.ha-news-ticker-item'),
				    scroll_direction = this.wrapper.data('scroll-direction'),
				    scroll = 'scroll'+scroll_direction+wrapper_height+wrapper_width,
				    duration = this.wrapper.data('duration'),
				    direction = 'normal',
				    all_title_width = 10;

			    var start = {'transform': 'translateX(0'+wrapper_width+'px)'},
			        end = {'transform': 'translateX(-101%)'};
			    if('right' === scroll_direction){
				    direction = 'reverse';
			    }
			    single_item.each(function(){
				    all_title_width += $(this).outerWidth(true);
			    });
			    container.css({'width':all_title_width,'display':'flex'});
			    $.keyframe.define([{
				    name: scroll,
				    '0%': start,
				    '100%':end,
			    }]);
			    container.playKeyframe({
				    name: scroll,
				    duration: duration+'ms',
				    timingFunction: 'linear',
				    delay: '0s',
				    iterationCount: 'infinite',
				    direction: direction,
				    fillMode: 'none',
				    complete: function(){
				    }
			    });
		    }
	    });

        // fun-factor
        var FunFactor = function ($scope) {
            EF.waypoint($scope, function () {
                var $fun_factor = $scope.find('.ha-fun-factor-content-number');
                $fun_factor.numerator($fun_factor.data('animation'));
            });
        };

		var BarChart = function( $scope ) {
			EF.waypoint($scope, function () {
				var $chart = $(this),
					$container = $chart.find( '.ha-bar-chart-container' ),
					$chart_canvas = $chart.find( '#ha-bar-chart' ),
					settings      = $container.data( 'settings' );

				if ( $container.length ) {
					new Chart( $chart_canvas, settings );
				}
			} );
		};

        //twitter Feed
        var TwitterFeed = function($scope) {
            var button = $scope.find('.ha-twitter-load-more');
            var twitter_wrap = $scope.find('.ha-tweet-items');
            button.on("click", function(e) {
                e.preventDefault();
                var $self = $(this),
                    query_settings = $self.data("settings"),
                    total = $self.data("total"),
                    items = $scope.find('.ha-tweet-item').length;
                $.ajax({
                    url: HappyTwitterLocalize.ajax_url,
                    type: 'POST',
                    data: {
                        action: "ha_twitter_feed_action",
                        security: HappyTwitterLocalize.nonce,
                        query_settings: query_settings,
                        loaded_item: items,
                    },
                    success: function(response) {
                        if(total > items){
                            $(response).appendTo(twitter_wrap);
                        }else{
                            $self.text('All Loaded').addClass('loaded');
                            setTimeout( function(){
                                $self.css({"display": "none"});
                            },800);
                        }
                    },
                    error: function(error) {}
                });
            });
        };

        $('[data-ha-element-link]').each(function() {
            var link = $(this).data('ha-element-link');
            $(this).on('click.haElementOnClick', function() {
                if (link.is_external) {
                    window.open(link.url);
                } else {
                    location.href = link.url;
                }
            })
        });

        var handlersFnMap = {
            'ha-image-compare.default': HandleImageCompare,
            'ha-justified-gallery.default': HandleJustifiedGallery,
            'ha-number.default': NumberHandler,
            'ha-skills.default': SkillHandler,
            'ha-fun-factor.default': FunFactor,
            'ha-bar-chart.default': BarChart,
            'ha-twitter-feed.default': TwitterFeed
        };

        $.each( handlersFnMap, function( widgetName, handlerFn ) {
            EF.hooks.addAction( 'frontend/element_ready/' + widgetName, handlerFn );
        });

        var handlersClassMap = {
            'ha-slider.default': Slick,
            'ha-carousel.default': Slick,
            'ha-image-grid.default': Isotope,
            'ha-news-ticker.default': NewsTicker,
            'widget': ExtensionHandler
        };

        $.each( handlersClassMap, function( widgetName, handlerClass ) {
            EF.hooks.addAction( 'frontend/element_ready/' + widgetName, function( $scope ) {
                EF.elementsHandler.addHandler( handlerClass, { $element: $scope });
            });
        });
    });

} (jQuery, window));
