/**
 * wppm.plugin.js
 * JavaScript functions required by the plugin
 *
 * @version 2.2.2
 */
jQuery(function ($) {

    'use strict';

    // Tabs
    $('.wppm-tabber').each(function () {
        var tabber = $(this),
            tabbed = $(this).find('.wppm-tabbed'),
            requestRunning = false;

        // Make first item active
        $(this).find('.wppm-tabs > li:first-child').addClass('ui-tabs-active');
        tabbed.addClass('hidden-tab');
        tabbed.eq(0).removeClass('hidden-tab');

        $(this).on('click', '.wppm-tabs > li > a', function (e) {
            e.preventDefault();
            var evt = window.document.createEvent('UIEvents'),
                id = $(this).attr('href'),
                btn = $(this),
                container = $(id).find('.to-render'),
                content = $(container).html();

            // Trigger a window resize event
            evt.initUIEvent('resize', true, false, window, 0);
            window.dispatchEvent(evt);

            if (container.length) {
                if (!$(btn).data('clicked')) {
                    $(id).addClass('wppm-loading');
                    if (requestRunning) { // don't do anything if an AJAX request is pending
                        return;
                    }
                    requestRunning = true;
                    $.ajax({
                        url: wppm_localize.ajax_url,
                        type: "post",
                        data: {
                            'action': 'wppm_tabs_action',
                            'wppm_tab_content': content
                        },
                        success: function (response) {
                            $(id).removeClass('wppm-loading').find('.rendered-content').hide().html(response).fadeIn();
                        },
                        complete: function () {
                            requestRunning = false;
                            $(btn).attr('data-clicked', 'true');
                            tabber.trigger('wppm_tab_loaded');
                        },
                        error: function (errorThrown) {
                            console.log(errorThrown);
                        }
                    });
                } else {
                    tabber.trigger('wppm_tab_loaded');
                }
            }

            // Tab interface
            $(this).parent().addClass('ui-tabs-active');
            $(this).parent().siblings().removeClass('ui-tabs-active');
            tabbed.not(id).addClass('hidden-tab');
            $(id).removeClass('hidden-tab');
        });
    });


    // Category submenu toggle
    function wppm_cat_dropdown() {
        $(document).on('click', 'a.wppm-cat-toggle', function (e) {
            e.preventDefault();
            var this_cat = $(this).parent().find('ul.submenu');
            $('.post-cats .cat-sub').not(this_cat).hide();
            this_cat.toggle();
            $(this).toggleClass('active-link');
            return false;
        });
    }

    wppm_cat_dropdown();

    $('.wppm-tabber,.wppm-ajax-posts').on('wppm_tab_loaded wppm_ajax_loaded', function () {
        wppm_cat_dropdown();
        wppm_owl_init();
        wppm_share_window();
        $('.wppm-grid.masonry-enabled, .wppm-portfolio.masonry-enabled').masonry('reloadItems');
    });

    // Close category submenus when clicking on body
    $(document).on('click', function () {
        $('.post-cats .cat-sub').hide();
        $('a.wppm-cat-toggle').removeClass('active-link');
    });

    // Stop propagation for various selectors
    $(document).on('click', 'a.wppm-cat-toggle,a.share-trigger', function (e) {
        e.stopPropagation();
    });

    function wppm_owl_init() {
        if ($.fn.owlCarousel) {
            var target = $(".product-carousel, .owl-wrap");
            if (target.length) {
                $(target).each(function () {
                    var slider = $(this).find(".products, .owl-carousel"),
                        params = $(this).data('params');

                    $(slider).owlCarousel({
                        items: parseInt(params.items),
                        loop: 'true' === params.loop ? true : false,
                        margin: parseInt(params.margin),
                        autoplay: 'true' === params.autoplay ? true : false,
                        autoplayTimeout: parseInt(params.timeout),
                        autoHeight: 'true' === params.autoheight ? true : false,
                        nav: 'true' === params.nav ? true : false,
                        dots: 'true' === params.dots ? true : false,
                        smartSpeed: parseInt(params.speed),
                        navText: false,
                        rtl: ($("body").is(".rtl")),
                        autoplayHoverPause: true,
                        animateIn: params.animatein,
                        animateOut: params.animateout,
                        stagePadding: params.stagepadding,

                        responsive: {
                            0: {
                                items: 1,
                                margin: (parseInt(params.items) == 1 ? 0 : parseInt(params.margin_mobile)),
                                dots: false
                            },
                            480: {
                                items: (parseInt(params.items) > 2 ? 2 : parseInt(params.items)),
                                margin: parseInt(params.margin_mobile),
                                dots: false
                            },
                            720: {
                                items: (parseInt(params.items) > 3 ? 3 : parseInt(params.items)),
                                margin: parseInt(params.margin_mobile),
                                dots: params.dots ? true : false
                            },
                            960: {
                                items: parseInt(params.items)
                            }
                        }
                    });
                });
            }
        }
    }

    function wppm_masonry_init() {
        // Masonry
        if ($.isFunction($.fn.masonry)) {
            $('.wppm-grid.masonry-enabled, .wppm-portfolio.masonry-enabled').masonry({
                itemSelector: 'article.hentry',
                isOriginLeft: !($('body').is('.rtl'))
            });
        }
    }

    $(document).on('ready', function () {
        wppm_owl_init();
    });

    $(window).load(function () {
        wppm_masonry_init();
    });

    /* Ajax next/prev links */
    function wppm_ajax_nav_links() {
        $('.wppm-ajax-posts').each(function () {
            var parent = $(this),
                requestRunning = false,
                pagenum = 1,
                params = $(this).data('params'),
                maxposts = $(this).data('maxposts'),
                cont = $(this),
                cont_id = cont.attr('id'),
                cont_height = 0,
                status_text = cont.find('span.nav-status').data('format') || '%current% of %total%',
                new_status,
                max_mod,
                max_div,
                maxpages,
                offset;

            // Set num if not exists
            if (!('num' in params)) {
                params.num = '6';
            }

            // Set offset if not exists
            if (!('offset' in params)) {
                params.offset = 0;
            }

            // Re calculate maxposts if there is an offset
            maxposts = maxposts - parseInt(params.offset);
            max_mod = parseInt(maxposts) % parseInt(params.num);
            max_div = parseInt(maxposts / params.num);
            maxpages = (0 === max_mod) ? max_div : max_div + 1;

            // Update nav status
            new_status = status_text.replace('%current%', pagenum).replace('%total%', maxpages);
            $(this).find('span.nav-status').text(status_text.replace('%current%', pagenum).replace('%total%', maxpages));

            // Ajax button click event
            cont.find('.wppm-ajax-nav,.wppm-ajax-loadmore').on('click', 'a.next-link,a.wppm-more-link', function (e) {
                e.preventDefault();

                var nav = $(this).parent(),
                    btn = $(this),
                    sc = '[wppm',
                    to_show = cont_id + '-sub-' + parseInt(pagenum + 1);

                $.each(params, function (index, value) {
                    sc += ' ' + index + '="' + value + '"';
                });

                offset = parseInt(params.offset) + parseInt(params.num) * pagenum;

                sc += ' offset="' + offset + '"]';

                if (pagenum > 1) {
                    $(this).parent().find('a.prev-link').removeClass('disabled');
                } else {
                    $(this).parent().find('a.prev-link').addClass('disabled');
                }

                if ((parseInt(params.num) * pagenum) >= maxposts) {
                    $(this).addClass('disabled');
                    return;
                }

                if (params) {
                    if (btn.is('.next-link')) {
                        cont.find('.wppm').removeClass('fade-in-top fade-out-half').addClass('fade-out-half');
                        cont.addClass('wppm-loading').css({
                            "min-height": cont_height
                        });
                    }
                    if (btn.is('.wppm-more-link')) {
                        $(btn).parent().addClass('wppm-loading');
                    }

                    if ($('#' + to_show).length) {
                        if (btn.is('.next-link')) {
                            cont.find('.wppm').removeClass('fade-in-top fade-out-half').addClass('fade-out-full');
                            cont.removeClass('wppm-loading');
                            $('#' + to_show).removeClass('fade-out-full').addClass('fade-in-top');
                            $(this).parent().find('a.prev-link').removeClass('disabled');
                            pagenum++;
                            cont.find('span.nav-status').text(status_text.replace('%current%', pagenum).replace('%total%', maxpages));
                        } else {
                            $('#' + to_show).removeClass('fade-out-full').addClass('fade-in-top');
                            $(btn).parent().removeClass('wppm-loading');
                        }
                        if ((parseInt(params.num) * pagenum) >= maxposts) {
                            $(btn).addClass('disabled');
                        }
                    } else {
                        if (requestRunning) { // don't do anything if an AJAX request is pending
                            return;
                        }

                        requestRunning = true;
                        $.ajax({
                            url: wppm_localize.ajax_url,
                            type: "post",

                            data: {
                                'action': 'wppm_ajaxnav_action',
                                'wppm_ajaxnav_content': sc
                            },

                            success: function (response) {
                                pagenum++;

                                cont.find('span.nav-status').text(status_text.replace('%current%', pagenum).replace('%total%', maxpages));
                                $(btn).parent().find('a.prev-link').removeClass('disabled');

                                if ((parseInt(params.num) * pagenum) >= maxposts) {
                                    $(btn).addClass('disabled');
                                }

                                if (btn.is('.next-link')) {
                                    cont.find('.wppm').addClass('fade-out-full');
                                    $(response).find('.wppm').attr('id', cont_id + '-sub-' + pagenum).insertBefore(nav).addClass('fade-in-top');
                                } else {
                                    $(response).find('.wppm').attr('id', cont_id + '-sub-' + pagenum).insertBefore(btn.parent()).addClass('fade-in-top');
                                }
                                parent.trigger('wppm_tab_loaded');
                                $(document).trigger('ready wppm_ajax_loaded');
                            },
                            complete: function () {
                                requestRunning = false;
                                if (btn.is('.next-link')) {
                                    cont.removeClass('wppm-loading');
                                } else {
                                    $(btn).parent().removeClass('wppm-loading');
                                }
                            },
                            error: function (errorThrown) {
                                console.log(errorThrown);
                            }
                        });
                    }
                }
            });

            cont.find('.wppm-ajax-nav').on('click', 'a.prev-link', function (e) {
                e.preventDefault();

                var to_show = cont_id + '-sub-' + parseInt(pagenum - 1);

                if ($('#' + to_show).length) {
                    cont.find('.wppm').removeClass('fade-in-top fade-out-half').addClass('fade-out-full');
                    $('#' + to_show).removeClass('fade-out-full').addClass('fade-in-top');
                    pagenum--;
                    cont.find('span.nav-status').text(status_text.replace('%current%', pagenum).replace('%total%', maxpages));
                    parent.trigger('wppm_tab_loaded');
                }

                if ((parseInt(params.num) * pagenum) <= maxposts) {
                    $(this).parent().find('a.next-link').removeClass('disabled');
                }

                if (pagenum <= 1) {
                    $(this).addClass('disabled');
                    return;
                }

            });
        });
    }

    wppm_ajax_nav_links();

    // News Ticker
    if ($.isFunction($.fn.marquee)) {
        $('.wppm-ticker').marquee({
            duration: $(this).data('duration'),
            gap: 0,
            delayBeforeStart: 0,
            direction: $('body').is('.rtl') ? 'right' : 'left',
            startVisible: true,
            duplicated: true,
            pauseOnHover: true,
            allowCss3Support: true
        });
    }

    // Social sharing overlay
    $(document).on("click", 'a.share-trigger', function (e) {
        e.preventDefault();
        var t = $(this).parent().find('ul.wppm-sharing'),
            panels = $('ul.wppm-sharing');
        $(t).toggleClass('card-active');
        $(panels).not(t).removeClass('card-active');
    });

    $(document).on("click", function () {
        $('ul.wppm-sharing').removeClass('card-active');
    });

    function wppm_share_window() {
        $('.wppm-sharing li:not(.no-popup) a').on('click', function (e) {
            e.preventDefault();
            var href = $(this).attr('href');
            window.open(href, '_blank', 'width=600,height=400,menubar=0,resizable=1,scrollbars=0,status=1', true);
        });
    }
    wppm_share_window();

    $('.wppm-get-sc').on('click', function () {
        alert($(this).data('val'));
    });
});