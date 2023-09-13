$(document).ready(function() {

    /////////////////////// ORDER STATUS ///////////////////////

    // edit order status
    $(".editOrderCourier").click(function() {
        var courier_id = $(this).attr('courierid');

        $.ajax({
            url: "ajaxFunctions.php",
            data: {values: 'prepareOrderCourierEditForm', courier_id: courier_id},
            type: "POST", 
            success: function(output){	
                var courierInfo = jQuery.parseJSON(output);

                // set the camefrom hidden fields as edit
                $("#modal_courierCameFrom").val("edit");

                // some hidden fields values to use in editOrderCourier function in post
                $("#modal_oldCourierName").val(courierInfo["courier"]);

                // set the rest fields
                $("#modal_courierId").val(courier_id);
                $("#modal_courierName").val(courierInfo["courier"]);
            }
        });
    });

    // add order status
    $("#addOrderCourier").click(function() {
        $("#modal_courierCameFrom").val("add");
    });

    // when the modal gets hidden reset its fields
    $('#addEditOrderCourierModal').on('hidden.bs.modal', function () {
        $("#modal_courierId").val("");
        $("#modal_courierCameFrom").val("");
        $("#modal_courierName").val("");
        $("#modal_oldCourierName").val("");
    });

    // delete order status
    $(".deleteOrderCourier").click(function() {
        if(confirm('ΠΡΟΣΟΧΗ! Είσαστε σίγουροι ότι θέλετε να προχωρήσετε τη courier;')) {
            var courier_id      = $(this).attr('courierid');
            var buttonDelete    = this;
            var buttonDeleteObj = $(this);

            $.ajax({
                url: "ajaxFunctions.php",
                data: {values: 'deleteOrderCourier', courier_id: courier_id},
                type: "POST", 
                success: function(output){	
                    buttonDeleteObj.closest('tr').find('td').fadeOut('slow', 
                    function(buttonDelete){ 
                        $(buttonDelete).parents('tr:first').remove();                    
                    });
                }
            });
            
        }
    });


    /////////////////////// ORDERS ///////////////////////


});
