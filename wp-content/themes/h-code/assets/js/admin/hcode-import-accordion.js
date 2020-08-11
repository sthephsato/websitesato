(function( $ ) {
    'use strict';

    /* custom tab jquery*/ 
    $(window).load(function() {

        $( '.hcode-admin-tab-slidingdiv' ).css( 'display', 'none' );
        
        $( '.hcode-admin-tabs > .hcode-admin-title' ).click(function() {
            $( '.hcode-admin-tab-slidingdiv' ).slideUp();
            $( '.hcode-admin-tabs > .hcode-admin-title' ).find( '.el-icon-minus' ).removeClass( 'el-icon-minus' ).addClass( 'el-icon-plus' );
            $( '.hcode-admin-title' ).removeClass( 'active' );

            if( $(this).next( '.hcode-admin-tab-slidingdiv' ).css( 'display' ) == 'none' ) {
                $(this).next( '.hcode-admin-tab-slidingdiv' ).slideDown( '500' ).css( 'display', 'block' );
                $(this).addClass( 'active' );
                $(this).find( '.el-icon-plus' ).removeClass( 'el-icon-plus' );
                $(this).find( '.hcode-icon' ).addClass( 'el-icon-minus' );
            } else {
                $(this).removeClass( 'active' );
                $(this).next( '.hcode-admin-tab-slidingdiv' ).slideUp( '500' );
                $(this).find( '.el-icon-minus' ).removeClass( 'el-icon-minus' );
                $(this).find( '.hcode-icon' ).addClass( 'el-icon-plus' );
            }

            $.redux.initFields();

        });
    });

    /* Click event for single layout */
    $( '.single-layout-panel' ).on( 'click', function() {

        if( $( this ).attr( 'disabled' ) ){
            return false;
        }
        
        var importSingleParent = $( this ).parents( '.import-content' ).find('.single-layout-wrapper');

        if( importSingleParent.is( ':hidden' ) ) {
            $( '.hcode-import-button' ).attr( 'disabled', true );
            $( this ).attr( 'disabled', false );
            $( this ).addClass( 'active' );
            importSingleParent.slideDown( 'slow' );
        } else {
            importSingleParent.slideUp();
            $( this ).removeClass( 'active' );
            $( '.hcode-import-button' ).attr( 'disabled', false );
        }

    });
   
    /* Click event for contact form */
    $( '.contact-form-single-click-import' ).on( 'click', function() {
        
        if( $( this ).attr( 'disabled' ) ){
            return false;
        }

        var importContactFormParent = $( this ).parent().parent().find('.contact-form-wrapper');
        if( importContactFormParent.is( ":hidden" ) ) {
            $( '.hcode-import-button' ).attr( 'disabled', true );
            $( this ).attr( 'disabled', false );
            $( this ).addClass( 'active' );
            importContactFormParent.slideDown( "slow" );
        } else {
            importContactFormParent.slideUp();
            $( this ).removeClass( 'active' );
            $( '.hcode-import-button' ).attr( 'disabled', false );
        }

    });

    $( '.single-layout-wrapper select, .contact-form-wrapper select' ).on( 'change', function(e) {
        e.stopPropagation();
    });
    

    var stop_ajax_request = false;
    var ajax_call_count = 0;
    var import_completed = false;
    var ajax_import_error = false;
    var import_full_single_layout = false;

    // Ajax hcode log function to show messages
    var hcode_log = function(msg) {
        $('.import-ajax-message').append(msg);
        $('.import-ajax-message').animate({"scrollTop": $('.import-ajax-message')[0].scrollHeight}, "fast");
    }

    var refresh_ajax_call_to_import_log = function() {
        
        ajax_call_count++;

        if (stop_ajax_request) {
            return;
        }
        
        // Stop Ajax clall After 700Sec.
        if (ajax_call_count > 700) {
            hcode_log('Import doesn\'t respond.');
            return;
        }
        
        // Ajax For Refresh Log
        $.ajax({
            url: ajaxurl,
            data: {
                action : 'hcode_refresh_import_log'
            },
            success:function(data) {
                
                if (data.search("ERROR") != -1) {
                    ajax_import_error = true;
                }
                
                $('.import-ajax-message').html(data);
                $('.import-ajax-message').animate({"scrollTop": $('.import-ajax-message')[0].scrollHeight}, "fast");
                
                // Add Error Message In Log
                if (ajax_import_error) {
                    stop_ajax_request = true;
                    hcode_log('Import error!');
                    return;
                }

                // Add Completed Message In Log
                if (import_completed) {
                    stop_ajax_request = true;
                    hcode_log('<p>Import Done.</p>');
                    if( import_full_single_layout ) {
                        window.location.href = window.location.href + "&show-message=true";
                    } else {
                        window.location.href = window.location.href;
                    }
                    return;
                }
            },
            error: function(errorThrown) {
                console.log(errorThrown);
            }
        }).done( function() { 
            
           setTimeout( refresh_ajax_call_to_import_log , 1000)

        } );
    }

    $( '.hcode-demo-import' ).on( 'click', function(e) {
        e.preventDefault();

        /* Return false if current element has disable attribute */
        if( $( this ).attr( 'disabled' ) ){
            return false;
        }

        /* Add disable attribute in all element to block import click */
        $( this ).parents( '.import-content' ).find( '.hcode-import-button' ).attr( 'disabled', true ); 

        var setupKey = $( this ).attr( 'data-demo-import' );

        if( setupKey == 'import-single' ) {
            var importSingles = [];

            $( this ).parents( '.single-layout-wrapper' ).find( ':selected' ).each( function() {
                importSingles.push( $(this).val() );
            });
        }

        if( setupKey == 'contact-form' ) {
            var importSingles = [];

            $( this ).parents( '.contact-form-wrapper' ).find( ':selected' ).each( function() {
                importSingles.push( $(this).val() );
            });

        }

        if( ( setupKey == 'import-single' || setupKey == 'contact-form' ) && importSingles.length === 0 ) {

            $( '.import-content' ).find( '.active' ).attr( 'disabled', false );

            alert( hcode_import_messages.no_single_layout );
            return false;
        }

        var import_messages = $( '.import-ajax-message' );

        import_messages.empty();
        
        var message = '';
        if( setupKey == 'import-single' ) {
            message = confirm( hcode_import_messages.single_import_conformation );
        }
        if( setupKey == 'settings' ) {
            message = confirm( hcode_import_messages.themesetting_import_conformation );
        }
        if( setupKey == 'menu' ) {
            message = confirm( hcode_import_messages.menu_import_conformation );
        }
        if( setupKey == 'widgets' ) {
            message = confirm( hcode_import_messages.widget_import_conformation );
        }
        if( setupKey == 'rev-slider' ) {
            message = confirm( hcode_import_messages.slider_import_conformation );
        }
        if( setupKey == 'contact-form' ) {
            message = confirm( hcode_import_messages.contact_form_import_conformation );
        }
        if( setupKey == 'delete-demo-media' ) {
            message = confirm( hcode_import_messages.media_import_conformation );
        }
        if( setupKey == 'full' ) {
            message = confirm( hcode_import_messages.full_import_conformation );
        }

        if( message == true ) {

            $( '.demo-show-message' ).hide();
            import_messages.show();
           
            var data = {
                action: 'hcode_import_sample_data',
                setup_key: setupKey,
                import_options: importSingles
            };

            $( '.hcode-importer-notice' ).hide();

            var request = $.ajax({
              url: ajaxurl,
              type: "POST",
              data: data
            });
            request.success(function(msg) {
                import_completed = true;
                if( setupKey == 'full' || setupKey == 'import-single' || setupKey == 'menu' ) {
                    import_full_single_layout = true;
                }
                $( '.hcode-import-button' ).attr( 'disabled', false );
                $( '.hcode-import-data-popup' ).hide();
               
            });

            request.fail(function(jqXHR, textStatus) {
                alert( 'Request failed: ' + textStatus );
                $( '.hcode-import' ).attr( 'disabled', false );
            });
            
            setTimeout(function(){

                $( 'html, body' ).animate({
                    scrollTop: $( '.import-ajax-message' ).offset().top - 50
                }, 2000);

            }, 1000)
            setTimeout( refresh_ajax_call_to_import_log , 1000);
        } else {
            $( '.hcode-import-button' ).attr( 'disabled', false );
        }
    });
       
})( jQuery );