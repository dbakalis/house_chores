$(document).ready(function() {

    // on click of customers points list gear set and show the modal content
    $(".customerPointsHistory").click(function() {
        var customer_id = $(this).data('customerid');

        $.ajax({
            url: "ajaxFunctions.php",
            data: {values: 'getCustomerPointsHistory', customer_id: customer_id},
            type: "POST", 
            success: function(output){	
                $("#customer_points_modal_table").html(output);
            }
        });
    });

});
