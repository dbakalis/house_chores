$(document).ready(function(){
    // init global variables
    var search_by_post_code = 1;

    // delete customer
    $(".deleteCustomer").click(function() {
        if(confirm('Είσαστε σίγουροι ότι θέλετε να προχωρήσετε σε διαγραφή;')) {
            var customerId = $(this).attr('customerid');

            if(customerId > 0){
                $.ajax({
                    url: "ajaxFunctions.php",
                    data: {values: 'deleteCustomer', customerId: customerId},
                    type: "POST", 
                    success: function(output){	
                        location.reload();
                    }
                });
            }

        }
    });

    /** EDIT CUSTOMER FORM */
    function disableCountyIdEnableName(){
        // clean the data
        $("#county_name_customer_edit_form").val('');

        // change which element is shown
        $("#county_id_customer_edit_form").addClass('d-none')
        $("#county_name_customer_edit_form").removeClass('d-none');
 
        // change which element is required
        $("#county_id_customer_edit_form").prop('required', false);
        $("#county_name_customer_edit_form").prop('required',true);
    }

    function enableCountyIdDisableName(){
        // clean the data
        $("#county_name_customer_edit_form").val('');
        
        // change which element is shown
        $("#county_id_customer_edit_form").removeClass('d-none');
        $("#county_name_customer_edit_form").addClass('d-none');

        // change which element is required
        $("#county_id_customer_edit_form").prop('required',true);
        $("#county_name_customer_edit_form").prop('required',false);
    }

    function disableCityIdEnableName(){
        // clean the data
        $("#city_name_customer_edit_form").val('');

        // change which element is shown
        $("#city_id_customer_edit_form").addClass('d-none');
        $("#city_name_customer_edit_form").removeClass('d-none');

        // change which element is required
        $("#city_id_customer_edit_form").prop('required', false);
        $("#city_name_customer_edit_form").prop('required',true);
    }

    function enableCityIdDisableName(){
        // clean the data
        $("#city_name_customer_edit_form").val('');
        
        // change which element is shown
        $("#city_id_customer_edit_form").removeClass('d-none');
        $("#city_name_customer_edit_form").addClass('d-none');

        // change which element is required
        $("#city_id_customer_edit_form").prop('required',true);
        $("#city_name_customer_edit_form").prop('required',false);
    }

    // on country change
    $("#country_id_customer_edit_form").change(function() {
        var country_id = $(this).val();

        if( (country_id != "") && (country_id > 0) ){
            $.ajax({
                url: "../../includes/ajaxFunctions/ajaxGlobalFunctions.php",
                data: {values: 'populateCountiesByCountryId', country_id: country_id},
                type: "POST", 
                success: function(output){
                    $("#postcode_customer_edit_form").val('');
                    $("#city_id_customer_edit_form").removeClass('is-invalid');

                    // reset the search case variable
                    search_by_post_code = 0;

                    if(output == "no_counties_found"){
                        disableCountyIdEnableName();
                        disableCityIdEnableName();

                        $("#county_vat_percentage_group").addClass('d-none');
                    }else{
                        enableCountyIdDisableName();
                        enableCityIdDisableName();

                        if(country_id == 83){
                            $("#county_vat_percentage").text('24%');
                            $("#county_vat_percentage_group").removeClass('d-none');
                        }else{
                            $("#county_vat_percentage_group").addClass('d-none');
                        }

                        // add content to the county_id_customer_edit_form (select tag)
                        $("#county_id_customer_edit_form").html(output)
                        $('#city_id_customer_edit_form option:not(:first)').remove();
                    }

                }
            });
        }
    });

    // on county change
    $("#county_id_customer_edit_form").change(function() {
        var county_id   = $(this).val();
        var tax_name    = $(this).find(':selected').data('taxname');

        if( (county_id != "") && (county_id > 0) ){
            $.ajax({
                url: "../../includes/ajaxFunctions/ajaxGlobalFunctions.php",
                data: {values: 'populateCitiesByCountyId', county_id: county_id},
                type: "POST", 
                success: function(output){
                    $("#postcode_customer_edit_form").val('');
                    $("#county_vat_percentage").text(tax_name)

                    // reset the search case variable
                    search_by_post_code = 0;
                    
                    if(output == "no_cities_found"){
                        disableCityIdEnableName();
                    }else{
                        enableCityIdDisableName();

                        // add content to the county_id_customer_edit_form (select tag)
                        $("#city_id_customer_edit_form").html(output)
                    }
                }
            });
        }
    });

    // on city change
    $("#city_id_customer_edit_form").change(function() {
        $(this).removeClass("is-invalid");
        
        if(search_by_post_code == 0){
            $("#postcode_customer_edit_form").val($(this).find(':selected').data('postcode'));
        }
    });

    // on postcode type
    $("#postcode_customer_edit_form").keyup(function() {
        var postcode_typed = $(this).val();

        setTimeout(function() {
            if( (postcode_typed != "") && (postcode_typed.length == 5) && (search_by_post_code == 1) ){
                $.ajax({
                    url: "../../includes/ajaxFunctions/ajaxGlobalFunctions.php",
                    data: {values: 'populateByPostalCode', postcode: postcode_typed},
                    type: "POST", 
                    success: function(output){
                        // set that we searched with postal code
                        search_by_post_code = 1;

                        if(output == "no_data"){
                            disableCountyIdEnableName();
                            disableCityIdEnableName();
							
							$("#county_vat_percentage_group").addClass('d-none');
                        }else{
                            enableCountyIdDisableName();
                            enableCityIdDisableName();
                            
                            // get outputed data through jquery json parser
                            var jsonInfo = jQuery.parseJSON(output);

                            // set country and county and clear the cities
                            $('#country_id_customer_edit_form option[value="'+jsonInfo["country_id"]+'"]').prop('selected', true);
                            $('#county_id_customer_edit_form option[value="'+jsonInfo["county_id"]+'"]').prop('selected', true);
                            $("#city_id_customer_edit_form").html('');
                            $("#county_vat_percentage").text(jsonInfo["taxName"]);

                            // then for each city found append an option
                            $.each(jsonInfo["cities"], function( index, value ) {
                                $('#city_id_customer_edit_form').append('<option value="'+value["city_id"]+'" data-postcode="'+value["postcodes"]+'">'+value["city"]+'</option>');
                            });

                            // if more than two (includes the "please select") cities exist then notify the user
                            if(jsonInfo["cities"].length > 2){
                                $("#city_id_customer_edit_form").addClass('is-invalid');
                            }else{
                                $("#city_id_customer_edit_form").removeClass('is-invalid');
                                $('#city_id_customer_edit_form option:last').prop('selected', true);
                            }
                        }

                    }
                });
            }
        }, 1000);
    });

    // on clear of postcode
    $("#postcode_customer_edit_form_clear").click(function() {
        // bring the selects back
        enableCountyIdDisableName();
        enableCityIdDisableName();
        
        // clear the fields
        $('#county_id_customer_edit_form option:first').prop('selected', true);
        $("#postcode_customer_edit_form").val('');
        $('#city_id_customer_edit_form option:not(:first)').remove();
        $('#city_id_customer_edit_form').removeClass("is-invalid");
        $("#county_vat_percentage").text('24%')

        // reset the search case variable
        search_by_post_code = 1;
    });

    /** EDIT CUSTOMER FORM - B2B MODULE */

    // on click of b2b send mail button
    $("#b2bSendMailBtn_customer_edit_form").click(function() {
        var mail_text       = $("#b2bSendMailText_customer_edit_form").val();
        var customer_email  = $("#email_customer_edit_form").val();

        // some checks if mail text and customer mail values are not empty and notify the user
        if( (mail_text == "") && (customer_email == "") ){
            $("#b2bSendMailText_customer_edit_form").addClass("is-invalid");
            $("#email_customer_edit_form").addClass("is-invalid");
        }else if(mail_text == ""){
            $("#b2bSendMailText_customer_edit_form").addClass("is-invalid");
            $("#email_customer_edit_form").removeClass("is-invalid");
        }else if(customer_email == ""){
            $("#b2bSendMailText_customer_edit_form").removeClass("is-invalid");
            $("#email_customer_edit_form").addClass("is-invalid");
        }else{
            $("#b2bSendMailText_customer_edit_form").removeClass("is-invalid");
            $("#email_customer_edit_form").removeClass("is-invalid");

            $.ajax({
                url: "ajaxFunctions.php",
                data: {values: 'sendB2bMail', mail_text: mail_text, email: customer_email},
                type: "POST", 
                success: function(output){
                    switch (output) {
                        case 'email_and_text_empty':
                            $("#b2bSendMailText_customer_edit_form").addClass("is-invalid");
                            $("#email_customer_edit_form").addClass("is-invalid");
                        break;

                        case 'text_empty':
                            $("#b2bSendMailText_customer_edit_form").addClass("is-invalid");
                            $("#email_customer_edit_form").removeClass("is-invalid");
                        break;
                        
                        case 'email_empty':
                            $("#b2bSendMailText_customer_edit_form").removeClass("is-invalid");
                            $("#email_customer_edit_form").addClass("is-invalid");
                        break;
                        
                        case 'send_success':
                            $("#b2bSendMailText_customer_edit_form").removeClass("is-invalid");
                            $("#email_customer_edit_form").removeClass("is-invalid");
                            $("b2bSentMessage_success").removeClass('d-none');
                            $("b2bSentMessage_fail").addClass('d-none');
                        break;
                    
                        default:
                            $("#b2bSendMailText_customer_edit_form").removeClass("is-invalid");
                            $("#email_customer_edit_form").removeClass("is-invalid");
                            $("b2bSentMessage_success").addClass('d-none');
                            $("b2bSentMessage_fail").removeClass('d-none');
                        break;
                    }
                }
            });
        }
    });

    /** EDIT CUSTOMER FORM - POINTS MODULE */
    $("#customer_add_points_submit").click(function() {
        var customer_id             = $("#add_points_customer_id").val();
        var points_to_add           = $("#customer_add_points_input").val();
        var current_points          = ($("#customer_total_points").length)? parseInt($("#customer_total_points").text()) : 0;
        var new_total_points        = parseInt(current_points) + parseInt(points_to_add);
        var current_manual_points   = ($("#customer_total_points_manual").length)? parseInt($("#customer_total_points_manual").text()) : 0;
        var new_manual_points       = parseInt(current_manual_points) + parseInt(points_to_add);

        $.ajax({
            url: "ajaxFunctions.php",
            data: {values: 'addCustomerPoints', customer_id: customer_id, points_to_add: points_to_add},
            type: "POST", 
            success: function(insert_result){	
                if( (insert_result == 1) && ($("#customer_total_points").length) && ($("#customer_total_points_manual").length) ){
                    $("#customer_total_points_manual").text(new_manual_points);
                    $("#customer_total_points").text(new_total_points);
                }else if(insert_result == 9){
                    alert(insert_result);
                }else{
                    location.reload();
                }
            }
        });
    });

});

function replaceUrlBrowser(urlToGo){
    // relace the hash in the browser
    var new_url = urlToGo;
    window.history.replaceState("data","Title",new_url);
    document.title=new_url;
}