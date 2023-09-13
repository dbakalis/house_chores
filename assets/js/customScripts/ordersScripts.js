$(document).ready(function() {

    // delete an order
    $(".deleteOrder").click(function() {
        if(confirm('Είσαστε σίγουροι ότι θέλετε να προχωρήσετε σε διαγραφή της παραγγελίας;')) {
            var cart_order_id   = $(this).attr('cartorderid');
            var order_is_old    = $(this).data('oldorder');
            var buttonDelete    = this;
            var buttonDeleteObj = $(this);

            $.ajax({
                url: "ajaxFunctions.php",
                data: {values: 'deleteOrder', cart_order_id: cart_order_id, order_is_old: order_is_old},
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

});
