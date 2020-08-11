"use strict";
var $portfolio;
var $ParallaxPortfolio;
var $masonry_block;
var $portfolio_selectors;
var $Parallaxportfolio_selectors;
var $blog;

var isMobile = false;
var isiPhoneiPad = false;

if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    isMobile = true;
}
if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
    isiPhoneiPad = true;
}

/* For remove conflict */
( function( $ ) {

    $(document).ready(function () {
        
        HamburderMenuCustomScroll();
        OnePageActiveOnScroll();
        $(document).on("scroll", OnePageActiveOnScroll);

        /*==============================================================*/
        //Placeholder For IE - START CODE
        /*==============================================================*/

        $('input, textarea').placeholder({customClass:'my-placeholder'});
        
        /*==============================================================*/
        //Placeholder For IE - START CODE
        /*==============================================================*/
        
        /*==============================================================*/
        //Smooth Scroll - START CODE
        /*==============================================================*/
        $('.inner-top').smoothScroll({
            speed: 900,
            offset: -68
        });
        /*==============================================================*/
        //Smooth Scroll - END CODE
        /*==============================================================*/

        /*==============================================================*/
        //Set Resize Header Menu - START CODE
        /*==============================================================*/
        SetResizeHeaderMenu();
        /*==============================================================*/
        //Set Resize Header Menu - END CODE
        /*==============================================================*/

        /*==============================================================*/
        //Ipad And Mobile Icon Hover - START CODE
        /*==============================================================*/
        IpadMobileHover();
        /*==============================================================*/
        //Ipad And Mobile Icon Hover - END CODE
        /*==============================================================*/

        /*==============================================================*/
        //For shopping cart- START CODE
        /*==============================================================*/
        
        if (!isMobile) {
            $(".search-cart-header .top-cart a.shopping-cart, .search-cart-header .cart-content").hover(function () {
                $(".search-cart-header .cart-content").css('opacity', '1');
                $(".search-cart-header .cart-content").css('visibility', 'visible');
            }, function () {
                $(".search-cart-header .cart-content").css('opacity', '0');
                $(".search-cart-header .cart-content").css('visibility', 'hidden');
            });

            $(document).on({
                mouseenter: function() {
                    $(".search-cart-header .cart-content").css('opacity', '1');
                    $(".search-cart-header .cart-content").css('visibility', 'visible');
                },
                mouseleave: function() {
                    $(".search-cart-header .cart-content").css('opacity', '0');
                    $(".search-cart-header .cart-content").css('visibility', 'hidden');
                }
            }, ".search-cart-header .top-cart a.shopping-cart, .search-cart-header .cart-content");

        }
        
        if (isiPhoneiPad) {
            $(".video-wrapper").css('display', 'none');
        }

        if (/Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            $( '.video-wrapper iframe' ).each(function () {
                $(this).parents('.video-wrapper').addClass('display-none');
            });

            $( '.video-wrapper video' ).each(function () {
                var VideoMuted = $(this).attr( 'muted' ); 
                if ( typeof VideoMuted != "undefined" ) {
                } else {
                    $(this).parents('.video-wrapper').addClass('display-none');
                }
            });
        }

        $(".search-cart-header .top-cart a.shopping-cart").click(function () {
            if(!isMobile){
                var carturl = $(this).attr('href');
                window.location = carturl;
            }
            if ($('.search-cart-header .cart-content').css('visibility') == 'visible') {
                $(".search-cart-header .cart-content").css('opacity', '0');
                $(".search-cart-header .cart-content").css('visibility', 'hidden');
            }
            else {
                $(".search-cart-header .cart-content").css('opacity', '1');
                $(".search-cart-header .cart-content").css('visibility', 'visible');

            }
        });

        /*==============================================================*/
        //Shrink nav on scroll - START CODE
        /*==============================================================*/
        if( !$( 'nav.navigation-menu, nav.navbar' ).hasClass( 'no-shrink-nav' ) && !$( 'nav.navbar' ).hasClass( 'non-sticky-header' ) ) {
            if ($(window).scrollTop() > 10) {
                $('nav.navigation-menu, nav.navbar').addClass('shrink-nav');
            } else {
                $('nav.navigation-menu, nav.navbar').removeClass('shrink-nav');
            }
        }
        /*==============================================================*/
        //Shrink nav on scroll - END CODE
        /*==============================================================*/

        // Add class in default menu
        if( $( '.navbar .accordion-menu div' ).hasClass('default-menu-wrapper') ){
            var nav_class = $( '.navbar .accordion-menu div.default-menu-wrapper' ).attr('class');
            $( '.navbar .accordion-menu div.default-menu-wrapper' ).addClass('navbar-collapse collapse').removeClass( nav_class );
            $( '.navbar .accordion-menu div.navbar-collapse > ul' ).addClass( nav_class );
        }

        /*==============================================================*/
        //Portfolio - START CODE
        /*==============================================================*/
        if (Modernizr.touch) {
            // show the close overlay button
            $(".close-overlay").removeClass("hidden");
            // handle the adding of hover class when clicked
            $(".porfilio-item").click(function (e) {
                if (!$(this).hasClass("hover")) {
                    $(this).addClass("hover");
                }
            });
            // handle the closing of the overlay
            $(".close-overlay").click(function (e) {
                e.preventDefault();
                e.stopPropagation();
                if ($(this).closest(".porfilio-item").hasClass("hover")) {
                    $(this).closest(".porfilio-item").removeClass("hover");
                }
            });
        } else {
            // handle the mouseenter functionality
            $(".porfilio-item").mouseenter(function () {
                $(this).addClass("hover");
            })
            // handle the mouseleave functionality
            .mouseleave(function () {
                $(this).removeClass("hover");
            });
        }

        // use for portfolio sotring with masonry

        $portfolio = $('.masonry-items');
        var portfolio_selector = $portfolio.parents( 'section' ).find('.portfolio-filter li.nav.active a').attr('data-filter');
        
        $portfolio.imagesLoaded(function () {
            $portfolio.isotope({
                itemSelector: 'li',
                layoutMode: 'masonry',
                filter: portfolio_selector
            });
        });

        // use for simple masonry ( for example /home-photography page )

        $masonry_block = $('.masonry-block-items');
        $masonry_block.imagesLoaded(function () {
            $masonry_block.isotope({
                itemSelector: 'li',
                layoutMode: 'masonry'
            });
        });

        $portfolio_selectors = $('.portfolio-filter > li > a');
        $portfolio_selectors.on('click', function () {
            $portfolio_selectors.parent().removeClass('active');
            $(this).parent().addClass('active');
            var selector = $(this).attr('data-filter');
            if( selector != '*'){
                $(".portfolio-infinite-scroll-pagination").infinitescroll('unbind');
            }else{
                $(".portfolio-infinite-scroll-pagination").infinitescroll('bind');
            }
            $portfolio.isotope({filter: selector});
            return false;
        });
        $blog = $('.blog-masonry');
        $blog.imagesLoaded(function () {

            //ISOTOPE FUNCTION - FILTER PORTFOLIO FUNCTION
            $blog.isotope({
                itemSelector: '.blog-listing',
                layoutMode: 'masonry'
            });
        });

        /* Parallax Portfolio Shortcode Isotop */
        $ParallaxPortfolio = $('.parallax-masonry-items');
        var parallax_portfolio_selector = $ParallaxPortfolio.parents( 'section' ).find('.portfolio-filter li.nav.active a').attr('data-filter');
        $ParallaxPortfolio.imagesLoaded(function () {
            $ParallaxPortfolio.isotope({
                itemSelector: '.parallax-portfolio-filter',
                layoutMode: 'masonry',
                filter: parallax_portfolio_selector
            });
        });

        $Parallaxportfolio_selectors = $('.portfolio-filter > li > a');
        $Parallaxportfolio_selectors.on('click', function () {
            $Parallaxportfolio_selectors.parent().removeClass('active');
            $(this).parent().addClass('active');
            var selector = $(this).attr('data-filter');
            $ParallaxPortfolio.isotope({filter: selector});
            return false;
        });

        $(window).resize(function () {
            setTimeout(function () {
                $portfolio.imagesLoaded( function() {
                    $portfolio.isotope('layout');
                });
                $ParallaxPortfolio.imagesLoaded( function() {
                    $ParallaxPortfolio.isotope('layout');
                });
                $blog.imagesLoaded( function() {
                    $blog.isotope('layout');
                });
                $masonry_block.imagesLoaded( function() {
                    $masonry_block.isotope('layout');
                });
            }, 500);
        });
        /*==============================================================*/
        //Portfolio - END CODE
        /*==============================================================*/

        /*==============================================================*/
        //Portfolio - Infinite Scroll
        /*==============================================================*/

        var pagesNum = $("div.hcode-portfolio-infinite-scroll").attr('data-pagination');
        $(document).ready(function(){
            $('.portfolio-infinite-scroll-pagination').infinitescroll({
                nextSelector: 'div.hcode-portfolio-infinite-scroll a',
                loading: {
                    img: hcodeajaxurl.loading_image,
                    msgText: '<div class="paging-loader" style="transform:scale(0.35);"><div class="circle"><div></div></div><div class="circle"><div></div></div><div class="circle"><div></div></div><div class="circle"><div></div></div></div>',
                    finishedMsg: '<div class="finish-load">' + hcode_infinite_scroll_message.message + '</div>',
                    speed: 'fast',
                },
                navSelector: 'div.hcode-portfolio-infinite-scroll',
                contentSelector: '.portfolio-infinite-scroll-pagination',
                itemSelector: '.portfolio-infinite-scroll-pagination ul.masonry-items li',
                maxPage: pagesNum,
            }, function (newElements) {
                $('.hcode-portfolio-infinite-scroll').remove();
                $('#infscr-loading').remove();
                /* For new element set masonry */
                var $newblogpost = $(newElements);
                // append other items when they are loaded
                $newblogpost.imagesLoaded( function() {
                $('.masonry-items').append( $newblogpost )
                  .isotope( 'appended', $newblogpost );
                });

                try {
                    $(".fit-videos").fitVids();
                }catch (err) { }

                /* For Magnific Popup */
                var lightboxgallerygroups = {};
                $('.lightboxgalleryitem').each(function() {
                  var id = $(this).attr('data-group');
                  if(!lightboxgallerygroups[id]) {
                    lightboxgallerygroups[id] = [];
                  } 
                  
                  lightboxgallerygroups[id].push( this );
                });

                $.each(lightboxgallerygroups, function() {
                    $(this).magnificPopup({
                        type: 'image',
                        closeOnContentClick: true,
                        closeBtnInside: false,
                        gallery: { enabled:true },
                        image: {
                            titleSrc: function (item) {
                                var title = '';
                                var lightbox_caption = '';
                                if( item.el.attr('title') ){
                                    title = item.el.attr('title');
                                }
                                if( item.el.attr('lightbox_caption') ){
                                    lightbox_caption = '<span class="hcode-lightbox-caption">'+item.el.attr('lightbox_caption')+'</span>';
                                }
                                return title + lightbox_caption;
                            }
                        },
                        // Remove close on popup bg v1.5
                        callbacks: {
                            open: function () {
                                $.magnificPopup.instance.close = function() {
                                    if (!isMobile && !$('body').hasClass('hcode-custom-popup-close') ){
                                        $.magnificPopup.proto.close.call(this);
                                    } else {
                                        $('button.mfp-close').click(function() {
                                            $.magnificPopup.proto.close.call(this);
                                        });
                                    }
                                }
                            }
                        }
                    });
                });

                $('.simple-ajax-popup-align-top').magnificPopup({
                    type: 'ajax',
                    alignTop: true,
                    closeOnContentClick: false,
                    fixedContentPos: true,
                    closeBtnInside: false,
                    callbacks: {
                        open: function () {
                            // Remove close on popup bg v1.5
                            $.magnificPopup.instance.close = function() {
                                if (!isMobile && !$('body').hasClass('hcode-custom-popup-close') ){
                                    $.magnificPopup.proto.close.call(this);
                                } else {
                                    $( 'button.mfp-close' ).live( 'click', function() {
                                        $.magnificPopup.proto.close.call(this);
                                    });
                                }
                            }
                        }
                    }
                });

                $('.popup-youtube, .popup-vimeo, .popup-gmaps').magnificPopup({
                    disableOn: 700,
                    type: 'iframe',
                    mainClass: 'mfp-fade',
                    removalDelay: 160,
                    preloader: false,
                    fixedContentPos: false,
                    callbacks: {
                        open: function () {
                            if (!isMobile)
                                $('body').addClass('overflow-hidden');

                            // Remove close on popup bg v1.5
                            $.magnificPopup.instance.close = function() {
                                if (!isMobile && !$('body').hasClass('hcode-custom-popup-close') ){
                                    $.magnificPopup.proto.close.call(this);
                                } else {
                                    $( 'button.mfp-close' ).live( 'click', function() {
                                        $.magnificPopup.proto.close.call(this);
                                    });
                                }
                            }
                        },
                        close: function () {
                            if (!isMobile)
                                $('body').removeClass('overflow-hidden');
                        }
                        // e.t.c.
                    }
                });
            });
        });

        /*==============================================================*/
        //Portfolio - End Infinite Scroll
        /*==============================================================*/

        /*==============================================================*/
        //Set Parallax - START CODE
        /*==============================================================*/
        SetParallax();
        /*==============================================================*/
        //Set Parallax - END CODE
        /*==============================================================*/

        /*==============================================================*/
        //Sliders owlCarousel - START CODE
        /*==============================================================*/

        // jQuery use in Post slide loop
        $(".blog-gallery").owlCarousel({
            nav: true, // Show next and prev buttons
            autoplaySpeed: 300,
            dotsSpeed: 400,
            items: 1,
            rtl: $("body").hasClass("rtl") ? true:false,
            loop:true,
            navText: ["<i class='fas fa-angle-left'></i>", "<i class='fas fa-angle-right'></i>"]
        });
        // jQuery use in hcode_feature_product_shop in Shop top five shortcode
        $("#owl-demo-small").owlCarousel({
            nav: true, // Show next and prev buttons
            autoplaySpeed: 300,
            dotsSpeed: 400,
            items: 1,
            rtl: $("body").hasClass("rtl") ? true:false,
            loop:true,
            navText: ["<i class='fas fa-angle-left'></i>", "<i class='fas fa-angle-right'></i>"]
        });

        /*==============================================================*/
        //Sliders owlCarousel - END CODE
        /*==============================================================*/

        /*==============================================================*/
        //Stop Closing magnificPopup on selected elements - START CODE
        /*==============================================================*/

        $(".owl-dots > .owl-dot").click(function (e) {
            if ($(e.target).is('.mfp-close')){
                return;
            }else{
                $(this).trigger('to.owl.carousel', [$(this).index(), 300]);
                return false;
            }
        });
        $(".owl-nav > .owl-prev").click(function (e) {
            if ($(e.target).is('.mfp-close'))
                return;
            return false;
        });
        $(".owl-nav > .owl-next").click(function (e) {
            if ($(e.target).is('.mfp-close'))
                return;
            return false;
        });
        /*==============================================================*/
        //Stop Closing magnificPopup on selected elements - END CODE
        /*==============================================================*/

        /*==============================================================*/
        // Woocommerce Product Thumbnail Slider - START CODE
        /*==============================================================*/

        
            var sync1 = $(".hcode-single-big-product-thumbnail-carousel");
            var sync2 = $(".hcode-single-product-thumbnail-carousel");

            var slides = sync1.owlCarousel({
                items: 1,
                smartSpeed: 1000,
                nav: true,
                rtl: $("body").hasClass("rtl") ? true:false,
                loop: true,
                dots:false,
                navText: ["<i class='fas fa-angle-left'></i>", "<i class='fas fa-angle-right'></i>"]
            }).on('change.owl.carousel', syncPosition ).data('owl.carousel');
            var thumbs = sync2.owlCarousel({
                responsive:{
                    0 : {
                        items:1,
                    },
                    479 : {
                        items:3
                    }
                },
                dots:false,
                rtl: $("body").hasClass("rtl") ? true:false,
                loop: false,
                nav: true,
                navText: ["<i class='fas fa-angle-left'></i>", "<i class='fas fa-angle-right'></i>"],
                responsiveRefreshRate : 100,
                onInitialized : function(el){
                  $(el.target).find(".owl-item").removeClass("active-slide").eq(0).addClass("active-slide");
                }
            }).on('click', '.owl-item', function(e) {
                e.preventDefault(); 

                var current = $(this).index();
                var visibleItems = [];
                
                sync1.trigger("to.owl.carousel",current);
                $(".hcode-single-product-thumbnail-carousel").find(".owl-item.active").each(function(index) {
                    visibleItems.push($(this).index());
                });
                if($(".hcode-single-product-thumbnail-carousel").data("owl.carousel") !== undefined){
                  center(current, visibleItems);
                }
                $(".hcode-single-product-thumbnail-carousel").find(".owl-item").removeClass("active-slide").eq(current).addClass("active-slide");
            }).data('owl.carousel');

            function syncPosition(e){
                e.preventDefault(); 
                if (e.namespace && e.property.name === 'position') {
                    var current = e.relatedTarget.relative(e.property.value);
                    var visibleItems = [];
                    $(".hcode-single-product-thumbnail-carousel").find(".owl-item.active").each(function(index) {
                        visibleItems.push($(this).index());
                    });
                    $(".hcode-single-product-thumbnail-carousel").find(".owl-item").removeClass("active-slide").eq(current).addClass("active-slide");
                    if($(".hcode-single-product-thumbnail-carousel").data("owl.carousel") !== undefined){
                      center(current, visibleItems);
                    }
                    if($(".hcode-single-product-thumbnail-carousel").find(".owl-item.active").length > 3 ){
                        thumbs.to(e.relatedTarget.relative(e.property.value), 300, true);
                    }
                }
            }

            function center(number, visibleItems){
                var sync2visible = visibleItems;
                var num = number;
                var found = false;
                for(var i in sync2visible){
                  if(num === sync2visible[i]){
                    var found = true;
                  }
                }

                if(found === false){
                  if(num > sync2visible[sync2visible.length-1]){
                    sync2.trigger("to.owl.carousel", num - sync2visible.length+2)
                  }else{
                    if(num - 1 === -1){
                      num = 0;
                    }
                    sync2.trigger("to.owl.carousel", num);
                  }
                } else if(num === sync2visible[sync2visible.length-1]){
                  sync2.trigger("to.owl.carousel", sync2visible[1])
                } else if(num === sync2visible[0]){
                  sync2.trigger("to.owl.carousel", num-1)
                }
            }

            var owlCarousel = $('.owl-carousel');
            owlCarousel.each(function(index) {
                $(this).find('.owl-nav, .owl-dots').wrapAll("<div class='owl-controls'></div>");
            }); 

        /*==============================================================*/
        // Woocommerce Product Thumbnail Slider - End CODE
        /*==============================================================*/
        
        /*==============================================================*/
        // Add "intro-page" Class in Intro Pages  - START CODE
        /*==============================================================*/

        if( $('section').hasClass('intro-page') ){
            $('section').removeClass('intro-page');
            $('body').addClass('intro-page');
        }
        /*==============================================================*/
        // Add "intro-page" Class in Intro Pages  - End CODE
        /*==============================================================*/

        /*==============================================================*/
        //WOW Animation  - START CODE
        /*==============================================================*/

        var wow = new WOW({
            boxClass: 'wow',
            animateClass: 'animated',
            offset: 90,
            mobile: true,
            live: true
        });
        wow.init();
        /*==============================================================*/
        //WOW Animation  - END CODE
        /*==============================================================*/

        /*==============================================================*/
        //accordion  - START CODE
        /*==============================================================*/

        $('.collapse').on('show.bs.collapse', function () {
            var id = $(this).attr('id');
            $('a[href="#' + id + '"]').closest('.panel-heading').addClass('active-accordion');
            $('a[href="#' + id + '"] .panel-title span').html('<i class="fas fa-minus"></i>');
        });
        $('.collapse').on('hide.bs.collapse', function () {
            var id = $(this).attr('id');
            $('a[href="#' + id + '"]').closest('.panel-heading').removeClass('active-accordion');
            $('a[href="#' + id + '"] .panel-title span').html('<i class="fas fa-plus"></i>');
        });
        $('.nav.navbar-nav a.inner-link').click(function () {
            $(this).parents('ul.navbar-nav').find('a.inner-link').removeClass('active');
            $(this).addClass('active');
            if ($('.navbar-header .navbar-toggle').is(':visible'))
                $(this).parents('.navbar-collapse').collapse('hide');
        });
        $('.accordion-style2 .collapse').on('show.bs.collapse', function () {
            var id = $(this).attr('id');
            $('a[href="#' + id + '"]').closest('.panel-heading').addClass('active-accordion');
            $('a[href="#' + id + '"] .panel-title span').html('<i class="fas fa-angle-up"></i>');
        });
        $('.accordion-style2 .collapse').on('hide.bs.collapse', function () {
            var id = $(this).attr('id');
            $('a[href="#' + id + '"]').closest('.panel-heading').removeClass('active-accordion');
            $('a[href="#' + id + '"] .panel-title span').html('<i class="fas fa-angle-down"></i>');
        });
        $('.accordion-style3 .collapse').on('show.bs.collapse', function () {
            var id = $(this).attr('id');
            $('a[href="#' + id + '"]').closest('.panel-heading').addClass('active-accordion');
            $('a[href="#' + id + '"] .panel-title span').html('<i class="fas fa-angle-up"></i>');
        });
        $('.accordion-style3 .collapse').on('hide.bs.collapse', function () {
            var id = $(this).attr('id');
            $('a[href="#' + id + '"]').closest('.panel-heading').removeClass('active-accordion');
            $('a[href="#' + id + '"] .panel-title span').html('<i class="fas fa-angle-down"></i>');
        });
        /*==============================================================*/
        //accordion - END CODE
        /*==============================================================*/

        /*==============================================================*/
        //toggles  - START CODE
        /*==============================================================*/

        $('toggles .collapse').on('show.bs.collapse', function () {
            var id = $(this).attr('id');
            $('a[href="#' + id + '"]').closest('.panel-heading').addClass('active-accordion');
            $('a[href="#' + id + '"] .panel-title span').html('<i class="fas fa-minus"></i>');
        });
        $('toggles .collapse').on('hide.bs.collapse', function () {
            var id = $(this).attr('id');
            $('a[href="#' + id + '"]').closest('.panel-heading').removeClass('active-accordion');
            $('a[href="#' + id + '"] .panel-title span').html('<i class="fas fa-plus"></i>');
        });
        $('.toggles-style2 .collapse').on('show.bs.collapse', function () {
            var id = $(this).attr('id');
            $('a[href="#' + id + '"]').closest('.panel-heading').addClass('active-accordion');
            $('a[href="#' + id + '"] .panel-title span').html('<i class="fas fa-angle-up"></i>');
        });
        $('.toggles-style2 .collapse').on('hide.bs.collapse', function () {
            var id = $(this).attr('id');
            $('a[href="#' + id + '"]').closest('.panel-heading').removeClass('active-accordion');
            $('a[href="#' + id + '"] .panel-title span').html('<i class="fas fa-angle-down"></i>');
        });
        /*==============================================================*/
        //toggles  - END CODE
        /*==============================================================*/

        /*==============================================================*/
        //fit video  - START CODE
        /*==============================================================*/
        
        try {
            $(".fit-videos").fitVids();
        }
        catch (err) {

        }

        /*==============================================================*/
        //fit video  - END CODE
        /*==============================================================*/

        /*==============================================================*/
        //google map - mouse scrolling wheel behavior - START CODE
        /*==============================================================*/
        // you want to enable the pointer events only on click;

        $('#map_canvas1').addClass('scrolloff'); // set the pointer events to none on doc ready
        $('#canvas1').on('click', function () {
            $('#map_canvas1').removeClass('scrolloff'); // set the pointer events true on click
        });
        // you want to disable pointer events when the mouse leave the canvas area;

        $("#map_canvas1").mouseleave(function () {
            $('#map_canvas1').addClass('scrolloff'); // set the pointer events to none when mouse leaves the map area
        });
        /*==============================================================*/
        //google map - mouse scrolling wheel behavior - END CODE
        /*==============================================================*/

        /*==============================================================*/
        //Search - START CODE
        /*==============================================================*/
        $("input.search-input").bind("keypress", function (event) {
            if (event.which == 13 && !isMobile) {
                $("button.search-button").click();
                event.preventDefault();
            }
        });
        $("input.search-input").bind("keyup", function (event) {
            if ($(this).val() == null || $(this).val() == "") {
                $(this).css({"border": "none", "border-bottom": "2px solid red"});
            }
            else {
                $(this).css({"border": "none", "border-bottom": "2px solid #000"});
            }
        });
        function validationSearchForm() {
            var error = true;
            $('#search-header input[type=text]').each(function (index) {
                if (index == 0) {
                    if ($(this).val() == null || $(this).val() == "") {
                        $("#search-header").find("input:eq(" + index + ")").css({"border": "none", "border-bottom": "2px solid red"});
                        error = false;
                    }
                    else {
                        $("#search-header").find("input:eq(" + index + ")").css({"border": "none", "border-bottom": "2px solid #000"});
                    }
                }
            });
            return error;
        }
        $("form.search-form, form.search-form-result").submit(function (event) {
            var error = validationSearchForm();
            if (error) {
                var action = $(this).attr('action');
                action = action + '?' + $(this).serialize();
                window.location = action;
            }

            event.preventDefault();
        });

        $('.navbar .navbar-collapse a.dropdown-toggle, .accordion-style1 .panel-heading a, .accordion-style2 .panel-heading a, .accordion-style3 .panel-heading a, .toggles .panel-heading a, .toggles-style2 .panel-heading a, .toggles-style3 .panel-heading a, a.carousel-control, .nav-tabs a[data-toggle="tab"], a.shopping-cart').click(function (e) {
            e.preventDefault();
        });
        $('body').on('touchstart click', function (e) {
            if ($(window).width() < 992) {
                if (!$('.navbar-collapse').has(e.target).is('.navbar-collapse') && $('.navbar-collapse').hasClass('in') && !$(e.target).hasClass('navbar-toggle')) {
                    $('.navbar-collapse').collapse('hide');
                }
            } else {
                if (!$('.navbar-collapse').has(e.target).is('.navbar-collapse') && $('.navbar-collapse ul').hasClass('in')) {
                    $('.navbar-collapse').find('a.dropdown-toggle').addClass('collapsed');
                    $('.navbar-collapse').find('ul.dropdown-menu').removeClass('in');
                    $('.navbar-collapse a.dropdown-toggle').removeClass('active');
                }
            }
        });
        $('.navbar-collapse a.dropdown-toggle').on('touchstart', function (e) {
            $('.navbar-collapse a.dropdown-toggle').not(this).removeClass('active');
            $('.navbar-collapse a.dropdown-toggle').parent('li').not(this).removeClass('open');
            if ($(this).hasClass('active')){
                $(this).removeClass('active');
            } else {
                $(this).addClass('active');
                $(this).not('.megamenu-right-icon').parent('li').addClass('open');
            }
        });

        $("button.navbar-toggle").click(function () {
            if (isMobile) {
                $(".search-cart-header .cart-content").css('opacity', '0');
                $(".search-cart-header .cart-content").css('visibility', 'hidden');
            }
        });
        $("a.dropdown-toggle").click(function () {
            if (isMobile) {
                $(".search-cart-header .cart-content").css('opacity', '0');
                $(".search-cart-header .cart-content").css('visibility', 'hidden');
            }
        });


        /*==============================================================*/
        //Search - END CODE
        /*==============================================================*/

        /*==============================================================*/
        //Parallax - START CODE
        /*==============================================================*/

        var $elem = $('#content');
        $('#scroll_to_top').fadeIn('slow');
        $('#nav_down').fadeIn('slow');
        $(window).bind('scrollstart', function () {
            $('#scroll_to_top,#nav_down').stop().animate({'opacity': '0.2'});
        });
        $(window).bind('scrollstop', function () {
            $('#scroll_to_top,#nav_down').stop().animate({'opacity': '1'});
        });
        $('#nav_down').click(
                function (e) {
                    $('html, body').animate({scrollTop: $elem.height()}, 800);
                }
        );
        $('#scroll_to_top').click(
                function (e) {
                    $('html, body').animate({scrollTop: '0px'}, 800);
                }
        );
        /*==============================================================*/
        //Parallax - END CODE
        /*==============================================================*/

        // pull-menu close on href click event in mobile devices
        $( document ).on( 'click', '.pull-menu a.inner-link', function (e) {
            if( !( $( this ).parents( '.hamburger-menu1' ).length > 0 ) || isMobile ) {
                $('#close-button').click();
            }
        });

        if( $('div').hasClass('feature_nav')){
            $(".feature_nav .next").click(function () {
                $(this).parent().parent().find('.owl-carousel').trigger('next.owl.carousel');
            });
            $(".feature_nav .prev").click(function () {
                $(this).parent().parent().find('.owl-carousel').trigger('prev.owl.carousel');
            });
        }
    });

    /*==============================================================*/
    // Counter Number Appear - START CODE
    /*==============================================================*/

    $(document).ready(function () {
        // Check counter div is visible then animate counter
        $('.counter-number').appear();
        $(document.body).on('appear', '.counter-number', function (e) {
            // this code is executed for each appeared element
            var element = $(this);
            if (!$(this).hasClass('appear')) {
                animatecounters(element);
                $(this).addClass('appear');
            }
        });

        // Check chart div is visible then animate chart
        $('.chart').appear();
        $(document.body).on('appear', '.chart', function (e) {
            // this code is executed for each appeared element
            var element = $(this);
            if (!$(this).hasClass('appear')) {
                animatecharts(element);
                $(this).addClass('appear');
            }
        });
    });

    /*==============================================================*/
    // Counter Number Appear - END CODE
    /*==============================================================*/

    /*==============================================================*/
    //Counter Number - START CODE
    /*==============================================================*/

    function animatecounters(element) {
         var getCounterNumber = $(element).attr('data-to');
         $({ ValuerHbcO: 0 }).delay(0).animate({ ValuerHbcO: getCounterNumber },
         {
             duration: 2000,
             easing: "swing",
             step: function (currentLeft) {
                 var roundNumber = Math.ceil( currentLeft );
                 $(element).text( roundNumber );
             }
         });
    }
    /*==============================================================*/
    //Counter Number - END CODE
    /*==============================================================*/

    /*==============================================================*/
    //Chart Animated - START CODE
    /*==============================================================*/

    function animatecharts(element) {
        element.data('easyPieChart').update(0);
        element.data('easyPieChart').update(element.attr("data-percent"));
    }
    /*==============================================================*/
    //Chart Animated - END CODE
    /*==============================================================*/

    /*==============================================================*/
    //Navigation - START CODE
    /*==============================================================*/
    
    // Shrink nav on scroll
    $(window).scroll(function () {
        if( !$( 'nav.navigation-menu, nav.navbar' ).hasClass( 'no-shrink-nav' ) && !$( 'nav.navbar' ).hasClass( 'non-sticky-header' ) ) {
            if( $(window).scrollTop() > 10 ) {
                $('nav.navigation-menu, nav.navbar').addClass('shrink-nav');
                $('nav.hcode-nav-margin').removeClass('no-transition');
                    CenterLogoHeight();
                    marginNavbar();
            } else {
                $('nav.navigation-menu, nav.navbar').removeClass('shrink-nav');
                $('nav.hcode-nav-margin').addClass('no-transition');
                    CenterLogoHeight();
                    onloadmargin();
                    SetResizeContent();
                    marginNavbar();
            }
        }
    });
    // Resize Header Menu
    function SetResizeHeaderMenu() {
        var width = $('nav.navbar').children('div.container').width();
        $("ul.mega-menu-full").each(function () {
            $(this).css('width', width + 'px');
        });
    }
    /*==============================================================*/
    //Navigation - END CODE
    /*==============================================================*/


    /*==============================================================*/
    //Parallax - START CODE
    /*==============================================================*/
    // Parallax Fix Image Scripts 

    $('.parallax-fix').each(function () {
        if ($(this).children('.parallax-background-img').length) {
            var imgSrc = $(this).children('.parallax-background-img').attr('src');
            $(this).css('background', 'url("' + imgSrc + '")');
            $(this).children('.parallax-background-img').remove();
            $(this).css('background-position', '50% 0%');
        }

    });
    var IsParallaxGenerated = false;
    function SetParallax() {

        if( isiPhoneiPad )
            return false;

        if ($(window).width() > 1030 && !IsParallaxGenerated) {
            $('.parallax1').parallax("50%", 0.1);
            $('.parallax2').parallax("50%", 0.2);
            $('.parallax3').parallax("50%", 0.3);
            $('.parallax4').parallax("50%", 0.4);
            $('.parallax5').parallax("50%", 0.5);
            $('.parallax6').parallax("50%", 0.6);
            $('.parallax7').parallax("50%", 0.7);
            $('.parallax8').parallax("50%", 0.8);
            $('.parallax9').parallax("50%", 0.05);
            $('.parallax10').parallax("50%", 0.02);
            $('.parallax11').parallax("50%", 0.01);
            $('.parallax12').parallax("50%", 0.099);
            IsParallaxGenerated = true;
        }
    }
    /*==============================================================*/
    //Parallax - END CODE
    /*==============================================================*/

    /*==============================================================*/
    //Mobile Toggle Control - START CODE
    /*==============================================================*/

    $('.mobile-toggle').click(function () {
        $('nav').toggleClass('open-nav');
    });
    $('.dropdown-arrow').click(function () {
        if ($('.mobile-toggle').is(":visible")) {
            if ($(this).children('.dropdown').hasClass('open-nav')) {
                $(this).children('.dropdown').removeClass('open-nav');
            } else {
                $('.dropdown').removeClass('open-nav');
                $(this).children('.dropdown').addClass('open-nav');
            }
        }
    });
    /*==============================================================*/
    //Mobile Toggle Control - END CODE
    /*==============================================================*/

    /*==============================================================*/
    //Contact Form Focus Remove Border- START CODE
    /*==============================================================*/
    $("form.wpcf7-form input").focus(function () {
        if ($(this).hasClass("wpcf7-not-valid")) {
            $(this).removeClass("wpcf7-not-valid");
            $(this).parent().find(".wpcf7-not-valid-tip").remove();
            $(this).parents().find(".wpcf7-validation-errors").css("display", "none"); 
        }
    });
    /*==============================================================*/
    //Contact Form Focus Remove Border- END CODE
    /*==============================================================*/

    /*==============================================================*/
    //Position Fullwidth Subnavs fullwidth correctly - START CODE
    /*==============================================================*/
    $('.dropdown-fullwidth').each(function () {
        $(this).css('width', $('.row').width());
        var subNavOffset = -($('nav .row').innerWidth() - $('.menu').innerWidth() - 15);
        $(this).css('left', subNavOffset);
    });
    /*==============================================================*/
    //Position Fullwidth Subnavs fullwidth correctly - END CODE
    /*==============================================================*/

    /*==============================================================*/
    //Smooth Scroll - START CODE
    /*==============================================================*/
    var scrollAnimationTime = 1200,
        scrollAnimation = 'easeInOutExpo';
    $('a.scrollto').bind('click.smoothscroll', function (event) {
        event.preventDefault();
        var target = this.hash;
        $('html, body').stop()
                .animate({
                    'scrollTop': $(target)
                            .offset()
                            .top
                }, scrollAnimationTime, scrollAnimation, function () {
                    window.location.hash = target;
                });
    });
    $(document).on("scroll", dynamic_height);
    $(document).on('click', 'inner-link', function () {
        dynamic_height();
    });
    function dynamic_height(){
        var header_offset = $(".navbar").attr('data-offset');
        var general_offset = 0;
        if ( typeof header_offset !== typeof undefined && header_offset !== false ) {
            var general_offset = header_offset;
        }    
        $('.inner-link').smoothScroll({
            speed: 900,
            offset: parseInt( general_offset )
        });

    }
    
    // Inner links
    $(document).ready(function () {
        dynamic_height();
    });

    $(document).ready(function () {
        // Stop Propagation After Button Click
        $('.scrollToDownSection .inner-link, .scrollToDownSection form').click(function(event) {
            event.stopPropagation();
        });

        $('section.scrollToDownSection').click(function(){
           var section_id = $( $(this).attr('data-section-id') );
           $('html, body').animate({scrollTop: section_id.offset().top}, 800);
        });
    });
    // Single Product Readmore button link
    $('.woo-inner-link').click(function(){
        $(this).attr("data-toggle","tab");
        $("html,body").animate({scrollTop:$(".product-deails-tab").offset().top - 80 }, 1000);
        $(".nav-tabs-light li").removeClass("active");
        $(".nav-tabs-light li.description_tab ").addClass("active");
    });

    /*==============================================================*/
    //Smooth Scroll - END CODE
    /*==============================================================*/

    /*==============================================================*/
    //Full Screen Header - START CODE
    /*==============================================================*/

    function SetResizeContent() {
        var $deductheight = 0;
        var $minheight = $(window).height();
        if( $(".parent-section section:first.full-screen, .parent-section section:first .full-screen").length > 0 && !$('body').hasClass('vc_editor') ) {
            var $miniheaderheight = $(".top-header-area").outerHeight();
            if( $miniheaderheight && $miniheaderheight != null ){
                if( $(window).width() > 767 ) {
                    $deductheight += $miniheaderheight;
                }else{
                    if( $('header').hasClass('mini-header-mobile') ){
                        $deductheight += $miniheaderheight;
                    }
                }
            }
            var admin_bar_height = $('#wpadminbar').outerHeight();
            if( admin_bar_height && admin_bar_height != null ){
                $deductheight += admin_bar_height;
            }
            if( !$(".parent-section").hasClass("content-top-space") ){
                var $headerheight = $(".navbar").outerHeight();
                if( $headerheight && $headerheight != null ){
                    $deductheight += $headerheight;
                }
            }
            var $titleheight = $(".page-title-section").outerHeight();
            if( $titleheight && $titleheight != null ){
                $deductheight += $titleheight;
            }
            $(".full-screen").css('min-height', $minheight);
            $(".parent-section section:first.full-screen, .parent-section section:first .full-screen").css('min-height', $minheight - $deductheight );
        } else {
            $(".full-screen").css('min-height', $minheight);
        }

         var minwidth = $(window).width();
         $(".full-screen-width").css('min-width', minwidth);

         $('.menu-first-level').each(function () {
            var menu_link = $(this).children('a');
            var dataurl = menu_link.attr('data-redirect-url');
            var datadefaulturl = menu_link.attr('data-default-url');
            if( $(this).hasClass('hcode-menu-ajax-popup') ){
                $(menu_link).removeAttr('data-toggle');
                $(this).children('a').attr('href', dataurl);
                $(this).removeClass('menu-first-level');
            } else {
                if (minwidth >= 992) {
                    $(menu_link).removeAttr('data-toggle');
                    $(this).children('a').attr('href', dataurl);
                } else {
                    $(menu_link).attr('data-toggle', 'collapse');
                    $(this).children('a').attr('href', datadefaulturl);
                }
            }
         });
    }

    /* center logo container height */
    function CenterLogoHeight(){
        if( $(".navbar").hasClass("header-center-logo") ){
            var centerLogoHeight = $(".hcode-header-logo.center-logo").outerHeight();
            var menuHeight = $(".accordion-menu").outerHeight();
            if( centerLogoHeight || menuHeight ){
                var navContainerHeight = ( menuHeight > centerLogoHeight ) ? menuHeight : centerLogoHeight;
                $(".navbar").find(".nav-header-container").css('cssText', 'height: ' + navContainerHeight + 'px;');
            }
        }

    }

    CenterLogoHeight();
    SetResizeContent();
    /*==============================================================*/
    //Full Screen Header - END CODE
    /*==============================================================*/


    /*==============================================================*/
    //Window Resize Events - START CODE
    /*==============================================================*/
    $(window).resize(function () {

        HamburderMenuCustomScroll();
        OnePageActiveOnScroll();
        //Position Fullwidth Subnavs fullwidth correctly
        $('.dropdown-fullwidth').each(function () {
            $(this).css('width', $('.row').width());
            var subNavOffset = -($('nav .row').innerWidth() - $('.menu').innerWidth() - 15);
            $(this).css('left', subNavOffset);
        });
        SetResizeContent();
        CenterLogoHeight();
        setTimeout(function () {
            SetResizeHeaderMenu();
        }, 200);
        if ($(window).width() >= 992 && $('.navbar-collapse').hasClass('in')) {
            $('.navbar-collapse').removeClass('in');
            //$('.navbar-collapse').removeClass('in').find('ul.dropdown-menu').removeClass('in').parent('li.dropdown').addClass('open');
            $('.navbar-collapse ul.dropdown-menu').each(function () {
                if ($(this).hasClass('in')) {
                    $(this).removeClass('in'); //.parent('li.dropdown').addClass('open');
                }
            });
            $('ul.navbar-nav > li.dropdown > a.dropdown-toggle').addClass('collapsed');
            $('.logo').focus();
            $('.navbar-collapse a.dropdown-toggle').removeClass('active');
        }

        setTimeout(function () {
            SetParallax();
        }, 1000);
    });
    /*==============================================================*/
    //Window Resize Events - END CODE
    /*==============================================================*/

    /*==============================================================*/
    //Countdown Timer - START CODE
    /*==============================================================*/
    $(document).ready(function () {
        $('.counter-hidden').each(function () {
            if($(this).hasClass('counter-underconstruction-date')){
                
                var $counter_date = $('.counter-underconstruction-date').html();

                /* Get Counter taxts */
                var $CounterDay, $CounterHours, $CounterMinutes, $CounterSeconds = '';
                var CounterDayattr = $(this).parent().find('#counter-underconstruction').attr('data-days-text');
                if( typeof CounterDayattr !== typeof undefined && CounterDayattr !== false ) {
                    var $CounterDay = '<span>'+CounterDayattr+'</span>';
                }
                var CounterHoursattr = $(this).parent().find('#counter-underconstruction').attr('data-hours-text');
                if( typeof CounterHoursattr !== typeof undefined && CounterHoursattr !== false ) {
                    var $CounterHours = '<span>'+CounterHoursattr+'</span>';
                }
                var CounterMinutesattr = $(this).parent().find('#counter-underconstruction').attr('data-minutes-text');
                if( typeof CounterMinutesattr !== typeof undefined && CounterMinutesattr !== false ) {
                    var $CounterMinutes = '<span>'+CounterMinutesattr+'</span>';
                }
                var CounterSecondsattr = $(this).parent().find('#counter-underconstruction').attr('data-seconds-text');
                if( typeof CounterSecondsattr !== typeof undefined && CounterSecondsattr !== false ) {
                    var $CounterSeconds = '<span>'+CounterSecondsattr+'</span>';
                }
                
                $(this).parent().find('#counter-underconstruction').countdown($counter_date+' 00:00:00').on('update.countdown', function (event) {
                    var $this = $(this).parent().find('#counter-underconstruction').html(event.strftime('' + 
                        '<div class="counter-container"><div class="counter-box first"><div class="number">%-D</div>'+$CounterDay+'</div>' + 
                        '<div class="counter-box"><div class="number">%H</div>'+$CounterHours+'</div>' + 
                        '<div class="counter-box"><div class="number">%M</div>'+$CounterMinutes+'</div>' + 
                        '<div class="counter-box last"><div class="number">%S</div>'+$CounterSeconds+'</div></div>'))
                });
            }
        });

        $('.counter-hidden').each(function () {
            if( $(this).hasClass('hcode-time-counter-date')){
                var $counter_date = $(this).html();

                /* Get Counter taxts */
                var $CounterDay, $CounterHours, $CounterMinutes, $CounterSeconds = '';
                var CounterDayattr = $(this).parent().find('#hcode-time-counter').attr('data-days-text');
                if( typeof CounterDayattr !== typeof undefined && CounterDayattr !== false ) {
                    var $CounterDay = '<span>'+CounterDayattr+'</span>';
                }
                var CounterHoursattr = $(this).parent().find('#hcode-time-counter').attr('data-hours-text');
                if( typeof CounterHoursattr !== typeof undefined && CounterHoursattr !== false ) {
                    var $CounterHours = '<span>'+CounterHoursattr+'</span>';
                }
                var CounterMinutesattr = $(this).parent().find('#hcode-time-counter').attr('data-minutes-text');
                if( typeof CounterMinutesattr !== typeof undefined && CounterMinutesattr !== false ) {
                    var $CounterMinutes = '<span>'+CounterMinutesattr+'</span>';
                }
                var CounterSecondsattr = $(this).parent().find('#hcode-time-counter').attr('data-seconds-text');
                if( typeof CounterSecondsattr !== typeof undefined && CounterSecondsattr !== false ) {
                    var $CounterSeconds = '<span>'+CounterSecondsattr+'</span>';
                }

                
                $(this).parent().find('#hcode-time-counter').countdown($counter_date+' 00:00:00').on('update.countdown', function (event) {
                    var $this = $(this).parent().find('#hcode-time-counter').html(event.strftime('' + 
                        '<div class="counter-container"><div class="counter-box first"><div class="number">%-D</div>'+$CounterDay+'</div>' + 
                        '<div class="counter-box"><div class="number">%H</div>'+$CounterHours+'</div>' + 
                        '<div class="counter-box"><div class="number">%M</div>'+$CounterMinutes+'</div>' + 
                        '<div class="counter-box last"><div class="number">%S</div>'+$CounterSeconds+'</div></div>'))
                });
            }
        });
    });
    /*==============================================================*/
    //Countdown Timer - END CODE
    /*==============================================================*/


    /*==============================================================*/
    //Scroll To Top - START CODE
    /*==============================================================*/
    $(window).scroll(function () {
        if ($(this)
                .scrollTop() > 100) {
            $('.scrollToTop')
                    .fadeIn();
        } else {
            $('.scrollToTop')
                    .fadeOut();
        }
    });
    //Click event to scroll to top
    $('.scrollToTop').click(function () {
        $('html, body').animate({
            scrollTop: 0
        }, 1000);
        return false;
    });
    /*==============================================================*/
    //Scroll To Top - END CODE
    /*==============================================================*/

    $('nav ul.panel-group li.dropdown a.dropdown-toggle').click(function () {

        if ($(this).parent('li').find('ul.dropdown-menu').length > 0) {
            $(this).parents('ul').find('li.dropdown-toggle').not($(this).parent('li')).removeClass('open');
            if ($(this).parent('li').hasClass('open')) {
                $(this).parent('li').removeClass('open');
            }
            else {
                $(this).parent('li').addClass('open');
            }
        }
    });

    $('.hamburger-menu2 a.megamenu-right-icon, .hamburger-menu3 a.megamenu-right-icon').click(function () {

        if ($(this).parents('li').find('ul.sub-menu').length > 0) {
            
            if ($(this).hasClass('open')) {
                $(this).removeClass('open');
                $(this).next().slideUp();
            }
            else {
                $(this).addClass('open');
                $(this).next().slideDown();
            }
        }
        return false;
    });

    /*==============================================================*/
    //To Make Checkbox/Radio Active/Disabled  - START CODE
    /*==============================================================*/

    $(".carousel .carousel-indicators > li:first-child").addClass("active");
    $(".carousel .carousel-inner > div:first-child").addClass("active");

    $('span.optionsradios input[value=Disabled]').attr('disabled', 'disabled');
    $('span.optionscheckbox input[value=Disabled]').attr('disabled', 'disabled');
    /*==============================================================*/
    //To Make Checkbox/Radio Active/Disabled - END CODE
    /*==============================================================*/


    /*==============================================================*/
    // NewsLetter Validation - START CODE
    /*==============================================================*/

    $('.submit_newsletter').click(function () {
        var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
        var current = $(this);
        var address = $(this).closest('form').find('.xyz_em_email').val();
        if(reg.test(address) == false) {
            //alert('Please check whether the email is correct.');
            current.closest('form').find('.xyz_em_email').addClass('newsletter-error');
        return false;
        }else{
        //document.subscription.submit();
        return true;
        }
    });

    $('.xyz_em_email').on('focus', function(){
      $(this).removeClass('newsletter-error');
    });

    /*==============================================================*/
    // NewsLetter Validation - END CODE
    /*==============================================================*/

    /*==============================================================*/
    // Woocommerce Grid List View - START CODE
    /*==============================================================*/
    $('.hcode-product-grid-list-wrapper > a').click(function () {
        var set_product_view = $(this);
        var product_type = set_product_view.parents().find('.products');

        if( set_product_view.hasClass('hcode-list-view')){
            product_type.addClass('product-list-view');
            product_type.removeClass('product-grid-view');
        }
        if( set_product_view.hasClass('hcode-grid-view') ){
            product_type.addClass('product-grid-view');
            product_type.removeClass('product-list-view');
        }
        set_product_view.parent().find('.active').removeClass('active');
        set_product_view.addClass('active');

    });


    /*==============================================================*/
    // Woocommerce Grid List View - END CODE
    /*==============================================================*/

    /*==============================================================*/
    // Woocommerce Add Minus Plus Icon In Price Arround - START CODE
    /*==============================================================*/
    $(document).ready(function () {

        // Target quantity inputs on product pages
        $('input.qty:not(.product-quantity input.qty)').each(function () {
            var min = parseFloat($(this).attr('min'));

            if (min && min > 0 && parseFloat($(this).val()) < min) {
                $(this).val(min);
            }
        });

        $(document).on('click', '.plus, .minus', function () {

            // when on checkout remove product via ajax. click on plus or minus remove disabled on update button. 
            $( 'div.woocommerce form input[name="update_cart"]' ).prop( 'disabled', false );

            // Get values
            var $qty = $(this).closest('.quantity').find('.qty'),
              currentVal = parseFloat($qty.val()),
              max = parseFloat($qty.attr('max')),
              min = parseFloat($qty.attr('min')),
              step = $qty.attr('step');

            // Format values
            if (!currentVal || currentVal === '' || currentVal === 'NaN') currentVal = 0;
            if (max === '' || max === 'NaN') max = '';
            if (min === '' || min === 'NaN') min = 0;
            if (step === 'any' || step === '' || step === undefined || parseFloat(step) === 'NaN') step = 1;

            // Change the value
            if ($(this).is('.plus')) {

                if (max && (max == currentVal || currentVal > max)) {
                    $qty.val(max);
                } else {
                    $qty.val(currentVal + parseFloat(step));
                }

            } else {

                if (min && (min == currentVal || currentVal < min)) {
                    $qty.val(min);
                } else if (currentVal > 0) {
                    $qty.val(currentVal - parseFloat(step));
                }

            }

            // Trigger change event
            $qty.trigger('change');
        });
    });
    /*==============================================================*/
    // Woocommerce Add Minus Plus Icon In Price Arround - END CODE
    /*==============================================================*/

    /*==============================================================*/
    // Checkout Remove Close Event - START CODE
    /*==============================================================*/
    $(document).ready(function () {
        $(document).on('click', '.checkout-alert-remove', function () {
            var remove_parent = $(this).parent().parent();
            if( remove_parent.hasClass('alert-remove') ){
                remove_parent.remove();
            }
        });
    });
    /*==============================================================*/
    // Checkout Remove Close Event - END CODE
    /*==============================================================*/

    /*==============================================================*/
    // Post Like Dislike Button JQuery - START CODE
    /*==============================================================*/
    $(document).ready(function () {
        $(document).on('click', '.sl-button', function() {
            var button = $(this);
            var post_id = button.attr('data-post-id');
            var security = button.attr('data-nonce');
            var iscomment = button.attr('data-iscomment');
            var allbuttons;
            if ( iscomment === '1' ) { /* Comments can have same id */
                allbuttons = $('.sl-comment-button-'+post_id);
            } else {
                allbuttons = $('.sl-button-'+post_id);
            }
            var loader = allbuttons.next('#sl-loader');
            if (post_id !== '') {
                $.ajax({
                    type: 'POST',
                    url: simpleLikes.ajaxurl,
                    data : {
                        action : 'process_simple_like',
                        post_id : post_id,
                        nonce : security,
                        is_comment : iscomment
                    },
                    beforeSend:function(){
                    },  
                    success: function(response){
                        var icon = response.icon;
                        var count = response.count;
                        allbuttons.html(icon+count);
                        if(response.status === 'unliked') {
                            var like_text = simpleLikes.like;
                            allbuttons.prop('title', like_text);
                            allbuttons.removeClass('liked');
                        } else {
                            var unlike_text = simpleLikes.unlike;
                            allbuttons.prop('title', unlike_text);
                            allbuttons.addClass('liked');
                        }
                        loader.empty();                 
                    }
                });
                
            }
            return false;
        });
    });
    /*==============================================================*/
    // Post Like Dislike Button JQuery - END CODE
    /*==============================================================*/


    /*==============================================================*/
    // Menu Icon Click jQuery - START CODE
    /*==============================================================*/

    $(document).ready(function () {
         $( '.menu-first-level a.dropdown-toggle:first-of-type' ).bind( 'click', function (event) {
             var minwidth = $(window).width();
             if (minwidth >= 992) {
                var geturl = $(this).attr('href');
                if((typeof geturl) !== 'undefined' ){
                     if (event.ctrlKey || event.metaKey) {
                         if (geturl != '#' && geturl != '') {
                             window.open(geturl, '_blank');
                         }
                     } else {
                         if (geturl != '#' && geturl != '') {
                             if ($(this).attr('target') == '_blank') {
                                 window.open(geturl, '_blank');
                             } else {
                                 window.location.href = geturl;
                             }
                         }
                     }
                }
             } else {
                var geturl = $(this).attr('data-redirect-url');
                if((typeof geturl) !== 'undefined' ){
                     if (event.ctrlKey || event.metaKey) {
                         if (geturl != '#' && geturl != '') {
                             window.open(geturl, '_blank');
                         }
                     } else {
                         if (geturl != '#' && geturl != '') {
                             if ($(this).attr('target') == '_blank') {
                                 window.open(geturl, '_blank');
                             } else {
                                 window.location.href = geturl;
                             }
                         }
                     }
                 }
             }
         });
    });
    /*==============================================================*/
    // Menu Icon Click jQuery - END CODE
    /*==============================================================*/


    /*==============================================================*/
    // Menu Icon Add jQuery - START CODE
    /*==============================================================*/
    $(document).ready(function () {
        if($("li.menu-item-language").find("ul").first().length != 0){
            $("li.menu-item-language a:first").append("<i class='fas fa-angle-down'></i>");
        }
    });
    /*==============================================================*/
    // Menu Icon Add jQuery - END CODE
    /*==============================================================*/

    /*==============================================================*/
    // Comment Validation - START CODE
    /*==============================================================*/

    $(document).ready(function () {
      
        $(".comment-button").on("click", function () {
            var fields;
                fields = "";
            if($(this).parent().parent().find('#author').length == 1) {
                if ($("#author").val().length == 0 || $("#author").val().value == '')
                {
                    fields ='1';
                    $("#author").addClass("inputerror");
                }
            }
            if($(this).parent().parent().find('#comment').length == 1) {
                if ($("#comment").val().length == 0 || $("#comment").val().value == '')
                {
                    fields ='1';
                    $("#comment").addClass("inputerror");
                }
            }
            if($(this).parent().parent().find('#email').length == 1) {
                if ($("#email").val().length == 0 || $("#email").val().length =='')
                {
                    fields ='1';
                    $("#email").addClass("inputerror");
                }
                else
                    {
                        var re = new RegExp();
                        re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
                        var sinput ;
                        sinput= "" ;
                        sinput = $("#email").val();
                        if (!re.test(sinput))
                        {
                            fields ='1';
                            $("#email").addClass("inputerror");
                        }
                    }
            }
            if(fields !="")
            {
                return false;
            }           
            else
            {
                return true;
            }
        });

    });
    $(".comment-field").on("focus",function(e){
        var id = $(this).attr("id");
        if( id ){
            $('#'+id).removeClass('inputerror');
        }
    });
    /*==============================================================*/
    // Comment Validation - END CODE
    /*==============================================================*/

    var IpadMobileHover = function () {
    	if((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPod/i)) || (navigator.userAgent.match(/iPad/i))) {
    	    $('.icon-box > i').on('touchstart', function () {
    	        $(this).trigger('hover');
    	    }).on('touchend', function () {
    	        $(this).trigger('hover');
    	    });
    	}
    };

    /*==============================================================*/
    // Slider Integrate into Tab - START CODE
    /*==============================================================*/

    $(document).ready(function () {
        $('.nav-tabs a[data-toggle="tab"]').each(function () {
            var $this = $(this);
            $this.on('shown.bs.tab', function () {
                if( $('.masonry-items').length > 0 ) {
                    $('.masonry-items').imagesLoaded( function () {
                        $('.masonry-items').masonry({
                            itemSelector: 'li',
                            layoutMode: 'masonry'
                        });
                    });
                }
                if( $('.blog-masonry').length > 0 ) {
                    $('.blog-masonry').imagesLoaded( function () {
                        $('.blog-masonry').masonry({
                            itemSelector: 'div.blog-listing',
                            layoutMode: 'masonry'
                        });
                    });
                }
            });
        });
    });

    /*==============================================================*/
    // Slider Integrate into Tab - END CODE
    /*==============================================================*/

    /*==============================================================*/
    // Add extra class into menu - START CODE
    /*==============================================================*/

    $(document).ready(function () {
        hcodeMobileMenuDynamicClass();
    });

    $(window).resize(function () {
        hcodeMobileMenuDynamicClass();
    });

    function hcodeMobileMenuDynamicClass() {
        if (window.matchMedia('(max-width: 991px)').matches) {
            $( '.accordion-menu' ).addClass( 'mobile-accordion-menu' );
        } else {
            $( '.accordion-menu' ).removeClass( 'mobile-accordion-menu' );
        }
    }

    /*==============================================================*/
    // Add extra class into menu - END CODE
    /*==============================================================*/

    /*==============================================================*/
    // Portfolio gallery popup - START CODE
    /*==============================================================*/

    $(document).ready(function(){

        $( "figcaption" ).on( "click", ".parent-gallery-popup", function() {
            if ( $(this).parents('li').find('.gallery-img').children().length > 0 ) {
                $(this).parents('li').find('a.lightboxgalleryitem').first().trigger('click');
            }
        });

        $( "figure" ).on( "click", ".parallax-parent-gallery-popup", function() {
            if ( $(this).parents('.parallax-portfolio-gallery-parent').find('a.lightboxgalleryitem').length > 0 ) {
                $(this).parents('.parallax-portfolio-gallery-parent').find('a.lightboxgalleryitem').first().trigger('click');
            }
        });

    });

    /*==============================================================*/
    // Portfolio gallery popup - END CODE
    /*==============================================================*/


    /*==============================================================*/
    // Infinite Scroll jQuery - START CODE
    /*==============================================================*/

    var pagesNum = $("div.hcode-infinite-scroll").attr('data-pagination');
    $(document).ready(function(){
        $('.infinite-scroll-pagination').infinitescroll({
            nextSelector: 'div.hcode-infinite-scroll a',
            loading: {
                img: hcodeajaxurl.loading_image,
                msgText: '<div class="paging-loader" style="transform:scale(0.35);"><div class="circle"><div></div></div><div class="circle"><div></div></div><div class="circle"><div></div></div><div class="circle"><div></div></div></div>',
                finishedMsg: '<div class="finish-load">' + hcode_infinite_scroll_message.message + '</div>',
                speed: 'fast',
            },
            navSelector: 'div.hcode-infinite-scroll',
            contentSelector: '.infinite-scroll-pagination',
            itemSelector: '.infinite-scroll-pagination div.blog-single-post',
            maxPage: pagesNum,
        }, function (newElements) {
            $('.hcode-infinite-scroll').remove();
            $('#infscr-loading').remove();
            /* For new element set masonry */
            var $newblogpost = $(newElements);
            // append other items when they are loaded
            $newblogpost.imagesLoaded( function() {
            $('.blog-masonry').append( $newblogpost )
              .isotope( 'appended', $newblogpost );
            });

            try {
                $(".fit-videos").fitVids();
            }catch (err) { }

            /* For owl slider */
            $(".blog-gallery").owlCarousel({
                nav: true, // Show next and prev buttons
                autoplaySpeed: 300,
                dotsSpeed: 400,
                rtl: $("body").hasClass("rtl") ? true:false,
                loop: true,
                items: 1,
                navText: ["<i class='fas fa-angle-left'></i>", "<i class='fas fa-angle-right'></i>"]
            });
            /* For Magnific Popup */
            var lightboxgallerygroups = {};
            $('.lightboxgalleryitem').each(function() {
              var id = $(this).attr('data-group');
              if(!lightboxgallerygroups[id]) {
                lightboxgallerygroups[id] = [];
              } 
              
              lightboxgallerygroups[id].push( this );
            });


            $.each(lightboxgallerygroups, function() {
                $(this).magnificPopup({
                    type: 'image',
                    closeOnContentClick: true,
                    closeBtnInside: false,
                    gallery: { enabled:true },
                    image: {
                        titleSrc: function (item) {
                            var title = '';
                            var lightbox_caption = '';
                            if( item.el.attr('title') ){
                                title = item.el.attr('title');
                            }
                            if( item.el.attr('lightbox_caption') ){
                                lightbox_caption = '<span class="hcode-lightbox-caption">'+item.el.attr('lightbox_caption')+'</span>';
                            }
                            return title + lightbox_caption;
                        }
                    },
                    // Remove close on popup bg v1.5
                    callbacks: {
                        open: function () {
                            $.magnificPopup.instance.close = function() {
                                if (!isMobile && !$('body').hasClass('hcode-custom-popup-close') ){
                                    $.magnificPopup.proto.close.call(this);
                                } else {
                                    $('button.mfp-close').click(function() {
                                        $.magnificPopup.proto.close.call(this);
                                    });
                                }
                            }
                        }
                    }
                });
            });
        });
    });


    /*==============================================================*/
    // Infinite Scroll jQuery - END CODE
    /*==============================================================*/

    /*==============================================================
        Custom Scroll Bar - START CODE
     ==============================================================*/

    function HamburderMenuCustomScroll() {

        var windowHeight = $(window).height();
        $(".hamburger-menu1 .navbar-default").css('height', ( windowHeight / 2 ) );

        $(".hamburger-menu1 .navbar-default").mCustomScrollbar({
            scrollInertia: 100,
            scrollButtons:{
                enable:false
            },
            keyboard:{
                enable: true
            },
            mouseWheel:{
                enable:true,
                scrollAmount:200
            },
            callbacks:{
                whileScrolling:function(){
                },
            }
        });
    }

    /*==============================================================
        Custom Scroll Bar - END CODE
     ==============================================================*/

    /*==============================================================
        Hamburger Menu 1 Auto Active Menu - START CODE
     ==============================================================*/

    function OnePageActiveOnScroll(event){

        var header_offset = $(".navbar").attr('data-offset');
        if ( typeof header_offset !== typeof undefined && header_offset !== false ) {
            var general_offset = header_offset;
        } else {
            var general_offset = 0;
        }
        var scrollPos = $(document).scrollTop();
        scrollPos -= parseInt( general_offset );
        scrollPos = ( scrollPos > 0 ) ? scrollPos : 0;
        
        $('.navigation-menu a.inner-link, .navbar a.inner-link').each(function () {
            var currLink = $(this);
            var hasPos  = currLink.attr("href").indexOf("#");
            if( hasPos > -1 ) {
                var res = currLink.attr("href").substring( hasPos );
                if( $( res ).length > 0 ) {
                    var refElement = $( res );
                    var offsetTop = refElement[0].offsetTop;
                    var offsetHeight = refElement[0].offsetHeight;
                    if (offsetTop <= scrollPos && offsetTop + offsetHeight > scrollPos) {
                        $('a.inner-link').removeClass("active");
                        currLink.addClass("active");
                    }
                    else{
                        currLink.removeClass("active");
                    }
                }
            }
        });
    }

    /*==============================================================
        Hamburger Menu 1 Auto Active Menu - END CODE
     ==============================================================*/

    /*==============================================================
       Bootstrap Slider In VC Front Editor - START CODE
    =============================================================*/

    $(document).ready(function(){
        $( '.vc_editor .carousel' ).each(function() {
          $(this).find('.vc_element').addClass('item');
          $(this).find('.vc_element:first').addClass('active');
          $(this).find('.vc_element > .item').removeClass('item');
          $(this).find('.carousel-indicators li:first').addClass('active');
        });

        /* */
        if( $( 'body').hasClass( 'vc_editor' ) ){
            $( '.vc_editor .hcode-remove-frontend-editor-position-style1' ).each(function() {
                $(this).parents('.vc_vc_column').addClass('remove-position-relative');
            });
            $( '.vc_editor .hcode-remove-frontend-editor-position-style2' ).each(function() {
                $(this).parents('.vc_vc_column').addClass('remove-position-relative-style2');
                $(this).parent().addClass('remove-position-relative-style2');
            });
            $( '.vc_editor section.fill' ).each(function() {
                $(this).parent().addClass('remove-position-relative-style2');
            });
            $( '.front-column-class' ).each(function() {
                $(this).removeClass('vc_col-sm-12');
            });
            
        }
        $( '.hcode-min-height-0px' ).each(function () {
            $(this).removeClass('hcode-min-height-0px');
            $(this).parent().addClass('hcode-min-height-0px ');
        });

        $( '.wpb_column' ).each(function () {

            var CurrentColumn = $(this);
            var DataVCFrontClass = $(this).attr( 'data-front-class' );
            if( DataVCFrontClass && $( 'body').hasClass( 'vc_editor' ) ){
                CurrentColumn.parent().addClass( DataVCFrontClass );
                CurrentColumn.removeClass( DataVCFrontClass );
                CurrentColumn.attr('class', '');
                CurrentColumn.addClass('wpb_column');
                CurrentColumn.addClass('hcode-column-container');
            }
            CurrentColumn.removeAttr( 'data-front-class' );

            var DataPadding = $(this).attr( 'data-padding' );
            var DataMargin = $(this).attr( 'data-margin' );
            var DataMinHeight = $(this).attr( 'data-min-height' );
            var DataZindex = $(this).attr( 'data-z-index' );
            var DataBackground = $(this).attr( 'data-background' );
            
            if ( typeof DataPadding != "undefined" && DataPadding != '' ) {
                if( DataPadding && $( 'body').hasClass( 'vc_editor' ) ){
                    if( DataPadding ){
                        CurrentColumn.parent().css({ 'padding': DataPadding });
                    }
                }
                CurrentColumn.removeAttr( 'data-padding' );
            }

            if ( typeof DataMargin != "undefined" && DataMargin != '' ) {
                if( DataMargin && $( 'body').hasClass( 'vc_editor' ) ){
                    if( DataMargin ){
                        CurrentColumn.parent().css({ 'margin': DataMargin });
                    }
                }
                CurrentColumn.removeAttr( 'data-margin' );
            }

            if ( typeof DataMinHeight != "undefined" && DataMinHeight != '' ) {
                if( DataMinHeight && $( 'body').hasClass( 'vc_editor' ) ){
                    if( DataMinHeight ){
                        CurrentColumn.parent().css({ 'min-height': DataMinHeight });
                    }
                }
                CurrentColumn.removeAttr( 'data-min-height' );
            }

            if ( typeof DataZindex != "undefined" && DataZindex != '' ) {
                if( DataZindex && $( 'body').hasClass( 'vc_editor' ) ){
                    if( DataZindex ){
                        CurrentColumn.parent().css({ 'z-index': DataZindex });
                    }
                }
                CurrentColumn.removeAttr( 'data-z-index' );
            }

            if ( typeof DataBackground != "undefined" && DataBackground != '' ) {
                if( DataBackground && $( 'body').hasClass( 'vc_editor' ) ){
                    if( DataBackground ){
                        CurrentColumn.parent().css({ 'background': DataBackground });
                    }
                }
                CurrentColumn.removeAttr( 'data-background' );
            }

            if( CurrentColumn.attr("style") && $( 'body').hasClass( 'vc_editor' ) ){
                CurrentColumn.removeAttr('style');
            }
        });
        
        /* For Shop Page slider */
        $( '.home-shop' ).parents( 'section.margin-top-81px' ).removeClass( 'margin-top-81px' );
    });

    /*==============================================================
       Bootstrap Slider In VC Front Editor - END CODE
    =============================================================*/

    /*==============================================================
       One Page Main JS - START CODE
    =============================================================*/

    $(window).load(function () {
        init_scroll_navigate();
        $(window).trigger("scroll");
        $(window).trigger("resize");
    });
    function init_scroll_navigate() {
        var sections = $(".parent-section .row > section");
        var menu_links = $(".navbar-nav li a");

        $(window).scroll(function () {
            setTimeout(function () {
                sections.filter(":in-viewport:first").each(function () {
                    var active_section = $(this);
                    var active_link = $('.navbar-nav li a[href="#' + active_section.attr("id") + '"]');
                    menu_links.removeClass("active");
                    active_link.addClass("active");

                });
            }, 500);
        });
    }

    /*==============================================================
       One Page Main JS - END CODE
    =============================================================*/

    /*==============================================================
       Portfolio Filter JS - START CODE
    =============================================================*/

    $( '.portfolio-filter > li > a' ).on( 'click', function (e) {
        if( $(window).width() < 768 ) {
        e.preventDefault();
        $('html,body').animate({
            scrollTop: $( this ).parents( 'section' ).find( '.content-section > .tab-content' ).offset().top - $('nav').outerHeight() },
        'slow');
        }
    });

    /*==============================================================
       Portfolio Filter JS - END CODE
    =============================================================*/

    /*==============================================================
       margin-top for first section. START CODE
    =============================================================*/
    function onloadmargin(){
        var topheight = admin_bar_height = header_height = 0;
        if( $('.navbar').hasClass('hcode-nav-margin') ){
            var header_height = $('.navbar').outerHeight();
        }
        if( $( '.top-header-area' ).length > 0 ){
            topheight = $('.top-header-area').outerHeight();
        }
        if( $('#wpadminbar').length > 0 && $('.navbar, .pull-menu-button').length < 1 ){
            var admin_bar_height = $('#wpadminbar').outerHeight();
        }
        if( header_height || topheight ){
            var margin_on_first_load = header_height + topheight + admin_bar_height;
            $( 'section:first' ).attr('data-nav-default-height', margin_on_first_load);
        }
    }
    $(document).ready(function () {
        onloadmargin();
        marginNavbar();
        marginFirstSection();
    });

    $(window).resize(function (e) {
        setTimeout(function () {
            onloadmargin();
            marginNavbar();
            marginFirstSection();
        }, 300);
    });

    function marginFirstSection() {
        var header_height = $('.navbar').outerHeight();
        if( $('.top-header-area').length > 0 || $('#wpadminbar').length > 0 ){
            var admin_bar_header_height = 0;
            var topheight = 0;
            if( $(window).width() > 767 ) {
                var topheight = $('.top-header-area').outerHeight();
            }else{
                if( $('header').hasClass('mini-header-mobile') ){
                    var topheight = $('.top-header-area').outerHeight();
                }
            }
            
            if( $('#wpadminbar').length > 0 && !$('body').hasClass('vc_editor') ){
                var admin_bar_height = $('#wpadminbar').outerHeight();
                admin_bar_header_height = topheight + admin_bar_height;
            }else{
                admin_bar_height = 0;
                admin_bar_header_height = topheight;
            }
            
            if( $(".navbar" ).length > 0 ){
                $(".navbar, .pull-menu-button").css("cssText", "top: " + admin_bar_header_height + "px !important;");
            }
            if( $(window).width() > 767 ) {
                if( $('.navbar' ).hasClass('shrink-nav') ){
                    $('.non-sticky-mini-header').css('cssText', 'top: ' + admin_bar_height + 'px !important;');
                }else{
                    $('.navbar, .pull-menu-button').css('cssText', 'top: ' + admin_bar_header_height + 'px !important;');
                }
            }else{
                if( $('.navbar' ).hasClass('shrink-nav') && $('.top-header-area').length < 1 ){
                    $('.navbar').css('cssText', 'top: '+ admin_bar_header_height + 'px !important;');
                }else{
                    if( $('header').hasClass('mini-header-mobile') ){
                        $('.navbar, .pull-menu-button').css('cssText', 'top: ' + admin_bar_header_height + 'px !important;');
                    }else{
                        var topheight = $('.mini-header-mobile .top-header-area').outerHeight();
                        $('.navbar, .pull-menu-button').css('cssText', 'top: ' + admin_bar_header_height + 'px !important;');
                    }
                }
            }
            header_height = header_height + topheight;
        }
        if( $('.navbar').hasClass('hcode-nav-margin') ){    
           header_height = header_height;
        }else{
            $( '.parent-section' ).addClass('content-top-space');
            if( $(window).width() > 767 ) {
                header_height = $('.top-header-area').outerHeight();
            }else{
                if( $('header').hasClass('mini-header-mobile') ){
                    header_height = $('.top-header-area').outerHeight();
                }else{
                    header_height = 0;
                }
            }
        }
        var header_height_section = $('section:first').attr('data-nav-default-height');
        if( typeof header_height_section !== typeof undefined && header_height_section !== false ) {
            $( 'section:first' ).css({ 'margin-top' : header_height_section + 'px'});
        }else{
            $( 'section:first' ).css({ 'margin-top' : header_height + 'px'});
        }
    }
    function marginNavbar() {
        var admin_bar_height = $('#wpadminbar').outerHeight();
        var admin_bar_header_height = 0;
        var topheight = 0;
        if( $('header').hasClass('no-sticky-mini-header') && !$('.navbar' ).hasClass('shrink-nav') ){
            if( $(window).width() > 767 ) {
                var topheight = $('.top-header-area').outerHeight();
            }else{
                if( $('header').hasClass('mini-header-mobile') ){
                    var topheight = $('.top-header-area').outerHeight();
                }
            }
            if( $('#wpadminbar').length > 0 ){
                admin_bar_header_height = topheight + admin_bar_height;
            }else{
                admin_bar_height = 0;
                admin_bar_header_height = topheight;
            }
        }else{
            if( !$('header').hasClass('no-sticky-mini-header') ){
                if ( $(window).width() > 767 ) {
                    topheight = $('.top-header-area').outerHeight();
                }
            }
            if( $(window).width() < 767 && $('header').hasClass('mini-header-mobile') ){
                var topheight = $('.top-header-area').outerHeight();
            }
            if( $('#wpadminbar').length > 0 && !$('body').hasClass('vc_editor') ){
                admin_bar_header_height = admin_bar_height + topheight;
            }else{
                admin_bar_height = 0;
                admin_bar_header_height = topheight;
            }
        }
        $('.navbar').css('cssText', 'top: ' + admin_bar_header_height + 'px !important;');

        if( $( '.top-header-area' ).length > 0 ){
            $('.top-header-area').css('cssText', 'margin-top: ' + admin_bar_height + 'px !important;');
        }

        var header_height = $('section:first').attr('data-nav-default-height');
        if( typeof header_height !== typeof undefined && header_height !== false ) {
            $('section:first').css({ 'margin-top' : header_height + 'px'});
        }
    }
    /*==============================================================
       margin-top for first section. END CODE
    =============================================================*/

})( jQuery );