$(document).ready(function() {

    // edit order status
    $(".editOrderStatus").click(function() {
        var status_id = $(this).attr('statusid');

        $.ajax({
            url: "ajaxFunctions.php",
            data: {values: 'prepareOrderStatusEditForm', status_id: status_id},
            type: "POST", 
            success: function(output){	
                var statusInfo = jQuery.parseJSON(output);

                // set the camefrom hidden fields as edit
                $("#modal_statusCameFrom").val("edit");

                // some hidden fields values to use in editOrderStatus function in post
                $("#modal_oldStatusName").val(statusInfo["status_name"]);

                // set the rest fields
                $("#modal_statusId").val(status_id);
                $("#modal_statusName").val(statusInfo["status_name"]);
                $("#modal_statusExtraInfo").val(statusInfo["status_extra_info"]);
                $('#modal_statusStockEffect option[value="'+statusInfo["status_stock_effect"]+'"]').prop('selected', true);
            }
        });
    });

    // add order status
    $("#addOrderStatus").click(function() {
        $("#modal_statusCameFrom").val("add");
    });

    // when the modal gets hidden reset its fields
    $('#addEditOrderStatusModal').on('hidden.bs.modal', function () {
        $("#modal_statusId").val("");
        $("#modal_statusCameFrom").val("");
        $("#modal_statusName").val("");
        $("#modal_oldStatusName").val("");
        $("#modal_statusExtraInfo").val("");
        $('#modal_statusStockEffect option[0]').prop('selected', true);
    });

    // delete order status
    $(".deleteOrderStatus").click(function() {
        if(confirm('ΠΡΟΣΟΧΗ! Είσαστε σίγουροι ότι θέλετε να προχωρήσετε το Status παραγγελίας;')) {
            var status_id       = $(this).attr('statusid');
            var buttonDelete    = this;
            var buttonDeleteObj = $(this);

            $.ajax({
                url: "ajaxFunctions.php",
                data: {values: 'deleteOrderStatus', status_id: status_id},
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

    // PRO Module: Custom order status -- transparency cancels color
    $(".setTransparent").click(function() {
        var transparentStatus = $(this).is(':checked');
        var transparentId     = $(this).attr('id').split("_");
        var loop_key          = transparentId[1];

        if(transparentStatus){
            $("#bg_color_"+loop_key).prop('disabled', true);
            $("#text_color_"+loop_key).prop('disabled', true);
        }else{
            $("#bg_color_"+loop_key).prop('disabled', false);
            $("#text_color_"+loop_key).prop('disabled', false);
        }
    });

});