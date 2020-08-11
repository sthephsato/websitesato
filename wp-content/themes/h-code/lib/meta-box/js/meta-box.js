$( document ).ready( function(){
	"use strict";
	// Check on load for selected tab when user come before if not it show first one active
	if( $.cookie( 'hcode_metabox_active_id_' + $( '#post_ID' ).val() ) ) {
		var active_class = $.cookie('hcode_metabox_active_id_' + $('#post_ID').val());

		$('#hcode_admin_options').find('.hcode_meta_box_tabs li').removeClass('active');
		$('#hcode_admin_options').find('.hcode_meta_box_tab').removeClass('active').hide();

		$('.'+active_class).addClass('active').fadeIn();
		$('#hcode_admin_options').find('#'+active_class).addClass('active').fadeIn();

	} else {
		$('.hcode_meta_box_tabs li:first-child').addClass('active');
		$('.hcode_meta_box_tab_content .hcode_meta_box_tab:first').addClass('active').fadeIn();
	}
	$('.hcode_meta_box_tabs li a').click(function(e) {
		e.preventDefault();

		var tab_click_id = $(this).parent().attr('class').split(' ')[0];
		var tab_main_div = $(this).parents('#hcode_admin_options');

		$.cookie('hcode_metabox_active_id_' + $('#post_ID').val(), tab_click_id, { expires: 7 });
		
		tab_main_div.find('.hcode_meta_box_tabs li').removeClass('active');
		tab_main_div.find('.hcode_meta_box_tab').removeClass('active').hide();

		$(this).parent().addClass('active').fadeIn();
		tab_main_div.find('#'+tab_click_id).addClass('active').fadeIn();

	});

	/* Metabox dependance of fields */
	
    $(".hcode_select_parent").change(function () {
	    var str_selected = $(this).find("option:selected").val();
	    var tab_active_status_main = $(this).parents('#hcode_admin_options');
	    $('.hide_dependent').find('input[type="hidden"]').val('0');
		tab_active_status_main.find('.hide_dependent').addClass('hide_dependency');

		if (tab_active_status_main.find('.hide_dependency').hasClass(str_selected+'_single')){
			tab_active_status_main.find('.'+str_selected+'_single').removeClass('hide_dependency');
			tab_active_status_main.find('.'+str_selected+'_single').find('input[type="hidden"]').val('1');
		}
		
		/* Special case for Both sidebar*/ 
		if(str_selected == 'hcode_layout_both_sidebar'){
			$('.hcode_layout_left_sidebar_single').removeClass('hide_dependency');
			$('.hcode_layout_left_sidebar_single').find('input[type="hidden"]').val('1');
			$('.hcode_layout_right_sidebar_single').removeClass('hide_dependency');
			$('.hcode_layout_right_sidebar_single').find('input[type="hidden"]').val('1');
		}
		
	});

    /* Dependency */
    $('.description_box, .separator_box').each(function(){
    	if( $(this).attr('data-element') && $(this).attr('data-value') ){
    		var data_val = $(this).attr('data-value');
    		var data_val_arr = data_val.split(',');
    		var data_element = $(this).attr('data-element');
    		var current = $(this);
    		$(document).on('change', '#'+$(this).attr('data-element'), function () {
    			var val = $(this).val();
    			if( $.inArray( val, data_val_arr ) !== -1 ){
    				$(current).removeClass('hidden');
    			}else{
    				$(current).addClass('hidden');
    			}
    		});

    		if( $.inArray( $('#'+data_element).val(), data_val_arr ) !== -1 ){
    			$(current).removeClass('hidden');
    		}else{
    			$(current).addClass('hidden');
    		}
    	}
    });
    /* End Dependency */

    /* Start Reset */   
    jQuery('.hcode-reset-section, .hcode-reset-section-all').click(function (event) {
    	if( $(this).hasClass('hcode-reset-section-all') ){
    		var reset_meta_message = hcode_admin_meta_box.reset_all_meta_message;
    	}else{
	    	var reset_meta_message = hcode_admin_meta_box.reset_meta_message;
	    	var reset_section_name = $(this).attr('data-reset-section');
    	}
    	reset_meta_message = reset_meta_message.replace(/###|_/g, reset_section_name);		
		var reset_confirm = confirm( reset_meta_message );
		if( reset_confirm ) {
	    	var parent = $(this).parent();
		    $( parent.find('.description_box, .separator_box')).each(function(){
		    	$(this).find('select option').removeAttr('selected');	  
		    	$(this).find('input[type="text"]').attr("value", "");
		    	$(this).find('input[type="hidden"]').val('');
		    	$(this).find('img').attr('src','');
		    	if( $(this).attr('data-element') && $(this).attr('data-value') ){
		    		var data_val = $(this).attr('data-value');
		    		var data_val_arr = data_val.split(',');
		    		var data_element = $(this).attr('data-element');
		    		var current = $(this);		    		
		    		$('#'+$(this).attr('data-element')).trigger('change');
		    		$(document).on('change', '#'+$(this).attr('data-element'), function () {
		    			var val = $(this).val();
		    			if( $.inArray( val, data_val_arr ) !== -1 ){
		    				$(current).removeClass('hidden');
		    			}else{
		    				$(current).addClass('hidden');
		    			}
		    		});
		    		if( $.inArray( $('#'+data_element).val(), data_val_arr ) !== -1 ){
		    			$(current).removeClass('hidden');
		    		}else{
		    			$(current).addClass('hidden');
		    		}
		    	}
		    });
		}
    });

    /* End Reset */

    var link_color = $( '.hcode-color-picker' );
    link_color.each( function (){
    	$(this).alphaColorPicker();
    });

	/* Metabox Image Upload Button Click*/

	$( '.hcode_upload_button' ).click( function( event ) {
        var file_frame;
	  	var button = $( this );

	    var button_parent = $( this ).parent();
		var id = button.attr( 'id' ).replace( '_button', '' );
	    event.preventDefault();

	    // If the media frame already exists, reopen it.
	    if ( file_frame ) {
	    	file_frame.open();
	      	return;
	    }

	    // Create the media frame.
	    file_frame = wp.media.frames.file_frame = wp.media({
	    	title: $( this ).data( 'popup-title' ),
	      	button: {
	        	text: $( this ).data( 'popup-button-title' ),
	      	},
	      	multiple: false
	    });

	    // When an image is selected, run a callback.
	    file_frame.on( 'select', function() {
	      	// We set multiple to false so only get one image from the uploader
	    	var full_attachment = file_frame.state().get('selection').first().toJSON();

	      	var attachment = file_frame.state().get('selection').first();

	      	var thumburl = attachment.attributes.sizes.thumbnail;
	      	var thumb_hidden = button_parent.find('.upload_field').attr('name');

	      	if ( thumburl || full_attachment ) {
				button_parent.find( "#"+id ).val( full_attachment.url );
				button_parent.find( "."+thumb_hidden+"_thumb" ).val( full_attachment.url );
				
				button_parent.find( ".upload_image_screenshort" ).attr( "src", full_attachment.url );
				button_parent.find( ".upload_image_screenshort" ).slideDown();
			}
	    });

	    // Finally, open the modal
	    file_frame.open();
	});
	
	// Remove button function to remove attach image and hide screenshort Div.
	$('.hcode_remove_button').click(function () {
		var remove_parent = $(this).parent();
		remove_parent.find('.upload_field').val('');
		remove_parent.find('input[type="hidden"]').val('');
		remove_parent.find('.upload_image_screenshort').slideUp();
	});

	// On page load add all image url to show in screenshort.
	$('.upload_field').each(function(){
		if($(this).val()){
			$(this).parent().find('.upload_image_screenshort').attr("src", $(this).parent().find('input[type="hidden"]').val());
		}else{
			$(this).parent().find('.upload_image_screenshort').hide();
		}
	});
	if($('.post-type-portfolio #post-format-0').is(":checked")){
		if($("#hcode_hidden_val_select_link").val() == '1'){
			$('.post-type-portfolio #post-format-link').prop('checked', true);
		}else if($("#hcode_hidden_val_select_gallery").val() == '1'){
			$('.post-type-portfolio #post-format-gallery').prop('checked', true);
		}else if($("#hcode_hidden_val_select_video").val() == '1'){
			$('.post-type-portfolio #post-format-video').prop('checked', true);
		}else if($("#hcode_hidden_val_select_image").val() == '1'){
			$('.post-type-portfolio #post-format-image').prop('checked', true);
		}
	}


	/* H-Code V1.8 Add portfolio post format*/
	if( $( 'body' ).hasClass('post-type-portfolio') ) {
		var defaultPortfolioSelect = $('.post-type-portfolio input.post-format:checked').val();
		if( defaultPortfolioSelect == 0 ){
			defaultPortfolioSelect = 'standard';
		}
		$( '#hcode_portfolio_post_type_single' ).val( defaultPortfolioSelect );
		$( '.post-type-portfolio').on( 'click', '.post-format', function() {
			var clickVal = $(this).val();
			if( clickVal == 'video' || clickVal == 'gallery' || clickVal == 'link' || clickVal == 'image' ){
				$( '#hcode_portfolio_post_type_single' ).val( clickVal );
			} else {
				$( '#hcode_portfolio_post_type_single' ).val( 'standard' );
			}
		});
	}

	/* multiple image upload */

	$('.hcode_upload_button_multiple').click(function (event) {
        var file_frame;
	  	var button = $(this);

	    var button_parent = $(this).parent();
		var id = button.attr('id').replace('_button', '');
	    event.preventDefault();
	    

	    // If the media frame already exists, reopen it.
	    if ( file_frame ) {
	      file_frame.open();
	      return;
	    }

	    // Create the media frame.
	    file_frame = wp.media.frames.file_frame = wp.media({
	      	title: $( this ).data( 'popup-title' ),
	      	button: {
	        	text: $( this ).data( 'popup-button-title' ),
	      	},
	      multiple: true  // Set to true to allow multiple files to be selected
	    });

	    // When an image is selected, run a callback.
	    file_frame.on( 'select', function() {

	      var thumb_hidden = button_parent.find('.upload_field').attr('name');
	     
			var selection = file_frame.state().get('selection');
				selection.map( function( attachment ) {
				var attachment = attachment.toJSON();
				button_parent.find('.multiple_images').append( '<div id="'+attachment.id+'"><img src="'+attachment.url+'" class="upload_image_screenshort_multiple" alt="" style="width:100px;"/><a href="javascript:void(0)" class="remove">remove</a></div>' );
			});
	    });
	    // Finally, open the modal
	    file_frame.open();
	});

	$(".button-primary, #save-action #save-post").on('click',function(){
		var pr_div;
		$('.multiple_images').each(function(){
			if($(this).children().length > 0){
				var attach_id = [];
				var pr_div = $(this).parent();
				$(this).children('div').each(function(){
						attach_id.push($(this).attr('id'));						
				});
				
				pr_div.find('.upload_field').val(attach_id);
			}else{
				$(this).parent().find('.upload_field').val('');
			}
		});		
	});

	$(".multiple_images").on('click','.remove', function() {
		$(this).parent().slideUp();
		$(this).parent().remove();
	});

	/* multiple image upload End */


	/*==============================================================*/
	// Post Format Meta Start
	/*==============================================================*/
	function post_format_selection_options() {
			
			//Hide Link Format in Post type
			$('body.post-type-post #post-format-link, body.post-type-post .post-format-link').hide();
			$('body.post-type-portfolio #post-format-quote, body.post-type-portfolio .post-format-quote').hide();
			$('body.post-type-portfolio .post-format-quote').next('br').hide();
			
			$('body.post-type-post #hcode_admin_options_single').hide();

	        if ($('#post-format-gallery').is(':checked')) {
	        	$('body.post-type-post #hcode_admin_options_single').show();
	            $('.hcode_gallery_single_box').fadeIn();
	            $('.hcode_lightbox_image_single_box').fadeIn();
	            $('.hcode_quote_single_box').hide();
	            $('.hcode_link_type_single_box').hide();
	            $('.hcode_link_target_single_box').hide();
	            $('.hcode_link_single_box').hide();
	            $('.hcode_video_mp4_single_box').hide();
	            $('.hcode_video_ogg_single_box').hide();
	            $('.hcode_video_webm_single_box').hide();
	            $('.hcode_video_single_box').hide();
	            $('.hcode_video_type_single_box').hide();
	            $('.hcode_enable_mute_single_box').hide();
	            $('.hcode_enable_loop_single_box').hide();
	            $('.hcode_enable_autoplay_single_box').hide();
	            $('.hcode_enable_controls_single_box').hide();
	            $('.hcode_image_single_box').hide();
	            $('.hcode_featured_image_single_box').fadeIn();
	            $('.hcode_subtitle_single_box').fadeIn();
	            $('.hcode_show_lightbox_popup_single_box').hide();
	            
	        } else if ($('#post-format-video').is(':checked')) {
	        	$('body.post-type-post #hcode_admin_options_single').show();
	            $('.hcode_gallery_single_box').hide();
	            $('.hcode_lightbox_image_single_box').hide();
	            $('.hcode_quote_single_box').hide();
	            $('.hcode_link_type_single_box').hide();
	            $('.hcode_link_target_single_box').hide();
	            $('.hcode_link_single_box').hide();
	            $('.hcode_video_mp4_single_box').fadeIn();
	            $('.hcode_video_ogg_single_box').fadeIn();
	            $('.hcode_video_webm_single_box').fadeIn();
	            $('.hcode_video_single_box').fadeIn();
	            $('.hcode_video_type_single_box').fadeIn();
	            $('.hcode_enable_mute_single_box').fadeIn();
	            $('.hcode_enable_loop_single_box').fadeIn();
	            $('.hcode_enable_autoplay_single_box').fadeIn();
	            $('.hcode_enable_controls_single_box').fadeIn();
	            $('.hcode_image_single_box').hide();
	            $('.hcode_featured_image_single_box').fadeIn();
	            $('.hcode_subtitle_single_box').fadeIn();
	            $('.hcode_show_lightbox_popup_single_box').fadeIn();
	            post_format_video_selection();

	        }else if ($('#post-format-quote').is(':checked')) {
	        	$('body.post-type-post #hcode_admin_options_single').show();
	            $('.hcode_gallery_single_box').hide();
	            $('.hcode_lightbox_image_single_box').hide();
	            $('.hcode_quote_single_box').fadeIn();
	            $('.hcode_link_type_single_box').hide();
	            $('.hcode_link_target_single_box').hide();
	            $('.hcode_link_single_box').hide();
	            $('.hcode_video_mp4_single_box').hide();
	            $('.hcode_video_ogg_single_box').hide();
	            $('.hcode_video_webm_single_box').hide();
	            $('.hcode_video_single_box').hide();
	            $('.hcode_video_type_single_box').hide();
	            $('.hcode_enable_mute_single_box').hide();
	            $('.hcode_enable_loop_single_box').hide();
	            $('.hcode_enable_autoplay_single_box').hide();
	            $('.hcode_enable_controls_single_box').hide();
	            $('.hcode_image_single_box').hide();
	            $('.hcode_featured_image_single_box').fadeIn();
	            $('.hcode_subtitle_single_box').fadeIn();
	            $('.hcode_show_lightbox_popup_single_box').hide();
	            
	        } else if ($('#post-format-link').is(':checked')) {
	        	$('body.post-type-post #hcode_admin_options_single').show();
	            $('.hcode_gallery_single_box').hide();
	            $('.hcode_lightbox_image_single_box').hide();
	            $('.hcode_quote_single_box').hide();
	            $('.hcode_link_type_single_box').fadeIn();
	            $('.hcode_link_target_single_box').fadeIn();
	            $('.hcode_link_single_box').fadeIn();
	            $('.hcode_video_mp4_single_box').hide();
	            $('.hcode_video_ogg_single_box').hide();
	            $('.hcode_video_webm_single_box').hide();
	            $('.hcode_video_single_box').hide();
	            $('.hcode_video_type_single_box').hide();
	            $('.hcode_enable_mute_single_box').hide();
	            $('.hcode_enable_loop_single_box').hide();
	            $('.hcode_enable_autoplay_single_box').hide();
	            $('.hcode_enable_controls_single_box').hide();
	            $('.hcode_image_single_box').hide();
	            $('.hcode_featured_image_single_box').fadeIn();
	            $('.hcode_subtitle_single_box').fadeIn();
	            $('.hcode_show_lightbox_popup_single_box').hide();
	            
	        }else if ($('#post-format-image').is(':checked')) {
	        	$('body.post-type-post #hcode_admin_options_single').show();
	            $('.hcode_gallery_single_box').hide();
	            $('.hcode_lightbox_image_single_box').hide();
	            $('.hcode_quote_single_box').hide();
	            $('.hcode_image_single_box').fadeIn();
	            $('.hcode_link_type_single_box').hide();
	            $('.hcode_link_target_single_box').hide();
	            $('.hcode_link_single_box').hide();
	            $('.hcode_video_mp4_single_box').hide();
	            $('.hcode_video_ogg_single_box').hide();
	            $('.hcode_video_webm_single_box').hide();
	            $('.hcode_video_single_box').hide();
	            $('.hcode_video_type_single_box').hide();
	            $('.hcode_enable_mute_single_box').hide();
	            $('.hcode_enable_loop_single_box').hide();
	            $('.hcode_enable_autoplay_single_box').hide();
	            $('.hcode_enable_controls_single_box').hide();
	            $('.hcode_featured_image_single_box').hide();
	            $('.hcode_subtitle_single_box').fadeIn();
	            $('.hcode_show_lightbox_popup_single_box').hide();
	            
	        }else {
	        	$('body.post-type-post #hcode_admin_options_single').hide();
	            $('.hcode_gallery_single_box').hide();
	            $('.hcode_lightbox_image_single_box').hide();
	            $('.hcode_quote_single_box').hide();
	            $('.hcode_link_type_single_box').hide();
	            $('.hcode_link_target_single_box').hide();
	            $('.hcode_link_single_box').hide();
	            $('.hcode_video_mp4_single_box').hide();
	            $('.hcode_video_ogg_single_box').hide();
	            $('.hcode_video_webm_single_box').hide();
	            $('.hcode_video_single_box').hide();
	            $('.hcode_video_type_single_box').hide();
	            $('.hcode_enable_mute_single_box').hide();
	            $('.hcode_enable_loop_single_box').hide();
	            $('.hcode_enable_autoplay_single_box').hide();
	            $('.hcode_enable_controls_single_box').hide();
	            $('.hcode_image_single_box').hide();
	            $('.hcode_featured_image_single_box').hide();
	            $('.hcode_subtitle_single_box').fadeIn();
	            $('.hcode_show_lightbox_popup_single_box').hide();

	        }
	    }
	    post_format_selection_options();

	    var select_type = $('#post-formats-select input');
	    

	    $(this).change(function() {
	        post_format_selection_options();
	    });

	    // Remove unselected type meta data for post.
	    post_submit();
	    function post_submit(){
	        $('#publish').click(function(){
	        	if ($('#post-format-gallery').is(':checked')) {
		            $('.hcode_meta_box_tab_content_single .hcode_quote_single_box').find("textarea").val('');
		            $('.hcode_meta_box_tab_content_single .hcode_link_type_single_box').find("select option").val('');
		            $('.hcode_meta_box_tab_content_single .hcode_link_target_single_box').find("select option").val('');
		            $('.hcode_meta_box_tab_content_single .hcode_link_single_box').find("input:first-child").val('');
		            $('.hcode_meta_box_tab_content_single .hcode_video_mp4_single_box').find("input:first-child").val('');
		            $('.hcode_meta_box_tab_content_single .hcode_video_ogg_single_box').find("input:first-child").val('');
		            $('.hcode_meta_box_tab_content_single .hcode_video_webm_single_box').find("input:first-child").val('');
		            $('.hcode_meta_box_tab_content_single .hcode_video_single_box').find("input:first-child").val('');
		            $('.hcode_meta_box_tab_content_single .hcode_video_type_single_box').find("select option").val('');
		            $('.hcode_meta_box_tab_content_single .hcode_enable_mute_single_box').find("select option").val('');
		            $('.hcode_meta_box_tab_content_single .hcode_enable_loop_single_box').find("select option").val('');
		            $('.hcode_meta_box_tab_content_single .hcode_enable_autoplay_single_box').find("select option").val('');
		            $('.hcode_meta_box_tab_content_single .hcode_enable_controls_single_box').find("select option").val('');
		            $('.hcode_meta_box_tab_content_single .hcode_image_single_box').find("select option").val('');
		            $('.hcode_meta_box_tab_content_single .hcode_show_lightbox_popup_single_box').find("select option").val('');

	        	}if ($('#post-format-video').is(':checked')) {
		            $('.hcode_meta_box_tab_content_single .upload_field').val('');
		            $('.hcode_meta_box_tab_content_single .hcode_quote_single_box').find("textarea").val('');
		            $('.hcode_meta_box_tab_content_single .hcode_link_type_single_box').find("select option").val('');
		            $('.hcode_meta_box_tab_content_single .hcode_link_target_single_box').find("select option").val('');
		            $('.hcode_meta_box_tab_content_single .hcode_link_single_box').find("input:first-child").val('');
		            $('.hcode_meta_box_tab_content_single .hcode_image_single_box').find("select option").val('');
		            $('.hcode_meta_box_tab_content_single .hcode_lightbox_image_single_box').find("select option").val('');

	        	}if ($('#post-format-quote').is(':checked')) {
		            $('.hcode_meta_box_tab_content_single .upload_field').val('');
		            $('.hcode_meta_box_tab_content_single .hcode_link_type_single_box').find("select option").val('');
		            $('.hcode_meta_box_tab_content_single .hcode_link_target_single_box').find("select option").val('');
		            $('.hcode_meta_box_tab_content_single .hcode_link_single_box').find("input:first-child").val('');
		            $('.hcode_meta_box_tab_content_single .hcode_video_mp4_single_box').find("input:first-child").val('');
		            $('.hcode_meta_box_tab_content_single .hcode_video_ogg_single_box').find("input:first-child").val('');
		            $('.hcode_meta_box_tab_content_single .hcode_video_webm_single_box').find("input:first-child").val('');
		            $('.hcode_meta_box_tab_content_single .hcode_video_single_box').find("input:first-child").val('');
		            $('.hcode_meta_box_tab_content_single .hcode_video_type_single_box').find("select option").val('');
		            $('.hcode_meta_box_tab_content_single .hcode_enable_mute_single_box').find("select option").val('');
		            $('.hcode_meta_box_tab_content_single .hcode_enable_loop_single_box').find("select option").val('');
		            $('.hcode_meta_box_tab_content_single .hcode_enable_autoplay_single_box').find("select option").val('');
		            $('.hcode_meta_box_tab_content_single .hcode_enable_controls_single_box').find("select option").val('');
		            $('.hcode_meta_box_tab_content_single .hcode_image_single_box').find("select option").val('');
		            $('.hcode_meta_box_tab_content_single .hcode_lightbox_image_single_box').find("select option").val('');
		            
	            
	        	}if ($('#post-format-link').is(':checked')) {
		            $('.hcode_meta_box_tab_content_single .upload_field').val('');
		            $('.hcode_meta_box_tab_content_single .hcode_quote_single_box').find("textarea").val('');
		            $('.hcode_meta_box_tab_content_single .hcode_video_mp4_single_box').find("input:first-child").val('');
		            $('.hcode_meta_box_tab_content_single .hcode_video_ogg_single_box').find("input:first-child").val('');
		            $('.hcode_meta_box_tab_content_single .hcode_video_webm_single_box').find("input:first-child").val('');
		            $('.hcode_meta_box_tab_content_single .hcode_video_single_box').find("input:first-child").val('');
		            $('.hcode_meta_box_tab_content_single .hcode_video_type_single_box').find("select option").val('');
		            $('.hcode_meta_box_tab_content_single .hcode_enable_mute_single_box').find("select option").val('');
		            $('.hcode_meta_box_tab_content_single .hcode_enable_loop_single_box').find("select option").val('');
		            $('.hcode_meta_box_tab_content_single .hcode_enable_autoplay_single_box').find("select option").val('');
		            $('.hcode_meta_box_tab_content_single .hcode_enable_controls_single_box').find("select option").val('');
		            $('.hcode_meta_box_tab_content_single .hcode_image_single_box').find("select option").val('');
		            $('.hcode_meta_box_tab_content_single .hcode_lightbox_image_single_box').find("select option").val('');
		            $('.hcode_meta_box_tab_content_single .hcode_show_lightbox_popup_single_box').find("select option").val('');
	            
	        	}if ($('#post-format-image').is(':checked')) {
		            $('.hcode_meta_box_tab_content_single .upload_field').val('');
		            $('.hcode_meta_box_tab_content_single .hcode_quote_single_box').find("textarea").val('');
		            $('.hcode_meta_box_tab_content_single .hcode_link_type_single_box').find("select option").val('');
		            $('.hcode_meta_box_tab_content_single .hcode_link_target_single_box').find("select option").val('');
		            $('.hcode_meta_box_tab_content_single .hcode_link_single_box').find("input:first-child").val('');
		            $('.hcode_meta_box_tab_content_single .hcode_video_mp4_single_box').find("input:first-child").val('');
		            $('.hcode_meta_box_tab_content_single .hcode_video_ogg_single_box').find("input:first-child").val('');
		            $('.hcode_meta_box_tab_content_single .hcode_video_webm_single_box').find("input:first-child").val('');
		            $('.hcode_meta_box_tab_content_single .hcode_video_single_box').find("input:first-child").val('');
		            $('.hcode_meta_box_tab_content_single .hcode_video_type_single_box').find("select option").val('');
		            $('.hcode_meta_box_tab_content_single .hcode_enable_mute_single_box').find("select option").val('');
		            $('.hcode_meta_box_tab_content_single .hcode_enable_loop_single_box').find("select option").val('');
		            $('.hcode_meta_box_tab_content_single .hcode_enable_autoplay_single_box').find("select option").val('');
		            $('.hcode_meta_box_tab_content_single .hcode_enable_controls_single_box').find("select option").val('');
		            $('.hcode_meta_box_tab_content_single .hcode_lightbox_image_single_box').find("select option").val('');
		            $('.hcode_meta_box_tab_content_single .hcode_featured_image_single_box').find("select option").val('');
		            $('.hcode_meta_box_tab_content_single .hcode_show_lightbox_popup_single_box').find("select option").val('');
	            
	        	}if ($('#post-format-0').is(':checked')) {
		            $('.hcode_meta_box_tab_content_single .upload_field').val('');
		            $('.hcode_meta_box_tab_content_single .hcode_quote_single_box').find("textarea").val('');
		            $('.hcode_meta_box_tab_content_single .hcode_link_type_single_box').find("select option").val('');
		            $('.hcode_meta_box_tab_content_single .hcode_link_target_single_box').find("select option").val('');
		            $('.hcode_meta_box_tab_content_single .hcode_link_single_box').find("input:first-child").val('');
		            $('.hcode_meta_box_tab_content_single .hcode_video_mp4_single_box').find("input:first-child").val('');
		            $('.hcode_meta_box_tab_content_single .hcode_video_ogg_single_box').find("input:first-child").val('');
		            $('.hcode_meta_box_tab_content_single .hcode_video_webm_single_box').find("input:first-child").val('');
		            $('.hcode_meta_box_tab_content_single .hcode_video_single_box').find("input:first-child").val('');
		            $('.hcode_meta_box_tab_content_single .hcode_video_type_single_box').find("select option").val('');
		            $('.hcode_meta_box_tab_content_single .hcode_enable_mute_single_box').find("select option").val('');
		            $('.hcode_meta_box_tab_content_single .hcode_enable_loop_single_box').find("select option").val('');
		            $('.hcode_meta_box_tab_content_single .hcode_enable_autoplay_single_box').find("select option").val('');
		            $('.hcode_meta_box_tab_content_single .hcode_enable_controls_single_box').find("select option").val('');
		            $('.hcode_meta_box_tab_content_single .hcode_image_single_box').find("select option").val('');
		            $('.hcode_meta_box_tab_content_single .hcode_lightbox_image_single_box').find("select option").val('');
		            $('.hcode_meta_box_tab_content_single .hcode_featured_image_single_box').find("select option").val('');
		            $('.hcode_meta_box_tab_content_single .hcode_enable_post_title_single_box').find("select option").val('');
		            $('.hcode_meta_box_tab_content_single .hcode_show_lightbox_popup_single_box').find("select option").val('');
	        	}
	        });
	    }
	/*==============================================================*/
	// Post Format Meta End
	/*==============================================================*/

	/*==============================================================*/
	// Video Post Format Meta End
	/*==============================================================*/

	$('#hcode_video_type_single').change(function() {
		post_format_video_selection();
	});

	function post_format_video_selection(){
		if( $('#hcode_video_type_single').val() == 'self' && $('#post-format-video').is(':checked') ){
			$(".hcode_enable_mute_single_box").addClass('show_div').removeClass('hide_div');
			$(".hcode_enable_loop_single_box").addClass('show_div').removeClass('hide_div');
			$(".hcode_enable_autoplay_single_box").addClass('show_div').removeClass('hide_div');
			$(".hcode_enable_controls_single_box").addClass('show_div').removeClass('hide_div');
			$(".hcode_video_mp4_single_box").addClass('show_div').removeClass('hide_div');
			$(".hcode_video_ogg_single_box").addClass('show_div').removeClass('hide_div');
			$(".hcode_video_webm_single_box").addClass('show_div').removeClass('hide_div');
			$(".hcode_video_single_box").removeClass('show_div').addClass('hide_div');
		} else if( $('#hcode_video_type_single').val() == 'external' && $('#post-format-video').is(':checked') ){
			$(".hcode_enable_mute_single_box").removeClass('show_div').addClass('hide_div');
			$(".hcode_enable_loop_single_box").removeClass('show_div').addClass('hide_div');
			$(".hcode_enable_autoplay_single_box").removeClass('show_div').addClass('hide_div');
			$(".hcode_enable_controls_single_box").removeClass('show_div').addClass('hide_div');
			$(".hcode_video_mp4_single_box").removeClass('show_div').addClass('hide_div');
			$(".hcode_video_ogg_single_box").removeClass('show_div').addClass('hide_div');
			$(".hcode_video_webm_single_box").removeClass('show_div').addClass('hide_div');
			$(".hcode_video_single_box").addClass('show_div').removeClass('hide_div');
		} else {
			$(".hcode_enable_mute_single_box").removeClass('show_div').removeClass('hide_div');
			$(".hcode_enable_loop_single_box").removeClass('show_div').removeClass('hide_div');
			$(".hcode_enable_autoplay_single_box").removeClass('show_div').removeClass('hide_div');
			$(".hcode_enable_controls_single_box").removeClass('show_div').removeClass('hide_div');
			$(".hcode_video_mp4_single_box").removeClass('show_div').removeClass('hide_div');
			$(".hcode_video_ogg_single_box").removeClass('show_div').removeClass('hide_div');
			$(".hcode_video_webm_single_box").removeClass('show_div').removeClass('hide_div');
			$(".hcode_video_single_box").removeClass('show_div').removeClass('hide_div');
		}
	}

	/*==============================================================*/
	// Video Post Format Meta End
	/*==============================================================*/
});
