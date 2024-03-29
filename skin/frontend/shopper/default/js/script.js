// Set pixelRatio to 1 if the browser doesn't offer it up.
var pixelRatio = !!window.devicePixelRatio ? window.devicePixelRatio : 1;
jQuery(window).on("load", function() {
    if (pixelRatio > 1) {
        var elements = {
            sort: jQuery('.sorter .sort-order a img'),
            page_next: jQuery('.pager .pages li a.next img'),
            page_prev: jQuery('.pager .pages li a.previous img'),
            zoom_out: jQuery('#zoom_out'),
            zoom_in: jQuery('#zoom_in')
        };
        for (var key in elements) {
            if (elements[key].length) {
                elements[key]
                    .width(elements[key].width())
                    .height(elements[key].height())
                    .attr('src', elements[key].attr('src').replace(/^(.*)\.gif$/,"$1@2x.png"));
            }
        }
        //product images
        jQuery('img[data-srcX2]').each(function(){
            jQuery(this).attr('src',jQuery(this).attr('data-srcX2'));
        });
        //custom block images.
        jQuery('img.retina').each(function(){
            var file_ext = jQuery(this).attr('src').split('.').pop();
            var pattern = new RegExp("^(.*)\."+file_ext+"+$");
            jQuery(this)
                .width(jQuery(this).width())
                .height(jQuery(this).height())
                .attr('src',jQuery(this).attr('src').replace(pattern,"$1_2x."+file_ext));
        });
    }
    //ipad and iphone fix
    if((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPod/i)) || (navigator.userAgent.match(/iPad/i))) {
        jQuery("#queldoreiNav li a").on({
            click: function () {
                if ( !mobile && jQuery(this).parent().hasClass('parent') ) {
                    if ( !jQuery(this).hasClass('touched') ) {
                        jQuery('#queldoreiNav a').removeClass('touched');
                        jQuery(this).parents('li').children('a').addClass('touched');
                        return false;
                    }
                }
            }
        });
        jQuery("#nav li a").on({
            click: function () {
                if ( !mobile && jQuery(this).parent().hasClass('parent') ) {
                    if ( !jQuery(this).hasClass('touched') ) {
                        jQuery('#nav a').removeClass('touched');
                        jQuery(this).parents('li').children('a').addClass('touched');
                        return false;
                    }
                }
            }
        });
        jQuery('.header-switch, .toolbar-switch').on({
            click: function (e) {
                jQuery(this).addClass('over');
            }
        });

    }

    jQuery(window).resize().scroll();
});

jQuery.fn.extend({
    scrollToMe: function () {
        var x = jQuery(this).offset().top - 100;
        jQuery('html,body').animate({scrollTop: x}, 500);
    }});

//actual width
;(function(a){a.fn.extend({actual:function(b,k){var c,d,h,g,f,j,e,i;if(!this[b]){throw'$.actual => The jQuery method "'+b+'" you called does not exist';}h=a.extend({absolute:false,clone:false,includeMargin:undefined},k);d=this;if(h.clone===true){e=function(){d=d.filter(":first").clone().css({position:"absolute",top:-1000}).appendTo("body");};i=function(){d.remove();};}else{e=function(){c=d.parents().andSelf().filter(":hidden");g=h.absolute===true?{position:"absolute",visibility:"hidden",display:"block"}:{visibility:"hidden",display:"block"};f=[];c.each(function(){var m={},l;for(l in g){m[l]=this.style[l];this.style[l]=g[l];}f.push(m);});};i=function(){c.each(function(m){var n=f[m],l;for(l in g){this.style[l]=n[l];}});};}e();j=/(outer)/g.test(b)?d[b](h.includeMargin):d[b]();i();return j;}});})(jQuery);

var sw, sh, scroll_critical,
    breakpoint = 959,
    mobile = false,
    resizeLimits = [0,479,767,959,1199,9999],
    _resizeLimit = {};

isResize = function(limitName){
    var current, w = jQuery(window).width();
    for( i=0; i<resizeLimits.length; i++ ){
        if (w > resizeLimits[i]) {
            current = i;
        } else {
            break;
        }
    }
    if ( _resizeLimit[limitName] === undefined || current != _resizeLimit[limitName] ) {
        _resizeLimit[limitName] = current;
        return true;
    }
    return false;
}

jQuery(function($){
    if (Shopper.totop) {
        $().UItoTop({scrollSpeed:400});
    }

    //.page-title-bg
    var page_title_height = '';
    if ( $('.main-container .page-title').length ) {
        var $p = $('<div class="page-title-bg" />').css({height: $('.main-container .page-title').height()+60 });
        $('.main-container').prepend($p);
        page_title_height = 'title';
    } else if ( $('.main-container .breadcrumbs:visible').length ) {
        var $p = $('<div class="page-title-bg" />').css({height: $('.main-container .breadcrumbs').height() });
        $('.main-container').prepend($p);
        page_title_height = 'breadcrumbs';
        if ( $('.product-category-title').length ) {
            $('.main-container .page-title-bg').css({height: $('.main-container .breadcrumbs').height() + $('.product-category-title').outerHeight() });
            page_title_height = 'breadcrumbs_category';
        }
    }

    $(window).resize(function(){

        if ( !isResize('page_title') ) return;

        if ( page_title_height == '' ) return;
        var h = 0;
        switch (page_title_height) {
            case 'title' :
                h = $('.main-container .page-title').height() + 60;
                break;
            case 'breadcrumbs' :
                h = $('.main-container .breadcrumbs').height();
                break;
            case 'breadcrumbs_category' :
                h = $('.main-container .breadcrumbs').height() + $('.product-category-title').outerHeight();
                break;
        }
        $('.main-container .page-title-bg').css({height: h });
    });

    function header_transform(){
        if (mobile) {
            $("header").removeClass("fixed");
            return;
        }
        window_y = $(window).scrollTop();
        if (window_y > scroll_critical) {
            if (!($("header").hasClass("fixed"))){
                $("header").addClass("fixed");
            }
        } else {
            if (($("header").hasClass("fixed"))){
                $("header").removeClass("fixed");
                $(".header-wrapper").height($("header").height());
            }
        }
    }

    $(window).resize(function(){
        sw = $(window).width();
        sh = $(window).height();
        mobile = (sw > breakpoint) ? false : true;
        if ( !Shopper.responsive ) {
            mobile = false;
        }

        //menu_transform
        if (!($("header").hasClass("fixed"))) $(".header-wrapper").height($("header").height());
        scroll_critical = parseInt($(".header-container").height());

        if ( Shopper.fixed_header ) header_transform();
        if ( !isResize('grid_header') ) return;
        fixGridHeight();
    });
    $(window).scroll(function(){
        if ( Shopper.fixed_header ) header_transform();
    });

    //cart dropdown
    var config = {
        over: function(){
            if (mobile) return;
            $('.cart-top-container .details').animate({opacity:1, height:'toggle'}, 200);
        },
        timeout: 200, // number = milliseconds delay before onMouseOut
        out: function(){
            if (mobile) return;
            $('.cart-top-container .details').animate({opacity:0, height:'toggle'}, 200);
        }
    };
    $("div.cart-top-container").hoverIntent( config );

    //compare dropdown
    var config = {
        over: function(){
            if (mobile) return;
            $('.compare-top-container .details').animate({opacity:1, height:'toggle'}, 200);
        },
        timeout: 200, // number = milliseconds delay before onMouseOut
        out: function(){
            if (mobile) return;
            $('.compare-top-container .details').animate({opacity:0, height:'toggle'}, 200);
        }
    };
    $("div.compare-top-container").hoverIntent( config );

    //search dropdown
    var config = {
        over: function(){
            if (mobile) return;
            $('.search-top-container .search-form').animate({opacity:1, height:'toggle'}, 200);
        },
        timeout: 200, // number = milliseconds delay before onMouseOut
        out: function(){
            if (mobile) return;
            $('.search-top-container .search-form').animate({opacity:0, height:'toggle'}, 200);
        }
    };
    $("div.search-top-container").hoverIntent( config );

    $('#queldoreiNav li').hover(
        function(){
            var docWidth = $(document).width();
            var div = $(this).children('div');
            var divWidth = div.actual('width') + parseInt(div.css('padding')) + 30;

            $(this).addClass('over');
            div.addClass('shown-sub');

            if ( divWidth + $(this).offset().left > docWidth  ) {
                div.css('left', -($(this).offset().left + divWidth - docWidth)+'px' );
            } else {
                div.css('left', '0px');
            }
        },
        function(){
            $(this).removeClass('over');
            $(this).children('div').removeClass('shown-sub').css('left', '-10000px');
        }
    );

    //fix grid items height
    function fixGridHeight() {
        $('.products-grid').each(function(){
            var items_in_row = Math.floor($(this).width() / $('li.item', this).outerWidth(true));
            var height = [], row = 0;
            $('li.item', this).each(function(i,v){
                $('div.product-info', this).css('height', 'auto');
                var h = $('div.product-info', this).height();
                if ( !height[row] ) {
                    height[row] = h;
                } else if ( height[row] && h > height[row] ) {
                    height[row] = h;
                }
                if ( (i+1)/items_in_row == 1 ) row++;

            });
            row = 0;
            $('li.item', this).each(function(i,v){
                $('div.product-info', this).height( height[row] );
                if ( (i+1)/items_in_row == 1 ) row++;
            });
        });
    }
    fixGridHeight();

    var config = {
        over: function(){
            if ($(this).hasClass('.header-dropdown')){
                $(this).parent().addClass('over');
            } else {
                $(this).addClass('over');
            }
            $('.header-dropdown', this).animate({opacity:1, height:'toggle'}, 100);
        },
        timeout: 0, // number = milliseconds delay before onMouseOut
        out: function(){
            var that = this;
            $('.header-dropdown', this).animate({opacity:0, height:'toggle'}, 100, function(){
                if ($(this).hasClass('.header-dropdown')){
                    $(that).parent().removeClass('over');
                } else {
                    $(that).removeClass('over');
                }
            });
        }
    };
    $('.header-switch, .header-switch .header-dropdown').hoverIntent( config );

    var config = {
        over: function(){
            if (mobile) return;
            if ($(this).hasClass('.toolbar-dropdown')){
                $(this).parent().addClass('over');
                $('.toolbar-dropdown').css({width: $(this).parent().width()+50});
            } else {
                $(this).addClass('over');
                $('.toolbar-dropdown', this).css({width: $(this).width()+50});
            }

            $('.toolbar-dropdown', this).animate({opacity:1, height:'toggle'}, 100);
        },
        timeout: 0, // number = milliseconds delay before onMouseOut
        out: function(){
            if (mobile) return;
            var that = this;
            $('.toolbar-dropdown', this).animate({opacity:0, height:'toggle'}, 100, function(){
                if ($(this).hasClass('.toolbar-dropdown')){
                    $(that).parent().removeClass('over');
                } else {
                    $(that).removeClass('over');
                }
            });
        }
    };
    $('.toolbar-switch, .toolbar-switch .toolbar-dropdown').hoverIntent( config );

    var config = {
        over: function(){
            $('.back_img', this).css('opacity',0).show().animate({opacity:1}, 200);
        },
        timeout: 100, // number = milliseconds delay before onMouseOut
        out: function(){
            $('.back_img', this).animate({opacity:0}, 200);
        }
    };
    $('.products-list .product-image').hoverIntent( config );

    //add review link on product page open review tab
    $('div.product-view p.no-rating a, div.product-view .rating-links a').click(function(){
        $('ul.product-tabs li').removeClass('active');
        $('#product_tabs_review_tabbed').addClass('active');
        $('.product-tabs-content').hide();
        $('#product_tabs_review_tabbed_contents').show();
        $('#product_tabs_review_tabbed').scrollToMe();
        return false;
    });

    $('.products-grid .item').live({
        mouseenter: function(){
            if (mobile) return;

            $('.hover .price-box', this).css({
                'opacity':0
            });
            if (Shopper.price_circle) {
                if ( !$(this).hasClass('calc-price-box') ) {
                    var padding = Math.floor( ($('.hover .price-box', this).actual('width') - $('.hover .price-box', this).actual('height'))/2 + 15 );
                    $('.hover .price-box', this).css({
                        'padding':padding+'px 15px',
                        'margin':(-(25+padding*2+$('.hover .price-box', this).actual('height')))+'px 0 0 0',
                    });
                    $(this).addClass('calc-price-box');
                }
                var that = this;
                $('.hover', this).show(0, function(){ $('.hover .price-box', that).animate({opacity:1}, 600) } );
            } else {
                $('.hover', this).show();
            }

            $(this).addClass('no-shadow');

        },
        mouseleave: function(){
            if (mobile) return;
            $('.hover', this).hide();
            $(this).removeClass('no-shadow');
        }
    });

    var $flexslider = $("#flexslider"),
        $flexslides = $flexslider.find('ul.slides').children('li');

    if ( $flexslider.length ) {
        $(window).load(function(){

            var timeline = {
                    width: 0,
                    interval: CONFIG_SLIDESHOW.slideshowSpeed
                },
                slideshowHover = false,
                slideshowPause = false;

            vericalCenterSlideContent = function($slide) {
                var $content = $('div.content', $slide);
                var $contentH = $content.actual('height')
                    + parseInt( $content.css('marginTop') )
                    + parseInt( $content.css('marginBottom') );
                if ( $slide.height() > $contentH ) {
                    $content.css('marginTop', Math.floor( ($slide.height() - $contentH)/2 + 30 ) + 'px');
                }
            }

            setSlideHeight = function() {
                //update slides to include cloned li
                $flexslides = $("#flexslider").find('ul.slides').children('li');
                if (_resizeLimit['slideshow'] <= 1 && Shopper.responsive ) {
                    //iphone resolution ( <= 767 ). hide content and show small image
                    $('div.content', $flexslides).hide();
                    $('img.small_image', $flexslides).show();
                    var maxSlideHeight = null;
                    $flexslides.each(function(i,v){
                        if ( $('img.small_image', this).length ) {
                            $(this).css('background-image', 'none');
                            $(this).height($('img.small_image', this).height());
                            maxSlideHeight = Math.max(maxSlideHeight, $(this).height());
                        }
                    });
                    //auto height - by tallest slide
                    $flexslides.height(maxSlideHeight);
                } else {
                    $('img.small_image', $flexslides).hide();
                    $('div.content', $flexslides).show();
                    //restore original content margin top
                    $('div.content', $flexslides).css('marginTop', '30px');
                    //restore bg image
                    $flexslides.each(function(i,v){
                        $(this).css('background-image', $(this).attr('data-bg'));
                    });

                    if ( CONFIG_SLIDESHOW.height != 'auto' ) {
                        $flexslides.height(CONFIG_SLIDESHOW.height);
                    } else {
                        var maxSlideHeight = null;
                        //set slide height according to height of content and image
                        $flexslides.each(function(i,v){
                            var $imgH = $(this).attr('data-img-height');
                            //count content height
                            var $contentH = $('div.content', this).actual('height') + parseInt($('div.content', this).css('marginTop')) + parseInt($('div.content', this).css('marginBottom'));
                            $(this).height(Math.max($imgH, $contentH)+'px');
                            maxSlideHeight = Math.max(maxSlideHeight, $(this).height());
                        });

                        if ( CONFIG_SLIDESHOW.smoothHeight ) {
                            //smooth height
                        } else {
                            //auto height - by tallest slide
                            $flexslides.height(maxSlideHeight);
                        }
                    }
                    //adjust content vertical center
                    $flexslides.each(function(i,v){
                        vericalCenterSlideContent( $(this) );
                    });
                }
            }

            //backup original images for slides
            $flexslides.each(function(i,v){
                $(this).attr('data-bg', $(this).css('background-image'));
            });

            slideshowResize = function() {
                timeline.width = $flexslider.width();
                var resize = isResize('slideshow');
                if (resize || _resizeLimit['slideshow'] <= 1) {
                    setSlideHeight();
                }
            }
            slideshowResize();

            $(window).resize(function(){
                var interval = (timeline.width - $('#slide-timeline').width() ) / ( timeline.width / timeline.interval );
                runTimeline(interval);
                slideshowResize();
            });

            runTimeline = function( interval ) {
                if ( slideshowPause
                    || interval == 0
                    || CONFIG_SLIDESHOW.slideshow == false
                    || CONFIG_SLIDESHOW.timeline == false
                    || $flexslides.length < 2) {return;}
                $('#slide-timeline')
                    .show()
                    .animate(
                    {width: timeline.width + 'px'},
                    interval,
                    'linear',
                    function(){
                        $(this).hide().width(0);
                        $('#flexslider').flexslider("next");
                    }
                );
            }

            $flexslider.on({
                mouseenter: function () {
                    slideshowPause = true;
                    slideshowHover = true;
                    $('#slide-timeline').stop(true);
                },
                mouseleave: function () {
                    slideshowPause = false;
                    slideshowHover = false;
                    var interval = (timeline.width - $('#slide-timeline').width() ) / ( timeline.width / timeline.interval );
                    runTimeline(interval);
                },
                touchstart: function () {
                    $('#slide-timeline').stop(true);
                }
            });

            var defaults = {
                slideshow: ( CONFIG_SLIDESHOW.slideshow && CONFIG_SLIDESHOW.timeline == false ? true : false),
                initDelay:200,
                start: function(slider){
                    setSlideHeight();
                    //line up direction nav
                    if (CONFIG_SLIDESHOW.smoothHeight) {
                        $('.flex-direction-nav a', slider).css('marginTop', (-$('li.flex-active-slide', slider).height()/2 -40) );
                    } else {
                        $('.flex-direction-nav a', slider).css('marginTop', (-$('.flexslider').height()/2 -40) );
                    }
                    runTimeline(timeline.interval);
                },
                before: function(slider){
                    $('#slide-timeline').hide().width(0);
                    $('.flex-direction-nav a', slider).hide();
                },
                after: function(slider){
                    if ( !slideshowHover ) {
                        slideshowPause = false;
                    }
                    if (CONFIG_SLIDESHOW.smoothHeight) {
                        $('.flex-direction-nav a', slider).css('marginTop', (-$('li.flex-active-slide', slider).height()/2 -40));
                    }
                    $('.flex-direction-nav a', slider).show();
                    $('#slide-timeline').stop(true);
                    $('#slide-timeline').hide().width(0);
                    runTimeline(timeline.interval);
                }
            }
            vars = $.extend({}, CONFIG_SLIDESHOW, defaults);

            if ( $('.col-main .homepage-banners').length ) {
                $('.slider').animate({paddingBottom: '52px'}, 200);
                $('.slider2').animate({paddingBottom: '52px'}, 200);
            }
            if ( $('.col-main .home-right').length ) {
                $('.slider').animate({paddingBottom: '20px'}, 200);
                $('.slider2').animate({paddingBottom: '20px'}, 200);
            }

            $flexslider.flexslider(vars);
        });
    } else {
        if ( $('.col-main .homepage-banners').length ) {
            $('.col-main .homepage-banners').css('padding-top','40px');
        }
    }

    $(window).load(function(){
        if ( $(".block-slideshow .block-slider").length ) {
            $(".block-slideshow .block-slider")
                .flexslider({
                    animation: "slide",
                    slideshow: true,
                    useCSS: false,
                    touch: true,
                    video: false,
                    animationLoop: true,
                    mousewheel: false,
                    keyboard:false,
                    smoothHeight: false,
                    slideshowSpeed: 7000,
                    animationSpeed: 600,
                    pauseOnAction: true,
                    pauseOnHover: true,
                    controlNav: true,
                    directionNav: false,
                    start: function(s){ $('.col-left').masonry('reload'); }
                });
        }
        if ( $(".block-login .block-slider").length) {
            $(".block-login .block-slider")
                .flexslider({
                    animation: "slide",
                    slideshow: false,
                    useCSS: false,
                    touch: true,
                    video: false,
                    keyboard:false,
                    animationLoop: false,
                    smoothHeight: false,
                    animationSpeed: 600,
                    controlNav: false,
                    directionNav: false
                });
            $('#forgot-password').click(function(){ $(".block-login .block-slider").flexslider("next"); return false; });
            $('#back-login').click(function(){ $(".block-login .block-slider").flexslider("prev"); return false; });
            if ( $('body').hasClass('customer-account-forgotpassword') ) {
                $('#forgot-password').click();
            }
        }
    });

    if (typeof CONFIG_REVOLUTION !== 'undefined') {
        if ($.fn.cssOriginal!=undefined)   // CHECK IF fn.css already extended
            $.fn.css = $.fn.cssOriginal;
        $('.fullwidthbanner').revolution(CONFIG_REVOLUTION);
        CONFIG_REVOLUTION2 = {
            delay: 4000,
            fullWidth: "on",
            hideAllCaptionAtLilmit: 0,
            hideCaptionAtLimit: 0,
            hideSliderAtLimit: 0,
            hideThumbs: 200,
            navOffsetHorizontal: 0,
            navOffsetVertical: -14,
            navigationArrows: "verticalcentered",
            navigationStyle: "off",
            navigationType: "off",
            onHoverStop: "on",
            shuffle: "off",
            startheight: 369,
            startwidth: 900,
            stopAfterLoops: -1,
            stopAtSlide: -1,
            thumbAmount: 5,
            thumbHeight: 50,
            thumbWidth: 100,
            touchenabled: "on"
        }
        $('.fullwidthbanner2').revolution(CONFIG_REVOLUTION2);
    }

    if ( Shopper.responsive ) {
        $('.footer-info .block-content').addClass('clearfix');
        $('.footer-info .grid_3').prepend('<a href="#" class="block-control" />');
        $('.footer-info .block-control').click(function(){
            $('div.block-content', $(this).parent()).slideToggle(300);
            $(this).toggleClass('block-control-hide');
            return false;
        });
        $(window).resize(function(){
            if ( !isResize('footer_blocks') ) return;
            sw = $(window).width();
            if ( sw > 767 ) {
                $('.footer-info .block-content').show();
            } else {
                $('.footer-info .block-content').hide();
                $('.footer-info .block-control').removeClass('block-control-hide');
            }

        });
    }

    if ($('.col-left').length) $('.col-left').masonry({itemSelector : '.block', isResizable:true, isAnimated:true});
    $(window).load(function(){
        if ($('.col-left').length) $('.col-left').masonry('reload');
    });


    if ( Shopper.anystretch_bg != '' ) {
        jQuery('.main-container').anystretch( Shopper.anystretch_bg );
    }

    if ( $('body').hasClass('customer-account-login') || $('body').hasClass('customer-account-forgotpassword') || $('body').hasClass('customer-account-create') ) {
        function positionFooter() {
            if (mobile) return;
            if (!$("#sticky-footer-push").length) {
                $(".footer-container").before('<div id="sticky-footer-push"></div>');
            }
            var docHeight = $(document.body).height() - $("#sticky-footer-push").height();
            if(docHeight < $(window).height()){
                var diff = $(window).height() - docHeight - 5;
                $("#sticky-footer-push").height(diff);
            }
        }
        $(window).scroll(positionFooter).resize(positionFooter).load(positionFooter);
    }

    //product accordion
    $('.product-tabs-container h2.tab-heading a').click(function () {
	    $('.product-tabs li.active').toggleClass('active');
	    $('#'+$(this).parent().attr('id').replace("product_acc_", "product_tabs_")).toggleClass('active');
        that = $(this).parent();
	    if($(that).is('.active')) {
            $(that).toggleClass('active');
	        $(that).next().slideToggle(function(){ $(that).scrollToMe(); });
        } else {
            $('.product-tabs-container h2.tab-heading.active').toggleClass('active').next().slideToggle();
            $(that).toggleClass('active');
	        $(that).next().slideToggle(function(){ $(that).scrollToMe(); });
        }
        return false;
    });
    $('.product-tabs-container h2:first').toggleClass('active');
	$('.product-tabs a').click(function(){
	    $('.product-tabs-container h2.tab-heading.active').toggleClass('active');
	    $('#'+$(this).parent().attr('id').replace("product_tabs_", "product_acc_")).toggleClass('active');
    });

    //mobile navigation
	if ( Shopper.responsive ) {
	    $('.nav-container li.parent > a').prepend('<em>+</em>');
	    $('.nav-container li.parent > a em').click(function(){
	        if ( $(this).text() == '+') {
	            $(this).parent().parent().addClass('over');
	            $(this).parent().next().show();
	            $(this).text('-');
	        } else {
	            $(this).parent().parent().removeClass('over');
	            $(this).parent().next().hide();
	            $(this).text('+');
	        }
	        $(".header-wrapper").height($("header").height());
	        return false;
	    });
	    $('.nav-container .nav-top-title').click(function(){
	        $(this).toggleClass('over').next().toggle();
	        $(".header-wrapper").height($("header").height());
	        return false;
	    });

		$(window).resize(function(){
			if ( !isResize('mobile_navigation') ) return;
			sw = $(window).width();
			if ( sw > 959 ) {
				$('#queldoreiNav, #nav').show();
			}
		});
	}

    //show more in layered nav
    if ( $('.block-layered-nav').length && Shopper.shopby_num ) {
        $('.block-layered-nav ol').each(function(i,v){
            if ( $('li', this).length > Shopper.shopby_num ) {
                var that = this;
                $('li:gt('+(Shopper.shopby_num-1)+')', this).hide();
                $('.col-left').masonry('reload');
                $(this).next()
                    .css('display', 'block')
                    .click(function(){
                        $('li:gt('+(Shopper.shopby_num-1)+')', that).toggle();
                        $(this).text() == Shopper.text.more ? $(this).text(Shopper.text.less) : $(this).text(Shopper.text.more);
                        $('.col-left').masonry('reload');
                        return false;
                    });
            }
        });
    }

});


// @version 1.0.8 / Sun Feb 19 22:37:22 2012 +0000
// MIT license: http://rem.mit-license.org
(function(a){function u(a){var c='<li><div class="tweet">';return c+='<div class="vcard"><a href="http://twitter.com/'+a.user.screen_name+'" class="url"><img style="height: 48px; width: 48px;" alt="'+a.user.name+'" class="photo fn" height="48" src="'+a.user.profile_image_url+'" width="48" /></a></div>',c+='<div class="hentry"><strong><a href="http://twitter.com/',c+=a.user.screen_name+'" ',c+='title="'+a.user.name+'">'+a.user.screen_name+"</a></strong> ",c+='<span class="entry-content">',c+=b.ify.clean(b.expandLinks(a)),c+='</span> <span class="meta entry-meta"><a href="http://twitter.com/'+a.user.screen_name,c+="/status/"+a.id_str+'" class="entry-date" rel="bookmark"><span class="published" title="',c+=b.time.datetime(a.created_at)+'">'+b.time.relative(a.created_at)+"</span></a>",a.source&&(c+=" <span>from "+a.source+"</span>"),a.retweetedby&&(c+=" <span>retweeted by "+a.retweetedby.screen_name+"</span>"),c+="</span></div></div></li>",c}function v(a){var c=g.getElementById(b+a);c&&h.removeChild(g.getElementById(b+a)),delete j[b+a],f[b+a]=o;try{delete f[b+a]}catch(d){}}function w(a,c,d){var i=g.createElement("script"),k=null;c==o&&(c={}),e++,j["twitterlib"+e]=!0,f["twitterlib"+e]=function(a,c){return function(e){var f=0,g=[];if(e.results){e=e.results,f=e.length;while(f--)e[f].user={id:e[f].from_user_id,screen_name:e[f].from_user,profile_image_url:e[f].profile_image_url},e[f].source=b.ify.entities(e[f].source),g=e[f].created_at.split(" "),e[f].created_at=[g[0],g[2],g[1],g[4],g[5],g[3]].join(" ").replace(/,/,"")}else if(e.length&&e[0].sender){f=e.length;while(f--)e[f].user=e[f].sender,e[f].originalText=e[f].text,e[f].text="@"+e[f].recipient_screen_name+" "+e[f].text}else if(c.rts==1||c.rts=="t"||c.rts==1){f=e.length;while(f--)e[f].retweeted_status&&(e[f].retweeted_status.retweetedby=e[f].user,e[f]=e[f].retweeted_status)}c.originalTweets=e,c.filter&&(e=t.matchTweets(e,c.filter)),c.limit&&c.limit<e.length&&(e=e.splice(0,c.limit));if(p&&c.page>1)try{sessionStorage.setItem("twitterlib.page"+c.page+".tweets",JSON.stringify(e)),sessionStorage.setItem("twitterlib.page"+c.page+".originalTweets",JSON.stringify(c.originalTweets)),sessionStorage.setItem("twitterlib.page"+c.page,"true")}catch(h){}c.cached=!1,d.call(b,e,c),v(a)}}(e,c),k=a.match(/callback=(.*)/),k!=null&&k.length>1?f[k[1]]=f["twitterlib"+e]:a+="&callback=twitterlib"+e;if(!p||c.page<=1||p&&sessionStorage.getItem("twitterlib.page"+c.page)==null)i.src=a,i.id="twitterlib"+e,h.appendChild(i);else if(p){v(e),c.cached=!0,c.originalTweets=JSON.parse(sessionStorage.getItem("twitterlib.page"+c.page+".originalTweets"));var l=JSON.parse(sessionStorage.getItem("twitterlib.page"+c.page+".tweets")||"[]");c.filter&&(l=t.matchTweets(l,c.filter)),c.limit&&c.limit<l.length&&(l=l.splice(0,c.limit)),d.call(b,l,c)}}function x(a,b){return n[a].replace(/(\b.*?)%(.*?)(\|.*?)?%/g,function(a,c,d,e){if(e&&e.substr(1)=="remove"&&b[d]==o)return"";var f=d=="limit"?b[d]+10:b[d];return c+(b[d]===o&&e!==o?e.substr(1):f)})}function y(a,b){return typeof a=="function"&&(b=a,a={}),a===o&&(a={}),a.page=a.page||1,a.callback=b,a.limit===0&&delete a.limit,a}function z(a,b,c){i={method:a,arg:b,options:c,callback:c.callback,page:c.page||1},c.method=a;if(p){var d=JSON.parse(sessionStorage.getItem("twitterlib.last_request")||"{}");if(i.method!=d.method||i.arg!=d.arg)A(),sessionStorage.setItem("twitterlib.last_request",JSON.stringify(i))}}function A(){var a=sessionStorage.length;while(a--)sessionStorage.key(a).substr(0,"twitterlib".length)=="twitterlib"&&sessionStorage.removeItem(sessionStorage.key(a))}function B(a,b,c){return b&&n[a]==o&&(n[a]=b),this[a]==o&&(this[a]=function(b,c,d){return typeof b=="function"?(d=b,b=""):b.toString()=="[Object object]"&&(d=c,c=b,b=""),c=y(c,d),z(a,b,c),c[a]=c.user=b,c.search=encodeURIComponent(b),c.callback&&w(x(a,c),c,c.callback),this}),this[a]}var b={};if(typeof exports!="undefined"&&typeof require=="function"){var c=require("url").parse,d=require("http");this.document={location:{protocol:"http:"},head:{appendChild:function(a){if(!a.src)return;var b=c(a.src,!0),e=d.createClient(80,b.host).request("GET",b.pathname+b.search,{host:b.host}),g="",h=f[b.query.callback];e.on("response",function(a){a.setEncoding("utf8"),a.on("data",function(a){g+=a}).on("end",function(){switch(a.statusCode){case 200:g=g.replace(new RegExp("^"+b.query.callback+"\\("),"").replace(/\);*$/,""),j[b.query.callback]&&h(JSON.parse(g));break;case 304:break;case 401:}})}).end()}},getElementById:function(){},createElement:function(a){return{type:a,id:null,src:""}}}}var e=+(new Date),f=this,g=f.document,h=g.head||g.getElementsByTagName("head")[0],i={},j={},k={"&quot;":'"',"&lt;":"<","&gt;":">"},l=g.location.protocol.substr(0,4)=="http"?g.location.protocol:"http:",m={search:l+"//search.twitter.com/search.json?q=%search%&page=%page|1%&rpp=%limit|100%&since_id=%since|remove%&result_type=recent&include_entities=true",timeline:l+"//api.twitter.com/1/statuses/user_timeline.json?screen_name=%user%&count=%limit|200%&page=%page|1%&since_id=%since|remove%include_rts=%rts|false%&include_entities=true",list:l+"//api.twitter.com/1/%user%/lists/%list%/statuses.json?page=%page|1%&per_page=%limit|200%&since_id=%since|remove%&include_entities=true&include_rts=%rts|false%",favs:l+"//api.twitter.com/1/favorites/%user%.json?include_entities=true&skip_status=true&page=%page|1%&since_id=%since|remove%",retweets:l+"//api.twitter.com/1/statuses/retweeted_by_user.json?screen_name=%user%&include_entities=true&count=%limit|200%&since_id=%since|remove%&page=%page|1%"},n=m,o,p=!1,q=function(){return{entities:function(a){return a.replace(/(&[a-z0-9]+;)/g,function(a){return k[a]})},link:function(a){return a.replace(/[a-z]+:\/\/([a-z0-9-_]+\.[a-z0-9-_:~\+#%&\?\/.=]+[^:\.,\)\s*$])/ig,function(a,b){return'<a title="'+a+'" href="'+a+'">'+(b.length>36?b.substr(0,35)+"&hellip;":b)+"</a>"})},at:function(a){return a.replace(/(^|[^\w]+)\@([a-zA-Z0-9_]{1,15}(\/[a-zA-Z0-9-_]+)*)/g,function(a,b,c){return b+'<a href="http://twitter.com/'+c+'">@'+c+"</a>"})},hash:function(a){return a.replace(/(^|[^&\w'"]+)\#([a-zA-Z0-9_^"^<]+)/g,function(a,b,c){return a.substr(-1)==='"'||a.substr(-1)=="<"?a:b+'<a href="http://search.twitter.com/search?q=%23'+c+'">#'+c+"</a>"})},clean:function(a){return this.hash(this.at(this.link(a)))}}}(),r=function(a){if(a===o)return"";var b=a.text,c=0;if(a.entities){if(a.entities.urls&&a.entities.urls.length)for(c=0;c<a.entities.urls.length;c++)a.entities.urls[c].expanded_url&&(b=b.replace(a.entities.urls[c].url,a.entities.urls[c].expanded_url));if(a.entities.media&&a.entities.media.length)for(c=0;c<a.entities.media.length;c++)if(a.entities.media[c].media_url||a.entities.media[c].expanded_url)b=b.replace(a.entities.media[c].url,a.entities.media[c].media_url?a.entities.media[c].media_url:a.entities.media[c].expanded_url)}return b},s=function(){var a=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];return{time:function(a){var b=a.getHours(),c=a.getMinutes()+"",d="AM";return b==0?b=12:b==12?d="PM":b>12&&(b-=12,d="PM"),c.length==1&&(c="0"+c),b+":"+c+" "+d},date:function(b){var c=a[b.getMonth()],d=b.getDate()+"",e=~~d,f=b.getFullYear(),g=(new Date).getFullYear(),h="th";return e%10==1&&d.substr(0,1)!="1"?h="st":e%10==2&&d.substr(0,1)!="1"?h="nd":e%10==3&&d.substr(0,1)!="1"&&(h="rd"),d.substr(0,1)=="0"&&(d=d.substr(1)),c+" "+d+h+(g!=f?", "+f:"")},shortdate:function(b){var c=b.split(" "),d=Date.parse(c[1]+" "+c[2]+", "+c[5]+" "+c[3]),e=new Date(d),f=a[e.getMonth()],g=e.getDate()+"",h=e.getFullYear(),i=(new Date).getFullYear();return i===h?g+" "+f:g+" "+f+(h+"").substr(2,2)},datetime:function(a){var b=a.split(" "),c=new Date(Date.parse(b[1]+" "+b[2]+", "+b[5]+" "+b[3]));return this.time(c)+" "+this.date(c)},relative:function(a){var b=a.split(" "),c=Date.parse(b[1]+" "+b[2]+", "+b[5]+" "+b[3]),d=new Date(c),e=arguments.length>1?arguments[1]:new Date,f=~~((e.getTime()-c)/1e3),g="";return f+=e.getTimezoneOffset()*60,f<=1?g="1 second ago":f<60?g=f+" seconds ago":f<120?g="1 minute ago":f<2700?g=~~(f/60)+" minutes ago":f<10800?g="1 hour ago":f<86400?g=~~(f/3600)+" hours ago":g=this.shortdate(a),g}}}(),t=function(){return{match:function(a,b,c){var d=0,e="",f=a.text.toLowerCase(),g=(!b.and||!b.and.length)&&(!b.or||!b.or.length);typeof b=="string"&&(b=this.format(b));if(b.not&&b.not.length){for(d=0;d<b.not.length;d++)if(f.indexOf(b.not[d])!==-1)return!1;if(g)return!0}else if({}.toString.call(b.not)!=="[object Array]"){if(b.not.test(f))return!1;if(g)return!0}if(b.and&&b.and.length)for(d=0;d<b.and.length;d++){e=b.and[d];if(e.substr(0,3)==="to:"){if(!RegExp("^@"+e.substr(3)).test(f))return!1}else if(e.substr(0,5)=="from:"){if(a.user.screen_name!==e.substr(5))return!1}else if(f.indexOf(e)===-1)return!1}else if(typeof b["and"]=="function"&&b.and.test(f))return!0;if(b.or&&b.or.length)for(d=0;d<b.or.length;d++){e=b.or[d];if(e.substr(0,3)==="to:"){if(RegExp("^@"+e.substr(3)).test(f))return!0}else if(e.substr(0,5)=="from:"){if(a.user.screen_name===e.substr(5))return!0}else if(f.indexOf(b.or[d])!==-1)return!0}else if(typeof b["or"]=="function"){if(b.or.test(f))return!0}else if(b.and&&b.and.length)return!0;return!1},format:function(a,b){var c=[],d=[],e=[],f=0,g=[],h="",i="";a.replace(/(-?["'](.*?)["']|\S+)/g,function(a){var b=!1;a.substr(0,1)=="-"&&(b=!0),a=a.replace(/["']+|["']+$/g,""),b?g.push(a.substr(1).toLowerCase()):c.push(a)});for(f=0;f<c.length;f++)c[f]=="OR"&&c[f+1]?(d.push(c[f-1].toLowerCase()),d.push(c[f+1].toLowerCase()),f++,e.pop()):e.push(c[f].toLowerCase());return{or:d,and:e,not:g}},matchTweets:function(a,b,c){var d=[],e,f=0;typeof b=="string"&&(b=this.format(b));for(f=0;f<a.length;f++)this.match(a[f],b,c)&&d.push(a[f]);return d}}}();b={custom:B,status:function(a,b,c){return b=y(b,c),b.limit=1,z("status",a,b),this.timeline(a,b,b.callback)},list:function(a,b,c){var d=a.split("/");return b=y(b,c),z("list",a,b),b.user=d[0],b.list=d[1],b.callback&&w(x("list",b),b,b.callback),this},next:function(){return i.method&&(i.page++,i.options.page=i.page,this[i.method](i.arg,i.options,i.callback)),this},refresh:function(){return i.method&&this[i.method](i.arg,i.options,i.callback),this},time:s,ify:q,filter:t,expandLinks:r,cancel:function(){for(var a in j)f[a]=function(){return function(a){v(a)}}(a.replace("twitterlib",""));return j={},this},reset:function(){n=m,i.method=""},render:u,debug:function(a){for(var b in a)n[b]=a[b];return this},cache:function(a){p=a==o?!0:a;if(!f.JSON||!f.sessionStorage)p=!1}},b.custom("search"),b.custom("timeline"),b.custom("favs"),b.custom("retweets"),typeof exports!="undefined"&&(module.exports=b),a.twitterlib=b})(this);

function getTweets(el, utils){
    if( !utils.username ){
        el.twitterList.find("li").eq(0).html(utils.text_specify);
    }else{
        jQuery.ajax({
            url			: "//api.twitter.com/1/statuses/user_timeline.json?screen_name="+utils.username,
            dataType	: "jsonp",
            timeout		: 15000,
            success		: function(data){
                var li = '';
                for( i=0; i<utils.tweetNum; i++ ){
                    if ( data[i] === undefined ) break;
                    var text = data[i].text;
                    text = text.replace(/((https?|s?ftp|ssh)\:\/\/[^"\s\<\>]*[^.,;'">\:\s\<\>\)\]\!])/g, function(url){return '<a href="'+url+'" target="_blank">'+url+'</a>'});
                    text = text.replace(/@(\w+)/g, function(url){return '<a href="http://www.twitter.com/'+url.substring(1)+'" target="_blank">'+url+'</a>'});
                    text = text.replace(/#(\w+)/g, function(url){return '<a href="http://twitter.com/search?q=%23'+url.substring(1)+'" target="_blank">'+url+'</a>'});
                    li += '<li><span class="tweet-icon"></span><p>'+text+'<span class="time-ago">'+twitterlib.time.relative(data[i].created_at)+'</span>'+'</p></li>';

                }
                li += '<li class="follow">'+utils.text_follow+' <a href="https://twitter.com/'+utils.username+'">'+utils.text_on_twitter+'</a></li>';
                el.twitterList.html( li );
            },
            error : function(){
                el.twitterList.find("li").eq(0).html(utils.text_error);
            }
        });
    }
}

jQuery(document).ready(function () {
    jQuery('body').on('keyup', '#wishlist-product-filter', function() {   
	    jQuery('#wishlist-table tr.pdt-line').show()
            jQuery('#wishlist-table th').show();
            jQuery('#wishlist-no-product').hide();
	    var val = jQuery(this).val().toLowerCase();
	    if(val != "") {
		jQuery('#wishlist-table tr.pdt-line:not([data-sku*="'+val+'"])').hide();
                for(var i=0; i < jQuery('#wishlist-table tbody th').length; i++) {
                    var item = jQuery('#wishlist-table tbody th').eq(i);
                    if (jQuery('#wishlist-table tr.pdt-line[data-status="'+jQuery(item).data('status')+'"]:visible').length == 0) {
                         jQuery(item).hide();
                    }
		 }
	    }
	    if(jQuery('#wishlist-table tr.pdt-line:visible').length == 0) {
	        jQuery('#wishlist-no-product').show();
            }
	    jQuery('#nb-displayed-products').text(jQuery('#wishlist-table tr.pdt-line:visible').size());
	});

       if(jQuery.cookie('accepted_cookies') === undefined) {
         jQuery('.cookie-container').show();
       }

       jQuery('.cookie-close').on('click', function(){
         jQuery('.cookie-container').hide();
         jQuery.cookie('accepted_cookies', true);
       });

       jQuery('.switch-locale').on('click', function(){
        jQuery('.dialog-bg').show();
        jQuery('.dialog-main').show();
       });

       jQuery('.dialog-close').on('click', function() {
         jQuery('.dialog-bg').hide();
         jQuery('.dialog-main').hide();
       });

});
